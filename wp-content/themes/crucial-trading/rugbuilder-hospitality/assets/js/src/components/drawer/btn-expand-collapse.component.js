RugBuilder.prototype.btnExpandCollapseComponent = function() {

	const BtnExpandCollapseComponent = React.createClass({

		handleClick: function(e) {
			
			e.preventDefault();

			if ( this.props.currentlyOpen ) {
				this.props.close();
			} else {
				this.props.open();
			}
		},

		render: function() {
			return ( <a href="#" className="hosp_builder_expCol" onClick={ this.handleClick }>{ this.props.text }</a> )
		}
	});

	return BtnExpandCollapseComponent;
}