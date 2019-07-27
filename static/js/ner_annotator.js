function initialise(id){
    setGlobalIds();
    var labelsRaw = generateLabels();
    var entities = generateText(id, labelsRaw);
    generateEntities(id, entities, labelsRaw);

}

function setGlobalIds(){
    var url = document.URL;
    var splitUrl = url.split('/');
    sessionStorage.setItem('id', Number(splitUrl[5]));
    sessionStorage.setItem("textIndex", 0);
}

function generateLabels(){
    var labelsString ='';
    var labelsRaw = JSON.parse(sessionStorage.getItem("globalLabels"));
    for (var labelName in labelsRaw){
        labelsString += makeLabelButton(labelName, labelsRaw[labelName]["colour"], labelsRaw[labelName]["counts"]);
    }
    document.getElementById("labels").innerHTML = labelsString;
    return labelsRaw
}

function makeLabelButton(label, colour, labelCount) {
    return '<div class="row pdn"><div class="col-9"><button class="class" onclick="addToEntity(\''+label+'\')" style="background-color:'+colour+';font-size : 20px; margin-top: 5px"><span>'+label+'</span></button> - '+labelCount+'</div>'
}

function addToEntity(label){
    var selection = window.getSelection().getRangeAt(0);
    if (selection !=''){
        var labelsRaw = JSON.parse(sessionStorage.getItem("globalLabels"));
        var id = sessionStorage.getItem("id")
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

        labelsRaw[label]["counts"] += 1;
        sessionStorage.setItem("globalLabels", JSON.stringify(labelsRaw));
        sessionStorage.setItem("textEntities", JSON.stringify(entities));

        generateLabels();
        var labelsRaw = generateLabels();
        var entities = generateText(id, labelsRaw);
        generateEntities(id, entities, labelsRaw);
    }

}

function generateText(id, labels) {
    var textEntities = JSON.parse(sessionStorage.getItem("textEntities"));
    var content = textEntities[Number(id)]["content"];
    var entities = textEntities[Number(id)]["entities"].sort(sortEntitiesHighLow);

    document.getElementById("entities").innerHTML = JSON.stringify(entities);
    var colouredContent = content;
    for (var ii =0; ii<entities.length; ii++){
        var entity = entities[ii];
        var text = colouredContent.substring(entity[0],entity[1]);
        var colour = labels[entity[2]]['colour'];
        colouredContent = colouredContent.substring(0,entity[0])
            + '<em style="background-color:'+colour+'">' + text + '</em>'
            + colouredContent.substring(entity[1],colouredContent.length)
    }

    document.getElementById("text").innerHTML = colouredContent;
    return content, entities
}

function generateEntities(id, entities, labels) {
    var entitiesHTML = '';
    var entitiesReverse = entities.sort(sortEntitiesLowHigh);
    var content = JSON.parse(sessionStorage.getItem("textEntities"))[id]['content'];

    for (var ii=0; ii<entitiesReverse.length; ii++){
            var text = content.substring(entitiesReverse[ii][0],entitiesReverse[ii][1]);
            var colour = labels[entitiesReverse[ii][2]]['colour'];
            entitiesHTML += '<button class="class"  onclick="removeEntity(['+entitiesReverse[ii][0]+','+entitiesReverse[ii][1]+',\''+entitiesReverse[ii][2]+'\'])" style="background-color:'+colour+'; margin-left:3px;">'+text+'</span>';
            }
    document.getElementById("entities").innerHTML = entitiesHTML;
}


function addEntityHTML(word, colour){
    document.getElementById("entities").innerHTML += '<span style="background-color:'+colour+'; color:#FFFFFF; margin-left:3px;">'+word+'</span>';
}

function removeEntity(entity){
    var entities = JSON.parse(sessionStorage.getItem("textEntities"));
    var id = sessionStorage.getItem("id");
    var labelsRaw = JSON.parse(sessionStorage.getItem("globalLabels"));
    var label = entity[2];
    var remainingEntities = [];
    for (var i=0; i < entities[Number(id)]['entities'].length; i++){
            if (JSON.stringify(entities[Number(id)]['entities'][i]) != JSON.stringify(entity)){
               remainingEntities.push(entities[Number(id)]['entities'][i]);
            }
        };

    entities[Number(id)]['entities'] = remainingEntities;
    labelsRaw[label]["counts"] -= 1;
    sessionStorage.setItem('textEntities', JSON.stringify(entities));
    sessionStorage.setItem("globalLabels", JSON.stringify(labelsRaw));

    document.getElementById("entities").innerHTML = JSON.stringify(entities);

    generateLabels();
    var labelsRaw = generateLabels();
    var entities = generateText(id, labelsRaw);
    generateEntities(id, entities, labelsRaw);
}

function sortEntitiesHighLow( a, b ) {
  if ( a[0] < b[0] ){
    return 1;
  }
  else if ( a[0] > b[0] ){
    return -1;
  }
  return 0;
}

function sortEntitiesLowHigh( a, b ) {
  if ( a[0] < b[0] ){
    return -1;
  }
  else if ( a[0] > b[0] ){
    return 1;
  }
  return 0;
}


function prevPage(){
    var url = document.URL;
    var splitUrl = url.split('/');
    sessionStorage.setItem('id', Number(splitUrl[5])-1);
    var url = '/ner/prev/'+(Number(splitUrl[5])-1).toString()+'/'
    var entities = JSON.parse(sessionStorage.getItem("textEntities"))[splitUrl[5]]['entities'];
    return url + JSON.stringify(entities)
}

function nextPage(){
    var url = document.URL;
    var splitUrl = url.split('/');
    sessionStorage.setItem('id', Number(splitUrl[5])+1);
    var url = '/ner/next/'+(Number(splitUrl[5])+1).toString()+'/'
    var entities = JSON.parse(sessionStorage.getItem("textEntities"))[splitUrl[5]]['entities'];
    return url + JSON.stringify(entities)
}

function finishPage(){
    var url = document.URL;
    var splitUrl = url.split('/');
    sessionStorage.setItem('id', Number(splitUrl[5]));
    var url = '/ner/finish/'+(Number(splitUrl[5])).toString()+'/'
    var entities = JSON.parse(sessionStorage.getItem("textEntities"))[splitUrl[5]]['entities'];
    return url + JSON.stringify(entities)
}

