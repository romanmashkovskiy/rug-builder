RugBuilder.prototype.hospBuilderSummaryViewComponent = function () {
  const R = rugBuilder;
  const ProgressMenuV2 = R.progressMenuV2Component();


  /**
   * Canvas JSX - Left Side
   */
  const Canvas = ({props}) => {
    return (
      <div id="canvas" className="canvas-summary summary__left-side">
        <p className="header"> Your Chosen Design </p>

        <div className="grey-line"></div>

        {/* Canvas */}
        <div
          id="hosp_builder_img-container"
          className={
            "canvas " +
            (props.fadeOtherCanvasImages ? 'fade-images' : '') +
            " summary"
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

        <div className="summary__left-side__button-container">
          <button className="default fixed-width">
            PRINT
          </button>

          <div className="spacer"></div>

          <button className="default fixed-width">
            EMAIL
          </button>
        </div>
      </div>
  )}

  /**
   * Choices Table JSX - Right Side
   */
  const ChoicesTable = ({props}) => {
    return (
      <div className="summary__right-side">
        <div className="summary-table__structure">
          <p>STRUCTURE:</p>
          <p>
            {props.storeCanvasImages[0].alt}
            <img src={props.storeCanvasImages[0].img} />
          </p>
        </div>

        <div className="summary-table__colors">
          <div className="summary-table__colors-header">
            COLOURS
          </div>

          {
            props.storeCanvasImages.map((image, index) => {
              if (index === 0) { return null; }

              return (
                <div className="summary-table__colors-line-item" key={index}>
                  <p>Color {image.stageIndex}</p>
                  <p> {image.alt} <img src={image.src} /> </p>
                </div>
              )
            })
          }
        </div>

        <div className="summary__right-side__button-container">
          <button className="default fixed-width-195">
            PRINT
          </button>

          <div className="spacer"></div>

          <button className="default fixed-width-195">
            EMAIL
          </button>
        </div>
      </div>
  )}

  /**
   *
   */
  const SummaryView = (props) => {
    var x = document.getElementsByTagName("BODY")[0];
    x.className = 'summary-view';

    return (
      <div id="hospitality-builder" className="hospitality-builder summary-view">
        <ProgressMenuV2
          changeStage={props.changeStage}
          selectedCanvasImages={props.canvasImages}
          highlightCanvasImageOnHover={props.highlightCanvasImageOnHover}
          removeHighlightOnCanvasImage={props.removeHighlightOnCanvasImage}
          headerText="YOUR PREVIEW"
        />

          <div id="mainContainer" className="summary-view">
            {/* Canvas - Left Side */}
            <Canvas props={props} />

            <div className="summary__spacer"></div>

            {/* Table - Right Side */}
            <ChoicesTable props={props} />
          </div>
        </div>
  )}

  return SummaryView
}
