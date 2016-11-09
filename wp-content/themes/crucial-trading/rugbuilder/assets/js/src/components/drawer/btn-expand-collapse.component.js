RugBuilder.prototype.btnExpandCollapseComponent = function() {

	const BtnExpandCollapseComponent = React.createClass({

		handleClick: function() {

			// On click, check the current state passed in props.
			// If the current state is open, then called the onUpdate function
			// (passed in as props), updating state to closed, and vice-versa.
			if ( this.props.currentState.open ) {
				this.props.onUpdate(true);
			}
			else {
				this.props.onUpdate(false);
			}
		},

		render: function() {
			return ( <a href="#" onClick={ this.handleClick }>{ this.props.currentState.text }</a> )
		}
	});

	return BtnExpandCollapseComponent;
}