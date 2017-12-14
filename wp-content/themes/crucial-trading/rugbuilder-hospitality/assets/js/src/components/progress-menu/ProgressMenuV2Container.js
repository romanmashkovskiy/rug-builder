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
        storeCanvasImages: []
      }

      store.subscribe(this.handleReduxStoreChange)
      // Router.listen(() => { console.log('url change'); })
    }

    componentDidMount() {
      /* register subscribers to publishers */
      // PubSub.subscribe('newStructure', this.structureMutated);
			PubSub.subscribe('newColor', this.colorMutated);

      const structureCode = store.getState().canvasImages[0] ?
        store.getState().canvasImages[0][0].alt : null;

      if (structureCode) {
        console.log('is structure code !!');
        this.structureMutated(structureCode);
      }
    }

    /**
     * listen to changes in the redux store and update state to changes in store
     */
    handleReduxStoreChange = () => {
      this.setState({
        storeCanvasImages: store.getState().canvasImages[0]
      })

      this.structureMutated(store.getState().canvasImages[0][0].alt);

      console.log('alt change');
      console.log(store.getState().canvasImages[0]);
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

      this.setState({ showSubmit : false });
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
        />
    )};
  }

  // ReactDOM.render(
  //   <ProgressMenuV2 />, document.querySelector('#hosp_builder_progress-menu')
  // );

  return ProgressMenuV2;
}
