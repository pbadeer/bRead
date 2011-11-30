// Empties main column
function clear(col)
{
  $(output[col]).html('');
}

// Opens/loads various filetypes
function openFile(filename, ext)
{
  // HTML (return)
  if(ext == 'html')
  {
    return $.ajax({
      url: filename,
      async: false,
      dataType: 'html'
    }).responseText;
  }

  // XML (return)
  if(ext == 'xml')
  {
    return $.ajax({
      url: filename,
      async: false,
      dataType: 'xml'
    }).responseXML;
  }

  // JS (load)
  if(ext == 'js')
  {  
    var tag = document.createElement('script');
    tag.setAttribute('type','text/javascript');
    tag.setAttribute('src', filename);
    $('head').append(tag);
  }
  
  // CSS (load)
  if(ext == 'css')
  {
    var tag = document.createElement('link');
    tag.setAttribute('rel', 'stylesheet');
    tag.setAttribute('type', 'text/css');
    tag.setAttribute('href', filename);
    $('head').append(tag);
  }
}

// Load a view
function loadView(view)
{
  // Sets path and filename (without extension)
  var path = 'views/' + view + '/' + view;

  // Load JS
  // openFile(path + '.js', 'js');

  // Load CSS
  // openFile(path + '.css', 'css');

  //use deferred to open the css once the js is done RUNNING (not loading, running)

  // Resets current view
  current_view = view;
}

// Main loading function, loads passages
function load(book, n)
{
  if(!book) book = current_book;
  else current_book = book;

  if(!n) n = current_chap;
  else current_chap = n;

  for(i=0; i<=current_cols; i++){
    if(i === 0) continue;

    if(types[current_type[i]] == 'bible')
    {
      xml = openFile('bible/' + current_tran[i] + '/' + book + '/' + n + '.xml', 'xml');
      xsl = openFile('index.xsl', 'xml');

      xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl);
      html = xsltProcessor.transformToFragment(xml,document);

      clear(i);
      $(output[i]).append(html);
    }

    if(types[current_type[i]] == 'notes')
    {
      clear(i);
    }
  }

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
  load(current_book, current_chap - 1);
}

// Next chapter
function next()
{
  load(current_book, current_chap + 1);
}

// Convert word to num
function wordNum(word)
{
  var words = new Array('zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten');

  for (w in word)
  {
    if($.inArray(word[w], words) == -1) continue;
    else return $.inArray(word[w], words);
  }
}

// Initialize!
window.onload = init;