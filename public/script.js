'use strict';

/**
 * @fileOverview index.js
 *
 * @author
 * @author waricoma
 * @version 1.0.0
 */

nicoscreen.set({
  base: {
    color: '#95a5a6',
    speed: 'normal',
    interval: 'normal',
    font_size: '50px',
    loop: true
  },
  comments: []
});
nicoscreen.start();

const socket = io.connect();

socket.on('connect', () => {
  nicoscreen.add('connected');
});

socket.on('message', (msg) => {
  nicoscreen.add(msg);
});

const buttonEvent = (type) => {
  console.log(type);
  socket.emit('buttonEvent', type);
};

$('#gotIt').click(() => {
  buttonEvent('Got it!');
});

$('#umm').click(() => {
  buttonEvent('Umm...?');
});

$('#set').click(() => {
  $('#slide').prop('src', $('#slideURL').val());
});
