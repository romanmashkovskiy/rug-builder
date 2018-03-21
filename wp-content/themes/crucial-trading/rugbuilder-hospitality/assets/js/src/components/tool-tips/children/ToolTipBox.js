RugBuilder.prototype.ToolTipBoxComponent = function () {
  /**
   *
   */
  class ToolTipBox extends React.Component {
    constructor() {
      super()
    }


    render() {
      const step = this.props.step;

      return (
        <div className={`tool-tip__box ${step.index}`}>
          <p>{step.header}</p>

          <p className="tool-tip__box__text">{step.text}</p>

          <div className="tool-tip__box__button-container">
            <button onClick={(event) => this.props.prevStep(event)}> PREVIOUS </button>

            <button className="center-button"
              onClick={(event) => this.props.nextStep(event)}
            >
              NEXT
            </button>

            <button> FINISH </button>
          </div>
        </div>
    )}
  }

  return ToolTipBox
}
