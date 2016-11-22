RugBuilder.prototype.drawerComponent = function(BtnExpandCollapseComponent, BtnStructureComponent, BtnColorComponent) {

	const R = rugBuilder;

	const DrawerComponent = React.createClass({

		getInitialState: function() {

			let structures = R.structureImages;

			let size = 0, key;

			for ( key in structures ) {
				if ( structures.hasOwnProperty(key) ) {
					size++;
				}
			}

			let maxScrollStructures = Math.floor(size / 8);

			if ( size % 8 === 0 ) {
				maxScrollStructures = maxScrollStructures - 1;
			}

			return {
				stage : 'structures',

				open : true,
				text : 'Collapse',

				chosenStructure : undefined,
				chosenColors    : [],

				_structures : structures,
				_colors     : undefined,

				currentScroll       : 0,
				maxScrollStructures : maxScrollStructures,
				maxScrollColors     : 0
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

			if ( open === true ) {

				const HEIGHT = ELEM.offsetHeight;

				ELEM.style.marginTop = '-' + HEIGHT + 'px';

				this.setState({
					open: false,
					text: 'Expand'
				});
			}
			else if ( open === 'kinda' ) {

				this.setState({
					open: 'kinda',
					text: 'Collapse'
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

			let array = [];
			let array2 = [];

			array.forEach.call(document.querySelectorAll('ul.structures li'), (e, i) => {
				if ( e !== undefined ) {
					e.style.marginTop = 0;
				}
			});

			array2.forEach.call(document.querySelectorAll('ul.colors li'), (e, i) => {
				if ( e !== undefined ) {
					e.style.marginTop = 0;
				}
			});

			document.querySelector('ul.structures').style.height = 'auto';
			document.querySelector('ul.structures').style.overflow = 'initial';
			document.querySelector('ul.colors').style.height = 'auto';
			document.querySelector('ul.colors').style.overflow = 'initial';

			this.updateDrawer(stage);
			this.updateOpenState(false);
			this.setState({ currentScroll : 0 });
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

			if ( this.state.maxScrollStructures > 0 ) {

				document.querySelector('ul.structures').style.height = '289px';
				document.querySelector('ul.structures').style.overflow = 'hidden';

				this.updateOpenState('kinda');
			}

			for ( let i = 1; i < 10; i++ ) {
				ReactDOM.unmountComponentAtNode(document.querySelector('#color-' + i))
			}

			R.stageVisited = [ true, false, false, false, false, false, false, false, false, false ];

			let maxScrollColors = Math.floor(R.structureColorCodes[code].length / 20);

			if ( R.structureColorCodes[code] % 20 === 0 ) {
				maxScrollColors = maxScrollColors - 1;
			}

			this.setState({
				_colors         : R.structureColorCodes[code],
				maxScrollColors : maxScrollColors,
				chosenStructure : code,
				chosenColors    : []
			})
			
			PubSub.publish( 'newStructure', code );
		},

		updateColor: function(color) {

			if ( this.state.maxScrollColors > 0 ) {

				document.querySelector('ul.colors').style.height = '243px';
				document.querySelector('ul.colors').style.overflow = 'hidden';

				this.updateOpenState('kinda');
			}

			this.state.chosenColors[R.colorStage - 1] = color;
		},

		scrollUp: function() {

			if ( this.state.currentScroll === 0 ) {
				return;
			}

			let selector = this.state.stage === 'colors' ? 'ul.colors li' : 'ul.structures li';

			let array = [];

			array.forEach.call(document.querySelectorAll(selector), (e, i) => {
				
				let multipliter = this.state.stage === 'colors' ? 20 : 8;
				let minusier    = this.state.stage === 'colors' ? 21 : 9;

				let lowerBound, upperBound;

				upperBound = multipliter * this.state.currentScroll;
				lowerBound = upperBound - minusier;

				if ( i > lowerBound && i < upperBound ) {

					var height        = parseInt(window.getComputedStyle(e).getPropertyValue('height'));
					var currentMargin = parseInt(window.getComputedStyle(e).getPropertyValue('margin-top'));
					var newMargin     = currentMargin + (height * 2);

					e.style.marginTop = newMargin + 'px';
				}
			});

			var newScroll = this.state.currentScroll - 1;

			this.setState({ currentScroll : newScroll })
		},

		scrollDown: function() {

			if ( this.state.stage === 'structures' && this.state.currentScroll === this.state.maxScrollStructures ) {
				return;
			}

			if ( this.state.stage === 'colors' && this.state.currentScroll === this.state.maxScrollColors ) {
				return;
			}

			let selector = this.state.stage === 'colors' ? 'ul.colors li' : 'ul.structures li';

			let array = [];

			array.forEach.call(document.querySelectorAll(selector), (e, i) => {

				let multipliter = this.state.stage === 'colors' ? 20 : 8;
				let minusier    = this.state.stage === 'colors' ? 21 : 9;

				let lowerBound, upperBound;

				upperBound = multipliter * (this.state.currentScroll + 1);
				lowerBound = upperBound - minusier;

				if ( i > lowerBound && i < upperBound ) {

					var height        = parseInt(window.getComputedStyle(e).getPropertyValue('height'));
					var currentMargin = parseInt(window.getComputedStyle(e).getPropertyValue('margin-top'));
					var newMargin     = currentMargin - (height * 2);

					e.style.marginTop = newMargin + 'px';
				}
			});

			var newScroll = this.state.currentScroll + 1;

			this.setState({ currentScroll : newScroll })
		},

		render: function() {

//			let _t = this;
//			setInterval(function(){_t.scrollDown()},5000)
//			setTimeout(function(){_t.scrollDown()},1000)
		
			let structuresHTML, colorsHTML, btnsHTML;

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

			if ( this.state.open === 'kinda' ) {

				let checking = this.state.stage === 'colors' ? 'maxScrollColors' : 'maxScrollStructures';

				let upStyle = this.state.currentScroll === 0 ? { color: '#A8A8A8' } : {};
				let dnStyle = this.state.currentScroll === this.state[checking] ? { color: '#A8A8A8' } : {};

				if ( this.state[checking] > 0 ) {

					btnsHTML = (
						<div className="scroll-btns clearfix">
							<div className="scroll__up">
								<a href="#" onClick={ this.scrollUp } style={ upStyle }>&#x25B2;</a>
							</div>
							<div className="scroll__down">
								<a href="#" onClick={ this.scrollDown } style={ dnStyle }>&#x25BC;</a>
							</div>
						</div>
					);
				}
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
						{ btnsHTML }
					</div>
					<BtnExpandCollapseComponent onUpdate={ this.updateOpenState } currentState={ this.state }/>
				</div>	
			);
		}
	});

	ReactDOM.render( <DrawerComponent />, document.querySelector( '#drawer' ) );
} 