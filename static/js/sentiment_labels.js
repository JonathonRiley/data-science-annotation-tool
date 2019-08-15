var labels = {};

function initialise(sentiments){
    sessionStorage.setItem('sentiments', JSON.stringify(sentiments));
    var possibleLabels = ["Very Positive","Positive","Neutral","Negative","Very Negative"];
    var labelsRaw = sessionStorage.getItem("globalLabels");

    for (var label in possibleLabels){
        if (labelsRaw == ""){
            newElement(possibleLabels[label],false);
        }
        else {
            if (possibleLabels[label] in JSON.parse(labelsRaw)){
                newElement(possibleLabels[label], true)
            }
            else{
                newElement(possibleLabels[label], false)
            }
        }
    }
}

function newElement(labelName, checked) {
    var labelColours = {
      "Very Positive":"#279900",
      "Positive":"#3DEC00",
      "Neutral":"#FF9300",
      "Negative":"#FF0000",
      "Very Negative":"#A70000"
    }

    var label= document.createElement("li");
    var container = document.createElement("span");
    var description = document.createTextNode(labelName);
    var checkbox = document.createElement("input");
    container.appendChild(description);
    container.style.color = labelColours[labelName];

    label.name = labelName;
    checkbox.type = "checkbox";
    checkbox.name = "checkbox"+labelName;
    checkbox.checked = checked;

    label.appendChild(checkbox);
    label.appendChild(container);
    document.getElementById("myUL").appendChild(label);
}


function getCheckedBoxes() {
  var checkboxes = document.getElementById("myUL").children;
  var checkboxesChecked = {};

  for (var i=0; i<checkboxes.length; i++) {
    var checkbox = checkboxes[i];
    if(checkbox.children[0].checked){
        checkboxesChecked[checkbox["name"]] = 0;
    }
  }
  return checkboxesChecked
}


function goToTagger(id) {
    var checkedBoxes = JSON.stringify(getCheckedBoxes());
    sessionStorage.setItem("globalLabels", checkedBoxes);
    return '/sentiment/tagger/'+id
}