function nums(){

  var name = arguments.callee.name;

  $('.verse .n').animate({
    opacity: 0,
    width: 0
  }, function(){
    Load.view.css();
  });

}

nums();