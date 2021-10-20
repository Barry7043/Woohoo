document.onmouseover=function(e){
  if(event.target.className=='login_button'){
    event.target.style.backgroundColor= '#b7052d';
  }
  else if(event.srcElement.className=='register_button'){
    event.srcElement.style.backgroundColor= '#b7052d';
  }
  else if(event.srcElement.className=='reset_button'){
    event.srcElement.style.backgroundColor= '#b7052d';
  }
}

document.onmouseout=function(e){
  if(event.target.className=='login_button'){
    event.target.style.backgroundColor= '#A6192E';
  }
  else if(event.srcElement.className=='register_button'){
    event.srcElement.style.backgroundColor= '#A6192E';
  }
  else if(event.srcElement.className=='reset_button'){
    event.srcElement.style.backgroundColor= '#A6192E';
  }
}
