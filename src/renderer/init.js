const { ipcRenderer, remote } = require("electron");

//textarea 높이 조정
function autoHeight() {
  let bodyHeight = $("body").height();
  let toolbarHeigth = $(".toolbar").height();
  $("#my-textarea").height(bodyHeight - toolbarHeigth - 8);
}
document.body.onresize = autoHeight;
document.body.onresize();

//메모장 닫기, 이벤트 위임
$("body").on("click", ".glyphicon-remove", function(){
  let html = $("#my-textarea").html();
  let currentWindow = remote.getCurrentWindow();
  let title = currentWindow.getTitle();
  
  if(html){
    let size = currentWindow.getSize();
    let position = currentWindow.getPosition();

    let option = {
      width : size[0],
      height : size[1],
      x : position[0],
      y : position[1],
    }
    
    title == "sticky-notes" ? 
      ipcRenderer.send("save", $(".container-fluid")[0].innerHTML, option) :
      ipcRenderer.send("update", $(".container-fluid")[0].innerHTML, title, option);
  } else if(title != "sticky-notes"){
    ipcRenderer.send("delete", title);
  } else {
    window.close();
  }
})
ipcRenderer.on("quit",(event, arg) => {
  window.close();
 });
 
//데이터 불러오기
document.body.onload = function () {
  let currentWindow = remote.getCurrentWindow();
  let title = currentWindow.getTitle();

  title != "sticky-notes" ?
    ipcRenderer.send("load", title) : null;
}

ipcRenderer.on("load", (event, html) => {
  let data = new TextDecoder("utf-8").decode(html);
  $(".container-fluid")[0].innerHTML = data;
});

//메모장 삭제
$("body").on("click", ".glyphicon-trash", function(){
  let currentWindow = remote.getCurrentWindow();
  let title = currentWindow.getTitle();
  title == "sticky-notes" ?
    window.close() :
    ipcRenderer.send("delete", title);
})

//새 메모장 생성하기
$("body").on("click", ".glyphicon-plus", function(){
  let currentWindow = remote.getCurrentWindow();
  let size = currentWindow.getSize();
  let position = currentWindow.getPosition();
 
  let option = {
    width : size[0],
    height : size[1],
    x : position[0],
    y : position[1],
  }
  let optionString = JSON.stringify(option);
  ipcRenderer.send("new", optionString);
});

$("body").on("input", "#my-textarea", function(arg){
  let html = $("#my-textarea").html();
  let currentWindow = remote.getCurrentWindow();
  let title = currentWindow.getTitle();
  
  if(html){
    let size = currentWindow.getSize();
    let position = currentWindow.getPosition();

    let option = {
      width : size[0],
      height : size[1],
      x : position[0],
      y : position[1],
    }
    
    title == "sticky-notes" ? 
      ipcRenderer.send("save2", $(".container-fluid")[0].innerHTML, option) :
      ipcRenderer.send("update2", $(".container-fluid")[0].innerHTML, title, option);
  }
});
ipcRenderer.on("setTitle",(event, arg) => {
  let currentWindow = remote.getCurrentWindow();
  currentWindow.setTitle(arg);
});

setInterval(function(){
  let html = $("#my-textarea").html();
  let currentWindow = remote.getCurrentWindow();
  let title = currentWindow.getTitle();
  
  if(html){
    let size = currentWindow.getSize();
    let position = currentWindow.getPosition();

    let option = {
      width : size[0],
      height : size[1],
      x : position[0],
      y : position[1],
    }
    
    title == "sticky-notes" ? 
      ipcRenderer.send("save2", $(".container-fluid")[0].innerHTML, option) :
      ipcRenderer.send("update2", $(".container-fluid")[0].innerHTML, title, option);
  }
}, 60000);