RugBuilder.prototype.HospitalityBuilderComponent = function () {
  const Connect = window.ReactRedux.connect;
  const Router = window.ReactRouterDOM.BrowserRouter;

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
        storeCanvasImages: store.getState().canvasImages[0],
        summaryViewMode: false,
        showEmailModal: false
      }

      this.currentStage = 0;
      store.subscribe(this.handleReduxStoreChange)
    }

    componentDidUpdate(prevProps, prevState) {
      if (this.props.location !== prevProps.location) {
        this.urlChanged();
      }
    }

    /**
     * detected change in the url
     */
    urlChanged = () => {
      if (
      (this.props.location.pathname === "/crucial-trading/hospitality-builder/summary") ||
        (this.props.location.pathname === "/~crucialtrading/hospitality-builder/summary")
      ) {
        this.setState({'summaryViewMode': true});
      }
    }


    /**
     * listen to changes in the redux store and update state to changes in store
     */
    handleReduxStoreChange = () => {
      this.setState({
        storeCanvasImages: store.getState().canvasImages[0],
      })

      console.log('store canvas images ---->')
      console.log(store.getState().canvasImages[0])
    }

    /**
     * when user select a new stage update 'current stage' used for canvas images
     */
    changeStage = (stage) => {
      this.currentStage = stage;
    }

    /**
     * select new Image that will be displayed in the Canvas which makes up the
     * custom material built.
     * If already selected stage then update array-> else push
     */
    selectNewImage = (newImage) => {
      newImage.stageIndex = this.currentStage;
      var newImages = this.state.canvasImages;

      const x = newImages.findIndex((image) => {
        return image.stageIndex === this.currentStage
      })

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

    removeHighlightOnCanvasImage = () => {
      this.setState({fadeOtherCanvasImages: false})
    }

    /**
     *
     */
    toggleEmailVisible = () => {
      console.log('toggle email visible');

      this.setState({showEmailModal: !this.state.showEmailModal});
    }

    /**
     * print screen
     */
    print = () => {
      console.log('print screen');
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
            selectNewImage={this.selectNewImage}
            stageInFocus={this.state.stageInFocus}
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

  return HospitalityBuilder;
}
