RugBuilder.prototype.drawerV2Component = function() {
  const R = rugBuilder;
  const DrawerV2View = R.drawerV2ViewComponent();


  class DrawerV2 extends React.Component {
    constructor() {
      super();

      const structures = R.structureImages;

      this.state = {
        stage: 'structures',
        timestamp: new Date(),
        open: true,
        text: 'Collapse',
        pageInView: 1,
        chosenStructure : undefined,
        chosenColors    : [],
        structures    : structures,
        numStructures : this.getNumberOfStructures(structures),
        colors        : undefined,
        numColors     : undefined,
        resize : 0,
      }

      this.STRUCTURE_ELEMS_PER_PAGE = undefined;
      this.STRUCTURE_NUM_OF_PAGES = undefined;
      this.STRUCTURE_TOP_CSS_AMOUNT = undefined;

      this.COLOR_ELEMS_PER_PAGE = undefined;
      this.COLOR_NUM_OF_PAGES = undefined;
      this.COLOR_TOP_CSS_AMOUNT = undefined;
    };

    componentDidMount() {
      /* register subs to pub subscribes (to listen to event) */
      PubSub.subscribe('newStage', this.currentStageChanged);

			this.restart = PubSub.subscribe( 'restart', this.restart );
			this.submit = PubSub.subscribe( 'submit', this.submit );

      window.addEventListener('resize', this.windowResize);
    };

    /**
     * When window is resized set structor and color elements to undefined
     * update resize state (not sure why at this moment)
     */
    windowResize = () => {
      this.STRUCTURE_ELEMS_PER_PAGE = undefined;
			this.COLOR_ELEMS_PER_PAGE     = undefined;

      this.setState((prevState) => {
				return { resize: prevState.resize + 1 };
			});
    };

    /**
     * loop through structures and return count of all structures
     * in rugbuilder that container the specified property
     * (not sure this is necassery)
     */
    getNumberOfStructures = (structures) => {
      return 0;

      number = 0;
      for ( key in structures ) {
				if ( structures.hasOwnProperty(key) ) {
					number++;
				}
			}

      return number;
    };

    /**
     * submit hospitality selected choses
     */
     submitSelectedChoices = () => {
      R.choices.structure = this.state.chosenStructure;
 			R.choices.color1    = this.state.chosenColors[0];
 			R.choices.color2    = this.state.chosenColors[1];
 			R.choices.color3    = this.state.chosenColors[2];
 			R.choices.color4    = this.state.chosenColors[3];
 			R.choices.color5    = this.state.chosenColors[4];
 			R.choices.color6    = this.state.chosenColors[5];
 			R.choices.color7    = this.state.chosenColors[6];
 			R.choices.color8    = this.state.chosenColors[7];
 			R.choices.color9    = this.state.chosenColors[8];
    }

    /**
     * update state state to structure or colors based on parameter passed in
     * (not sure where the parameter comes from)
     */
    currentStageChanged = (thing, stage) => {
      this.setState({
        stage: stage == 0 ? 'structures' : 'colors'
      });
    };

    /**
     * update structure menu
     */
    updateStructure = (code) => {
      /* directly changing another components properties, should just call a
        function in rugbuider this will handle all its on changes and its properties
        should be private */
      R.stageVisited =
        [true, false, false, false, false, false, false, false, false, false];

      R.choices.structure = code;

      /* number of colors could be passed down by a prop if structured correctly or
        stored in a redux store */
      let numOfColors = 0, key;

      for ( key in R.structureColorCodes[code] ) {
        if ( R.structureColorCodes[code].hasOwnProperty(key) ) {
        	numOfColors++;
        }
      }

      this.setState({
        colors         : R.structureColorCodes[code],
        numOfColors    : numOfColors,
        chosenStructure : code,
        chosenColors    : [],
        drawerSize      : 1
      });

      PubSub.publish('newStructure', code);
    };

    /**
     * update chosen color
     */
    updateColor = (color) => {
      R.choices['color' + R.colorStage] = color;

      let array = this.state.chosenColors;
      array[R.colorStage - 1] = color;

      this.setState({chosenColors: array, drawerSize : 1});

      PubSub.publish( 'newColor', true );
    }

    selectNewImage = () => {
      console.log('selecting new image');
      console.log('DRAWER V2');
    }

    render() {
      return (
        <DrawerV2View
          structures={this.state.structures}
          colors={this.state.colors}
          timestamp={this.state.timestamp}
          structureElementsPerPage={this.STRUCTURE_ELEMS_PER_PAGE}
          colorPageCount={this.COLOR_NUM_OF_PAGES}
          pageInView={this.state.pageInView}
          open={this.state.open}
          state={this.state.text}
          stage={this.state.stage}
          updateStructure={this.updateStructure}
          updateColor={this.updateColor}
          chosenStructure={this.state.chosenStructure}
          selectNewImage={this.props.selectNewImage}
        />
    )};
  }

  // ReactDOM.render(
  //   <DrawerV2 />, document.querySelector('#hospBuilderDrawer')
  // );

  return DrawerV2;
}
