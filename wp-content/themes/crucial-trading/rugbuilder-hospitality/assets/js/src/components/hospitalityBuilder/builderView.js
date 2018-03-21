RugBuilder.prototype.hospBuilderViewComponent = function () {
  const R = rugBuilder;
  const DrawerV2 = R.drawerV2Component();
  const ProgressMenuV2 = R.progressMenuV2Component();
  const ImageChoice = R.imageChoiceComponent();
  const Canvas = R.canvasComponent();
  const ToolTips = R.ToolTipsComponent();
  const Link = window.ReactRouterDOM.Link;



  /**
   *
   */
  const BuilderView = (props) => {

    return (
      <div id="hospitality-builder">
        <ProgressMenuV2
          changeStage={props.changeStage}
          selectedCanvasImages={props.canvasImages}
          highlightCanvasImageOnHover={props.highlightCanvasImageOnHover}
          removeHighlightOnCanvasImage={props.removeHighlightOnCanvasImage}
          headerText={props.progressMenuHeader}
        />

        <div id="mainContainer">
          <DrawerV2
            selectNewImage={props.selectNewImage}
          />

          <div id="canvas" className="canvas-container">
            <div className="canvas-builder">
              <Canvas
                fadeOtherCanvasImages={props.fadeOtherCanvasImages}
                stageInFocus={props.stageInFocus}
              />

              { props.selectedChoiceCount >= 2 &&
                <Link to={`summary`}>
                  <button id="finishDesignButton" className="default">
                    FINISH YOUR DESIGN
                  </button>
                </Link>
              }
            </div>


            <div className="spacer"></div>

            {/* Structure/Color choices (thumbnails) */}
            <div id="hosp_builder_choices"
              className="choice-thumbnail-container"
            >
              {
                props.storeCanvasImages &&
                  props.storeCanvasImages.map((canvasImage, index) => {
                    if (!canvasImage.selected) { return null; }

                    return <ImageChoice
                      src={canvasImage.img}
                      alt={canvasImage.alt}
                      stage={canvasImage.stageIndex}
                      key={index} />
                  })
              }
            </div>
          </div>
        </div>

        {/* <ToolTips /> */}
      </div>
  )}

  return BuilderView
}
