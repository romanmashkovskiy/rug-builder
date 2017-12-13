RugBuilder.prototype.hospBuilderViewComponent = function () {
  const R = rugBuilder;
  const DrawerV2 = R.drawerV2Component();
  const ProgressMenuV2 = R.progressMenuV2Component();
  const ImageChoice = R.imageChoiceComponent();


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
          headerText="CHOOSE A STRUCTURE"
        />

        <div id="mainContainer">
          <DrawerV2
          selectNewImage={props.selectNewImage}
          />

          <div id="canvas">
            {/* Canvas */}
            <div
              id="hosp_builder_img-container"
              className={
                "canvas " +
                (props.fadeOtherCanvasImages ? 'fade-images' : '')
              }
            >
              {
                props.storeCanvasImages.map((image, index) => {
                  return <img
                    alt={ image.alt }
                    src={ image.src }
                    key={index}
                    className={
                      image.stageIndex === props.stageInFocus ?
                        'in-focus' : 'out-focus'
                    } />
                })
              }
            </div>

            {/* Structure/Color choices (thumbnails) */}
            <div id="hosp_builder_choices">
              {
                props.canvasImages.map((canvasImage, index) => {
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
      </div>
  )}

  return BuilderView
}
