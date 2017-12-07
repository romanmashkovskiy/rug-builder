RugBuilder.prototype.progressMenuV2 = function () {
  const R = rugBuilder;

  class ProgressMenuV2 extends React.Component {
    constructor() {
      super();

      this.setState({
        stages : ['Structure'],
        showSubmit: false
      });
    }

    componentDidMount() {
      /* register subscribers to publishers */
      PubSub.subscribe('newStructure', this.structureMutated);
			PubSub.subscribe('newColor', this.colorMutated);
			PubSub.subscribe('newStage', this.stageHasChanged);
    }

    /**
     * when structure has changed rebuild stages array with
     * 'structure' and all colors found in 'numStructureColors'
     */
    structureMutated = () => {
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

    /**
     * if stage has changed to 0 set stages back to default state
     */
    stageChanged = (x, stage) => {
      if (stage === 0) {
        this.setState({
					stages     : [ 'Structure' ],
					showSubmit : false
				}, () => { this.forceUpdate() });
      }

      this.forceUpdate();
    }

    render() {

    }
  }
}
