RugBuilder.prototype.calculateContainerHeight = function() {

	const R = rugBuilder;

	setTimeout(runCalculation, 100);
	window.onresize = runCalculation;

	function runCalculation() {

		const HEIGHT = document.getElementById('hosp_builder_drawer').offsetHeight + 209;

		document.getElementById('hospitality-builder').style.minHeight = HEIGHT + 'px';
	}
}