RugBuilder.prototype.start = function() {

	const R = rugBuilder;

	R.addDOMElements();

	R.getStructuresData()
		.then(() => { initializeComponents() });

	function initializeComponents() {
		const BtnExitComponent    = R.btnExitComponent();
		const BtnRestartComponent = R.btnRestartComponent();
		const BtnSubmitComponent  = R.btnSubmitComponent();
		const BtnStageComponent   = R.btnStageComponent();
		R.menuComponent(BtnExitComponent, BtnRestartComponent, BtnSubmitComponent, BtnStageComponent);

		// const BtnExpandCollapseComponent = R.btnExpandCollapseComponent();
		// const BtnStructureComponent      = R.btnStructureComponent();
		// const BtnColorComponent          = R.btnColorComponent();
		// R.drawerComponent(BtnExpandCollapseComponent, BtnStructureComponent, BtnColorComponent);

		/* Drawer Component */
    R.drawerV2Component();

		// R.calculateContainerHeight();
		//  R.hideLittleLoader();
	}
}
