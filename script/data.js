Bread.Data = new Object();
var Data = Bread.Data;


// Opens/loads various filetypes
Data.file = function(path, ext)
{
  // HTML or any raw text
  if(!ext || ext == 'html')
  {
    return $.ajax({
      url: path,
      async: false,
      dataType: 'html'
    }).responseText;
  }

  // XML
  if(ext == 'xml')
  {
    return $.ajax({
      url: path,
      async: false,
      dataType: 'xml'
    }).responseXML;
  }
}


// Get data
Data.get = function()
{
  $.get('script/server/ajax.php', {
    action: 'get',
    book_id: Current.book,
    chapter: Current.chap
  }, function(data){ 
      Render.userContent(data);
  });
}


// Send data
Data.send = function()
{
  $.get('script/server/ajax.php', $('#form').serialize(),
  function(){
    Data.get();
  });
}


// Convert word to number (ex: two = 2)
Data.wordNum = function(word)
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