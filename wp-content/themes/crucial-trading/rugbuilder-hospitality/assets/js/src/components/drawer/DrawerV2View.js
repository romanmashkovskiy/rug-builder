RugBuilder.prototype.drawerV2ViewComponent = function () {
  const R = rugBuilder;

  const BtnStructureComponent = R.structureItemComponent();
  const BtnColorComponent = R.btnColorComponent();


  /**
   * structure palette view
   */
  const StructurePaletteJsx = ({props}) => {
    if (!props.structures || props.stage !== 'structures') {
      return null;
    }

    return (
      <ul className="palette-container">
        {
          Object.keys(props.structures).map((code, index) => {
            let indexPlusOne = index + 1;
            let page = Math.ceil(indexPlusOne / props.structureElementsPerPage);

            const img = props.structures[code];
            const jpg = `https://d105txpzekqrfa.cloudfront.net/hospitality/structures/${code}/base.jpg`;

            return <BtnStructureComponent
              key={index}
              code={code}
              img={img}
              jpg={jpg}
              page={page}
              pageInView={props.pageInView}
              updateStructure={props.updateStructure}
              selectNewImage={props.selectNewImage}
              disableButtons={props.disableButtons} />
          })
        }
      </ul>
  )}


  /**
   * color palette view
   */
  const ColorPaletteJsx = ({props}) => {
    if (!props.colors || props.stage !== 'colors') {
      return null;
    }

    return (
      <ul className="palette-container">
        {
          props.colors.map((color, index) => {
  					let page = 1;

  					return <BtnColorComponent
              key={ index }
              color={ color }
              structure={ props.chosenStructure }
              page={ page }
              pageInView={ props.pageInView }
              onClick={ props.updateColor }
              selectNewImage={props.selectNewImage}
              disableButtons={props.disableButtons}
            />
  				})
        }
      </ul>
    )
  };


  /**
   * View for the Drawer Component
   */
  const DrawerView = (props) => {
    return (
      <div id="drawer" className="drawerv2-container" key={props.timestamp}>
        <StructurePaletteJsx props={props} />
        <ColorPaletteJsx props={props} />
      </div>
  )}


  return DrawerView;
}
