
import ws281x from 'rpi-ws281x';
import mqtt from 'mqtt';
import express from 'express';

import { ApolloServer, gql } from 'apollo-server-express';
import _ from 'lodash';


import Controller from './Controller';

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`

  schema {
    # The query types are omitted so we can focus on the mutations!
    mutation: Mutation
    query: Query
  }

  type Mutation {
    setMqttConfig(input: MqttConfig!): SimpleResult
  }

  input MqttConfig {
    name: String
    schema: String
    state_topic: String
    command_topic: String
    brightness: Boolean
    brightness_scale: Int
    hs: Boolean
    rgb: Boolean
  }

  type SimpleResult {
    error: Boolean
    message: String
  }  

  type MqttConfigPayload {
    name: String
    schema: String
    state_topic: String
    command_topic: String
    brightness: Boolean
    brightness_scale: Int
    hs: Boolean
    rgb: Boolean
  }

  type Query {
    mqttConfig: MqttConfigPayload
  }
`;

let configuredDevice = null;


// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    mqttConfig: () => configuredDevice,
  },
  Mutation: {
    setMqttConfig: (a, b) => {  console.log(a,b); return { error: false, message: '' }; }
  }
};


// var ws281x = {
//   configure: () => {},
//   render: () => {}
// }

const mqttBroker = 'mqtt://192.168.0.100';

const config = {
  prefix: 'homeassistant',
  deviceType: 'light',
  name: 'backsplash',
};
const device = 'backsplash';

let state = {
  state: 'OFF',
  brightness: 255,
  color: {
    r: 255,
    g: 255,
    b: 255,
  }
};


const controller = new Controller(ws281x);
// console.log(controller);
controller.run('OFF');
 
// var example = new Example();
// example.run('on');
console.log('Started');

const client = mqtt.connect(mqttBroker, {});
client.on('message', (topic, payload) => {  
  const topics = {};
  ({ 0: topics.prefix, 1: topics.deviceType, 2: topics.name, 3: topics.property } = topic.split('/'));
  if (!_.isMatch(topics, config)) { 
    // Return if the message is not for us
    return;
  }

  let command = JSON.parse(payload);
  console.log(topic, command);

  if (topics.property === 'config') {
    configuredDevice = command;
  } else if (topics.property === 'set') {

    state = Object.assign({}, state, command);

    controller.state(state);

    client.publish(`${config.prefix}/${config.deviceType}/${config.name}/state`, JSON.stringify(state), {
      retain: true
    });

  }


  

  // console.log(_.isMatch(topics, config));
  // console.log(topic, String(payload));
  // let command = String(payload)
  // if (topic !== `homeassistant/${config.deviceType} ${device}/switch`) {
  //   return;
  // }
  
});

client.on('connect', function () {
  client.subscribe(`homeassistant/${device}/switch`);
  client.subscribe(`${config.prefix}/${config.deviceType}/${config.name}/config`);
  client.subscribe(`${config.prefix}/${config.deviceType}/${config.name}/state`);
  client.subscribe(`${config.prefix}/${config.deviceType}/${config.name}/set`);
  // client.subscribe(`${config.prefix}/${config.deviceType}/${config.name}/config`);
});

const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
server.applyMiddleware({ app });
app.use(express.static('public'))
 
app.listen(3001)
