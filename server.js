// import express from 'express';
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', socket =>{
   

    socket.emit('message', 'Welcome to chat cord');

    // Broadcast when a user connects
    socket.broadcast.emit('message', 'A user has joined the chat');


    // Runs when user disconnects
    socket.on('disconnect', () => {
        io.emit('message', 'User disconnected');
    });

    //listen forchat messages
    socket.on('chatMessage', msg => {
        io.emit('message',  msg);
    });
});

const PORT = 3001 || process.env.PORT;

server.listen(PORT, () => console.log(' server running'));