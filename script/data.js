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


// Delete data (note or tag)
Data.delete = function(type, id)
{
  $.get('script/server/ajax.php', {
    action: 'delete',
    type: type,
    id: id
  }, function(data){
    alert(data)
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


// Populate the input form with the selected passage info
Data.form = function()
{
  // Get Start Node
  var sn = Data.selectedNode('s');
  // Get End Node
  var en = Data.selectedNode('e');
  // Get range
  var r = Data.selectionRange();

  var t = $(sn).parent().attr("translation"),
      sb = $(sn).parent().attr("book-id") * 1,
      sc = $(sn).parent().attr("chapter") * 1,
      sv = $(sn).attr("verse") * 1,
      si = r.startOffset * 1;

  var eb = $(en).parent().attr("book-id") * 1,
      ec = $(en).parent().attr("chapter") * 1,
      ev = $(en).attr("verse") * 1,
      ei = r.endOffset * 1;

  // Create and fill Data.content with reference info
  Data.content = {
    start_book_id: sb,
    end_book_id: eb,
    start_chapter: sc,
    end_chapter: ec,
    start_verse: sv,
    end_verse: ev,
    start_index: si,
    end_index: ei, 
    translation: t
  }

  // Populate form with Data.content info
  $('#form input, #form textarea').each(function(){
    var data = Data.content[$(this).attr('name')];
    if(data && data != null)
      $(this).val(data);
  });
}


// Get (start or end) node from selection
Data.selectedNode = function(pos) {
    var node, selection;
    if (window.getSelection) {
        selection = getSelection();
        if (pos == 's') node = selection.anchorNode;
        if (pos == 'e') node = selection.focusNode;
    }
    if (!node && document.selection) {
        selection = document.selection
        var range = selection.getRangeAt ? selection.getRangeAt(0) : selection.createRange();
        node = range.commonAncestorContainer ? range.commonAncestorContainer : range.parentElement ? range.parentElement() : range.item(0);
    }
    if (node) {
        return (node.nodeName == "#text" ? node.parentNode : node);
    }
}


// Get selection range
Data.selectionRange = function() {
    var sel;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            return sel.getRangeAt(0);
        }
    } else if (document.selection) {
        return document.selection.createRange();
    }
    return null;
}