<script src="<?php echo get_template_directory_uri(); ?>/assets/js/vendor/modernizr.min.js"></script>

<script>
if ( !Modernizr.es6collections ) {
	var scripts       = document.scripts;
	var scriptsLength = scripts.length;
	var thisScript    = scripts[scriptsLength - 1];
	var parent        = thisScript.parentElement;

	var polyfill = document.createElement('script');
	polyfill.src = '<?php echo get_template_directory_uri(); ?>/assets/js/vendor/WeakMap.js';

	parent.insertBefore(polyfill, thisScript.nextSibling);
}
</script>