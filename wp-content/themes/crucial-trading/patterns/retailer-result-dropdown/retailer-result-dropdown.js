$(document).ready(function() {
  $('.open-acc').click(function() {
    $(this).find('img').toggleClass("rotate-icon");
    console.log( $(this))
    //transform: rotate(45deg);
  })
})
