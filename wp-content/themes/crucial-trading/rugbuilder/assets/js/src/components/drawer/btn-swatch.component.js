RugBuilder.prototype.btnSwatchComponent = function() {

	const BtnSwatchComponent = React.createClass({

		handleClick: function() {

			// On click, update state of drawer component to:
			// { content: 'swatchesSelected', chosenCollection: the swatch clicked on }
			this.props.updateContent('swatchesSelected');
			this.props.onUpdate(this.props.swatch, this.props.thumb, this.props.id);
		},

		render: function() {

			let classes = '';

			if ( this.props.selected === this.props.swatch ) {
				classes = 'selected';
			}
			
			return (
				<li className={ classes }>
					<a href="#" onClick={ this.handleClick }>
						<img src={ this.props.thumb } alt={ this.props.swatch } />
						<h3>{ this.props.code }</h3>
					</a>
				</li>
			);
		}
	});

	return BtnSwatchComponent;
}