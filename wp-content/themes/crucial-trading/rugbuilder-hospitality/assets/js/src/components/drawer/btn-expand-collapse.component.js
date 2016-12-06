RugBuilder.prototype.btnExpandCollapseComponent = function() {

	const BtnExpandCollapseComponent = React.createClass({

		handleClick: function() {
			if ( this.props.currentlyOpen ) {
				this.props.close();
			} else {
				this.props.open();
			}
		},

		render: function() {
			return ( <a href="#" className="expCol" onClick={ this.handleClick }>{ this.props.text }</a> )
		}
	});

	return BtnExpandCollapseComponent;
}