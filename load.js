Bread.Load = new Object();
var Load = Bread.Load;


// Empties main column
Load.clear = function(col)
{
  $(output[col]).html('');
}


// Opens/loads various filetypes
Load.file = function(filename, ext)
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
Load.view = function(view)
{
  // Sets path and filename (without extension)
  this.view.path = 'views/' + view + '/' + view;
  this.view.css = function(){ openFile(path + '.css', 'css') };

  // Load JS
  this.file(this.view.path + '.js', 'js');

  // Resets current view
  Current.view = view;
}


// Loads columns and fills with column-type-specified content
Load.cols = function(book, n)
{
  if(!book) book = Current.book;
  else Current.book = book;

  if(!n) n = Current.chap;
  else Current.chap = n;

  for(i = 0; i <= Current.cols; i++){
    if(i == 0) continue;

    // Column type: BIBLE
    if(types[Current.type[i]] == 'bible')
    {
      xml = this.file('bible/' + Current.tran[i] + '/' + book + '/' + n + '.xml', 'xml');
      xsl = this.file('index.xsl', 'xml');

      xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl);
      html = xsltProcessor.transformToFragment(xml,document);

      this.clear(i);
      $(output[i]).append(html);
    }

    // Column type: NOTES
    if(types[Current.type[i]] == 'notes')
    {
      this.clear(i);
    }
  }

  this.after();
}


// Things to run after content-load (Bread.Load.cols())
Load.after = function()
{
  // Changes input to current passage title
  $(input).val(Current.book + ' ' + Current.chap);

  // Verse ref grabber
  $('.verse').click(function(){
    $(input).val( $(this).attr('ref') );
  });
}


// Previous chapter
Load.prev = function()
{
  this.cols(Current.book, Current.chap - 1);
}


// Next chapter
Load.next = function()
{
  this.cols(Current.book, Current.chap + 1);
}