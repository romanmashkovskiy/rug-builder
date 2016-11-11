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

				open : false,
				text : 'Expand',

				chosenMaterial   : undefined,
				chosenCollection : undefined,
				chosenSwatch     : undefined,
				chosenBorder     : undefined,

				_materials   : materials,
				_collections : collections,
				_swatches    : {},
				_borders     : ['Single Border', 'Single & Piping', 'Double Border']
			}
		},

		componentDidMount: function() {
			this.stageChange = PubSub.subscribe( 'stageChange', this.updateStageState );
		},

		componentWillUnmount: function() {
			PubSub.unsubscribe( this.stageChange );
		},

		updateStageState: function(stage) {
			this.setState({ stage : stage });

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

					content = ''; 

					break;
			}

			this.updateContentState(content);
		},

		getBorderMaterials: function() {

			R.getMaterialsData('border')
				.then((res) => { this.setState({ _materials: R.WCborderMaterials }) })
				.catch(()   => { alert('Loading material error') });
		},

		updateOpenState: function(open) {

			// Function for updating the open/closed state of the drawer
			// Gets passed to expand-collapse button as props.onUpdate.
			// If open is true, update state to closed, and vice-versa.
			if ( open ) {
				this.setState({
					open: false,
					text: 'Expand'
				});
			}
			else {
				this.setState({
					open: true,
					text: 'Collapse'
				});
			}
		},

		updateContentState: function(content) {

			// Function for updating the content state.
			// Gets passed to all of the content components as props.
			// Updates the content state to whatever is given to it by the component.
			this.setState({ content: content });
		},

		updateMaterialChoice: function(material) {

			// Function for updating the chosenMaterial state.
			// Get passed to the Material Button Components as props.
			// Updates the chosenMaterial state to whatever is given to it by the component.
			this.setState({ chosenMaterial: material, chosenCollection: undefined });

			if ( this.state.stage === 2 || this.state.stage === 3 ) {
				R.getSwatchData(material)
					.then((swatches) => {
						this.state._swatches[material] = swatches;
						this.forceUpdate();
					});
			}
		},

		updateCollectionChoice: function(collection) {

			// Function for updating the chosenCollection state and getting swatch data.
			// Get passed to the Collection Button Components as props.
			// Updates the chosenCollection state to whatever is given to it by the component.
			this.setState({ chosenCollection: collection });

			// Then gets the swatches for the chosen collection.
			// Once it has the swatches, it then adds them to state._swatches
			// and forces a re-render of the component
			R.getSwatchData(collection)
				.then((swatches) => {
					this.state._swatches[collection] = swatches;
					this.forceUpdate();
				});
		},

		updateSwatchChoice: function(swatch, thumb) {

			// Function for updating the chosenSwatch state.
			// Get passed to the Swatch Button Components as props.
			// Updates the chosenSwatch state to whatever is given to it by the component.
			this.setState({ chosenSwatch: swatch });

			// Update the actual rug
			R.displayTexture(swatch, thumb, this.state.stage);
		},

		updateBorderChoice: function(border) {

			// Function for updating the chosenBorder state.
			// Get passed to the Border Button Components as props.
			// Updates the chosenBorder state to whatever is given to it by the component.
			this.setState({ chosenBorder: border });

			// Update the actual rug
			R.updateBorder(border);
		},

		// Functions used for creating the dynamic HTML content of the drawer - 
		// they return what is returned from the functions at the bottom of this file
		// (search for "Create dynamic drawer HTML content functions")

		createMaterialHTML: function() { return _createMaterialHTML(this, BtnMaterialComponent) },

		createSidebarHTML: function(caller) { return _createSidebarHTML(this, SideMenuComponent, caller) },

		createCollectionsHTML: function() { return _createCollectionsHTML(this, BtnCollectionComponent) },

		createSwatchesHTML: function(caller) { return _createSwatchesHTML(this, BtnSwatchComponent, caller) },

		createBorderHTML: function() { return _createBorderHTML(this, BtnBorderComponent) },

		render: function() {

			const _this = this;

//			setInterval(function(){console.log(_this)},5000)
			
			// Create the dynamic HTML sections of the content

			const MATERIAL_HTML = _this.createMaterialHTML();

			const SIDEBAR_HTML = function(caller) { return _this.createSidebarHTML(caller); }

			const COLLECTIONS_HTML = _this.createCollectionsHTML();

			const SWATCHES_HTML = function(caller) { return _this.createSwatchesHTML(caller); }

			const BORDER_HTML = _this.createBorderHTML();

			const OPEN           = _this.state.open ? 'open' : 'closed';
			const DRAWER_CLASSES = 'drawer__content ' + OPEN + ' ' + this.state.content;

			return (
				<div className="react-container drawer__container">
					<div className={ DRAWER_CLASSES }>
						<div className="drawer__content__material">
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
					</div>
					<BtnExpandCollapseComponent onUpdate={ this.updateOpenState } currentState={ this.state }/>
				</div>	
			);
		}
	});

	ReactDOM.render( <DrawerComponent />, document.querySelector( '#drawer' ) );
}

