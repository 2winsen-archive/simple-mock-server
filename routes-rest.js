const responsesRest = require('./responses/responses-rest');
const { clone } = require('./utils');

const REST_PATH = '/rest'

const respond = (req, res) => res.json(responsesRest[req.path]);
const respondWithError = (req, res) => res.status(400).send({ error: 'This is an error!' });

module.exports = app => {
    app.get(`${REST_PATH}/getItems`, respond);
};