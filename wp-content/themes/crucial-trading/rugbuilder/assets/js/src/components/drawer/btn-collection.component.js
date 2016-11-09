RugBuilder.prototype.btnCollectionComponent = function() {

	const BtnCollectionComponent = React.createClass({

		handleClick: function() {

			// On click, update state of drawer component to:
			// { content: 'swatches', chosenCollection: the collection clicked on }
			this.props.updateContent('swatches');
			this.props.onUpdate(this.props.collection.replace(/ /g, ''));
		},

		render: function() {
			
			return (
				<li>
					<a href="#" onClick={ this.handleClick }>
						<h3>{ this.props.collection }</h3>
					</a>
				</li>
			);
		}
	});

	return BtnCollectionComponent;
}