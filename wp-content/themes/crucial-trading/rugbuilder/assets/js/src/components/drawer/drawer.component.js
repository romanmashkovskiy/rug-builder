RugBuilder.prototype.drawerComponent = function(BtnExpandCollapseComponent, BtnMaterialComponent, BtnCollectionComponent, BtnSwatchComponent, SideMenuComponent) {

	const DrawerComponent = React.createClass({

		getInitialState: function() {

			// Set initial state
			return {
				content : 'materials',

				open : false,
				text : 'Expand',

				chosenMaterial   : undefined,
				chosenCollection : undefined,
				chosenSwatch     : undefined
			}
		},

		placeholderData: {

			materials : [ 'Sisal', 'Wool', 'Sisool', 'Coir', 'Seagrass', 'Jute' ],

			collections : {
				Sisal: [ 'Sisal Collection 1', 'Sisal Collection 2' ],
				Wool: [ 'Wool Collection 1', 'Wool Collection 2' ],
				Sisool: [ 'Sisool Collection 1', 'Sisool Collection 2' ],
				Coir: [ 'Coir Collection 1', 'Coir Collection 2' ],
				Seagrass: [ 'Seagrass Collection 1', 'Seagrass Collection 2' ],
				Jute: [ 'Jute Collection 1', 'Jute Collection 2' ]
			},

			swatches : {
				SisalCollection1: [ 
					'Sisal 1 Swatch 1', 'Sisal 1 Swatch 2', 'Sisal 1 Swatch 3', 'Sisal 1 Swatch 4',
					'Sisal 1 Swatch 5', 'Sisal 1 Swatch 6', 'Sisal 1 Swatch 7', 'Sisal 1 Swatch 8',
					'Sisal 1 Swatch 9', 'Sisal 1 Swatch 10'
				],
				SisalCollection2: [ 
					'Sisal 2 Swatch 1', 'Sisal 2 Swatch 2', 'Sisal 2 Swatch 3', 'Sisal 2 Swatch 4',
					'Sisal 2 Swatch 5', 'Sisal 2 Swatch 6', 'Sisal 2 Swatch 7', 'Sisal 2 Swatch 8',
					'Sisal 2 Swatch 9', 'Sisal 2 Swatch 10'
				],
				WoolCollection1: [ 
					'Wool 1 Swatch 1', 'Wool 1 Swatch 2', 'Wool 1 Swatch 3', 'Wool 1 Swatch 4',
					'Wool 1 Swatch 5', 'Wool 1 Swatch 6', 'Wool 1 Swatch 7', 'Wool 1 Swatch 8',
					'Wool 1 Swatch 9', 'Wool 1 Swatch 10'
				],
				WoolCollection2: [ 
					'Wool 2 Swatch 1', 'Wool 2 Swatch 2', 'Wool 2 Swatch 1', 'Wool 2 Swatch 2',
					'Wool 2 Swatch 1', 'Wool 2 Swatch 2', 'Wool 2 Swatch 1', 'Wool 2 Swatch 2',
					'Wool 2 Swatch 1', 'Wool 2 Swatch 2'
				],
				SisoolCollection1: [ 
					'Sisool 1 Swatch 1', 'Sisool 1 Swatch 2', 'Sisool 1 Swatch 3', 'Sisool 1 Swatch 4',
					'Sisool 1 Swatch 5', 'Sisool 1 Swatch 6', 'Sisool 1 Swatch 7', 'Sisool 1 Swatch 8',
					'Sisool 1 Swatch 9', 'Sisool 1 Swatch 10'
				],
				SisoolCollection2: [ 
					'Sisool 2 Swatch 1', 'Sisool 2 Swatch 2', 'Sisool 2 Swatch 3', 'Sisool 2 Swatch 4',
					'Sisool 2 Swatch 5', 'Sisool 2 Swatch 6', 'Sisool 2 Swatch 7', 'Sisool 2 Swatch 8',
					'Sisool 2 Swatch 9', 'Sisool 2 Swatch 10'
				],
				CoirCollection1: [ 
					'Coir 1 Swatch 1', 'Coir 1 Swatch 2', 'Coir 1 Swatch 3', 'Coir 1 Swatch 4',
					'Coir 1 Swatch 5', 'Coir 1 Swatch 6', 'Coir 1 Swatch 7', 'Coir 1 Swatch 8',
					'Coir 1 Swatch 9', 'Coir 1 Swatch 10'
				],
				CoirCollection2: [ 
					'Coir 2 Swatch 1', 'Coir 2 Swatch 2', 'Coir 2 Swatch 3', 'Coir 2 Swatch 4',
					'Coir 2 Swatch 5', 'Coir 2 Swatch 6', 'Coir 2 Swatch 7', 'Coir 2 Swatch 8',
					'Coir 2 Swatch 9', 'Coir 2 Swatch 10'
				],
				SeagrassCollection1: [ 
					'Seagrass 1 Swatch 1', 'Seagrass 1 Swatch 2', 'Seagrass 1 Swatch 3', 'Seagrass 1 Swatch 4', 
					'Seagrass 1 Swatch 5', 'Seagrass 1 Swatch 6', 'Seagrass 1 Swatch 7', 'Seagrass 1 Swatch 8',
					'Seagrass 1 Swatch 9', 'Seagrass 1 Swatch 10'
				],
				SeagrassCollection2: [ 
					'Seagrass 2 Swatch 1', 'Seagrass 2 Swatch 2', 'Seagrass 2 Swatch 3', 'Seagrass 2 Swatch 4', 
					'Seagrass 2 Swatch 5', 'Seagrass 2 Swatch 6', 'Seagrass 2 Swatch 7', 'Seagrass 2 Swatch 8',
					'Seagrass 2 Swatch 9', 'Seagrass 2 Swatch 10'
				],
				JuteCollection1: [ 
					'Jute 1 Swatch 1', 'Jute 1 Swatch 2', 'Jute 1 Swatch 3', 'Jute 1 Swatch 4',
					'Jute 1 Swatch 5', 'Jute 1 Swatch 6', 'Jute 1 Swatch 7', 'Jute 1 Swatch 8',
					'Jute 1 Swatch 9', 'Jute 1 Swatch 10'
				],
				JuteCollection2: [ 
					'Jute 2 Swatch 1', 'Jute 2 Swatch 2', 'Jute 2 Swatch 3', 'Jute 2 Swatch 4',
					'Jute 2 Swatch 5', 'Jute 2 Swatch 6', 'Jute 2 Swatch 7', 'Jute 2 Swatch 8',
					'Jute 2 Swatch 9', 'Jute 2 Swatch 10'
				],
			}
		},

		updateOpenState: function(open) {

			// Function for updating the open/closed state
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
			// Gets passed to all of the content componentsas props.
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

			// Function for updating the chosenCollection state.
			// Get passed to the Collection Button Components as props.
			// Updates the chosenCollection state to whatever is given to it by the component.
			this.setState({ chosenCollection: collection });
		},

		updateSwatchChoice: function(swatch) {

			// Function for updating the chosenSwatch state.
			// Get passed to the Swatch Button Components as props.
			// Updates the chosenSwatch state to whatever is given to it by the component.
			this.setState({ chosenSwatch: swatch });
		},

		render: function() {

			const _this = this;
			
			// Functions for creating the dynamic HTML sections of the content

			const MATERIAL_HTML = function() {

				const MATERIALS_ARR = _this.placeholderData.materials;

				if ( _this.state.content === 'materials' ) {

					// Create a BtnMaterialComponent for each material in the MATERIALS_ARR array

					return MATERIALS_ARR.map((material, index) => {
						return <BtnMaterialComponent key={ index } material={ material } updateContent={ _this.updateContentState } updateMaterial={ _this.updateMaterialChoice } />
					});
				}
			}

			const SIDEBAR_HTML = function(caller) {

				const MATERIALS_ARR = _this.placeholderData.materials;

				if ( _this.state.content === 'collections' && caller === 'collections' ) {

					// Create a SideMenuComponent for each material in the MATERIALS_ARR array

					return MATERIALS_ARR.map((material, index) => {
						return <SideMenuComponent key={ index } material={ material } onUpdate={ _this.updateMaterialChoice } />;
					});
				} 
				else if ( _this.state.content === 'swatches' && caller === 'swatches' ) {

					// Create a SideMenuComponent for each material in the MATERIALS_ARR array

					return MATERIALS_ARR.map((material, index) => {
						return <SideMenuComponent key={ index } material={ material } updateContent={ _this.updateContentState } onUpdate={ _this.updateMaterialChoice } />;
					});
				}
				else if ( _this.state.content === 'swatchesSelected' && caller === 'swatches--selected' ) {

					// Create a SideMenuComponent for the user selected material

					return <SideMenuComponent material={ _this.state.chosenMaterial } />;
				}
			}

			const COLLECTIONS_HTML = function() {

				// Get the collections for the user selected material

				const COLLECTIONS = _this.placeholderData.collections;
				const COLLECTION  = COLLECTIONS[ _this.state.chosenMaterial ];

				if ( _this.state.content === 'collections' ) {

					// Create a BtnCollectionComponent for each collection in the COLLECTION array

					return COLLECTION.map((collection, index) => {
						return <BtnCollectionComponent key={ index } collection={ collection } updateContent={ _this.updateContentState } onUpdate={ _this.updateCollectionChoice } />
					});
				}
			}

			const SWATCHES_HTML = function(caller) {

				// Get the swatches for the user selected collection

				const SWATCHES = _this.placeholderData.swatches;
				const SWATCH   = SWATCHES[ _this.state.chosenCollection ];

				if ( _this.state.content === 'swatches' && caller === 'swatches' ) {

					// Create a BtnSwatchComponent for each swatch in the SWATCH array

					return SWATCH.map((swatch, index) => {
						return <BtnSwatchComponent key={ index } swatch={ swatch } updateContent={ _this.updateContentState } onUpdate={ _this.updateSwatchChoice } />
					});
				}
				else if ( _this.state.content === 'swatchesSelected' && caller === 'swatches--selected' ) {

					// Get the selected swatch and work on it's index in the corresponding swatch array
					// Will need changing - production swatches won't end in numbers

					const SELECTED_SWATCH = _this.state.chosenSwatch;
					const SWATCH_LENGTH   = SELECTED_SWATCH.length;
					const SWATCH_NUMBER   = SELECTED_SWATCH.substr(SWATCH_LENGTH-1, 1);
					const SWATCH_INDEX    = SWATCH_NUMBER - 1;

					// Create array of 5 swatches to be shown (with the selected swatch having a tick)

					let swatchArr = [];

					if ( SWATCH_INDEX > 1 ) {

						for ( let i = SWATCH_INDEX - 2; i < SWATCH_INDEX + 3; i++ ) {

							let tick = i === SWATCH_INDEX ? ' tick' : '';
							swatchArr.push(SWATCHES[_this.state.chosenCollection][i] + tick);
						}
					}
					else {

						for ( let i = 0; i < SWATCH_INDEX; i++ ) {
							swatchArr.push(SWATCHES[_this.state.chosenCollection][i]);
						}

						swatchArr.push(SWATCHES[_this.state.chosenCollection][SWATCH_INDEX] + ' (tick)');

						for ( let i2 = SWATCH_INDEX + 1; i2 < 5; i2++ ) {
							swatchArr.push(SWATCHES[_this.state.chosenCollection][i2]);
						}
					}

					// Create a BtnSwatchComponent for each swatch in the swatchArr array

					return swatchArr.map((swatch, index) => {
						return <BtnSwatchComponent key={ index } swatch={ swatch } />
					});
				}
			}

			const BORDER_HTML = function() {

				if ( _this.state.content === 'border' ) {
					return <p>abc</p>;
				}
			}

			const OPEN           = _this.state.open ? 'open' : 'closed';
			const DRAWER_CLASSES = 'drawer__content ' + OPEN;

			return (
				<div className="react-container drawer__container">
					<div className={ DRAWER_CLASSES }>
						<div className="drawer__content__material">
							<ul>
								{ MATERIAL_HTML() }
							</ul>
						</div>
						<div className="drawer__content__collections">
							<div className="drawer__collections__sidebar">
								<ul>
									{ SIDEBAR_HTML('collections') }
								</ul>
							</div>
							<div className="drawer__collections__collections">
								<ul>
									{ COLLECTIONS_HTML() }
								</ul>
							</div>
						</div>
						<div className="drawer__content__swatches">
							<div className="drawer__swatches__sidebar">
								<ul>
									{ SIDEBAR_HTML('swatches') }
								</ul>
							</div>
							<div className="drawer__swatches__swatches">
								<ul>
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