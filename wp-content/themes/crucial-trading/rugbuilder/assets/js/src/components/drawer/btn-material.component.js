RugBuilder.prototype.btnMaterialComponent = function() {

	const BtnMaterialComponent = React.createClass({

		handleClick: function() {

			// On click, update state of drawer component to:
			// { content: 'collection', chosenCollection: the material clicked on }
			this.props.updateContent('collections');
			this.props.updateMaterial(this.props.material);
		},

		render: function() {
			return (
				<li>
					<a href="#" onClick={ this.handleClick }>{ this.props.material }</a>
				</li>
			);
		}
	});

	return BtnMaterialComponent;
}