let auth_root_resp = `<?xml version="1.0" encoding="UTF-8"?>
<MediaContainer size="26" allowCameraUpload="1" allowChannelAccess="1" allowMediaDeletion="1" allowSharing="1" allowSync="1" allowTuners="1" backgroundProcessing="1" certificate="1" companionProxy="1" countryCode="usa" diagnostics="logs,databases,streaminglogs" eventStream="1" friendlyName="TestServer" hubSearch="1" itemClusters="1" livetv="7" machineIdentifier="c3ecfbed9b2467ce3c7dbb1c8f57cbd57cd8785f" mediaProviders="1" multiuser="1" myPlex="1" myPlexMappingState="mapped" myPlexSigninState="ok" myPlexSubscription="0" myPlexUsername="someuser@foo.com" offlineTranscode="1" ownerFeatures="044a1fac-6b55-4d09-9933-25a035709432,federated-auth,home,kevin-bacon,livetv,loudness,radio,server-manager,shared-radio,tuner-sharing,type-first,unsupportedtuners" photoAutoTag="1" platform="FreeBSD" platformVersion="12.2-RELEASE-p7" pluginHost="1" pushNotifications="0" readOnlyLibraries="0" streamingBrainABRVersion="3" streamingBrainVersion="2" sync="1" transcoderActiveVideoSessions="0" transcoderAudio="1" transcoderLyrics="1" transcoderPhoto="1" transcoderSubtitles="1" transcoderVideo="1" transcoderVideoBitrates="64,96,208,320,720,1500,2000,3000,4000,8000,10000,12000,20000" transcoderVideoQualities="0,1,2,3,4,5,6,7,8,9,10,11,12" transcoderVideoResolutions="128,128,160,240,320,480" updatedAt="1684955612" updater="1" version="1.24.3.5033-757abe6b4" voiceSearch="1">
<Directory count="1" key="actions" title="actions" />
<Directory count="1" key="activities" title="activities" />
<Directory count="1" key="butler" title="butler" />
<Directory count="1" key="channels" title="channels" />
<Directory count="1" key="clients" title="clients" />
<Directory count="1" key="devices" title="devices" />
<Directory count="1" key="diagnostics" title="diagnostics" />
<Directory count="1" key="hubs" title="hubs" />
<Directory count="3" key="library" title="library" />
<Directory count="3" key="livetv" title="livetv" />
<Directory count="3" key="media" title="media" />
<Directory count="3" key="metadata" title="metadata" />
<Directory count="1" key="music" title="music" />
<Directory count="1" key="neighborhood" title="neighborhood" />
<Directory count="1" key="playQueues" title="playQueues" />
<Directory count="1" key="player" title="player" />
<Directory count="1" key="playlists" title="playlists" />
<Directory count="1" key="resources" title="resources" />
<Directory count="1" key="search" title="search" />
<Directory count="1" key="server" title="server" />
<Directory count="1" key="servers" title="servers" />
<Directory count="1" key="statistics" title="statistics" />
<Directory count="1" key="system" title="system" />
<Directory count="1" key="transcode" title="transcode" />
<Directory count="1" key="updater" title="updater" />
<Directory count="1" key="user" title="user" />
</MediaContainer>`;

let non_auth_root_resp = `<html><head><script>window.location = window.location.href.match(/(^.+\/)[^\/]*$/)[1] + 'web/index.html';</script><title>Unauthorized</title></head><body><h1>401 Unauthorized</h1></body></html>
`;
let non_auth_api_resp = `<html><head><title>Unauthorized</title></head><body><h1>401 Unauthorized</h1></body></html>`;

