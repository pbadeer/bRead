Bread.Auto = new Object();
var Auto = Bread.Auto;


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


// Convert word to num
Auto.wordNum = function(word)
{
  var words = new Array('zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten');

  for (w in word)
  {
    if($.inArray(word[w], words) == -1)
      continue;
    else
      return $.inArray(word[w], words) * 1;
  }
}


// Populate form with selection info
Auto.form = function()
{
  // Get start and end of selection
  start = $('.ui-selected:first');
  end = $('.ui-selected:last');

  // Create and fill Data.content with reference info
  Data.content = {
    start_book_id: start.parent('.chapter').attr('book-id') * 1,
    end_book_id: end.parent('.chapter').attr('book-id') * 1,
    start_chapter: start.parent('.chapter').attr('chapter') * 1,
    end_chapter: end.parent('.chapter').attr('chapter') * 1,
    start_verse: start.attr('verse') * 1,
    end_verse: end.attr('verse') * 1,
    translation: start.parent('.chapter').attr('translation')
  }

  // Populate form with Data.content info
  $('#form input, #form textarea').each(function(){
    var data = Data.content[$(this).attr('name')];
    if(data && data != null)
      $(this).val(data);
  })
}