const libQ = require('kew');
var fs = require('fs-extra');

class CommandCoreMock {
    constructor(logger) {
        this.logger = logger;
        this.sharedVars = new (require('v-conf'))();
        this.sharedVars.set('language_code', 'en');
    }
}

CommandCoreMock.prototype.updateLanguageCode = function(lang) {
    this.sharedVars.set('language_code', lang);
};

CommandCoreMock.prototype.broadcastMessage = function(string, data) {
    var self = this;
    self.logger.info("broadcastMessage: " + string + " " + JSON.stringify(data));
};

CommandCoreMock.prototype.volumioAddToBrowseSources = function(data) {
    var self = this;
    self.logger.info("volumioAddToBrowseSources: " + JSON.stringify(data));
};

CommandCoreMock.prototype.getUIConfigOnPlugin = function(service, plugin, data) {
    var self = this;
    var defer = libQ.defer();

    self.logger.info("getUIConfigONPlugin: " + service + " " + plugin + " " + JSON.stringify(data));

    defer.resolve({ ui: 'config', member1: 'this', member2: 'that' });

    return defer.promise;
};

CommandCoreMock.prototype.getI18nString = function(key) {

    var data = {
        'PLEX_PIN_PREFIX': "Your Plex PIN : ",
        'PLEX_PIN_DETAILS': "Note: copy this to the clipboard so you can use it in the next step"
    };

    return data[key];
};

CommandCoreMock.prototype.closeModals = function() {
    var self = this;
    self.logger.info("closeModals: ");
};

// copied from volumio index.js (with minor changes)
CommandCoreMock.prototype.i18nTranslate = function(parent, dictionary, defaultDictionary) {
    var self = this;

    try {
        var keys = Object.keys(parent);

        for (var i in keys) {
            var obj = parent[keys[i]];
            var type = typeof (obj);

            if (type === 'object') {
                self.i18nTranslate(obj, dictionary, defaultDictionary);
            } else if (type === 'string') {
                if (obj.startsWith('TRANSLATE.')) {
                    var replaceKey = obj.slice(10);

                    var dotIndex = replaceKey.indexOf('.');

                    if (dotIndex == -1) {
                        var value = dictionary[replaceKey];
                        if (value === undefined) {
                            value = defaultDictionary[replaceKey];
                        }
                        parent[keys[i]] = value;
                    } else {
                        var category = replaceKey.slice(0, dotIndex);
                        var key = replaceKey.slice(dotIndex + 1);

                        if (dictionary[category] === undefined || dictionary[category][key] === undefined) {
                            var value = defaultDictionary[category][key];
                        } else {
                            var value = dictionary[category][key];
                            if (value === '') {
                                value = defaultDictionary[category][key];
                            }
                        }
                        parent[keys[i]] = value;
                    }
                }
            }
        }
    } catch (e) {
        self.logger.info('Cannot translate keys: ' + e);
    }
};

CommandCoreMock.prototype.test = function(string) {
    var self = this;
    self.logger.info("THIS IS A TEST!!! " + string);
}

// copied from volumio index.js
CommandCoreMock.prototype.i18nJson = function (dictionaryFile, defaultDictionaryFile, jsonFile) {
    var self = this;
    var methodDefer = libQ.defer();
    var defers = [];

    try {
        fs.readJsonSync(dictionaryFile);
    } catch (e) {
        dictionaryFile = defaultDictionaryFile;
    }

    defers.push(libQ.nfcall(fs.readJson, dictionaryFile));
    defers.push(libQ.nfcall(fs.readJson, defaultDictionaryFile));
    defers.push(libQ.nfcall(fs.readJson, jsonFile));

    libQ.all(defers)
        .then(function (documents) {
            var dictionary = documents[0];
            var defaultDictionary = documents[1];
            var jsonFile = documents[2];

            self.i18nTranslate(jsonFile, dictionary, defaultDictionary);

            methodDefer.resolve(jsonFile);
        })
        .fail(function (err) {
            methodDefer.reject(new Error());
        });

    return methodDefer.promise;
};

module.exports = CommandCoreMock;

