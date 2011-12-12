Bread.Data = new Object();
var Data = Bread.Data;


// Create empty object for data storage
Data.content = {};


// Send data to server
Data.send = function()
{
  $.get('script/server/ajax.php', $('#form').serialize());
}