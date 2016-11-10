RugBuilder.prototype.drawerComponent = function(BtnExpandCollapseComponent, BtnMaterialComponent, BtnCollectionComponent, BtnSwatchComponent, SideMenuComponent) {

	const R = rugBuilder;

	const DrawerComponent = React.createClass({

		getInitialState: function() {

			let materials   = R.materials;
			let collections = R.collections;

			// Set initial state
			return {
				stage : R.currentStage,

				content : 'materials',

				open : false,
				text : 'Expand',

				chosenMaterial   : 'Wool',
				chosenCollection : undefined,
				chosenSwatch     : undefined,

				_materials   : materials,
				_collections : collections,
				_swatches    : {}
			}
		},

		componentDidMount: function() {
			this.stageChange = PubSub.subscribe( 'stageChange', this.updateStageState );
		},

		componentWillUnmount: function() {
			PubSub.unsubscribe( this.newSearch_token );
		},

		updateStageState: function(stage) {
			this.setState({ stage : stage });
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
			R.displayTexture(swatch, thumb)
		},

		createMaterialHTML: function() {

			// Function for creating the drawer material content

			if ( this.state.stage !== 0 ) {
				return;
			}

			const MATERIALS_ARR = this.state._materials;

			if ( this.state.content === 'materials' ) {

				// Create a BtnMaterialComponent for each material in the MATERIALS_ARR array

				return MATERIALS_ARR.map((material, index) => {
					return <BtnMaterialComponent key={ index } index={ index } material={ material.name } thumb={ material.thumb } updateContent={ this.updateContentState } updateMaterial={ this.updateMaterialChoice } chosenMaterial={ this.state.chosenMaterial } />
				});
			}
		},

		createSidebarHTML: function(caller) {

			// Function for creating the drawer sidemenu content

			if ( this.state.stage !== 0 ) {
				return;
			}

			const MATERIALS_ARR = this.state._materials;

			if ( this.state.content === 'collections' && caller === 'collections' ) {

				// Create a SideMenuComponent for each material in the MATERIALS_ARR array

				return MATERIALS_ARR.map((material, index) => {
					return <SideMenuComponent key={ index } material={ material.name } thumb={ material.thumb } onUpdate={ this.updateMaterialChoice } />;
				});
			} 
			else if ( this.state.content === 'swatches' && caller === 'swatches' ) {

				// Create a SideMenuComponent for each material in the MATERIALS_ARR array

				return MATERIALS_ARR.map((material, index) => {
					return <SideMenuComponent key={ index } material={ material.name } thumb={ material.thumb } updateContent={ this.updateContentState } onUpdate={ this.updateMaterialChoice } />;
				});
			}
			else if ( this.state.content === 'swatchesSelected' && caller === 'swatches--selected' ) {

				// Create a SideMenuComponent for the user selected material

				return <SideMenuComponent material={ this.state.chosenMaterial } />;
			}
		},

		createCollectionsHTML: function() {

			// Function for creating the drawer collections content

			if ( this.state.stage !== 0 ) {
				return;
			}

			// Get the collections for the user selected material

			const COLLECTIONS = this.state._collections;
			const COLLECTION  = COLLECTIONS[ this.state.chosenMaterial ];

			if ( this.state.content === 'collections' ) {

				// Create a BtnCollectionComponent for each collection in the COLLECTION array

				return COLLECTION.map((collection, index) => {
					return <BtnCollectionComponent key={ index } collection={ collection.name } updateContent={ this.updateContentState } onUpdate={ this.updateCollectionChoice } />
				});
			}
		},

		createSwatchesHTML: function(caller) {

			// Function for creating the drawer swatches content

			if ( this.state.stage !== 0 ) {
				return;
			}

			// Get the swatches for the user selected collection

			const SWATCHES = this.state._swatches;
			const SWATCH   = SWATCHES[ this.state.chosenCollection ];

			if ( this.state.content === 'swatches' && caller === 'swatches' && SWATCH !== undefined ) {

				// Since the state._swatches[chosenCollection] is an object, not an array, we
				// can't just run map on it. Instead run map on each of the keys, then use that
				// key to get the individual swatches from the object

				return Object.keys(SWATCH).map((swatch, index) => {

					const CURRENT_SWATCH = SWATCH[swatch];

					const name  = CURRENT_SWATCH.name;
					const code  = CURRENT_SWATCH.code;
					const thumb = CURRENT_SWATCH.thumb;

					// Create a BtnSwatchComponent for each swatch in the SWATCH object

					return <BtnSwatchComponent key={ index } swatch={ name } thumb={ thumb } code={ code } updateContent={ this.updateContentState } onUpdate={ this.updateSwatchChoice } />
				})
			}
			else if ( this.state.content === 'swatchesSelected' && caller === 'swatches--selected' ) {

				const SELECTED_SWATCH     = this.state.chosenSwatch;
				const SELECTED_COLLECTION = this.state._swatches[this.state.chosenCollection];

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
					return <BtnSwatchComponent key={ index } swatch={ swatch.name } thumb={ swatch.thumb } updateContent={ this.updateContentState } onUpdate={ this.updateSwatchChoice } />
				});
			}
		},

		createBorderHTML: function() {

			if ( this.state.stage !== 1 ) {
				return;
			}

			if ( this.state.content === 'border' ) {
				return <p>abc</p>;
			}
		},

		render: function() {

			const _this = this;

			setInterval(function(){console.log(_this.state.stage)},2000)
			
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
						<div className="drawer__content__swatches--selected">
							<div className="drawer__swatches--selected__sidebar">
								<ul>
									{ SIDEBAR_HTML('swatches--selected') }
								</ul>
							</div>
							<div className="drawer__swatches--selected__swatches">
								<ul>
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