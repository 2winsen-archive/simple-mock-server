const url = require('url');
const KEYCLOAK_PROJECT_NAME = '';
let nonces = {};

module.exports = app => {
    app.get('/', function (req, res) {
        res.sendfile(__dirname + '/index.html');
    });

    app.get(`/auth/realms/${KEYCLOAK_PROJECT_NAME}/protocol/openid-connect/auth`, function (req, res) {
        const queryData = url.parse(req.url, true).query;
        nonces[req.cookies.AUTH_SESSION_ID] = queryData.nonce;
        res.redirect(`${req.headers.referer}#state=${queryData.state}&code=uss.anything.anything.anything`);
    });

    app.post(`/auth/realms/${KEYCLOAK_PROJECT_NAME}/protocol/openid-connect/token`, function (req, res) {
        const nonce = nonces[req.cookies.AUTH_SESSION_ID];
        const nonceBase64 = new Buffer(JSON.stringify({ nonce: nonce })).toString('base64');
        delete nonces[req.cookies.AUTH_SESSION_ID];
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Expose-Headers', 'Access-Control-Allow-Methods');
        res.json({
            "access_token": `anything.${nonceBase64}.anything`,
            "refresh_token": `anything.${nonceBase64}.anything`
        });
    });

    app.get(`/auth/realms/${KEYCLOAK_PROJECT_NAME}/protocol/openid-connect/login-status-iframe.html`, function (req, res) {
        // Lazy to investigate keycloak depths: this timeout fixes random loading issues
        setTimeout(() => {
            res.sendFile(__dirname + '/mock-keycloak-login-status-iframe.html');
        }, 200);
    });

    app.get(`/auth/realms/${KEYCLOAK_PROJECT_NAME}/account`, function (req, res) {
        res.json({
            "id": "id1",
            "createdTimestamp": 1508832639813,
            "username": "user1",
            "enabled": true,
            "totp": false,
            "emailVerified": false,
            "firstName": "Bob",
            "lastName": "B",
            "federationLink": "anything",
            "attributes": {
                "LDAP_ENTRY_DN": ["cn=user1,ou=people,dc=com"],
                "LDAP_ID": ["ldap-id1"],
                "modifyTimestamp": ["20171023130640Z"],
                "createTimestamp": ["20171023130640Z"]
            },
            "disableableCredentialTypes": [],
            "requiredActions": []
        });
    });

    app.post('/rest/login', function (req, res) {
        res.json({});
    });
};