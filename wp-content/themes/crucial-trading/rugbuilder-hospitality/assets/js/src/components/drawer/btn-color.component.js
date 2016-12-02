RugBuilder.prototype.btnColorComponent = function() {

	const R = rugBuilder;

	const BtnColorComponent = React.createClass({

		handleClick: function() {

			R.showLittleLoader();

			let col = templateDirectoryUri + '/rugbuilder-hospitality/assets/img/flat-colors/' + this.props.color + '.jpg';
			let url = templateDirectoryUri + '/rugbuilder-hospitality/assets/img/structures/' + this.props.structure + '/' + this.props.color + '/colour-' + R.colorStage + '.png';
			let jpg = templateDirectoryUri + '/rugbuilder-hospitality/assets/img/structures/' + this.props.structure + '/' + this.props.color + '/colour-' + R.colorStage + '.jpg';

			R.imageComponent(this.props.color, url, jpg);
			R.imageChoiceComponent(this.props.color, col);

			this.props.onClick(this.props.color);
		},

		render: function() {

			let className = 'page-' + this.props.page

			if ( this.props.page ) {

				if ( this.props.page === this.props.pageInView - 1 ) {
					className += ' left-of-window';
				}
				else if ( this.props.page === this.props.pageInView + 1 ) {
					className += ' right-of-window';
				}
				else if ( this.props.page === this.props.pageInView ) {
					className += ' in-window';
				}
				else {
					className += ' hidden';
				}
			}

			let url = templateDirectoryUri + '/rugbuilder-hospitality/assets/img/flat-colors/' + this.props.color + '.jpg';
			
			return (
				<li className={ className } data-page={ this.props.page }>
					<a href="#" onClick={ this.handleClick }>
						<img src={ url } alt={ this.props.color } />
					</a>
				</li>
			);					
		}
	});

	return BtnColorComponent;
}