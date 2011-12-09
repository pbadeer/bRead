var Bread = Bread || {};
Bread.Current = new Object();
var Current = Bread.Current;


// Initialization, runs on window.onload
Bread.Init = function(){

  // CSS Selectors
  Current.output = new Array(0, '#bible .column.one', '#bible .column.two');
  Current.input = {
    book: '#title .book',
    chap: '#title .chapter'
  };

  // Lists
  types = new Array(0, 'bible', 'notes');

  // Defaults
  Current.book = 'Matthew';
  Current.chap = 1;
  Current.tran = new Array(0, 'kjv', 'kjv');
  Current.type = new Array(0, 1, 2);
  Current.cols = 2;


  //First load!
  Load.cols();


  // Bind left/right keys to prev/next chapter load
  $(document).bind('keydown', 'right', function(){ Load.next() });
  $(document).bind('keydown', 'left', function(){ Load.prev() });


  // Show/hide verse numbers
  $('.nums').toggle(function(){
    View.Nums.on();
  }, function() {
    View.Nums.off();
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
      $(Current.output[1]).animate({
        width: '100%'
      });
    }

    // animate to TWO
    if( n == 2 && Current.cols != 2){
      $(Current.output[2]).show().animate({
        opacity: 1,
        width: '50%'
      });

      $(Current.output[1]).animate({
        width: '50%'
      });
    }

    // Hide other columns
    for(i=n+1; i<=Current.cols; i++)
    {
      $(Current.output[i]).animate({
        width: 0,
        opacity: 0
      }, function(){
        $(Current.output[i]).hide();
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
  $(Current.input.book + ', ' + Current.input.chap).change(function(){
    var b = $(Current.input.book).val();
    var c = $(Current.input.chap).val();
    Load.cols(b, c);
  });

}


// Initialize!
window.onload = Bread.Init;