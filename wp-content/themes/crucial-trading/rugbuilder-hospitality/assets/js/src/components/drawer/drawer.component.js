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
		 * Ref6  : Calculate Drawer Max Height        Calculates the max height for the drawer and drawer container to fix the weird sliding
		 * Ref7  : Open                               Fired when the 'Expand' button is clicked, open the drawer from height 0
		 * Ref8  : Close                              Fired when the 'Collapse' button is clicked, closes the drawer to height 0
		 * Ref9  : Restart                            Resets everything so the user can start from blank
		 * Ref10 : Submit                             Saves the user's choices in state then calls the Submit Screen component (passing the saved choices)
		 * Ref11 : Slide Left                         Scrolls the drawer to the left
		 * Ref12 : Slide Right                        Scrolls the drawer to the right
		 * Ref13 : Stage Has Changed                  Fires when the user has clicked on a different stage in the progress menu, opens the drawer and fires Update Drawer (Ref13)
		 * Ref14 : Update Drawer                      Updates the stage state property so the component knows whether to render structures or colors
		 * Ref15 : Update Stucture                    Fires when the user clicks a structure, updates the state to save and show the chosen structure, publishes the newStructure event
		 * Ref16 : Update Color                       Fires when the user clicks a colors, updates the state to save and show the chosen color, publishes the newColor event
		 * Ref17 : Render                             Renders the component
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

			this.calcDrawerMaxHeight();

			let _t = this;

			const HAMMER_S = new Hammer(document.querySelector('ul.hosp_builder_structures'));
			const HAMMER_C = new Hammer(document.querySelector('ul.hosp_builder_colors'));

			HAMMER_S.on('swipe', (e) => {
				if ( e.direction === 2 ) {
					_t.slideLeft();
				} else {
					_t.slideRight();
				}
			});

			HAMMER_C.on('swipe', (e) => {
				if ( e.direction === 2 ) {
					_t.slideLeft();
				} else {
					_t.slideRight();
				}
			});

			window.addEventListener('resize', this.windowResize);
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

			this.calcDrawerMaxHeight();

			this.setState((prevState) => {
				return { _resize: prevState._resize + 1 };
			});
		},

// Ref6: Calculate Drawer Max Height

		calcDrawerMaxHeight: function() {

			let drawerToUse;

			if ( document.querySelector('.hosp_builder_drawer__content').classList.contains('structures') ) {
				drawerToUse = document.querySelector('.hosp_builder_structures');
			} else {
				drawerToUse = document.querySelector('.hosp_builder_colors');
			}

			const DRAWER = document.querySelector('.hosp_builder_drawer__content');
			const HEIGHT = window.getComputedStyle(drawerToUse).getPropertyValue('height');

			DRAWER.style.maxHeight = HEIGHT;
			console.log(HEIGHT);
			document.querySelector('#hosp_builder_drawer').style.maxHeight = HEIGHT;
		},

// Ref7: Open

		open: function() {

			document.querySelector('ul.hosp_builder_structures').classList.remove('hosp_builder_closed');
			document.querySelector('ul.hosp_builder_colors').classList.remove('hosp_builder_closed');

			document.querySelector('ul.hosp_builder_structures').classList.add('hosp_builder_opening');
			document.querySelector('ul.hosp_builder_colors').classList.add('hosp_builder_opening');

			setTimeout(function() {

				document.querySelector('ul.hosp_builder_structures').classList.remove('hosp_builder_opening');
				document.querySelector('ul.hosp_builder_colors').classList.remove('hosp_builder_opening');

				document.querySelector('ul.hosp_builder_structures').classList.add('hosp_builder_open');
				document.querySelector('ul.hosp_builder_colors').classList.add('hosp_builder_open');
			}, 650)
			
			this.setState({
				open : true,
				text : 'Collapse'
			})
		},

