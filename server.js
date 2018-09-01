const express = require('express');
const http = require('http');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const routesKeycloakSso = require('./routes-keycloak-sso');
const routesRest = require('./routes-rest');
const routesWs = require('./routes-ws');
const allowCrossDomain = require('./allow-cross-domain');

const PORT = 9999;

var app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(methodOverride());
app.use(allowCrossDomain);
routesKeycloakSso(app);
routesRest(app);
const server = http.createServer(app);
routesWs(server);

server.listen(PORT);
console.log(`Listening on port ${PORT} ...`);