var ServerMock = require("mock-http-server");
var plex = require(__dirname + '/../plex');
var plexCloud = require(__dirname + '/../plexcloud');
var ControllerPlexAmp = require(__dirname + '/../index');
var libQ = require('kew');
var CommandCoreMock = require(__dirname + '/../controllerMock');
var mockData = require('./mockData');
var resolve = require('path').resolve;

class Logger {
    info = (message) => {console.log(message);};
}

const testServerName = "TestServer";
const testServerPrivateIp = "10.255.42.35";
const testServerPublicIp = "192.168.32.65";
const testCloudServerName = "ec2-192-168-240-22";
const testCloudServerPrivateIp ="172.31.64.184";
const testCloudServerPublicIp = "192.168.240.22";
const myPlexUsername = "someuser@foo.com";

class Config {
    constructor() {
        this.map = {
            "token": "aaaabbbccccddd",
            "server": "localhost",
            "serverName": testServerName,
            "port": 9000,
            "protocol": "http",
            "library": "Music",
            "mediaserver": testServerName,
            "key": "7",
            "timeOut": 600,
            "local": "false",
            "recentAddedLimit": 50,
            "recentPlayedLimit": 30,
            "localPortMap": {
                "LOCAL_PORT_1": "9350",
                "LOCAL_PORT_2": "9351"
            }
        };
    }
    get = (key) => {
        return this.map[key];
    }
    set = (key, val) => {
        this.map[key] = val;
    }
    save = () => {
    }
}


class ContextMock {
    constructor(commandMock) {
        this.coreCommand = commandMock;
    }
}

class i18nJsonFailMock {
    constructor() {
        this.sharedVars = new (require('v-conf'))();
        this.sharedVars.set('language_code', 'en');
    }

    i18nJson(dictionaryFileName, defaultDictionaryFileName, jsonFileName) {
        var methodDefer = libQ.defer();

        methodDefer.reject("could not load file " + jsonFileName);

        return methodDefer.promise;
    }
}

const plexCloudParams = {
    identifier: '983-ADC-213-BGF-132',
    product: 'Volumio-PlexAmp',
    version: '1.0',
    deviceName: 'RaspberryPi',
    platform: 'Volumio'
};

var plex_cloud_addresses = [ "192.168.32.65", "172.31.64.184", "192.168.240.22" ];

