RugBuilder.prototype.btnRestartComponent = function() {

	const BtnRestartComponent = React.createClass({

		render: function() {
			return ( <a href="#" className="progress-menu__restart">Start Again</a> );
		}
	});

	return BtnRestartComponent;
}