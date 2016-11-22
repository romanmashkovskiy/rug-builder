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

				if ( ( this.props.currentState.stage === 'colors' && this.props.currentState.chosenColors.length > 0 ) ||
					 ( this.props.currentState.stage === 'structures' && this.props.currentState.chosenStructure !== undefined ) ) {
					this.props.onUpdate('kinda');
				} else {
					this.props.onUpdate(false);
				}				
			}
		},

		render: function() {
			return ( <a href="#" className="expCol" onClick={ this.handleClick }>{ this.props.currentState.text }</a> )
		}
	});

	return BtnExpandCollapseComponent;
}