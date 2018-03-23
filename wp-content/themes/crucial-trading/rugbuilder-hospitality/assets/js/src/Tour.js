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
      content: "USE THIS PANEL TO CHOOSE YOUR STRUCTURE",
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
      content: "USE THE PROGRESS BAR TO BUILD YOUR DESIGN",
      placement: "bottom",

      onShow: function (key, value) {
        PubSub.publish('tourStepOne')
      }
  })

  /* Step Two */
  tour.addStep({
    element: "#progressMenuLink1",
    title: "COLOURS",
    content: "CLICK A COLOUR TO CHANGE YOUR DESIGN",
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
    content: "HOVER OVER YOUR COLOUR TO SEE WHAT PART OF THE DESIGN IT EFFECTS",
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
    content: "CHOOSE A COLOUR FROM THE DRAWER TO ADD IT TO YOUR DESIGN",
    placement: "right",

    onShow: function (key, value) {
      PubSub.publish('tourStepFour')
    }
  })

  /* Step Five */
  tour.addStep({
    element: "#progressMenuLower",
    title: "CHANGE YOUR DESIGN",
    content: "TO CHANGE YOUR DESIGN CLICK ON A COLOUR OR THE STRUCTURE IN THE PROGRESS BAR",
    placement: "bottom",

    onShow: function (key, value) {
      PubSub.publish('tourStepFive')
    }
  })

  /* Step Six */
  tour.addStep({
    element: "#hosp_builder_choices",
    title: "THE SIDE BAR",
    content: "ALL OF the PARTS YOU HAVE SELECTED WILL BE LISTED IN THE SIDE BAR",
    placement: "left",
    backdropPadding: 10,
  })

  /* Step Seven */
  tour.addStep({
    element: "#restartBuild",
    title: "START AGAIN",
    content: "IF YOU WISH TO START YOUR DESIGN AGAIN THEN JUST CLICK START AGAIN",
    placement: "bottom",
    backdropPadding: 10,
  })

  /* Step Eight */
  tour.addStep({
    element: "#finishDesignButton",
    title: "DESIGN COMPLETE",
    content: 'CLICK "FINISH YOUR DESIGN" TO PRINT OR EMAIL YOUR SELECTIONS',
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
    content: "PRINT OR EMAIL TO SAVE YOUR DETAILS OR SEND TO THE MANUFACTURER",
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
    content: "CLICK EDIT TO MAKE EDITS TO YOUR DESIGN",
    placement: "top",
    backdropPadding: 10,
  })

  /* Step Eleven */
  tour.addStep({
    element: "#exitBuilder",
    title: "FINISHED",
    content: "WHEN YOU'RE FINISHED JUST HIT THE EXIT BUTTON TO RETURN TO THE CRUCIAL TRADING WEBSITE",
    placement: "bottom",
    backdropPadding: 10,
  })

  tour.setCurrentStep(0);
  tour.init();
  tour.start();
}
