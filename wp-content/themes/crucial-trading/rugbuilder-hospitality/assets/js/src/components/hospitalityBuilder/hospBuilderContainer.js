RugBuilder.prototype.HospitalityBuilderComponent = function () {
  const Connect = window.ReactRedux.connect;
  const Router = window.ReactRouterDOM.BrowserRouter;
  const WithRouter = window.ReactRouterDOM.withRouter;
  const R = rugBuilder;
  const RS = ReduxStore;
  const store = ReduxStore.store;
  const HospBuilderView = R.hospBuilderViewComponent();
  const HosBuilderSummaryView = R.hospBuilderSummaryViewComponent();


  class HospitalityBuilder extends React.Component {
    constructor() {
      super();

      this.state = {
        canvasImages: [],
        fadeOtherCanvasImages: false,
        submitted: false,
        stageInFocus: 0,
        selectedStructure: {},
        storeCanvasImages: [],
        selectedChoiceCount: 0,
        summaryViewMode: false,
        showEmailModal: false,
        progressMenuHeader: 'CHOOSE A STRUCTURE',
        showCanvasMask: false,
        disableButtons: false
      }

      this.currentStage = 0;
      store.subscribe(this.handleReduxStoreChange)
    }

    componentDidMount() {
      R.Tour();
      this.tourStepZeroL = PubSub.subscribe('tourStepZero', this.tourStepZero)
      this.tourStepThreeL = PubSub.subscribe('tourStepThree', this.tourStepThree)
      this.tourStepFourL = PubSub.subscribe('tourStepFour', this.tourStepFour)
      this.tourStepEightL = PubSub.subscribe('tourStepEight', this.tourStepEight)
      this.tourStepNineL = PubSub.subscribe('tourStepNine', this.tourStepNine)
      this.tourOnL = PubSub.subscribe('tourOn', this.tourOn)
      this.tourOffL = PubSub.subscribe('tourOff', this.tourOff)
    }

    componentWillUnmount() {
      PubSub.unsubscribe(this.tourStepThreeL)
      PubSub.unsubscribe(this.tourStepFourL)
      PubSub.unsubscribe(this.tourStepEightL)
      PubSub.unsubscribe(this.tourStepNineL)
      PubSub.unsubscribe(this.tourOnL)
      PubSub.unsubscribe(this.tourOffL)
      PubSub.unsubscribe(this.tourStepZeroL)
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.props.location !== prevProps.location) {
        this.urlChanged();
      }
    }

    /**
     *
     */
    tourStepZero = () => {
      // RS.dispatchUpdateCanvasImagesAction([]);
    }

    /**
     *
     */
    tourOn = () => {
      this.setState({disableButtons: true})
    }

    /**
     *
     */
    tourOff = () => {
      this.setState({disableButtons: false})
    }


    /**
     *
     */
    tourStepThree = () => {
      this.setState({showCanvasMask: true})
    }

    /**
     *
     */
    tourStepFour = () => {
      this.setState({showCanvasMask: false})

      const arr = [
        {
          stageIndex: 1,
          alt: "G70000",
          src: "https://d105txpzekqrfa.cloudfront.net/hospitality/structures/H4350/G70000/colour-1.png",
          jpg: "https://d105txpzekqrfa.cloudfront.net/hospitality/structures/H4350/G70000/colour-1.jpg",
          img: "https://d105txpzekqrfa.cloudfront.net/hospitality/colours/G70000.jpg"
        }
      ]

      // store.dispatchUpdateCanvasImagesAction(arr)
    }

    /**
     *
     */
    tourStepEight = () => {
      console.log('T step 8 >> push to edit')

      this.props.history.push(`/`)
    }


    /**
     *
     */
    tourStepNine = () => {
      console.log('T step 9 >> push to summary')
      this.props.history.push(`/summary`)
    }


    /**
     * detected change in the url
     */
    urlChanged = () => {

      try {
        if (this.props.location.pathname === "/summary") {
          this.setState({'summaryViewMode': true});
        }

        if (this.props.location.pathname === "/") {
          this.setState({'summaryViewMode': false});
        }
      } catch(err) {
        console.log("ERRROR")
        console.log(err)
      }
    }


    /**
     * listen to changes in the redux store and update state to changes in store
     */
    handleReduxStoreChange = () => {
      this.setState({
        storeCanvasImages: store.getState().canvasImages[0],
      })

      if (!store.getState().canvasImages[0]) { return }

      const selectedCanvasImages =
        this.state.storeCanvasImages.filter(function (x) {
          return x.selected;
        });

      this.setState({selectedChoiceCount: selectedCanvasImages.length})
    }

    /**
     * when user select a new stage update 'current stage' used for canvas images
     */
    changeStage = (stage) => {
      this.currentStage = stage;

      if (stage === 0) {
        this.setState({progressMenuHeader: 'CHOOSE A STRUCTURE'})
        return
      }

      this.setState({progressMenuHeader: 'CHOOSE A COLOUR'})
    }

    /**
     * select new Image that will be displayed in the Canvas which makes up the
     * custom material built.
     * If already selected stage then update array-> else push
     */
    selectNewImage = (newImage) => {
      newImage.stageIndex = this.currentStage;
      var newImages = this.state.canvasImages;

      let x = -1
      for (let i = 0; i < newImages.length; ++i) {
        if (newImages[i].stageIndex === this.currentStage) {
          x = i
          break
        }
      }

      /* update previous stage canvas image */
      if (x !== -1) {
        if (this.currentStage === 0) {
          newImages = [];
          newImages.push(newImage);
        } else {
          newImages.splice(x, 1, newImage);
        }
      }

      /* add new canvas image */
      else {
        newImages.push(newImage);
      }

      this.setState({canvasImages: newImages });
    }

    /**
     * when a stage is being hovered over in the progress menu reduce the opacity
     * of all the images apart from the one in focus
     */
    highlightCanvasImageOnHover = (stage) => {
      this.setState({
        fadeOtherCanvasImages: true,
        stageInFocus: stage
      })
    }

    /**
     *
     */
    removeHighlightOnCanvasImage = () => {
      this.setState({fadeOtherCanvasImages: false})
    }

    /**
     *
     */
    toggleEmailVisible = () => {
      if (this.state.disableButtons) {
        throw Error('cant email while in tour')
      }

      this.setState({showEmailModal: !this.state.showEmailModal});
    }

    /**
     * print screen
     */
    print = () => {
      if (this.state.disableButtons) {
        throw Error('cant print while in tour')
      }

      window.print();
    }


    render() {
      if (!this.state.summaryViewMode) {
        return (
          <HospBuilderView
            changeStage={this.changeStage}
            canvasImages={this.state.canvasImages}
            highlightCanvasImageOnHover={this.highlightCanvasImageOnHover}
            removeHighlightOnCanvasImage={this.removeHighlightOnCanvasImage}
            fadeOtherCanvasImages={this.state.fadeOtherCanvasImages}
            storeCanvasImages={this.state.storeCanvasImages}
            selectedChoiceCount={this.state.selectedChoiceCount}
            selectNewImage={this.selectNewImage}
            stageInFocus={this.state.stageInFocus}
            progressMenuHeader={this.state.progressMenuHeader}
            showCanvasMask={this.state.showCanvasMask}
            disableButtons={this.state.disableButtons}
          />
        )
      }

      return (
        <HosBuilderSummaryView
          fadeOtherCanvasImages={false}
          storeCanvasImages={this.state.storeCanvasImages}
          toggleEmailVisible={this.toggleEmailVisible}
          showEmailModal={this.state.showEmailModal}
          stageInFocus={false}
          fadeOtherCanvasImages={false}
          print={this.print}
          disableButtons={this.state.disableButtons}
        />
      )
    }
  }

  const mapStateToProps = (state) => ({
    progressStage: store.getState[0]
  })



  return WithRouter(HospitalityBuilder);
}
