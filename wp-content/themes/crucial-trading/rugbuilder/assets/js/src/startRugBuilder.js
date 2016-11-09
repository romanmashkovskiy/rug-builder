RugBuilder.prototype.start = function() {

	const R = rugBuilder;

	// React Components

	// Progress Menu
	const BtnExitComponent    = R.btnExitComponent();
	const BtnRestartComponent = R.btnRestartComponent();
	const BtnStageComponent   = R.btnStageComponent();
	R.menuComponent(BtnExitComponent, BtnRestartComponent, BtnStageComponent);

	// Drawer
	const BtnExpandCollapseComponent = R.btnExpandCollapseComponent();
	const BtnMaterialComponent = R.btnMaterialComponent();
	const BtnCollectionComponent = R.btnCollectionComponent();
	const BtnSwatchComponent = R.btnSwatchComponent();
	const SideMenuComponent = R.sideMenuComponent();
	R.drawerComponent(BtnExpandCollapseComponent, BtnMaterialComponent, BtnCollectionComponent, BtnSwatchComponent, SideMenuComponent);
}