// Create dynamic drawer HTML content functions

function _createMaterialHTML(_this, BtnMaterialComponent) {

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

function _createSidebarHTML(_this, SideMenuComponent, caller) {

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
				return <SideMenuComponent key={ index } material={ _this.state.chosenMaterial } thumb={ material.thumb } />;
			}
		});		
	}
}

function _createCollectionsHTML(_this, BtnCollectionComponent) {

	// Function for creating the drawer collections content

	if ( _this.state.stage !== 0 ) {
		return;
	}

	// Get the collections for the user selected material

	const COLLECTIONS = _this.state._collections;
	const COLLECTION  = COLLECTIONS[ _this.state.chosenMaterial ];

	if ( _this.state.content === 'collections' ) {

		// Create a BtnCollectionComponent for each collection in the COLLECTION array

		return COLLECTION.map((collection, index) => {
			return <BtnCollectionComponent key={ index } collection={ collection.name } updateContent={ _this.updateContentState } onUpdate={ _this.updateCollectionChoice } />
		});
	}
}

function _createSwatchesHTML(_this, BtnSwatchComponent, caller) {

	// Function for creating the drawer swatches content

	if ( _this.state.stage === 1 ) {
		return;
	}

	// Get the swatches for the user selected collection

	const SWATCHES = _this.state._swatches;
	const SWATCH   = _this.state.stage === 0 ? SWATCHES[ _this.state.chosenCollection ] : SWATCHES[ _this.state.chosenMaterial ];

	if ( _this.state.content === 'swatches' && caller === 'swatches' && SWATCH !== undefined ) {

		// Since the state._swatches[chosenCollection] is an object, not an array, we
		// can't just run map on it. Instead run map on each of the keys, then use that
		// key to get the individual swatches from the object

		return Object.keys(SWATCH).map((swatch, index) => {

			const CURRENT_SWATCH = SWATCH[swatch];

			const name  = CURRENT_SWATCH.name;
			const code  = CURRENT_SWATCH.code;
			const thumb = CURRENT_SWATCH.thumb;

			// Create a BtnSwatchComponent for each swatch in the SWATCH object

			return <BtnSwatchComponent key={ index } swatch={ name } thumb={ thumb } code={ code } updateContent={ _this.updateContentState } onUpdate={ _this.updateSwatchChoice } />
		})
	}
	else if ( _this.state.content === 'swatchesSelected' && caller === 'swatches--selected' ) {

		const SELECTED_SWATCH     = _this.state.chosenSwatch;
		const SELECTED_COLLECTION = _this.state.stage === 0 ? _this.state._swatches[ _this.state.chosenCollection ] : _this.state._swatches[ _this.state.chosenMaterial ];

		let allSwatches = [];
		let swatchIndex;

		let i = 0;

		Object.keys(SELECTED_COLLECTION).forEach((key) => {

			if ( key === SELECTED_SWATCH ) {
				swatchIndex = i;
			}

			allSwatches[i] = SELECTED_COLLECTION[key];
			i++;
		});

		let swatchArr = [];

		if ( swatchIndex <= 1 ) {

			for ( let i = 0; i < swatchIndex; i++ ) {
				if ( allSwatches[i] !== undefined ) {
					swatchArr.push(allSwatches[i]);
				}
			}

			swatchArr.push(allSwatches[swatchIndex]);

			for ( let i2 = swatchIndex + 1; i2 < 5; i2++ ) {
				if ( allSwatches[i2] !== undefined ) {
					swatchArr.push(allSwatches[i2]);
				}
			}
		}
		else if ( swatchIndex > allSwatches.length - 2 ) {

			let extra    = swatchIndex === allSwatches.length ? 2 : 1;
			let subtract = 2 + extra;

			for ( let i = swatchIndex - subtract; i < swatchIndex; i++ ) {
				if ( allSwatches[i] !== undefined ) {
					swatchArr.push(allSwatches[i]);
				}
			}

			swatchArr.push(allSwatches[swatchIndex]);

			let left = 5 - swatchArr.length;
			let top  = 1 + left;

			for ( let i2 = swatchIndex + 1; i2 < top; i2++ ) {
				if ( allSwatches[i2] !== undefined ) {
					swatchArr.push(allSwatches[i2]);
				}
			}
		}
		else {

			for ( let i2 = swatchIndex - 2; i2 < swatchIndex + 3; i2++ ) {
				if ( allSwatches[i2] !== undefined ) {
					swatchArr.push(allSwatches[i2]);
				}
			}
		}

		// Create a BtnSwatchComponent for each swatch in the swatchArr array

		return swatchArr.map((swatch, index) => {
			return <BtnSwatchComponent key={ index } swatch={ swatch.name } thumb={ swatch.thumb } updateContent={ _this.updateContentState } onUpdate={ _this.updateSwatchChoice } />
		});
	}
}

function _createBorderHTML(_this, BtnBorderComponent) {

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