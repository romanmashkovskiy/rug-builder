RugBuilder.prototype.btnStructureComponent = function() {

	const R = rugBuilder;

	const BtnStructureComponent = React.createClass({

		handleClick: function() {

			for ( let i = 0; i < 10; i++ ) {
				ReactDOM.unmountComponentAtNode(document.querySelector('#color-' + i));
				ReactDOM.unmountComponentAtNode(document.querySelector('#choice-' + i));
			}
			
			R.imageComponent(this.props.code, this.props.jpg);
			R.imageChoiceComponent(this.props.code, this.props.img);

			this.props.onClick(this.props.code);
		},

		render: function() {
			
			return (
				<li>
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