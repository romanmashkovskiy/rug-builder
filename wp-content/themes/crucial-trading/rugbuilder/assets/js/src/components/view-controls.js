RugBuilder.prototype.viewControls = function() {

	const R = rugBuilder;

	const ViewControlsComponent = React.createClass({

		getInitialState: function() {

			// Set initial state:
			// View: 0 (the angled view - top view is represented by value of 1)
			// Zoom: 1 (zoom level - can zoom out no less than value of 0, zoom in no more than value of 6)

			return {
				view: 0,
				zoom: 1
			};
		},

		changeView: function() {

			// Change View button click handler

			const CURRENT_VIEW = this.state.view;

			if ( CURRENT_VIEW === 0 ) {

				// Change to top view

				R.camera.position.x = 0;
				R.camera.position.y = 170;
				R.camera.position.z = -55;

				R.camera.rotation.x = -1.5708;
				R.camera.rotation.y = 0;
				R.camera.rotation.z = 0;

				this.setState({ view : 1, zoom : 1 });
			}
			else if ( CURRENT_VIEW === 1 ) {

				// Change to angled view

				R.camera.position.x = -58.25551669838936;
				R.camera.position.y = 103.7487525991614;
				R.camera.position.z = 132.44381733713013;

				R.camera.rotation.x = -0.6645005541912388;
				R.camera.rotation.y = -0.33334042300972533;
				R.camera.rotation.z = -0.25090904322969587;

				this.setState({ view : 0, zoom : 1 });
			}
		},

		zoomIn: function() {

			// Zoom In button click handler

			const CURRENT_VIEW = this.state.view;

			const CURRENT_ZOOM = this.state.zoom;
			const ZOOM_IN      = CURRENT_ZOOM + 1;

			console.log(ZOOM_IN)

			if ( ZOOM_IN > 6 ){
				// If trying to zoom in to more than zoom level 6, return as that is the max zoom
				return;
			}

			if ( CURRENT_VIEW === 1 ) {

				// If top view, simply subtract 30 from the camera's Y position

				const CURRENT_Y = R.camera.position.y;
				const ZOOM_Y    = CURRENT_Y - 30;

				R.camera.position.y = ZOOM_Y;
			}
			else if ( CURRENT_VIEW === 0 ) {

				// If angled view, it's a bit more complicated, adding to the X position, but subtracting from the Y and Z positions

				const CURRENT_X = R.camera.position.x;
				const CURRENT_Y = R.camera.position.y;
				const CURRENT_Z = R.camera.position.z;

				const ZOOM_X = CURRENT_X + 10;
				const ZOOM_Y = CURRENT_Y - 20;
				const ZOOM_Z = CURRENT_Z - 20;

				R.camera.position.x = ZOOM_X;
				R.camera.position.y = ZOOM_Y;
				R.camera.position.z = ZOOM_Z;
			}

			this.setState({ zoom : ZOOM_IN });
		},

		zoomOut: function() {

			// Zoom Out button click handler

			const CURRENT_VIEW = this.state.view;

			const CURRENT_ZOOM = this.state.zoom;
			const ZOOM_OUT     = CURRENT_ZOOM - 1;

			if ( ZOOM_OUT < 0 ) {
				// If trying to zoom out to less than zoom level 0, return as that is the min zoom
				return;
			}

			if ( CURRENT_VIEW === 1 ) {

				// If top view, simply add 30 to the camera's Y position

				const CURRENT_Y = R.camera.position.y;
				const ZOOM_Y    = CURRENT_Y + 30;

				R.camera.position.y = ZOOM_Y;
			}
			else if ( CURRENT_VIEW === 0 ) {

				// If angled view, it's a bit more complicated, subtracting from the X position, but adding to the Y and Z positions

				const CURRENT_X = R.camera.position.x;
				const CURRENT_Y = R.camera.position.y;
				const CURRENT_Z = R.camera.position.z;

				const ZOOM_X = CURRENT_X - 10;
				const ZOOM_Y = CURRENT_Y + 20;
				const ZOOM_Z = CURRENT_Z + 20;

				R.camera.position.x = ZOOM_X;
				R.camera.position.y = ZOOM_Y;
				R.camera.position.z = ZOOM_Z;
			}

			this.setState({ zoom : ZOOM_OUT });

		},

		render: function() {

			return (
				<div className="controls__container">
					<a className="controls__link" onClick={ this.changeView }>
						<img src="" alt="Change View" />
					</a>
					<a className="controls__link" onClick={ this.zoomIn }>
						<img src="" alt="Zoom In" />
					</a>
					<a className="controls__link" onClick={ this.zoomOut }>
						<img src="" alt="Zoom Out" />
					</a>
				</div>
			);
		}
	});

	ReactDOM.render( <ViewControlsComponent />, document.querySelector( '#view-controls' ) );
}