let plex_cloud_resources = `<?xml version="1.0" encoding="UTF-8"?>
<MediaContainer size="3">
  <Device name="TestServer" product="Plex Media Server" productVersion="1.24.3.5033-757abe6b4" platform="FreeBSD" platformVersion="12.2-RELEASE-p7" device="PC" clientIdentifier="c3ecfbec6b2467ce3c7abc102357cbd57cd8785f" createdAt="1532837371" lastSeenAt="1685517219" provides="server" owned="1" accessToken="aaaabbbccccddd" publicAddress="192.168.32.65" httpsRequired="0" synced="0" relay="0" dnsRebindingProtection="0" natLoopbackSupported="0" publicAddressMatches="1" presence="1">
    <Connection protocol="http" address="192.168.32.65" port="32400" uri="http://192.168.32.65:32400" local="1"/>
  </Device>
  <Device name="ec2-192-168-240-22" product="Plex Media Server" productVersion="1.32.1.6999-91e1e2e2c" platform="Linux" platformVersion="6.1.19-30.43.amzn2023.x86_64" device="Docker Container (LinuxServer.io)" clientIdentifier="ce06903388fb95d8895501533558c69513b3bd64" createdAt="1684187144" lastSeenAt="1685526357" provides="server" owned="1" accessToken="aaaabbbccccddd" publicAddress="192.168.240.22" httpsRequired="0" synced="0" relay="1" dnsRebindingProtection="0" natLoopbackSupported="0" publicAddressMatches="0" presence="1">
    <Connection protocol="http" address="172.31.64.184" port="32400" uri="http://172.31.64.184:32400" local="1"/>
    <Connection protocol="http" address="192.168.240.22" port="32400" uri="http://192.168.240.22:32400" local="0"/>
  </Device>
  <Device name="SomebodysMBP.foo.com" product="Plex for Mac" productVersion="1.68.2.3746-7601b337" platform="macos" platformVersion="12.5" device="" clientIdentifier="c4yjok8ysummhpsqqygt6e1i" createdAt="1598980843" lastSeenAt="1685530952" provides="client,player,pubsub-player" owned="1" publicAddress="192.168.35.23" publicAddressMatches="1" presence="1">
  </Device>
</MediaContainer>`;

let plex_local_resources = `<?xml version="1.0" encoding="UTF-8"?>
<MediaContainer size="3">
  <Device name="TestServer" product="Plex Media Server" productVersion="1.24.3.5033-757abe6b4" platform="FreeBSD" platformVersion="12.2-RELEASE-p7" device="PC" clientIdentifier="c3ecfbec6b2467ce3c7abc102357cbd57cd8785f" createdAt="1532837371" lastSeenAt="1685517219" provides="server" owned="1" accessToken="aaaabbbccccddd" publicAddress="127.0.0.1" httpsRequired="0" synced="0" relay="0" dnsRebindingProtection="0" natLoopbackSupported="0" publicAddressMatches="1" presence="1">
    <Connection protocol="http" address="127.0.0.1" port="9300" uri="http://127.0.0.1:9300" local="1"/>
  </Device>
  <Device name="ec2-192-168-240-22" product="Plex Media Server" productVersion="1.32.1.6999-91e1e2e2c" platform="Linux" platformVersion="6.1.19-30.43.amzn2023.x86_64" device="Docker Container (LinuxServer.io)" clientIdentifier="ce06903388fb95d8895501533558c69513b3bd64" createdAt="1684187144" lastSeenAt="1685526357" provides="server" owned="1" accessToken="aaaabbbccccddd" publicAddress="127.0.0.2" httpsRequired="0" synced="0" relay="1" dnsRebindingProtection="0" natLoopbackSupported="0" publicAddressMatches="0" presence="1">
    <Connection protocol="http" address="127.0.0.1" port="9301" uri="http://127.0.0.1:9301" local="0"/>
    <Connection protocol="http" address="240.0.0.0" port="32400" uri="http://240.0.0.0:32400" local="1"/>
  </Device>
  <Device name="SomebodysMBP.foo.com" product="Plex for Mac" productVersion="1.68.2.3746-7601b337" platform="macos" platformVersion="12.5" device="" clientIdentifier="c4yjok8ysummhpsqqygt6e1i" createdAt="1598980843" lastSeenAt="1685530952" provides="client,player,pubsub-player" owned="1" publicAddress="192.168.35.23" publicAddressMatches="1" presence="1">
  </Device>
</MediaContainer>`;

