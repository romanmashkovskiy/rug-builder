RugBuilder.prototype.EmailModalComponent = function (choices) {
  const R = rugBuilder;

  class EmailModal extends React.Component {
    constructor() {
      super();

      this.state = {
        structure : R.choices.structure,
        colour1   : R.choices.color1,
        colour2   : R.choices.color2,
        colour3   : R.choices.color3,
        colour4   : R.choices.color4,
        colour5   : R.choices.color5,
        colour6   : R.choices.color6,
        colour7   : R.choices.color7,
        colour8   : R.choices.color8,
        colour9   : R.choices.color9,

        name: '',
        company: '',
        address: '',
        email: '',
        emailResponse: '',

        emailSent: false,
        emailResponded: false,
      }
    }

    /**
     * HANDLERS
     */
    handleNameChange = (event) => {
      this.setState({name: event.target.value});
    }

    handleCompanyChange = (event) => {
      this.setState({company: event.target.value});
    }

    handleAddressChange = (event) => {
      this.setState({address: event.target.value});
    }

    handleEmailChange = (event) => {
      console.log('handle email change');

      this.setState({email: event.target.value});
    }


    /**
     *
     */
    sendEmail = () => {
      console.log('send email !!');
      this.setState({emailSent: true});

      let req = new XMLHttpRequest();
      req.addEventListener('load', this.emailCallback);

      req.open('POST', this.getPostUrl());
      req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      req.send("choices=" + JSON.stringify(this.state) + "&from=" + this.state.email);
    }

    /**
     *
     */
    emailCallback = (response) => {
      let res = response.srcElement.responseText;
      let msg = ''

      switch ( res ) {
        case 'invalid email' :
          msg = 'Sorry, your email is invalid. Please ensure you have typed ' +
            'it correctly and try again.'
          break;

        case 'success' :
          msg  = 'YOUR EMAIL WAS SENT SUCCESSFULLY';
          break;

        default :
          msg = 'Sorry, an error has occured. Please try again.';
      }

      this.setState({
        emailResponded: true,
        emailResponse: msg
      });

      console.log('response txt --->');
      console.log(this.emailResponse);
    }

    /**
     *
     */
    getPostUrl = () => {
      let apiUrl = '';

      if (window.location.hostname === 'localhost') {
				apiUrl = 'http://localhost:8888/crucial-trading/';
			} else if (window.location.hostname == 'vps.89hosting.co.uk') {
				apiUrl = 'http://vps.89hosting.co.uk/~crucialtrading/';
			} else {
				apiUrl = 'http://www.crucial-trading.com/';
			}

      apiUrl += 'wp-json/api/v1/';
			return `${apiUrl}email-hospitality-rug-choices`;
    }



    /**
     *
     */
    emailResponseJsx = () => {
      if (!this.state.emailResponded) { return null; }

      return (
        <div className="email-response-container">
          <p className="email-response">
            {this.state.emailResponse}
          </p>

          <div className="grey-line"></div>

          <button className="default">RETURN TO SUMMARY</button>
        </div>
    )}

    /**
     *
     */
    formJsx = () => {
      if (this.state.emailResponded) { return null; }

      return (
        <div>
        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Full Name*"
              onChange={this.handleNameChange}
            />
          </div>

          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Company*"
              onChange={this.handleCompanyChange}
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Address Line 1*"
              onChange={this.handleAddressChange}
            />
          </div>

          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Address Line 2"
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Town*"
            />
          </div>

          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Postcode*"
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <input
              type="email"
              className="form-control"
              placeholder="Email Address*"
              onChange={this.handleEmailChange}
            />
          </div>

          <div className="col">
            <input
              type="email"
              className="form-control"
              placeholder="Additional Email Address"
            />
          </div>
        </div>

        <div className="row">
          <div className="col">
            <input
              type="email"
              className="form-control"
              placeholder="Additional Email Address"
            />
          </div>

          <div className="col">
            <input
              type="email"
              className="form-control"
              placeholder="Additional Email Address"
            />
          </div>
        </div>
        </div>
      )
    }


    render() {
      return (
        <div className="email-modal">
          <div className="email-modal__background"></div>

          <div className="email-modal__email-form">
            <div className="close">close x</div>

            {!this.state.emailResponded &&
              <p className="header-text">EMAIL YOUR DESIGN</p>
            }

            {!this.state.emailResponded &&
              <div className="grey-line"> </div>
            }

            { this.formJsx() }
            { this.emailResponseJsx() }

            {!this.state.emailSent && !this.state.emailResponded &&
              <button
                className="default fixed-width"
                onClick={(event) => this.sendEmail(event)}
              >
                SEND EMAIL
              </button>
            }

          </div>
        </div>
    )}
  }

  return EmailModal;
}
