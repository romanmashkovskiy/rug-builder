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