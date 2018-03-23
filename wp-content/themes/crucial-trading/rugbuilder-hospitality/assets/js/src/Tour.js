RugBuilder.prototype.Tour = function() {
  const RS = ReduxStore;
  const store = RS.store;

  console.log("TOUR INI");

  // Instance the tour
  var tour = new Tour({
    backdrop: true,
    debug: false,
    orphan: true,
    delay: 3,

    onShow: function (tour) {
      console.log('tour on !!!!!')
      PubSub.publish('tourOn')
    },

    onStart: function (tour) {
      PubSub.publish('tourOn')
    },

    onEnd: function () {
      console.log('TOUR END')

      PubSub.publish('tourOff')

  		location.reload();
  		let url = window.location.href
  		url = url.replace("summary", "")
  		window.location.href = url
    }
  });

  /* Begin */
  tour.addStep({
      element: "#drawer",
      title: "STRUCTURES",
      content: "Use this panel to choose your structure",
      placement: "right",

      onShow: function (key, value) {
        PubSub.publish('tourOn')
        PubSub.publish('tourStepZero')
      }
  })

  /* Step One */
  tour.addStep({
      element: "#progressMenuLower",
      title: "PROGRESS BAR",
      content: "Use the progress bar to build your design",
      placement: "bottom",

      onShow: function (key, value) {
        PubSub.publish('tourStepOne')
      }
  })

  /* Step Two */
  tour.addStep({
    element: "#progressMenuLink1",
    title: "COLOURS",
    content: "Click a colour to change your design",
    placement: "bottom",
    backdropPadding: 20,

    onShow: function (key, value) {
      PubSub.publish('tourStepTwo')
    }
  })

  /* Step Three */
  tour.addStep({
    element: "#progressMenuLink1",
    title: "HOVER EFFECT",
    content: "Hover over your colour to see what part of the design it effects",
    placement: "bottom",
    backdropPadding: 20,

    onShow: function (key, value) {
      PubSub.publish('tourStepThree')
    }
  })

  /* Step Four */
  tour.addStep({
    element: "#drawer",
    title: "CHOOSE A COLOUR",
    content: "Choose a colour from the drawer to add it to your design",
    placement: "right",

    onShow: function (key, value) {
      PubSub.publish('tourStepFour')
    }
  })

  /* Step Five */
  tour.addStep({
    element: "#progressMenuLower",
    title: "CHANGE YOUR DESIGN",
    content: "To change your design click on a colour or the structure in the progress bar",
    placement: "bottom",

    onShow: function (key, value) {
      PubSub.publish('tourStepFive')
    }
  })

  /* Step Six */
  tour.addStep({
    element: "#hosp_builder_choices",
    title: "THE SIDE BAR",
    content: "All of the parts you have selected will be listed in the side bar",
    placement: "left",
    backdropPadding: 10,
  })

  /* Step Seven */
  tour.addStep({
    element: "#restartBuild",
    title: "START AGAIN",
    content: "If you wish to start your design again then just click start agaiN",
    placement: "bottom",
    backdropPadding: 10,
  })

  /* Step Eight */
  tour.addStep({
    element: "#finishDesignButton",
    title: "DESIGN COMPLETE",
    content: 'Click "finish your design" to print or email your selections',
    placement: "top",
    backdropPadding: 10,

    onShow: function (key, value) {
      console.log('on show >> tour step eight');
      PubSub.publish('tourStepEight')
    }
  })

  /* Step Nine */
  tour.addStep({
    element: "#summaryButtons",
    title: "PRINT OR EMAIL",
    content: "Print or email to save your details or send to the manufacturer",
    placement: "top",
    backdropPadding: 10,

    onShow: function (key, value) {
      PubSub.publish('tourStepNine')
    }
  })

  /* Step Ten */
  tour.addStep({
    element: "#summaryViewEdit",
    title: "GOT A BETTER IDEA?",
    content: "Click edit to make edits to your design",
    placement: "top",
    backdropPadding: 10,
  })

  /* Step Eleven */
  tour.addStep({
    element: "#exitBuilder",
    title: "FINISHED",
    content: "When you're finished just hit the exit button to return to the crucial trading website",
    placement: "bottom",
    backdropPadding: 10,
  })

  tour.setCurrentStep(0);
  tour.init();
  tour.start();
}
