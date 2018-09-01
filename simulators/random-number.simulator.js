const uuidv1 = require('uuid/v1');
const Stomp = require('stompjs');
const { clone, random, createStompMessage } = require('../utils');
const responsesWs = require('../responses/responses-ws');

const RANDOM_NUMBER_TOPIC = '/ws/randomNumber';
const UPDATE_FREQUENCY = 3000;

module.exports = {
  start: (wsConnection, subscriptions) =>
    setInterval(() => {
      if (subscriptions[RANDOM_NUMBER_TOPIC]) {
        responsesWs[RANDOM_NUMBER_TOPIC].forEach(body => {
          let bodyClone = clone(body);
          bodyClone.randomNumber = random(1, 100);
          wsConnection.write(createStompMessage(RANDOM_NUMBER_TOPIC, subscriptions[RANDOM_NUMBER_TOPIC], bodyClone));
        });
      }
    }, UPDATE_FREQUENCY),

  stop: (interval) => clearInterval(interval)
}