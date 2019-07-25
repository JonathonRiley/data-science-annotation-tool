var labels_and_colours = {};

function initialise(entities){
    sessionStorage.setItem('textEntities', JSON.stringify(entities));
    var labelsRaw = JSON.parse(sessionStorage.getItem("globalLabels"));
    if (labelsRaw != ""){
        for (var label in labelsRaw){
            newElement(label, labelsRaw[label]["counts"]);
        }
    }
}

// Create a new list item when clicking on the "Add" button
function newElement(entityName, counts) {
  var li = document.createElement("li");
  var inputValue;
  var colour;
  if (entityName == ""){
      inputValue = document.getElementById("myInput").value;
      colour = getRandomColour();
  } else{
      inputValue = entityName;
      var labelsRaw = JSON.parse(sessionStorage.getItem("globalLabels"))
      colour = labelsRaw[inputValue]["colour"];
  }
  li.setAttribute("id", inputValue);

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
    labels_and_colours[inputValue] = {"colour":colour, "counts":counts};
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

function goToTagger(id) {
    sessionStorage.setItem("globalLabels", JSON.stringify(labels_and_colours));
    return '/ner/tagger/'+id
}