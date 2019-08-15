function initialise(id){
    var current_sentiment = setGlobalIds();
    generateLabels(current_sentiment);
    generateText(current_sentiment);
    //generateEntities(id, entities, labelsRaw);

}

function setGlobalIds(){
    var url = document.URL;
    var splitUrl = url.split('/');
    sessionStorage.setItem('id', Number(splitUrl[5]));
    var sentiments = JSON.parse(sessionStorage.getItem('sentiments'))
    return sentiments[Number(splitUrl[5])]
}

function generateLabels(sentiment){
    var labelColours = {
          "Very Positive":"#279900",
          "Positive":"#3DEC00",
          "Neutral":"#FF9300",
          "Negative":"#FF0000",
          "Very Negative":"#A70000",
          "Not Selected": "#BEBEBE"
        };
    var labelsString ='';
    var labelsRaw = JSON.parse(sessionStorage.getItem("globalLabels"));
    for (var labelName in labelsRaw){
        if (sentiment["sentiment"] == ''){
            labelsString += makeLabelButton(labelName, labelColours[labelName], labelsRaw[labelName]);
            }
        else if(sentiment["sentiment"] == labelName){
            labelsString += makeLabelButton(labelName, labelColours[labelName], labelsRaw[labelName]);
        }
        else{
            labelsString += makeLabelButton(labelName, labelColours["Not Selected"], labelsRaw[labelName]);
        }
    }
    document.getElementById("labels").innerHTML = labelsString;
}

function makeLabelButton(label, colour, labelCount) {
    return '<button onclick="addSentiment(\''+label+'\')" style="background-color:'+colour+';font-size : 20px; margin-left: 50px; margin-top: 5px;"><span>'+label+'</span></button> - '+labelCount+'</div>'
}

function addSentiment(label){


}


function addToEntity(label){
    var selection = window.getSelection().getRangeAt(0);
    if (selection !=''){
        var labelsRaw = JSON.parse(sessionStorage.getItem("globalLabels"));
        var id = sessionStorage.getItem("id")
        var textIndex = sessionStorage.getItem("textIndex");
        var entities = JSON.parse(sessionStorage.getItem("textEntities"));
        var remainingContent = sessionStorage.getItem("remainingContent");
        var start = remainingContent.indexOf(selection,textIndex);
        if (start = -1){
            start = remainingContent.indexOf(selection,0)
        };
        var end = start + selection.toString().length;
        remainingContent = remainingContent.substring(0,start) + ' '.repeat(end-start) + remainingContent.substring(end,remainingContent.length)
        sessionStorage.setItem("textIndex", end);
        entities[Number(id)]["entities"].push([start, end, label]);

        labelsRaw[label]["counts"] += 1;
        sessionStorage.setItem("globalLabels", JSON.stringify(labelsRaw));
        sessionStorage.setItem("textEntities", JSON.stringify(entities));
        sessionStorage.setItem("remainingContent", remainingContent);

        generateLabels();
        var labelsRaw = generateLabels();
        var entities = generateText(id, labelsRaw);
        generateEntities(id, entities, labelsRaw);
    }

}

function generateText(sentiment) {
    var content = sentiment["content"];
    document.getElementById("text").innerHTML = content;
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

