const body =  document.querySelector("body");

   document.getElementById("mobile-menu").onclick = function() {
    
    if(!body.classList.contains("toggle-menu")) {
body.classList.add("toggle-menu");


} else {

body.classList.remove("toggle-menu");
} 
}

function overlay() {
    if(body.classList.contains("toggle-menu")) {
        body.classList.remove("toggle-menu");
       }
}