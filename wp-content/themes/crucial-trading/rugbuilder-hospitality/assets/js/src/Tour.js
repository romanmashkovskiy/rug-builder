RugBuilder.prototype.Tour = function() {
  const RS = ReduxStore;
  const store = RS.store;

  var myElem = document.getElementById('hosp_builder_img-container');
  var drawer = document.getElementById('drawer');


  setTimeout(function() {
    console.log('TOUR !!!!!!!');

    // Instance the tour
    var tour = new Tour({
      backdrop: true,
      debug: true,
      orphan: true,
      delay: 3,
      container: "body",

      afterSetState: function (key, value) {
        // console.log('after set state >> ' + value)

         /* progess menu step */
        if (value === 1) {
          // console.log('PROGRESS MENU STEP')

          // this.props.history.push(`/summary`)

          // PubSub.publish('tourStepOne')
        }

        /* select first colour step */
        if (value === 2) {
          // console.log('SELECT FIRST COLOUR STEP')

          // PubSub.publish('tourStepTwo')
        }

        /* hover colour effect step */
        if (value === 3) {
          // console.log('HOVER COLOUR EFFECT STEP')

          // PubSub.publish('tourStepThree')
        }

        /* select a colour step */
        if (value === 5) {
          // console.log('SELECT A COLOUR STEP')

          // PubSub.publish('tourStepFive')
        }

        if (value === 9) {
          // console.log("SELECT FINISH YOUR DESIGN STEP")
          // PubSub.publish('tourStepNine')

          /* TODO redirect to summary view */

        }
      },


      // onShow: function (key, value) {
      //   console.log('on show')
      //   console.log(key)
      //   console.log(value)
      //
      //   if (value === 1) {
      //     tour.placement = 'bottom'
      //     console.log('SET PLACEMENT TO BOTTOM')
      //   }
      //
      //   if (value === 9) {
      //     console.log('ON SHOW STEP 9 >> publish')
      //     PubSub.publish('tourStepNine')
      //   }
      // },

      steps: [
        // {
        //   element: "#drawer",
        //   title: "STRUCTURES",
        //   content: "USE THIS PANEL TO CHOOSE YOUR STRUCTURE"
        // },
        // {
        //   element: "#progressMenuLower",
        //   title: "PROGRESS BAR",
        //   content: "USE THE PROGRESS BAR TO BUILD YOUR DESIGN"
        // },
        // {
        //   element: "#progressMenuLink1",
        //   title: "COLOURS",
        //   content: "CLICK A COLOUR TO CHANGE YOUR DESIGN"
        // },
        // {
        //   element: "#progressMenuLink1",
        //   title: "HOVER EFFECT",
        //   content: "HOVER OVER YOUR COLOUR TO SEE WHAT PART OF THE DESIGN IT EFFECTS"
        // },
        // {
        //   element: "#drawer",
        //   title: "CHOOSE A COLOUR",
        //   content: "CHOOSE A COLOUR FROM THE DRAWER TO ADD IT TO YOUR DESIGN"
        // },
        // {
        //   element: "#progressMenuLower",
        //   title: "CHANGE YOUR DESIGN",
        //   content: "TO CHANGE YOUR DESIGN CLICK ON A COLOUR OR THE STRUCTURE IN THE PROGRESS BAR"
        // },
        // {
        //   element: "#hosp_builder_choices",
        //   title: "THE SIDE BAR",
        //   content: "ALL OF the PARTS YOU HAVE SELECTED WILL BE LISTED IN THE SIDE BAR"
        // },
        // {
        //   element: "#restartBuild",
        //   title: "START AGAIN",
        //   content: "IF YOU WISH TO START YOUR DESIGN AGAIN THEN JUST CLICK START AGAIN"
        // },
        // {
        //   element: "#finishDesignButton",
        //   title: "DESIGN COMPLETE",
        //   content: 'CLICK "FINISH YOUR DESIGN" TO PRINT OR EMAIL YOUR SELECTIONS'
        // },
        // {
        //   element: "#summaryButtons",
        //   title: "PRINT OR EMAIL",
        //   content: "PRINT OR EMAIL TO SAVE YOUR DETAILS OR SEND TO THE MANUFACTURER"
        // },
        // {
        //   element: "#summaryViewEdit",
        //   title: "GOT A BETTER IDEA?",
        //   content: "CLICK EDIT TO MAKE EDITS TO YOUR DESIGN"
        // },
        // {
        //   element: "#exitBuilder",
        //   title: "FINISHED",
        //   content: "WHEN YOU'RE FINISHED JUST HIT THE EXIT BUTTON TO RETURN TO THE CRUCIAL TRADING WEBSITE"
        // }
      ]
    });

    /* Begin */
    tour.addStep({
        element: "#drawer",
        title: "STRUCTURES",
        content: "USE THIS PANEL TO CHOOSE YOUR STRUCTURE",
        placement: "right",
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


    tour.init();
    tour.setCurrentStep(0);
    tour.start();
  }, 3000)
}
