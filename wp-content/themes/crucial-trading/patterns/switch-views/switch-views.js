$(document).ready(function() {
  var rCardEl = $('.r_card');
  var accordionEl = $('.retailer-result-dropdown');

  var switchToViewOneButton = $('#switch-views-one');
  var switchToViewTwoButton = $('#switch-views-two');

  switchToViewOneButton.click(function() {
    rCardEl.css('display', 'none');
    accordionEl.css('display', 'block');
  })

  /* Hide Accordion and show old style cards */
  switchToViewTwoButton.click(function() {
    accordionEl.css('display', 'none');
    rCardEl.css('display', 'block')
  })
})
