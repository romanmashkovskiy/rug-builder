RugBuilder.prototype.btnColorComponent = function() {

	const R = rugBuilder;

	const BtnColorComponent = React.createClass({

		handleClick: function(e) {

			e.preventDefault();

			R.showLittleLoader();

			let col = 'https://d105txpzekqrfa.cloudfront.net/hospitality/colours/' + this.props.color + '.jpg';
			let url = 'https://d105txpzekqrfa.cloudfront.net/hospitality/structures/' + this.props.structure + '/' + this.props.color + '/colour-' + R.colorStage + '.png';
			let jpg = 'https://d105txpzekqrfa.cloudfront.net/hospitality/structures/' + this.props.structure + '/' + this.props.color + '/colour-' + R.colorStage + '.jpg';

			R.imageComponent(this.props.color, url, jpg);
			R.imageChoiceComponent(this.props.color, col);

			this.props.onClick(this.props.color);
		},

		render: function() {

			let className = 'hosp_builder_page-' + this.props.page

			if ( this.props.page ) {

				if ( this.props.page === this.props.pageInView - 1 ) {
					className += ' hosp_builder_left-of-window';
				}
				else if ( this.props.page === this.props.pageInView + 1 ) {
					className += ' hosp_builder_right-of-window';
				}
				else if ( this.props.page === this.props.pageInView ) {
					className += ' hosp_builder_in-window';
				}
				else {
					className += ' hosp_builder_hidden';
				}
			}

			let url = 'https://d105txpzekqrfa.cloudfront.net/hospitality/colours/' + this.props.color + '.jpg';
			
			return (
				<li className={ className } data-page={ this.props.page }>
					<a href="#" onClick={ this.handleClick }>
						<h3>{ this.props.color }</h3>
						<img src={ url } alt={ this.props.color } />
					</a>
				</li>
			);					
		}
	});

	return BtnColorComponent;
}