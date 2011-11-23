// Initialization function, runs on window.onload
function init(){
  // CSS Selectors
  col1 = '.column.one';
  col2 = '.column.two';
  input = '#ref';

  // Defaults
  current_book = 'matthew';
  current_chap = 1;
  col1_tran = 'kjv';
  col2_tran = 'kjv';
  col1_type = 'bible';
  col2_type = 'notes';

  //First load! Puts content in main column
  load(1);


  // Show/hide verse numbers
  $('.nums').click(function(){
    $('.verse .n').toggle();
  });

  // Button sets column TWO as BIBLE
  $('.two.bible').click(function(){
    col2_type = 'bible';
    load(2);
  });

  // Button sets column TWO as NOTES
  $('.two.notes').click(function(){
    col2_type = 'notes';
    clear(2); //replace with a noteload function
  });

  // Layout changer
  $('a.layout').click(function(){
    // animate to ONE
    if( $(this).hasClass('one') && $(col2).is(':visible') == true){
      $(col1).animate({
        width: '100%'
      });
      $(col2).animate({
        width: 0,
        opacity: 0
      }, function(){
        $(col2).hide();
      });
    }

    // animate to TWO
    if( $(this).hasClass('two') && $(col2).is(':hidden') == true ){
      $(col2).show().animate({
        opacity: 1,
        width: '50%'
      });
      $(col1).animate({
        width: '50%'
      });
    }
  });
}

// Empties main column
function clear(col)
{
  if(col == 1) var area = col1;
  if(col == 2) var area = col2;

  $(area).html('');
}

// Opens XML and returns the request
function openXML(path)
{
  req = new XMLHttpRequest();

  req.open('GET', path, false);
  req.send('');

  return req.responseXML;
}

// Main loading function, loads passages
function load(col, book, n)
{
  if(col == 1){
    out = col1;
    tran = col1_tran;
  }
  if(col == 2){
    out = col2;
    tran = col2_tran;
  }

  if(!book) book = current_book;
  else current_book = book;

  if(!n) n = current_chap;
  else current_chap = n;

  xml = openXML('bible/' + tran + '/' + book + '/' + n + '.xml');
  xsl = openXML('index.xsl');

  xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xsl);
  
  html = xsltProcessor.transformToFragment(xml,document);

  clear(col);
  $(out).append(html);

  afterLoad();
}

// Things to run after content-load (load())
function afterLoad()
{
  // Change current passage title
  $(input).val(current_book + ' ' + current_chap);

  // Verse ref grabber
  $('.verse').click(function(){
    $(input).val( $(this).attr('ref') );
  });
}

// Previous chapter
function prev()
{
  load(1, current_book, current_chap - 1);
  if(col2_type == 'bible')
    load(2, current_book, current_chap);
}

// Next chapter
function next()
{
  load(1, current_book, current_chap + 1);
  if(col2_type == 'bible')
    load(2, current_book, current_chap);
}

// Initialize!
window.onload = init;