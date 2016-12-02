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

				pageInView : 1,

				chosenStructure : undefined,
				chosenColors    : [],

				_structures    : structures,
				_numStructures : numOfStructures,
				_colors        : undefined,
				_numColors     : undefined,
			}
		},

		componentDidMount: function() {
			this.stageChange = PubSub.subscribe( 'newStage', this.stageHasChanged );
			this.restart     = PubSub.subscribe( 'restart', this.restart );
			this.submit      = PubSub.subscribe( 'submit', this.submit );

			let _t = this;
			setTimeout(function(){ _t.slideLeft() }, 5000)
			setTimeout(function(){ _t.slideRight() }, 12500)
			setTimeout(function(){ _t.slideLeft() }, 15000)
			setTimeout(function(){ _t.slideLeft() }, 17500)
			setTimeout(function(){ _t.slideRight() }, 20000)
			setTimeout(function(){ _t.slideRight() }, 22500)
		},

		STRUCTURE_ELEMS_PER_PAGE : undefined,

		slideLeft: function() {

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

		slideRight: function() {

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

		// need to switch page 2 to relative at same time/before page 1 becomes absolute to ensure drawer just jump bad

		componentWillUnmount: function() {
			PubSub.unsubscribe( this.stageChange );
			PubSub.unsubscribe( this.restart );
			PubSub.unsubscribe( this.submit );
		},

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

		stageHasChanged: function(stage) {
			this.open();
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

			R.stageVisited = [ true, false, false, false, false, false, false, false, false, false ];

			this.setState({
				_colors         : R.structureColorCodes[code],
				chosenStructure : code,
				chosenColors    : [],
				drawerSize      : 1
			}, () => { this.drawerHeight() });
			
			PubSub.publish( 'newStructure', code );
		},

		updateColor: function(color) {

			this.state.chosenColors[R.colorStage - 1] = color;

			this.setState({
				drawerSize : 1
			}, () => { this.drawerHeight() });

			PubSub.publish( 'newColor', true );
		},

		render: function() {

			let structuresHTML, colorsHTML;

			if ( this.state.stage === 'structures' ) {

				if ( this.STRUCTURE_ELEMS_PER_PAGE === undefined ){

					const WINDOW_HEIGHT           = window.innerHeight;
					const AVAIL_SPACE             = WINDOW_HEIGHT - document.querySelector('.progress-menu__container').offsetHeight - 100;
					
					const STRUCTURE_ELEM_HEIGHT   = 157;
					const NUM_OF_STRUCTURE_ROWS   = Math.floor( AVAIL_SPACE / STRUCTURE_ELEM_HEIGHT );
					const STRUCTURE_ELEMS_PER_ROW = window.innerWidth > 992 ? 4 : 3;

					this.STRUCTURE_ELEMS_PER_PAGE = NUM_OF_STRUCTURE_ROWS * STRUCTURE_ELEMS_PER_ROW;
				}

				structuresHTML = Object.keys(this.state._structures).map((code, index) => {

					let indexPlusOne = index + 1;
					let page         = Math.ceil( indexPlusOne / this.STRUCTURE_ELEMS_PER_PAGE );

					let img = this.state._structures[code];
					let jpg = templateDirectoryUri + '/rugbuilder-hospitality/assets/img/structures/' + code + '/base.jpg';

					return <BtnStructureComponent key={ index } code={ code } img={ img } jpg={ jpg } page={ page } pageInView={ this.state.pageInView } onClick={ this.updateStructure } />
				});
			}
			else if ( this.state.stage === 'colors' ) {

				colorsHTML = this.state._colors.map((color, index) => {
					return <BtnColorComponent key={ index } color={ color } structure={ this.state.chosenStructure } onClick={ this.updateColor } />
				});
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