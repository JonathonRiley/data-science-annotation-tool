var labelCounts = {};
var text_entities = {};
var textString;

function initialise(){
    text_entities = sessionStorage
    var labelsString ='';
    var i;
    var labelCount;
   	for (i=0; i<splitLabelsColors.length-1; i++){
    	var testSplit = splitLabelsColors[i].split(':')
    	labelsString += newEntity(labelsString, testSplit[0], testSplit[1], testSplit[2])
        labelCounts[testSplit[0]] = testSplit[2]
    }
    textString = text
    document.getElementById("labels").innerHTML = labelsString;
}

function prevPage(){
    var url = document.URL;
    var splitUrl = url.split('/')
    return '/ner/prev/'+(Number(splitUrl[5])-1).toString()+'/'+splitUrl[6];
}

function nextPage(){
    var url = document.URL;
    var splitUrl = url.split('/')
    return '/ner/next/'+(Number(splitUrl[5])+1).toString()+'/'+splitUrl[6]+'/';
}

function newEntity(labelsString, label, colour, labelCount) {
    return '<div class="row pdn"><div class="col-9"><button class="class" onclick="addEntity(\''+label+'\',\''+colour+'\')" style="background-color:'+colour+';font-size : 20px; margin-top: 5px"><span>'+label+'</span></button> - '+labelCount+'</div>'
}

function addEntity(label, colour){
    var selection = window.getSelection().toString();
    labelCounts[label] += 1;
    document.getElementById("entities").innerHTML += '<span style="background-color:'+colour+'; color:#FFFFFF; margin-left:3px;">'+selection+'</span>';
}