function initialise(id){
    var url = document.URL;
    var splitUrl = url.split('/');
    sessionStorage.setItem('id', Number(splitUrl[5]));
    sessionStorage.setItem("textIndex", 0);
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

    for (var ii =0; ii < textEntities[Number(id)]["entities"].length; ii++){
        var childArray = textEntities[Number(id)]["entities"][ii];
        var start = childArray[0];
        var end = childArray[1];
        var colour = labelsRaw[childArray[2]]["colour"];
        var range = document.createRange();
        range.setStart(startNode, start);
        range.setEnd(endNode, end);

        highlightRange(content.substring(start,end), colour);
        addEntityHTML(content.substring(start,end),colour);
    }

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
    var selection = window.getSelection().getRangeAt(0);
    var labelsRaw = JSON.parse(sessionStorage.getItem("globalLabels"));
    var id = document.URL.split('/')[5];
    var textIndex = sessionStorage.getItem("textIndex");
    var entities = JSON.parse(sessionStorage.getItem("textEntities"));
    var content = entities[Number(id)]["content"];
    var start = content.indexOf(selection,textIndex);
    if (start = -1){
        start = content.indexOf(selection,0)
    };
    var end = start + selection.toString().length;
    sessionStorage.setItem("textIndex", end);
    entities[Number(id)]["entities"].push([start, end, label]);

    highlightRange(selection, colour);
    addEntityHTML(selection, colour);
    labelsRaw[label]["counts"] += 1;
    sessionStorage.setItem("globalLabels", JSON.stringify(labelsRaw));
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