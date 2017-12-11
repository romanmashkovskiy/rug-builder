RugBuilder.prototype.start = function() {
	const R = rugBuilder;

	// R.addDOMElements();

	R.getStructuresData()
		.then(() => { initializeComponents() });

	function initializeComponents() {
		// const BtnExitComponent    = R.btnExitComponent();
		// const BtnRestartComponent = R.btnRestartComponent();
		// const BtnSubmitComponent  = R.btnSubmitComponent();
		// const BtnStageComponent   = R.btnStageComponent();
		//
		// R.menuComponent(BtnExitComponent, BtnRestartComponent, BtnSubmitComponent, BtnStageComponent);

		console.log('ini components !!');
		// R.drawerV2Component();
		// R.progressMenuV2Component();

		R.AppComponent();

		// const BtnExpandCollapseComponent = R.btnExpandCollapseComponent();
		// const BtnStructureComponent      = R.btnStructureComponent();
		// const BtnColorComponent          = R.btnColorComponent();
		// R.drawerComponent(BtnExpandCollapseComponent, BtnStructureComponent, BtnColorComponent);

		// R.calculateContainerHeight();
		//  R.hideLittleLoader();
	}
}
