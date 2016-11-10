RugBuilder.prototype.btnBorderComponent = function() {

	const BtnBorderComponent = React.createClass({

		handleClick: function() {

			// On click, update state of drawer component to:
			// { content: 'swatches', chosenCollection: the collection clicked on }
//			this.props.updateContent('swatches');
//			this.props.onUpdate(this.props.collection.replace(/ /g, ''));
		},

		render: function() {
			
			return (
				<li>
					<a href="#" onClick={ this.handleClick }>
						<h3>{ this.props.border }</h3>
					</a>
				</li>
			);
		}
	});

	return BtnBorderComponent;
}