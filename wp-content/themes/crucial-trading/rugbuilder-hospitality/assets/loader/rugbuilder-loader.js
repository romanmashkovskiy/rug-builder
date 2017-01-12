class RugBuilder_Loader {

	constructor( options ) {

		const REQUEST = new XMLHttpRequest();

		let details = {
			username : options.username,
			key      : options.key,
			secret   : options.secret
		};

		let formBody = [];

		for (var property in details) {

			let encodedKey   = encodeURIComponent(property);
			let encodedValue = encodeURIComponent(details[property]);

			formBody.push(encodedKey + "=" + encodedValue);
		}

		formBody = formBody.join("&");

//		REQUEST.addEventListener('load', this.handleScript);
//		REQUEST.open('POST', 'http://localhost:8081/rugbuilder-loader');
//		REQUEST.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//		REQUEST.send(formBody);

		$.post('http://localhost:8081/rugbuilder-loader', formBody, function(res) {
			eval(res)
		})

	};

	handleScript() {

		let script = document.createElement('script');

		script.setAttribute('type', 'text/javascript');
		script.innerHTML = this.responseText;

		document.body.appendChild(script);

		return;

		if ( typeof RugBuilder === 'function' ) {
			window.rugBuilder = new RugBuilder('website');
			window.rugBuilder.start();
			console.log('RugBuilder started');
		} else {
			window.rugBuilder = 'RugBuilder not started';
			console.log(window.rugBuilder);
		}

	};

}