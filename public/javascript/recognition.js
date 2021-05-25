function mobileNavigation() {
    if(document.querySelector(".nav_mobile").style.display == "flex"){
        document.querySelector(".nav_mobile").style.display = "none";
    }
    else {
        document.querySelector(".nav_mobile").style.display = "flex";
    }
    
  }
  
  document.querySelector(".hamburger").addEventListener("click", mobileNavigation)
  
  let date = new Date();
  
  document.getElementById("year").innerHTML = date.getFullYear();