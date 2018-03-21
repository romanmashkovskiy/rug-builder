RugBuilder.prototype.ToolTipsViewComponent = function () {
  const ToolTipBox = rugBuilder.ToolTipBoxComponent();

  /**
   *
   */
  const ToolTipsView = (props) => {
    const step = props.currentStep

    return (
      <div className="tool-tips__container">
        <div className="tool-tips__background"></div>

        <p> Steps </p>

        <ToolTipBox
          text="{props.state.steps[0]}"
          step={step}
          nextStep={props.nextStep}
          prevStep={props.prevStep}
        />
      </div>
  )}


  return ToolTipsView
}
