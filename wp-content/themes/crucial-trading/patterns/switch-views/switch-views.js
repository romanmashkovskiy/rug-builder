$(document).ready(function() {
  var rCardEl = $('.r_card');
  var accordionEl = $('.retailer-result-dropdown');

  var switchToViewOneButton = $('#switch-views-one');
  var switchToViewTwoButton = $('#switch-views-two');
  var listViewSVG = $('#list-view-retailer');
  var cardViewSVG = $('#card-view-retailer');

  switchToViewOneButton.click(function() {
    listViewSVG.css("stroke", "rgb(0, 0, 0)");
    cardViewSVG.css("stroke", "rgb(204, 204, 204)");
    rCardEl.css('display', 'none');
    accordionEl.css('display', 'block');
  })

  /* Hide Accordion and show old style cards */
  switchToViewTwoButton.click(function() {
    cardViewSVG.css("stroke", "rgb(0, 0, 0)");
    listViewSVG.css("stroke", "rgb(204, 204, 204)");
    accordionEl.css('display', 'none');
    rCardEl.css('display', 'block')
  })

  var hiddenInput = $('#get_country').val()
  if (hiddenInput) {
    rCardEl.css('display', 'block')

    // Also hide the switch view container
    $('.switch_views').css('display', 'none')
  }
})
