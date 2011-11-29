// Initialization function, runs on window.onload
function init(){

  // CSS Selectors
  output = new Array(0, '.column.one', '.column.two');
  input = '#ref';

  // Lists
  types = new Array(0, 'bible', 'notes');

  // Defaults
  current_book = 'Matthew';
  current_chap = 1;
  current_tran = new Array(0, 'kjv', 'kjv');
  current_type = new Array(0, 1, 2);
  current_cols = 1;

  //First load!
  load();


  // Show/hide verse numbers
  $('.nums').click(function(){
    $('.verse .n').toggle();
  });

  // Button sets column TWO as BIBLE
  $('select.current').change(function(){
    if($(this).hasClass('one')) i = 1;
    if($(this).hasClass('two')) i = 2;
    
    if($(this).hasClass('type'))
      current_type[i] = $(this).val();
    
    if($(this).hasClass('tran'))
      current_tran[i] = $(this).val();
      
    load();
  });

  // Layout changer
  $('a.layout').click(function(){
    // animate to ONE
    if( $(this).hasClass('one') && $(output[2]).is(':visible') == true){
      current_cols = 1;

      $(output[1]).animate({
        width: '100%'
      });

      $(output[2]).animate({
        width: 0,
        opacity: 0
      }, function(){
        $(output[2]).hide();
      });
    }

    // animate to TWO
    if( $(this).hasClass('two') && $(output[2]).is(':hidden') == true ){
      current_cols = 2;

      $(output[2]).show().animate({
        opacity: 1,
        width: '50%'
      });

      $(output[1]).animate({
        width: '50%'
      });
    }
  });

}