let plex_local_resources_no_local_server = `<?xml version="1.0" encoding="UTF-8"?>
<MediaContainer size="3">
  <Device name="TestServer" product="Plex Media Server" productVersion="1.24.3.5033-757abe6b4" platform="FreeBSD" platformVersion="12.2-RELEASE-p7" device="PC" clientIdentifier="c3ecfbec6b2467ce3c7abc102357cbd57cd8785f" createdAt="1532837371" lastSeenAt="1685517219" provides="server" owned="1" accessToken="aaaabbbccccddd" publicAddress="240.0.0.0" httpsRequired="0" synced="0" relay="0" dnsRebindingProtection="0" natLoopbackSupported="0" publicAddressMatches="1" presence="1">
    <Connection protocol="http" address="240.0.0.0" port="9300" uri="http://240.0.0.0:9300" local="1"/>
  </Device>
  <Device name="ec2-192-168-240-22" product="Plex Media Server" productVersion="1.32.1.6999-91e1e2e2c" platform="Linux" platformVersion="6.1.19-30.43.amzn2023.x86_64" device="Docker Container (LinuxServer.io)" clientIdentifier="ce06903388fb95d8895501533558c69513b3bd64" createdAt="1684187144" lastSeenAt="1685526357" provides="server" owned="1" accessToken="aaaabbbccccddd" publicAddress="127.0.0.2" httpsRequired="0" synced="0" relay="1" dnsRebindingProtection="0" natLoopbackSupported="0" publicAddressMatches="0" presence="1">
    <Connection protocol="http" address="240.0.0.0" port="9301" uri="http://240.0.0.0:9301" local="0"/>
    <Connection protocol="http" address="240.0.0.0" port="32400" uri="http://240.0.0.0:32400" local="1"/>
  </Device>
  <Device name="SomebodysMBP.foo.com" product="Plex for Mac" productVersion="1.68.2.3746-7601b337" platform="macos" platformVersion="12.5" device="" clientIdentifier="c4yjok8ysummhpsqqygt6e1i" createdAt="1598980843" lastSeenAt="1685530952" provides="client,player,pubsub-player" owned="1" publicAddress="192.168.35.23" publicAddressMatches="1" presence="1">
  </Device>
</MediaContainer>`;

let plex_library_sections1 = `{"MediaContainer":{"size":3,"allowSync":false,"identifier":"com.plexapp.plugins.library","mediaTagPrefix":"/system/bundle/media/flags/","mediaTagVersion":1631637782,"title1":"Plex Library","Directory":[{"allowSync":true,"art":"/:/resources/artist-fanart.jpg","composite":"/library/sections/7/composite/1684614656","filters":true,"refreshing":false,"thumb":"/:/resources/artist.png","key":"7","type":"artist","title":"Music","agent":"com.plexapp.agents.lastfm","scanner":"Plex Music Scanner","language":"en","uuid":"98b22397-62fd-4a4b-ab8f-d2597292c0d7","updatedAt":1575005040,"createdAt":1533149989,"scannedAt":1684614656,"content":true,"directory":true,"contentChangedAt":2237080,"hidden":0,"Location":[{"id":7,"path":"/data/tunes/Musicapp Music"}]},{"allowSync":true,"art":"/:/resources/artist-fanart.jpg","composite":"/library/sections/8/composite/1618873658","filters":true,"refreshing":false,"thumb":"/:/resources/artist.png","key":"8","type":"artist","title":"Jane's Music","agent":"com.plexapp.agents.lastfm","scanner":"Plex Music Scanner","language":"en","uuid":"a4828b34-5bb2-458e-a917-45719350d47c","updatedAt":1536446887,"createdAt":1536446197,"scannedAt":1618873658,"content":true,"directory":true,"contentChangedAt":1662751,"hidden":0,"Location":[{"id":8,"path":"/data/tunes/Jane Musicapp Music/Music"}]},{"allowSync":true,"art":"/:/resources/movie-fanart.jpg","composite":"/library/sections/1/composite/1659628748","filters":true,"refreshing":false,"thumb":"/:/resources/video.png","key":"1","type":"movie","title":"Home Videos","agent":"com.plexapp.agents.none","scanner":"Plex Video Files Scanner","language":"xn","uuid":"8751cb20-b403-4432-a57b-a58dd44258e5","updatedAt":1532835551,"createdAt":1532828996,"scannedAt":1659628748,"content":true,"directory":true,"contentChangedAt":1951561,"hidden":0,"Location":[{"id":1,"path":"/data/itunes/Archive"}]}]}}`;

let plex_library_sections2 = `{"MediaContainer":{"size":1,"allowSync":false,"title1":"Plex Library","Directory":[{"allowSync":true,"art":"/:/resources/artist-fanart.jpg","composite":"/library/sections/1/composite/1684623061","filters":true,"refreshing":false,"thumb":"/:/resources/artist.png","key":"1","type":"artist","title":"Music","agent":"tv.plex.agents.music","scanner":"Plex Music","language":"en","uuid":"0c9f4e99-2507-406c-822c-17df3e6662a6","updatedAt":1684622714,"createdAt":1684622714,"scannedAt":1684623061,"content":true,"directory":true,"contentChangedAt":48,"hidden":0,"Location":[{"id":1,"path":"/data/music"}]}]}}`;

var empty_json_struct = "{}";

