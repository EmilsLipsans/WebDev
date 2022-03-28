
function toggleText() { 
  
  // Get all the elements from the page 
  var points = document.getElementById("points"); 
  var showMoreText = document.getElementById("moreText"); 
	var img = document.getElementById('arrow'); 
  

  if (points.style.display === "none") { 

 
      showMoreText.style.display = "none"; 
      points.style.display = "inline"; 
      img.setAttribute('style','transform:rotate(360deg)');
      
  } 
  // If the hidden portion is revealed 
  else { 
      showMoreText.style.display = "inline"; 
      points.style.display = "none";  
      img.setAttribute('style','transform:rotate(180deg)');
  } 
} 


function validateForm() {
  var x = document.forms["myForm"]["name"].value.trim();
  if (x == "") {
    alert("Nav ierakstīts vārds!");
    return false;
  }
  if (/[^a-zA-Z]/.test(x)){
    alert("Ievadiet vārdu neizmantojot garumzīmes, simbolus, ciparus un atstarpes!");
    return false;
  }
  var x = document.forms["myForm"]["email"].value;
  if (x == "") {
    alert("Nav ierakstīts e-pasts");
    return false;
  }
  var x = document.forms["myForm"]["message"].value;
  if (x == "") {
    alert("Nav ierakstīta ziņa");
    return false;
  }
  else{
    return true;
  }
}

