RugBuilder.prototype.btnExitComponent = function() {

	const BtnExitComponent = React.createClass({

		render: function() {
			return ( <a href="http://localhost:8888/crucial-trading" className="progress-menu__exit">Exit</a> );
		}
	});

	return BtnExitComponent;
}