let plex_pin_resp = `<?xml version="1.0" encoding="UTF-8"?>
<pin>
  <id type="integer">1247635939</id>
  <code>35PN</code>
  <expires-at type="dateTime">2023-05-29T22:19:07Z</expires-at>
  <user-id type="integer" nil="true"/>
  <client-identifier>983-ADC-213-BGF-132</client-identifier>
  <trusted type="boolean">false</trusted>
  <auth-token nil="true"/>
  <auth_token nil="true"></auth_token>
 </pin>`;

let plex_token_resp = `<?xml version="1.0" encoding="UTF-8"?>
<pin>
  <expires-at type="dateTime">2099-05-29T23:46:37Z</expires-at>
  <id type="integer">1247635939</id>
  <code>35PN</code>
  <user-id type="integer">324195670</user-id>
  <client-identifier>983-ADC-213-BGF-132</client-identifier>
  <trusted type="boolean">false</trusted>
  <auth-token>aaaabbbccccddd</auth-token>
</pin>`;

let plex_timed_out_token_resp = `<?xml version="1.0" encoding="UTF-8"?>
<pin>
  <expires-at type="dateTime">2000-05-29T23:46:37Z</expires-at>
  <id type="integer">1247635939</id>
  <code>35PN</code>
  <user-id type="integer">324195670</user-id>
  <client-identifier>983-ADC-213-BGF-132</client-identifier>
  <trusted type="boolean">false</trusted>
  <auth-token nil="true"></auth-token>
</pin>`;

const xml_headers = {
    "x-plex-protocol": "1.0",
    "content-type": "text/xml;charset=utf-8",
    "content-length": "0",
    "connection": "Keep-Alive",
    "keep-alive": "timeout=20",
    "cache-control": "no-cache",
    "date": ""
};

const xml_headers2 = {
    'cache-control': 'max-age=0, private, must-revalidate',
    'content-type': 'application/xml; charset=utf-8',
    'date': "",
    'etag': 'W/"176052ccd95c0d48f4049886cd50c3ba"',
    'location': 'https://plex.tv/pins/1869831837',
    'referrer-policy': 'origin-when-cross-origin',
    'strict-transport-security': 'max-age=31536000; includeSubDomains; preload',
    'vary': 'Origin',
    'x-content-type-options': 'nosniff',
    'x-frame-options': 'SAMEORIGIN',
    'x-request-id': '3be32ce1-f363-4d4e-ad17-1bd2339bff4b',
    'x-runtime': '0.019094',
    'x-xss-protection': '1; mode=block'
}

const html_headers = {
    "x-plex-protocol":"1.0",
    "content-length":"0",
    "content-type":"text/html",
    "connection":"close",
    "cache-control":"no-cache",
    "date": ""
};

const json_headers = {
    "x-plex-protocol": "1.0",
    "content-type": "application/json",
    "content-length": "0",
    "connection": "Keep-Alive",
    "keep-alive": "timeout=20",
    "cache-control": "no-cache",
    "date": ""
}

const status_msg_200 = {
    status: 200,
    headers: xml_headers,
    body: ""
};

const status_msg_401 = {
    status: 401,
    headers: html_headers,
    body: ""
};

const status_msg_500 = {
    status: 500,
    headers: html_headers,
    body: ""
};

function eval_auth(req, token) {
    var parsedHeaders = {};
    for (var i = 0; i < req.rawHeaders.length; i += 2) { parsedHeaders[req.rawHeaders[i].toLowerCase()] = req.rawHeaders[i+1]; }
    return (parsedHeaders['x-plex-token'] == token);
}


const head_resp = {

    '401_success': function(config) {
        return {
            method: 'HEAD',
            path: '/',
            reply: status_msg_401
        };
    },

    '500_failure': function(config) {
        return {
            method: 'HEAD',
            path: '/',
            reply: status_msg_500
        };
    },

    '401_success_xml_headers_no_body': function(config) {
        return {
            method: 'HEAD',
            path: '/',
            reply: {
                status: 401,
                headers: xml_headers,
                body: ""
            }
        };
    },

    'eval_auth': function(config) {
        return {
            method: 'HEAD',
            path: '/',
            reply: {
                status: function(req) {
                    return eval_auth(req, config.get('token')) ? 200 : 401;
                },
                headers: xml_headers,
                body: ""
            }
        };
    }
};

