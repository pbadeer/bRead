var Bread = Bread || {};
Bread.Current = new Object();
var Current = Bread.Current;


// Initialization, runs on window.onload
Bread.Init = function(){

  // CSS Selectors
  output = new Array(0, '#bible .column.one', '#bible .column.two');
  input = '#ref';

  // Lists
  types = new Array(0, 'bible', 'notes');

  // Defaults
  Current.book = 'Matthew';
  Current.chap = 1;
  Current.tran = new Array(0, 'kjv', 'kjv');
  Current.type = new Array(0, 1, 2);
  Current.cols = 1;
  Current.view = '';


  //First load!
  Load.cols();


  // Show/hide verse numbers
  $('.nums').click(function(){
    if(Current.view != 'nums') {
      Bread.View.load('nums');
    }
    else {
      Bread.View.Nums.off();
      Current.view = '';
    }
  });


  // Select menus for column type and tran
  $('select.current').change(function(){
    var i = Auto.wordNum( $(this).attr('class').split(/\s+/) );
    
    if($(this).hasClass('type'))
      Current.type[i] = $(this).val();
    
    if($(this).hasClass('tran'))
      Current.tran[i] = $(this).val();

    Load.cols();
  });


  // Layout changer
  $('a.layout').click(function(){
    var n = Auto.wordNum( $(this).attr('class').split(/\s+/) );

    // animate to ONE
    if( n == 1 && Current.cols != 1 ){
      $(output[1]).animate({
        width: '100%'
      });
    }

    // animate to TWO
    if( n == 2 && Current.cols != 2){
      $(output[2]).show().animate({
        opacity: 1,
        width: '50%'
      });

      $(output[1]).animate({
        width: '50%'
      });
    }

    // Hide other columns
    for(i=n+1; i<=Current.cols; i++)
    {
      $(output[i]).animate({
        width: 0,
        opacity: 0
      }, function(){
        $(output[i]).hide();
      });
    }

    // Reset number of current columns
    Current.cols = n;
  });


  // Previous and Next buttons
  $('a.prev').click(function(){
    Load.prev();
  });
  $('a.next').click(function(){
    Load.next();
  });


  // Ref loader (from input)
  $(input).change(function(){
    Auto.find( $(this).val() );
  });

}


// Initialize!
window.onload = Bread.Init;