// Ref8: Close

		close: function() {

			document.querySelector('ul.hosp_builder_structures').classList.remove('hosp_builder_open');
			document.querySelector('ul.hosp_builder_colors').classList.remove('hosp_builder_open');
			
			document.querySelector('ul.hosp_builder_structures').classList.add('hosp_builder_closed');
			document.querySelector('ul.hosp_builder_colors').classList.add('hosp_builder_closed');
			
			this.setState({
				open : false,
				text : 'Expand'
			})
		},

// Ref9: Restart

		restart: function() {

//			document.querySelector('#hosp_builder_img-container').classList.add('hosp_builder_hidden');

			for ( let i = 0; i < 10; i++ ) {
				ReactDOM.unmountComponentAtNode(document.querySelector('#hosp_builder_color-' + i))
				ReactDOM.unmountComponentAtNode(document.querySelector('#hosp_builder_choice-' + i))
			}

//			ReactDOM.unmountComponentAtNode(document.querySelector('#hosp_builder_submit-screen'));

			document.querySelector('#hosp_builder_img-container').style.zIndex = 0;
			document.querySelector('#hosp_builder_choices').style.zIndex = 0;

			this.updateDrawer(0);
			PubSub.publish( 'newStage', 0 );

			R.colorStage = 0;

			R.choices.structure = undefined;
			R.choices.color1    = undefined;
			R.choices.color2    = undefined;
			R.choices.color3    = undefined;
			R.choices.color4    = undefined;
			R.choices.color5    = undefined;
			R.choices.color6    = undefined;
			R.choices.color7    = undefined;
			R.choices.color8    = undefined;
			R.choices.color9    = undefined;

			let time = new Date();

//			let timeNow = time.getNow();

//			if ( timeNow > timeLastSaved ) {
//				this.save();
//			}

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
			});
		},

// Ref10: Submit

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

