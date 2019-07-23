var labels_and_colours = {};

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    var div = this.parentElement;
    div.style.display = "none";
    var label = div.getAttribute("id");
    delete labels_and_colours[label];
    document.getElementById("test").innerHTML = JSON.stringify(labels_and_colours);
  }
}

// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  li.setAttribute("id", inputValue);
  var colour = getRandomColour();

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  var container = document.createElement("SPAN");
  container.style.marginLeft = "15px";
  var text = document.createTextNode(inputValue);

  container.appendChild(text);
  container.style.backgroundColor = colour;
  li.appendChild(container);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    labels_and_colours[inputValue] = {"colour":colour, "counts":0};
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";

  var close = document.getElementsByClassName("close");
  var i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      div.style.display = "none";
    var label = div.getAttribute("id");
    delete labels_and_colours[label];
    }
  }
}

function getRandomColour() {
  var letters = '0123456789ABCDEF';
  var colour = '#';
  for (var i = 0; i < 6; i++) {
    colour += letters[Math.floor(Math.random() * 16)];
  };
  return colour
}

function goToTagger() {
    sessionStorage.setItem("labels", JSON.stringify(labels_and_colours));
    return '/ner/tagger/0'
}