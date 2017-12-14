RugBuilder.prototype.summaryViewComponent = function() {
  const R = rugBuilder;
  const ProgressMenuV2 = R.progressMenuV2Component();
  const Canvas = R.canvasComponent();

  /**
   *
   */
  const SummaryView = (props) => {
    return (
      <div className="summary">
        <ProgressMenuV2
          changeStage={null}
          selectedCanvasImages={null}
          highlightCanvasImageOnHover={null}
          removeHighlightOnCanvasImage={null}
        />

        <Canvas
          fadeOtherCanvasImages={false}
        />
      </div>
  )}

  return SummaryView;
}
