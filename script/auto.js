Bread.Auto = new Object();
var Auto = Bread.Auto;


var books = new Array();
books[0] = 0;
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


// Find passage from reference types: "Book", "Book 1", "Book 1:1"
Auto.find = function(input)
{
  pbook = new RegExp("[a-zA-Z]+");
  pchap = new RegExp("[a-zA-Z]+ [0-9]+");
  pverse = new RegExp("[a-zA-Z]+ [0-9]+:[0-9]+");

  if(pverse.test(input)){
    ref = input.split(" ");
    ref2 = ref[1].split(":");

    book = ref[0];
    chapter = ref2[0] * 1;
    verse = ref2[1] * 1;
    
    Load.cols(book, chapter);
  }

  else if(pchap.test(input)){
    ref = input.split(" ");

    book = ref[0];
    chapter = ref[1] * 1;

    Load.cols(book, chapter);
  }

  else if(pbook.test(input)){
    Load.cols(input);
  }
}


// Input autocomplete (for references)
Auto.complete = function(input)
{
  for (i = 0; i <= books.length; i++)
    if (books[i].indexOf(input.toLowerCase()) != -1)
      alert(books[i]);
}


// Convert word to num
Auto.wordNum = function(word)
{
  var words = new Array('zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten');

  for (w in word)
  {
    if($.inArray(word[w], words) == -1) continue;
    else return $.inArray(word[w], words) * 1;
  }
}


// Create reference from selection
Auto.ref = function()
{
  start = $('.ui-selected:first');
  startBook = start.attr('book');
  startChapter = start.attr('chapter');
  startVerse = start.attr('verse');

  end = $('.ui-selected:last');
  endBook = end.attr('book');
  endChapter = end.attr('chapter');
  endVerse = end.attr('verse');

  alert(
    startBook + ' ' + startChapter + ':' + startVerse
    + ' - ' + endBook + ' ' + endChapter + ':' + endVerse
  );
}