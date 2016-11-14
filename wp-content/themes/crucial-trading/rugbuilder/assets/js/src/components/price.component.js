RugBuilder.prototype.priceComponent = function() {

	const R = rugBuilder;

	const PriceComponent = React.createClass({

		getInitialState: function() {
			return { price : 0 };
		},

		componentDidMount: function() {
			this.newPrice = PubSub.subscribe( 'newPrice', this.showNewPrice );
		},

		componentWillUnmount: function() {
			PubSub.unsubscribe( this.newPrice );
		},

		showNewPrice: function(price) {

			if ( price === 0 ) {
				this.setState({ price : false });
				return;
			}

			this.setState({ price: price });
			return;
		},

		render: function() {

			let HTML;

			if ( !this.state.price ) {
				HTML = '';
			}
			else {
				HTML = <span>
					<h3>£ { this.state.price }</h3>
					<a href="#">Finish Building</a>
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