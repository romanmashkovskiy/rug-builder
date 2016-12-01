RugBuilder.prototype.drawerComponent = function(BtnExpandCollapseComponent, BtnStructureComponent, BtnColorComponent) {

	const R = rugBuilder;

	const DrawerComponent = React.createClass({

		getInitialState: function() {

			let structures = R.structureImages;
			let time       = new Date();

			let numOfStructures = 0, key;

			for ( key in structures ) {
				if ( structures.hasOwnProperty(key) ) {
					numOfStructures++;
				}
			}

			let kindaMaxScrollStructures = Math.floor(numOfStructures / 8);

			if ( numOfStructures % 8 === 0 ) {
				kindaMaxScrollStructures = kindaMaxScrollStructures - 1;
			}

			return {
				stage : 'structures',

				timestamp : time,

				open : true,
				text : 'Collapse',

				chosenStructure : undefined,
				chosenColors    : [],

				drawerScroll  : 2,
				currentScroll : 0,
				maxScroll     : 0,

				_structures    : structures,
				_numStructures : numOfStructures,
				_colors        : undefined,
				_numColors     : undefined,

				fullScreenScroll : {
					currentScroll       : 0,
					maxScrollStructures : 0,
					maxScrollColors     : 0
				},

				kindaScroll : {
					currentScroll       : 0,
					maxScrollStructures : kindaMaxScrollStructures,
					maxScrollColors     : 0
				}
			}
		},

		componentDidMount: function() {
			this.stageChange = PubSub.subscribe( 'newStage', this.stageHasChanged );
			this.restart     = PubSub.subscribe( 'restart', this.restart );
			this.submit      = PubSub.subscribe( 'submit', this.submit );
		},

		componentWillUnmount: function() {
			PubSub.unsubscribe( this.stageChange );
			PubSub.unsubscribe( this.restart );
			PubSub.unsubscribe( this.submit );
		},

		restart: function() {

			for ( let i = 0; i < 10; i++ ) {
				ReactDOM.unmountComponentAtNode(document.querySelector('#color-' + i))
				ReactDOM.unmountComponentAtNode(document.querySelector('#choice-' + i))
			}

			ReactDOM.unmountComponentAtNode(document.querySelector('#submit-screen'))

			document.querySelector('#img-container').style.zIndex = 0;
			document.querySelector('#choices').style.zIndex = 0;

			this.updateDrawer(0);
			PubSub.publish( 'newStage', 0 );
			R.colorStage = 0;
			R.choices.structure  = undefined;
			R.choices.color1     = undefined;
			R.choices.color2     = undefined;
			R.choices.color3     = undefined;
			R.choices.color4     = undefined;
			R.choices.color5     = undefined;
			R.choices.color6     = undefined;
			R.choices.color7     = undefined;
			R.choices.color8     = undefined;
			R.choices.color9     = undefined;

			let structures = R.structureImages;
			let time       = new Date();

			let numOfStructures = 0, key;

			for ( key in structures ) {
				if ( structures.hasOwnProperty(key) ) {
					numOfStructures++;
				}
			}

			let kindaMaxScrollStructures = Math.floor(numOfStructures / 8);

			if ( numOfStructures % 8 === 0 ) {
				kindaMaxScrollStructures = kindaMaxScrollStructures - 1;
			}

			this.setState({
				stage : 'structures',

				timestamp : time,

				open : true,
				text : 'Collapse',

				chosenStructure : undefined,
				chosenColors    : [],

				drawerScroll  : 2,
				currentScroll : 0,
				maxScroll     : 0,

				_structures    : structures,
				_numStructures : numOfStructures,
				_colors        : undefined,
				_numColors     : undefined,

				fullScreenScroll : {
					currentScroll       : 0,
					maxScrollStructures : 0,
					maxScrollColors     : 0
				},

				kindaScroll : {
					currentScroll       : 0,
					maxScrollStructures : kindaMaxScrollStructures,
					maxScrollColors     : 0
				}
			});
		},

		submit: function() {
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
			else if ( open === 'fullScreen' ) {

				ELEM.style.marginTop = 0;

				this.setState({
					open: 'fullScreen',
					text: 'Collapse'
				});
			}
			else if ( open === 'kinda' ) {

				ELEM.style.marginTop = 0;

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

			let openState = stage === 0 ? 'fullScreen' : false;

			this.updateDrawer(stage);
			this.updateOpenState(openState);
			this.state.kindaScroll.currentScroll = 0;
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

			if ( this.state.kindaScroll.maxScrollStructures > 0 ) {

				document.querySelector('ul.structures').style.height = '289px';
				document.querySelector('ul.structures').style.overflow = 'hidden';

				this.updateOpenState('kinda');
			}

			R.stageVisited = [ true, false, false, false, false, false, false, false, false, false ];

			let kindaMaxScrollColors = Math.floor(R.structureColorCodes[code].length / 20);

			if ( R.structureColorCodes[code] % 20 === 0 ) {
				kindaMaxScrollColors = kindaMaxScrollColors - 1;
			}

			this.setState({
				_colors         : R.structureColorCodes[code],
				chosenStructure : code,
				chosenColors    : []
			});

			this.state.kindaScroll.maxScrollColors = kindaMaxScrollColors;
			
			PubSub.publish( 'newStructure', code );
		},

		updateColor: function(color) {

			if ( this.state.kindaScroll.maxScrollColors > 0 ) {

				document.querySelector('ul.colors').style.height = '243px';
				document.querySelector('ul.colors').style.overflow = 'hidden';

				this.updateOpenState('kinda');
			}

			this.state.chosenColors[R.colorStage - 1] = color;

			PubSub.publish( 'newColor', true );
		},

		scrollUp: function() {

			if ( this.state.kindaScroll.currentScroll === 0 ) {
				return;
			}

			let selector = this.state.stage === 'colors' ? 'ul.colors li' : 'ul.structures li';

			let array = [];

			array.forEach.call(document.querySelectorAll(selector), (e, i) => {
				
				let multipliter = this.state.stage === 'colors' ? 20 : 8;
				let minusier    = this.state.stage === 'colors' ? 21 : 9;

				let lowerBound, upperBound;

				upperBound = multipliter * this.state.kindaScroll.currentScroll;
				lowerBound = upperBound - minusier;

				if ( i > lowerBound && i < upperBound ) {

					var height        = parseInt(window.getComputedStyle(e).getPropertyValue('height'));
					var currentMargin = parseInt(window.getComputedStyle(e).getPropertyValue('margin-top'));
					var newMargin     = currentMargin + (height * 2);

					e.style.marginTop = newMargin + 'px';
				}
			});

			var newScroll = this.state.kindaScroll.currentScroll - 1;

			this.state.kindaScroll.currentScroll = newScroll;
		},

		scrollDown: function() {

			if ( this.state.stage === 'structures' && this.state.kindaScroll.currentScroll === this.state.kindaScroll.maxScrollStructures ) {
				return;
			}

			if ( this.state.stage === 'colors' && this.state.kindaScroll.currentScroll === this.state.kindaScroll.maxScrollColors ) {
				return;
			}

			let selector = this.state.stage === 'colors' ? 'ul.colors li' : 'ul.structures li';

			let array = [];

			array.forEach.call(document.querySelectorAll(selector), (e, i) => {

				let multipliter = this.state.stage === 'colors' ? 20 : 8;
				let minusier    = this.state.stage === 'colors' ? 21 : 9;

				let lowerBound, upperBound;

				upperBound = multipliter * (this.state.kindaScroll.currentScroll + 1);
				lowerBound = upperBound - minusier;

				if ( i > lowerBound && i < upperBound ) {

					var height        = parseInt(window.getComputedStyle(e).getPropertyValue('height'));
					var currentMargin = parseInt(window.getComputedStyle(e).getPropertyValue('margin-top'));
					var newMargin     = currentMargin - (height * 2);

					e.style.marginTop = newMargin + 'px';
				}
			});

			var newScroll = this.state.kindaScroll.currentScroll + 1;

			this.state.kindaScroll.currentScroll = newScroll;
		},

		render: function() {

//			let _t = this;
//			setInterval(function(){_t.scrollDown()},5000)
//			setTimeout(function(){_t.scrollDown()},1000)
		
			let structuresHTML, colorsHTML, btnsHTML;

			if ( this.state.stage === 'structures' ) {

				structuresHTML = Object.keys(this.state._structures).map((code, index) => {

					let img = this.state._structures[code];
					let jpg = templateDirectoryUri + '/rugbuilder-hospitality/assets/img/structures/' + code + '/base.jpg';

					return <BtnStructureComponent key={ index } code={ code } img={ img } jpg={ jpg } onClick={ this.updateStructure } />;
				});
			}

			if ( this.state.stage === 'colors' ) {

				colorsHTML = this.state._colors.map((color, index) => {
					return <BtnColorComponent key={ index } color={ color } structure={ this.state.chosenStructure } onClick={ this.updateColor } />
				});
			}

			if ( this.state.open === 'kinda' ) {

				let checking = this.state.stage === 'colors' ? 'maxScrollColors' : 'maxScrollStructures';

				let upStyle = this.state.kindaScroll.currentScroll === 0 ? { color: '#A8A8A8' } : {};
				let dnStyle = this.state.kindaScroll.currentScroll === this.state.kindaScroll[checking] ? { color: '#A8A8A8' } : {};

				if ( this.state.kindaScroll[checking] > 0 ) {

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
				<div className="react-container drawer__container" key={ this.state.timestamp }>
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
					<BtnExpandCollapseComponent onUpdate={ this.updateOpenState } currentState={ this.state } />
				</div>	
			);
		}
	});

	ReactDOM.render( <DrawerComponent />, document.querySelector( '#drawer' ) );
} 

/*

calculateScroll: function(direction) {

			const CURRENT_SCROLL = this.state.currentScroll;

			console.log(direction)
			console.log(CURRENT_SCROLL)

			if ( direction === 'up' && CURRENT_SCROLL === 0 ) {
				return;
			}

			const CURRENT_STAGE  = this.state.stage;
			const DRAWER_UL_ELEM = document.querySelector('ul.' + CURRENT_STAGE);
			const DRAWER_LI_ELEM = document.querySelector('ul.' + CURRENT_STAGE + ' li');

			const DRAWER_SCROLL  = this.state.drawerScroll;
			const MAX_SCROLL     = this.state.maxScroll;

			const WINDOW_HEIGHT  = window.innerHeight;
			const LI_ELEM_HEIGHT = DRAWER_LI_ELEM.offsetHeight;
			const ELEMS_PER_ROW  = window.innerWidth > 992 ? 4 : 3;

			const NUM_ELEMS = CURRENT_STAGE === 'structures' ? this.state._numStructures : this.state._numColors;

			let maxDrawerHeight, numRowsVisible, totalElemsShown, elemsLeft;
			let maxHeight, overflow;
			let drawerScroll, newScroll, maxScroll;

			switch ( DRAWER_SCROLL ) {

				case 0 :
					break;

				case 1 :
					break;

				case 2 :

					maxDrawerHeight = WINDOW_HEIGHT - 255;
					numRowsVisible  = Math.floor( ( maxDrawerHeight / LI_ELEM_HEIGHT ) - 1);
					totalElemsShown = ELEMS_PER_ROW * numRowsVisible;

					maxHeight = ( LI_ELEM_HEIGHT * numRowsVisible ) + ( 25 * ( numRowsVisible - 1 ) );
					overflow  = 'hidden';

					if ( CURRENT_STAGE === 'structures' ) {
						elemsLeft = NUM_ELEMS - totalElemsShown;
						maxScroll = Math.floor( NUM_ELEMS / ELEMS_PER_ROW );
					} else if ( CURRENT_STAGE === 'colors' ) {
						elemsLeft = NUM_ELEMS - totalElemsShown;
						maxScroll = Math.floor( elemsLeft / NUM_ELEMS ) + 1;
					}

					break;

				case 3 :
					break;
			}

			if ( direction === 'down' && CURRENT_SCROLL === maxScroll ) {
				return;
			}

			this.setState({ maxScroll : maxScroll });

			if ( direction === 'up' ) {
				this.doScrollUp(CURRENT_STAGE, NUM_ELEMS, elemsLeft, LI_ELEM_HEIGHT, CURRENT_SCROLL);
			} else if ( direction === 'down' ) {
				this.doScrollDown(CURRENT_STAGE, NUM_ELEMS, elemsLeft, LI_ELEM_HEIGHT, CURRENT_SCROLL);
			}

			DRAWER_UL_ELEM.style.maxHeight = maxHeight + 'px';
			DRAWER_UL_ELEM.style.overflow  = overflow;
		},

		doScrollUp: function(currentStage, numElems, elemsLeft, liHeight, currentScroll) {

			
		},

		doScrollDown: function(currentStage, numElems, elemsLeft, liHeight, currentScroll) {

	//		alert(numElems+' ' + elemsLeft)

			const LI_ELEMS = document.querySelectorAll('ul.' + currentStage + ' li');
			const STOP_AT  = numElems - elemsLeft;

			const MARGIN_TOP = liHeight + 25;

			let array = [];

			array.forEach.call(LI_ELEMS, (e, i) => {

				if ( i < STOP_AT ) {
					e.style.marginTop = '-' + MARGIN_TOP + 'px';
				}
			});

			this.setState({ currentScroll : currentScroll + 1 });
			let _t = this;
			setTimeout(function(){console.log(_t.state)},3000)
			this.calculateScroll(false);
		},

		*/