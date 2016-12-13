var btn = document.querySelector('.main-menu__button')

btn.addEventListener('click', toggleClasses);

function toggleClasses() {

	if ( !btn.classList.contains('link-opener') ) {

		if ( btn.classList.contains('is-active') ) {
			btn.classList.remove('is-active');
		} else {
			btn.classList.add('is-active');
		}

		if ( document.body.classList.contains('show-menu') ) {
			document.body.classList.remove('show-menu');
		} else {
			document.body.classList.add('show-menu');
		}
	}
}

var html = document.querySelector('html');

html.addEventListener('click', removeClasses);

function removeClasses() {
	btn.classList.remove('is-active');
	document.body.classList.remove('show-menu');
}

var startBtn = document.querySelector('.start');

startBtn.addEventListener('click', start);

function start() {
	document.querySelector('#hello').style.display = 'none';
	document.querySelector('#app').style.display = 'block';

	if ( document.querySelector('canvas') !== null ) {
		document.querySelector('canvas').style.display = 'block';
	}
}