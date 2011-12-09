Bread.View = new Object();
View = Bread.View;


// Set path
View.path = 'views/';


// Load a view
View.load = function(view)
{
  // Load JS
  Load.file(this.path + view + '/' + view + '.js', 'js');

  // Set current view
  Current.view = view;
}


// Load any after-column-load view settings
View.load.after = function()
{
  if(Current.view == 'nums')
    Nums.load();
}