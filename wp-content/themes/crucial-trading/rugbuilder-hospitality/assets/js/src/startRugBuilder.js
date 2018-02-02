RugBuilder.prototype.start = function() {
	const R = rugBuilder;

	R.getStructuresData()
		.then(() => {
			R.AppComponent();
		})
		.catch((err) => {
			throw new Error(err)
		})
}
