const sockjs = require('sockjs');
const Stomp = require('stompjs');

const responsesWs = require('./responses/responses-ws');
const randomNumberSimulator = require('./simulators/random-number.simulator');
const { createStompMessage } = require('./utils');

const subscriptions = {};

const startSimulators = wsConnection => {
    randomNumberSimulator.start(wsConnection, subscriptions);
}

const dataHandler = message => {
    const unmarshalledMessage = Stomp.Frame.unmarshall(message);
    unmarshalledMessage.forEach(frame => {
        switch (frame.command) {
            case 'CONNECT':
                connection.write(connection.write('CONNECTED\nversion:1.1\nheart-beat:0,0\nuser-name:c2792e4b-b7f9-4a15-954f-d59633e4a4ff\n\n\u0000'));
                break;
            case 'SUBSCRIBE':
            case 'SEND':
                if (responsesWs[frame.headers.destination]) {
                    subscriptions[frame.headers.destination] = frame.headers.id;
                    responsesWs[frame.headers.destination].forEach(body =>
                        connection.write(createStompMessage(frame.headers.destination, frame.headers.id, body)));
                }
                break;
            default:
                break;
        }
    });
}

module.exports = server => {
    const sockJsServer = sockjs.createServer({ sockjs_url: 'sockjs.min.js' });
    sockJsServer.installHandlers(server, { prefix: '/hello' });

    sockJsServer.on('connection', function (wsConnection) {
        startSimulators(wsConnection);
        wsConnection.on('data', dataHandler);
        wsConnection.on('close', function () { });
    });
};