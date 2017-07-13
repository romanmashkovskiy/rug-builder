RugBuilder.prototype.btnBorderComponent = function() {

	const BtnBorderComponent = React.createClass({

		handleClick: function() {

			// On click, update state of drawer component to:
			// { content: 'swatches', chosenCollection: the collection clicked on }
//			this.props.updateContent('swatches');
			this.props.onUpdate(this.props.border);
		},

		render: function() {

			let url;

			switch ( this.props.border ) {

				case 'Single Border' : url = 'https://d105txpzekqrfa.cloudfront.net/uploads/2016/11/11174349/single-border-icon.svg'; break;
				case 'Single & Piping' : url = 'https://d105txpzekqrfa.cloudfront.net/uploads/2016/11/11174352/single-piping-icon.svg'; break;
				case 'Double Border' : url = 'https://d105txpzekqrfa.cloudfront.net/uploads/2016/11/11174338/double-border-icon.svg'; break;
			}

			return (
				<li>
					<a href="#" onClick={ this.handleClick }>
						<img src={ url } alt={ this.props.border } />
						<h3>{ this.props.border }</h3>
					</a>
				</li>
			);
		}
	});

	return BtnBorderComponent;
}
