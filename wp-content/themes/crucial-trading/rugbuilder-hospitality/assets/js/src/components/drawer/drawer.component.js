RugBuilder.prototype.drawerComponent = function(BtnExpandCollapseComponent, BtnStructureComponent, BtnColorComponent) {

	const R = rugBuilder;

	const DrawerComponent = React.createClass({

		getInitialState: function() {

			let structures = R.structureImages;

			return {
				stage : 'structures',

				open : true,
				text : 'Collapse',

				chosenStructure : undefined,
				chosenColors    : [],

				_structures : structures,
				_colors     : undefined
			}
		},

		componentDidMount: function() {
			this.stageChange = PubSub.subscribe( 'newStage', this.stageHasChanged );
		},

		componentWillUnmount: function() {
			PubSub.unsubscribe( this.stageChange );
		},

		updateOpenState: function(open) {

			// Function for updating the open/closed state of the drawer
			// Gets passed to expand-collapse button as props.onUpdate.
			// If open is true, update state to closed, and vice-versa.

			const ELEM = document.querySelector('#drawer');

			if ( open ) {

				const HEIGHT = ELEM.offsetHeight;

				ELEM.style.marginTop = '-' + HEIGHT + 'px';

				this.setState({
					open: false,
					text: 'Expand'
				});
			}
			else {

				ELEM.style.marginTop = 0;

				this.setState({
					open: true,
					text: 'Collapse'
				});
			}
		},

		stageHasChanged: function(stage) {
			this.updateDrawer(stage);
		},

		updateDrawer: function(stageCode) {

			let stage;

			switch (stageCode) {

				case 0  : stage = 'structures'; break;
				default : stage = 'colors'; break;
			}

			this.setState({ stage : stage });
		},

		updateStructure: function(code) {

			for ( let i = 1; i < 10; i++ ) {
				ReactDOM.unmountComponentAtNode(document.querySelector('#color-' + i))
			}

			R.stageVisited = [ true, false, false, false, false, false, false, false, false, false ];

			this.setState({
				_colors         : R.structureColorCodes[code],
				chosenStructure : code,
				chosenColors    : []
			})
			
			PubSub.publish( 'newStructure', code );
		},

		updateColor: function(color) {
			this.state.chosenColors[R.colorStage - 1] = color;
		},

		render: function() {

			let _t = this;

//			setInterval(function(){console.log(_t.state)},5000)
		
			let structuresHTML, colorsHTML;

			if ( this.state.stage === 'structures' ) {

				structuresHTML = Object.keys(this.state._structures).map((code, index) => {

					let img = this.state._structures[code];

					return <BtnStructureComponent key={ index } code={ code } img={ img } onClick={ this.updateStructure } />;
				});
			}

			if ( this.state.stage === 'colors' ) {

				colorsHTML = this.state._colors.map((color, index) => {
					return <BtnColorComponent key={ index } color={ color } structure={ this.state.chosenStructure } onClick={ this.updateColor } />
				});
			}

			const OPEN             = this.state.open ? 'open' : 'closed';
			const DRAWER_CLASSES   = 'drawer__content ' + OPEN + ' ' + this.state.stage;

			return (
				<div className="react-container drawer__container">
					<div className={ DRAWER_CLASSES }>
						<div className="drawer__content">
							<ul className="clearfix structures">
								{ structuresHTML }
							</ul>
							<ul className="clearfix colors">
								{ colorsHTML }
							</ul>
						</div>
					</div>
					<BtnExpandCollapseComponent onUpdate={ this.updateOpenState } currentState={ this.state }/>
				</div>	
			);
		}
	});

	ReactDOM.render( <DrawerComponent />, document.querySelector( '#drawer' ) );
} 