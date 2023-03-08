// import express from 'express';
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const botName = "ChatCord Bot";

io.on('connection', socket =>{
   socket.on('joinRoom', ({username, room}) =>{
    socket.emit('message', formatMessage(botName, 'Welcome to chat cord'));

    // Broadcast when a user connects
    socket.broadcast.emit('message', formatMessage(botName,'A user has joined the chat'));
 
   });

    

    
    //listen forchat messages
    socket.on('chatMessage', msg => {
        
        io.emit('message', formatMessage('USER', msg));
    });

    // Runs when user disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(botName,'User disconnected'));
    });

});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(' server running'));