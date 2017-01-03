class ChatApp {
  constructor() {
    this.server = 'https://api.parse.com/1/classes/messages';
    this.users = {};
    this.rooms = {};
  }

  init() {
    $('#send').on('click', this.handleSubmit.bind(this));
    $('#roomList').on('change', this.handleRoomChange.bind(this));

    this.userName = this._parseURLforUsername();
    this.currentRoom = 'lobby';

  }

  handleRoomChange() {
    console.log($('#roomList option:selected').text());
    //Construct query param
    //let queryParameters = {roomname: 'lobby', order: '-createdAt'};
    //Fetch with some query param
    //this.fetch(queryParameters);
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
      data.results.forEach(message => this.renderMessage(message));
    }
  }

  clearMessages() {
    $('#chats').html('');
  }

  renderMessage(message) {
    let userName = message.username;
    let text = message.text;
    let roomname = message.roomname;


    let $newMessage = $('<div class="userMessage"></div>');
    $newMessage.text(text);
    $('#chats').prepend($newMessage);

    this.users[userName] = userName;
    $('.username').remove();
    for (let userName in this.users) {
      let $newUserName = $('<div class="username"></div>');
      $newUserName.text(userName);
      $('#main').prepend($newUserName);
    }

    $('.username').on('click', this.handleUsernameClick.bind(this));

    this.rooms[roomname] = roomname;
    $('.roomEntry').remove();
    for (let roomname in this.rooms) {
      let $newRoom = $('<option class="roomEntry" value=""></option>');
      $newRoom.text(roomname);
      $('#roomList').append($newRoom);
    }
  }

  renderRoom(roomName) {
    let newRoom = `<div>${roomName}</div>`;
    $('#roomSelect').prepend(newRoom);
  }

  handleUsernameClick() {

  }

  handleSubmit() {
    let message = {}; 
    message.text = $('#userMessage').val();
    message.username = this.userName;
    message.roomname = this.currentRoom;

    this.send(message);
  }
}


let app = new ChatApp;

$(document).ready(function() {
  app.init();
});
