class ChatApp {
  constructor() {
    this.server = 'https://api.parse.com/1/classes/messages';
    this.users = {};
    this.rooms = {};
  }

  init() {
    this.fetch();

    $('#send').on('click', this.handleSubmit.bind(this));
    $('#roomList').on('change', this.handleRoomChange.bind(this));

    this.userName = this._parseURLforUsername();
    this.currentRoom = 'lobby';

    $('#newRoom').on('click', this.handleRoomAdd.bind(this));
  }

  handleRoomAdd() {
    let newRoomName = prompt('Enter your room name here: ');
    this.rooms[newRoomName] = newRoomName;
    this.reRenderData(this.lastFetchData);
  }

  handleRoomChange() {
    let targetRoom = $('#roomList option:selected').text();
    //Construct query param
    let queryParameters = {where: {'roomname': targetRoom}, order: '-createdAt'};
    //Fetch with some query param
    this.fetch(queryParameters);
  }

  getSelectedRoom() {
    return $('#roomList option:selected').text();
  }

  _parseURLforUsername() {
    var myURL = window.location.search;
    var myRegexp = /username=(.*)/g;
    var match = myRegexp.exec(myURL);
    return match[1];
  }

  send(message) {
    console.log('sendmessage called');
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  }

  fetch(queryParameters = {order: '-createdAt'}) {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      data: queryParameters,
      contentType: 'application/json',
      success: onFetchSuccess.bind(this),
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch data', data);
      }
    });

    function onFetchSuccess(data) {
      console.log('chatterbox: Data fetched');
      console.log(data);
      this.lastFetchData = data;
      $('.userMessage').remove();
      data.results.forEach(message => this.renderMessage(message));
    }
  }

  reRenderData(data) {
    data.results.forEach(message => this.renderMessage(message));    
  }

  clearMessages() {
    $('#chats').html('');
  }

  renderMessage(message) {
    let userName = message.username;
    let text = message.text;
    let roomname = message.roomname;
    let messageID = message.objectId;


    let $newMessage = $('<div class="userMessage"></div>');
    $newMessage.text(text);
    // If user's is friend, add the bold class
    if (this.users[userName] === true) {
      $newMessage.addClass('bold');
    }
    $('#chats').prepend($newMessage);

    if (this.users[userName] === undefined) {
      this.users[userName] = false;
    }

    $('.username').remove();
    for (let userName in this.users) {
      let $newUserName = $('<div class="username"></div>');
      $newUserName.text(userName);
      if (this.users[userName] === true) {
        $newUserName.css('color','red');
      }
      $('#userList').prepend($newUserName);
    }


    $('.username').on('click', {originApp: this}, this.handleUsernameClick);

    this.rooms[roomname] = roomname;
    $('.roomEntry').remove();
    for (let roomname in this.rooms) {
      let $newRoom = $('<option class="roomEntry"></option>');
      $newRoom.text(roomname);
      $('#roomList').append($newRoom);
    }
  }

  renderRoom(roomName) {
    let newRoom = `<div>${roomName}</div>`;
    $('#roomSelect').prepend(newRoom);
  }

  handleUsernameClick(event) {
    let targetFriendName = $(this).text();
    let currentApp = event.data.originApp;

    console.log($(this).css('color'));
    if ($(this).css('color') === 'rgb(255, 0, 0)') {
      // Unfriend
      $(this).css('color', 'black');
      currentApp.users[targetFriendName] = false;

    } else {
      // Friend
      $(this).css('color', 'red');
      currentApp.users[targetFriendName] = true;
    }

    currentApp.reRenderData(currentApp.lastFetchData);
  }

  handleSubmit() {
    let message = {}; 
    message.text = $('#userMessage').val();
    message.username = this.userName;
    message.roomname = this.getSelectedRoom();

    this.send(message);
  }
}


let app = new ChatApp;

$(document).ready(function() {
  app.init();
});
