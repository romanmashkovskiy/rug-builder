RugBuilder.prototype.drawerComponent = function(BtnExpandCollapseComponent, BtnMaterialComponent, BtnCollectionComponent, BtnSwatchComponent, SideMenuComponent) {

	const R = rugBuilder;

	const DrawerComponent = React.createClass({

		getInitialState: function() {

			let materials   = R.materials;
			let collections = R.collections;

			// Set initial state
			return {
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

		render: function() {

			const _this = this;

//			setInterval(function(){console.log(_this.state.chosenSwatch)},2000)
			
			// Functions for creating the dynamic HTML sections of the content

			const MATERIAL_HTML = function() {

				const MATERIALS_ARR = _this.state._materials;

				if ( _this.state.content === 'materials' ) {

					// Create a BtnMaterialComponent for each material in the MATERIALS_ARR array

					return MATERIALS_ARR.map((material, index) => {
						return <BtnMaterialComponent key={ index } index={ index } material={ material.name } thumb={ material.thumb } updateContent={ _this.updateContentState } updateMaterial={ _this.updateMaterialChoice } chosenMaterial={ _this.state.chosenMaterial } />
					});
				}
			}

			const SIDEBAR_HTML = function(caller) {

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

					return <SideMenuComponent material={ _this.state.chosenMaterial } />;
				}
			}

			const COLLECTIONS_HTML = function() {

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

			const SWATCHES_HTML = function(caller) {

				// Get the swatches for the user selected collection

				const SWATCHES = _this.state._swatches;
				const SWATCH   = SWATCHES[ _this.state.chosenCollection ];

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
					const SELECTED_COLLECTION = _this.state._swatches[_this.state.chosenCollection];

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

			const BORDER_HTML = function() {

				if ( _this.state.content === 'border' ) {
					return <p>abc</p>;
				}
			}

			const OPEN           = _this.state.open ? 'open' : 'closed';
			const DRAWER_CLASSES = 'drawer__content ' + OPEN + ' ' + this.state.content;

			return (
				<div className="react-container drawer__container">
					<div className={ DRAWER_CLASSES }>
						<div className="drawer__content__material">
							<ul>
								{ MATERIAL_HTML() }
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
									{ COLLECTIONS_HTML() }
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
							{ BORDER_HTML() }
						</div>
					</div>
					<BtnExpandCollapseComponent onUpdate={ this.updateOpenState } currentState={ this.state }/>
				</div>	
			);
		}
	});

	ReactDOM.render( <DrawerComponent />, document.querySelector( '#drawer' ) );
}