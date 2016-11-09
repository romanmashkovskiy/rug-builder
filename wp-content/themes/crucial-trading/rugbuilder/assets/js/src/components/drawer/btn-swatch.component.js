RugBuilder.prototype.btnSwatchComponent = function() {

	const BtnSwatchComponent = React.createClass({

		handleClick: function() {

			// On click, update state of drawer component to:
			// { content: 'swatchesSelected', chosenCollection: the swatch clicked on }
			this.props.updateContent('swatchesSelected');
			this.props.onUpdate(this.props.swatch.replace(/ /g, ''));
		},

		render: function() {
			
			return (
				<li>
					<a href="#" onClick={ this.handleClick }>{ this.props.swatch }</a>
				</li>
			);
		}
	});

	return BtnSwatchComponent;
}