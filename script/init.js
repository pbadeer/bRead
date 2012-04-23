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
  Current.book = 40;
  Current.chap = 1;
  Current.tran = new Array(0, 'kjv', 'kjv');
  Current.type = new Array(0, 1, 2);


  //First load!
  Render.content();


  // Bind left/right keys to prev/next chapter load
  $(document).bind('keydown', 'right', function(){ Render.nextChapter() });
  $(document).bind('keydown', 'left', function(){ Render.previousChapter() });


  // Nav hotkey: n
  $(document).bind('keydown', 'n', function(){ $('#nav').toggle() });


  // Show/hide verse numbers
  $('.nums').toggle(function(){
    View.Nums.on();
  }, function() {
    View.Nums.off();
  });


  // Select menus for column type and tran
  $('select.current').change(function(){
    var i = Data.wordNum( $(this).attr('class').split(/\s+/) );
    
    if($(this).hasClass('type'))
      Current.type[i] = $(this).val();
    
    if($(this).hasClass('tran'))
      Current.tran[i] = $(this).val();

    Render.content();
  });


  // Ref loader (from input)
  $(Current.input.book + ', ' + Current.input.chap).change(function(){
    var book = $(Current.input.book).val();
    var chapter = $(Current.input.chap).val();
    Render.content(book, chapter);
  });

  // Stats.js display
  var stats = new Stats();

  stats.getDomElement().style.position = 'absolute';
  stats.getDomElement().style.right = '0px';
  stats.getDomElement().style.top = '0px';

  document.body.appendChild( stats.getDomElement() );

  setInterval( function () {
    stats.update();
  }, 1000 / 60 );

}


// Initialize!
window.onload = Bread.Init;