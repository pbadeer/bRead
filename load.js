Bread.Load = new Object();
var Load = Bread.Load;


// Empties main column
Load.clear = function(col)
{
  $(Current.output[col]).html('');
}


// Opens/loads various filetypes
Load.file = function(path, ext)
{
  // HTML (return)
  if(ext == 'html')
  {
    return $.ajax({
      url: path,
      async: false,
      dataType: 'html'
    }).responseText;
  }

  // XML (return)
  if(ext == 'xml')
  {
    return $.ajax({
      url: path,
      async: false,
      dataType: 'xml'
    }).responseXML;
  }

  // JS (load)
  if(ext == 'js')
  {  
    var tag = document.createElement('script');
    tag.setAttribute('type','text/javascript');
    tag.setAttribute('src', path);
    $('head').append(tag);
  }
  
  // CSS (load)
  if(ext == 'css')
  {
    var tag = document.createElement('link');
    tag.setAttribute('rel', 'stylesheet');
    tag.setAttribute('type', 'text/css');
    tag.setAttribute('href', path);
    $('head').append(tag);
  }
}


// Loads columns and fills with column-type-specified content
Load.cols = function(book, n)
{
  // Set current book
  if(!book) book = Current.book;
  else Current.book = book;

  // Set current chapter
  if(!n) n = Current.chap;
  else Current.chap = n;

  // Loop through (and fill) columns
  for(i = 1; i <= Current.cols; i++){

    // Column type: BIBLE
    if(types[Current.type[i]] == 'bible')
    {
      xml = this.file('bible/' + Current.tran[i] + '/' + book + '/' + n + '.xml', 'xml');
      xsl = this.file('index.xsl', 'xml');

      xsltProcessor = new XSLTProcessor();
      xsltProcessor.importStylesheet(xsl);
      html = xsltProcessor.transformToFragment(xml,document);

      this.clear(i);
      $(Current.output[i]).append(html);
    }

    // Column type: NOTES
    if(types[Current.type[i]] == 'notes')
    {
      this.clear(i);
    }

  }

  // Run after-load stuff
  this.after();
}


// Things to run after content-load (Bread.Load.cols())
Load.after = function()
{
  // Fills input with current passage title
  $(Current.input).val(Current.book + ' ' + Current.chap);

  // Verse ref grabber
  $('.verse').click(function(){
    $(Current.input).val( $(this).attr('ref') );
  });

  // Load any after-content-load view settings
  View.load.after();
}


// Load previous chapter
Load.prev = function()
{
  if(Current.chap > 1)
    this.cols(Current.book, Current.chap - 1);
}


// Load next chapter
Load.next = function()
{
  this.cols(Current.book, Current.chap + 1);
}