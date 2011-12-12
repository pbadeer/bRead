Bread.Data = new Object();
var Data = Bread.Data;


// Create empty object for data storage
Data.content = {};


// Send data to server
Data.send = function(type)
{
  this.content.type = type;
  
  $.get('script/server/ajax.php', this.content, function(data){
    console.log(data);
  });
}