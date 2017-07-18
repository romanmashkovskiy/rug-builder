RugBuilder.prototype.drawerComponent = function(BtnExpandCollapseComponent, BtnMaterialComponent, BtnCollectionComponent, BtnSwatchComponent, SideMenuComponent, BtnBorderComponent) {

	const R = rugBuilder;

	const DrawerComponent = React.createClass({

		getInitialState: function() {

			let materials   = R.WCmaterials;
			let collections = R.WCcollections;
			let piping      = R.WCpiping;

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
				_piping      : piping,
				_swatches    : {},
				_borders     : ['Single Border', 'Single & Piping', 'Double Border'],

				length : '',
				width  : '',
				price  : false,

				_resize : 0,

				drawerSlide : false,

				inputSizeErrorMessage: '',
			}
		},

		componentDidMount: function() {
			this.stageChange  = PubSub.subscribe( 'stageChange', this.updateStageState );
			this.newPrice     = PubSub.subscribe( 'newPrice', this.showNewPrice );

			let _t = this;
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

			this.setState({ drawerSlide : true });

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

			this.setState({ drawerSlide : true });

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

			PubSub.publish('newPrice', [0, 0, 0]);

			this.setState({ stage : stage, pageInView : 1, drawerSlide : false });

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

						this.showBorderMaterials();

					}
					else {

						this.setState({
							_materials : R.WCborderMaterials
						})

					}

					break;

				case 3 :

					if ( this.state.chosenBorder === 'Single & Piping' ) {

						content = 'swatches';

						this.setState({
							chosenMaterial   : undefined,
							chosenCollection : undefined,
							chosenSwatch     : undefined
						});

					} else if ( this.state.chosenBorder === 'Double Border' ) {

						content = 'materials';

						this.setState({
							_materials       : R.WCborderMaterials,
							chosenMaterial   : undefined,
							chosenCollection : undefined,
							chosenSwatch     : undefined
						});

					}



					break;

				case 4 :

					content = 'size';

					break;
			}

			this.setState({
				open : true,
				text : 'Collapse'
			});

			document.querySelector('.drawer__content__material').classList.remove('closed');
			document.querySelector('.drawer__content__collections').classList.remove('closed');
			document.querySelector('.drawer__content__swatches').classList.remove('closed');
			document.querySelector('.drawer__content__swatches--selected').classList.remove('closed');
			document.querySelector('.drawer__content__border').classList.remove('closed');
			document.querySelector('.drawer__content__size').classList.remove('closed');

			document.querySelector('.drawer__content__material').classList.add('open');
			document.querySelector('.drawer__content__collections').classList.add('open');
			document.querySelector('.drawer__content__swatches').classList.add('open');
			document.querySelector('.drawer__content__swatches--selected').classList.add('open');
			document.querySelector('.drawer__content__border').classList.add('open');
			document.querySelector('.drawer__content__size').classList.add('open');

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

		showBorderMaterials: function() {
			this.setState({ _materials: R.WCborderMaterials })
		},

		updateContentState: function(content) {

			// Function for updating the content state.
			// Gets passed to all of the content components as props.
			// Updates the content state to whatever is given to it by the component.

			if ( content !== 'swatchesSelected' ) {
				this.setState({ content: content, pageInView : 1 });
			} else {
				this.setState({ content: content });
			}
		},

		updateMaterialChoice: function(material) {

			// Function for updating the chosenMaterial state.
			// Get passed to the Material Button Components as props.
			// Updates the chosenMaterial state to whatever is given to it by the component.
			this.setState({ chosenMaterial: material, chosenCollection: undefined, drawerSlide : false });

			if ( this.state.stage === 2 || this.state.stage === 3 ) {

				R.getCollectionsData(material)
					.then((collections) => {
						this.state._collections[material] = collections;
						this.forceUpdate()
					})
					.catch(()   => {
						R.error(101, 'An error occured loading the requested collections', true);
						return;
					});
			}
		},

		updateCollectionChoice: function(collection) {

			// Function for updating the chosenCollection state and getting swatch data.
			// Get passed to the Collection Button Components as props.
			// Updates the chosenCollection state to whatever is given to it by the component.
			this.setState({ chosenCollection: collection, drawerSlide : false });

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
					R.error(102, 'An error occured loading the requested swatches', true);
					return;
				});
		},

		updateSwatchChoice: function(swatch, thumb, id, maps, stitching, repeat, innerRepeat, rthumb) {

			// Function for updating the chosenSwatch state.
			// Get passed to the Swatch Button Components as props.
			// Updates the chosenSwatch state to whatever is given to it by the component.
			this.setState({ chosenSwatch : swatch, drawerSlide : false });

			R.loadingScreens('full', 'open');

			const CURRENT_STAGE = this.state.stage;

			if ( CURRENT_STAGE === 0 ) {
				R.centerID = id;
			} else {

				switch ( this.state.chosenBorder ) {

					case 'Single Border' :

						if ( CURRENT_STAGE === 2 ) {
							R.singleBorderID = id;
						}

						break;

					case 'Single & Piping' :

						if ( CURRENT_STAGE === 2 ) {
							R.singleBorderID = id;
						} else if ( CURRENT_STAGE === 3 ) {
							R.pipingID = id;
						}

						break;

					case 'Double Border' :

						if ( CURRENT_STAGE === 2 ) {
							R.innerBorderID = id;
						} else if ( CURRENT_STAGE === 3 ) {
							R.outerBorderID = id;
						}

						break;

				}

			}

			// Update the actual rug
			R.displayTexture(swatch, thumb, this.state.stage, maps, stitching, repeat, innerRepeat, rthumb);
		},

		updateBorderChoice: function(border) {

			// Function for updating the chosenBorder state.
			// Get passed to the Border Button Components as props.
			// Updates the chosenBorder state to whatever is given to it by the component.
			this.setState({ chosenBorder: border, drawerSlide : false });

			R.loadingScreens('full', 'open');

			// Update the actual rug
			R.updateBorder(border);
		},

		handleSizeInputChange: function(event) {
			// Update the length/width state when a value is inputted to the inputs

			if (event.target.value < 0 || event.target.value === undefined) {
				this.setState({ inputSizeErrorMessage: 'Please enter a valid number'});
				return;
			}

			if (event.target.value > 5 && event.target.name === 'width') {
				this.setState({inputSizeErrorMessage: 'maximum width is 5m' });
				return;
			}

			this.setState({ inputSizeErrorMessage: ''});

			if ( event.target.name === 'length' ) {
				this.setState({ length: event.target.value });
			}
			else if ( event.target.name === 'width' ) {
				this.setState({ width: event.target.value });
			}
/*
			if ( ( this.state.length !== '' && event.target.name === 'width' ) || ( this.state.width !== '' && event.target.name === 'length' ) ) {

				const _this = this;

				setTimeout(function() {
					R.calculatePrice(_this.state.length, _this.state.width);
				}, 250)
			}
*/
			return;
		},

		fireCalculatePrice: function() {
			R.calculatePrice(this.state.length, this.state.width);
		},

		// Functions used for creating the dynamic HTML content of the drawer -
		// they return what is returned from the functions at the bottom of this file
		// (search for "Create dynamic drawer HTML content functions")

		createMaterialHTML    : function() { return _createMaterialHTML(this, BtnMaterialComponent, R) },

		createSidebarHTML     : function(caller) { return _createSidebarHTML(this, SideMenuComponent, caller, R) },

		createCollectionsHTML : function() { return _createCollectionsHTML(this, BtnCollectionComponent, R) },

		createSwatchesHTML    : function(caller) { return _createSwatchesHTML(this, BtnSwatchComponent, caller, R) },

		createBorderHTML      : function() { return _createBorderHTML(this, BtnBorderComponent, R) },

		createPipingHTML      : function() { return _createPipingHTML(this, BtnSwatchComponent, R) },

		createSizeHTML        : function() { return _createSizeHTML(this, R) },

		createPriceHTML       : function() { return _createPriceHTML(this, R) },

		render: function() {

			// collections html and stuff

			const _this = this;

//			setInterval(function(){console.log(_this.state.pageInView)},1000)

			// Create the dynamic HTML sections of the content

			const MATERIAL_HTML    = _this.createMaterialHTML();
			const SIDEBAR_HTML     = function(caller) { return _this.createSidebarHTML(caller); }
			const COLLECTIONS_HTML = _this.createCollectionsHTML();
			const SWATCHES_HTML    = function(caller) { return _this.createSwatchesHTML(caller); }
			const BORDER_HTML      = _this.createBorderHTML();
			const SIZE_HTML        = _this.createSizeHTML();
			const PRICE_HTML       = _this.createPriceHTML();

			window.abc = COLLECTIONS_HTML

			const OPEN             = _this.state.open ? 'open' : 'closed';
			const MATERIAL_CLASSES = 'drawer__content__material open stage' + this.state.stage;

			let DRAWER_CLASSES = '';

			DRAWER_CLASSES += 'drawer__content ';
			DRAWER_CLASSES += OPEN + ' ';
			DRAWER_CLASSES += this.state.content + ' ';
			DRAWER_CLASSES += _this.state.chosenBorder === 'Single & Piping' && _this.state.stage === 3 && _this.state.content === 'swatches' ? '-piping' : '';
			DRAWER_CLASSES += _this.state.chosenBorder === 'Single & Piping' && _this.state.stage === 3 && _this.state.content === 'swatchesSelected' ? '-piping-selected' : '';

			let btnsHTML = '', topCSS = '';

			if ( this.state.content === 'collections' || this.state.content === 'swatches' || this.state.content === 'swatchesSelected' ) {

				let leftStyle  = this.state.pageInView === 1 ? { color: '#A8A8A8' } : {};
				let rightStyle = this.state.pageInView === R.numOfPages ? { color: '#A8A8A8' } : {};

				btnsHTML = (
					<div className="scroll-btns clearfix">
						<div className="scroll__left">
							<a href="#" onClick={ this.slideRight }>
								<img src="https://d105txpzekqrfa.cloudfront.net/uploads/20170110134436/arrow-left.svg" alt="Scroll Left" />
							</a>
						</div>
						<div className="scroll__right">
							<a href="#" onClick={ this.slideLeft }>
								<img src="https://d105txpzekqrfa.cloudfront.net/uploads/20170110134433/arrow-right.svg" alt="Scroll Right" />
							</a>
						</div>
					</div>
				);
			}

			let numOfPages = 0, dots = [];

			if ( this.state.content === 'collections' ) {

				let collections = _this.state._collections;
				let collection  = collections[ _this.state.chosenMaterial ];

				if ( typeof collection !== 'undefined' ) {

					let elemsPerPage = 12;
					let numOfPages;

					if ( window.innerWidth > 768 ) {
						numOfPages = Math.ceil( collection.length / elemsPerPage );
					} else {
						numOfPages = 1;
					}
				}

			} else if ( this.state.content === 'swatches' ) {

				let swatches = _this.state._swatches;
				let swatch   = swatches[ _this.state.chosenCollection ];

				if ( typeof swatch !== 'undefined' ) {

					let elemsPerPage = window.innerWidth > 992 ? 18 : 9;
					let numOfSwatches = Object.keys(swatch).length;

					numOfPages = Math.ceil( numOfSwatches / elemsPerPage );
				}

			} else if ( this.state.content === 'swatchesSelected' ) {

				let selectedSwatch     = _this.state.chosenSwatch.replace(/ /g, '');
				let selectedCollection = _this.state._swatches[ _this.state.chosenCollection ];

				if ( typeof selectedCollection !== 'undefined' ) {

					let elemsPerPage  = window.innerWidth > 992 ? 6 : 3;
					let numOfSelected = Object.keys(selectedCollection).length

					numOfPages = Math.ceil( numOfSelected / elemsPerPage );
				}

			}

			let currentPage = this.state.pageInView;

			for ( let i = 0; i < numOfPages; i++ ) {

				let index = i + 1;
				let className = 'dot';

				if ( currentPage === index ) {
					className += ' dot-active';
				}

				dots.push(<div className={ className } data-page={ index }></div>);
			}

			let dotsHTML = <div className="dots clearfix">{ dots }</div>;

			if ( window.innerWidth < 768 ) {

				if ( this.state.content === 'swatchesSelected' ) {

					document.querySelector('#view-controls').classList.add('show');

				} else {
					document.querySelector('#view-controls').classList.remove('show');
				}

			}

			return (
				<div className="react-container drawer__container">
					<div className={ DRAWER_CLASSES }>
						<div className={ MATERIAL_CLASSES }>
							<ul>
								{ MATERIAL_HTML }
							</ul>
						</div>
						<div className="drawer__content__collections open clearfix">
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
						<div className="drawer__content__swatches open clearfix">
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
						<div className="drawer__content__swatches--selected open clearfix">
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
						<div className="drawer__content__border open">
							<ul>
								{ BORDER_HTML }
							</ul>
						</div>
						<div className="drawer__content__size open">
							{ SIZE_HTML }
							{ PRICE_HTML }
						</div>
						{ btnsHTML }
						{ dotsHTML }
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

	let elemsPerPage = 12;

	if ( typeof COLLECTION !== 'undefined' ) {

		let numOfPages;

		if ( window.innerWidth > 768 ) {
			numOfPages = Math.ceil( COLLECTION.length / elemsPerPage );
			R.numOfPages = numOfPages;
		} else {
			numOfPages = 1;
			R.numOfPages = numOfPages;
		}

	} else {
		return <span></span>;
	}

	// Get the collections for the user selected material

	if ( _this.state.content === 'collections' ) {

		// Create a BtnCollectionComponent for each collection in the COLLECTION array

		return COLLECTION.map((collection, index) => {

			let indexPlusOne = index + 1;
			let page;

			if ( window.innerWidth > 768 ) {
				page = Math.ceil( indexPlusOne / elemsPerPage );
			} else {
				page = 1;
			}

			return <BtnCollectionComponent key={ index } title={ collection.name } collection={ collection.slug } image={ collection.thumbnail } updateContent={ _this.updateContentState } onUpdate={ _this.updateCollectionChoice } page={ page } pageInView={ _this.state.pageInView } />
		});
	}
}

function _createSwatchesHTML(_this, BtnSwatchComponent, caller, R) {

	// Function for creating the drawer swatches content

	if ( _this.state.stage === 1 ) {
		return;
	}

	/* single & piping */
	if ( _this.state.chosenBorder === 'Single & Piping' && _this.state.stage === 3 ) {
		// If user is on piping stage

		const PIPING = _this.state._piping;

		if ( _this.state.content === 'swatches' && caller === 'swatches' ) {

			let elemsPerPage = 10;
			R.numOfPages     = 1;

			return PIPING.map((piping, index) => {

				const id      = piping.ID;
				const code = piping.code;
				const name    = piping.post_title;
				const picture = piping.picture;
				const thumb   = piping.thumb;
				const repeat  = {
					x : piping.repeatx,
					y : piping.repeaty
				};

				let rthumb = false;

				if ( Object.keys(piping.rthumb).length > 0 ) {
					rthumb = piping.rthumb;
				}

				let maps = {};

				if ( piping.bmap.length > 0 ) {
					maps.bmap = piping.bmap;
				}
				if ( piping.nmap.length > 0 ) {
					maps.nmap = piping.nmap;
				}
				if ( piping.dmap.length > 0 ) {
					maps.dmap = piping.dmap;
				}

				let page = 1;

				return <BtnSwatchComponent key={ index } id={ id } swatch={ name } picture={ picture }
					thumb={ thumb } rthumb={ rthumb } repeat={ repeat } maps={ maps } code = {code}
					updateContent={ _this.updateContentState }
					onUpdate={ _this.updateSwatchChoice }
					page={ page } pageInView={ page }
				/>
			});

		} else if ( _this.state.content === 'swatchesSelected' && caller === 'swatches--selected' ) {

			const SELECTED_PIPING = _this.state.chosenSwatch;

			let elemsPerPage  = window.innerWidth > 992 ? 6 : 3;
			let numOfSwatches = PIPING.length;

			if ( SELECTED_PIPING !== undefined ) {
				let numOfPages = Math.ceil( numOfSwatches / elemsPerPage );
				R.numOfPages   = numOfPages;
			}

			let selectedPipingIndex;

			PIPING.map((piping, index) => {

				if ( piping.post_title === SELECTED_PIPING ) {
					selectedPipingIndex = index;
				}
			})

			if( !_this.state.drawerSlide ) {

				let selectedSwatchIndexPlusOne = selectedPipingIndex + 1;
				let pageSelectedSwatchIsOn     = Math.ceil( selectedSwatchIndexPlusOne / elemsPerPage );

				_this.state.pageInView = pageSelectedSwatchIsOn;
			}

			return PIPING.map((piping, index) => {

				const id      = piping.ID;
				const name    = piping.post_title;
				const code = piping.code;
				const picture = piping.picture;
				const thumb   = piping.thumb;
				const repeat  = {
					x : piping.repeatx,
					y : piping.repeaty
				};

				let rthumb = false;

				if ( Object.keys(piping.rthumb).length > 0 ) {
					rthumb = piping.rthumb;
				}

				let maps = {};

				if ( piping.bmap.length > 0 ) {
					maps.bmap = piping.bmap;
				}
				if ( piping.nmap.length > 0 ) {
					maps.nmap = piping.nmap;
				}
				if ( piping.dmap.length > 0 ) {
					maps.dmap = piping.dmap;
				}

				let indexPlusOne = index + 1;
				let page         = Math.ceil( indexPlusOne / elemsPerPage );

				return <BtnSwatchComponent key={ index } id={ id } swatch={ name } picture={ picture }
					thumb={ thumb } rthumb={ rthumb } repeat={ repeat } maps={ maps } code = {code}
					updateContent={ _this.updateContentState }
					onUpdate={ _this.updateSwatchChoice }
					page={ page }
					pageInView={ _this.state.pageInView }
				/>
			});

		}


	} else {

		// User is on any other stage

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

				const id      = CURRENT_SWATCH.id;
				const name    = CURRENT_SWATCH.name;
				const code    = CURRENT_SWATCH.code;
				const picture = CURRENT_SWATCH.picture;
				const thumb   = CURRENT_SWATCH.thumb;
				const stitch  = CURRENT_SWATCH.stitching;
				const repeat  = {
					x : CURRENT_SWATCH.repeatx,
					y : CURRENT_SWATCH.repeaty
				};

				let innerRepeat = false;

				if ( _this.state.chosenBorder === 'Double Border' && _this.state.stage === 2 ) {

					innerRepeat = {
						x : CURRENT_SWATCH.repeatxinner,
						y : CURRENT_SWATCH.repeatyinner
					}
				}

				let rthumb = false;

				if ( Object.keys(CURRENT_SWATCH.rthumb).length > 0 ) {
					rthumb = CURRENT_SWATCH.rthumb;
				}

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
				return <BtnSwatchComponent
					key={ index } id={ id } swatch={ name } picture={ picture } thumb={ thumb }
					rthumb={ rthumb } repeat={ repeat } innerRepeat={ innerRepeat } stitching={ stitch }
					code={ code } maps={ maps }
					updateContent={ _this.updateContentState }
					onUpdate={ _this.updateSwatchChoice }
					page={ page }
					pageInView={ _this.state.pageInView }
				/>
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

			if( !_this.state.drawerSlide ) {

				let selectedSwatchIndexPlusOne = selectedSwatchIndex + 1;
				let pageSelectedSwatchIsOn     = Math.ceil( selectedSwatchIndexPlusOne / elemsPerPage );

				_this.state.pageInView = pageSelectedSwatchIsOn;
			}

			// Create a BtnSwatchComponent for each swatch in the swatchArr array

			return Object.keys(SELECTED_COLLECTION).map((swatch, index) => {

				const CURRENT_SWATCH = SWATCH[swatch];

				const id      = CURRENT_SWATCH.id;
				const name    = CURRENT_SWATCH.name;
				const code    = CURRENT_SWATCH.code;
				const picture = CURRENT_SWATCH.picture;
				const thumb   = CURRENT_SWATCH.thumb;
				const stitch  = CURRENT_SWATCH.stitching;
				const repeat  = {
					x : CURRENT_SWATCH.repeatx,
					y : CURRENT_SWATCH.repeaty
				};

				let innerRepeat = false;

				if ( _this.state.chosenBorder === 'Double Border' && _this.state.stage === 2 ) {

					innerRepeat = {
						x : CURRENT_SWATCH.repeatxinner,
						y : CURRENT_SWATCH.repeatyinner
					}
				}

				let rthumb = false;

				if ( typeof CURRENT_SWATCH.rthumb === 'object' ) {
					rthumb = CURRENT_SWATCH.rthumb;
				}

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

				return <BtnSwatchComponent key={ index } swatch={ name } picture={ picture } thumb={ thumb } rthumb={ rthumb } repeat={ repeat } innerRepeat={ innerRepeat }  stitching={ stitch } code={ code } maps={ maps } selected={ _this.state.chosenSwatch } updateContent={ _this.updateContentState } onUpdate={ _this.updateSwatchChoice } page={ page } pageInView={ _this.state.pageInView } />
			});
		}

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
			<p className="length">Length (m)</p><p className="width">Width (m)</p>
			<input type="number" onChange={ _this.handleSizeInputChange } value={ _this.state.length } name="length" className="input-length" placeholder="Enter Length (m)" />
			<input type="number" onChange={ _this.handleSizeInputChange } value={ _this.state.width } name="width" className="input-width" placeholder="Enter Width (m)" />
			{ _this.state.inputSizeErrorMessage && <span className="sizeInputErrorMessage"> {_this.state.inputSizeErrorMessage} </span> }
			<button type="button" onClick={ _this.fireCalculatePrice } className="calc-price-btn">Calculate Price</button>
		</span>
	);
}

function _createPriceHTML(_this, R) {

	// Disable this for now

	return <div></div>;

	if ( _this.state.stage !== 4 || !_this.state.price ) {
		return;
	}

	return (
		<h3 className="drawer-price">Price: £{ _this.state.price }</h3>
	);
}
