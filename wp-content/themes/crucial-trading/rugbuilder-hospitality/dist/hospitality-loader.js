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
		document.write('<script>window.Promise = Promise</script>');
	}

	document.write('<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>');
	document.write('<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>');
	document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react.js"></script>');
	document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react-dom.js"></script>');
	document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/react-router/4.2.0/react-router.js"></script>');
	document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/react-router-dom/4.2.2/react-router-dom.js"></script>');
	document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/redux/3.7.2/redux.js"></script>');
	document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/react-redux/5.0.6/react-redux.js"></script>');
	document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/pubsub-js/1.5.4/pubsub.min.js"></script>');
	document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js"></script>');
	document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/0.16.2/axios.js"></script>');
	document.write('<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>');
	document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.4/lodash.js"></script>');
	// document.write('<script src="https://code.jquery.com/jquery-3.2.1.js" integrity="sha256-DZAnKJ/6XZ9si04Hgrsxu/8s717jcIzLy3oi35EouyE=" crossorigin="anonymous"></script>');

	document.write('<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css">');
	document.write('<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">');
	document.write('<link href="https://fonts.googleapis.com/css?family=Playfair+Display" rel="stylesheet">');

	document.write('<script src="https://code.jquery.com/jquery-3.3.1.js" integrity="sha256-2Kok7MbOyxpgUVvAk/HJ2jigOSYS2auK4Pfzbm7uH60=" crossorigin="anonymous"></script>');
	document.write('<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>');
	document.write('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-tour/0.11.0/css/bootstrap-tour-standalone.css" />');
	document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-tour/0.11.0/js/bootstrap-tour.js"></script>');


	var devMode = true;

	if (window.location.hostname === 'localhost' && devMode) {
		console.log('DEV MODE');
		document.write('<script src="http://localhost:8888/crucial-trading/wp-content/themes/crucial-trading/rugbuilder-hospitality/dist/hospitality-builder.min.js"></script>');
		document.write('<link rel="stylesheet" href="http://localhost:8888/crucial-trading/wp-content/themes/crucial-trading/rugbuilder-hospitality/dist/hospitality-builder.min.css">');
	}

	else if (window.location.hostname === 'vps.89hosting.co.uk' && devMode) {
		console.log('STAGING');
		document.write('<script src="http://vps.89hosting.co.uk/~crucialtrading/wp-content/themes/crucial-trading/rugbuilder-hospitality/dist/hospitality-builder.min.js"></script>');
		document.write('<link rel="stylesheet" href="http://vps.89hosting.co.uk/~crucialtrading/wp-content/themes/crucial-trading/rugbuilder-hospitality/dist/hospitality-builder.min.css">');
	}

	else {
		document.write('<link rel="stylesheet" href="https://d105txpzekqrfa.cloudfront.net/hospitality/v2/dist/hospitality-builder.min.css">');
		document.write('<script src="https://d105txpzekqrfa.cloudfront.net/hospitality/v2/dist/hospitality-builder.min.js"></script>');
	}


	document.write('<script>var rugBuilder = new RugBuilder("website", ' + submit + ', ' + restart + ', ' + exit + '); rugBuilder.start();</script>');
	document.write('<script> var ReduxStore = new ReduxStore(); </script>');
}
