<script>
if ( !Modernizr.csstransitions ) {
	var scripts       = document.scripts;
	var scriptsLength = scripts.length;
	var thisScript    = scripts[scriptsLength - 1];
	var parent        = thisScript.parentElement;

	var ie9 = document.createElement('link');
	ie9.href = '<?php echo get_template_directory_uri(); ?>/assets/css/dist/ie9.min.css';

	parent.insertBefore(ie9, thisScript.nextSibling);
}
</script>