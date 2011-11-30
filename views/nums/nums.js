function nums(){

  var name = arguments.callee.name;
  var css = function(){ openFile('views/' + name + '/' + name + '.css', 'css') };

  $('.verse .n').animate({
    opacity: 0,
    width: 0
  }, function(){
    css;
  });

}

nums();