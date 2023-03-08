//TODO: Improve this t obe like discord or telegram, add ton of functionalities.search room, join room,  secret rooms with password, users invite users, authenticated users, send files, video call, encrypt channels

// import express from 'express';
const express = require('express');
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const botName = "ChatCord Bot";

io.on('connection', socket =>{

   socket.on('joinRoom', ({username, room}) =>{

      const user = userJoin(socket.id, username, room);
      socket.join(user.room);

    socket.emit('message', formatMessage(botName, 'Welcome to chat cord'));

    // Broadcast when a user connects
    socket.broadcast.to(user.room).emit('message', formatMessage(botName,`${user.username} has joined the chat`));


    // Send users and room info
    io.to(user.room).emit('roomUsers', {room: user.room, users: getRoomUsers(user.room)});

});
 
   

    

    
    //listen forchat messages
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    // Runs when user disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message', formatMessage(botName,`${user.username} has left the chat`));
        }
        
    });



});

const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(' server running'));