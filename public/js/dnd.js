/* Set Initial Tile Data */
window.addEventListener("load", function() {
  function handleErrors(response) {
      if (!response.ok) {
          throw Error(response.statusText);
      }
      return response;
  }

  fetch('https://dnd-grid.firebaseio.com/Position/-LS7kbA73Ekn1TtyfbH4.json')
  .then(handleErrors)
  .then(function(response){
      return response.json();
  }).then(function(position){
    //  console.log(response.status);
     /* console.log(position);
      position.wrapper1.forEach(({ id }) => {
          var wrapper1 = document.createElement('div');
          wrapper1.classList.add('box', id);
          document.getElementById('wrapper1').appendChild(wrapper1);      
        }); */
        var i;
        for (i = 1; i < 101; i++) { 
          var wrapper1 = document.createElement('div');
          wrapper1.classList.add('box', `w1-box${i}`);
          document.getElementById('wrapper1').appendChild(wrapper1); 
        }
        return position;
  }).then(function(position){
      /*position.wrapper2.forEach(({ id }) =>{
          var wrapper2 = document.createElement('div');
          wrapper2.classList.add('box', id);
          document.getElementById('wrapper2').appendChild(wrapper2);      
        }); */
        var i;
        for (i = 1; i < 103; i++) { 
          var wrapper2 = document.createElement('div');
          wrapper2.classList.add('box', `w2-box${i}`);
          document.getElementById('wrapper2').appendChild(wrapper2); 
        }
        console.log(position);
        return position;
  }).then(function(position){    
          position.tiles.forEach(({ id, location, text }) =>{
          var tiles = document.createElement('div');
          var p = document.createElement('p');
          var div = document.createElement('div');
          tiles.setAttribute("id", id);
          tiles.className = 'task';
          tiles.setAttribute("draggable", "true");  
          p.innerHTML = text;
          p.setAttribute("contenteditable", "false");
          div.innerHTML = `<img src='../images/settings.svg' height='12px' width='12px' class="options" onclick="editFunction(this)">`;
          tiles.appendChild(p);
          tiles.appendChild(div);
          document.querySelector(`.${location}`).appendChild(tiles); 
        }); 
  })
  .then(setupFunction)
  .catch(function(error){
      console.log(error);    
  });

/* End of Setting Initial Tile Data */

/* Start of Drop Data Event Handling*/ 

function setupFunction() {

var socket;
//socket = io.connect('http://localhost:3000');
socket = io.connect('https://dnd-tabletop.herokuapp.com/');
socket.on('drop', newDrop);
socket.on('input', newTextUpdate);
var dropTarget1 = document.querySelector(".wrapper1");
var dropTarget2 = document.querySelector(".wrapper2");
var draggables= document.querySelectorAll(".task");

function newDrop(data) {
  document.querySelector(`.${data.t}`).appendChild(document.getElementById(data.s));
}

function newTextUpdate(data) {
  document.querySelector(`#${data.p}`).querySelector('p').innerHTML = data.t ;
  console.log('Testing');
}

/*
What to Drag - ondragstart and setData(), then, specify what should happen when the element is dragged.
The ondragstart attribute calls a function, drag(event), that specifies what data to be dragged.
The dataTransfer.setData() method sets the data type and the value of the dragged data:
*/

for(let i = 0; i < draggables.length; i++) {
  draggables[i].addEventListener("dragstart", function (ev) {
     ev.dataTransfer.setData("srcId", ev.target.id);
  });
}

/*
Where to Drop - ondragover, the ondragover event specifies where the dragged data can be dropped.
By default, data/elements cannot be dropped in other elements, to allow a drop, we must prevent the default handling of the element.
This is done by calling the event.preventDefault() method for the ondragover event:
*/

dropTarget1.addEventListener('dragover', function(ev) {
  ev.preventDefault();
});


dropTarget2.addEventListener('dragover', function(ev) {
  ev.preventDefault();
});


dropTarget1.addEventListener('drop', function(ev) {
  if (ev.target.hasChildNodes() == false) {
  console.log(ev);
  ev.preventDefault();
  let target = ev.target;
  let droppable = target.classList.contains('box');
  let srcId = ev.dataTransfer.getData("srcId");
  
  if (droppable) {
    ev.target.appendChild(document.getElementById(srcId));
  }

  var data = {
    e:ev,
    s:srcId,
    t:target.classList[1],
  };
  socket.emit('drop', data);
  console.log(data.t);
}else{
  console.log(ev.target.classList[0]);
  return;
}
});


dropTarget2.addEventListener('drop', function(ev) {
  if (ev.target.hasChildNodes() == false) {
  ev.preventDefault();
  let target = ev.target;
  let droppable = target.classList.contains('box');
  let srcId = ev.dataTransfer.getData("srcId");
  
  if (droppable) {
    ev.target.appendChild(document.getElementById(srcId));
}

  let data = {
    e:ev,
    s:srcId,
    t:target.classList[1]
};
socket.emit('drop', data);
console.log(data.t);
}else{
  console.log(ev.target.classList[0]);
  return;
}
});

/* End of Drop Data Event Handling*/ 

/* Start of Text Edit Event Handling*/ 


Array.from(document.getElementsByClassName('task')).forEach(
  function(element) {
      element.querySelector('p').addEventListener('input', function() {
        console.log(this.innerHTML);
        console.log(this.parentNode.getAttribute('id'));
        let text = this.innerHTML;
        let parentId = this.parentNode.getAttribute('id');
        let data = {
          t:text,
          p:parentId
      };
      socket.emit('input', data);
      }, false);
  }
);


/* End of Text Edit Event Handling*/ 

};
}, false);


function editFunction(options) {
  if (options.parentNode.previousSibling.getAttribute('contenteditable') === 'false'){
      options.parentNode.previousSibling.setAttribute("contenteditable", "true");
    options.parentNode.previousSibling.focus();
    options.parentNode.previousSibling.focus();
    options.parentNode.previousSibling.style.outline = "1px solid #E6E6FA";
  }else{
     options.parentNode.previousSibling.setAttribute("contenteditable", "false");
    options.parentNode.previousSibling.blur();
    options.parentNode.previousSibling.style.outline = "none";
  }
  };
