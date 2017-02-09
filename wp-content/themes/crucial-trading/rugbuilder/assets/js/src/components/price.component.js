RugBuilder.prototype.priceComponent = function() {

	const R = rugBuilder;

	const PriceComponent = React.createClass({

		getInitialState: function() {

			return {
				length : 0,
				price  : 0,
				width  : 0
			};
		},

		componentDidMount: function() {
			this.newPrice = PubSub.subscribe( 'newPrice', this.showNewPrice );
		},

		componentWillUnmount: function() {
			PubSub.unsubscribe( this.newPrice );
		},

		showNewPrice: function(data) {

			let price  = data[0];
			let length = data[1];
			let width  = data[2];

			if ( price === 0 ) {
				this.setState({ price : false });
				return;
			}

			this.setState({ length : length, price : price, width : width });
			return;
		},

		goToOrderScreen: function() {

			R.camera.position.x = 0;
			R.camera.position.y = 170;
			R.camera.position.z = window.innerHeight / window.innerWidth;

			R.camera.rotation.x = -1.5708;
			R.camera.rotation.y = 0;
			R.camera.rotation.z = 0;

			R.camera.zoom = 1.5;

			R.camera.updateProjectionMatrix();

			R.loadingScreens('full', 'open');

			setTimeout(function() {
				R.orderScreenComponent();
			}, 10)
		},

		render: function() {

			let HTML;

			if ( !this.state.price ) {
				HTML = '';
			}
			else {
				HTML = <span>
					<h3>£ { this.state.price }</h3>
					<a href="#" onClick={ this.goToOrderScreen }>Finish Building</a>
				</span>;
			}

			return (
				<div className="price__container">
					{ HTML }
				</div>
			);
		}
	});

	ReactDOM.render( <PriceComponent />, document.querySelector( '#price' ) );
}