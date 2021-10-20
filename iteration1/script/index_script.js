document.onmouseover=function(){
  if(event.srcElement.className=='friendzone_logo'){
    event.target.src= 'image/friend_add_logo_mouseOn.png';
  }
  else if(event.target.className=='studyzone_logo'){
    event.target.src= 'image/study_zone_logo_mouseOn.png';
  }
  else if(event.target.className=='trade_logo'){
    event.target.src= 'image/trade_logo_mouseOn.png';
  }
}

document.onmouseout=function(){
  if(event.target.className=='friendzone_logo'){
    event.target.src= 'image/friend_add_logo.png';
  }
  else if(event.target.className=='studyzone_logo'){
    event.target.src= 'image/study_zone_logo.png';
  }
  else if(event.target.className=='trade_logo'){
    event.target.src= 'image/trade_logo.png';
  }
}
