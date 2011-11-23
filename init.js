// Initialization function, runs on window.onload
function init(){

  // CSS Selectors
  output = new Array('','.column.one','.column.two');
  input = '#ref';

  // Defaults
  current_book = 'Matthew';
  current_chap = 1;
  current_tran = new Array('','kjv','kjv');
  current_type = new Array('','bible','notes');

  //First load! Puts content in main column
  load();


  // Show/hide verse numbers
  $('.nums').click(function(){
    $('.verse .n').toggle();
  });

  // Button sets column TWO as BIBLE
  $('.two.bible').click(function(){
    current_type[2] = 'bible';
    load();
  });

  // Button sets column TWO as NOTES
  $('.two.notes').click(function(){
    current_type[2] = 'notes';
    clear(2); //replace with a noteload function
  });

  // Layout changer
  $('a.layout').click(function(){
    // animate to ONE
    if( $(this).hasClass('one') && $(output[2]).is(':visible') == true){
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