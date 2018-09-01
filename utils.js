const uuidv1 = require('uuid/v1');
const Stomp = require('stompjs');

module.exports = {
  clone: obj => JSON.parse(JSON.stringify(obj)),
  
  random: (from, to) => (Math.random() * (to - from) + from).toFixed(2),

  createStompMessage: (topic, subscriptionId, body) => {
    const headers = {
      'destination': topic,
      'content-type': 'application/json;charset=UTF-8',
      'subscription': subscriptionId,
      'message-id': `message-${uuidv1()}`
    };    
    return Stomp.Frame.marshall('MESSAGE', headers, JSON.stringify(body))
  }
}