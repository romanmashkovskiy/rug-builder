RugBuilder.prototype.drawerComponent = function(BtnExpandCollapseComponent, BtnStructureComponent, BtnColorComponent) {

	const R = rugBuilder;

	const DrawerComponent = React.createClass({

		/* CONTENTS
		 * ========
		 *
		 * Ref1  : Get Initial State                  Sets the initial state of the component
		 * Ref2  : Scroll Global Vars                 Global variables needed for scrolling - the number of elems per page, the number of pages, and the CSS top amount
		 * Ref3  : Component Did Mount                Subscribes the component to some PubSub stuff, adds the window resize event listener
		 * Ref4  : Component Will Unmount             Unsubscribes from the PubSub stuff
		 * Ref5  : Window Resize                      Updates the _resize state property to force a re-render of the component
		 * Ref6  : Open                               Fired when the 'Expand' button is clicked, open the drawer from height 0
		 * Ref7  : Close                              Fired when the 'Collapse' button is clicked, closes the drawer to height 0
		 * Ref8  : Restart                            Resets everything so the user can start from blank
		 * Ref9  : Submit                             Saves the user's choices in state then calls the Submit Screen component (passing the saved choices)
		 * Ref10 : Slide Left                         Scrolls the drawer to the left
		 * Ref11 : Slide Right                        Scrolls the drawer to the right
		 * Ref12 : Stage Has Changed                  Fires when the user has clicked on a different stage in the progress menu, opens the drawer and fires Update Drawer (Ref13)
		 * Ref13 : Update Drawer                      Updates the stage state property so the component knows whether to render structures or colors
		 * Ref14 : Update Stucture                    Fires when the user clicks a structure, updates the state to save and show the chosen structure, publishes the newStructure event
		 * Ref15 : Update Color                       Fires when the user clicks a colors, updates the state to save and show the chosen color, publishes the newColor event
		 * Ref16 : Render                             Renders the component
		 */

// Ref1: Get Initial State

		getInitialState: function() {

			let structures = R.structureImages;
			let time       = new Date();

			let numOfStructures = 0, key;

			for ( key in structures ) {
				if ( structures.hasOwnProperty(key) ) {
					numOfStructures++;
				}
			}

			return {
				stage : 'structures',

				timestamp : time,

				open : true,
				text : 'Collapse',

				pageInView : 1,

				chosenStructure : undefined,
				chosenColors    : [],

				_structures    : structures,
				_numStructures : numOfStructures,
				_colors        : undefined,
				_numColors     : undefined,

				_resize : 0,
			}
		},

// Ref2: Scroll Global Vars

		STRUCTURE_ELEMS_PER_PAGE : undefined,
		STRUCTURE_NUM_OF_PAGES   : undefined,
		STRUCTURE_TOP_CSS_AMOUNT : undefined,

		COLOR_ELEMS_PER_PAGE : undefined,
		COLOR_NUM_OF_PAGES   : undefined,
		COLOR_TOP_CSS_AMOUNT : undefined,

// Ref3: Component Did Mount

		componentDidMount: function() {
			this.stageChange = PubSub.subscribe( 'newStage', this.stageHasChanged );
			this.restart     = PubSub.subscribe( 'restart', this.restart );
			this.submit      = PubSub.subscribe( 'submit', this.submit );

			window.addEventListener('resize', this.windowResize);

			let _t = this;
			setTimeout(function(){_t.slideLeft()},5000)
			setTimeout(function(){_t.slideRight()},7500)
			setTimeout(function(){_t.slideLeft()},10000)
			setTimeout(function(){_t.slideLeft()},12500)
			setTimeout(function(){_t.slideRight()},15000)
			setTimeout(function(){_t.slideRight()},17500)

		},

// Ref4: Component Will Unmount

		componentWillUnmount: function() {
			PubSub.unsubscribe( this.stageChange );
			PubSub.unsubscribe( this.restart );
			PubSub.unsubscribe( this.submit );
		},

// Ref5: Window Resize

		windowResize: function() {

			this.STRUCTURE_ELEMS_PER_PAGE = undefined;
			this.COLOR_ELEMS_PER_PAGE     = undefined;

			this.setState((prevState) => {
				return { _resize: prevState._resize + 1 };
			});
		},

// Ref6: Open

		open: function() {

			document.querySelector('ul.structures').style.height = 'auto';
			document.querySelector('ul.colors').style.height = 'auto';

			document.querySelector('ul.structures').style.padding = '25px';
			document.querySelector('ul.colors').style.padding = '25px';

			document.querySelector('ul.structures').style.overflow = 'initial';
			document.querySelector('ul.colors').style.overflow = 'initial';
			
			this.setState({
				open : true,
				text : 'Collapse'
			})
		},

// Ref7: Close

		close: function() {

			document.querySelector('ul.structures').style.height = '0px';
			document.querySelector('ul.colors').style.height = '0px';

			document.querySelector('ul.structures').style.padding = '0px';
			document.querySelector('ul.colors').style.padding = '0px';

			document.querySelector('ul.structures').style.overflow = 'hidden';
			document.querySelector('ul.colors').style.overflow = 'hidden';
			
			this.setState({
				open : false,
				text : 'Expand'
			})
		},

// Ref8: Restart

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

			let time = new Date();

			let timeNow = time.getNow();

			if ( timeNow > timeLastSaved ) {
				this.save();
			}

			this.STRUCTURE_ELEMS_PER_PAGE = undefined;
			this.STRUCTURE_NUM_OF_PAGES   = undefined;
			this.STRUCTURE_TOP_CSS_AMOUNT = undefined;

			this.COLOR_ELEMS_PER_PAGE = undefined;
			this.COLOR_NUM_OF_PAGES   = undefined;
			this.COLOR_TOP_CSS_AMOUNT = undefined;

			this.setState({
				stage : 'structures',

				timestamp : time,

				open : true,
				text : 'Collapse',

				chosenStructure : undefined,
				chosenColors    : [],

				drawerSize : 2,

				_colors        : undefined,
				_numColors     : undefined,
			}, () => { this.drawerHeight() });
		},

// Ref9: Submit

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

// Ref10: Slide Left

		slideLeft: function() {

			let numOfPages = this.state.stage === 'structures' ? this.STRUCTURE_NUM_OF_PAGES : this.COLOR_NUM_OF_PAGES;

			if ( this.state.pageInView === numOfPages ) {
				return;
			}

			document.querySelectorAll('li.in-window').forEach((e,i) => {
				e.classList.add('moving-out-to-left')
			});

			document.querySelectorAll('li.right-of-window').forEach((e,i) => {
				e.classList.add('moving-in-from-right')
			});

			const _t = this;

			const CURRENT_PAGE = this.state.pageInView;
			const NEW_PAGE     = CURRENT_PAGE + 1;

			setTimeout(function() {
				_t.setState({
					pageInView : NEW_PAGE
				})
			}, 650)
		},

// Ref11: Slide Right

		slideRight: function() {

			if ( this.state.pageInView === 1 ) {
				return;
			}

			document.querySelectorAll('li.in-window').forEach((e,i) => {
				e.classList.add('moving-out-to-right')
			});

			document.querySelectorAll('li.left-of-window').forEach((e,i) => {
				e.classList.add('moving-in-from-left')
			});

			const _t = this;

			const CURRENT_PAGE = this.state.pageInView;
			const NEW_PAGE     = CURRENT_PAGE - 1;

			setTimeout(function() {
				_t.setState({
					pageInView : NEW_PAGE
				})
			}, 650)
		},

// Ref12: Stage Has Changed

		stageHasChanged: function(stage) {
			this.open();
			this.updateDrawer(stage);
			this.setState({ pageInView : 1 });
		},

// Ref13: Update Drawer

		updateDrawer: function(stageCode) {

			let stage;

			switch (stageCode) {

				case 0  : stage = 'structures'; break;
				default : stage = 'colors'; break;
			}

			this.setState({ stage : stage });
		},

// Ref14: Update Stucture

		updateStructure: function(code) {

			R.stageVisited = [ true, false, false, false, false, false, false, false, false, false ];

			let numOfColors = 0, key;

			for ( key in R.structureColorCodes[code] ) {
				if ( R.structureColorCodes[code].hasOwnProperty(key) ) {
					numOfColors++;
				}
			}

			this.setState({
				_colors         : R.structureColorCodes[code],
				_numOfColors    : numOfColors,
				chosenStructure : code,
				chosenColors    : [],
				drawerSize      : 1
			});
			
			PubSub.publish( 'newStructure', code );
		},

// Ref15: Update Color

		updateColor: function(color) {

			this.state.chosenColors[R.colorStage - 1] = color;

			this.setState({
				drawerSize : 1
			}, () => { this.drawerHeight() });

			PubSub.publish( 'newColor', true );
		},

// Ref16: Render

		render: function() {

			let structuresHTML, structureStyleHTML, colorsHTML, colorStyleHTML;

			if ( this.state.stage === 'structures' ) {

				if ( this.STRUCTURE_ELEMS_PER_PAGE === undefined ){

					const WINDOW_HEIGHT = window.innerHeight;
					const AVAIL_SPACE   = WINDOW_HEIGHT - document.querySelector('.progress-menu__container').offsetHeight - 100;
					
					const STRUCTURE_ELEM_HEIGHT   = 157;
					const NUM_OF_STRUCTURE_ROWS   = Math.floor( AVAIL_SPACE / STRUCTURE_ELEM_HEIGHT );
					const STRUCTURE_ELEMS_PER_ROW = window.innerWidth > 992 ? 4 : 3;

					this.STRUCTURE_ELEMS_PER_PAGE = NUM_OF_STRUCTURE_ROWS * STRUCTURE_ELEMS_PER_ROW;
					this.STRUCTURE_NUM_OF_PAGES   = Math.ceil( this.state._numStructures / this.STRUCTURE_ELEMS_PER_PAGE );
					this.STRUCTURE_TOP_CSS_AMOUNT = STRUCTURE_ELEM_HEIGHT * NUM_OF_STRUCTURE_ROWS;
				}

				structuresHTML = Object.keys(this.state._structures).map((code, index) => {

					let indexPlusOne = index + 1;
					let page         = Math.ceil( indexPlusOne / this.STRUCTURE_ELEMS_PER_PAGE );

					let img = this.state._structures[code];
					let jpg = templateDirectoryUri + '/rugbuilder-hospitality/assets/img/structures/' + code + '/base.jpg';

					return <BtnStructureComponent key={ index } code={ code } img={ img } jpg={ jpg } page={ page } pageInView={ this.state.pageInView } onClick={ this.updateStructure } />
				});

				let styleStr = '.drawer__content ul.structures li.right-of-window, .drawer__content ul.structures li.moving-out-to-right { top: -' + this.STRUCTURE_TOP_CSS_AMOUNT + 'px }';
				structureStyleHTML = <style>{ styleStr }</style>
			}
			else if ( this.state.stage === 'colors' ) {

				if ( this.COLOR_ELEMS_PER_PAGE === undefined ){

					const WINDOW_WIDTH        = window.innerWidth
					const COLOR_ELEMS_PER_ROW = WINDOW_WIDTH > 768 ? 10 : 5;
					const COLOR_ELEM_HEIGHT   = ( ( WINDOW_WIDTH - 50 ) / COLOR_ELEMS_PER_ROW );

					this.COLOR_ELEMS_PER_PAGE     = WINDOW_WIDTH > 768 ? 20 : 10;
					this.COLOR_NUM_OF_PAGES   = WINDOW_WIDTH > 768 ? 2 : 4;
					this.COLOR_TOP_CSS_AMOUNT = ( COLOR_ELEM_HEIGHT * 2 ) + 15;
				}

				colorsHTML = this.state._colors.map((color, index) => {

					let page = false;

					if ( window.innerHeight < 1000 ) {
						if ( window.innerWidth > 768 ) {
							if ( index < 20 ) {
								page = 1;
							} else {
								page = 2;
							}
						} else {
							if ( index < 10 ) {
								page = 1;
							} else if ( index > 9 && index < 20 ) {
								page = 2;
							} else if ( index > 9 && index < 20 ) {
								page = 3;
							} else {
								page = 4;
							}
						}
					}

					return <BtnColorComponent key={ index } color={ color } structure={ this.state.chosenStructure } page={ page } pageInView={ this.state.pageInView } onClick={ this.updateColor } />
				});

				if ( window.innerHeight < 1000 ) {
					let styleStr = '.drawer__content ul.colors li.right-of-window, .drawer__content ul.colors li.moving-out-to-right { top: -' + this.COLOR_TOP_CSS_AMOUNT + 'px }';
					colorStyleHTML = <style>{ styleStr }</style>
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
					</div>
					<BtnExpandCollapseComponent currentlyOpen={ this.state.open } text={ this.state.text } open={ this.open } close={ this.close } />
					{ structureStyleHTML }
					{ colorStyleHTML }
				</div>	
			);
		}
	});

	ReactDOM.render( <DrawerComponent />, document.querySelector( '#drawer' ) );
} 

