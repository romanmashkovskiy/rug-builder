RugBuilder.prototype.addDOMElements = function(method, url, callback, responseType) {

	const DOM_ELEMENTS = {
		DRAWER        : document.createElement('div'),
		PROGRESS_MENU : document.createElement('div'),

		IMG_CONTAINER : {
			CONTAINER : document.createElement('div'),
			ZERO      : document.createElement('div'),
			ONE       : document.createElement('div'),
			TWO       : document.createElement('div'),
			THREE     : document.createElement('div'),
			FOUR      : document.createElement('div'),
			FIVE      : document.createElement('div'),
			SIX       : document.createElement('div'),
			SEVEN     : document.createElement('div'),
			EIGHT     : document.createElement('div'),
			NINE      : document.createElement('div')
		},
		CHOICES       : {
			CONTAINER : document.createElement('div'),
			ZERO      : document.createElement('div'),
			ONE       : document.createElement('div'),
			TWO       : document.createElement('div'),
			THREE     : document.createElement('div'),
			FOUR      : document.createElement('div'),
			FIVE      : document.createElement('div'),
			SIX       : document.createElement('div'),
			SEVEN     : document.createElement('div'),
			EIGHT     : document.createElement('div'),
			NINE      : document.createElement('div')
		},
		LITTLE_LOADER : document.createElement('div'),
		SUBMIT_SCREEN : document.createElement('div'),
		EMAIL_FORM    : document.createElement('div')
	}

	DOM_ELEMENTS.DRAWER.setAttribute('id', 'hospBuilderDrawer');
	DOM_ELEMENTS.PROGRESS_MENU.setAttribute('id', 'hosp_builder_progress-menu');

	DOM_ELEMENTS.IMG_CONTAINER.CONTAINER.setAttribute('id', 'hosp_builder_img-container');
	DOM_ELEMENTS.IMG_CONTAINER.ZERO.setAttribute('id', 'hosp_builder_color-0');
	DOM_ELEMENTS.IMG_CONTAINER.ONE.setAttribute('id', 'hosp_builder_color-1');
	DOM_ELEMENTS.IMG_CONTAINER.TWO.setAttribute('id', 'hosp_builder_color-2');
	DOM_ELEMENTS.IMG_CONTAINER.THREE.setAttribute('id', 'hosp_builder_color-3');
	DOM_ELEMENTS.IMG_CONTAINER.FOUR.setAttribute('id', 'hosp_builder_color-4');
	DOM_ELEMENTS.IMG_CONTAINER.FIVE.setAttribute('id', 'hosp_builder_color-5');
	DOM_ELEMENTS.IMG_CONTAINER.SIX.setAttribute('id', 'hosp_builder_color-6');
	DOM_ELEMENTS.IMG_CONTAINER.SEVEN.setAttribute('id', 'hosp_builder_color-7');
	DOM_ELEMENTS.IMG_CONTAINER.EIGHT.setAttribute('id', 'hosp_builder_color-8');
	DOM_ELEMENTS.IMG_CONTAINER.NINE.setAttribute('id', 'hosp_builder_color-9');
	DOM_ELEMENTS.CHOICES.CONTAINER.setAttribute('id', 'hosp_builder_choices');
	DOM_ELEMENTS.CHOICES.ZERO.setAttribute('id', 'hosp_builder_choice-0');
	DOM_ELEMENTS.CHOICES.ONE.setAttribute('id', 'hosp_builder_choice-1');
	DOM_ELEMENTS.CHOICES.TWO.setAttribute('id', 'hosp_builder_choice-2');
	DOM_ELEMENTS.CHOICES.THREE.setAttribute('id', 'hosp_builder_choice-3');
	DOM_ELEMENTS.CHOICES.FOUR.setAttribute('id', 'hosp_builder_choice-4');
	DOM_ELEMENTS.CHOICES.FIVE.setAttribute('id', 'hosp_builder_choice-5');
	DOM_ELEMENTS.CHOICES.SIX.setAttribute('id', 'hosp_builder_choice-6');
	DOM_ELEMENTS.CHOICES.SEVEN.setAttribute('id', 'hosp_builder_choice-7');
	DOM_ELEMENTS.CHOICES.EIGHT.setAttribute('id', 'hosp_builder_choice-8');
	DOM_ELEMENTS.CHOICES.NINE.setAttribute('id', 'hosp_builder_choice-9');
	DOM_ELEMENTS.LITTLE_LOADER.setAttribute('id', 'hosp_builder_little-loader');
	DOM_ELEMENTS.SUBMIT_SCREEN.setAttribute('id', 'hosp_builder_submit-screen');
	DOM_ELEMENTS.EMAIL_FORM.setAttribute('id', 'hosp_builder_email-form');

	DOM_ELEMENTS.IMG_CONTAINER.CONTAINER.appendChild(DOM_ELEMENTS.IMG_CONTAINER.ZERO);
	DOM_ELEMENTS.IMG_CONTAINER.CONTAINER.appendChild(DOM_ELEMENTS.IMG_CONTAINER.ONE);
	DOM_ELEMENTS.IMG_CONTAINER.CONTAINER.appendChild(DOM_ELEMENTS.IMG_CONTAINER.TWO);
	DOM_ELEMENTS.IMG_CONTAINER.CONTAINER.appendChild(DOM_ELEMENTS.IMG_CONTAINER.THREE);
	DOM_ELEMENTS.IMG_CONTAINER.CONTAINER.appendChild(DOM_ELEMENTS.IMG_CONTAINER.FOUR);
	DOM_ELEMENTS.IMG_CONTAINER.CONTAINER.appendChild(DOM_ELEMENTS.IMG_CONTAINER.FIVE);
	DOM_ELEMENTS.IMG_CONTAINER.CONTAINER.appendChild(DOM_ELEMENTS.IMG_CONTAINER.SIX);
	DOM_ELEMENTS.IMG_CONTAINER.CONTAINER.appendChild(DOM_ELEMENTS.IMG_CONTAINER.SEVEN);
	DOM_ELEMENTS.IMG_CONTAINER.CONTAINER.appendChild(DOM_ELEMENTS.IMG_CONTAINER.EIGHT);
	DOM_ELEMENTS.IMG_CONTAINER.CONTAINER.appendChild(DOM_ELEMENTS.IMG_CONTAINER.NINE);

	DOM_ELEMENTS.CHOICES.CONTAINER.appendChild(DOM_ELEMENTS.CHOICES.ZERO);
	DOM_ELEMENTS.CHOICES.CONTAINER.appendChild(DOM_ELEMENTS.CHOICES.ONE);
	DOM_ELEMENTS.CHOICES.CONTAINER.appendChild(DOM_ELEMENTS.CHOICES.TWO);
	DOM_ELEMENTS.CHOICES.CONTAINER.appendChild(DOM_ELEMENTS.CHOICES.THREE);
	DOM_ELEMENTS.CHOICES.CONTAINER.appendChild(DOM_ELEMENTS.CHOICES.FOUR);
	DOM_ELEMENTS.CHOICES.CONTAINER.appendChild(DOM_ELEMENTS.CHOICES.FIVE);
	DOM_ELEMENTS.CHOICES.CONTAINER.appendChild(DOM_ELEMENTS.CHOICES.SIX);
	DOM_ELEMENTS.CHOICES.CONTAINER.appendChild(DOM_ELEMENTS.CHOICES.SEVEN);
	DOM_ELEMENTS.CHOICES.CONTAINER.appendChild(DOM_ELEMENTS.CHOICES.EIGHT);
	DOM_ELEMENTS.CHOICES.CONTAINER.appendChild(DOM_ELEMENTS.CHOICES.NINE);

	if ( document.getElementById('hospitality-builder') !== null ) {
		document.getElementById('hospitality-builder').appendChild(DOM_ELEMENTS.DRAWER);
		document.getElementById('hospitality-builder').appendChild(DOM_ELEMENTS.PROGRESS_MENU);

		document.getElementById('hospitality-builder').appendChild(DOM_ELEMENTS.IMG_CONTAINER.CONTAINER);
		document.getElementById('hospitality-builder').appendChild(DOM_ELEMENTS.CHOICES.CONTAINER);
		document.getElementById('hospitality-builder').appendChild(DOM_ELEMENTS.LITTLE_LOADER);
		document.getElementById('hospitality-builder').appendChild(DOM_ELEMENTS.SUBMIT_SCREEN);
		return;
	}

		const builder = document.createElement('div');
		builder.setAttribute('id', 'hospitality-builder');

		builder.appendChild(DOM_ELEMENTS.DRAWER);

		const mainContainer = document.createElement('div');
		mainContainer.setAttribute('id', 'mainContainer');
		mainContainer.appendChild(DOM_ELEMENTS.PROGRESS_MENU);
		builder.appendChild(mainContainer);

		// builder.appendChild(DOM_ELEMENTS.PROGRESS_MENU);
		// builder.appendChild(DOM_ELEMENTS.IMG_CONTAINER.CONTAINER);
		builder.appendChild(mainContainer);

		const canvas = document.createElement('div');
		canvas.setAttribute('id', 'canvas');
		canvas.appendChild(DOM_ELEMENTS.IMG_CONTAINER.CONTAINER);
		canvas.appendChild(DOM_ELEMENTS.CHOICES.CONTAINER);
		mainContainer.appendChild(canvas);



		builder.appendChild(DOM_ELEMENTS.LITTLE_LOADER);
		builder.appendChild(DOM_ELEMENTS.SUBMIT_SCREEN);
		builder.appendChild(DOM_ELEMENTS.EMAIL_FORM);

		document.body.appendChild(builder);
}
