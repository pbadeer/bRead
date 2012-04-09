Bread.Render = new Object();
var Render = Bread.Render;


// Renders column content
Render.content = function(book, n)
{
  this.bible(book, n);

  this.userContent();

  this.after();
}


// Empties main column
Render.content.clear = function(col)
{
  $(Current.output[col]).html('');
}


// Render Bible
Render.bible = function(book, n)
{
  // Set current book
  if(!book) book = Current.book;
  else Current.book = book;

  // Set current chapter
  if(!n) n = Current.chap;
  else Current.chap = n * 1;

  // Render Bible(s, if multiple)
  for(i = 1; i <= 2; i++){
    if(types[Current.type[i]] == 'bible')
    {
      xml = Data.file('data/' + Current.tran[i] + '/' + book + '/' + n + '.xml', 'xml');
      xsl = Data.file('script/template/bible.xsl', 'xml');
      xslt = new XSLTProcessor();
      xslt.importStylesheet(xsl);
      html = xslt.transformToFragment(xml,document);
    }

    this.content.clear(i);

    $(Current.output[i]).append(html);
  }
}


// Render USER content
Render.userContent = function(data)
{
  if(!data) 
    Data.get();
  else
  {
    xml = $.parseXML(data);
    xsl = Data.file('script/template/usercontent.xsl', 'xml');
    xslt = new XSLTProcessor();
    xslt.importStylesheet(xsl);
    content = xslt.transformToFragment(xml,document);

    //form = Data.file('script/template/form.html', 'html');
    html = content; // In the future this would be form + content

    this.content.clear(2);

    $(Current.output[2]).append(html);
  }
}


// Things to render after content-load
Render.after = function()
{
  // Fills input with current book and chapter
  $(Current.input.book).text(Book[Current.book].name);
  $(Current.input.chap).val(Current.chap);

  // Make verses selectable
  $('.chapter').selectable({
    filter: '.verse',
    autoRefresh: false,
    stop: Data.form
  });
}


// Render/load previous chapter
Render.previousChapter = function()
{
  if(Current.chap > 1)
    this.content(Current.book, Current.chap - 1);
  else if(Current.chap == 1 && Current.book != 1)
    this.content(Current.book - 1, Book[Current.book - 1].chapters);
}


// Render/load next chapter
Render.nextChapter = function()
{
  if(Current.chap < Book[Current.book].chapters)
    this.content(Current.book, Current.chap + 1);
  else if(Current.chap == Book[Current.book].chapters && Current.book != 66)
    this.content(Current.book + 1, 1);
}