const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');


// Get username and room from URL

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', {username, room});

// Message from server
socket.on('message', message =>{
    console.log(message)
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
    outputRoomName(room);
    outputUsers(users);
  });
  

/// Message submit
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = e.target.elements.msg.value;
    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
    
});


function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `	<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;

    document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
  }
  
  // Add users to DOM
  function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
  }
  
  //Prompt the user before leave chat room
  document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
      window.location = '../index.html';
    } else {
    }
  });