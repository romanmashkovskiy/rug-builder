RugBuilder.prototype.viewControls = function() {

	const R = rugBuilder;

	const ViewControlsComponent = React.createClass({

		getInitialState: function() {
			return {
				view: 0,
				zoom: 1
			};
		},

		changeView: function() {

			const CURRENT_VIEW = this.state.view;

			if ( CURRENT_VIEW === 0 ) {

				R.camera.position.x = 0;
				R.camera.position.y = 170;
				R.camera.position.z = -55;

				R.camera.rotation.x = -1.5708;
				R.camera.rotation.y = 0;
				R.camera.rotation.z = 0;

				this.setState({ view : 1 });
			}
			else if ( CURRENT_VIEW === 1 ) {

				R.camera.position.x = -58.25551669838936;
				R.camera.position.y = 103.7487525991614;
				R.camera.position.z = 132.44381733713013;

				R.camera.rotation.x = -0.6645005541912388;
				R.camera.rotation.y = -0.33334042300972533;
				R.camera.rotation.z = -0.25090904322969587;

				this.setState({ view : 0 });
			}
		},

		zoomIn: function() {

			const CURRENT_VIEW = this.state.view;

			const CURRENT_ZOOM = this.state.zoom;
			const ZOOM_IN      = CURRENT_ZOOM + 1;

			if ( ZOOM_IN > 6 ){
				return;
			}

			if ( CURRENT_VIEW === 1 ) {

				const CURRENT_Y = R.camera.position.y;
				const ZOOM_Y    = CURRENT_Y - 30;

				console.log(ZOOM_Y)

				R.camera.position.y = ZOOM_Y;
			}
			else if ( CURRENT_VIEW === 0 ) {


			}

			this.setState({ zoom : ZOOM_IN });
		},

		zoomOut: function() {

			const CURRENT_VIEW = this.state.view;

			const CURRENT_ZOOM = this.state.zoom;
			const ZOOM_OUT     = CURRENT_ZOOM - 1;

			if ( ZOOM_OUT < 0 ) {
				return;
			}

			if ( CURRENT_VIEW === 1 ) {

				const CURRENT_Y = R.camera.position.y;
				const ZOOM_Y    = CURRENT_Y + 30;

				console.log(ZOOM_Y)

				R.camera.position.y = ZOOM_Y;
			}
			else if ( CURRENT_VIEW === 0 ) {


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