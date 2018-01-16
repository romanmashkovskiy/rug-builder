function load(options, secret_DEPRECIATED) {

	var key, secret, submit, restart, exit, translations;

	if ( typeof options === 'object' ) {
		key          = options.key;
		secret       = options.secret;
		submit       = options.showSubmitButton || false;
		restart      = options.showRestartButton || false;
		exit         = options.showExitButton || false;
		translations = options.translations || false;
	} else {
		key          = options;
		secret       = secret_DEPRECIATED;
		submit       = false;
		restart      = false;
		exit         = false;
		translations = false;

		console.warn('Passing in the key and secret to the load function as strings is depreciated and will be removed in future versions. Please pass them in an object, along with the other options, like so:')
		console.log({
			key               : 'YOUR_API_KEY_HERE',
			secret            : 'YOUR_API_SECRET_HERE',
			showSubmitButton  : true,
			showRestartButton : true,
			showExitButton    : true
		})
	}

	if ( key !== 'E9(]8x~QGIZR^-f' ) {
		return;
	}

	if ( secret !== 's+yflX{Nhev3iCeg@>wgPco5}2CMS6' ) {
		return;
	}


	if ( !window.Promise ) {
		// document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/native-promise-only/0.8.1/npo.js"></script>');
		document.write('<script>window.Promise = Promise</script>');
	}

	document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/pubsub-js/1.5.4/pubsub.min.js"></script>');
	// document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react.min.js"></script>');
	// document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react-dom.min.js"></script>');
	document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js"></script>');



	var devMode = true;

	if (window.location.hostname === 'localhost' && devMode) {
		console.log('DEV MODE !!');
		document.write('<script src="http://localhost:8888/crucial-trading/wp-content/themes/crucial-trading/rugbuilder-hospitality/dist/hospitality-builder.min.js"></script>');
		document.write('<link rel="stylesheet" href="http://localhost:8888/crucial-trading/wp-content/themes/crucial-trading/rugbuilder-hospitality/dist/hospitality-builder.min.css">');
	}

	else if (window.location.hostname === 'vps.89hosting.co.uk' && devMode) {
		console.log('STAGING');
		document.write('<script src="http://vps.89hosting.co.uk/~crucialtrading/wp-content/themes/crucial-trading/rugbuilder-hospitality/dist/hospitality-builder.min.js"></script>');
		document.write('<link rel="stylesheet" href="http://vps.89hosting.co.uk/~crucialtrading/wp-content/themes/crucial-trading/rugbuilder-hospitality/dist/hospitality-builder.min.css">');
	}

	else {
		console.log('PRODUCTIONN');
		document.write('<link rel="stylesheet" href="https://d105txpzekqrfa.cloudfront.net/hospitality/v2/dist/hospitality-builder.min.css">');
		document.write('<script src="https://d105txpzekqrfa.cloudfront.net/hospitality/v2/dist/hospitality-builder.min.js"></script>');
	}


	document.write('<script>var rugBuilder = new RugBuilder("website", ' + submit + ', ' + restart + ', ' + exit + '); rugBuilder.start();</script>');
	document.write('<script> var ReduxStore = new ReduxStore(); </script>');

	// var ReduxStore = new ReduxStore();
}
