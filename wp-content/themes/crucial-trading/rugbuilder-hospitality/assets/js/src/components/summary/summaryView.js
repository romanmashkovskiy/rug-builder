RugBuilder.prototype.summaryViewComponent = function() {
  const R = rugBuilder;
  const ProgressMenuV2 = R.progressMenuV2Component();
  const Canvas = R.canvasComponent();
  const EmailModal = R.EmailModalComponent();

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

        email modal ??????
        <EmailModal />
      </div>
  )}

  return SummaryView;
}