const get_resp = {

    'eval_auth_pms_cloud_resources': function(config) {
        return {
            method: "GET",
            path: "/pms/resources",
            reply: {
                status: function(req) {
                    return  eval_auth(req, config.get('token')) ? 200 : 401;
                },
                headers: xml_headers,
                body: function(req) {
                    return eval_auth(req, config.get('token')) ? plex_cloud_resources : non_auth_root_resp;
                }
            }
        };
    },

    'eval_auth_pms_local_resources': function(config) {
        return {
            method: "GET",
            path: "/pms/resources",
            reply: {
                status: function(req) {
                    return  eval_auth(req, config.get('token')) ? 200 : 401;
                },
                headers: xml_headers,
                body: function(req) {
                    return eval_auth(req, config.get('token')) ? plex_local_resources : non_auth_root_resp;
                }
            }
        };
    },

    'eval_auth_pms_local_resources_no_local_server': function(config) {
        return {
            method: "GET",
            path: "/pms/resources",
            reply: {
                status: function(req) {
                    return  eval_auth(req, config.get('token')) ? 200 : 401;
                },
                headers: xml_headers,
                body: function(req) {
                    return eval_auth(req, config.get('token')) ? plex_local_resources_no_local_server : non_auth_root_resp;
                }
            }
        };
    },

    'pms_local_resources_500_failure': function(config) {
        return {
            method: "GET",
            path: "/pms/resources",
            reply: {
                status: 500,
                headers: html_headers,
                body: "<html><h1>Server Failure</h1></html>"
            }
        };
    },

    'eval_auth_root': function(config) {
        return {
            method: 'GET',
            path: '/',
            reply: {
                status: function(req) {
                    return eval_auth(req, config.get('token')) ? 200 : 401;
                },
                headers: xml_headers,
                body: function(req) {
                    return eval_auth(req, config.get('token')) ? auth_root_resp: non_auth_root_resp;
                }
            }
        };
    },

    'eval_auth_plex_library_sections': function(config) {
        return {
            method: 'GET',
            path: '/library/sections/',
            reply: {
                status: function(req) {
                    return eval_auth(req, config.get('token')) ? 200 : 401;
                },
                headers: json_headers,
                body: function(req) {
                    return eval_auth(req, config.get('token')) ? plex_library_sections1 : non_auth_api_resp;
                }
            }
        };
    },

    'eval_auth_plex_library_sections2': function(config) {
        return {
            method: 'GET',
            path: '/library/sections/',
            reply: {
                status: function(req) {
                    return eval_auth(req, config.get('token')) ? 200 : 401;
                },
                headers: json_headers,
                body: function(req) {
                    return eval_auth(req, config.get('token')) ? plex_library_sections2 : non_auth_api_resp;
                }
            }
        };
    },

    'eval_auth_plex_no_libraries': function(config) {
        return {
            method: 'GET',
            path: '/library/sections/',
            reply: {
                status: function(req) {
                    return eval_auth(req, config.get('token')) ? 200 : 401;
                },
                headers: json_headers,
                body: function(req) {
                    return eval_auth(req, config.get('token')) ? empty_json_struct : non_auth_api_resp;
                }
            }
        };
    },

    'pin_plex_token': function(config) {
        return {
            method: "GET",
            path: '/pins/1247635939.xml',
            reply: {
                status: 200,
                headers: xml_headers2,
                body: plex_token_resp
            }
        };
    },

    'pin_plex_token_delay_2s': function(config) {
        return {
            method: "GET",
            path: '/pins/1247635939.xml',
            reply: {
                status: 200,
                headers: xml_headers2,
                body: plex_token_resp
            },
            delay: 2000
        };
    },

    'pin_plex_timed_out_token': function(config) {
        return {
            method: "GET",
            path: '/pins/1247635939.xml',
            reply: {
                status: 200,
                headers: xml_headers2,
                body: plex_timed_out_token_resp
            }
        };
    },

    'pin_plex_broken_format_token': function(config) {
        return {
            method: "GET",
            path: '/pins/1247635939.xml',
            reply: {
                status: 200,
                headers: xml_headers2,
                body: '[{ this: "is", a: "json"}, { a: "b", c: "d" }]'
            }
        };
    },

    'pin_plex_server_error': function(config) {
        return {
            method: "GET",
            path: '/pins/1247635939.xml',
            reply: {
                status: 500,
                headers: xml_headers2,
                body: "<pin></pin>"
            }
        };
    }
};

const post_resp = {

    'pins_xml': function(config) {
        return {
            method: "POST",
            path: "/pins.xml",
            reply: {
                status: 201,
                headers: xml_headers2,
                body: plex_pin_resp
            }
        };
    }
};

exports.head_resp = head_resp;
exports.get_resp = get_resp;
exports.post_resp = post_resp;
