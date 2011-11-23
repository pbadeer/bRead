var books = new Array();
books[0] = "";
books[1] = "genesis";
books[2] = "exodus";
books[3] = "leviticus";
books[4] = "numbers";
books[5] = "deuteronomy";
books[6] = "joshua";
books[7] = "judges";
books[8] = "ruth";
books[9] = "1 samuel";
books[10] = "2 samuel";
books[11] = "1 kings";
books[12] = "2 kings";
books[13] = "1 chronicles";
books[14] = "2 chronicles";
books[15] = "ezra";
books[16] = "nehemiah";
books[17] = "esther";
books[18] = "job";
books[19] = "psalm";
books[20] = "proverbs";
books[21] = "ecclesiastes";
books[22] = "song of solomon";
books[23] = "isaiah";
books[24] = "jeremiah";
books[25] = "lamentations";
books[26] = "ezekiel";
books[27] = "daniel";
books[28] = "hosea";
books[29] = "joel";
books[30] = "amos";
books[31] = "obadiah";
books[32] = "jonah";
books[33] = "micah";
books[34] = "nahum";
books[35] = "habakkuk";
books[36] = "zephaniah";
books[37] = "haggai";
books[38] = "zechariah";
books[39] = "malachi";
books[40] = "matthew";
books[41] = "mark";
books[42] = "luke";
books[43] = "john";
books[44] = "acts";
books[45] = "romans";
books[46] = "1 corinthians";
books[47] = "2 corinthians";
books[48] = "galatians";
books[49] = "ephesians";
books[50] = "philippians";
books[51] = "colossians";
books[52] = "1 thessalonians";
books[53] = "2 thessalonians";
books[54] = "1 timothy";
books[55] = "2 timothy";
books[56] = "titus";
books[57] = "philemon";
books[58] = "hebrews";
books[59] = "james";
books[60] = "1 peter";
books[61] = "2 peter";
books[62] = "1 john";
books[63] = "2 john";
books[64] = "3 john";
books[65] = "jude";
books[66] = "revelation";

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

// Find passage
function find(ref)
{
  if(!ref) ref = $(input).val();

  for (var i=0; i<books.length; i++)
  if (books[i].indexOf(ref.toLowerCase()) != -1)
    alert(books[i]);
}

// Initialize!
window.onload = init;