RugBuilder.prototype.start = function() {
	const R = rugBuilder;

	R.getStructuresData()
		.then(() => {
			R.AppComponent();
			console.log('DEBUGGER');
			debugger;
		})
		.catch((err) => {
			throw new Error(err)
		})
}
