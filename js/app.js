jQuery(function($){
  var input, output;

  input = $('#lessInput');
  output = $('#cssOutput');

  input.on('keyup', function(){
    var less = $(this).val();
  });
});