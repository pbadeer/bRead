Bread.View.Nums = new Object();
Nums = Bread.View.Nums;


// View on
Nums.on = function(){

  $('.verse .n').animate({
    opacity: 'toggle',
    width: 'toggle'
  }, function(){
      $('.verse .n').hide();
  });

}


// View off
Nums.off = function(){
  $('.verse .n').show();
}