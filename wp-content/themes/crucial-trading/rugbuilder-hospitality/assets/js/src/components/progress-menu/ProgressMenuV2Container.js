RugBuilder.prototype.progressMenuV2Component = function () {
  const R = rugBuilder;
  const ProgressMenuV2View = R.progressMenuViewComponent();
  // const ProgressMenuV2View = progressMenuViewComponent(R);

  class ProgressMenuV2 extends React.Component {
    constructor() {
      super();

      this.state = {
        stages : ['Structure'],
        showSubmit: false,
        currentStage: 0
      }
    }

    componentDidMount() {
      /* register subscribers to publishers */
      PubSub.subscribe('newStructure', this.structureMutated);
			PubSub.subscribe('newColor', this.colorMutated);
    }

    /**
     * handlers
     */
    handleCurrentStage = (stage) => {
      this.setState({currentStage: stage})
    }

    /**
     * when structure has changed rebuild stages array with
     * 'structure' and all colors available to that structure
     */
    structureMutated = (sub, code) => {
      const colors = R.numStructureColors[code];
      const stages = [ 'Structure' ];

      for ( let i = 0; i < colors; i++ ) {
        let x = i + 1;
        stages.push('Colour ' + x);
      }

      this.setState({
        stages     : stages,
        showSubmit : false
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
          handleCurrentStage={this.handleCurrentStage}
        />
    )};
  }

  ReactDOM.render(
    <ProgressMenuV2 />, document.querySelector('#hosp_builder_progress-menu')
  );

  // return ProgressMenuV2;
}
