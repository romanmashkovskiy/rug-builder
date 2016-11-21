RugBuilder.prototype.btnStructureComponent = function() {

	const R = rugBuilder;

	const BtnStructureComponent = React.createClass({

		handleClick: function() {
			
			R.imageComponent(this.props.code, this.props.img);

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