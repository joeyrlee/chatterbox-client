class ChatApp {
  constructor() {
    this.server = 'https://api.parse.com/1/classes/messages';
  }

  init() {
    $('#send .submit').on('submit', this.handleSubmit);
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

  fetch() {
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'https://api.parse.com/1/classes/messages',
      type: 'GET',
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Data fetched');
        console.log(data);
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to fetch data', data);
      }
    });
  }

  clearMessages() {
    $('#chats').html('');
  }

  renderMessage(message) {
    let userName = message.username;
    let text = message.text;
    let roomname = message.roomname;


    let NewMessage = `<div class="userMessage">${text}</div>`;
    $('#chats').prepend(NewMessage);

    $('#main').prepend(`<div class="username">${userName}</div>`);
    $('.username').on('click', this.handleUsernameClick);
  }

  renderRoom(roomName) {
    let newRoom = `<div>${roomName}</div>`;
    $('#roomSelect').prepend(newRoom);
  }

  handleUsernameClick() {

  }

  handleSubmit() {
  }
}


let app = new ChatApp;