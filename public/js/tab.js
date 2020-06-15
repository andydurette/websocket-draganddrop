/* Tab Controls*/

let optionsBar = document.getElementById('optionsBar');
let optionsTab = document.getElementById('optionsTab');

let pull = () => {
if (optionsTab.classList.contains("shifted") === false){
    optionsTab.classList.add("shifted");
    optionsBar.style.right = "0px";
    optionsTab.getElementsByTagName('img')[0].src = "../images/right-arrow.svg";
}else{  
    optionsTab.classList.remove("shifted"); 
    optionsBar.style.right = "-261px";
    optionsTab.getElementsByTagName('img')[0].src = "../images/left-arrow.svg";
  }
}