describe('index.getuiuconfig.js tests', function () {

    describe("get ui config and update", function () {
        var server = new ServerMock({ host: 'localhost', port: 32401 });
        var localServer1 = new ServerMock({ host: 'localhost', port: 9350 });
        var localServer2 = new ServerMock({ host: 'localhost', port: 9351 });
        var logger = new Logger();
        var config = new Config();
        config.set('port', 32401);
        var plexBackend = new plex(logger, config);

        beforeAll(function(done) {
            server.start(() => {
                localServer1.start(() => {
                    localServer2.start(done);
                });
            });
        });

        afterAll(function(done) {
            server.stop(() => {
                localServer1.stop(() => {
                    localServer2.stop(done);
                });
            });
        });

        function plexTvServerSetup(myserver) {
            myserver
                .on(mockData.head_resp['401_success_xml_headers_no_body'](config))
                .on(mockData.get_resp['eval_auth_root'](config))
                .on(mockData.get_resp['eval_auth_pms_local_resources'](config))
                .on(mockData.post_resp['pins_xml'](config))
                .on(mockData.get_resp['pin_plex_token'](config));
        }

        function localServerSetup(myserver) {
            myserver
                .on(mockData.head_resp['eval_auth'](config))
                .on(mockData.get_resp['eval_auth_plex_library_sections'](config));
        }

        function localServerSetup2(myserver) {
            myserver
                .on(mockData.head_resp['eval_auth'](config))
                .on(mockData.get_resp['eval_auth_plex_library_sections2'](config));
        }

        test('update uiconfig', function(done) {
            plexTvServerSetup(server);
            localServerSetup(localServer1);
            localServerSetup2(localServer2);
            var coreCommand = new CommandCoreMock(logger);
            var context = new ContextMock(coreCommand);
            var controller = new ControllerPlexAmp(context);
            var myconfig = new Config();
            var myCloudParams = {
                server: 'localhost',
                protocol: 'http',
                port: '32401'
            };
            controller.plexCloudOptions = {
                ...controller.plexCloudOptions,
                ...myCloudParams
            };

            controller.config = myconfig;
            controller.logger = logger;
            controller.plex = new plex(logger, myconfig);

            myconfig.set('serverName', "AnotherServer");
            myconfig.set('server', "notLocalhost");
            myconfig.set('port', "32401");
            myconfig.set('library', 'video');

            controller.getUIConfig()
                .then(
                    (data) => {
                        var uiconfigPath = resolve(__dirname + '/../UIConfig.json');
                        expect(coreCommand.jsonDataExists(uiconfigPath)).toBeTruthy();
                        var configData = coreCommand.getJsonData(uiconfigPath);
                        var accountAuthSection = data.sections[0];
                        var optionsSection = data.sections[1];
                        var optionsSection2 = configData.sections[1];
                        var plexampSection = data.sections[2];

                        expect(accountAuthSection.content[0].value).toBeTruthy();
                        expect(optionsSection.content[0].hidden).toBeFalsy();
                        expect(optionsSection.content[2].hidden).toBeFalsy();
                        expect(optionsSection.content[3].hidden).toBeFalsy();
                        expect(optionsSection.content[0].value.value.name).toBe("TestServer");
                        expect(optionsSection2.content[0].value.value.name).toBe("TestServer");
                        expect(optionsSection.content[0].value.value.libraryTitle).toBe("Music");
                        expect(optionsSection2.content[0].value.value.libraryTitle).toBe("Music");
                        expect(optionsSection.content[4].hidden).toBeFalsy();
                        done();
                    },
                    (err) => {
                        done(err);
                    }
                );
        });

        test("uiconfig no token", function(done) {
            var coreCommand = new CommandCoreMock(logger);
            var context = new ContextMock(coreCommand);
            var controller = new ControllerPlexAmp(context);
            var myconfig = new Config();
            var myCloudParams = {
                server: 'localhost',
                protocol: 'http',
                port: '32401'
            };
            controller.plexCloudOptions = {
                ...controller.plexCloudOptions,
                ...myCloudParams
            };

            myconfig.set("token", "");

            controller.config = myconfig;
            controller.logger = logger;
            controller.plex = new plex(logger, myconfig);

            controller.getUIConfig()
                .then(
                    (data) => {
                        var accountAuthSection = data.sections[0];
                        expect(accountAuthSection.content[0].value).toBeFalsy();
                        done();
                    },
                    (err) => {
                        done(err);
                    }
                );
        });

        test("uiconfig connect get servers failure", function(done) {
            server
                .on(mockData.head_resp['401_success_xml_headers_no_body'](config))
                .on(mockData.get_resp['eval_auth_root'](config))
                .on(mockData.get_resp['pms_local_resources_500_failure'](config))
                .on(mockData.post_resp['pins_xml'](config))
                .on(mockData.get_resp['pin_plex_token'](config));
            localServerSetup(localServer1);
            localServerSetup2(localServer2);
            var coreCommand = new CommandCoreMock(logger);
            var context = new ContextMock(coreCommand);
            var controller = new ControllerPlexAmp(context);
            var myconfig = new Config();
            var myCloudParams = {
                server: 'localhost',
                protocol: 'http',
                port: '32401'
            };
            controller.plexCloudOptions = {
                ...controller.plexCloudOptions,
                ...myCloudParams
            };

            controller.config = myconfig;
            controller.logger = logger;
            controller.plex = new plex(logger, myconfig);

            controller.getUIConfig()
                .then(
                    (data) => {
                        var accountAuthSection = data.sections[0];
                        expect(accountAuthSection.content[0].value).toBeFalsy();
                        done();
                    },
                    (err) => {
                        done(err);
                    }
                );
        });

        test("uiconfig connect and no returned libraries", function(done) {
            plexTvServerSetup(server);
            localServer1
                .on(mockData.head_resp['eval_auth'](config))
                .on(mockData.get_resp['eval_auth_plex_no_libraries'](config));
            localServer2
                .on(mockData.head_resp['eval_auth'](config))
                .on(mockData.get_resp['eval_auth_plex_no_libraries'](config));
            var coreCommand = new CommandCoreMock(logger);
            var context = new ContextMock(coreCommand);
            var controller = new ControllerPlexAmp(context);
            var myconfig = new Config();
            var myCloudParams = {
                server: 'localhost',
                protocol: 'http',
                port: '32401'
            };
            controller.plexCloudOptions = {
                ...controller.plexCloudOptions,
                ...myCloudParams
            };

            controller.config = myconfig;
            controller.logger = logger;
            controller.plex = new plex(logger, myconfig);

            controller.getUIConfig()
                .then(
                    (data) => {
                        var accountAuthSection = data.sections[0];
                        expect(accountAuthSection.content[0].value).toBeFalsy();
                        done();
                    },
                    (err) => {
                        done(err);
                    }
                );
        });

        test("uiconfig no file load", function(done) {
            var coreCommand = new i18nJsonFailMock();
            var context = new ContextMock(coreCommand);
            var controller = new ControllerPlexAmp(context);
            var myconfig = new Config();
            var myCloudParams = {
                server: 'localhost',
                protocol: 'http',
                port: '32401'
            };
            controller.plexCloudOptions = {
                ...controller.plexCloudOptions,
                ...myCloudParams
            };

            controller.config = myconfig;
            controller.logger = logger;
            controller.plex = new plex(logger, myconfig);

            controller.getUIConfig()
                .then(
                    () => {
                        done("PlexAmp: i18njson succeeded when file load was made to fail");
                    },
                    (err) => {
                        var uiconfigPath = resolve(__dirname + '/../UIConfig.json');
                        expect(err).toBe("could not load file " + uiconfigPath);
                        done();
                    }
                );
        });

    });
});
