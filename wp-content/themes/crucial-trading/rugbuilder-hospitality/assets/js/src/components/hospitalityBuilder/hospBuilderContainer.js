RugBuilder.prototype.HospitalityBuilderComponent = function () {
  const Connect = window.ReactRedux.connect;
  const Router = window.ReactRouterDOM.BrowserRouter;
  const WithRouter = window.ReactRouterDOM.withRouter;
  const R = rugBuilder;
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
        progressMenuHeader: 'CHOOSE A STRUCTURE'
      }

      this.currentStage = 0;
      store.subscribe(this.handleReduxStoreChange)

      this.tourStepNineL = PubSub.subscribe('tourStepNine', this.tourStepNine)
    }

    componentWillUnmount() {
      PubSub.unsubscribe(this.tourStepNineL)
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.props.location !== prevProps.location) {
        this.urlChanged();
      }
    }


    /**
     *
     */
    tourStepNine = () => {
      console.log('<!---------------- tour step nine ------------------>')

      this.props.history.push(`/summary`)
    }


    /**
     * detected change in the url
     */
    urlChanged = () => {
      if (this.props.location.pathname === "/summary") {
        this.setState({'summaryViewMode': true});
      }

      if (this.props.location.pathname === "/") {
        this.setState({'summaryViewMode': false});
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
      console.log(' <!-------------- select new image' + newImage);

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
      this.setState({showEmailModal: !this.state.showEmailModal});
    }

    /**
     * print screen
     */
    print = () => {
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
        />
      )
    }
  }

  const mapStateToProps = (state) => ({
    progressStage: store.getState[0]
  })



  return WithRouter(HospitalityBuilder);
}
