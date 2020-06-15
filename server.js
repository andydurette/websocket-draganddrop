var express = require('express');

var app = express();
//var server = app.listen(3000);
var port = 3001;
var server = app.listen(process.env.PORT || port)

app.use(express.static('public'));
console.log("Mysocket server is now running");

var socket = require('socket.io');
var io = socket(server);
io.sockets.on('connection', locationSocket);
io.sockets.on('connection', textSocket);

var firebase = require("firebase");

// Initialize Firebase
// TODO: Replace with your project's customized code snippet
var config = {
  apiKey: "AIzaSyCSAdizRZC_8MxO5HUKS6zaSWT3jD0Pjwg",
  authDomain: "dnd-grid.firebaseapp.com",
  databaseURL: "https://dnd-grid.firebaseio.com",
  projectId: "dnd-grid",
  storageBucket: "dnd-grid.appspot.com",
  messagingSenderId: "705356768864"
};

firebase.initializeApp(config);


function locationSocket(socket){
  console.log(`New Connection ${socket.id}`);
  
  socket.on('drop', dropMsg);

  function dropMsg(data){
    socket.broadcast.emit('drop', data);

    firebase.database().ref("Position/-LS7kbA73Ekn1TtyfbH4/tiles").once('value', function(snap){
      snap.forEach(function(childNodes){
        if(childNodes.val().id == data.s){
        var p = String(parseInt(childNodes.val().id.substring(4))-1);
        var db = firebase.database();
        var ref = db.ref(`Position/-LS7kbA73Ekn1TtyfbH4/tiles/${p}`);
        console.log(p);
        ref.update({location: data.t});
        }
      })
    })
}
}

function textSocket(socket){
  socket.on('input', updateText);

  function updateText(data){
    socket.broadcast.emit('input', data);
    console.log(data);
  

  // firebase.database().ref("Position/-LS7kbA73Ekn1TtyfbH4/tiles").once('value', function(snap){
  //   snap.forEach(function(childNodes){
  //     if(childNodes.val().id == data.p){
  //     var p = String(parseInt(childNodes.val().id.substring(4))-1);
  //     var db = firebase.database();
  //     var ref = db.ref(`Position/-LS7kbA73Ekn1TtyfbH4/tiles/${p}`);
  //     console.log(p);
  //     ref.update({text: data.t});
  //     }
  //   })
  // })
}
}


/* Get a database reference to our blog
var db = firebase.database();
var ref = db.ref("Position/-LS7kbA73Ekn1TtyfbH4/tiles");

var i;
  for (i = 0; i < 21; i++) { 
    var usersRef = ref.child(i);
    usersRef.set({
      id: `tile${i+1}`,
      location: `w1-box${i+1}`,
      text: `hi${i+1}`
    });
  }
*/
