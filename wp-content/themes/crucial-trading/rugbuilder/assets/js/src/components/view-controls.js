RugBuilder.prototype.viewControls = function() {

	const R = rugBuilder;

	const ViewControlsComponent = React.createClass({

		getInitialState: function() {

			// Set initial state:
			// View: 0 (current view - 0: above vertical, 1: above horizontal, 2: angled, 3: angled-horizontal )
			// Zoom: 1 (zoom level - can zoom out no less than value of 0, zoom in no more than value of 6)

			return {
				view: 0,
				zoom: 1
			};
		},

		iconURLS: [
			templateDirectoryUri + '/rugbuilder/assets/icons/above-horizontal.svg',
			templateDirectoryUri + '/rugbuilder/assets/icons/angled.svg',
			templateDirectoryUri + '/rugbuilder/assets/icons/angled-horizontal.svg',
			templateDirectoryUri + '/rugbuilder/assets/icons/above-vertical.svg'
		],

		changeView: function() {

			const NEW_VIEW = R.changeView(this.state.view);

			this.setState({ view : NEW_VIEW, zoom : 1 });
		},

		zoomIn: function() {

			// Zoom In button click handler

			const NEW_ZOOM = R.zoomIn(this.state.view, this.state.zoom);

			if ( !NEW_ZOOM ) {
				return;
			}

			this.setState({ zoom : NEW_ZOOM });
		},

		zoomOut: function() {

			// Zoom Out button click handler

			const NEW_ZOOM = R.zoomOut(this.state.view, this.state.zoom);

			if ( NEW_ZOOM === false ) {
				return;
			}

			this.setState({ zoom : NEW_ZOOM });
		},

		render: function() {

			const ICON_URL = this.iconURLS[this.state.view];
			const ZOOM_IN  = templateDirectoryUri + '/rugbuilder/assets/icons/zoom-in.svg';
			const ZOOM_OUT = templateDirectoryUri + '/rugbuilder/assets/icons/zoom-out.svg';
			const CLASS    = 'view' + this.state.view;

			return (
				<div className="controls__container">
					<div className="control">
						<a className="control__link" onClick={ this.changeView }>
							<img src={ ICON_URL } alt="Change View" className={ CLASS } />
						</a>
					</div>
					<div className="control">
						<a className="control__link" onClick={ this.zoomIn }>
							<img src={ ZOOM_IN } alt="Zoom In" className="zoom" />
						</a>
					</div>
					<div className="control">
						<a className="control__link" onClick={ this.zoomOut }>
							<img src={ ZOOM_OUT } alt="Zoom Out" className="zoom" />
						</a>
					</div>
				</div>
			);
		}
	});

	ReactDOM.render( <ViewControlsComponent />, document.querySelector( '#view-controls' ) );
}