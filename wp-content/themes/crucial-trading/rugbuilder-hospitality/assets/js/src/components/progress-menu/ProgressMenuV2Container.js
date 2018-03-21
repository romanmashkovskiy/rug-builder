RugBuilder.prototype.progressMenuV2Component = function () {
  const Router = window.ReactRouterDOM.BrowserRouter;
  const store = ReduxStore.store;

  const R = rugBuilder;
  const ProgressMenuV2View = R.progressMenuViewComponent();


  class ProgressMenuV2 extends React.Component {
    constructor() {
      super();

      this.state = {
        stages : ['Structure'],
        showSubmit: true,
        currentStage: 0,
        storeCanvasImages: store.getState().canvasImages[0],

        canScrollRight:  true,
        canScrollLeft: true
      }

      store.subscribe(this.handleReduxStoreChange)
    }


    componentDidMount() {
      /* register subscribers to publishers */
      // PubSub.subscribe('newStructure', this.structureMutated);
			PubSub.subscribe('newColor', this.colorMutated);
      this.tourStepTwoL = PubSub.subscribe('tourStepTwo', this.tourStepTwo)
      this.tourStepThreeL = PubSub.subscribe('tourStepThree', this.tourStepThree)
      this.tourStepFiveL = PubSub.subscribe('tourStepFive', this.tourStepFive)

      const structureCode = store.getState().canvasImages[0] ?
        store.getState().canvasImages[0][0].alt : null;

      if (structureCode) {
        this.structureMutated(structureCode);
      }
    }

    componentWillUnmount() {
      PubSub.unsubscribe(this.tourStepTwoL)
      PubSub.unsubscribe(this.tourStepThreeL)
      PubSub.unsubscribe(this.tourStepFiveL)
    }


    /**
     *
     */
    tourStepTwo = () => {
      console.log('<--------- tour step two ------------>')

      R.stageVisited[1] = true
      R.colorStage = 1
      PubSub.publish('newStage', 1)
      this.handleCurrentStage(1)
    }

    /**
     *
     */
    tourStepThree = () => {
      console.log('<------------- tour step three ------------>')

      this.props.highlightCanvasImageOnHover(1)
    }

    /**
     *
     */
    tourStepFive = () => {
      console.log('<---------------- tour step five (remove highlight) ---------------->')
      this.props.removeHighlightOnCanvasImage()
    }


    /**
     * listen to changes in the redux store and update state to changes in store
     */
    handleReduxStoreChange = () => {
      if (!store.getState().canvasImages) { return }
      if (!store.getState().canvasImages[0]) { return }

      this.setState({
        storeCanvasImages: store.getState().canvasImages[0]
      })

      this.structureMutated(store.getState().canvasImages[0][0].alt);
    }

    /**
     * handlers
     */
    handleCurrentStage = (stage) => {
      this.setState({currentStage: stage})
      this.props.changeStage(stage);
    }

    /**
     * when structure has changed rebuild stages array with
     * 'structure' and all colors available to that structure
     */
    structureMutated = (code) => {
      const colors = R.numStructureColors[code];
      const stages = [ 'Structure' ];

      for ( let i = 0; i < colors; i++ ) {
        let x = i + 1;
        stages.push('Colour ' + x);
      }

      this.setState({
        stages     : stages,

      });
    }

    /**
     * when has changed, identify if 'show submit' should be set to true dependent
     * on the color stage and stage visited
     */
    colorMutated = () => {
      if (
        (R.colorStage > 0 && ( R.colorStage === this.state.stages.length - 1)) ||
        (R.stageVisited[this.state.stages.length - 1])
      ) {
        this.setState({ showSubmit : true });
        return;
      }

      // this.setState({ showSubmit : false });
    }

    /**
     *
     */
    determineOverflowOfStagesMenu = (content, container) => {
      var containerMetrics = container.getBoundingClientRect();
      var containerMetricsRight = Math.floor(containerMetrics.right);
      var containerMetricsLeft = Math.floor(containerMetrics.left);
      var contentMetrics = content.getBoundingClientRect();
      var contentMetricsRight = Math.floor(contentMetrics.right);
      var contentMetricsLeft = Math.floor(contentMetrics.left);

      if (containerMetricsLeft > contentMetricsLeft && containerMetricsRight < contentMetricsRight) {
         return "both";
      } else if (contentMetricsLeft < containerMetricsLeft) {
         return "left";
      } else if (contentMetricsRight > containerMetricsRight) {
         return "right";
      }

      return "none";
    }

    render() {
      return (
        <ProgressMenuV2View
          stages={this.state.stages}
          currentStage={this.state.currentStage}
          showSubmit={this.state.showSubmit}
          handleCurrentStage={this.handleCurrentStage}
          selectedCanvasImages={this.state.storeCanvasImages}
          highlightCanvasImageOnHover={this.props.highlightCanvasImageOnHover}
          removeHighlightOnCanvasImage={this.props.removeHighlightOnCanvasImage}
          headerText={this.props.headerText}
          disableLinkHover={this.props.disableLinkHover}
          canScrollLeft={this.state.canScrollLeft}
          canScrollRight={this.state.canScrollRight}
        />
    )};
  }


  return ProgressMenuV2;
}