/*

drawerHeight: function() {

			const CURRENT_STAGE  = this.state.stage;
			const DRAWER_SIZE    = this.state.drawerSize;
			const UL_ELEM        = document.querySelector('ul.' + CURRENT_STAGE);

			let height, overflow, numOfRows;

			switch ( DRAWER_SIZE ) {

				case 0 :
					height = 0;
					overflow = 'hidden';
					break;

				case 1 :
					height = CURRENT_STAGE === 'colors' ? '243px' : '289px';
					overflow = 'scroll';
					break;

				case 2 :

					const LI_ELEM       = document.querySelector('ul.' + CURRENT_STAGE + ' li');
					const LI_HEIGHT     = LI_ELEM.offsetHeight;
					const LI_PER_ROW    = window.innerWidth > 992 ? 4 : 3;
					const WINDOW_HEIGHT = window.innerHeight;
					const DRAWER_AREA   = WINDOW_HEIGHT - document.querySelector('.progress-menu__container').offsetHeight - 70;

					numOfRows = Math.floor( DRAWER_AREA / ( LI_HEIGHT + 25 ) );

					height   = ( LI_HEIGHT * numOfRows ) + ( 25 * ( numOfRows - 1 ) ) + 'px';
					overflow = 'scroll';
					
					break;

				case 3 :
					height = 'auto';
					overflow = 'auto';
					break;
			}

			UL_ELEM.style.height   = height;
			UL_ELEM.style.overflow = overflow;
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

clickScrollUp: function() {

			const VALID = this.canScrollUp();

			if ( VALID ) {
				const HEIGHT = this.drawerHeight();
				this.scrollElemMargins('up', HEIGHT);
				this.updateScrollState('up');
			}
		},

		clickScrollDown: function() {

			const VALID = this.canScrollDown();

			if ( VALID ) {
				const HEIGHT = this.drawerHeight();
				this.scrollElemMargins('down', HEIGHT);
				this.updateScrollState('down');
			}
		},

		canScrollUp: function() {

			const CURRENT_SCROLL = this.state.currentScroll;

			if ( CURRENT_SCROLL === 0 ) {
				return false;
			}

			return true;
		},

		canScrollDown: function() {

			const CURRENT_SCROLL = this.state.currentScroll;
			const MAX_SCROLL     = this.state.maxScroll;

			if ( CURRENT_SCROLL === MAX_SCROLL ) {
				return false;
			}

			return true;
		},

		scrollElemMargins: function(direction, heightInfo) {

			const CURRENT_STAGE  = this.state.stage;
			const CURRENT_SCROLL = this.state.currentScroll;
			const DRAWER_SIZE    = this.state.drawerSize;

			const LI_ELEMS       = document.querySelectorAll('ul.' + CURRENT_STAGE + ' li');
			const LI_PER_ROW     = window.innerWidth > 992 ? 4 : 3;
			const NUM_OF_ROWS    = heightInfo.numOfRows;
			const TOTAL_LI_SHOWN = LI_PER_ROW * NUM_OF_ROWS;
			const STOP           = TOTAL_LI_SHOWN * ( CURRENT_SCROLL + 1 );

			alert(CURRENT_SCROLL)

			let array = [];

			array.forEach.call(LI_ELEMS, (e, i) => {

				const CURRENT_MARGIN = parseInt(window.getComputedStyle(e).getPropertyValue('margin-top'));
				const ELEM_HEIGHT    = e.offsetHeight;

				if ( i > -1 && i < STOP ) {

					let marginElem = direction === 'up' ? CURRENT_MARGIN + ELEM_HEIGHT : CURRENT_MARGIN - ELEM_HEIGHT;
					let marginMarg = direction === 'up' ? 25 : -25;
					let newMargin  = marginElem + marginMarg;
					e.style.marginTop = newMargin + 'px';
				}
			});

			let newScrollState = direction === 'up' ? CURRENT_SCROLL - 1 : CURRENT_SCROLL + 1;

			this.setState({ currentScroll : newScrollState })
		},

		

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