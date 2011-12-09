Bread.View.Nums = new Object();
Nums = Bread.View.Nums;


// Init
Nums.init = function(){

  $('.verse .n').animate({
    opacity: 'toggle',
    width: 'toggle'
  });

}


// Run this every column load (Load.cols())
Nums.load = function(){

  $('.verse .n').hide();

}


// Disable
Nums.off = function(){

  $('.verse .n').show();

}


// Initialize!
Nums.init();