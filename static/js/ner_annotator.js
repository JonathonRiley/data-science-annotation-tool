function initialise(id){
    var labelsRaw = JSON.parse(sessionStorage.getItem("globalLabels"));
    var labelsString ='';
    var i;
   	for (var labelName in labelsRaw){
    	labelsString += newEntity(labelsString, labelName, labelsRaw[labelName]["colour"], labelsRaw[labelName]["counts"]);
    }
    document.getElementById("labels").innerHTML = labelsString;

    var textEntities = JSON.parse(sessionStorage.getItem("textEntities"));
    var content = textEntities[Number(id)]["content"].toString();
    document.getElementById("text").innerHTML = content;

    for (var entity in textEntities[Number(id)]["entities"]){
        var textStart = entity[0];
        var textEnd = entity[1];
        var colour = labelsRaw[entity[2]]["colour"];
        addEntityHTML("cat",colour);
    }
    document.getElementById("test").innerHTML = sessionStorage.getItem("textEntities");
}

function prevPage(){
    var url = document.URL;
    var splitUrl = url.split('/');
    sessionStorage.setItem('id', Number(splitUrl[5])-1);
    return '/ner/tagger/'+(Number(splitUrl[5])-1).toString()
}

function nextPage(){
    var url = document.URL;
    var splitUrl = url.split('/');
    sessionStorage.setItem('id', Number(splitUrl[5])+1);
    return '/ner/tagger/'+(Number(splitUrl[5])+1).toString();
}

function newEntity(labelsString, label, colour, labelCount) {
    return '<div class="row pdn"><div class="col-9"><button class="class" onclick="addToEntity(\''+label+'\',\''+colour+'\')" style="background-color:'+colour+';font-size : 20px; margin-top: 5px"><span>'+label+'</span></button> - '+labelCount+'</div>'
}

function addToEntity(label, colour){
    var selection = window.getSelection();
    var labelsRaw = JSON.parse(sessionStorage.getItem("globalLabels"));
    var id = sessionStorage.getItem("id");
    var entities = JSON.parse(sessionStorage.getItem("textEntities"));

    highlightRange(selection.getRangeAt(0), colour);
    addEntityHTML(selection, colour);
    labelsRaw[label]["counts"] += 1;
    sessionStorage.setItem("globalLabels", JSON.stringify(labelsRaw));
    entities[Number(id)]["entities"].push([selection.getRangeAt(0).startOffset, selection.getRangeAt(0).endOffset, label]);
    document.getElementById("test2").innerHTML = entities[Number(id)]["entities"];
    sessionStorage.setItem("textEntities", JSON.stringify(entities));
}

function addEntityHTML(word, colour){
    document.getElementById("entities").innerHTML += '<span style="background-color:'+colour+'; color:#FFFFFF; margin-left:3px;">'+word+'</span>';
}

function highlightRange(range, colour){
    var newNode = document.createElement("div");
    newNode.setAttribute(
        "style",
        "background-color:"+colour+"; display: inline;");
    range.surroundContents(newNode);
}