// Ref11: Slide Left

		slideLeft: function(e) {

			e.preventDefault();

			let numOfPages = this.state.stage === 'structures' ? this.STRUCTURE_NUM_OF_PAGES : this.COLOR_NUM_OF_PAGES;

			if ( this.state.pageInView === numOfPages ) {
				return;
			}

			let array = [], array2 = [];

			array.forEach.call(document.querySelectorAll('li.hosp_builder_in-window'), (e, i) => {
				e.classList.add('hosp_builder_moving-out-to-left');
			});

			array.forEach.call(document.querySelectorAll('li.hosp_builder_right-of-window'), (e, i) => {
				e.classList.add('hosp_builder_moving-in-from-right');
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

// Ref12: Slide Right

		slideRight: function(e) {

			e.preventDefault();

			if ( this.state.pageInView === 1 ) {
				return;
			}

			let array = [], array2 = [];

			array.forEach.call(document.querySelectorAll('li.hosp_builder_in-window'), (e, i) => {
				e.classList.add('hosp_builder_moving-out-to-right');
			});

			array.forEach.call(document.querySelectorAll('li.hosp_builder_left-of-window'), (e, i) => {
				e.classList.add('hosp_builder_moving-in-from-left');
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

// Ref13: Stage Has Changed

		stageHasChanged: function(thing, stage) {
			this.open();
			this.updateDrawer(stage);
			this.setState({ pageInView : 1 });
		},

// Ref14: Update Drawer

		updateDrawer: function(stageCode) {

			let stage;

			switch (stageCode) {

				case 0  : stage = 'structures'; break;
				default : stage = 'colors'; break;
			}

			this.setState({ stage : stage });
		},

// Ref15: Update Stucture

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

// Ref16: Update Color

		updateColor: function(color) {

			this.state.chosenColors[R.colorStage - 1] = color;

			this.setState({
				drawerSize : 1
			});

			PubSub.publish( 'newColor', true );
		},

		scrollToPage: function(page) {

			return;
			
//			if ( this.state.pageInView === page ) {
//				return;
//			}
			
//			if ( page < this.state.pageInView ) {
//				this.slideRight();
//			}
//			else {
//				this.slideLeft();
//			}

//			let _t = this;

//			setTimeout(() => { _t.scrollToPage(page) }, 650)
		},

// Ref17: Render

		render: function() {

			let structuresHTML, structureStyleHTML, colorsHTML, colorStyleHTML, btnsHTML;

			if ( this.state.stage === 'structures' ) {

				if ( this.STRUCTURE_ELEMS_PER_PAGE === undefined ){

					const WINDOW_HEIGHT = window.innerHeight;
					const AVAIL_SPACE   = WINDOW_HEIGHT - document.querySelector('.hosp_builder_progress-menu__container').offsetHeight - 100;
					
					const STRUCTURE_ELEM_HEIGHT   = 157;
					const NUM_OF_STRUCTURE_ROWS   = Math.floor( AVAIL_SPACE / STRUCTURE_ELEM_HEIGHT ) - 1;
					const STRUCTURE_ELEMS_PER_ROW = window.innerWidth > 992 ? 4 : 3;

					this.STRUCTURE_ELEMS_PER_PAGE = NUM_OF_STRUCTURE_ROWS * STRUCTURE_ELEMS_PER_ROW;
					this.STRUCTURE_NUM_OF_PAGES   = Math.ceil( this.state._numStructures / this.STRUCTURE_ELEMS_PER_PAGE );
					this.STRUCTURE_TOP_CSS_AMOUNT = STRUCTURE_ELEM_HEIGHT * NUM_OF_STRUCTURE_ROWS;
				}

				structuresHTML = Object.keys(this.state._structures).map((code, index) => {

					let indexPlusOne = index + 1;
					let page         = Math.ceil( indexPlusOne / this.STRUCTURE_ELEMS_PER_PAGE );

					let img = this.state._structures[code];
					let jpg = 'https://d105txpzekqrfa.cloudfront.net/hospitality/structures/' + code + '/base.jpg';

					return <BtnStructureComponent key={ index } code={ code } img={ img } jpg={ jpg } page={ page } pageInView={ this.state.pageInView } onClick={ this.updateStructure } />
				});

				let styleStr = '.hosp_builder_drawer__content ul.hosp_builder_structures li.hosp_builder_right-of-window, .hosp_builder_drawer__content ul.hosp_builder_structures li.hosp_builder_moving-out-to-right { top: -' + this.STRUCTURE_TOP_CSS_AMOUNT + 'px }';
				structureStyleHTML = <style>{ styleStr }</style>;

				let leftStyle  = this.state.pageInView === 1 ? { color: '#A8A8A8' } : {};
				let rightStyle = this.state.pageInView === this.STRUCTURE_NUM_OF_PAGES ? { color: '#A8A8A8' } : {};

				let leftUrl  = 'https://d105txpzekqrfa.cloudfront.net/uploads/20170110134436/arrow-left.svg';
				let rightUrl = 'https://d105txpzekqrfa.cloudfront.net/uploads/20170110134433/arrow-right.svg';

				btnsHTML = (
					<div className="hosp_builder_scroll-btns clearfix">
						<div className="hosp_builder_scroll__left">
							<a href="#" onClick={ this.slideRight } style={ leftStyle }>
								<img src={ leftUrl } alt="Scroll Left" className="scroller_btn" />
							</a>
						</div>
						<div className="hosp_builder_scroll__right">
							<a href="#" onClick={ this.slideLeft } style={ rightStyle }>
								<img src={ rightUrl } alt="Scroll Right" className="scroller_btn" />
							</a>
						</div>
					</div>
				);
			}
			else if ( this.state.stage === 'colors' ) {

				if ( this.COLOR_ELEMS_PER_PAGE === undefined ){

					const WINDOW_WIDTH        = window.innerWidth
					const COLOR_ELEMS_PER_ROW = WINDOW_WIDTH > 768 ? 10 : 5;
					const COLOR_ELEM_HEIGHT   = ( ( WINDOW_WIDTH - 50 ) / COLOR_ELEMS_PER_ROW );

					this.COLOR_ELEMS_PER_PAGE = WINDOW_WIDTH > 768 ? 20 : 10;
					this.COLOR_NUM_OF_PAGES   = WINDOW_WIDTH > 768 ? 2 : 4;
					this.COLOR_TOP_CSS_AMOUNT = ( COLOR_ELEM_HEIGHT * 2 ) + 58;
				}

				colorsHTML = this.state._colors.map((color, index) => {

					let page = 1;

			//		if ( window.innerHeight < 1000 ) {
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
			//		}

					return <BtnColorComponent key={ index } color={ color } structure={ this.state.chosenStructure } page={ page } pageInView={ this.state.pageInView } onClick={ this.updateColor } />
				});

			//	if ( window.innerHeight < 1000 ) {

					let styleStr = '.hosp_builder_drawer__content ul.hosp_builder_colors li.hosp_builder_right-of-window, .hosp_builder_drawer__content ul.hosp_builder_colors li.hosp_builder_moving-out-to-right { top: -' + this.COLOR_TOP_CSS_AMOUNT + 'px }';
					colorStyleHTML = <style>{ styleStr }</style>

					let leftStyle  = this.state.pageInView === 1 ? { color: '#A8A8A8' } : {};
					let rightStyle = this.state.pageInView === this.COLOR_NUM_OF_PAGES ? { color: '#A8A8A8' } : {};

					let leftUrl  = 'https://d105txpzekqrfa.cloudfront.net/uploads/20170110134436/arrow-left.svg';
					let rightUrl = 'https://d105txpzekqrfa.cloudfront.net/uploads/20170110134433/arrow-right.svg';

					btnsHTML = (
						<div className="hosp_builder_scroll-btns clearfix">
							<div className="hosp_builder_scroll__left">
								<a href="#" onClick={ this.slideRight } style={ leftStyle }>
									<img src={ leftUrl } alt="Scroll Left" className="scroller_btn" />
								</a>
							</div>
							<div className="hosp_builder_scroll__right">
								<a href="#" onClick={ this.slideLeft } style={ rightStyle }>
									<img src={ rightUrl } alt="Scroll Right" className="scroller_btn" />
								</a>
							</div>
						</div>
					);
			//	}
			}

			const OPEN             = this.state.open ? 'hosp_builder_open' : 'hosp_builder_closed';
			const DRAWER_CLASSES   = 'hosp_builder_drawer__content ' + OPEN + ' ' + this.state.stage;

			let numOfPages = this.state.stage === 'structures' ? this.STRUCTURE_NUM_OF_PAGES : this.COLOR_NUM_OF_PAGES;
			let dots = [];

			for ( let i = 0; i < numOfPages; i++ ) {

				let index = i + 1;
				let className = 'hosp_builder_dot';

				if ( this.state.pageInView === index ) {
					className += ' hosp_builder_active';
				}

				dots.push(<div className={ className } data-page={ index } onClick={() => this.scrollToPage(index)}></div>);
			}

			let dotsHTML = <div className="hosp_builder_dots clearfix">{ dots }</div>;

			return (
				<div className="hosp_builder_react-container hosp_builder_drawer__container" key={ this.state.timestamp }>
					<div className={ DRAWER_CLASSES }>
						<div className="hosp_builder_drawer__content">
							<ul className="clearfix hosp_builder_structures hosp_builder_open">
								{ structuresHTML }
							</ul>
							<ul className="clearfix hosp_builder_colors hosp_builder_open">
								{ colorsHTML }
							</ul>
						</div>
						{ btnsHTML }
						{ dotsHTML }
					</div>
					<BtnExpandCollapseComponent currentlyOpen={ this.state.open } text={ this.state.text } open={ this.open } close={ this.close } />
					{ structureStyleHTML }
					{ colorStyleHTML }
				</div>	
			);
		}
	});

	ReactDOM.render( <DrawerComponent />, document.querySelector( '#hosp_builder_drawer' ) );
}