setInterval(()=>{
    console.log("Arr:"+localStorage.getItem('window_ids'));
    console.log("Popup"+localStorage.getItem('popup_assigned'));
},1000);

let config = {};

window.onbeforeunload = function(){
    unregisterWindow();
}


function unregisterWindow(){
    let arr = ustr(localStorage.getItem('window_ids'));
    let ind = arr.indexOf(config.id);
    arr.splice(ind,1);
    localStorage.setItem('window_ids',str(arr));
}

registerWindow();
function registerWindow(){
    config.id = Date.now();

    let arr = ustr(localStorage.getItem('window_ids'));
    arr.push(config.id);
    localStorage.setItem('window_ids',str(arr));

}

function str(str){
    return JSON.stringify(str);
}

function ustr(str){
    return JSON.parse(str);
}


//heartbeat
if(localStorage.getItem('popup_assigned')==null){
    let arr = ustr(localStorage.getItem('window_ids'));
    if(arr[0] == config.id){
        //createpopup code
        localStorage.setItem('popup_assigned',1);
        console.log('Created PopUp');
    }
}

