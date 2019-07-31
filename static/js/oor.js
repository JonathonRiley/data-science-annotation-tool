function nextPage(){
    sessionStorage.getItem('id');
    var url = '/ner/next/'+(Number(splitUrl[5])+1).toString()+'/'
    var entities = JSON.parse(sessionStorage.getItem("textEntities"))[splitUrl[5]]['entities'];
    return url + JSON.stringify(entities)
}

function finishPage(){
    var id = sessionStorage.getItem('id');
    var url = '/ner/finish/'+id+'/'
    var entities = JSON.parse(sessionStorage.getItem("textEntities"))[splitUrl[5]]['entities'];
    return url + JSON.stringify(entities)
}

