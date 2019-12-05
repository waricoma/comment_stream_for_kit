'use strict';

/**
 * @fileOverview index.js
 *
 * @author
 * @author waricoma
 * @version 1.0.0
 */

require('dotenv').config();
const http = require('http');
const path = require('path');
const socketIo = require('socket.io');
const { RTMClient } = require('@slack/rtm-api');
const NodeStatic = require('node-static');

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN.toString().trim();
const SLACK_TARGET_CH_ID = process.env.SLACK_TARGET_CH_ID.toString().trim().toUpperCase();
const SERVER_HOST = process.env.SERVER_HOST.toString().trim();
const SERVER_PORT = parseFloat(process.env.SERVER_PORT.toString().trim());

const publicDr = new NodeStatic.Server(path.resolve(__dirname, '..', 'public'));

const server = http.createServer((req, res) => {
  req.addListener('end', () => {
    publicDr.serve(req, res);
  }).resume();
}).listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(`Server running at http://${SERVER_HOST}:${SERVER_PORT}`);
});

const io = socketIo(server);
io.on('connection', (socket) => {
  console.log('connected');

  socket.on('buttonEvent', (type) => {
    io.emit('message', type);
  });
});

const rtmClient = new RTMClient(SLACK_BOT_TOKEN);
rtmClient.on('message', (event) => {
  if (io.sockets.connected.length === 0 || !('text' in event) || event.channel !== SLACK_TARGET_CH_ID) {
    return;
  }
  io.emit('message', event.text);
});
rtmClient.start();
