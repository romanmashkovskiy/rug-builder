RugBuilder.prototype.start = function() {

	const R = rugBuilder;

	R.showLittleLoader();

	// Data

	R.getStructuresData()
		.then(() => { continueLoading() });

	function continueLoading() {

		// React Components

		// Progress Menu
		const BtnExitComponent    = R.btnExitComponent();
		const BtnRestartComponent = R.btnRestartComponent();
		const BtnSubmitComponent  = R.btnSubmitComponent();
		const BtnStageComponent   = R.btnStageComponent();
		R.menuComponent(BtnExitComponent, BtnRestartComponent, BtnSubmitComponent, BtnStageComponent);

		// Drawer

		const BtnExpandCollapseComponent = R.btnExpandCollapseComponent();
		const BtnStructureComponent      = R.btnStructureComponent();
		const BtnColorComponent          = R.btnColorComponent();
		R.drawerComponent(BtnExpandCollapseComponent, BtnStructureComponent, BtnColorComponent);

		R.hideLittleLoader();
	}
}