RugBuilder.prototype.drawerComponent = function(BtnExpandCollapseComponent, BtnMaterialComponent, BtnCollectionComponent, BtnSwatchComponent, SideMenuComponent, BtnBorderComponent) {

	const R = rugBuilder;

	const DrawerComponent = React.createClass({

		getInitialState: function() {

			let materials   = R.WCmaterials;
			let collections = R.WCcollections;

			// Set initial state
			return {
				stage : R.currentStage,

				content : 'materials',

				open : true,
				text : 'Collapse',

				pageInView : 1,

				chosenMaterial   : undefined,
				chosenCollection : undefined,
				chosenSwatch     : undefined,
				chosenBorder     : 'Single & Piping',

				_materials   : materials,
				_collections : collections,
				_swatches    : {},
				_borders     : ['Single Border', 'Single & Piping', 'Double Border'],

				length : '',
				width  : '',
				price  : false,

				_resize : 0
			}
		},

		componentDidMount: function() {
			this.stageChange  = PubSub.subscribe( 'stageChange', this.updateStageState );
			this.newPrice     = PubSub.subscribe( 'newPrice', this.showNewPrice );
		},

		componentWillUnmount: function() {
			PubSub.unsubscribe( this.stageChange );
			PubSub.unsubscribe( this.newPrice );
		},

		open: function() {

			document.querySelector('.drawer__content__material').classList.remove('closed');
			document.querySelector('.drawer__content__collections').classList.remove('closed');
			document.querySelector('.drawer__content__swatches').classList.remove('closed');
			document.querySelector('.drawer__content__swatches--selected').classList.remove('closed');
			document.querySelector('.drawer__content__border').classList.remove('closed');
			document.querySelector('.drawer__content__size').classList.remove('closed');

			document.querySelector('.drawer__content__material').classList.add('opening');
			document.querySelector('.drawer__content__collections').classList.add('opening');
			document.querySelector('.drawer__content__swatches').classList.add('opening');
			document.querySelector('.drawer__content__swatches--selected').classList.add('opening');
			document.querySelector('.drawer__content__border').classList.add('opening');
			document.querySelector('.drawer__content__size').classList.add('opening');

			setTimeout(function() {

				document.querySelector('.drawer__content__material').classList.remove('opening');
				document.querySelector('.drawer__content__collections').classList.remove('opening');
				document.querySelector('.drawer__content__swatches').classList.remove('opening');
				document.querySelector('.drawer__content__swatches--selected').classList.remove('opening');
				document.querySelector('.drawer__content__border').classList.remove('opening');
				document.querySelector('.drawer__content__size').classList.remove('opening');

				document.querySelector('.drawer__content__material').classList.add('open');
				document.querySelector('.drawer__content__collections').classList.add('open');
				document.querySelector('.drawer__content__swatches').classList.add('open');
				document.querySelector('.drawer__content__swatches--selected').classList.add('open');
				document.querySelector('.drawer__content__border').classList.add('open');
				document.querySelector('.drawer__content__size').classList.add('open');
			}, 650)
			
			this.setState({
				open : true,
				text : 'Collapse'
			})
		},

		close: function() {

			document.querySelector('.drawer__content__material').classList.remove('open');
			document.querySelector('.drawer__content__collections').classList.remove('open');
			document.querySelector('.drawer__content__swatches').classList.remove('open');
			document.querySelector('.drawer__content__swatches--selected').classList.remove('open');
			document.querySelector('.drawer__content__border').classList.remove('open');
			document.querySelector('.drawer__content__size').classList.remove('open');

			document.querySelector('.drawer__content__material').classList.add('closed');
			document.querySelector('.drawer__content__collections').classList.add('closed');
			document.querySelector('.drawer__content__swatches').classList.add('closed');
			document.querySelector('.drawer__content__swatches--selected').classList.add('closed');
			document.querySelector('.drawer__content__border').classList.add('closed');
			document.querySelector('.drawer__content__size').classList.add('closed');
			
			this.setState({
				open : false,
				text : 'Expand'
			})
		},

		calcDrawerMaxHeight: function() {

			let selector;

			const CURRENT_STAGE   = this.state.stage;
			const CURRENT_CONTENT = this.state.content;

			if ( CURRENT_STAGE === 0 || CURRENT_STAGE === 2 || CURRENT_STAGE === 3 ) {

				switch ( CURRENT_CONTENT ) {

					case 'materials' :
						selector = '.drawer__content__material';
						break;

					case 'collections' :
						selector = '.drawer__collections__collections';
						break;

					case 'swatches' :
						selector = '.drawer__content__swatches';
						break;

					case 'swatchesSelected' :
						selector = '.drawer__content__swatches--selected';
						break;
				}
			} else if ( CURRENT_STAGE === 1 ) {
				selector = '.drawer__content__border';
			}

			const DRAWER = document.querySelector(selector);
			const HEIGHT = window.getComputedStyle(DRAWER).getPropertyValue('height');

			DRAWER.style.maxHeight = HEIGHT;
		},

		slideLeft: function() {

			if ( this.state.pageInView === R.numOfPages ) {
				return;
			}

			if ( this.state.pageInView === 1 ) {
				this.calcDrawerMaxHeight();
			}

			let array = [], array2 = [];

			array.forEach.call(document.querySelectorAll('li.in-window'), (e, i) => {
				e.classList.add('moving-out-to-left');
			});

			array.forEach.call(document.querySelectorAll('li.right-of-window'), (e, i) => {
				e.classList.add('moving-in-from-right');
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

			if ( this.state.pageInView === 1 ) {
				return;
			}

			let array = [], array2 = [];

			array.forEach.call(document.querySelectorAll('li.in-window'), (e, i) => {
				e.classList.add('moving-out-to-right');
			});

			array.forEach.call(document.querySelectorAll('li.left-of-window'), (e, i) => {
				e.classList.add('moving-in-from-left');
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

		updateStageState: function(stage) {

			this.setState({ stage : stage, pageInView : 1 });

	//		R.numOfPages = 1;

			let content;

			switch( stage ) {

				case 0 : 

					content = 'materials';

					this.setState({
						_materials   : R.WCmaterials,
						_collections : R.WCcollections,
						_swatches    : {}
					});

					break;

				case 1 : 

					content = 'border';

					break;

				case 2 : 

					content = 'materials';

					if ( R.WCborderMaterials.length === 0 ) {

						this.setState({
							_materials       : [],
							chosenMaterial   : undefined,
							chosenCollection : undefined,
							chosenSwatch     : undefined
						})

						this.getBorderMaterials();
					}
					else {

						this.setState({
							_materials : R.WCborderMaterials
						})
					}

					break;

				case 3 : 

					content = 'materials';

					this.setState({
						_materials : R.WCborderMaterials,
							chosenMaterial   : undefined,
							chosenCollection : undefined,
							chosenSwatch     : undefined
					})

					break;

				case 4 : 

					content = 'size'; 

					break;
			}

			this.updateContentState(content);
		},

		showNewPrice: function(price) {

			if ( price === 0 ) {
				this.setState({ price : false });
				return;
			}

			this.setState({ price: price });
			return;
		},

		getBorderMaterials: function() {

			R.getMaterialsData('border')
				.then((res) => { this.setState({ _materials: R.WCborderMaterials }) })
				.catch(()   => {
					R.error(103, true);
					return;
				});
		},

		updateContentState: function(content) {

			// Function for updating the content state.
			// Gets passed to all of the content components as props.
			// Updates the content state to whatever is given to it by the component.
			this.setState({ content: content, pageInView : 1 });
		},

		updateMaterialChoice: function(material) {

			// Function for updating the chosenMaterial state.
			// Get passed to the Material Button Components as props.
			// Updates the chosenMaterial state to whatever is given to it by the component.
			this.setState({ chosenMaterial: material, chosenCollection: undefined });

			if ( this.state.stage === 2 || this.state.stage === 3 ) {

				R.getCollectionsData(material)
					.then((collections) => {
						this.state._collections[material] = collections;
						this.forceUpdate()
					})
					.catch(()   => {
						R.error(101, true);
						return;
					});
			}
		},

		updateCollectionChoice: function(collection) {

			// Function for updating the chosenCollection state and getting swatch data.
			// Get passed to the Collection Button Components as props.
			// Updates the chosenCollection state to whatever is given to it by the component.
			this.setState({ chosenCollection: collection });

			R.loadingScreens('full', 'open');

			// Then gets the swatches for the chosen collection.
			// Once it has the swatches, it then adds them to state._swatches
			// and forces a re-render of the component
			R.getSwatchData(collection)
				.then((swatches) => {
					this.state._swatches[collection] = swatches;
					R.loadingScreens('full', 'close');
					this.forceUpdate();
				})
				.catch(() => {
					R.error(102, true);
					return;
				});
		},

		updateSwatchChoice: function(swatch, thumb, id, maps, stitching, repeat) {

			// Function for updating the chosenSwatch state.
			// Get passed to the Swatch Button Components as props.
			// Updates the chosenSwatch state to whatever is given to it by the component.
			this.setState({ chosenSwatch : swatch });

			R.loadingScreens('full', 'open');

			if ( this.state.stage === 0 ) {
				R.centerID = id;
			} 
			else if ( this.state.stage === 2 && ( this.state.chosenBorder === 'Single Border' || this.state.chosenBorder === 'Single & Piping' ) ) {
				R.singleBorderID = id;
			}
			else if ( this.state.stage === 2 && this.state.chosenBorder === 'Double Border' ) {
				R.innerBorderID = id;
			}
			else if ( this.state.stage === 3 && this.state.chosenBorder === 'Double Border' ) {
				R.outerBorderID = id;
			}

			// Update the actual rug
			R.displayTexture(swatch, thumb, this.state.stage, maps, stitching, repeat);
		},

		updateBorderChoice: function(border) {

			// Function for updating the chosenBorder state.
			// Get passed to the Border Button Components as props.
			// Updates the chosenBorder state to whatever is given to it by the component.
			this.setState({ chosenBorder: border });

			R.loadingScreens('full', 'open');

			// Update the actual rug
			R.updateBorder(border);
		},

		handleSizeInputChange: function(event) {

			// Update the length/width state when a value is inputted to the inputs

			if ( event.target.value === undefined ) {
				return;
			}

			if ( event.target.name === 'length' ) {
				this.setState({ length: event.target.value });
			}
			else if ( event.target.name === 'width' ) {
				this.setState({ width: event.target.value });
			}

			if ( ( this.state.length !== '' && event.target.name === 'width' ) || ( this.state.width !== '' && event.target.name === 'length' ) ) {

				const _this = this;

				setTimeout(function() {
					R.calculatePrice(_this.state.length, _this.state.width);
				}, 250)
			}

			return;
		},

		// Functions used for creating the dynamic HTML content of the drawer - 
		// they return what is returned from the functions at the bottom of this file 
		// (search for "Create dynamic drawer HTML content functions")

		createMaterialHTML    : function() { return _createMaterialHTML(this, BtnMaterialComponent, R) },

		createSidebarHTML     : function(caller) { return _createSidebarHTML(this, SideMenuComponent, caller, R) },

		createCollectionsHTML : function() { return _createCollectionsHTML(this, BtnCollectionComponent, R) },

		createSwatchesHTML    : function(caller) { return _createSwatchesHTML(this, BtnSwatchComponent, caller, R) },

		createBorderHTML      : function() { return _createBorderHTML(this, BtnBorderComponent, R) },

		createSizeHTML        : function() { return _createSizeHTML(this, R) },

		createPriceHTML       : function() { return _createPriceHTML(this, R) },

		render: function() {

			const _this = this;

//			setInterval(function(){console.log(_this.state)},5000)
			
			// Create the dynamic HTML sections of the content

			const MATERIAL_HTML    = _this.createMaterialHTML();
			const SIDEBAR_HTML     = function(caller) { return _this.createSidebarHTML(caller); }
			const COLLECTIONS_HTML = _this.createCollectionsHTML();
			const SWATCHES_HTML    = function(caller) { return _this.createSwatchesHTML(caller); }
			const BORDER_HTML      = _this.createBorderHTML();
			const SIZE_HTML        = _this.createSizeHTML();
			const PRICE_HTML       = _this.createPriceHTML();		

			const OPEN             = _this.state.open ? 'open' : 'closed';
			const DRAWER_CLASSES   = 'drawer__content ' + OPEN + ' ' + this.state.content;
			const MATERIAL_CLASSES = 'drawer__content__material stage' + this.state.stage;

			let btnsHTML = '', topCSS = '';

			if ( this.state.content === 'collections' || this.state.content === 'swatches' || this.state.content === 'swatchesSelected' ) {

				// arrows not working because R.numOfPages is incorrect. no idea why. it is set when the user selects a swatch and should 
				// not (and is not) changed afterwards (until the user moves to a different stage and the entire scrolling is reset)

				let leftStyle  = this.state.pageInView === 1 ? { color: '#A8A8A8' } : {};
				let rightStyle = this.state.pageInView === R.numOfPages ? { color: '#A8A8A8' } : {};

				btnsHTML = (
					<div className="scroll-btns clearfix">
						<div className="scroll__left">
							<a href="#" onClick={ this.slideRight }>&#x25C0;</a>
						</div>
						<div className="scroll__right">
							<a href="#" onClick={ this.slideLeft }>&#x25B6;</a>
						</div>
					</div>
				);
			}

			return (
				<div className="react-container drawer__container">
					<div className={ DRAWER_CLASSES }>
						<div className={ MATERIAL_CLASSES }>
							<ul>
								{ MATERIAL_HTML }
							</ul>
						</div>
						<div className="drawer__content__collections clearfix">
							<div className="drawer__collections__sidebar">
								<ul>
									{ SIDEBAR_HTML('collections') }
								</ul>
							</div>
							<div className="drawer__collections__collections">
								<ul className="clearfix">
									{ COLLECTIONS_HTML }
								</ul>
							</div>
						</div>
						<div className="drawer__content__swatches clearfix">
							<div className="drawer__swatches__sidebar">
								<ul>
									{ SIDEBAR_HTML('swatches') }
								</ul>
							</div>
							<div className="drawer__swatches__swatches">
								<ul className="clearfix">
									{ SWATCHES_HTML('swatches') }
								</ul>
							</div>
						</div>
						<div className="drawer__content__swatches--selected clearfix">
							<div className="drawer__swatches--selected__sidebar">
								<ul>
									{ SIDEBAR_HTML('swatches--selected') }
								</ul>
							</div>
							<div className="drawer__swatches--selected__swatches">
								<ul className="clearfix">
									{ SWATCHES_HTML('swatches--selected') }
								</ul>
							</div>
						</div>
						<div className="drawer__content__border">
							<ul>
								{ BORDER_HTML }
							</ul>
						</div>
						<div className="drawer__content__size">
							{ SIZE_HTML }
							{ PRICE_HTML }
						</div>
						{ btnsHTML }
					</div>
					<BtnExpandCollapseComponent currentlyOpen={ this.state.open } text={ this.state.text } open={ this.open } close={ this.close } />
				</div>	
			);
		}
	});

	ReactDOM.render( <DrawerComponent />, document.querySelector( '#drawer' ) );
}

// Create dynamic drawer HTML content functions

function _createMaterialHTML(_this, BtnMaterialComponent, R) {

	if ( _this.state.stage === 1 ) {
		return;
	}

	const MATERIALS_ARR = _this.state._materials;

	if ( _this.state.content === 'materials' ) {

		// Create a BtnMaterialComponent for each material in the MATERIALS_ARR array

		return MATERIALS_ARR.map((material, index) => {
			return <BtnMaterialComponent key={ index } index={ index } material={ material.name } thumb={ material.thumb } currentStage={ _this.state.stage } updateContent={ _this.updateContentState } updateMaterial={ _this.updateMaterialChoice } />
		});
	}
}

function _createSidebarHTML(_this, SideMenuComponent, caller, R) {

	// Function for creating the drawer sidemenu content

	if ( _this.state.stage === 1 ) {
		return;
	}

	const MATERIALS_ARR = _this.state._materials;

	if ( _this.state.content === 'collections' && caller === 'collections' ) {

		// Create a SideMenuComponent for each material in the MATERIALS_ARR array

		return MATERIALS_ARR.map((material, index) => {
			return <SideMenuComponent key={ index } material={ material.name } thumb={ material.thumb } onUpdate={ _this.updateMaterialChoice } />;
		});
	} 
	else if ( _this.state.content === 'swatches' && caller === 'swatches' ) {

		// Create a SideMenuComponent for each material in the MATERIALS_ARR array

		return MATERIALS_ARR.map((material, index) => {
			return <SideMenuComponent key={ index } material={ material.name } thumb={ material.thumb } updateContent={ _this.updateContentState } onUpdate={ _this.updateMaterialChoice } />;
		});
	}
	else if ( _this.state.content === 'swatchesSelected' && caller === 'swatches--selected' ) {

		// Create a SideMenuComponent for the user selected material

		return MATERIALS_ARR.map((material, index) => {

			if ( material.name === _this.state.chosenMaterial ) {
				return <SideMenuComponent key={ index } material={ _this.state.chosenMaterial } thumb={ material.thumb } updateContent={ _this.updateContentState } onUpdate={ _this.updateMaterialChoice } />;
			}
		});		
	}
}

function _createCollectionsHTML(_this, BtnCollectionComponent, R) {

	// Function for creating the drawer collections content

	if ( _this.state.stage === 1 || _this.state.stage === 4 ) {
		return;
	}

	const COLLECTIONS = _this.state._collections;
	const COLLECTION  = COLLECTIONS[ _this.state.chosenMaterial ];

	let elemsPerPage = 0;

	if ( window.innerWidth > 768 ) {
		elemsPerPage = 12;
	}

	if ( typeof COLLECTION !== 'undefined' ) {
		let numOfPages = Math.ceil( COLLECTION.length / elemsPerPage );
		R.numOfPages = numOfPages;
	} else {
		return <span></span>;
	}

	// Get the collections for the user selected material

	if ( _this.state.content === 'collections' ) {

		// Create a BtnCollectionComponent for each collection in the COLLECTION array

		return COLLECTION.map((collection, index) => {

			let indexPlusOne = index + 1;
			let page         = Math.ceil( indexPlusOne / elemsPerPage );

			return <BtnCollectionComponent key={ index } collection={ collection.name } image={ collection.thumbnail } updateContent={ _this.updateContentState } onUpdate={ _this.updateCollectionChoice } page={ page } pageInView={ _this.state.pageInView } />
		});
	}
}

function _createSwatchesHTML(_this, BtnSwatchComponent, caller, R) {

	// Function for creating the drawer swatches content

	if ( _this.state.stage === 1 ) {
		return;
	}

	// Get the swatches for the user selected collection

	const SWATCHES = _this.state._swatches;
	const SWATCH   = SWATCHES[ _this.state.chosenCollection ];

	if ( _this.state.content === 'swatches' && caller === 'swatches' && SWATCH !== undefined ) {

		// Since the state._swatches[chosenCollection] is an object, not an array, we
		// can't just run map on it. Instead run map on each of the keys, then use that
		// key to get the individual swatches from the object

		let elemsPerPage = window.innerWidth > 992 ? 18 : 9;

		if ( SWATCH !== undefined ) {
			let numOfPages = Math.ceil( Object.keys(SWATCH).length / elemsPerPage );
			R.numOfPages = numOfPages;
		}

		return Object.keys(SWATCH).map((swatch, index) => {

			const CURRENT_SWATCH = SWATCH[swatch];

			const id     = CURRENT_SWATCH.id;
			const name   = CURRENT_SWATCH.name;
			const code   = CURRENT_SWATCH.code;
			const thumb  = CURRENT_SWATCH.thumb;
			const stitch = CURRENT_SWATCH.stitching;
			const repeat = {
				x : CURRENT_SWATCH.repeatx,
				y : CURRENT_SWATCH.repeaty
			};
			
			let maps = {};

			if ( CURRENT_SWATCH.bmap !== '' ) {
				maps.bmap = CURRENT_SWATCH.bmap;
			}
			if ( CURRENT_SWATCH.nmap !== '' ) {
				maps.nmap = CURRENT_SWATCH.nmap;
			}
			if ( CURRENT_SWATCH.dmap !== '' ) {
				maps.dmap = CURRENT_SWATCH.dmap;
			}

			let indexPlusOne = index + 1;
			let page         = Math.ceil( indexPlusOne / elemsPerPage );

			// Create a BtnSwatchComponent for each swatch in the SWATCH object

			return <BtnSwatchComponent key={ index } id={ id } swatch={ name } thumb={ thumb } repeat={ repeat } stitching={ stitch } code={ code } maps={ maps } updateContent={ _this.updateContentState } onUpdate={ _this.updateSwatchChoice } page={ page } pageInView={ _this.state.pageInView } />
		})
	}
	else if ( _this.state.content === 'swatchesSelected' && caller === 'swatches--selected' ) {

		const SELECTED_SWATCH     = _this.state.chosenSwatch.replace(/ /g, '');
		const SELECTED_COLLECTION = _this.state._swatches[ _this.state.chosenCollection ];

		let elemsPerPage  = window.innerWidth > 992 ? 6 : 3;
		let numOfSwatches = Object.keys(SELECTED_COLLECTION).length

		if ( SELECTED_COLLECTION !== undefined ) {
			let numOfPages = Math.ceil( numOfSwatches / elemsPerPage );
			R.numOfPages = numOfPages;
		}

		let selectedSwatchIndex;

		let i = 0;

		Object.keys(SELECTED_COLLECTION).forEach((key) => {

			if ( key === SELECTED_SWATCH ) {
				selectedSwatchIndex = i;
			}

			i++;
		});

		// Work out which page selectedSwatchIndex is on then set state.pageInView to that page

		// BUT ONLY IF ITS CALLED FROM THE FIRST RENDER, IF ITS CALLED FROM A SCROLL DO NOT DO THIS

//		let selectedSwatchIndexPlusOne = selectedSwatchIndex + 1;
//		let pageSelectedSwatchIsOn     = Math.ceil( selectedSwatchIndexPlusOne / elemsPerPage );

//		_this.state.pageInView = pageSelectedSwatchIsOn;

		// Create a BtnSwatchComponent for each swatch in the swatchArr array

		return Object.keys(SELECTED_COLLECTION).map((swatch, index) => {

			const CURRENT_SWATCH = SELECTED_COLLECTION[swatch];

			const id    = CURRENT_SWATCH.id;
			const name  = CURRENT_SWATCH.name;
			const code  = CURRENT_SWATCH.code;
			const thumb = CURRENT_SWATCH.thumb;

			let indexPlusOne = index + 1;
			let page         = Math.ceil( indexPlusOne / elemsPerPage );

			return <BtnSwatchComponent key={ index } swatch={ name } thumb={ thumb } selected={ _this.state.chosenSwatch } updateContent={ _this.updateContentState } onUpdate={ _this.updateSwatchChoice } page={ page } pageInView={ _this.state.pageInView } />
		});
	}
}

function _createBorderHTML(_this, BtnBorderComponent, R) {

	if ( _this.state.stage !== 1 ) {
		return;
	}

	if ( _this.state.content === 'border' ) {

		const BORDER_ARR = _this.state._borders;
		
		return BORDER_ARR.map((border, index) => {
			return <BtnBorderComponent key={ index } border={ border } onUpdate={ _this.updateBorderChoice } />
		});
	}
}

function _createSizeHTML(_this, R) {

	if ( _this.state.stage !== 4 ) {
		return;
	}

	return (
		<span>
			<input type="number" onChange={ _this.handleSizeInputChange } value={ _this.state.length } name="length" placeholder="Enter Length (m)" />
			<input type="number" onChange={ _this.handleSizeInputChange } value={ _this.state.width } name="width" placeholder="Enter Width (m)" />
		</span>
	);
}

function _createPriceHTML(_this, R) {

	if ( _this.state.stage !== 4 || !_this.state.price ) {
		return;
	}

	return (
		<h3 className="drawer-price">Price: £{ _this.state.price }</h3>
	);
}