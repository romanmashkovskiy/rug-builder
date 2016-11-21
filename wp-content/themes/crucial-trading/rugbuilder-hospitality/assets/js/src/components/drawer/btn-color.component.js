RugBuilder.prototype.btnColorComponent = function() {

	const R = rugBuilder;

	const BtnColorComponent = React.createClass({

		handleClick: function() {

			R.showLittleLoader();

			let url = templateDirectoryUri + '/rugbuilder-hospitality/assets/img/rugs/' + this.props.structure + '/' + this.props.color + '/colour-' + R.colorStage + '.png';

			R.imageComponent(this.props.color, url);

			this.props.onClick(this.props.color);
		},

		render: function() {

			let url = templateDirectoryUri + '/rugbuilder-hospitality/assets/img/flat-colors/' + this.props.color + '.jpg';
			
			return (
				<li>
					<a href="#" onClick={ this.handleClick }>
						<img src={ url } alt={ this.props.color } />
					</a>
				</li>
			);
		}
	});

	return BtnColorComponent;
}