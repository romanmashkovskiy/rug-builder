RugBuilder.prototype.btnMaterialComponent = function() {

	const R = rugBuilder;

	const BtnMaterialComponent = React.createClass({

		handleClick: function() {

			let content;

			if ( this.props.currentStage === 0 ) {
				content = 'collections';
			}
			else if ( this.props.currentStage === 2 || this.props.currentStage === 3 ) {
				content = 'swatches'
			}

			// On click, update state of drawer component to:
			// { content: 'collection', chosenCollection: the material clicked on }
			this.props.updateContent(content);
			this.props.updateMaterial(this.props.material);
		},

		render: function() {
			return (
				<li>
					<a href="#" onClick={ this.handleClick }>
						<img src={ this.props.thumb } alt={ this.props.material } />
						<h3>{ this.props.material }</h3>
					</a>
				</li>
			);
		}
	});

	return BtnMaterialComponent;
}