// Initialization function, runs on window.onload
function init(){

  // CSS Selectors
  output = new Array(0, '#bible .column.one', '#bible .column.two');
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

  // Select menus for column type and tran
  $('select.current').change(function(){
    var i = wordNum( $(this).attr('class').split(/\s+/) );
    
    if($(this).hasClass('type'))
      current_type[i] = $(this).val();
    
    if($(this).hasClass('tran'))
      current_tran[i] = $(this).val();

    load();
  });

  // Layout changer
  $('a.layout').click(function(){
    var n = wordNum( $(this).attr('class').split(/\s+/) );

    // animate to ONE
    if( n == 1 && current_cols != 1 ){
      $(output[1]).animate({
        width: '100%'
      });
    }

    // animate to TWO
    if( n == 2 && current_cols != 2){
      $(output[2]).show().animate({
        opacity: 1,
        width: '50%'
      });

      $(output[1]).animate({
        width: '50%'
      });
    }

    // Hide other columns
    for(i=n+1; i<=current_cols; i++)
    {
      $(output[i]).animate({
        width: 0,
        opacity: 0
      }, function(){
        $(output[i]).hide();
      });
    }

    // Reset current_cols number
    current_cols = n;
  });

}