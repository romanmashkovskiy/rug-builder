RugBuilder.prototype.btnStructureComponent = function() {

	const R = rugBuilder;

	const BtnStructureComponent = React.createClass({

		handleClick: function(e) {

			e.preventDefault();

			for ( let i = 0; i < 10; i++ ) {
				ReactDOM.unmountComponentAtNode(document.querySelector('#hosp_builder_color-' + i));
				ReactDOM.unmountComponentAtNode(document.querySelector('#hosp_builder_choice-' + i));
			}
			
			R.imageComponent(this.props.code, this.props.jpg);
			R.imageChoiceComponent(this.props.code, this.props.img);

			this.props.onClick(this.props.code);
		},

		render: function() {

			let className = 'hosp_builder_page-' + this.props.page

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
			
			return (
				<li className={ className } data-page={ this.props.page }>
					<a href="#" onClick={ this.handleClick }>
						<h3>{ this.props.code }</h3>
						<img src={ this.props.img } alt={ this.props.code } />
					</a>
				</li>
			);
		}
	});

	return BtnStructureComponent;
}