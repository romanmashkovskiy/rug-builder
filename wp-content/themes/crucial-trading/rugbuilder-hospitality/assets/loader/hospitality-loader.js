function load(options) {

	var key     = options.key;
	var secret  = options.secret;
	var submit  = options.showSubmitButton;
	var restart = options.showRestartButton;
	var exit    = options.showExitButton;

	if ( key !== 'E9(]8x~QGIZR^-f' ) {
		return;
	}

	if ( secret !== 's+yflX{Nhev3iCeg@>wgPco5}2CMS6' ) {
		return;
	}

	document.write('<link rel="stylesheet" href="https://d105txpzekqrfa.cloudfront.net/hospitality/dist/hospitality-builder.min.css">');

	if ( !window.Promise ) {
		document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/native-promise-only/0.8.1/npo.js"></script>');
		document.write('<script>window.Promise = Promise</script>');
	}

	document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/pubsub-js/1.5.4/pubsub.min.js"></script>');
	document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react.min.js"></script>');
	document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/react/15.4.2/react-dom.min.js"></script>');
	document.write('<script src="https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.8/hammer.min.js"></script>');
	document.write('<script src="https://d105txpzekqrfa.cloudfront.net/hospitality/dist/hospitality-builder.min.js"></script>');
	document.write('<script>var rugBuilder = new RugBuilder; rugBuilder.start(website, ' + submit + ', ' + restart + ', ' + exit + ');</script>');
}