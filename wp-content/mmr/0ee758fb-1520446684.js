/*!
 * WooCommerce Add to Cart JS
 */
jQuery( function( $ ) {

	/* global wc_add_to_cart_params */
	if ( typeof wc_add_to_cart_params === 'undefined' ) {
		return false;
	}

	// Ajax add to cart
	$( document ).on( 'click', '.add_to_cart_button', function() {

		// AJAX add to cart request
		var $thisbutton = $( this );

		if ( $thisbutton.is( '.ajax_add_to_cart' ) ) {

			if ( ! $thisbutton.attr( 'data-product_id' ) ) {
				return true;
			}

			$thisbutton.removeClass( 'added' );
			$thisbutton.addClass( 'loading' );

			var data = {};

			$.each( $thisbutton.data(), function( key, value ) {
				data[key] = value;
			});

			// Trigger event
			$( document.body ).trigger( 'adding_to_cart', [ $thisbutton, data ] );

			// Ajax action
			$.post( wc_add_to_cart_params.wc_ajax_url.toString().replace( '%%endpoint%%', 'add_to_cart' ), data, function( response ) {

				if ( ! response ) {
					return;
				}

				var this_page = window.location.toString();

				this_page = this_page.replace( 'add-to-cart', 'added-to-cart' );

				if ( response.error && response.product_url ) {
					window.location = response.product_url;
					return;
				}

				// Redirect to cart option
				if ( wc_add_to_cart_params.cart_redirect_after_add === 'yes' ) {

					window.location = wc_add_to_cart_params.cart_url;
					return;

				} else {

					$thisbutton.removeClass( 'loading' );

					var fragments = response.fragments;
					var cart_hash = response.cart_hash;

					// Block fragments class
					if ( fragments ) {
						$.each( fragments, function( key ) {
							$( key ).addClass( 'updating' );
						});
					}

					// Block widgets and fragments
					$( '.shop_table.cart, .updating, .cart_totals' ).fadeTo( '400', '0.6' ).block({
						message: null,
						overlayCSS: {
							opacity: 0.6
						}
					});

					// Changes button classes
					$thisbutton.addClass( 'added' );

					// View cart text
					if ( ! wc_add_to_cart_params.is_cart && $thisbutton.parent().find( '.added_to_cart' ).length === 0 ) {
						$thisbutton.after( ' <a href="' + wc_add_to_cart_params.cart_url + '" class="added_to_cart wc-forward" title="' +
							wc_add_to_cart_params.i18n_view_cart + '">' + wc_add_to_cart_params.i18n_view_cart + '</a>' );
					}

					// Replace fragments
					if ( fragments ) {
						$.each( fragments, function( key, value ) {
							$( key ).replaceWith( value );
						});
					}

					// Unblock
					$( '.widget_shopping_cart, .updating' ).stop( true ).css( 'opacity', '1' ).unblock();

					// Cart page elements
					$( '.shop_table.cart' ).load( this_page + ' .shop_table.cart:eq(0) > *', function() {

						$( '.shop_table.cart' ).stop( true ).css( 'opacity', '1' ).unblock();

						$( document.body ).trigger( 'cart_page_refreshed' );
					});

					$( '.cart_totals' ).load( this_page + ' .cart_totals:eq(0) > *', function() {
						$( '.cart_totals' ).stop( true ).css( 'opacity', '1' ).unblock();
					});

					// Trigger event so themes can refresh other areas
					$( document.body ).trigger( 'added_to_cart', [ fragments, cart_hash, $thisbutton ] );
				}
			});

			return false;

		}

		return true;
	});

});
;
/*!
 * jQuery blockUI plugin
 * Version 2.70.0-2014.11.23
 * Requires jQuery v1.7 or later
 *
 * Examples at: http://malsup.com/jquery/block/
 * Copyright (c) 2007-2013 M. Alsup
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 * Thanks to Amir-Hossein Sobhi for some excellent contributions!
 */
;(function() {
/*jshint eqeqeq:false curly:false latedef:false */
"use strict";

	function setup($) {
		$.fn._fadeIn = $.fn.fadeIn;

		var noOp = $.noop || function() {};

		// this bit is to ensure we don't call setExpression when we shouldn't (with extra muscle to handle
		// confusing userAgent strings on Vista)
		var msie = /MSIE/.test(navigator.userAgent);
		var ie6  = /MSIE 6.0/.test(navigator.userAgent) && ! /MSIE 8.0/.test(navigator.userAgent);
		var mode = document.documentMode || 0;
		var setExpr = $.isFunction( document.createElement('div').style.setExpression );

		// global $ methods for blocking/unblocking the entire page
		$.blockUI   = function(opts) { install(window, opts); };
		$.unblockUI = function(opts) { remove(window, opts); };

		// convenience method for quick growl-like notifications  (http://www.google.com/search?q=growl)
		$.growlUI = function(title, message, timeout, onClose) {
			var $m = $('<div class="growlUI"></div>');
			if (title) $m.append('<h1>'+title+'</h1>');
			if (message) $m.append('<h2>'+message+'</h2>');
			if (timeout === undefined) timeout = 3000;

			// Added by konapun: Set timeout to 30 seconds if this growl is moused over, like normal toast notifications
			var callBlock = function(opts) {
				opts = opts || {};

				$.blockUI({
					message: $m,
					fadeIn : typeof opts.fadeIn  !== 'undefined' ? opts.fadeIn  : 700,
					fadeOut: typeof opts.fadeOut !== 'undefined' ? opts.fadeOut : 1000,
					timeout: typeof opts.timeout !== 'undefined' ? opts.timeout : timeout,
					centerY: false,
					showOverlay: false,
					onUnblock: onClose,
					css: $.blockUI.defaults.growlCSS
				});
			};

			callBlock();
			var nonmousedOpacity = $m.css('opacity');
			$m.mouseover(function() {
				callBlock({
					fadeIn: 0,
					timeout: 30000
				});

				var displayBlock = $('.blockMsg');
				displayBlock.stop(); // cancel fadeout if it has started
				displayBlock.fadeTo(300, 1); // make it easier to read the message by removing transparency
			}).mouseout(function() {
				$('.blockMsg').fadeOut(1000);
			});
			// End konapun additions
		};

		// plugin method for blocking element content
		$.fn.block = function(opts) {
			if ( this[0] === window ) {
				$.blockUI( opts );
				return this;
			}
			var fullOpts = $.extend({}, $.blockUI.defaults, opts || {});
			this.each(function() {
				var $el = $(this);
				if (fullOpts.ignoreIfBlocked && $el.data('blockUI.isBlocked'))
					return;
				$el.unblock({ fadeOut: 0 });
			});

			return this.each(function() {
				if ($.css(this,'position') == 'static') {
					this.style.position = 'relative';
					$(this).data('blockUI.static', true);
				}
				this.style.zoom = 1; // force 'hasLayout' in ie
				install(this, opts);
			});
		};

		// plugin method for unblocking element content
		$.fn.unblock = function(opts) {
			if ( this[0] === window ) {
				$.unblockUI( opts );
				return this;
			}
			return this.each(function() {
				remove(this, opts);
			});
		};

		$.blockUI.version = 2.70; // 2nd generation blocking at no extra cost!

		// override these in your code to change the default behavior and style
		$.blockUI.defaults = {
			// message displayed when blocking (use null for no message)
			message:  '<h1>Please wait...</h1>',

			title: null,		// title string; only used when theme == true
			draggable: true,	// only used when theme == true (requires jquery-ui.js to be loaded)

			theme: false, // set to true to use with jQuery UI themes

			// styles for the message when blocking; if you wish to disable
			// these and use an external stylesheet then do this in your code:
			// $.blockUI.defaults.css = {};
			css: {
				padding:	0,
				margin:		0,
				width:		'30%',
				top:		'40%',
				left:		'35%',
				textAlign:	'center',
				color:		'#000',
				border:		'3px solid #aaa',
				backgroundColor:'#fff',
				cursor:		'wait'
			},

			// minimal style set used when themes are used
			themedCSS: {
				width:	'30%',
				top:	'40%',
				left:	'35%'
			},

			// styles for the overlay
			overlayCSS:  {
				backgroundColor:	'#000',
				opacity:			0.6,
				cursor:				'wait'
			},

			// style to replace wait cursor before unblocking to correct issue
			// of lingering wait cursor
			cursorReset: 'default',

			// styles applied when using $.growlUI
			growlCSS: {
				width:		'350px',
				top:		'10px',
				left:		'',
				right:		'10px',
				border:		'none',
				padding:	'5px',
				opacity:	0.6,
				cursor:		'default',
				color:		'#fff',
				backgroundColor: '#000',
				'-webkit-border-radius':'10px',
				'-moz-border-radius':	'10px',
				'border-radius':		'10px'
			},

			// IE issues: 'about:blank' fails on HTTPS and javascript:false is s-l-o-w
			// (hat tip to Jorge H. N. de Vasconcelos)
			/*jshint scripturl:true */
			iframeSrc: /^https/i.test(window.location.href || '') ? 'javascript:false' : 'about:blank',

			// force usage of iframe in non-IE browsers (handy for blocking applets)
			forceIframe: false,

			// z-index for the blocking overlay
			baseZ: 1000,

			// set these to true to have the message automatically centered
			centerX: true, // <-- only effects element blocking (page block controlled via css above)
			centerY: true,

			// allow body element to be stetched in ie6; this makes blocking look better
			// on "short" pages.  disable if you wish to prevent changes to the body height
			allowBodyStretch: true,

			// enable if you want key and mouse events to be disabled for content that is blocked
			bindEvents: true,

			// be default blockUI will supress tab navigation from leaving blocking content
			// (if bindEvents is true)
			constrainTabKey: true,

			// fadeIn time in millis; set to 0 to disable fadeIn on block
			fadeIn:  200,

			// fadeOut time in millis; set to 0 to disable fadeOut on unblock
			fadeOut:  400,

			// time in millis to wait before auto-unblocking; set to 0 to disable auto-unblock
			timeout: 0,

			// disable if you don't want to show the overlay
			showOverlay: true,

			// if true, focus will be placed in the first available input field when
			// page blocking
			focusInput: true,

            // elements that can receive focus
            focusableElements: ':input:enabled:visible',

			// suppresses the use of overlay styles on FF/Linux (due to performance issues with opacity)
			// no longer needed in 2012
			// applyPlatformOpacityRules: true,

			// callback method invoked when fadeIn has completed and blocking message is visible
			onBlock: null,

			// callback method invoked when unblocking has completed; the callback is
			// passed the element that has been unblocked (which is the window object for page
			// blocks) and the options that were passed to the unblock call:
			//	onUnblock(element, options)
			onUnblock: null,

			// callback method invoked when the overlay area is clicked.
			// setting this will turn the cursor to a pointer, otherwise cursor defined in overlayCss will be used.
			onOverlayClick: null,

			// don't ask; if you really must know: http://groups.google.com/group/jquery-en/browse_thread/thread/36640a8730503595/2f6a79a77a78e493#2f6a79a77a78e493
			quirksmodeOffsetHack: 4,

			// class name of the message block
			blockMsgClass: 'blockMsg',

			// if it is already blocked, then ignore it (don't unblock and reblock)
			ignoreIfBlocked: false
		};

		// private data and functions follow...

		var pageBlock = null;
		var pageBlockEls = [];

		function install(el, opts) {
			var css, themedCSS;
			var full = (el == window);
			var msg = (opts && opts.message !== undefined ? opts.message : undefined);
			opts = $.extend({}, $.blockUI.defaults, opts || {});

			if (opts.ignoreIfBlocked && $(el).data('blockUI.isBlocked'))
				return;

			opts.overlayCSS = $.extend({}, $.blockUI.defaults.overlayCSS, opts.overlayCSS || {});
			css = $.extend({}, $.blockUI.defaults.css, opts.css || {});
			if (opts.onOverlayClick)
				opts.overlayCSS.cursor = 'pointer';

			themedCSS = $.extend({}, $.blockUI.defaults.themedCSS, opts.themedCSS || {});
			msg = msg === undefined ? opts.message : msg;

			// remove the current block (if there is one)
			if (full && pageBlock)
				remove(window, {fadeOut:0});

			// if an existing element is being used as the blocking content then we capture
			// its current place in the DOM (and current display style) so we can restore
			// it when we unblock
			if (msg && typeof msg != 'string' && (msg.parentNode || msg.jquery)) {
				var node = msg.jquery ? msg[0] : msg;
				var data = {};
				$(el).data('blockUI.history', data);
				data.el = node;
				data.parent = node.parentNode;
				data.display = node.style.display;
				data.position = node.style.position;
				if (data.parent)
					data.parent.removeChild(node);
			}

			$(el).data('blockUI.onUnblock', opts.onUnblock);
			var z = opts.baseZ;

			// blockUI uses 3 layers for blocking, for simplicity they are all used on every platform;
			// layer1 is the iframe layer which is used to supress bleed through of underlying content
			// layer2 is the overlay layer which has opacity and a wait cursor (by default)
			// layer3 is the message content that is displayed while blocking
			var lyr1, lyr2, lyr3, s;
			if (msie || opts.forceIframe)
				lyr1 = $('<iframe class="blockUI" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;position:absolute;width:100%;height:100%;top:0;left:0" src="'+opts.iframeSrc+'"></iframe>');
			else
				lyr1 = $('<div class="blockUI" style="display:none"></div>');

			if (opts.theme)
				lyr2 = $('<div class="blockUI blockOverlay ui-widget-overlay" style="z-index:'+ (z++) +';display:none"></div>');
			else
				lyr2 = $('<div class="blockUI blockOverlay" style="z-index:'+ (z++) +';display:none;border:none;margin:0;padding:0;width:100%;height:100%;top:0;left:0"></div>');

			if (opts.theme && full) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:fixed">';
				if ( opts.title ) {
					s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>';
				}
				s += '<div class="ui-widget-content ui-dialog-content"></div>';
				s += '</div>';
			}
			else if (opts.theme) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement ui-dialog ui-widget ui-corner-all" style="z-index:'+(z+10)+';display:none;position:absolute">';
				if ( opts.title ) {
					s += '<div class="ui-widget-header ui-dialog-titlebar ui-corner-all blockTitle">'+(opts.title || '&nbsp;')+'</div>';
				}
				s += '<div class="ui-widget-content ui-dialog-content"></div>';
				s += '</div>';
			}
			else if (full) {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockPage" style="z-index:'+(z+10)+';display:none;position:fixed"></div>';
			}
			else {
				s = '<div class="blockUI ' + opts.blockMsgClass + ' blockElement" style="z-index:'+(z+10)+';display:none;position:absolute"></div>';
			}
			lyr3 = $(s);

			// if we have a message, style it
			if (msg) {
				if (opts.theme) {
					lyr3.css(themedCSS);
					lyr3.addClass('ui-widget-content');
				}
				else
					lyr3.css(css);
			}

			// style the overlay
			if (!opts.theme /*&& (!opts.applyPlatformOpacityRules)*/)
				lyr2.css(opts.overlayCSS);
			lyr2.css('position', full ? 'fixed' : 'absolute');

			// make iframe layer transparent in IE
			if (msie || opts.forceIframe)
				lyr1.css('opacity',0.0);

			//$([lyr1[0],lyr2[0],lyr3[0]]).appendTo(full ? 'body' : el);
			var layers = [lyr1,lyr2,lyr3], $par = full ? $('body') : $(el);
			$.each(layers, function() {
				this.appendTo($par);
			});

			if (opts.theme && opts.draggable && $.fn.draggable) {
				lyr3.draggable({
					handle: '.ui-dialog-titlebar',
					cancel: 'li'
				});
			}

			// ie7 must use absolute positioning in quirks mode and to account for activex issues (when scrolling)
			var expr = setExpr && (!$.support.boxModel || $('object,embed', full ? null : el).length > 0);
			if (ie6 || expr) {
				// give body 100% height
				if (full && opts.allowBodyStretch && $.support.boxModel)
					$('html,body').css('height','100%');

				// fix ie6 issue when blocked element has a border width
				if ((ie6 || !$.support.boxModel) && !full) {
					var t = sz(el,'borderTopWidth'), l = sz(el,'borderLeftWidth');
					var fixT = t ? '(0 - '+t+')' : 0;
					var fixL = l ? '(0 - '+l+')' : 0;
				}

				// simulate fixed position
				$.each(layers, function(i,o) {
					var s = o[0].style;
					s.position = 'absolute';
					if (i < 2) {
						if (full)
							s.setExpression('height','Math.max(document.body.scrollHeight, document.body.offsetHeight) - (jQuery.support.boxModel?0:'+opts.quirksmodeOffsetHack+') + "px"');
						else
							s.setExpression('height','this.parentNode.offsetHeight + "px"');
						if (full)
							s.setExpression('width','jQuery.support.boxModel && document.documentElement.clientWidth || document.body.clientWidth + "px"');
						else
							s.setExpression('width','this.parentNode.offsetWidth + "px"');
						if (fixL) s.setExpression('left', fixL);
						if (fixT) s.setExpression('top', fixT);
					}
					else if (opts.centerY) {
						if (full) s.setExpression('top','(document.documentElement.clientHeight || document.body.clientHeight) / 2 - (this.offsetHeight / 2) + (blah = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + "px"');
						s.marginTop = 0;
					}
					else if (!opts.centerY && full) {
						var top = (opts.css && opts.css.top) ? parseInt(opts.css.top, 10) : 0;
						var expression = '((document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop) + '+top+') + "px"';
						s.setExpression('top',expression);
					}
				});
			}

			// show the message
			if (msg) {
				if (opts.theme)
					lyr3.find('.ui-widget-content').append(msg);
				else
					lyr3.append(msg);
				if (msg.jquery || msg.nodeType)
					$(msg).show();
			}

			if ((msie || opts.forceIframe) && opts.showOverlay)
				lyr1.show(); // opacity is zero
			if (opts.fadeIn) {
				var cb = opts.onBlock ? opts.onBlock : noOp;
				var cb1 = (opts.showOverlay && !msg) ? cb : noOp;
				var cb2 = msg ? cb : noOp;
				if (opts.showOverlay)
					lyr2._fadeIn(opts.fadeIn, cb1);
				if (msg)
					lyr3._fadeIn(opts.fadeIn, cb2);
			}
			else {
				if (opts.showOverlay)
					lyr2.show();
				if (msg)
					lyr3.show();
				if (opts.onBlock)
					opts.onBlock.bind(lyr3)();
			}

			// bind key and mouse events
			bind(1, el, opts);

			if (full) {
				pageBlock = lyr3[0];
				pageBlockEls = $(opts.focusableElements,pageBlock);
				if (opts.focusInput)
					setTimeout(focus, 20);
			}
			else
				center(lyr3[0], opts.centerX, opts.centerY);

			if (opts.timeout) {
				// auto-unblock
				var to = setTimeout(function() {
					if (full)
						$.unblockUI(opts);
					else
						$(el).unblock(opts);
				}, opts.timeout);
				$(el).data('blockUI.timeout', to);
			}
		}

		// remove the block
		function remove(el, opts) {
			var count;
			var full = (el == window);
			var $el = $(el);
			var data = $el.data('blockUI.history');
			var to = $el.data('blockUI.timeout');
			if (to) {
				clearTimeout(to);
				$el.removeData('blockUI.timeout');
			}
			opts = $.extend({}, $.blockUI.defaults, opts || {});
			bind(0, el, opts); // unbind events

			if (opts.onUnblock === null) {
				opts.onUnblock = $el.data('blockUI.onUnblock');
				$el.removeData('blockUI.onUnblock');
			}

			var els;
			if (full) // crazy selector to handle odd field errors in ie6/7
				els = $(document.body).children().filter('.blockUI').add('body > .blockUI');
			else
				els = $el.find('>.blockUI');

			// fix cursor issue
			if ( opts.cursorReset ) {
				if ( els.length > 1 )
					els[1].style.cursor = opts.cursorReset;
				if ( els.length > 2 )
					els[2].style.cursor = opts.cursorReset;
			}

			if (full)
				pageBlock = pageBlockEls = null;

			if (opts.fadeOut) {
				count = els.length;
				els.stop().fadeOut(opts.fadeOut, function() {
					if ( --count === 0)
						reset(els,data,opts,el);
				});
			}
			else
				reset(els, data, opts, el);
		}

		// move blocking element back into the DOM where it started
		function reset(els,data,opts,el) {
			var $el = $(el);
			if ( $el.data('blockUI.isBlocked') )
				return;

			els.each(function(i,o) {
				// remove via DOM calls so we don't lose event handlers
				if (this.parentNode)
					this.parentNode.removeChild(this);
			});

			if (data && data.el) {
				data.el.style.display = data.display;
				data.el.style.position = data.position;
				data.el.style.cursor = 'default'; // #59
				if (data.parent)
					data.parent.appendChild(data.el);
				$el.removeData('blockUI.history');
			}

			if ($el.data('blockUI.static')) {
				$el.css('position', 'static'); // #22
			}

			if (typeof opts.onUnblock == 'function')
				opts.onUnblock(el,opts);

			// fix issue in Safari 6 where block artifacts remain until reflow
			var body = $(document.body), w = body.width(), cssW = body[0].style.width;
			body.width(w-1).width(w);
			body[0].style.width = cssW;
		}

		// bind/unbind the handler
		function bind(b, el, opts) {
			var full = el == window, $el = $(el);

			// don't bother unbinding if there is nothing to unbind
			if (!b && (full && !pageBlock || !full && !$el.data('blockUI.isBlocked')))
				return;

			$el.data('blockUI.isBlocked', b);

			// don't bind events when overlay is not in use or if bindEvents is false
			if (!full || !opts.bindEvents || (b && !opts.showOverlay))
				return;

			// bind anchors and inputs for mouse and key events
			var events = 'mousedown mouseup keydown keypress keyup touchstart touchend touchmove';
			if (b)
				$(document).bind(events, opts, handler);
			else
				$(document).unbind(events, handler);

		// former impl...
		//		var $e = $('a,:input');
		//		b ? $e.bind(events, opts, handler) : $e.unbind(events, handler);
		}

		// event handler to suppress keyboard/mouse events when blocking
		function handler(e) {
			// allow tab navigation (conditionally)
			if (e.type === 'keydown' && e.keyCode && e.keyCode == 9) {
				if (pageBlock && e.data.constrainTabKey) {
					var els = pageBlockEls;
					var fwd = !e.shiftKey && e.target === els[els.length-1];
					var back = e.shiftKey && e.target === els[0];
					if (fwd || back) {
						setTimeout(function(){focus(back);},10);
						return false;
					}
				}
			}
			var opts = e.data;
			var target = $(e.target);
			if (target.hasClass('blockOverlay') && opts.onOverlayClick)
				opts.onOverlayClick(e);

			// allow events within the message content
			if (target.parents('div.' + opts.blockMsgClass).length > 0)
				return true;

			// allow events for content that is not being blocked
			return target.parents().children().filter('div.blockUI').length === 0;
		}

		function focus(back) {
			if (!pageBlockEls)
				return;
			var e = pageBlockEls[back===true ? pageBlockEls.length-1 : 0];
			if (e)
				e.focus();
		}

		function center(el, x, y) {
			var p = el.parentNode, s = el.style;
			var l = ((p.offsetWidth - el.offsetWidth)/2) - sz(p,'borderLeftWidth');
			var t = ((p.offsetHeight - el.offsetHeight)/2) - sz(p,'borderTopWidth');
			if (x) s.left = l > 0 ? (l+'px') : '0';
			if (y) s.top  = t > 0 ? (t+'px') : '0';
		}

		function sz(el, p) {
			return parseInt($.css(el,p),10)||0;
		}

	}


	/*global define:true */
	if (typeof define === 'function' && define.amd && define.amd.jQuery) {
		define(['jquery'], setup);
	} else {
		setup(jQuery);
	}

})();;
jQuery( function( $ ) {
	// Orderby
	$( '.woocommerce-ordering' ).on( 'change', 'select.orderby', function() {
		$( this ).closest( 'form' ).submit();
	});

	// Target quantity inputs on product pages
	$( 'input.qty:not(.product-quantity input.qty)' ).each( function() {
		var min = parseFloat( $( this ).attr( 'min' ) );

		if ( min >= 0 && parseFloat( $( this ).val() ) < min ) {
			$( this ).val( min );
		}
	});
});
;
/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery'], factory);
	} else if (typeof exports === 'object') {
		// CommonJS
		factory(require('jquery'));
	} else {
		// Browser globals
		factory(jQuery);
	}
}(function ($) {

	var pluses = /\+/g;

	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);
	}

	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);
	}

	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));
	}

	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			// This is a quoted cookie as according to RFC2068, unescape...
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
		}

		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}

	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}

	var config = $.cookie = function (key, value, options) {

		// Write

		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}

			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// Read

		var result = key ? undefined : {};

		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];

		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');

			if (key && key === name) {
				// If second argument (value) is a function it's a converter...
				result = read(cookie, value);
				break;
			}

			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}

		return result;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}

		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};

}));;
/* global wc_cart_fragments_params */
jQuery( function( $ ) {

	// wc_cart_fragments_params is required to continue, ensure the object exists
	if ( typeof wc_cart_fragments_params === 'undefined' ) {
		return false;
	}

	/* Storage Handling */
	var $supports_html5_storage;
	var cart_hash_key = wc_cart_fragments_params.ajax_url.toString() + '-wc_cart_hash';

	try {
		$supports_html5_storage = ( 'sessionStorage' in window && window.sessionStorage !== null );
		window.sessionStorage.setItem( 'wc', 'test' );
		window.sessionStorage.removeItem( 'wc' );
		window.localStorage.setItem( 'wc', 'test' );
		window.localStorage.removeItem( 'wc' );
	} catch( err ) {
		$supports_html5_storage = false;
	}

	/* Cart session creation time to base expiration on */
	function set_cart_creation_timestamp() {
		if ( $supports_html5_storage ) {
			sessionStorage.setItem( 'wc_cart_created', ( new Date() ).getTime() );
		}
	}

	/** Set the cart hash in both session and local storage */
	function set_cart_hash( cart_hash ) {
		if ( $supports_html5_storage ) {
			localStorage.setItem( cart_hash_key, cart_hash );
			sessionStorage.setItem( cart_hash_key, cart_hash );
		}
	}

	var $fragment_refresh = {
		url: wc_cart_fragments_params.wc_ajax_url.toString().replace( '%%endpoint%%', 'get_refreshed_fragments' ),
		type: 'POST',
		success: function( data ) {
			if ( data && data.fragments ) {

				$.each( data.fragments, function( key, value ) {
					$( key ).replaceWith( value );
				});

				if ( $supports_html5_storage ) {
					sessionStorage.setItem( wc_cart_fragments_params.fragment_name, JSON.stringify( data.fragments ) );
					set_cart_hash( data.cart_hash );

					if ( data.cart_hash ) {
						set_cart_creation_timestamp();
					}
				}

				$( document.body ).trigger( 'wc_fragments_refreshed' );
			}
		}
	};

	/* Named callback for refreshing cart fragment */
	function refresh_cart_fragment() {
		$.ajax( $fragment_refresh );
	}

	/* Cart Handling */
	if ( $supports_html5_storage ) {

		var cart_timeout = null,
			day_in_ms    = ( 24 * 60 * 60 * 1000 );

		$( document.body ).bind( 'wc_fragment_refresh updated_wc_div', function() {
			refresh_cart_fragment();
		});

		$( document.body ).bind( 'added_to_cart', function( event, fragments, cart_hash ) {
			var prev_cart_hash = sessionStorage.getItem( cart_hash_key );

			if ( prev_cart_hash === null || prev_cart_hash === undefined || prev_cart_hash === '' ) {
				set_cart_creation_timestamp();
			}

			sessionStorage.setItem( wc_cart_fragments_params.fragment_name, JSON.stringify( fragments ) );
			set_cart_hash( cart_hash );
		});

		$( document.body ).bind( 'wc_fragments_refreshed', function() {
			clearTimeout( cart_timeout );
			cart_timeout = setTimeout( refresh_cart_fragment, day_in_ms );
		} );

		// Refresh when storage changes in another tab
		$( window ).on( 'storage onstorage', function ( e ) {
			if ( cart_hash_key === e.originalEvent.key && localStorage.getItem( cart_hash_key ) !== sessionStorage.getItem( cart_hash_key ) ) {
				refresh_cart_fragment();
			}
		});

		try {
			var wc_fragments = $.parseJSON( sessionStorage.getItem( wc_cart_fragments_params.fragment_name ) ),
				cart_hash    = sessionStorage.getItem( cart_hash_key ),
				cookie_hash  = $.cookie( 'woocommerce_cart_hash'),
				cart_created = sessionStorage.getItem( 'wc_cart_created' );

			if ( cart_hash === null || cart_hash === undefined || cart_hash === '' ) {
				cart_hash = '';
			}

			if ( cookie_hash === null || cookie_hash === undefined || cookie_hash === '' ) {
				cookie_hash = '';
			}

			if ( cart_hash && ( cart_created === null || cart_created === undefined || cart_created === '' ) ) {
				throw 'No cart_created';
			}

			if ( cart_created ) {
				var cart_expiration = ( ( 1 * cart_created ) + day_in_ms ),
					timestamp_now   = ( new Date() ).getTime();
				if ( cart_expiration < timestamp_now ) {
					throw 'Fragment expired';
				}
				cart_timeout = setTimeout( refresh_cart_fragment, ( cart_expiration - timestamp_now ) );
			}

			if ( wc_fragments && wc_fragments['div.widget_shopping_cart_content'] && cart_hash === cookie_hash ) {

				$.each( wc_fragments, function( key, value ) {
					$( key ).replaceWith(value);
				});

				$( document.body ).trigger( 'wc_fragments_loaded' );
			} else {
				throw 'No fragment';
			}

		} catch( err ) {
			refresh_cart_fragment();
		}

	} else {
		refresh_cart_fragment();
	}

	/* Cart Hiding */
	if ( $.cookie( 'woocommerce_items_in_cart' ) > 0 ) {
		$( '.hide_cart_widget_if_empty' ).closest( '.widget_shopping_cart' ).show();
	} else {
		$( '.hide_cart_widget_if_empty' ).closest( '.widget_shopping_cart' ).hide();
	}

	$( document.body ).bind( 'adding_to_cart', function() {
		$( '.hide_cart_widget_if_empty' ).closest( '.widget_shopping_cart' ).show();
	});
});
;
/**
 * blankshield - Prevent reverse tabnabbing phishing attacks caused by _blank
 *
 * @version   0.6.0
 * @link      https://github.com/danielstjules/blankshield
 * @author    Daniel St. Jules <danielst.jules@gmail.com>
 * @license   MIT
 */
!function(e){"use strict";function n(e){if("undefined"==typeof e.length)o(e,"click",t);else if("string"!=typeof e&&!(e instanceof String))for(var n=0;n<e.length;n++)o(e[n],"click",t)}function t(e){var t,o,i,d;return e=e||window.event,t=e.currentTarget||e.srcElement,i=t.getAttribute("href"),i&&(d=e.ctrlKey||e.shiftKey||e.metaKey,o=t.getAttribute("target"),d||o&&!r(o))?(n.open(i),e.preventDefault?e.preventDefault():e.returnValue=!1,!1):void 0}function o(e,n,t){var o,i;return e.addEventListener?e.addEventListener(n,t,!1):(o="on"+n,e.attachEvent?e.attachEvent(o,t):e[o]?(i=e[o],e[o]=function(){t(),i()}):e[o]=t,void 0)}function i(e,n,t){var o,i,r,d,u;return o=document.createElement("iframe"),o.style.display="none",document.body.appendChild(o),i=o.contentDocument||o.contentWindow.document,d='"'+e+'"',n&&(d+=', "'+n+'"'),t&&(d+=', "'+t+'"'),r=i.createElement("script"),r.type="text/javascript",r.text="window.parent = null; window.top = null;window.frameElement = null; var child = window.open("+d+");child.opener = null",i.body.appendChild(r),u=o.contentWindow.child,document.body.removeChild(o),u}function r(e){return"_top"===e||"_self"===e||"_parent"===e}var d=-1!==navigator.userAgent.indexOf("MSIE"),u=window.open;n.open=function(e,n,t){var o;return r(n)?u.apply(window,arguments):d?(o=u.apply(window,arguments),o.opener=null,o):i(e,n,t)},n.patch=function(){window.open=function(){return n.open.apply(this,arguments)}},"undefined"!=typeof exports&&("undefined"!=typeof module&&module.exports?module.exports=n:exports.blankshield=n),"function"==typeof define&&"object"==typeof define.amd&&define("blankshield",[],function(){return n}),e.blankshield=n}(this);;
document.addEventListener( 'DOMContentLoaded', function() {
	blankshield( document.querySelectorAll( 'a[target=_blank]' ) );
});
;
function InfoBubble(t){this.extend(InfoBubble,google.maps.OverlayView),this.tabs_=[],this.activeTab_=null,this.baseZIndex_=100,this.isOpen_=!1;var e=t||{};void 0==e.backgroundColor&&(e.backgroundColor=this.BACKGROUND_COLOR_),void 0==e.borderColor&&(e.borderColor=this.BORDER_COLOR_),void 0==e.borderRadius&&(e.borderRadius=this.BORDER_RADIUS_),void 0==e.borderWidth&&(e.borderWidth=this.BORDER_WIDTH_),void 0==e.padding&&(e.padding=this.PADDING_),void 0==e.arrowPosition&&(e.arrowPosition=this.ARROW_POSITION_),void 0==e.disableAutoPan&&(e.disableAutoPan=!1),void 0==e.disableAnimation&&(e.disableAnimation=!1),void 0==e.minWidth&&(e.minWidth=this.MIN_WIDTH_),void 0==e.shadowStyle&&(e.shadowStyle=this.SHADOW_STYLE_),void 0==e.arrowSize&&(e.arrowSize=this.ARROW_SIZE_),void 0==e.arrowStyle&&(e.arrowStyle=this.ARROW_STYLE_),void 0==e.closeSrc&&(e.closeSrc=this.CLOSE_SRC_),this.buildDom_(),this.setValues(e)}if(Array.prototype.indexOf||(Array.prototype.indexOf=function(t){for(var e=this,n=0,i=e.length;n<i;++n)if(e[n]===t)return n;return-1}),Array.prototype.map||(Array.prototype.map=function(t,e){for(var n=this,i=[],o=0,s=n.length;o<s;++o)n[o],i.push(t.call(e||window,n[o],o,n));return i}),String.prototype.trim||(String.prototype.trim=function(){return this.replace(/^\s+|\s+$/g,"")}),Array.prototype.filter||(Array.prototype.filter=function(t,e){for(var n,i=this,o=[],s=0,r=i.length;s<r;++s)n=i[s],t.call(e||window,n,s,i)&&o.push(n);return o}),Function.prototype.bind||(Function.prototype.bind=function(t){var e=this,n=Array.prototype.slice.call(arguments,1),i=function(){},o=function(){return e.apply(this instanceof i&&t?this:t,n.concat(Array.prototype.slice.call(arguments,0)))};return i.prototype=o.prototype=e.prototype,o}),Array.prototype.forEach||(Array.prototype.forEach=function(t,e){for(var n=this,i=0,o=n.length;i<o;++i)t.call(e||window,n[i],i,n)}),"undefined"==typeof Object||Object.getPrototypeOf||(Object.getPrototypeOf=function(t){return t&&t.constructor&&t.constructor.prototype||null}),"undefined"==typeof Array||Array.isArray||(Array.isArray=function(t){return t&&"[object Array]"===Object.prototype.toString.call(t)}),"undefined"==typeof Object||Object.defineProperty||(Object.defineProperty=function(t,e,n){return n.get&&t.__defineGetter__(e,n.get),n.set&&t.__defineSetter__(e,n.set),t}),void 0===window.JSON&&function(){function t(t){this.line=1,this.col=1,this._tokLen=0,this._str=t}function e(t){this.lex=t}function n(t,e,n){if(void 0===n)return void delete t[e];t[e]=n}function i(t,e,o){var a,l,h=t[e];if("Array"===s.call(h).slice(8,-1))for(a=0,l=h.length;a<l;a++)n(h,a,i(h,a,o));else if("object"==typeof h)for(a in h)r.call(h,a)&&n(h,a,i(h,a,o));return o.call(t,e,h)}function o(t,e){return t=String(t),t.length>=e?t:new Array(e-t.length+1).join("0")+t}var s=Object.prototype.toString,r=Object.prototype.hasOwnProperty,a={PUNCTUATOR:1,STRING:2,NUMBER:3,BOOLEAN:4,NULL:5},l={"{":1,"}":1,"[":1,"]":1,",":1,":":1,'"':2,t:4,f:4,n:5},h={b:"\b",f:"\f",n:"\n",r:"\r",t:"\t",'"':'"',"\\":"\\","/":"/"},c=/^(?:[{}:,\[\]]|true|false|null|"(?:[^"\\\u0000-\u001F]|\\["\\\/bfnrt]|\\u[0-9A-F]{4})*"|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/,d=/^[\t ]+/,u=/^\r?\n/;t.prototype={getNextToken:function(){var t,e,n=this._str;if(this.col+=this._tokLen,!n.length)return"END";if(t=c.exec(n))e=l[t[0].charAt(0)]||a.NUMBER;else{if(t=d.exec(n))return this._tokLen=t[0].length,this._str=n.slice(this._tokLen),this.getNextToken();if(t=u.exec(n))return this._tokLen=0,this._str=n.slice(t[0].length),this.line++,this.col=1,this.getNextToken();this.error("Invalid token")}return this._tokLen=t[0].length,this._str=n.slice(this._tokLen),{type:e,value:t[0]}},error:function(t,e,n){var i=new SyntaxError(t);throw i.line=e||this.line,i.col=n||this.col,i}},e.prototype={parse:function(){var t=this.lex,e=this.getValue();return"END"!==t.getNextToken()&&t.error("Illegal token"),e},getObject:function(){for(var t,e,n,i,o,s={},r=this.lex,l=!1;;){if(t=r.getNextToken(),"}"===(e=t.value))return s;l?","===e?(i=r.line,o=r.col-1,t=r.getNextToken(),"}"===(e=t.value)&&r.error("Invalid trailing comma",i,o)):r.error("Illegal token where expect comma or right curly bracket"):","===e&&r.error("Invalid leading comma"),t.type!=a.STRING&&r.error("Illegal token where expect string property name"),n=this.getString(e),t=r.getNextToken(),e=t.value,":"!=e&&r.error("Illegal token where expect colon"),s[n]=this.getValue(),l=!0}},getArray:function(){for(var t,e,n,i,o=[],s=this.lex,r=!1;;){if(t=s.getNextToken(),"]"===(e=t.value))return o;r?","===e?(n=s.line,i=s.col-1,t=s.getNextToken(),"]"===(e=t.value)&&s.error("Invalid trailing comma",n,i)):s.error("Illegal token where expect comma or right square bracket"):","===e&&s.error("Invalid leading comma"),o.push(this.getValue(t)),r=!0}},getString:function(t){return t.slice(1,-1).replace(/\\u?([0-9A-F]{4}|["\\\/bfnrt])/g,function(t,e){return h[e]||String.fromCharCode(parseInt(e,16))})},getValue:function(t){var e=this.lex,n=t||e.getNextToken(),i=n.value;switch(n.type){case a.PUNCTUATOR:if("{"===i)return this.getObject();if("["===i)return this.getArray();e.error("Illegal punctoator");break;case a.STRING:return this.getString(i);case a.NUMBER:return Number(i);case a.BOOLEAN:return"true"===i;case a.NULL:return null;default:e.error("Invalid value")}}},Window.prototype.JSON={parse:function(n,o){var s=new e(new t(n)).parse();return"function"==typeof o?i({"":s},"",o):s},stringify:function(){var t,e,n,i,a,l,h=arguments[0],c="function"==typeof arguments[1]?arguments[1]:null,d=arguments[2]||"",u=d?" ":"",p=d?"\n":"",f=s.call(h).slice(8,-1);if(null===h||"Boolean"===f||"Number"===f)return h;if("Array"===f){for(t=[],a=h.length,i=0,l;i<a;++i)l=c?c(i,h[i]):h[i],l=this.stringify(l,c,d),void 0!==l&&null!==l||(l="null"),t.push(l);return"["+p+t.join(","+p).replace(/^/gm,d)+p+"]"}if("Date"===f)return'"'+h.getUTCFullYear()+"-"+o(h.getUTCMonth()+1,2)+"-"+o(h.getUTCDate(),2)+"T"+o(h.getUTCHours(),2)+":"+o(h.getUTCMinutes(),2)+":"+o(h.getUTCSeconds(),2)+"."+o(h.getUTCMilliseconds(),3)+'Z"';if("String"===f)return'"'+h.replace(/"/g,'\\"')+'"';if("object"==typeof h){t=[],n=!1;for(e in h)r.call(h,e)&&(l=c?c(e,h[e]):h[e],void 0!==(l=this.stringify(l,c,d))&&(n=!0,t.push('"'+e+'":'+u+l)));return n?"{"+p+t.join(","+p).replace(/^/gm,d)+p+"}":"{}"}}}}(),"undefined"==typeof Date||Date.now||(Date.now=function(){return(new Date).getTime()}),"undefined"==typeof Object||Object.create||(Object.create=function(t,e){if("object"!=typeof t)throw new Error("Object prototype may only be an Object or null");var n=function(){};n.prototype=t;var i=new n;return Object.defineProperties(i,e),i}),"undefined"==typeof Object||Object.defineProperties||(Object.defineProperties=function(t,e){for(var n in e)Object.defineProperty(t,n,e[n]);return t}),function(t,e){"use strict";"object"==typeof module&&"object"==typeof module.exports?module.exports=t.document?e(t,!0):function(t){if(!t.document)throw new Error("jQuery requires a window with a document");return e(t)}:e(t)}("undefined"!=typeof window?window:this,function(t,e){"use strict";function n(t,e,n){var i,o=(e=e||rt).createElement("script");if(o.text=t,n)for(i in wt)n[i]&&(o[i]=n[i]);e.head.appendChild(o).parentNode.removeChild(o)}function i(t){return null==t?t+"":"object"==typeof t||"function"==typeof t?ut[pt.call(t)]||"object":typeof t}function o(t){var e=!!t&&"length"in t&&t.length,n=i(t);return!yt(t)&&!bt(t)&&("array"===n||0===e||"number"==typeof e&&e>0&&e-1 in t)}function s(t,e){return t.nodeName&&t.nodeName.toLowerCase()===e.toLowerCase()}function r(t,e,n){return yt(e)?xt.grep(t,function(t,i){return!!e.call(t,i,t)!==n}):e.nodeType?xt.grep(t,function(t){return t===e!==n}):"string"!=typeof e?xt.grep(t,function(t){return dt.call(e,t)>-1!==n}):xt.filter(e,t,n)}function a(t,e){for(;(t=t[e])&&1!==t.nodeType;);return t}function l(t){var e={};return xt.each(t.match(Bt)||[],function(t,n){e[n]=!0}),e}function h(t){return t}function c(t){throw t}function d(t,e,n,i){var o;try{t&&yt(o=t.promise)?o.call(t).done(e).fail(n):t&&yt(o=t.then)?o.call(t,e,n):e.apply(void 0,[t].slice(i))}catch(t){n.apply(void 0,[t])}}function u(){rt.removeEventListener("DOMContentLoaded",u),t.removeEventListener("load",u),xt.ready()}function p(t,e){return e.toUpperCase()}function f(t){return t.replace(Dt,"ms-").replace(Pt,p)}function g(){this.expando=xt.expando+g.uid++}function m(t){return"true"===t||"false"!==t&&("null"===t?null:t===+t+""?+t:Rt.test(t)?JSON.parse(t):t)}function v(t,e,n){var i;if(void 0===n&&1===t.nodeType)if(i="data-"+e.replace(jt,"-$&").toLowerCase(),"string"==typeof(n=t.getAttribute(i))){try{n=m(n)}catch(t){}Mt.set(t,e,n)}else n=void 0;return n}function y(t,e,n,i){var o,s,r=20,a=i?function(){return i.cur()}:function(){return xt.css(t,e,"")},l=a(),h=n&&n[3]||(xt.cssNumber[e]?"":"px"),c=(xt.cssNumber[e]||"px"!==h&&+l)&&Ft.exec(xt.css(t,e));if(c&&c[3]!==h){for(l/=2,h=h||c[3],c=+l||1;r--;)xt.style(t,e,c+h),(1-s)*(1-(s=a()/l||.5))<=0&&(r=0),c/=s;c*=2,xt.style(t,e,c+h),n=n||[]}return n&&(c=+c||+l||0,o=n[1]?c+(n[1]+1)*n[2]:+n[2],i&&(i.unit=h,i.start=c,i.end=o)),o}function b(t){var e,n=t.ownerDocument,i=t.nodeName,o=Vt[i];return o||(e=n.body.appendChild(n.createElement(i)),o=xt.css(e,"display"),e.parentNode.removeChild(e),"none"===o&&(o="block"),Vt[i]=o,o)}function w(t,e){for(var n,i,o=[],s=0,r=t.length;s<r;s++)(i=t[s]).style&&(n=i.style.display,e?("none"===n&&(o[s]=$t.get(i,"display")||null,o[s]||(i.style.display="")),""===i.style.display&&Yt(i)&&(o[s]=b(i))):"none"!==n&&(o[s]="none",$t.set(i,"display",n)));for(s=0;s<r;s++)null!=o[s]&&(t[s].style.display=o[s]);return t}function x(t,e){var n;return n=void 0!==t.getElementsByTagName?t.getElementsByTagName(e||"*"):void 0!==t.querySelectorAll?t.querySelectorAll(e||"*"):[],void 0===e||e&&s(t,e)?xt.merge([t],n):n}function T(t,e){for(var n=0,i=t.length;n<i;n++)$t.set(t[n],"globalEval",!e||$t.get(e[n],"globalEval"))}function S(t,e,n,o,s){for(var r,a,l,h,c,d,u=e.createDocumentFragment(),p=[],f=0,g=t.length;f<g;f++)if((r=t[f])||0===r)if("object"===i(r))xt.merge(p,r.nodeType?[r]:r);else if(Jt.test(r)){for(a=a||u.appendChild(e.createElement("div")),l=(Qt.exec(r)||["",""])[1].toLowerCase(),h=Kt[l]||Kt._default,a.innerHTML=h[1]+xt.htmlPrefilter(r)+h[2],d=h[0];d--;)a=a.lastChild;xt.merge(p,a.childNodes),(a=u.firstChild).textContent=""}else p.push(e.createTextNode(r));for(u.textContent="",f=0;r=p[f++];)if(o&&xt.inArray(r,o)>-1)s&&s.push(r);else if(c=xt.contains(r.ownerDocument,r),a=x(u.appendChild(r),"script"),c&&T(a),n)for(d=0;r=a[d++];)Gt.test(r.type||"")&&n.push(r);return u}function z(){return!0}function C(){return!1}function _(){try{return rt.activeElement}catch(t){}}function I(t,e,n,i,o,s){var r,a;if("object"==typeof e){"string"!=typeof n&&(i=i||n,n=void 0);for(a in e)I(t,a,n,i,e[a],s);return t}if(null==i&&null==o?(o=n,i=n=void 0):null==o&&("string"==typeof n?(o=i,i=void 0):(o=i,i=n,n=void 0)),!1===o)o=C;else if(!o)return t;return 1===s&&(r=o,(o=function(t){return xt().off(t),r.apply(this,arguments)}).guid=r.guid||(r.guid=xt.guid++)),t.each(function(){xt.event.add(this,e,o,i,n)})}function E(t,e){return s(t,"table")&&s(11!==e.nodeType?e:e.firstChild,"tr")?xt(t).children("tbody")[0]||t:t}function k(t){return t.type=(null!==t.getAttribute("type"))+"/"+t.type,t}function W(t){return"true/"===(t.type||"").slice(0,5)?t.type=t.type.slice(5):t.removeAttribute("type"),t}function L(t,e){var n,i,o,s,r,a,l,h;if(1===e.nodeType){if($t.hasData(t)&&(s=$t.access(t),r=$t.set(e,s),h=s.events)){delete r.handle,r.events={};for(o in h)for(n=0,i=h[o].length;n<i;n++)xt.event.add(e,o,h[o][n])}Mt.hasData(t)&&(a=Mt.access(t),l=xt.extend({},a),Mt.set(e,l))}}function B(t,e){var n=e.nodeName.toLowerCase();"input"===n&&Xt.test(t.type)?e.checked=t.checked:"input"!==n&&"textarea"!==n||(e.defaultValue=t.defaultValue)}function O(t,e,i,o){e=ht.apply([],e);var s,r,a,l,h,c,d=0,u=t.length,p=u-1,f=e[0],g=yt(f);if(g||u>1&&"string"==typeof f&&!vt.checkClone&&re.test(f))return t.each(function(n){var s=t.eq(n);g&&(e[0]=f.call(this,n,s.html())),O(s,e,i,o)});if(u&&(s=S(e,t[0].ownerDocument,!1,t,o),r=s.firstChild,1===s.childNodes.length&&(s=r),r||o)){for(l=(a=xt.map(x(s,"script"),k)).length;d<u;d++)h=s,d!==p&&(h=xt.clone(h,!0,!0),l&&xt.merge(a,x(h,"script"))),i.call(t[d],h,d);if(l)for(c=a[a.length-1].ownerDocument,xt.map(a,W),d=0;d<l;d++)h=a[d],Gt.test(h.type||"")&&!$t.access(h,"globalEval")&&xt.contains(c,h)&&(h.src&&"module"!==(h.type||"").toLowerCase()?xt._evalUrl&&xt._evalUrl(h.src):n(h.textContent.replace(ae,""),c,h))}return t}function A(t,e,n){for(var i,o=e?xt.filter(e,t):t,s=0;null!=(i=o[s]);s++)n||1!==i.nodeType||xt.cleanData(x(i)),i.parentNode&&(n&&xt.contains(i.ownerDocument,i)&&T(x(i,"script")),i.parentNode.removeChild(i));return t}function H(t,e,n){var i,o,s,r,a=t.style;return(n=n||he(t))&&(""!==(r=n.getPropertyValue(e)||n[e])||xt.contains(t.ownerDocument,t)||(r=xt.style(t,e)),!vt.pixelBoxStyles()&&le.test(r)&&ce.test(e)&&(i=a.width,o=a.minWidth,s=a.maxWidth,a.minWidth=a.maxWidth=a.width=r,r=n.width,a.width=i,a.minWidth=o,a.maxWidth=s)),void 0!==r?r+"":r}function D(t,e){return{get:function(){if(!t())return(this.get=e).apply(this,arguments);delete this.get}}}function P(t){if(t in me)return t;for(var e=t[0].toUpperCase()+t.slice(1),n=ge.length;n--;)if((t=ge[n]+e)in me)return t}function N(t){var e=xt.cssProps[t];return e||(e=xt.cssProps[t]=P(t)||t),e}function $(t,e,n){var i=Ft.exec(e);return i?Math.max(0,i[2]-(n||0))+(i[3]||"px"):e}function M(t,e,n,i,o,s){var r="width"===e?1:0,a=0,l=0;if(n===(i?"border":"content"))return 0;for(;r<4;r+=2)"margin"===n&&(l+=xt.css(t,n+Ut[r],!0,o)),i?("content"===n&&(l-=xt.css(t,"padding"+Ut[r],!0,o)),"margin"!==n&&(l-=xt.css(t,"border"+Ut[r]+"Width",!0,o))):(l+=xt.css(t,"padding"+Ut[r],!0,o),"padding"!==n?l+=xt.css(t,"border"+Ut[r]+"Width",!0,o):a+=xt.css(t,"border"+Ut[r]+"Width",!0,o));return!i&&s>=0&&(l+=Math.max(0,Math.ceil(t["offset"+e[0].toUpperCase()+e.slice(1)]-s-l-a-.5))),l}function R(t,e,n){var i=he(t),o=H(t,e,i),s="border-box"===xt.css(t,"boxSizing",!1,i),r=s;if(le.test(o)){if(!n)return o;o="auto"}return r=r&&(vt.boxSizingReliable()||o===t.style[e]),("auto"===o||!parseFloat(o)&&"inline"===xt.css(t,"display",!1,i))&&(o=t["offset"+e[0].toUpperCase()+e.slice(1)],r=!0),(o=parseFloat(o)||0)+M(t,e,n||(s?"border":"content"),r,i,o)+"px"}function j(t,e,n,i,o){return new j.prototype.init(t,e,n,i,o)}function q(){ye&&(!1===rt.hidden&&t.requestAnimationFrame?t.requestAnimationFrame(q):t.setTimeout(q,xt.fx.interval),xt.fx.tick())}function F(){return t.setTimeout(function(){ve=void 0}),ve=Date.now()}function U(t,e){var n,i=0,o={height:t};for(e=e?1:0;i<4;i+=2-e)o["margin"+(n=Ut[i])]=o["padding"+n]=t;return e&&(o.opacity=o.width=t),o}function Y(t,e,n){for(var i,o=(X.tweeners[e]||[]).concat(X.tweeners["*"]),s=0,r=o.length;s<r;s++)if(i=o[s].call(n,e,t))return i}function Z(t,e,n){var i,o,s,r,a,l,h,c,d="width"in e||"height"in e,u=this,p={},f=t.style,g=t.nodeType&&Yt(t),m=$t.get(t,"fxshow");n.queue||(null==(r=xt._queueHooks(t,"fx")).unqueued&&(r.unqueued=0,a=r.empty.fire,r.empty.fire=function(){r.unqueued||a()}),r.unqueued++,u.always(function(){u.always(function(){r.unqueued--,xt.queue(t,"fx").length||r.empty.fire()})}));for(i in e)if(o=e[i],be.test(o)){if(delete e[i],s=s||"toggle"===o,o===(g?"hide":"show")){if("show"!==o||!m||void 0===m[i])continue;g=!0}p[i]=m&&m[i]||xt.style(t,i)}if((l=!xt.isEmptyObject(e))||!xt.isEmptyObject(p)){d&&1===t.nodeType&&(n.overflow=[f.overflow,f.overflowX,f.overflowY],null==(h=m&&m.display)&&(h=$t.get(t,"display")),"none"===(c=xt.css(t,"display"))&&(h?c=h:(w([t],!0),h=t.style.display||h,c=xt.css(t,"display"),w([t]))),("inline"===c||"inline-block"===c&&null!=h)&&"none"===xt.css(t,"float")&&(l||(u.done(function(){f.display=h}),null==h&&(c=f.display,h="none"===c?"":c)),f.display="inline-block")),n.overflow&&(f.overflow="hidden",u.always(function(){f.overflow=n.overflow[0],f.overflowX=n.overflow[1],f.overflowY=n.overflow[2]})),l=!1;for(i in p)l||(m?"hidden"in m&&(g=m.hidden):m=$t.access(t,"fxshow",{display:h}),s&&(m.hidden=!g),g&&w([t],!0),u.done(function(){g||w([t]),$t.remove(t,"fxshow");for(i in p)xt.style(t,i,p[i])})),l=Y(g?m[i]:0,i,u),i in m||(m[i]=l.start,g&&(l.end=l.start,l.start=0))}}function V(t,e){var n,i,o,s,r;for(n in t)if(i=f(n),o=e[i],s=t[n],Array.isArray(s)&&(o=s[1],s=t[n]=s[0]),n!==i&&(t[i]=s,delete t[n]),(r=xt.cssHooks[i])&&"expand"in r){s=r.expand(s),delete t[i];for(n in s)n in t||(t[n]=s[n],e[n]=o)}else e[i]=o}function X(t,e,n){var i,o,s=0,r=X.prefilters.length,a=xt.Deferred().always(function(){delete l.elem}),l=function(){if(o)return!1;for(var e=ve||F(),n=Math.max(0,h.startTime+h.duration-e),i=1-(n/h.duration||0),s=0,r=h.tweens.length;s<r;s++)h.tweens[s].run(i);return a.notifyWith(t,[h,i,n]),i<1&&r?n:(r||a.notifyWith(t,[h,1,0]),a.resolveWith(t,[h]),!1)},h=a.promise({elem:t,props:xt.extend({},e),opts:xt.extend(!0,{specialEasing:{},easing:xt.easing._default},n),originalProperties:e,originalOptions:n,startTime:ve||F(),duration:n.duration,tweens:[],createTween:function(e,n){var i=xt.Tween(t,h.opts,e,n,h.opts.specialEasing[e]||h.opts.easing);return h.tweens.push(i),i},stop:function(e){var n=0,i=e?h.tweens.length:0;if(o)return this;for(o=!0;n<i;n++)h.tweens[n].run(1);return e?(a.notifyWith(t,[h,1,0]),a.resolveWith(t,[h,e])):a.rejectWith(t,[h,e]),this}}),c=h.props;for(V(c,h.opts.specialEasing);s<r;s++)if(i=X.prefilters[s].call(h,t,c,h.opts))return yt(i.stop)&&(xt._queueHooks(h.elem,h.opts.queue).stop=i.stop.bind(i)),i;return xt.map(c,Y,h),yt(h.opts.start)&&h.opts.start.call(t,h),h.progress(h.opts.progress).done(h.opts.done,h.opts.complete).fail(h.opts.fail).always(h.opts.always),xt.fx.timer(xt.extend(l,{elem:t,anim:h,queue:h.opts.queue})),h}function Q(t){return(t.match(Bt)||[]).join(" ")}function G(t){return t.getAttribute&&t.getAttribute("class")||""}function K(t){return Array.isArray(t)?t:"string"==typeof t?t.match(Bt)||[]:[]}function J(t,e,n,o){var s;if(Array.isArray(e))xt.each(e,function(e,i){n||Le.test(t)?o(t,i):J(t+"["+("object"==typeof i&&null!=i?e:"")+"]",i,n,o)});else if(n||"object"!==i(e))o(t,e);else for(s in e)J(t+"["+s+"]",e[s],n,o)}function tt(t){return function(e,n){"string"!=typeof e&&(n=e,e="*");var i,o=0,s=e.toLowerCase().match(Bt)||[];if(yt(n))for(;i=s[o++];)"+"===i[0]?(i=i.slice(1)||"*",(t[i]=t[i]||[]).unshift(n)):(t[i]=t[i]||[]).push(n)}}function et(t,e,n,i){function o(a){var l;return s[a]=!0,xt.each(t[a]||[],function(t,a){var h=a(e,n,i);return"string"!=typeof h||r||s[h]?r?!(l=h):void 0:(e.dataTypes.unshift(h),o(h),!1)}),l}var s={},r=t===qe;return o(e.dataTypes[0])||!s["*"]&&o("*")}function nt(t,e){var n,i,o=xt.ajaxSettings.flatOptions||{};for(n in e)void 0!==e[n]&&((o[n]?t:i||(i={}))[n]=e[n]);return i&&xt.extend(!0,t,i),t}function it(t,e,n){for(var i,o,s,r,a=t.contents,l=t.dataTypes;"*"===l[0];)l.shift(),void 0===i&&(i=t.mimeType||e.getResponseHeader("Content-Type"));if(i)for(o in a)if(a[o]&&a[o].test(i)){l.unshift(o);break}if(l[0]in n)s=l[0];else{for(o in n){if(!l[0]||t.converters[o+" "+l[0]]){s=o;break}r||(r=o)}s=s||r}if(s)return s!==l[0]&&l.unshift(s),n[s]}function ot(t,e,n,i){var o,s,r,a,l,h={},c=t.dataTypes.slice();if(c[1])for(r in t.converters)h[r.toLowerCase()]=t.converters[r];for(s=c.shift();s;)if(t.responseFields[s]&&(n[t.responseFields[s]]=e),!l&&i&&t.dataFilter&&(e=t.dataFilter(e,t.dataType)),l=s,s=c.shift())if("*"===s)s=l;else if("*"!==l&&l!==s){if(!(r=h[l+" "+s]||h["* "+s]))for(o in h)if((a=o.split(" "))[1]===s&&(r=h[l+" "+a[0]]||h["* "+a[0]])){!0===r?r=h[o]:!0!==h[o]&&(s=a[0],c.unshift(a[1]));break}if(!0!==r)if(r&&t.throws)e=r(e);else try{e=r(e)}catch(t){return{state:"parsererror",error:r?t:"No conversion from "+l+" to "+s}}}return{state:"success",data:e}}var st=[],rt=t.document,at=Object.getPrototypeOf,lt=st.slice,ht=st.concat,ct=st.push,dt=st.indexOf,ut={},pt=ut.toString,ft=ut.hasOwnProperty,gt=ft.toString,mt=gt.call(Object),vt={},yt=function(t){return"function"==typeof t&&"number"!=typeof t.nodeType},bt=function(t){return null!=t&&t===t.window},wt={type:!0,src:!0,noModule:!0},xt=function(t,e){return new xt.fn.init(t,e)},Tt=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;xt.fn=xt.prototype={jquery:"3.3.1",constructor:xt,length:0,toArray:function(){return lt.call(this)},get:function(t){return null==t?lt.call(this):t<0?this[t+this.length]:this[t]},pushStack:function(t){var e=xt.merge(this.constructor(),t);return e.prevObject=this,e},each:function(t){return xt.each(this,t)},map:function(t){return this.pushStack(xt.map(this,function(e,n){return t.call(e,n,e)}))},slice:function(){return this.pushStack(lt.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(t){var e=this.length,n=+t+(t<0?e:0);return this.pushStack(n>=0&&n<e?[this[n]]:[])},end:function(){return this.prevObject||this.constructor()},push:ct,sort:st.sort,splice:st.splice},xt.extend=xt.fn.extend=function(){var t,e,n,i,o,s,r=arguments[0]||{},a=1,l=arguments.length,h=!1;for("boolean"==typeof r&&(h=r,r=arguments[a]||{},a++),"object"==typeof r||yt(r)||(r={}),a===l&&(r=this,a--);a<l;a++)if(null!=(t=arguments[a]))for(e in t)n=r[e],r!==(i=t[e])&&(h&&i&&(xt.isPlainObject(i)||(o=Array.isArray(i)))?(o?(o=!1,s=n&&Array.isArray(n)?n:[]):s=n&&xt.isPlainObject(n)?n:{},r[e]=xt.extend(h,s,i)):void 0!==i&&(r[e]=i));return r},xt.extend({expando:"jQuery"+("3.3.1"+Math.random()).replace(/\D/g,""),isReady:!0,error:function(t){throw new Error(t)},noop:function(){},isPlainObject:function(t){var e,n;return!(!t||"[object Object]"!==pt.call(t)||(e=at(t))&&("function"!=typeof(n=ft.call(e,"constructor")&&e.constructor)||gt.call(n)!==mt))},isEmptyObject:function(t){var e;for(e in t)return!1;return!0},globalEval:function(t){n(t)},each:function(t,e){var n,i=0;if(o(t))for(n=t.length;i<n&&!1!==e.call(t[i],i,t[i]);i++);else for(i in t)if(!1===e.call(t[i],i,t[i]))break;return t},trim:function(t){return null==t?"":(t+"").replace(Tt,"")},makeArray:function(t,e){var n=e||[];return null!=t&&(o(Object(t))?xt.merge(n,"string"==typeof t?[t]:t):ct.call(n,t)),n},inArray:function(t,e,n){return null==e?-1:dt.call(e,t,n)},merge:function(t,e){for(var n=+e.length,i=0,o=t.length;i<n;i++)t[o++]=e[i];return t.length=o,t},grep:function(t,e,n){for(var i=[],o=0,s=t.length,r=!n;o<s;o++)!e(t[o],o)!==r&&i.push(t[o]);return i},map:function(t,e,n){var i,s,r=0,a=[];if(o(t))for(i=t.length;r<i;r++)null!=(s=e(t[r],r,n))&&a.push(s);else for(r in t)null!=(s=e(t[r],r,n))&&a.push(s);return ht.apply([],a)},guid:1,support:vt}),"function"==typeof Symbol&&(xt.fn[Symbol.iterator]=st[Symbol.iterator]),xt.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),function(t,e){ut["[object "+e+"]"]=e.toLowerCase()});var St=function(t){function e(t,e,n,i){var o,s,r,a,l,c,u,p=e&&e.ownerDocument,f=e?e.nodeType:9;if(n=n||[],"string"!=typeof t||!t||1!==f&&9!==f&&11!==f)return n;if(!i&&((e?e.ownerDocument||e:$)!==L&&W(e),e=e||L,O)){if(11!==f&&(l=gt.exec(t)))if(o=l[1]){if(9===f){if(!(r=e.getElementById(o)))return n;if(r.id===o)return n.push(r),n}else if(p&&(r=p.getElementById(o))&&P(e,r)&&r.id===o)return n.push(r),n}else{if(l[2])return Q.apply(n,e.getElementsByTagName(t)),n;if((o=l[3])&&w.getElementsByClassName&&e.getElementsByClassName)return Q.apply(n,e.getElementsByClassName(o)),n}if(w.qsa&&!F[t+" "]&&(!A||!A.test(t))){if(1!==f)p=e,u=t;else if("object"!==e.nodeName.toLowerCase()){for((a=e.getAttribute("id"))?a=a.replace(bt,wt):e.setAttribute("id",a=N),s=(c=z(t)).length;s--;)c[s]="#"+a+" "+d(c[s]);u=c.join(","),p=mt.test(t)&&h(e.parentNode)||e}if(u)try{return Q.apply(n,p.querySelectorAll(u)),n}catch(t){}finally{a===N&&e.removeAttribute("id")}}}return _(t.replace(st,"$1"),e,n,i)}function n(){function t(n,i){return e.push(n+" ")>x.cacheLength&&delete t[e.shift()],t[n+" "]=i}var e=[];return t}function i(t){return t[N]=!0,t}function o(t){var e=L.createElement("fieldset");try{return!!t(e)}catch(t){return!1}finally{e.parentNode&&e.parentNode.removeChild(e),e=null}}function s(t,e){for(var n=t.split("|"),i=n.length;i--;)x.attrHandle[n[i]]=e}function r(t,e){var n=e&&t,i=n&&1===t.nodeType&&1===e.nodeType&&t.sourceIndex-e.sourceIndex;if(i)return i;if(n)for(;n=n.nextSibling;)if(n===e)return-1;return t?1:-1}function a(t){return function(e){return"form"in e?e.parentNode&&!1===e.disabled?"label"in e?"label"in e.parentNode?e.parentNode.disabled===t:e.disabled===t:e.isDisabled===t||e.isDisabled!==!t&&Tt(e)===t:e.disabled===t:"label"in e&&e.disabled===t}}function l(t){return i(function(e){return e=+e,i(function(n,i){for(var o,s=t([],n.length,e),r=s.length;r--;)n[o=s[r]]&&(n[o]=!(i[o]=n[o]))})})}function h(t){return t&&void 0!==t.getElementsByTagName&&t}function c(){}function d(t){for(var e=0,n=t.length,i="";e<n;e++)i+=t[e].value;return i}function u(t,e,n){var i=e.dir,o=e.next,s=o||i,r=n&&"parentNode"===s,a=R++;return e.first?function(e,n,o){for(;e=e[i];)if(1===e.nodeType||r)return t(e,n,o);return!1}:function(e,n,l){var h,c,d,u=[M,a];if(l){for(;e=e[i];)if((1===e.nodeType||r)&&t(e,n,l))return!0}else for(;e=e[i];)if(1===e.nodeType||r)if(d=e[N]||(e[N]={}),c=d[e.uniqueID]||(d[e.uniqueID]={}),o&&o===e.nodeName.toLowerCase())e=e[i]||e;else{if((h=c[s])&&h[0]===M&&h[1]===a)return u[2]=h[2];if(c[s]=u,u[2]=t(e,n,l))return!0}return!1}}function p(t){return t.length>1?function(e,n,i){for(var o=t.length;o--;)if(!t[o](e,n,i))return!1;return!0}:t[0]}function f(t,n,i){for(var o=0,s=n.length;o<s;o++)e(t,n[o],i);return i}function g(t,e,n,i,o){for(var s,r=[],a=0,l=t.length,h=null!=e;a<l;a++)(s=t[a])&&(n&&!n(s,i,o)||(r.push(s),h&&e.push(a)));return r}function m(t,e,n,o,s,r){return o&&!o[N]&&(o=m(o)),s&&!s[N]&&(s=m(s,r)),i(function(i,r,a,l){var h,c,d,u=[],p=[],m=r.length,v=i||f(e||"*",a.nodeType?[a]:a,[]),y=!t||!i&&e?v:g(v,u,t,a,l),b=n?s||(i?t:m||o)?[]:r:y;if(n&&n(y,b,a,l),o)for(h=g(b,p),o(h,[],a,l),c=h.length;c--;)(d=h[c])&&(b[p[c]]=!(y[p[c]]=d));if(i){if(s||t){if(s){for(h=[],c=b.length;c--;)(d=b[c])&&h.push(y[c]=d);s(null,b=[],h,l)}for(c=b.length;c--;)(d=b[c])&&(h=s?K(i,d):u[c])>-1&&(i[h]=!(r[h]=d))}}else b=g(b===r?b.splice(m,b.length):b),s?s(null,r,b,l):Q.apply(r,b)})}function v(t){for(var e,n,i,o=t.length,s=x.relative[t[0].type],r=s||x.relative[" "],a=s?1:0,l=u(function(t){return t===e},r,!0),h=u(function(t){return K(e,t)>-1},r,!0),c=[function(t,n,i){var o=!s&&(i||n!==I)||((e=n).nodeType?l(t,n,i):h(t,n,i));return e=null,o}];a<o;a++)if(n=x.relative[t[a].type])c=[u(p(c),n)];else{if((n=x.filter[t[a].type].apply(null,t[a].matches))[N]){for(i=++a;i<o&&!x.relative[t[i].type];i++);return m(a>1&&p(c),a>1&&d(t.slice(0,a-1).concat({value:" "===t[a-2].type?"*":""})).replace(st,"$1"),n,a<i&&v(t.slice(a,i)),i<o&&v(t=t.slice(i)),i<o&&d(t))}c.push(n)}return p(c)}function y(t,n){var o=n.length>0,s=t.length>0,r=function(i,r,a,l,h){var c,d,u,p=0,f="0",m=i&&[],v=[],y=I,b=i||s&&x.find.TAG("*",h),w=M+=null==y?1:Math.random()||.1,T=b.length;for(h&&(I=r===L||r||h);f!==T&&null!=(c=b[f]);f++){if(s&&c){for(d=0,r||c.ownerDocument===L||(W(c),a=!O);u=t[d++];)if(u(c,r||L,a)){l.push(c);break}h&&(M=w)}o&&((c=!u&&c)&&p--,i&&m.push(c))}if(p+=f,o&&f!==p){for(d=0;u=n[d++];)u(m,v,r,a);if(i){if(p>0)for(;f--;)m[f]||v[f]||(v[f]=V.call(l));v=g(v)}Q.apply(l,v),h&&!i&&v.length>0&&p+n.length>1&&e.uniqueSort(l)}return h&&(M=w,I=y),m};return o?i(r):r}var b,w,x,T,S,z,C,_,I,E,k,W,L,B,O,A,H,D,P,N="sizzle"+1*new Date,$=t.document,M=0,R=0,j=n(),q=n(),F=n(),U=function(t,e){return t===e&&(k=!0),0},Y={}.hasOwnProperty,Z=[],V=Z.pop,X=Z.push,Q=Z.push,G=Z.slice,K=function(t,e){for(var n=0,i=t.length;n<i;n++)if(t[n]===e)return n;return-1},J="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",tt="[\\x20\\t\\r\\n\\f]",et="(?:\\\\.|[\\w-]|[^\0-\\xa0])+",nt="\\["+tt+"*("+et+")(?:"+tt+"*([*^$|!~]?=)"+tt+"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|("+et+"))|)"+tt+"*\\]",it=":("+et+")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|"+nt+")*)|.*)\\)|)",ot=new RegExp(tt+"+","g"),st=new RegExp("^"+tt+"+|((?:^|[^\\\\])(?:\\\\.)*)"+tt+"+$","g"),rt=new RegExp("^"+tt+"*,"+tt+"*"),at=new RegExp("^"+tt+"*([>+~]|"+tt+")"+tt+"*"),lt=new RegExp("="+tt+"*([^\\]'\"]*?)"+tt+"*\\]","g"),ht=new RegExp(it),ct=new RegExp("^"+et+"$"),dt={ID:new RegExp("^#("+et+")"),CLASS:new RegExp("^\\.("+et+")"),TAG:new RegExp("^("+et+"|[*])"),ATTR:new RegExp("^"+nt),PSEUDO:new RegExp("^"+it),CHILD:new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+tt+"*(even|odd|(([+-]|)(\\d*)n|)"+tt+"*(?:([+-]|)"+tt+"*(\\d+)|))"+tt+"*\\)|)","i"),bool:new RegExp("^(?:"+J+")$","i"),needsContext:new RegExp("^"+tt+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+tt+"*((?:-\\d)?\\d*)"+tt+"*\\)|)(?=[^-]|$)","i")},ut=/^(?:input|select|textarea|button)$/i,pt=/^h\d$/i,ft=/^[^{]+\{\s*\[native \w/,gt=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,mt=/[+~]/,vt=new RegExp("\\\\([\\da-f]{1,6}"+tt+"?|("+tt+")|.)","ig"),yt=function(t,e,n){var i="0x"+e-65536;return i!==i||n?e:i<0?String.fromCharCode(i+65536):String.fromCharCode(i>>10|55296,1023&i|56320)},bt=/([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,wt=function(t,e){return e?"\0"===t?"�":t.slice(0,-1)+"\\"+t.charCodeAt(t.length-1).toString(16)+" ":"\\"+t},xt=function(){W()},Tt=u(function(t){return!0===t.disabled&&("form"in t||"label"in t)},{dir:"parentNode",next:"legend"});try{Q.apply(Z=G.call($.childNodes),$.childNodes),Z[$.childNodes.length].nodeType}catch(t){Q={apply:Z.length?function(t,e){X.apply(t,G.call(e))}:function(t,e){for(var n=t.length,i=0;t[n++]=e[i++];);t.length=n-1}}}w=e.support={},S=e.isXML=function(t){var e=t&&(t.ownerDocument||t).documentElement;return!!e&&"HTML"!==e.nodeName},W=e.setDocument=function(t){var e,n,i=t?t.ownerDocument||t:$;return i!==L&&9===i.nodeType&&i.documentElement?(L=i,B=L.documentElement,O=!S(L),$!==L&&(n=L.defaultView)&&n.top!==n&&(n.addEventListener?n.addEventListener("unload",xt,!1):n.attachEvent&&n.attachEvent("onunload",xt)),w.attributes=o(function(t){return t.className="i",!t.getAttribute("className")}),w.getElementsByTagName=o(function(t){return t.appendChild(L.createComment("")),!t.getElementsByTagName("*").length}),w.getElementsByClassName=ft.test(L.getElementsByClassName),w.getById=o(function(t){return B.appendChild(t).id=N,!L.getElementsByName||!L.getElementsByName(N).length}),w.getById?(x.filter.ID=function(t){var e=t.replace(vt,yt);return function(t){return t.getAttribute("id")===e}},x.find.ID=function(t,e){if(void 0!==e.getElementById&&O){var n=e.getElementById(t);return n?[n]:[]}}):(x.filter.ID=function(t){var e=t.replace(vt,yt);return function(t){var n=void 0!==t.getAttributeNode&&t.getAttributeNode("id");return n&&n.value===e}},x.find.ID=function(t,e){if(void 0!==e.getElementById&&O){var n,i,o,s=e.getElementById(t);if(s){if((n=s.getAttributeNode("id"))&&n.value===t)return[s];for(o=e.getElementsByName(t),i=0;s=o[i++];)if((n=s.getAttributeNode("id"))&&n.value===t)return[s]}return[]}}),x.find.TAG=w.getElementsByTagName?function(t,e){return void 0!==e.getElementsByTagName?e.getElementsByTagName(t):w.qsa?e.querySelectorAll(t):void 0}:function(t,e){var n,i=[],o=0,s=e.getElementsByTagName(t);if("*"===t){for(;n=s[o++];)1===n.nodeType&&i.push(n);return i}return s},x.find.CLASS=w.getElementsByClassName&&function(t,e){if(void 0!==e.getElementsByClassName&&O)return e.getElementsByClassName(t)},H=[],A=[],(w.qsa=ft.test(L.querySelectorAll))&&(o(function(t){B.appendChild(t).innerHTML="<a id='"+N+"'></a><select id='"+N+"-\r\\' msallowcapture=''><option selected=''></option></select>",t.querySelectorAll("[msallowcapture^='']").length&&A.push("[*^$]="+tt+"*(?:''|\"\")"),t.querySelectorAll("[selected]").length||A.push("\\["+tt+"*(?:value|"+J+")"),t.querySelectorAll("[id~="+N+"-]").length||A.push("~="),t.querySelectorAll(":checked").length||A.push(":checked"),t.querySelectorAll("a#"+N+"+*").length||A.push(".#.+[+~]")}),o(function(t){t.innerHTML="<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";var e=L.createElement("input");e.setAttribute("type","hidden"),t.appendChild(e).setAttribute("name","D"),
t.querySelectorAll("[name=d]").length&&A.push("name"+tt+"*[*^$|!~]?="),2!==t.querySelectorAll(":enabled").length&&A.push(":enabled",":disabled"),B.appendChild(t).disabled=!0,2!==t.querySelectorAll(":disabled").length&&A.push(":enabled",":disabled"),t.querySelectorAll("*,:x"),A.push(",.*:")})),(w.matchesSelector=ft.test(D=B.matches||B.webkitMatchesSelector||B.mozMatchesSelector||B.oMatchesSelector||B.msMatchesSelector))&&o(function(t){w.disconnectedMatch=D.call(t,"*"),D.call(t,"[s!='']:x"),H.push("!=",it)}),A=A.length&&new RegExp(A.join("|")),H=H.length&&new RegExp(H.join("|")),e=ft.test(B.compareDocumentPosition),P=e||ft.test(B.contains)?function(t,e){var n=9===t.nodeType?t.documentElement:t,i=e&&e.parentNode;return t===i||!(!i||1!==i.nodeType||!(n.contains?n.contains(i):t.compareDocumentPosition&&16&t.compareDocumentPosition(i)))}:function(t,e){if(e)for(;e=e.parentNode;)if(e===t)return!0;return!1},U=e?function(t,e){if(t===e)return k=!0,0;var n=!t.compareDocumentPosition-!e.compareDocumentPosition;return n||(1&(n=(t.ownerDocument||t)===(e.ownerDocument||e)?t.compareDocumentPosition(e):1)||!w.sortDetached&&e.compareDocumentPosition(t)===n?t===L||t.ownerDocument===$&&P($,t)?-1:e===L||e.ownerDocument===$&&P($,e)?1:E?K(E,t)-K(E,e):0:4&n?-1:1)}:function(t,e){if(t===e)return k=!0,0;var n,i=0,o=t.parentNode,s=e.parentNode,a=[t],l=[e];if(!o||!s)return t===L?-1:e===L?1:o?-1:s?1:E?K(E,t)-K(E,e):0;if(o===s)return r(t,e);for(n=t;n=n.parentNode;)a.unshift(n);for(n=e;n=n.parentNode;)l.unshift(n);for(;a[i]===l[i];)i++;return i?r(a[i],l[i]):a[i]===$?-1:l[i]===$?1:0},L):L},e.matches=function(t,n){return e(t,null,null,n)},e.matchesSelector=function(t,n){if((t.ownerDocument||t)!==L&&W(t),n=n.replace(lt,"='$1']"),w.matchesSelector&&O&&!F[n+" "]&&(!H||!H.test(n))&&(!A||!A.test(n)))try{var i=D.call(t,n);if(i||w.disconnectedMatch||t.document&&11!==t.document.nodeType)return i}catch(t){}return e(n,L,null,[t]).length>0},e.contains=function(t,e){return(t.ownerDocument||t)!==L&&W(t),P(t,e)},e.attr=function(t,e){(t.ownerDocument||t)!==L&&W(t);var n=x.attrHandle[e.toLowerCase()],i=n&&Y.call(x.attrHandle,e.toLowerCase())?n(t,e,!O):void 0;return void 0!==i?i:w.attributes||!O?t.getAttribute(e):(i=t.getAttributeNode(e))&&i.specified?i.value:null},e.escape=function(t){return(t+"").replace(bt,wt)},e.error=function(t){throw new Error("Syntax error, unrecognized expression: "+t)},e.uniqueSort=function(t){var e,n=[],i=0,o=0;if(k=!w.detectDuplicates,E=!w.sortStable&&t.slice(0),t.sort(U),k){for(;e=t[o++];)e===t[o]&&(i=n.push(o));for(;i--;)t.splice(n[i],1)}return E=null,t},T=e.getText=function(t){var e,n="",i=0,o=t.nodeType;if(o){if(1===o||9===o||11===o){if("string"==typeof t.textContent)return t.textContent;for(t=t.firstChild;t;t=t.nextSibling)n+=T(t)}else if(3===o||4===o)return t.nodeValue}else for(;e=t[i++];)n+=T(e);return n},(x=e.selectors={cacheLength:50,createPseudo:i,match:dt,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(t){return t[1]=t[1].replace(vt,yt),t[3]=(t[3]||t[4]||t[5]||"").replace(vt,yt),"~="===t[2]&&(t[3]=" "+t[3]+" "),t.slice(0,4)},CHILD:function(t){return t[1]=t[1].toLowerCase(),"nth"===t[1].slice(0,3)?(t[3]||e.error(t[0]),t[4]=+(t[4]?t[5]+(t[6]||1):2*("even"===t[3]||"odd"===t[3])),t[5]=+(t[7]+t[8]||"odd"===t[3])):t[3]&&e.error(t[0]),t},PSEUDO:function(t){var e,n=!t[6]&&t[2];return dt.CHILD.test(t[0])?null:(t[3]?t[2]=t[4]||t[5]||"":n&&ht.test(n)&&(e=z(n,!0))&&(e=n.indexOf(")",n.length-e)-n.length)&&(t[0]=t[0].slice(0,e),t[2]=n.slice(0,e)),t.slice(0,3))}},filter:{TAG:function(t){var e=t.replace(vt,yt).toLowerCase();return"*"===t?function(){return!0}:function(t){return t.nodeName&&t.nodeName.toLowerCase()===e}},CLASS:function(t){var e=j[t+" "];return e||(e=new RegExp("(^|"+tt+")"+t+"("+tt+"|$)"))&&j(t,function(t){return e.test("string"==typeof t.className&&t.className||void 0!==t.getAttribute&&t.getAttribute("class")||"")})},ATTR:function(t,n,i){return function(o){var s=e.attr(o,t);return null==s?"!="===n:!n||(s+="","="===n?s===i:"!="===n?s!==i:"^="===n?i&&0===s.indexOf(i):"*="===n?i&&s.indexOf(i)>-1:"$="===n?i&&s.slice(-i.length)===i:"~="===n?(" "+s.replace(ot," ")+" ").indexOf(i)>-1:"|="===n&&(s===i||s.slice(0,i.length+1)===i+"-"))}},CHILD:function(t,e,n,i,o){var s="nth"!==t.slice(0,3),r="last"!==t.slice(-4),a="of-type"===e;return 1===i&&0===o?function(t){return!!t.parentNode}:function(e,n,l){var h,c,d,u,p,f,g=s!==r?"nextSibling":"previousSibling",m=e.parentNode,v=a&&e.nodeName.toLowerCase(),y=!l&&!a,b=!1;if(m){if(s){for(;g;){for(u=e;u=u[g];)if(a?u.nodeName.toLowerCase()===v:1===u.nodeType)return!1;f=g="only"===t&&!f&&"nextSibling"}return!0}if(f=[r?m.firstChild:m.lastChild],r&&y){for(b=(p=(h=(c=(d=(u=m)[N]||(u[N]={}))[u.uniqueID]||(d[u.uniqueID]={}))[t]||[])[0]===M&&h[1])&&h[2],u=p&&m.childNodes[p];u=++p&&u&&u[g]||(b=p=0)||f.pop();)if(1===u.nodeType&&++b&&u===e){c[t]=[M,p,b];break}}else if(y&&(b=p=(h=(c=(d=(u=e)[N]||(u[N]={}))[u.uniqueID]||(d[u.uniqueID]={}))[t]||[])[0]===M&&h[1]),!1===b)for(;(u=++p&&u&&u[g]||(b=p=0)||f.pop())&&((a?u.nodeName.toLowerCase()!==v:1!==u.nodeType)||!++b||(y&&((c=(d=u[N]||(u[N]={}))[u.uniqueID]||(d[u.uniqueID]={}))[t]=[M,b]),u!==e)););return(b-=o)===i||b%i==0&&b/i>=0}}},PSEUDO:function(t,n){var o,s=x.pseudos[t]||x.setFilters[t.toLowerCase()]||e.error("unsupported pseudo: "+t);return s[N]?s(n):s.length>1?(o=[t,t,"",n],x.setFilters.hasOwnProperty(t.toLowerCase())?i(function(t,e){for(var i,o=s(t,n),r=o.length;r--;)t[i=K(t,o[r])]=!(e[i]=o[r])}):function(t){return s(t,0,o)}):s}},pseudos:{not:i(function(t){var e=[],n=[],o=C(t.replace(st,"$1"));return o[N]?i(function(t,e,n,i){for(var s,r=o(t,null,i,[]),a=t.length;a--;)(s=r[a])&&(t[a]=!(e[a]=s))}):function(t,i,s){return e[0]=t,o(e,null,s,n),e[0]=null,!n.pop()}}),has:i(function(t){return function(n){return e(t,n).length>0}}),contains:i(function(t){return t=t.replace(vt,yt),function(e){return(e.textContent||e.innerText||T(e)).indexOf(t)>-1}}),lang:i(function(t){return ct.test(t||"")||e.error("unsupported lang: "+t),t=t.replace(vt,yt).toLowerCase(),function(e){var n;do{if(n=O?e.lang:e.getAttribute("xml:lang")||e.getAttribute("lang"))return(n=n.toLowerCase())===t||0===n.indexOf(t+"-")}while((e=e.parentNode)&&1===e.nodeType);return!1}}),target:function(e){var n=t.location&&t.location.hash;return n&&n.slice(1)===e.id},root:function(t){return t===B},focus:function(t){return t===L.activeElement&&(!L.hasFocus||L.hasFocus())&&!!(t.type||t.href||~t.tabIndex)},enabled:a(!1),disabled:a(!0),checked:function(t){var e=t.nodeName.toLowerCase();return"input"===e&&!!t.checked||"option"===e&&!!t.selected},selected:function(t){return t.parentNode&&t.parentNode.selectedIndex,!0===t.selected},empty:function(t){for(t=t.firstChild;t;t=t.nextSibling)if(t.nodeType<6)return!1;return!0},parent:function(t){return!x.pseudos.empty(t)},header:function(t){return pt.test(t.nodeName)},input:function(t){return ut.test(t.nodeName)},button:function(t){var e=t.nodeName.toLowerCase();return"input"===e&&"button"===t.type||"button"===e},text:function(t){var e;return"input"===t.nodeName.toLowerCase()&&"text"===t.type&&(null==(e=t.getAttribute("type"))||"text"===e.toLowerCase())},first:l(function(){return[0]}),last:l(function(t,e){return[e-1]}),eq:l(function(t,e,n){return[n<0?n+e:n]}),even:l(function(t,e){for(var n=0;n<e;n+=2)t.push(n);return t}),odd:l(function(t,e){for(var n=1;n<e;n+=2)t.push(n);return t}),lt:l(function(t,e,n){for(var i=n<0?n+e:n;--i>=0;)t.push(i);return t}),gt:l(function(t,e,n){for(var i=n<0?n+e:n;++i<e;)t.push(i);return t})}}).pseudos.nth=x.pseudos.eq;for(b in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})x.pseudos[b]=function(t){return function(e){return"input"===e.nodeName.toLowerCase()&&e.type===t}}(b);for(b in{submit:!0,reset:!0})x.pseudos[b]=function(t){return function(e){var n=e.nodeName.toLowerCase();return("input"===n||"button"===n)&&e.type===t}}(b);return c.prototype=x.filters=x.pseudos,x.setFilters=new c,z=e.tokenize=function(t,n){var i,o,s,r,a,l,h,c=q[t+" "];if(c)return n?0:c.slice(0);for(a=t,l=[],h=x.preFilter;a;){i&&!(o=rt.exec(a))||(o&&(a=a.slice(o[0].length)||a),l.push(s=[])),i=!1,(o=at.exec(a))&&(i=o.shift(),s.push({value:i,type:o[0].replace(st," ")}),a=a.slice(i.length));for(r in x.filter)!(o=dt[r].exec(a))||h[r]&&!(o=h[r](o))||(i=o.shift(),s.push({value:i,type:r,matches:o}),a=a.slice(i.length));if(!i)break}return n?a.length:a?e.error(t):q(t,l).slice(0)},C=e.compile=function(t,e){var n,i=[],o=[],s=F[t+" "];if(!s){for(e||(e=z(t)),n=e.length;n--;)(s=v(e[n]))[N]?i.push(s):o.push(s);(s=F(t,y(o,i))).selector=t}return s},_=e.select=function(t,e,n,i){var o,s,r,a,l,c="function"==typeof t&&t,u=!i&&z(t=c.selector||t);if(n=n||[],1===u.length){if((s=u[0]=u[0].slice(0)).length>2&&"ID"===(r=s[0]).type&&9===e.nodeType&&O&&x.relative[s[1].type]){if(!(e=(x.find.ID(r.matches[0].replace(vt,yt),e)||[])[0]))return n;c&&(e=e.parentNode),t=t.slice(s.shift().value.length)}for(o=dt.needsContext.test(t)?0:s.length;o--&&(r=s[o],!x.relative[a=r.type]);)if((l=x.find[a])&&(i=l(r.matches[0].replace(vt,yt),mt.test(s[0].type)&&h(e.parentNode)||e))){if(s.splice(o,1),!(t=i.length&&d(s)))return Q.apply(n,i),n;break}}return(c||C(t,u))(i,e,!O,n,!e||mt.test(t)&&h(e.parentNode)||e),n},w.sortStable=N.split("").sort(U).join("")===N,w.detectDuplicates=!!k,W(),w.sortDetached=o(function(t){return 1&t.compareDocumentPosition(L.createElement("fieldset"))}),o(function(t){return t.innerHTML="<a href='#'></a>","#"===t.firstChild.getAttribute("href")})||s("type|href|height|width",function(t,e,n){if(!n)return t.getAttribute(e,"type"===e.toLowerCase()?1:2)}),w.attributes&&o(function(t){return t.innerHTML="<input/>",t.firstChild.setAttribute("value",""),""===t.firstChild.getAttribute("value")})||s("value",function(t,e,n){if(!n&&"input"===t.nodeName.toLowerCase())return t.defaultValue}),o(function(t){return null==t.getAttribute("disabled")})||s(J,function(t,e,n){var i;if(!n)return!0===t[e]?e.toLowerCase():(i=t.getAttributeNode(e))&&i.specified?i.value:null}),e}(t);xt.find=St,xt.expr=St.selectors,xt.expr[":"]=xt.expr.pseudos,xt.uniqueSort=xt.unique=St.uniqueSort,xt.text=St.getText,xt.isXMLDoc=St.isXML,xt.contains=St.contains,xt.escapeSelector=St.escape;var zt=function(t,e,n){for(var i=[],o=void 0!==n;(t=t[e])&&9!==t.nodeType;)if(1===t.nodeType){if(o&&xt(t).is(n))break;i.push(t)}return i},Ct=function(t,e){for(var n=[];t;t=t.nextSibling)1===t.nodeType&&t!==e&&n.push(t);return n},_t=xt.expr.match.needsContext,It=/^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;xt.filter=function(t,e,n){var i=e[0];return n&&(t=":not("+t+")"),1===e.length&&1===i.nodeType?xt.find.matchesSelector(i,t)?[i]:[]:xt.find.matches(t,xt.grep(e,function(t){return 1===t.nodeType}))},xt.fn.extend({find:function(t){var e,n,i=this.length,o=this;if("string"!=typeof t)return this.pushStack(xt(t).filter(function(){for(e=0;e<i;e++)if(xt.contains(o[e],this))return!0}));for(n=this.pushStack([]),e=0;e<i;e++)xt.find(t,o[e],n);return i>1?xt.uniqueSort(n):n},filter:function(t){return this.pushStack(r(this,t||[],!1))},not:function(t){return this.pushStack(r(this,t||[],!0))},is:function(t){return!!r(this,"string"==typeof t&&_t.test(t)?xt(t):t||[],!1).length}});var Et,kt=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;(xt.fn.init=function(t,e,n){var i,o;if(!t)return this;if(n=n||Et,"string"==typeof t){if(!(i="<"===t[0]&&">"===t[t.length-1]&&t.length>=3?[null,t,null]:kt.exec(t))||!i[1]&&e)return!e||e.jquery?(e||n).find(t):this.constructor(e).find(t);if(i[1]){if(e=e instanceof xt?e[0]:e,xt.merge(this,xt.parseHTML(i[1],e&&e.nodeType?e.ownerDocument||e:rt,!0)),It.test(i[1])&&xt.isPlainObject(e))for(i in e)yt(this[i])?this[i](e[i]):this.attr(i,e[i]);return this}return(o=rt.getElementById(i[2]))&&(this[0]=o,this.length=1),this}return t.nodeType?(this[0]=t,this.length=1,this):yt(t)?void 0!==n.ready?n.ready(t):t(xt):xt.makeArray(t,this)}).prototype=xt.fn,Et=xt(rt);var Wt=/^(?:parents|prev(?:Until|All))/,Lt={children:!0,contents:!0,next:!0,prev:!0};xt.fn.extend({has:function(t){var e=xt(t,this),n=e.length;return this.filter(function(){for(var t=0;t<n;t++)if(xt.contains(this,e[t]))return!0})},closest:function(t,e){var n,i=0,o=this.length,s=[],r="string"!=typeof t&&xt(t);if(!_t.test(t))for(;i<o;i++)for(n=this[i];n&&n!==e;n=n.parentNode)if(n.nodeType<11&&(r?r.index(n)>-1:1===n.nodeType&&xt.find.matchesSelector(n,t))){s.push(n);break}return this.pushStack(s.length>1?xt.uniqueSort(s):s)},index:function(t){return t?"string"==typeof t?dt.call(xt(t),this[0]):dt.call(this,t.jquery?t[0]:t):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(t,e){return this.pushStack(xt.uniqueSort(xt.merge(this.get(),xt(t,e))))},addBack:function(t){return this.add(null==t?this.prevObject:this.prevObject.filter(t))}}),xt.each({parent:function(t){var e=t.parentNode;return e&&11!==e.nodeType?e:null},parents:function(t){return zt(t,"parentNode")},parentsUntil:function(t,e,n){return zt(t,"parentNode",n)},next:function(t){return a(t,"nextSibling")},prev:function(t){return a(t,"previousSibling")},nextAll:function(t){return zt(t,"nextSibling")},prevAll:function(t){return zt(t,"previousSibling")},nextUntil:function(t,e,n){return zt(t,"nextSibling",n)},prevUntil:function(t,e,n){return zt(t,"previousSibling",n)},siblings:function(t){return Ct((t.parentNode||{}).firstChild,t)},children:function(t){return Ct(t.firstChild)},contents:function(t){return s(t,"iframe")?t.contentDocument:(s(t,"template")&&(t=t.content||t),xt.merge([],t.childNodes))}},function(t,e){xt.fn[t]=function(n,i){var o=xt.map(this,e,n);return"Until"!==t.slice(-5)&&(i=n),i&&"string"==typeof i&&(o=xt.filter(i,o)),this.length>1&&(Lt[t]||xt.uniqueSort(o),Wt.test(t)&&o.reverse()),this.pushStack(o)}});var Bt=/[^\x20\t\r\n\f]+/g;xt.Callbacks=function(t){t="string"==typeof t?l(t):xt.extend({},t);var e,n,o,s,r=[],a=[],h=-1,c=function(){for(s=s||t.once,o=e=!0;a.length;h=-1)for(n=a.shift();++h<r.length;)!1===r[h].apply(n[0],n[1])&&t.stopOnFalse&&(h=r.length,n=!1);t.memory||(n=!1),e=!1,s&&(r=n?[]:"")},d={add:function(){return r&&(n&&!e&&(h=r.length-1,a.push(n)),function e(n){xt.each(n,function(n,o){yt(o)?t.unique&&d.has(o)||r.push(o):o&&o.length&&"string"!==i(o)&&e(o)})}(arguments),n&&!e&&c()),this},remove:function(){return xt.each(arguments,function(t,e){for(var n;(n=xt.inArray(e,r,n))>-1;)r.splice(n,1),n<=h&&h--}),this},has:function(t){return t?xt.inArray(t,r)>-1:r.length>0},empty:function(){return r&&(r=[]),this},disable:function(){return s=a=[],r=n="",this},disabled:function(){return!r},lock:function(){return s=a=[],n||e||(r=n=""),this},locked:function(){return!!s},fireWith:function(t,n){return s||(n=[t,(n=n||[]).slice?n.slice():n],a.push(n),e||c()),this},fire:function(){return d.fireWith(this,arguments),this},fired:function(){return!!o}};return d},xt.extend({Deferred:function(e){var n=[["notify","progress",xt.Callbacks("memory"),xt.Callbacks("memory"),2],["resolve","done",xt.Callbacks("once memory"),xt.Callbacks("once memory"),0,"resolved"],["reject","fail",xt.Callbacks("once memory"),xt.Callbacks("once memory"),1,"rejected"]],i="pending",o={state:function(){return i},always:function(){return s.done(arguments).fail(arguments),this},catch:function(t){return o.then(null,t)},pipe:function(){var t=arguments;return xt.Deferred(function(e){xt.each(n,function(n,i){var o=yt(t[i[4]])&&t[i[4]];s[i[1]](function(){var t=o&&o.apply(this,arguments);t&&yt(t.promise)?t.promise().progress(e.notify).done(e.resolve).fail(e.reject):e[i[0]+"With"](this,o?[t]:arguments)})}),t=null}).promise()},then:function(e,i,o){function s(e,n,i,o){return function(){var a=this,l=arguments,d=function(){var t,d;if(!(e<r)){if((t=i.apply(a,l))===n.promise())throw new TypeError("Thenable self-resolution");d=t&&("object"==typeof t||"function"==typeof t)&&t.then,yt(d)?o?d.call(t,s(r,n,h,o),s(r,n,c,o)):(r++,d.call(t,s(r,n,h,o),s(r,n,c,o),s(r,n,h,n.notifyWith))):(i!==h&&(a=void 0,l=[t]),(o||n.resolveWith)(a,l))}},u=o?d:function(){try{d()}catch(t){xt.Deferred.exceptionHook&&xt.Deferred.exceptionHook(t,u.stackTrace),e+1>=r&&(i!==c&&(a=void 0,l=[t]),n.rejectWith(a,l))}};e?u():(xt.Deferred.getStackHook&&(u.stackTrace=xt.Deferred.getStackHook()),t.setTimeout(u))}}var r=0;return xt.Deferred(function(t){n[0][3].add(s(0,t,yt(o)?o:h,t.notifyWith)),n[1][3].add(s(0,t,yt(e)?e:h)),n[2][3].add(s(0,t,yt(i)?i:c))}).promise()},promise:function(t){return null!=t?xt.extend(t,o):o}},s={};return xt.each(n,function(t,e){var r=e[2],a=e[5];o[e[1]]=r.add,a&&r.add(function(){i=a},n[3-t][2].disable,n[3-t][3].disable,n[0][2].lock,n[0][3].lock),r.add(e[3].fire),s[e[0]]=function(){return s[e[0]+"With"](this===s?void 0:this,arguments),this},s[e[0]+"With"]=r.fireWith}),o.promise(s),e&&e.call(s,s),s},when:function(t){var e=arguments.length,n=e,i=Array(n),o=lt.call(arguments),s=xt.Deferred(),r=function(t){return function(n){i[t]=this,o[t]=arguments.length>1?lt.call(arguments):n,--e||s.resolveWith(i,o)}};if(e<=1&&(d(t,s.done(r(n)).resolve,s.reject,!e),"pending"===s.state()||yt(o[n]&&o[n].then)))return s.then();for(;n--;)d(o[n],r(n),s.reject);return s.promise()}});var Ot=/^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;xt.Deferred.exceptionHook=function(e,n){t.console&&t.console.warn&&e&&Ot.test(e.name)&&t.console.warn("jQuery.Deferred exception: "+e.message,e.stack,n)},xt.readyException=function(e){t.setTimeout(function(){throw e})};var At=xt.Deferred();xt.fn.ready=function(t){return At.then(t).catch(function(t){xt.readyException(t)}),this},xt.extend({isReady:!1,readyWait:1,ready:function(t){(!0===t?--xt.readyWait:xt.isReady)||(xt.isReady=!0,!0!==t&&--xt.readyWait>0||At.resolveWith(rt,[xt]))}}),xt.ready.then=At.then,"complete"===rt.readyState||"loading"!==rt.readyState&&!rt.documentElement.doScroll?t.setTimeout(xt.ready):(rt.addEventListener("DOMContentLoaded",u),t.addEventListener("load",u));var Ht=function(t,e,n,o,s,r,a){var l=0,h=t.length,c=null==n;if("object"===i(n)){s=!0;for(l in n)Ht(t,e,l,n[l],!0,r,a)}else if(void 0!==o&&(s=!0,yt(o)||(a=!0),c&&(a?(e.call(t,o),e=null):(c=e,e=function(t,e,n){return c.call(xt(t),n)})),e))for(;l<h;l++)e(t[l],n,a?o:o.call(t[l],l,e(t[l],n)));return s?t:c?e.call(t):h?e(t[0],n):r},Dt=/^-ms-/,Pt=/-([a-z])/g,Nt=function(t){return 1===t.nodeType||9===t.nodeType||!+t.nodeType};g.uid=1,g.prototype={cache:function(t){var e=t[this.expando];return e||(e={},Nt(t)&&(t.nodeType?t[this.expando]=e:Object.defineProperty(t,this.expando,{value:e,configurable:!0}))),e},set:function(t,e,n){var i,o=this.cache(t);if("string"==typeof e)o[f(e)]=n;else for(i in e)o[f(i)]=e[i];return o},get:function(t,e){return void 0===e?this.cache(t):t[this.expando]&&t[this.expando][f(e)]},access:function(t,e,n){return void 0===e||e&&"string"==typeof e&&void 0===n?this.get(t,e):(this.set(t,e,n),void 0!==n?n:e)},remove:function(t,e){var n,i=t[this.expando];if(void 0!==i){if(void 0!==e){n=(e=Array.isArray(e)?e.map(f):(e=f(e))in i?[e]:e.match(Bt)||[]).length;for(;n--;)delete i[e[n]]}(void 0===e||xt.isEmptyObject(i))&&(t.nodeType?t[this.expando]=void 0:delete t[this.expando])}},hasData:function(t){var e=t[this.expando];return void 0!==e&&!xt.isEmptyObject(e)}};var $t=new g,Mt=new g,Rt=/^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,jt=/[A-Z]/g;xt.extend({hasData:function(t){return Mt.hasData(t)||$t.hasData(t)},data:function(t,e,n){return Mt.access(t,e,n)},removeData:function(t,e){Mt.remove(t,e)},_data:function(t,e,n){return $t.access(t,e,n)},_removeData:function(t,e){$t.remove(t,e)}}),xt.fn.extend({data:function(t,e){var n,i,o,s=this[0],r=s&&s.attributes;if(void 0===t){if(this.length&&(o=Mt.get(s),1===s.nodeType&&!$t.get(s,"hasDataAttrs"))){for(n=r.length;n--;)r[n]&&0===(i=r[n].name).indexOf("data-")&&(i=f(i.slice(5)),v(s,i,o[i]));$t.set(s,"hasDataAttrs",!0)}return o}return"object"==typeof t?this.each(function(){Mt.set(this,t)}):Ht(this,function(e){var n;if(s&&void 0===e){if(void 0!==(n=Mt.get(s,t)))return n;if(void 0!==(n=v(s,t)))return n}else this.each(function(){Mt.set(this,t,e)})},null,e,arguments.length>1,null,!0)},removeData:function(t){return this.each(function(){Mt.remove(this,t)})}}),xt.extend({queue:function(t,e,n){var i;if(t)return e=(e||"fx")+"queue",i=$t.get(t,e),n&&(!i||Array.isArray(n)?i=$t.access(t,e,xt.makeArray(n)):i.push(n)),i||[]},dequeue:function(t,e){e=e||"fx";var n=xt.queue(t,e),i=n.length,o=n.shift(),s=xt._queueHooks(t,e),r=function(){xt.dequeue(t,e)};"inprogress"===o&&(o=n.shift(),i--),o&&("fx"===e&&n.unshift("inprogress"),delete s.stop,o.call(t,r,s)),!i&&s&&s.empty.fire()},_queueHooks:function(t,e){var n=e+"queueHooks";return $t.get(t,n)||$t.access(t,n,{empty:xt.Callbacks("once memory").add(function(){$t.remove(t,[e+"queue",n])})})}}),xt.fn.extend({queue:function(t,e){var n=2;return"string"!=typeof t&&(e=t,t="fx",n--),arguments.length<n?xt.queue(this[0],t):void 0===e?this:this.each(function(){var n=xt.queue(this,t,e);xt._queueHooks(this,t),"fx"===t&&"inprogress"!==n[0]&&xt.dequeue(this,t)})},dequeue:function(t){return this.each(function(){xt.dequeue(this,t)})},clearQueue:function(t){return this.queue(t||"fx",[])},promise:function(t,e){var n,i=1,o=xt.Deferred(),s=this,r=this.length,a=function(){--i||o.resolveWith(s,[s])};for("string"!=typeof t&&(e=t,t=void 0),t=t||"fx";r--;)(n=$t.get(s[r],t+"queueHooks"))&&n.empty&&(i++,n.empty.add(a));return a(),o.promise(e)}});var qt=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,Ft=new RegExp("^(?:([+-])=|)("+qt+")([a-z%]*)$","i"),Ut=["Top","Right","Bottom","Left"],Yt=function(t,e){return"none"===(t=e||t).style.display||""===t.style.display&&xt.contains(t.ownerDocument,t)&&"none"===xt.css(t,"display")},Zt=function(t,e,n,i){var o,s,r={};for(s in e)r[s]=t.style[s],t.style[s]=e[s];o=n.apply(t,i||[]);for(s in e)t.style[s]=r[s];return o},Vt={};xt.fn.extend({show:function(){return w(this,!0)},hide:function(){return w(this)},toggle:function(t){return"boolean"==typeof t?t?this.show():this.hide():this.each(function(){Yt(this)?xt(this).show():xt(this).hide()})}});var Xt=/^(?:checkbox|radio)$/i,Qt=/<([a-z][^\/\0>\x20\t\r\n\f]+)/i,Gt=/^$|^module$|\/(?:java|ecma)script/i,Kt={option:[1,"<select multiple='multiple'>","</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>","</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};Kt.optgroup=Kt.option,Kt.tbody=Kt.tfoot=Kt.colgroup=Kt.caption=Kt.thead,Kt.th=Kt.td;var Jt=/<|&#?\w+;/;!function(){var t=rt.createDocumentFragment().appendChild(rt.createElement("div")),e=rt.createElement("input");e.setAttribute("type","radio"),e.setAttribute("checked","checked"),e.setAttribute("name","t"),t.appendChild(e),vt.checkClone=t.cloneNode(!0).cloneNode(!0).lastChild.checked,t.innerHTML="<textarea>x</textarea>",vt.noCloneChecked=!!t.cloneNode(!0).lastChild.defaultValue}();var te=rt.documentElement,ee=/^key/,ne=/^(?:mouse|pointer|contextmenu|drag|drop)|click/,ie=/^([^.]*)(?:\.(.+)|)/;xt.event={global:{},add:function(t,e,n,i,o){var s,r,a,l,h,c,d,u,p,f,g,m=$t.get(t);if(m)for(n.handler&&(n=(s=n).handler,o=s.selector),o&&xt.find.matchesSelector(te,o),n.guid||(n.guid=xt.guid++),(l=m.events)||(l=m.events={}),(r=m.handle)||(r=m.handle=function(e){return void 0!==xt&&xt.event.triggered!==e.type?xt.event.dispatch.apply(t,arguments):void 0}),h=(e=(e||"").match(Bt)||[""]).length;h--;)p=g=(a=ie.exec(e[h])||[])[1],f=(a[2]||"").split(".").sort(),p&&(d=xt.event.special[p]||{},p=(o?d.delegateType:d.bindType)||p,d=xt.event.special[p]||{},c=xt.extend({type:p,origType:g,data:i,handler:n,guid:n.guid,selector:o,needsContext:o&&xt.expr.match.needsContext.test(o),namespace:f.join(".")},s),(u=l[p])||((u=l[p]=[]).delegateCount=0,d.setup&&!1!==d.setup.call(t,i,f,r)||t.addEventListener&&t.addEventListener(p,r)),d.add&&(d.add.call(t,c),c.handler.guid||(c.handler.guid=n.guid)),o?u.splice(u.delegateCount++,0,c):u.push(c),xt.event.global[p]=!0)},remove:function(t,e,n,i,o){var s,r,a,l,h,c,d,u,p,f,g,m=$t.hasData(t)&&$t.get(t);if(m&&(l=m.events)){for(h=(e=(e||"").match(Bt)||[""]).length;h--;)if(a=ie.exec(e[h])||[],p=g=a[1],f=(a[2]||"").split(".").sort(),p){for(d=xt.event.special[p]||{},u=l[p=(i?d.delegateType:d.bindType)||p]||[],a=a[2]&&new RegExp("(^|\\.)"+f.join("\\.(?:.*\\.|)")+"(\\.|$)"),r=s=u.length;s--;)c=u[s],!o&&g!==c.origType||n&&n.guid!==c.guid||a&&!a.test(c.namespace)||i&&i!==c.selector&&("**"!==i||!c.selector)||(u.splice(s,1),c.selector&&u.delegateCount--,d.remove&&d.remove.call(t,c));r&&!u.length&&(d.teardown&&!1!==d.teardown.call(t,f,m.handle)||xt.removeEvent(t,p,m.handle),delete l[p])}else for(p in l)xt.event.remove(t,p+e[h],n,i,!0);xt.isEmptyObject(l)&&$t.remove(t,"handle events")}},dispatch:function(t){var e,n,i,o,s,r,a=xt.event.fix(t),l=new Array(arguments.length),h=($t.get(this,"events")||{})[a.type]||[],c=xt.event.special[a.type]||{};for(l[0]=a,e=1;e<arguments.length;e++)l[e]=arguments[e];if(a.delegateTarget=this,!c.preDispatch||!1!==c.preDispatch.call(this,a)){for(r=xt.event.handlers.call(this,a,h),e=0;(o=r[e++])&&!a.isPropagationStopped();)for(a.currentTarget=o.elem,n=0;(s=o.handlers[n++])&&!a.isImmediatePropagationStopped();)a.rnamespace&&!a.rnamespace.test(s.namespace)||(a.handleObj=s,a.data=s.data,void 0!==(i=((xt.event.special[s.origType]||{}).handle||s.handler).apply(o.elem,l))&&!1===(a.result=i)&&(a.preventDefault(),a.stopPropagation()));return c.postDispatch&&c.postDispatch.call(this,a),a.result}},handlers:function(t,e){var n,i,o,s,r,a=[],l=e.delegateCount,h=t.target;if(l&&h.nodeType&&!("click"===t.type&&t.button>=1))for(;h!==this;h=h.parentNode||this)if(1===h.nodeType&&("click"!==t.type||!0!==h.disabled)){for(s=[],r={},n=0;n<l;n++)void 0===r[o=(i=e[n]).selector+" "]&&(r[o]=i.needsContext?xt(o,this).index(h)>-1:xt.find(o,this,null,[h]).length),r[o]&&s.push(i);s.length&&a.push({elem:h,handlers:s})}return h=this,l<e.length&&a.push({elem:h,handlers:e.slice(l)}),a},addProp:function(t,e){Object.defineProperty(xt.Event.prototype,t,{enumerable:!0,configurable:!0,get:yt(e)?function(){if(this.originalEvent)return e(this.originalEvent)}:function(){if(this.originalEvent)return this.originalEvent[t]},set:function(e){Object.defineProperty(this,t,{enumerable:!0,configurable:!0,writable:!0,value:e})}})},fix:function(t){return t[xt.expando]?t:new xt.Event(t)},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==_()&&this.focus)return this.focus(),!1},delegateType:"focusin"},blur:{trigger:function(){if(this===_()&&this.blur)return this.blur(),!1},delegateType:"focusout"},click:{trigger:function(){if("checkbox"===this.type&&this.click&&s(this,"input"))return this.click(),!1},_default:function(t){return s(t.target,"a")}},beforeunload:{postDispatch:function(t){void 0!==t.result&&t.originalEvent&&(t.originalEvent.returnValue=t.result)}}}},xt.removeEvent=function(t,e,n){t.removeEventListener&&t.removeEventListener(e,n)},xt.Event=function(t,e){if(!(this instanceof xt.Event))return new xt.Event(t,e);t&&t.type?(this.originalEvent=t,this.type=t.type,this.isDefaultPrevented=t.defaultPrevented||void 0===t.defaultPrevented&&!1===t.returnValue?z:C,this.target=t.target&&3===t.target.nodeType?t.target.parentNode:t.target,this.currentTarget=t.currentTarget,this.relatedTarget=t.relatedTarget):this.type=t,e&&xt.extend(this,e),this.timeStamp=t&&t.timeStamp||Date.now(),this[xt.expando]=!0},xt.Event.prototype={constructor:xt.Event,isDefaultPrevented:C,isPropagationStopped:C,isImmediatePropagationStopped:C,isSimulated:!1,preventDefault:function(){var t=this.originalEvent;this.isDefaultPrevented=z,t&&!this.isSimulated&&t.preventDefault()},stopPropagation:function(){var t=this.originalEvent;this.isPropagationStopped=z,t&&!this.isSimulated&&t.stopPropagation()},stopImmediatePropagation:function(){var t=this.originalEvent;this.isImmediatePropagationStopped=z,t&&!this.isSimulated&&t.stopImmediatePropagation(),this.stopPropagation()}},xt.each({altKey:!0,bubbles:!0,cancelable:!0,changedTouches:!0,ctrlKey:!0,detail:!0,eventPhase:!0,metaKey:!0,pageX:!0,pageY:!0,shiftKey:!0,view:!0,char:!0,charCode:!0,key:!0,keyCode:!0,button:!0,buttons:!0,clientX:!0,clientY:!0,offsetX:!0,offsetY:!0,pointerId:!0,pointerType:!0,screenX:!0,screenY:!0,targetTouches:!0,toElement:!0,touches:!0,which:function(t){var e=t.button;return null==t.which&&ee.test(t.type)?null!=t.charCode?t.charCode:t.keyCode:!t.which&&void 0!==e&&ne.test(t.type)?1&e?1:2&e?3:4&e?2:0:t.which}},xt.event.addProp),xt.each({mouseenter:"mouseover",mouseleave:"mouseout",pointerenter:"pointerover",pointerleave:"pointerout"},function(t,e){xt.event.special[t]={delegateType:e,bindType:e,handle:function(t){var n,i=this,o=t.relatedTarget,s=t.handleObj;return o&&(o===i||xt.contains(i,o))||(t.type=s.origType,n=s.handler.apply(this,arguments),t.type=e),n}}}),xt.fn.extend({on:function(t,e,n,i){return I(this,t,e,n,i)},one:function(t,e,n,i){return I(this,t,e,n,i,1)},off:function(t,e,n){var i,o;if(t&&t.preventDefault&&t.handleObj)return i=t.handleObj,xt(t.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if("object"==typeof t){for(o in t)this.off(o,e,t[o]);return this}return!1!==e&&"function"!=typeof e||(n=e,e=void 0),!1===n&&(n=C),this.each(function(){xt.event.remove(this,t,n,e)})}});var oe=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi,se=/<script|<style|<link/i,re=/checked\s*(?:[^=]|=\s*.checked.)/i,ae=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;xt.extend({htmlPrefilter:function(t){return t.replace(oe,"<$1></$2>")},clone:function(t,e,n){var i,o,s,r,a=t.cloneNode(!0),l=xt.contains(t.ownerDocument,t);if(!(vt.noCloneChecked||1!==t.nodeType&&11!==t.nodeType||xt.isXMLDoc(t)))for(r=x(a),i=0,o=(s=x(t)).length;i<o;i++)B(s[i],r[i]);if(e)if(n)for(s=s||x(t),r=r||x(a),i=0,o=s.length;i<o;i++)L(s[i],r[i]);else L(t,a);return(r=x(a,"script")).length>0&&T(r,!l&&x(t,"script")),a},cleanData:function(t){for(var e,n,i,o=xt.event.special,s=0;void 0!==(n=t[s]);s++)if(Nt(n)){if(e=n[$t.expando]){if(e.events)for(i in e.events)o[i]?xt.event.remove(n,i):xt.removeEvent(n,i,e.handle);n[$t.expando]=void 0}n[Mt.expando]&&(n[Mt.expando]=void 0)}}}),xt.fn.extend({detach:function(t){return A(this,t,!0)},remove:function(t){return A(this,t)},text:function(t){return Ht(this,function(t){return void 0===t?xt.text(this):this.empty().each(function(){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||(this.textContent=t)})},null,t,arguments.length)},append:function(){return O(this,arguments,function(t){1!==this.nodeType&&11!==this.nodeType&&9!==this.nodeType||E(this,t).appendChild(t)})},prepend:function(){return O(this,arguments,function(t){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var e=E(this,t);e.insertBefore(t,e.firstChild)}})},before:function(){return O(this,arguments,function(t){this.parentNode&&this.parentNode.insertBefore(t,this)})},after:function(){return O(this,arguments,function(t){this.parentNode&&this.parentNode.insertBefore(t,this.nextSibling)})},empty:function(){for(var t,e=0;null!=(t=this[e]);e++)1===t.nodeType&&(xt.cleanData(x(t,!1)),t.textContent="");return this},clone:function(t,e){return t=null!=t&&t,e=null==e?t:e,this.map(function(){return xt.clone(this,t,e)})},html:function(t){return Ht(this,function(t){var e=this[0]||{},n=0,i=this.length;if(void 0===t&&1===e.nodeType)return e.innerHTML;if("string"==typeof t&&!se.test(t)&&!Kt[(Qt.exec(t)||["",""])[1].toLowerCase()]){t=xt.htmlPrefilter(t);try{for(;n<i;n++)1===(e=this[n]||{}).nodeType&&(xt.cleanData(x(e,!1)),e.innerHTML=t);e=0}catch(t){}}e&&this.empty().append(t)},null,t,arguments.length)},replaceWith:function(){var t=[];return O(this,arguments,function(e){var n=this.parentNode;xt.inArray(this,t)<0&&(xt.cleanData(x(this)),n&&n.replaceChild(e,this))},t)}}),xt.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(t,e){xt.fn[t]=function(t){for(var n,i=[],o=xt(t),s=o.length-1,r=0;r<=s;r++)n=r===s?this:this.clone(!0),xt(o[r])[e](n),ct.apply(i,n.get());return this.pushStack(i)}})
;var le=new RegExp("^("+qt+")(?!px)[a-z%]+$","i"),he=function(e){var n=e.ownerDocument.defaultView;return n&&n.opener||(n=t),n.getComputedStyle(e)},ce=new RegExp(Ut.join("|"),"i");!function(){function e(){if(h){l.style.cssText="position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",h.style.cssText="position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",te.appendChild(l).appendChild(h);var e=t.getComputedStyle(h);i="1%"!==e.top,a=12===n(e.marginLeft),h.style.right="60%",r=36===n(e.right),o=36===n(e.width),h.style.position="absolute",s=36===h.offsetWidth||"absolute",te.removeChild(l),h=null}}function n(t){return Math.round(parseFloat(t))}var i,o,s,r,a,l=rt.createElement("div"),h=rt.createElement("div");h.style&&(h.style.backgroundClip="content-box",h.cloneNode(!0).style.backgroundClip="",vt.clearCloneStyle="content-box"===h.style.backgroundClip,xt.extend(vt,{boxSizingReliable:function(){return e(),o},pixelBoxStyles:function(){return e(),r},pixelPosition:function(){return e(),i},reliableMarginLeft:function(){return e(),a},scrollboxSize:function(){return e(),s}}))}();var de=/^(none|table(?!-c[ea]).+)/,ue=/^--/,pe={position:"absolute",visibility:"hidden",display:"block"},fe={letterSpacing:"0",fontWeight:"400"},ge=["Webkit","Moz","ms"],me=rt.createElement("div").style;xt.extend({cssHooks:{opacity:{get:function(t,e){if(e){var n=H(t,"opacity");return""===n?"1":n}}}},cssNumber:{animationIterationCount:!0,columnCount:!0,fillOpacity:!0,flexGrow:!0,flexShrink:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{},style:function(t,e,n,i){if(t&&3!==t.nodeType&&8!==t.nodeType&&t.style){var o,s,r,a=f(e),l=ue.test(e),h=t.style;if(l||(e=N(a)),r=xt.cssHooks[e]||xt.cssHooks[a],void 0===n)return r&&"get"in r&&void 0!==(o=r.get(t,!1,i))?o:h[e];"string"==(s=typeof n)&&(o=Ft.exec(n))&&o[1]&&(n=y(t,e,o),s="number"),null!=n&&n===n&&("number"===s&&(n+=o&&o[3]||(xt.cssNumber[a]?"":"px")),vt.clearCloneStyle||""!==n||0!==e.indexOf("background")||(h[e]="inherit"),r&&"set"in r&&void 0===(n=r.set(t,n,i))||(l?h.setProperty(e,n):h[e]=n))}},css:function(t,e,n,i){var o,s,r,a=f(e);return ue.test(e)||(e=N(a)),(r=xt.cssHooks[e]||xt.cssHooks[a])&&"get"in r&&(o=r.get(t,!0,n)),void 0===o&&(o=H(t,e,i)),"normal"===o&&e in fe&&(o=fe[e]),""===n||n?(s=parseFloat(o),!0===n||isFinite(s)?s||0:o):o}}),xt.each(["height","width"],function(t,e){xt.cssHooks[e]={get:function(t,n,i){if(n)return!de.test(xt.css(t,"display"))||t.getClientRects().length&&t.getBoundingClientRect().width?R(t,e,i):Zt(t,pe,function(){return R(t,e,i)})},set:function(t,n,i){var o,s=he(t),r="border-box"===xt.css(t,"boxSizing",!1,s),a=i&&M(t,e,i,r,s);return r&&vt.scrollboxSize()===s.position&&(a-=Math.ceil(t["offset"+e[0].toUpperCase()+e.slice(1)]-parseFloat(s[e])-M(t,e,"border",!1,s)-.5)),a&&(o=Ft.exec(n))&&"px"!==(o[3]||"px")&&(t.style[e]=n,n=xt.css(t,e)),$(t,n,a)}}}),xt.cssHooks.marginLeft=D(vt.reliableMarginLeft,function(t,e){if(e)return(parseFloat(H(t,"marginLeft"))||t.getBoundingClientRect().left-Zt(t,{marginLeft:0},function(){return t.getBoundingClientRect().left}))+"px"}),xt.each({margin:"",padding:"",border:"Width"},function(t,e){xt.cssHooks[t+e]={expand:function(n){for(var i=0,o={},s="string"==typeof n?n.split(" "):[n];i<4;i++)o[t+Ut[i]+e]=s[i]||s[i-2]||s[0];return o}},"margin"!==t&&(xt.cssHooks[t+e].set=$)}),xt.fn.extend({css:function(t,e){return Ht(this,function(t,e,n){var i,o,s={},r=0;if(Array.isArray(e)){for(i=he(t),o=e.length;r<o;r++)s[e[r]]=xt.css(t,e[r],!1,i);return s}return void 0!==n?xt.style(t,e,n):xt.css(t,e)},t,e,arguments.length>1)}}),xt.Tween=j,j.prototype={constructor:j,init:function(t,e,n,i,o,s){this.elem=t,this.prop=n,this.easing=o||xt.easing._default,this.options=e,this.start=this.now=this.cur(),this.end=i,this.unit=s||(xt.cssNumber[n]?"":"px")},cur:function(){var t=j.propHooks[this.prop];return t&&t.get?t.get(this):j.propHooks._default.get(this)},run:function(t){var e,n=j.propHooks[this.prop];return this.options.duration?this.pos=e=xt.easing[this.easing](t,this.options.duration*t,0,1,this.options.duration):this.pos=e=t,this.now=(this.end-this.start)*e+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):j.propHooks._default.set(this),this}},j.prototype.init.prototype=j.prototype,j.propHooks={_default:{get:function(t){var e;return 1!==t.elem.nodeType||null!=t.elem[t.prop]&&null==t.elem.style[t.prop]?t.elem[t.prop]:(e=xt.css(t.elem,t.prop,""))&&"auto"!==e?e:0},set:function(t){xt.fx.step[t.prop]?xt.fx.step[t.prop](t):1!==t.elem.nodeType||null==t.elem.style[xt.cssProps[t.prop]]&&!xt.cssHooks[t.prop]?t.elem[t.prop]=t.now:xt.style(t.elem,t.prop,t.now+t.unit)}}},j.propHooks.scrollTop=j.propHooks.scrollLeft={set:function(t){t.elem.nodeType&&t.elem.parentNode&&(t.elem[t.prop]=t.now)}},xt.easing={linear:function(t){return t},swing:function(t){return.5-Math.cos(t*Math.PI)/2},_default:"swing"},xt.fx=j.prototype.init,xt.fx.step={};var ve,ye,be=/^(?:toggle|show|hide)$/,we=/queueHooks$/;xt.Animation=xt.extend(X,{tweeners:{"*":[function(t,e){var n=this.createTween(t,e);return y(n.elem,t,Ft.exec(e),n),n}]},tweener:function(t,e){yt(t)?(e=t,t=["*"]):t=t.match(Bt);for(var n,i=0,o=t.length;i<o;i++)n=t[i],X.tweeners[n]=X.tweeners[n]||[],X.tweeners[n].unshift(e)},prefilters:[Z],prefilter:function(t,e){e?X.prefilters.unshift(t):X.prefilters.push(t)}}),xt.speed=function(t,e,n){var i=t&&"object"==typeof t?xt.extend({},t):{complete:n||!n&&e||yt(t)&&t,duration:t,easing:n&&e||e&&!yt(e)&&e};return xt.fx.off?i.duration=0:"number"!=typeof i.duration&&(i.duration in xt.fx.speeds?i.duration=xt.fx.speeds[i.duration]:i.duration=xt.fx.speeds._default),null!=i.queue&&!0!==i.queue||(i.queue="fx"),i.old=i.complete,i.complete=function(){yt(i.old)&&i.old.call(this),i.queue&&xt.dequeue(this,i.queue)},i},xt.fn.extend({fadeTo:function(t,e,n,i){return this.filter(Yt).css("opacity",0).show().end().animate({opacity:e},t,n,i)},animate:function(t,e,n,i){var o=xt.isEmptyObject(t),s=xt.speed(e,n,i),r=function(){var e=X(this,xt.extend({},t),s);(o||$t.get(this,"finish"))&&e.stop(!0)};return r.finish=r,o||!1===s.queue?this.each(r):this.queue(s.queue,r)},stop:function(t,e,n){var i=function(t){var e=t.stop;delete t.stop,e(n)};return"string"!=typeof t&&(n=e,e=t,t=void 0),e&&!1!==t&&this.queue(t||"fx",[]),this.each(function(){var e=!0,o=null!=t&&t+"queueHooks",s=xt.timers,r=$t.get(this);if(o)r[o]&&r[o].stop&&i(r[o]);else for(o in r)r[o]&&r[o].stop&&we.test(o)&&i(r[o]);for(o=s.length;o--;)s[o].elem!==this||null!=t&&s[o].queue!==t||(s[o].anim.stop(n),e=!1,s.splice(o,1));!e&&n||xt.dequeue(this,t)})},finish:function(t){return!1!==t&&(t=t||"fx"),this.each(function(){var e,n=$t.get(this),i=n[t+"queue"],o=n[t+"queueHooks"],s=xt.timers,r=i?i.length:0;for(n.finish=!0,xt.queue(this,t,[]),o&&o.stop&&o.stop.call(this,!0),e=s.length;e--;)s[e].elem===this&&s[e].queue===t&&(s[e].anim.stop(!0),s.splice(e,1));for(e=0;e<r;e++)i[e]&&i[e].finish&&i[e].finish.call(this);delete n.finish})}}),xt.each(["toggle","show","hide"],function(t,e){var n=xt.fn[e];xt.fn[e]=function(t,i,o){return null==t||"boolean"==typeof t?n.apply(this,arguments):this.animate(U(e,!0),t,i,o)}}),xt.each({slideDown:U("show"),slideUp:U("hide"),slideToggle:U("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(t,e){xt.fn[t]=function(t,n,i){return this.animate(e,t,n,i)}}),xt.timers=[],xt.fx.tick=function(){var t,e=0,n=xt.timers;for(ve=Date.now();e<n.length;e++)(t=n[e])()||n[e]!==t||n.splice(e--,1);n.length||xt.fx.stop(),ve=void 0},xt.fx.timer=function(t){xt.timers.push(t),xt.fx.start()},xt.fx.interval=13,xt.fx.start=function(){ye||(ye=!0,q())},xt.fx.stop=function(){ye=null},xt.fx.speeds={slow:600,fast:200,_default:400},xt.fn.delay=function(e,n){return e=xt.fx?xt.fx.speeds[e]||e:e,n=n||"fx",this.queue(n,function(n,i){var o=t.setTimeout(n,e);i.stop=function(){t.clearTimeout(o)}})},function(){var t=rt.createElement("input"),e=rt.createElement("select").appendChild(rt.createElement("option"));t.type="checkbox",vt.checkOn=""!==t.value,vt.optSelected=e.selected,(t=rt.createElement("input")).value="t",t.type="radio",vt.radioValue="t"===t.value}();var xe,Te=xt.expr.attrHandle;xt.fn.extend({attr:function(t,e){return Ht(this,xt.attr,t,e,arguments.length>1)},removeAttr:function(t){return this.each(function(){xt.removeAttr(this,t)})}}),xt.extend({attr:function(t,e,n){var i,o,s=t.nodeType;if(3!==s&&8!==s&&2!==s)return void 0===t.getAttribute?xt.prop(t,e,n):(1===s&&xt.isXMLDoc(t)||(o=xt.attrHooks[e.toLowerCase()]||(xt.expr.match.bool.test(e)?xe:void 0)),void 0!==n?null===n?void xt.removeAttr(t,e):o&&"set"in o&&void 0!==(i=o.set(t,n,e))?i:(t.setAttribute(e,n+""),n):o&&"get"in o&&null!==(i=o.get(t,e))?i:null==(i=xt.find.attr(t,e))?void 0:i)},attrHooks:{type:{set:function(t,e){if(!vt.radioValue&&"radio"===e&&s(t,"input")){var n=t.value;return t.setAttribute("type",e),n&&(t.value=n),e}}}},removeAttr:function(t,e){var n,i=0,o=e&&e.match(Bt);if(o&&1===t.nodeType)for(;n=o[i++];)t.removeAttribute(n)}}),xe={set:function(t,e,n){return!1===e?xt.removeAttr(t,n):t.setAttribute(n,n),n}},xt.each(xt.expr.match.bool.source.match(/\w+/g),function(t,e){var n=Te[e]||xt.find.attr;Te[e]=function(t,e,i){var o,s,r=e.toLowerCase();return i||(s=Te[r],Te[r]=o,o=null!=n(t,e,i)?r:null,Te[r]=s),o}});var Se=/^(?:input|select|textarea|button)$/i,ze=/^(?:a|area)$/i;xt.fn.extend({prop:function(t,e){return Ht(this,xt.prop,t,e,arguments.length>1)},removeProp:function(t){return this.each(function(){delete this[xt.propFix[t]||t]})}}),xt.extend({prop:function(t,e,n){var i,o,s=t.nodeType;if(3!==s&&8!==s&&2!==s)return 1===s&&xt.isXMLDoc(t)||(e=xt.propFix[e]||e,o=xt.propHooks[e]),void 0!==n?o&&"set"in o&&void 0!==(i=o.set(t,n,e))?i:t[e]=n:o&&"get"in o&&null!==(i=o.get(t,e))?i:t[e]},propHooks:{tabIndex:{get:function(t){var e=xt.find.attr(t,"tabindex");return e?parseInt(e,10):Se.test(t.nodeName)||ze.test(t.nodeName)&&t.href?0:-1}}},propFix:{for:"htmlFor",class:"className"}}),vt.optSelected||(xt.propHooks.selected={get:function(t){var e=t.parentNode;return e&&e.parentNode&&e.parentNode.selectedIndex,null},set:function(t){var e=t.parentNode;e&&(e.selectedIndex,e.parentNode&&e.parentNode.selectedIndex)}}),xt.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){xt.propFix[this.toLowerCase()]=this}),xt.fn.extend({addClass:function(t){var e,n,i,o,s,r,a,l=0;if(yt(t))return this.each(function(e){xt(this).addClass(t.call(this,e,G(this)))});if((e=K(t)).length)for(;n=this[l++];)if(o=G(n),i=1===n.nodeType&&" "+Q(o)+" "){for(r=0;s=e[r++];)i.indexOf(" "+s+" ")<0&&(i+=s+" ");o!==(a=Q(i))&&n.setAttribute("class",a)}return this},removeClass:function(t){var e,n,i,o,s,r,a,l=0;if(yt(t))return this.each(function(e){xt(this).removeClass(t.call(this,e,G(this)))});if(!arguments.length)return this.attr("class","");if((e=K(t)).length)for(;n=this[l++];)if(o=G(n),i=1===n.nodeType&&" "+Q(o)+" "){for(r=0;s=e[r++];)for(;i.indexOf(" "+s+" ")>-1;)i=i.replace(" "+s+" "," ");o!==(a=Q(i))&&n.setAttribute("class",a)}return this},toggleClass:function(t,e){var n=typeof t,i="string"===n||Array.isArray(t);return"boolean"==typeof e&&i?e?this.addClass(t):this.removeClass(t):yt(t)?this.each(function(n){xt(this).toggleClass(t.call(this,n,G(this),e),e)}):this.each(function(){var e,o,s,r;if(i)for(o=0,s=xt(this),r=K(t);e=r[o++];)s.hasClass(e)?s.removeClass(e):s.addClass(e);else void 0!==t&&"boolean"!==n||((e=G(this))&&$t.set(this,"__className__",e),this.setAttribute&&this.setAttribute("class",e||!1===t?"":$t.get(this,"__className__")||""))})},hasClass:function(t){var e,n,i=0;for(e=" "+t+" ";n=this[i++];)if(1===n.nodeType&&(" "+Q(G(n))+" ").indexOf(e)>-1)return!0;return!1}});var Ce=/\r/g;xt.fn.extend({val:function(t){var e,n,i,o=this[0];return arguments.length?(i=yt(t),this.each(function(n){var o;1===this.nodeType&&(null==(o=i?t.call(this,n,xt(this).val()):t)?o="":"number"==typeof o?o+="":Array.isArray(o)&&(o=xt.map(o,function(t){return null==t?"":t+""})),(e=xt.valHooks[this.type]||xt.valHooks[this.nodeName.toLowerCase()])&&"set"in e&&void 0!==e.set(this,o,"value")||(this.value=o))})):o?(e=xt.valHooks[o.type]||xt.valHooks[o.nodeName.toLowerCase()])&&"get"in e&&void 0!==(n=e.get(o,"value"))?n:"string"==typeof(n=o.value)?n.replace(Ce,""):null==n?"":n:void 0}}),xt.extend({valHooks:{option:{get:function(t){var e=xt.find.attr(t,"value");return null!=e?e:Q(xt.text(t))}},select:{get:function(t){var e,n,i,o=t.options,r=t.selectedIndex,a="select-one"===t.type,l=a?null:[],h=a?r+1:o.length;for(i=r<0?h:a?r:0;i<h;i++)if(((n=o[i]).selected||i===r)&&!n.disabled&&(!n.parentNode.disabled||!s(n.parentNode,"optgroup"))){if(e=xt(n).val(),a)return e;l.push(e)}return l},set:function(t,e){for(var n,i,o=t.options,s=xt.makeArray(e),r=o.length;r--;)((i=o[r]).selected=xt.inArray(xt.valHooks.option.get(i),s)>-1)&&(n=!0);return n||(t.selectedIndex=-1),s}}}}),xt.each(["radio","checkbox"],function(){xt.valHooks[this]={set:function(t,e){if(Array.isArray(e))return t.checked=xt.inArray(xt(t).val(),e)>-1}},vt.checkOn||(xt.valHooks[this].get=function(t){return null===t.getAttribute("value")?"on":t.value})}),vt.focusin="onfocusin"in t;var _e=/^(?:focusinfocus|focusoutblur)$/,Ie=function(t){t.stopPropagation()};xt.extend(xt.event,{trigger:function(e,n,i,o){var s,r,a,l,h,c,d,u,p=[i||rt],f=ft.call(e,"type")?e.type:e,g=ft.call(e,"namespace")?e.namespace.split("."):[];if(r=u=a=i=i||rt,3!==i.nodeType&&8!==i.nodeType&&!_e.test(f+xt.event.triggered)&&(f.indexOf(".")>-1&&(f=(g=f.split(".")).shift(),g.sort()),h=f.indexOf(":")<0&&"on"+f,e=e[xt.expando]?e:new xt.Event(f,"object"==typeof e&&e),e.isTrigger=o?2:3,e.namespace=g.join("."),e.rnamespace=e.namespace?new RegExp("(^|\\.)"+g.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,e.result=void 0,e.target||(e.target=i),n=null==n?[e]:xt.makeArray(n,[e]),d=xt.event.special[f]||{},o||!d.trigger||!1!==d.trigger.apply(i,n))){if(!o&&!d.noBubble&&!bt(i)){for(l=d.delegateType||f,_e.test(l+f)||(r=r.parentNode);r;r=r.parentNode)p.push(r),a=r;a===(i.ownerDocument||rt)&&p.push(a.defaultView||a.parentWindow||t)}for(s=0;(r=p[s++])&&!e.isPropagationStopped();)u=r,e.type=s>1?l:d.bindType||f,(c=($t.get(r,"events")||{})[e.type]&&$t.get(r,"handle"))&&c.apply(r,n),(c=h&&r[h])&&c.apply&&Nt(r)&&(e.result=c.apply(r,n),!1===e.result&&e.preventDefault());return e.type=f,o||e.isDefaultPrevented()||d._default&&!1!==d._default.apply(p.pop(),n)||!Nt(i)||h&&yt(i[f])&&!bt(i)&&((a=i[h])&&(i[h]=null),xt.event.triggered=f,e.isPropagationStopped()&&u.addEventListener(f,Ie),i[f](),e.isPropagationStopped()&&u.removeEventListener(f,Ie),xt.event.triggered=void 0,a&&(i[h]=a)),e.result}},simulate:function(t,e,n){var i=xt.extend(new xt.Event,n,{type:t,isSimulated:!0});xt.event.trigger(i,null,e)}}),xt.fn.extend({trigger:function(t,e){return this.each(function(){xt.event.trigger(t,e,this)})},triggerHandler:function(t,e){var n=this[0];if(n)return xt.event.trigger(t,e,n,!0)}}),vt.focusin||xt.each({focus:"focusin",blur:"focusout"},function(t,e){var n=function(t){xt.event.simulate(e,t.target,xt.event.fix(t))};xt.event.special[e]={setup:function(){var i=this.ownerDocument||this,o=$t.access(i,e);o||i.addEventListener(t,n,!0),$t.access(i,e,(o||0)+1)},teardown:function(){var i=this.ownerDocument||this,o=$t.access(i,e)-1;o?$t.access(i,e,o):(i.removeEventListener(t,n,!0),$t.remove(i,e))}}});var Ee=t.location,ke=Date.now(),We=/\?/;xt.parseXML=function(e){var n;if(!e||"string"!=typeof e)return null;try{n=(new t.DOMParser).parseFromString(e,"text/xml")}catch(t){n=void 0}return n&&!n.getElementsByTagName("parsererror").length||xt.error("Invalid XML: "+e),n};var Le=/\[\]$/,Be=/\r?\n/g,Oe=/^(?:submit|button|image|reset|file)$/i,Ae=/^(?:input|select|textarea|keygen)/i;xt.param=function(t,e){var n,i=[],o=function(t,e){var n=yt(e)?e():e;i[i.length]=encodeURIComponent(t)+"="+encodeURIComponent(null==n?"":n)};if(Array.isArray(t)||t.jquery&&!xt.isPlainObject(t))xt.each(t,function(){o(this.name,this.value)});else for(n in t)J(n,t[n],e,o);return i.join("&")},xt.fn.extend({serialize:function(){return xt.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var t=xt.prop(this,"elements");return t?xt.makeArray(t):this}).filter(function(){var t=this.type;return this.name&&!xt(this).is(":disabled")&&Ae.test(this.nodeName)&&!Oe.test(t)&&(this.checked||!Xt.test(t))}).map(function(t,e){var n=xt(this).val();return null==n?null:Array.isArray(n)?xt.map(n,function(t){return{name:e.name,value:t.replace(Be,"\r\n")}}):{name:e.name,value:n.replace(Be,"\r\n")}}).get()}});var He=/%20/g,De=/#.*$/,Pe=/([?&])_=[^&]*/,Ne=/^(.*?):[ \t]*([^\r\n]*)$/gm,$e=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Me=/^(?:GET|HEAD)$/,Re=/^\/\//,je={},qe={},Fe="*/".concat("*"),Ue=rt.createElement("a");Ue.href=Ee.href,xt.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:Ee.href,type:"GET",isLocal:$e.test(Ee.protocol),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Fe,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/\bxml\b/,html:/\bhtml/,json:/\bjson\b/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":JSON.parse,"text xml":xt.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(t,e){return e?nt(nt(t,xt.ajaxSettings),e):nt(xt.ajaxSettings,t)},ajaxPrefilter:tt(je),ajaxTransport:tt(qe),ajax:function(e,n){function i(e,n,i,a){var h,u,p,w,x,T=n;c||(c=!0,l&&t.clearTimeout(l),o=void 0,r=a||"",S.readyState=e>0?4:0,h=e>=200&&e<300||304===e,i&&(w=it(f,S,i)),w=ot(f,w,S,h),h?(f.ifModified&&((x=S.getResponseHeader("Last-Modified"))&&(xt.lastModified[s]=x),(x=S.getResponseHeader("etag"))&&(xt.etag[s]=x)),204===e||"HEAD"===f.type?T="nocontent":304===e?T="notmodified":(T=w.state,u=w.data,h=!(p=w.error))):(p=T,!e&&T||(T="error",e<0&&(e=0))),S.status=e,S.statusText=(n||T)+"",h?v.resolveWith(g,[u,T,S]):v.rejectWith(g,[S,T,p]),S.statusCode(b),b=void 0,d&&m.trigger(h?"ajaxSuccess":"ajaxError",[S,f,h?u:p]),y.fireWith(g,[S,T]),d&&(m.trigger("ajaxComplete",[S,f]),--xt.active||xt.event.trigger("ajaxStop")))}"object"==typeof e&&(n=e,e=void 0),n=n||{};var o,s,r,a,l,h,c,d,u,p,f=xt.ajaxSetup({},n),g=f.context||f,m=f.context&&(g.nodeType||g.jquery)?xt(g):xt.event,v=xt.Deferred(),y=xt.Callbacks("once memory"),b=f.statusCode||{},w={},x={},T="canceled",S={readyState:0,getResponseHeader:function(t){var e;if(c){if(!a)for(a={};e=Ne.exec(r);)a[e[1].toLowerCase()]=e[2];e=a[t.toLowerCase()]}return null==e?null:e},getAllResponseHeaders:function(){return c?r:null},setRequestHeader:function(t,e){return null==c&&(t=x[t.toLowerCase()]=x[t.toLowerCase()]||t,w[t]=e),this},overrideMimeType:function(t){return null==c&&(f.mimeType=t),this},statusCode:function(t){var e;if(t)if(c)S.always(t[S.status]);else for(e in t)b[e]=[b[e],t[e]];return this},abort:function(t){var e=t||T;return o&&o.abort(e),i(0,e),this}};if(v.promise(S),f.url=((e||f.url||Ee.href)+"").replace(Re,Ee.protocol+"//"),f.type=n.method||n.type||f.method||f.type,f.dataTypes=(f.dataType||"*").toLowerCase().match(Bt)||[""],null==f.crossDomain){h=rt.createElement("a");try{h.href=f.url,h.href=h.href,f.crossDomain=Ue.protocol+"//"+Ue.host!=h.protocol+"//"+h.host}catch(t){f.crossDomain=!0}}if(f.data&&f.processData&&"string"!=typeof f.data&&(f.data=xt.param(f.data,f.traditional)),et(je,f,n,S),c)return S;(d=xt.event&&f.global)&&0==xt.active++&&xt.event.trigger("ajaxStart"),f.type=f.type.toUpperCase(),f.hasContent=!Me.test(f.type),s=f.url.replace(De,""),f.hasContent?f.data&&f.processData&&0===(f.contentType||"").indexOf("application/x-www-form-urlencoded")&&(f.data=f.data.replace(He,"+")):(p=f.url.slice(s.length),f.data&&(f.processData||"string"==typeof f.data)&&(s+=(We.test(s)?"&":"?")+f.data,delete f.data),!1===f.cache&&(s=s.replace(Pe,"$1"),p=(We.test(s)?"&":"?")+"_="+ke+++p),f.url=s+p),f.ifModified&&(xt.lastModified[s]&&S.setRequestHeader("If-Modified-Since",xt.lastModified[s]),xt.etag[s]&&S.setRequestHeader("If-None-Match",xt.etag[s])),(f.data&&f.hasContent&&!1!==f.contentType||n.contentType)&&S.setRequestHeader("Content-Type",f.contentType),S.setRequestHeader("Accept",f.dataTypes[0]&&f.accepts[f.dataTypes[0]]?f.accepts[f.dataTypes[0]]+("*"!==f.dataTypes[0]?", "+Fe+"; q=0.01":""):f.accepts["*"]);for(u in f.headers)S.setRequestHeader(u,f.headers[u]);if(f.beforeSend&&(!1===f.beforeSend.call(g,S,f)||c))return S.abort();if(T="abort",y.add(f.complete),S.done(f.success),S.fail(f.error),o=et(qe,f,n,S)){if(S.readyState=1,d&&m.trigger("ajaxSend",[S,f]),c)return S;f.async&&f.timeout>0&&(l=t.setTimeout(function(){S.abort("timeout")},f.timeout));try{c=!1,o.send(w,i)}catch(t){if(c)throw t;i(-1,t)}}else i(-1,"No Transport");return S},getJSON:function(t,e,n){return xt.get(t,e,n,"json")},getScript:function(t,e){return xt.get(t,void 0,e,"script")}}),xt.each(["get","post"],function(t,e){xt[e]=function(t,n,i,o){return yt(n)&&(o=o||i,i=n,n=void 0),xt.ajax(xt.extend({url:t,type:e,dataType:o,data:n,success:i},xt.isPlainObject(t)&&t))}}),xt._evalUrl=function(t){return xt.ajax({url:t,type:"GET",dataType:"script",cache:!0,async:!1,global:!1,throws:!0})},xt.fn.extend({wrapAll:function(t){var e;return this[0]&&(yt(t)&&(t=t.call(this[0])),e=xt(t,this[0].ownerDocument).eq(0).clone(!0),this[0].parentNode&&e.insertBefore(this[0]),e.map(function(){for(var t=this;t.firstElementChild;)t=t.firstElementChild;return t}).append(this)),this},wrapInner:function(t){return yt(t)?this.each(function(e){xt(this).wrapInner(t.call(this,e))}):this.each(function(){var e=xt(this),n=e.contents();n.length?n.wrapAll(t):e.append(t)})},wrap:function(t){var e=yt(t);return this.each(function(n){xt(this).wrapAll(e?t.call(this,n):t)})},unwrap:function(t){return this.parent(t).not("body").each(function(){xt(this).replaceWith(this.childNodes)}),this}}),xt.expr.pseudos.hidden=function(t){return!xt.expr.pseudos.visible(t)},xt.expr.pseudos.visible=function(t){return!!(t.offsetWidth||t.offsetHeight||t.getClientRects().length)},xt.ajaxSettings.xhr=function(){try{return new t.XMLHttpRequest}catch(t){}};var Ye={0:200,1223:204},Ze=xt.ajaxSettings.xhr();vt.cors=!!Ze&&"withCredentials"in Ze,vt.ajax=Ze=!!Ze,xt.ajaxTransport(function(e){var n,i;if(vt.cors||Ze&&!e.crossDomain)return{send:function(o,s){var r,a=e.xhr();if(a.open(e.type,e.url,e.async,e.username,e.password),e.xhrFields)for(r in e.xhrFields)a[r]=e.xhrFields[r];e.mimeType&&a.overrideMimeType&&a.overrideMimeType(e.mimeType),e.crossDomain||o["X-Requested-With"]||(o["X-Requested-With"]="XMLHttpRequest");for(r in o)a.setRequestHeader(r,o[r]);n=function(t){return function(){n&&(n=i=a.onload=a.onerror=a.onabort=a.ontimeout=a.onreadystatechange=null,"abort"===t?a.abort():"error"===t?"number"!=typeof a.status?s(0,"error"):s(a.status,a.statusText):s(Ye[a.status]||a.status,a.statusText,"text"!==(a.responseType||"text")||"string"!=typeof a.responseText?{binary:a.response}:{text:a.responseText},a.getAllResponseHeaders()))}},a.onload=n(),i=a.onerror=a.ontimeout=n("error"),void 0!==a.onabort?a.onabort=i:a.onreadystatechange=function(){4===a.readyState&&t.setTimeout(function(){n&&i()})},n=n("abort");try{a.send(e.hasContent&&e.data||null)}catch(t){if(n)throw t}},abort:function(){n&&n()}}}),xt.ajaxPrefilter(function(t){t.crossDomain&&(t.contents.script=!1)}),xt.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/\b(?:java|ecma)script\b/},converters:{"text script":function(t){return xt.globalEval(t),t}}}),xt.ajaxPrefilter("script",function(t){void 0===t.cache&&(t.cache=!1),t.crossDomain&&(t.type="GET")}),xt.ajaxTransport("script",function(t){if(t.crossDomain){var e,n;return{send:function(i,o){e=xt("<script>").prop({charset:t.scriptCharset,src:t.url}).on("load error",n=function(t){e.remove(),n=null,t&&o("error"===t.type?404:200,t.type)}),rt.head.appendChild(e[0])},abort:function(){n&&n()}}}});var Ve=[],Xe=/(=)\?(?=&|$)|\?\?/;xt.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var t=Ve.pop()||xt.expando+"_"+ke++;return this[t]=!0,t}}),xt.ajaxPrefilter("json jsonp",function(e,n,i){var o,s,r,a=!1!==e.jsonp&&(Xe.test(e.url)?"url":"string"==typeof e.data&&0===(e.contentType||"").indexOf("application/x-www-form-urlencoded")&&Xe.test(e.data)&&"data");if(a||"jsonp"===e.dataTypes[0])return o=e.jsonpCallback=yt(e.jsonpCallback)?e.jsonpCallback():e.jsonpCallback,a?e[a]=e[a].replace(Xe,"$1"+o):!1!==e.jsonp&&(e.url+=(We.test(e.url)?"&":"?")+e.jsonp+"="+o),e.converters["script json"]=function(){return r||xt.error(o+" was not called"),r[0]},e.dataTypes[0]="json",s=t[o],t[o]=function(){r=arguments},i.always(function(){void 0===s?xt(t).removeProp(o):t[o]=s,e[o]&&(e.jsonpCallback=n.jsonpCallback,Ve.push(o)),r&&yt(s)&&s(r[0]),r=s=void 0}),"script"}),vt.createHTMLDocument=function(){var t=rt.implementation.createHTMLDocument("").body;return t.innerHTML="<form></form><form></form>",2===t.childNodes.length}(),xt.parseHTML=function(t,e,n){if("string"!=typeof t)return[];"boolean"==typeof e&&(n=e,e=!1);var i,o,s;return e||(vt.createHTMLDocument?((i=(e=rt.implementation.createHTMLDocument("")).createElement("base")).href=rt.location.href,e.head.appendChild(i)):e=rt),o=It.exec(t),s=!n&&[],o?[e.createElement(o[1])]:(o=S([t],e,s),s&&s.length&&xt(s).remove(),xt.merge([],o.childNodes))},xt.fn.load=function(t,e,n){var i,o,s,r=this,a=t.indexOf(" ");return a>-1&&(i=Q(t.slice(a)),t=t.slice(0,a)),yt(e)?(n=e,e=void 0):e&&"object"==typeof e&&(o="POST"),r.length>0&&xt.ajax({url:t,type:o||"GET",dataType:"html",data:e}).done(function(t){s=arguments,r.html(i?xt("<div>").append(xt.parseHTML(t)).find(i):t)}).always(n&&function(t,e){r.each(function(){n.apply(this,s||[t.responseText,e,t])})}),this},xt.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(t,e){xt.fn[e]=function(t){return this.on(e,t)}}),xt.expr.pseudos.animated=function(t){return xt.grep(xt.timers,function(e){return t===e.elem}).length},xt.offset={setOffset:function(t,e,n){var i,o,s,r,a,l,h=xt.css(t,"position"),c=xt(t),d={};"static"===h&&(t.style.position="relative"),a=c.offset(),s=xt.css(t,"top"),l=xt.css(t,"left"),("absolute"===h||"fixed"===h)&&(s+l).indexOf("auto")>-1?(r=(i=c.position()).top,o=i.left):(r=parseFloat(s)||0,o=parseFloat(l)||0),yt(e)&&(e=e.call(t,n,xt.extend({},a))),null!=e.top&&(d.top=e.top-a.top+r),null!=e.left&&(d.left=e.left-a.left+o),"using"in e?e.using.call(t,d):c.css(d)}},xt.fn.extend({offset:function(t){if(arguments.length)return void 0===t?this:this.each(function(e){xt.offset.setOffset(this,t,e)});var e,n,i=this[0];return i?i.getClientRects().length?(e=i.getBoundingClientRect(),n=i.ownerDocument.defaultView,{top:e.top+n.pageYOffset,left:e.left+n.pageXOffset}):{top:0,left:0}:void 0},position:function(){if(this[0]){var t,e,n,i=this[0],o={top:0,left:0};if("fixed"===xt.css(i,"position"))e=i.getBoundingClientRect();else{for(e=this.offset(),n=i.ownerDocument,t=i.offsetParent||n.documentElement;t&&(t===n.body||t===n.documentElement)&&"static"===xt.css(t,"position");)t=t.parentNode;t&&t!==i&&1===t.nodeType&&((o=xt(t).offset()).top+=xt.css(t,"borderTopWidth",!0),o.left+=xt.css(t,"borderLeftWidth",!0))}return{top:e.top-o.top-xt.css(i,"marginTop",!0),left:e.left-o.left-xt.css(i,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){for(var t=this.offsetParent;t&&"static"===xt.css(t,"position");)t=t.offsetParent;return t||te})}}),xt.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(t,e){var n="pageYOffset"===e;xt.fn[t]=function(i){return Ht(this,function(t,i,o){var s;if(bt(t)?s=t:9===t.nodeType&&(s=t.defaultView),void 0===o)return s?s[e]:t[i];s?s.scrollTo(n?s.pageXOffset:o,n?o:s.pageYOffset):t[i]=o},t,i,arguments.length)}}),xt.each(["top","left"],function(t,e){xt.cssHooks[e]=D(vt.pixelPosition,function(t,n){if(n)return n=H(t,e),le.test(n)?xt(t).position()[e]+"px":n})}),xt.each({Height:"height",Width:"width"},function(t,e){xt.each({padding:"inner"+t,content:e,"":"outer"+t},function(n,i){xt.fn[i]=function(o,s){var r=arguments.length&&(n||"boolean"!=typeof o),a=n||(!0===o||!0===s?"margin":"border");return Ht(this,function(e,n,o){var s;return bt(e)?0===i.indexOf("outer")?e["inner"+t]:e.document.documentElement["client"+t]:9===e.nodeType?(s=e.documentElement,Math.max(e.body["scroll"+t],s["scroll"+t],e.body["offset"+t],s["offset"+t],s["client"+t])):void 0===o?xt.css(e,n,a):xt.style(e,n,o,a)},e,r?o:void 0,r)}})}),xt.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "),function(t,e){xt.fn[e]=function(t,n){return arguments.length>0?this.on(e,null,t,n):this.trigger(e)}}),xt.fn.extend({hover:function(t,e){return this.mouseenter(t).mouseleave(e||t)}}),xt.fn.extend({bind:function(t,e,n){return this.on(t,null,e,n)},unbind:function(t,e){return this.off(t,null,e)},delegate:function(t,e,n,i){return this.on(e,t,n,i)},undelegate:function(t,e,n){return 1===arguments.length?this.off(t,"**"):this.off(e,t||"**",n)}}),xt.proxy=function(t,e){var n,i,o;if("string"==typeof e&&(n=t[e],e=t,t=n),yt(t))return i=lt.call(arguments,2),o=function(){return t.apply(e||this,i.concat(lt.call(arguments)))},o.guid=t.guid=t.guid||xt.guid++,o},xt.holdReady=function(t){t?xt.readyWait++:xt.ready(!0)},xt.isArray=Array.isArray,xt.parseJSON=JSON.parse,xt.nodeName=s,xt.isFunction=yt,xt.isWindow=bt,xt.camelCase=f,xt.type=i,xt.now=Date.now,xt.isNumeric=function(t){var e=xt.type(t);return("number"===e||"string"===e)&&!isNaN(t-parseFloat(t))},"function"==typeof define&&define.amd&&define("jquery",[],function(){return xt});var Qe=t.jQuery,Ge=t.$;return xt.noConflict=function(e){return t.$===xt&&(t.$=Ge),e&&t.jQuery===xt&&(t.jQuery=Qe),xt},e||(t.jQuery=t.$=xt),xt}),"undefined"==typeof jQuery)throw new Error("Bootstrap's JavaScript requires jQuery");+function(t){"use strict";function e(){var t=document.createElement("bootstrap"),e={WebkitTransition:"webkitTransitionEnd",MozTransition:"transitionend",OTransition:"oTransitionEnd otransitionend",transition:"transitionend"};for(var n in e)if(void 0!==t.style[n])return{end:e[n]};return!1}t.fn.emulateTransitionEnd=function(e){var n=!1,i=this;t(this).one(t.support.transition.end,function(){n=!0});var o=function(){n||t(i).trigger(t.support.transition.end)};return setTimeout(o,e),this},t(function(){t.support.transition=e()})}(jQuery),function(t){"use strict";var e='[data-dismiss="alert"]',n=function(n){t(n).on("click",e,this.close)};n.prototype.close=function(e){function n(){s.trigger("closed.bs.alert").remove()}var i=t(this),o=i.attr("data-target");o||(o=i.attr("href"),o=o&&o.replace(/.*(?=#[^\s]*$)/,""));var s=t(o);e&&e.preventDefault(),s.length||(s=i.hasClass("alert")?i:i.parent()),s.trigger(e=t.Event("close.bs.alert")),e.isDefaultPrevented()||(s.removeClass("in"),t.support.transition&&s.hasClass("fade")?s.one(t.support.transition.end,n).emulateTransitionEnd(150):n())};var i=t.fn.alert;t.fn.alert=function(e){return this.each(function(){var i=t(this),o=i.data("bs.alert");o||i.data("bs.alert",o=new n(this)),"string"==typeof e&&o[e].call(i)})},t.fn.alert.Constructor=n,t.fn.alert.noConflict=function(){return t.fn.alert=i,this},t(document).on("click.bs.alert.data-api",e,n.prototype.close)}(jQuery),function(t){"use strict";var e=function(n,i){this.$element=t(n),this.options=t.extend({},e.DEFAULTS,i),this.isLoading=!1};e.DEFAULTS={loadingText:"loading..."},e.prototype.setState=function(e){var n="disabled",i=this.$element,o=i.is("input")?"val":"html",s=i.data();e+="Text",s.resetText||i.data("resetText",i[o]()),i[o](s[e]||this.options[e]),setTimeout(t.proxy(function(){"loadingText"==e?(this.isLoading=!0,i.addClass(n).attr(n,n)):this.isLoading&&(this.isLoading=!1,
i.removeClass(n).removeAttr(n))},this),0)},e.prototype.toggle=function(){var t=!0,e=this.$element.closest('[data-toggle="buttons"]');if(e.length){var n=this.$element.find("input");"radio"==n.prop("type")&&(n.prop("checked")&&this.$element.hasClass("active")?t=!1:e.find(".active").removeClass("active")),t&&n.prop("checked",!this.$element.hasClass("active")).trigger("change")}t&&this.$element.toggleClass("active")};var n=t.fn.button;t.fn.button=function(n){return this.each(function(){var i=t(this),o=i.data("bs.button"),s="object"==typeof n&&n;o||i.data("bs.button",o=new e(this,s)),"toggle"==n?o.toggle():n&&o.setState(n)})},t.fn.button.Constructor=e,t.fn.button.noConflict=function(){return t.fn.button=n,this},t(document).on("click.bs.button.data-api","[data-toggle^=button]",function(e){var n=t(e.target);n.hasClass("btn")||(n=n.closest(".btn")),n.button("toggle"),e.preventDefault()})}(jQuery),function(t){"use strict";var e=function(e,n){this.$element=t(e),this.$indicators=this.$element.find(".carousel-indicators"),this.options=n,this.paused=this.sliding=this.interval=this.$active=this.$items=null,"hover"==this.options.pause&&this.$element.on("mouseenter",t.proxy(this.pause,this)).on("mouseleave",t.proxy(this.cycle,this))};e.DEFAULTS={interval:5e3,pause:"hover",wrap:!0},e.prototype.cycle=function(e){return e||(this.paused=!1),this.interval&&clearInterval(this.interval),this.options.interval&&!this.paused&&(this.interval=setInterval(t.proxy(this.next,this),this.options.interval)),this},e.prototype.getActiveIndex=function(){return this.$active=this.$element.find(".item.active"),this.$items=this.$active.parent().children(),this.$items.index(this.$active)},e.prototype.to=function(e){var n=this,i=this.getActiveIndex();return e>this.$items.length-1||0>e?void 0:this.sliding?this.$element.one("slid.bs.carousel",function(){n.to(e)}):i==e?this.pause().cycle():this.slide(e>i?"next":"prev",t(this.$items[e]))},e.prototype.pause=function(e){return e||(this.paused=!0),this.$element.find(".next, .prev").length&&t.support.transition&&(this.$element.trigger(t.support.transition.end),this.cycle(!0)),this.interval=clearInterval(this.interval),this},e.prototype.next=function(){return this.sliding?void 0:this.slide("next")},e.prototype.prev=function(){return this.sliding?void 0:this.slide("prev")},e.prototype.slide=function(e,n){var i=this.$element.find(".item.active"),o=n||i[e](),s=this.interval,r="next"==e?"left":"right",a="next"==e?"first":"last",l=this;if(!o.length){if(!this.options.wrap)return;o=this.$element.find(".item")[a]()}if(o.hasClass("active"))return this.sliding=!1;var h=t.Event("slide.bs.carousel",{relatedTarget:o[0],direction:r});return this.$element.trigger(h),h.isDefaultPrevented()?void 0:(this.sliding=!0,s&&this.pause(),this.$indicators.length&&(this.$indicators.find(".active").removeClass("active"),this.$element.one("slid.bs.carousel",function(){var e=t(l.$indicators.children()[l.getActiveIndex()]);e&&e.addClass("active")})),t.support.transition&&this.$element.hasClass("slide")?(o.addClass(e),o[0].offsetWidth,i.addClass(r),o.addClass(r),i.one(t.support.transition.end,function(){o.removeClass([e,r].join(" ")).addClass("active"),i.removeClass(["active",r].join(" ")),l.sliding=!1,setTimeout(function(){l.$element.trigger("slid.bs.carousel")},0)}).emulateTransitionEnd(1e3*i.css("transition-duration").slice(0,-1))):(i.removeClass("active"),o.addClass("active"),this.sliding=!1,this.$element.trigger("slid.bs.carousel")),s&&this.cycle(),this)};var n=t.fn.carousel;t.fn.carousel=function(n){return this.each(function(){var i=t(this),o=i.data("bs.carousel"),s=t.extend({},e.DEFAULTS,i.data(),"object"==typeof n&&n),r="string"==typeof n?n:s.slide;o||i.data("bs.carousel",o=new e(this,s)),"number"==typeof n?o.to(n):r?o[r]():s.interval&&o.pause().cycle()})},t.fn.carousel.Constructor=e,t.fn.carousel.noConflict=function(){return t.fn.carousel=n,this},t(document).on("click.bs.carousel.data-api","[data-slide], [data-slide-to]",function(e){var n,i=t(this),o=t(i.attr("data-target")||(n=i.attr("href"))&&n.replace(/.*(?=#[^\s]+$)/,"")),s=t.extend({},o.data(),i.data()),r=i.attr("data-slide-to");r&&(s.interval=!1),o.carousel(s),(r=i.attr("data-slide-to"))&&o.data("bs.carousel").to(r),e.preventDefault()}),t(window).on("load",function(){t('[data-ride="carousel"]').each(function(){var e=t(this);e.carousel(e.data())})})}(jQuery),function(t){"use strict";var e=function(n,i){this.$element=t(n),this.options=t.extend({},e.DEFAULTS,i),this.transitioning=null,this.options.parent&&(this.$parent=t(this.options.parent)),this.options.toggle&&this.toggle()};e.DEFAULTS={toggle:!0},e.prototype.dimension=function(){return this.$element.hasClass("width")?"width":"height"},e.prototype.show=function(){if(!this.transitioning&&!this.$element.hasClass("in")){var e=t.Event("show.bs.collapse");if(this.$element.trigger(e),!e.isDefaultPrevented()){var n=this.$parent&&this.$parent.find("> .panel > .in");if(n&&n.length){var i=n.data("bs.collapse");if(i&&i.transitioning)return;n.collapse("hide"),i||n.data("bs.collapse",null)}var o=this.dimension();this.$element.removeClass("collapse").addClass("collapsing")[o](0),this.transitioning=1;var s=function(){this.$element.removeClass("collapsing").addClass("collapse in")[o]("auto"),this.transitioning=0,this.$element.trigger("shown.bs.collapse")};if(!t.support.transition)return s.call(this);var r=t.camelCase(["scroll",o].join("-"));this.$element.one(t.support.transition.end,t.proxy(s,this)).emulateTransitionEnd(350)[o](this.$element[0][r])}}},e.prototype.hide=function(){if(!this.transitioning&&this.$element.hasClass("in")){var e=t.Event("hide.bs.collapse");if(this.$element.trigger(e),!e.isDefaultPrevented()){var n=this.dimension();this.$element[n](this.$element[n]())[0].offsetHeight,this.$element.addClass("collapsing").removeClass("collapse").removeClass("in"),this.transitioning=1;var i=function(){this.transitioning=0,this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse")};return t.support.transition?void this.$element[n](0).one(t.support.transition.end,t.proxy(i,this)).emulateTransitionEnd(350):i.call(this)}}},e.prototype.toggle=function(){this[this.$element.hasClass("in")?"hide":"show"]()};var n=t.fn.collapse;t.fn.collapse=function(n){return this.each(function(){var i=t(this),o=i.data("bs.collapse"),s=t.extend({},e.DEFAULTS,i.data(),"object"==typeof n&&n);!o&&s.toggle&&"show"==n&&(n=!n),o||i.data("bs.collapse",o=new e(this,s)),"string"==typeof n&&o[n]()})},t.fn.collapse.Constructor=e,t.fn.collapse.noConflict=function(){return t.fn.collapse=n,this},t(document).on("click.bs.collapse.data-api","[data-toggle=collapse]",function(e){var n,i=t(this),o=i.attr("data-target")||e.preventDefault()||(n=i.attr("href"))&&n.replace(/.*(?=#[^\s]+$)/,""),s=t(o),r=s.data("bs.collapse"),a=r?"toggle":i.data(),l=i.attr("data-parent"),h=l&&t(l);r&&r.transitioning||(h&&h.find('[data-toggle=collapse][data-parent="'+l+'"]').not(i).addClass("collapsed"),i[s.hasClass("in")?"addClass":"removeClass"]("collapsed")),s.collapse(a)})}(jQuery),function(t){"use strict";function e(e){t(i).remove(),t(o).each(function(){var i=n(t(this)),o={relatedTarget:this};i.hasClass("open")&&(i.trigger(e=t.Event("hide.bs.dropdown",o)),e.isDefaultPrevented()||i.removeClass("open").trigger("hidden.bs.dropdown",o))})}function n(e){var n=e.attr("data-target");n||(n=e.attr("href"),n=n&&/#[A-Za-z]/.test(n)&&n.replace(/.*(?=#[^\s]*$)/,""));var i=n&&t(n);return i&&i.length?i:e.parent()}var i=".dropdown-backdrop",o="[data-toggle=dropdown]",s=function(e){t(e).on("click.bs.dropdown",this.toggle)};s.prototype.toggle=function(i){var o=t(this);if(!o.is(".disabled, :disabled")){var s=n(o),r=s.hasClass("open");if(e(),!r){"ontouchstart"in document.documentElement&&!s.closest(".navbar-nav").length&&t('<div class="dropdown-backdrop"/>').insertAfter(t(this)).on("click",e);var a={relatedTarget:this};if(s.trigger(i=t.Event("show.bs.dropdown",a)),i.isDefaultPrevented())return;s.toggleClass("open").trigger("shown.bs.dropdown",a),o.focus()}return!1}},s.prototype.keydown=function(e){if(/(38|40|27)/.test(e.keyCode)){var i=t(this);if(e.preventDefault(),e.stopPropagation(),!i.is(".disabled, :disabled")){var s=n(i),r=s.hasClass("open");if(!r||r&&27==e.keyCode)return 27==e.which&&s.find(o).focus(),i.click();var a=" li:not(.divider):visible a",l=s.find("[role=menu]"+a+", [role=listbox]"+a);if(l.length){var h=l.index(l.filter(":focus"));38==e.keyCode&&h>0&&h--,40==e.keyCode&&h<l.length-1&&h++,~h||(h=0),l.eq(h).focus()}}}};var r=t.fn.dropdown;t.fn.dropdown=function(e){return this.each(function(){var n=t(this),i=n.data("bs.dropdown");i||n.data("bs.dropdown",i=new s(this)),"string"==typeof e&&i[e].call(n)})},t.fn.dropdown.Constructor=s,t.fn.dropdown.noConflict=function(){return t.fn.dropdown=r,this},t(document).on("click.bs.dropdown.data-api",e).on("click.bs.dropdown.data-api",".dropdown form",function(t){t.stopPropagation()}).on("click.bs.dropdown.data-api",o,s.prototype.toggle).on("keydown.bs.dropdown.data-api",o+", [role=menu], [role=listbox]",s.prototype.keydown)}(jQuery),function(t){"use strict";var e=function(e,n){this.options=n,this.$element=t(e),this.$backdrop=this.isShown=null,this.options.remote&&this.$element.find(".modal-content").load(this.options.remote,t.proxy(function(){this.$element.trigger("loaded.bs.modal")},this))};e.DEFAULTS={backdrop:!0,keyboard:!0,show:!0},e.prototype.toggle=function(t){return this[this.isShown?"hide":"show"](t)},e.prototype.show=function(e){var n=this,i=t.Event("show.bs.modal",{relatedTarget:e});this.$element.trigger(i),this.isShown||i.isDefaultPrevented()||(this.isShown=!0,this.escape(),this.$element.on("click.dismiss.bs.modal",'[data-dismiss="modal"]',t.proxy(this.hide,this)),this.backdrop(function(){var i=t.support.transition&&n.$element.hasClass("fade");n.$element.parent().length||n.$element.appendTo(document.body),n.$element.show().scrollTop(0),i&&n.$element[0].offsetWidth,n.$element.addClass("in").attr("aria-hidden",!1),n.enforceFocus();var o=t.Event("shown.bs.modal",{relatedTarget:e});i?n.$element.find(".modal-dialog").one(t.support.transition.end,function(){n.$element.focus().trigger(o)}).emulateTransitionEnd(300):n.$element.focus().trigger(o)}))},e.prototype.hide=function(e){e&&e.preventDefault(),e=t.Event("hide.bs.modal"),this.$element.trigger(e),this.isShown&&!e.isDefaultPrevented()&&(this.isShown=!1,this.escape(),t(document).off("focusin.bs.modal"),this.$element.removeClass("in").attr("aria-hidden",!0).off("click.dismiss.bs.modal"),t.support.transition&&this.$element.hasClass("fade")?this.$element.one(t.support.transition.end,t.proxy(this.hideModal,this)).emulateTransitionEnd(300):this.hideModal())},e.prototype.enforceFocus=function(){t(document).off("focusin.bs.modal").on("focusin.bs.modal",t.proxy(function(t){this.$element[0]===t.target||this.$element.has(t.target).length||this.$element.focus()},this))},e.prototype.escape=function(){this.isShown&&this.options.keyboard?this.$element.on("keyup.dismiss.bs.modal",t.proxy(function(t){27==t.which&&this.hide()},this)):this.isShown||this.$element.off("keyup.dismiss.bs.modal")},e.prototype.hideModal=function(){var t=this;this.$element.hide(),this.backdrop(function(){t.removeBackdrop(),t.$element.trigger("hidden.bs.modal")})},e.prototype.removeBackdrop=function(){this.$backdrop&&this.$backdrop.remove(),this.$backdrop=null},e.prototype.backdrop=function(e){var n=this.$element.hasClass("fade")?"fade":"";if(this.isShown&&this.options.backdrop){var i=t.support.transition&&n;if(this.$backdrop=t('<div class="modal-backdrop '+n+'" />').appendTo(document.body),this.$element.on("click.dismiss.bs.modal",t.proxy(function(t){t.target===t.currentTarget&&("static"==this.options.backdrop?this.$element[0].focus.call(this.$element[0]):this.hide.call(this))},this)),i&&this.$backdrop[0].offsetWidth,this.$backdrop.addClass("in"),!e)return;i?this.$backdrop.one(t.support.transition.end,e).emulateTransitionEnd(150):e()}else!this.isShown&&this.$backdrop?(this.$backdrop.removeClass("in"),t.support.transition&&this.$element.hasClass("fade")?this.$backdrop.one(t.support.transition.end,e).emulateTransitionEnd(150):e()):e&&e()};var n=t.fn.modal;t.fn.modal=function(n,i){return this.each(function(){var o=t(this),s=o.data("bs.modal"),r=t.extend({},e.DEFAULTS,o.data(),"object"==typeof n&&n);s||o.data("bs.modal",s=new e(this,r)),"string"==typeof n?s[n](i):r.show&&s.show(i)})},t.fn.modal.Constructor=e,t.fn.modal.noConflict=function(){return t.fn.modal=n,this},t(document).on("click.bs.modal.data-api",'[data-toggle="modal"]',function(e){var n=t(this),i=n.attr("href"),o=t(n.attr("data-target")||i&&i.replace(/.*(?=#[^\s]+$)/,"")),s=o.data("bs.modal")?"toggle":t.extend({remote:!/#/.test(i)&&i},o.data(),n.data());n.is("a")&&e.preventDefault(),o.modal(s,this).one("hide",function(){n.is(":visible")&&n.focus()})}),t(document).on("show.bs.modal",".modal",function(){t(document.body).addClass("modal-open")}).on("hidden.bs.modal",".modal",function(){t(document.body).removeClass("modal-open")})}(jQuery),function(t){"use strict";var e=function(t,e){this.type=this.options=this.enabled=this.timeout=this.hoverState=this.$element=null,this.init("tooltip",t,e)};e.DEFAULTS={animation:!0,placement:"top",selector:!1,template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',trigger:"hover focus",title:"",delay:0,html:!1,container:!1},e.prototype.init=function(e,n,i){this.enabled=!0,this.type=e,this.$element=t(n),this.options=this.getOptions(i);for(var o=this.options.trigger.split(" "),s=o.length;s--;){var r=o[s];if("click"==r)this.$element.on("click."+this.type,this.options.selector,t.proxy(this.toggle,this));else if("manual"!=r){var a="hover"==r?"mouseenter":"focusin",l="hover"==r?"mouseleave":"focusout";this.$element.on(a+"."+this.type,this.options.selector,t.proxy(this.enter,this)),this.$element.on(l+"."+this.type,this.options.selector,t.proxy(this.leave,this))}}this.options.selector?this._options=t.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},e.prototype.getDefaults=function(){return e.DEFAULTS},e.prototype.getOptions=function(e){return e=t.extend({},this.getDefaults(),this.$element.data(),e),e.delay&&"number"==typeof e.delay&&(e.delay={show:e.delay,hide:e.delay}),e},e.prototype.getDelegateOptions=function(){var e={},n=this.getDefaults();return this._options&&t.each(this._options,function(t,i){n[t]!=i&&(e[t]=i)}),e},e.prototype.enter=function(e){var n=e instanceof this.constructor?e:t(e.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type);return clearTimeout(n.timeout),n.hoverState="in",n.options.delay&&n.options.delay.show?void(n.timeout=setTimeout(function(){"in"==n.hoverState&&n.show()},n.options.delay.show)):n.show()},e.prototype.leave=function(e){var n=e instanceof this.constructor?e:t(e.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type);return clearTimeout(n.timeout),n.hoverState="out",n.options.delay&&n.options.delay.hide?void(n.timeout=setTimeout(function(){"out"==n.hoverState&&n.hide()},n.options.delay.hide)):n.hide()},e.prototype.show=function(){var e=t.Event("show.bs."+this.type);if(this.hasContent()&&this.enabled){if(this.$element.trigger(e),e.isDefaultPrevented())return;var n=this,i=this.tip();this.setContent(),this.options.animation&&i.addClass("fade");var o="function"==typeof this.options.placement?this.options.placement.call(this,i[0],this.$element[0]):this.options.placement,s=/\s?auto?\s?/i,r=s.test(o);r&&(o=o.replace(s,"")||"top"),i.detach().css({top:0,left:0,display:"block"}).addClass(o),this.options.container?i.appendTo(this.options.container):i.insertAfter(this.$element);var a=this.getPosition(),l=i[0].offsetWidth,h=i[0].offsetHeight;if(r){var c=this.$element.parent(),d=o,u=document.documentElement.scrollTop||document.body.scrollTop,p="body"==this.options.container?window.innerWidth:c.outerWidth(),f="body"==this.options.container?window.innerHeight:c.outerHeight(),g="body"==this.options.container?0:c.offset().left;o="bottom"==o&&a.top+a.height+h-u>f?"top":"top"==o&&a.top-u-h<0?"bottom":"right"==o&&a.right+l>p?"left":"left"==o&&a.left-l<g?"right":o,i.removeClass(d).addClass(o)}var m=this.getCalculatedOffset(o,a,l,h);this.applyPlacement(m,o),this.hoverState=null;var v=function(){n.$element.trigger("shown.bs."+n.type)};t.support.transition&&this.$tip.hasClass("fade")?i.one(t.support.transition.end,v).emulateTransitionEnd(150):v()}},e.prototype.applyPlacement=function(e,n){var i,o=this.tip(),s=o[0].offsetWidth,r=o[0].offsetHeight,a=parseInt(o.css("margin-top"),10),l=parseInt(o.css("margin-left"),10);isNaN(a)&&(a=0),isNaN(l)&&(l=0),e.top=e.top+a,e.left=e.left+l,t.offset.setOffset(o[0],t.extend({using:function(t){o.css({top:Math.round(t.top),left:Math.round(t.left)})}},e),0),o.addClass("in");var h=o[0].offsetWidth,c=o[0].offsetHeight;if("top"==n&&c!=r&&(i=!0,e.top=e.top+r-c),/bottom|top/.test(n)){var d=0;e.left<0&&(d=-2*e.left,e.left=0,o.offset(e),h=o[0].offsetWidth,c=o[0].offsetHeight),this.replaceArrow(d-s+h,h,"left")}else this.replaceArrow(c-r,c,"top");i&&o.offset(e)},e.prototype.replaceArrow=function(t,e,n){this.arrow().css(n,t?50*(1-t/e)+"%":"")},e.prototype.setContent=function(){var t=this.tip(),e=this.getTitle();t.find(".tooltip-inner")[this.options.html?"html":"text"](e),t.removeClass("fade in top bottom left right")},e.prototype.hide=function(){function e(){"in"!=n.hoverState&&i.detach(),n.$element.trigger("hidden.bs."+n.type)}var n=this,i=this.tip(),o=t.Event("hide.bs."+this.type);return this.$element.trigger(o),o.isDefaultPrevented()?void 0:(i.removeClass("in"),t.support.transition&&this.$tip.hasClass("fade")?i.one(t.support.transition.end,e).emulateTransitionEnd(150):e(),this.hoverState=null,this)},e.prototype.fixTitle=function(){var t=this.$element;(t.attr("title")||"string"!=typeof t.attr("data-original-title"))&&t.attr("data-original-title",t.attr("title")||"").attr("title","")},e.prototype.hasContent=function(){return this.getTitle()},e.prototype.getPosition=function(){var e=this.$element[0];return t.extend({},"function"==typeof e.getBoundingClientRect?e.getBoundingClientRect():{width:e.offsetWidth,height:e.offsetHeight},this.$element.offset())},e.prototype.getCalculatedOffset=function(t,e,n,i){return"bottom"==t?{top:e.top+e.height,left:e.left+e.width/2-n/2}:"top"==t?{top:e.top-i,left:e.left+e.width/2-n/2}:"left"==t?{top:e.top+e.height/2-i/2,left:e.left-n}:{top:e.top+e.height/2-i/2,left:e.left+e.width}},e.prototype.getTitle=function(){var t=this.$element,e=this.options;return t.attr("data-original-title")||("function"==typeof e.title?e.title.call(t[0]):e.title)},e.prototype.tip=function(){return this.$tip=this.$tip||t(this.options.template)},e.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".tooltip-arrow")},e.prototype.validate=function(){this.$element[0].parentNode||(this.hide(),this.$element=null,this.options=null)},e.prototype.enable=function(){this.enabled=!0},e.prototype.disable=function(){this.enabled=!1},e.prototype.toggleEnabled=function(){this.enabled=!this.enabled},e.prototype.toggle=function(e){var n=e?t(e.currentTarget)[this.type](this.getDelegateOptions()).data("bs."+this.type):this;n.tip().hasClass("in")?n.leave(n):n.enter(n)},e.prototype.destroy=function(){clearTimeout(this.timeout),this.hide().$element.off("."+this.type).removeData("bs."+this.type)};var n=t.fn.tooltip;t.fn.tooltip=function(n){return this.each(function(){var i=t(this),o=i.data("bs.tooltip"),s="object"==typeof n&&n;(o||"destroy"!=n)&&(o||i.data("bs.tooltip",o=new e(this,s)),"string"==typeof n&&o[n]())})},t.fn.tooltip.Constructor=e,t.fn.tooltip.noConflict=function(){return t.fn.tooltip=n,this}}(jQuery),function(t){"use strict";var e=function(t,e){this.init("popover",t,e)};if(!t.fn.tooltip)throw new Error("Popover requires tooltip.js");e.DEFAULTS=t.extend({},t.fn.tooltip.Constructor.DEFAULTS,{placement:"right",trigger:"click",content:"",template:'<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'}),e.prototype=t.extend({},t.fn.tooltip.Constructor.prototype),e.prototype.constructor=e,e.prototype.getDefaults=function(){return e.DEFAULTS},e.prototype.setContent=function(){var t=this.tip(),e=this.getTitle(),n=this.getContent();t.find(".popover-title")[this.options.html?"html":"text"](e),t.find(".popover-content")[this.options.html?"string"==typeof n?"html":"append":"text"](n),t.removeClass("fade top bottom left right in"),t.find(".popover-title").html()||t.find(".popover-title").hide()},e.prototype.hasContent=function(){return this.getTitle()||this.getContent()},e.prototype.getContent=function(){var t=this.$element,e=this.options;return t.attr("data-content")||("function"==typeof e.content?e.content.call(t[0]):e.content)},e.prototype.arrow=function(){return this.$arrow=this.$arrow||this.tip().find(".arrow")},e.prototype.tip=function(){return this.$tip||(this.$tip=t(this.options.template)),this.$tip};var n=t.fn.popover;t.fn.popover=function(n){return this.each(function(){var i=t(this),o=i.data("bs.popover"),s="object"==typeof n&&n;(o||"destroy"!=n)&&(o||i.data("bs.popover",o=new e(this,s)),"string"==typeof n&&o[n]())})},t.fn.popover.Constructor=e,t.fn.popover.noConflict=function(){return t.fn.popover=n,this}}(jQuery),function(t){"use strict";function e(n,i){var o,s=t.proxy(this.process,this);this.$element=t(t(n).is("body")?window:n),this.$body=t("body"),this.$scrollElement=this.$element.on("scroll.bs.scroll-spy.data-api",s),this.options=t.extend({},e.DEFAULTS,i),this.selector=(this.options.target||(o=t(n).attr("href"))&&o.replace(/.*(?=#[^\s]+$)/,"")||"")+" .nav li > a",this.offsets=t([]),this.targets=t([]),this.activeTarget=null,this.refresh(),this.process()}e.DEFAULTS={offset:10},e.prototype.refresh=function(){var e=this.$element[0]==window?"offset":"position";this.offsets=t([]),this.targets=t([]);var n=this;this.$body.find(this.selector).map(function(){var i=t(this),o=i.data("target")||i.attr("href"),s=/^#./.test(o)&&t(o);return s&&s.length&&s.is(":visible")&&[[s[e]().top+(!t.isWindow(n.$scrollElement.get(0))&&n.$scrollElement.scrollTop()),o]]||null}).sort(function(t,e){return t[0]-e[0]}).each(function(){n.offsets.push(this[0]),n.targets.push(this[1])})},e.prototype.process=function(){var t,e=this.$scrollElement.scrollTop()+this.options.offset,n=this.$scrollElement[0].scrollHeight||this.$body[0].scrollHeight,i=n-this.$scrollElement.height(),o=this.offsets,s=this.targets,r=this.activeTarget;if(e>=i)return r!=(t=s.last()[0])&&this.activate(t);if(r&&e<=o[0])return r!=(t=s[0])&&this.activate(t);for(t=o.length;t--;)r!=s[t]&&e>=o[t]&&(!o[t+1]||e<=o[t+1])&&this.activate(s[t])},e.prototype.activate=function(e){this.activeTarget=e,t(this.selector).parentsUntil(this.options.target,".active").removeClass("active");var n=this.selector+'[data-target="'+e+'"],'+this.selector+'[href="'+e+'"]',i=t(n).parents("li").addClass("active");i.parent(".dropdown-menu").length&&(i=i.closest("li.dropdown").addClass("active")),i.trigger("activate.bs.scrollspy")};var n=t.fn.scrollspy;t.fn.scrollspy=function(n){return this.each(function(){var i=t(this),o=i.data("bs.scrollspy"),s="object"==typeof n&&n;o||i.data("bs.scrollspy",o=new e(this,s)),"string"==typeof n&&o[n]()})},t.fn.scrollspy.Constructor=e,t.fn.scrollspy.noConflict=function(){return t.fn.scrollspy=n,this},t(window).on("load",function(){t('[data-spy="scroll"]').each(function(){var e=t(this);e.scrollspy(e.data())})})}(jQuery),function(t){"use strict";var e=function(e){this.element=t(e)};e.prototype.show=function(){var e=this.element,n=e.closest("ul:not(.dropdown-menu)"),i=e.data("target");if(i||(i=e.attr("href"),i=i&&i.replace(/.*(?=#[^\s]*$)/,"")),!e.parent("li").hasClass("active")){var o=n.find(".active:last a")[0],s=t.Event("show.bs.tab",{relatedTarget:o});if(e.trigger(s),!s.isDefaultPrevented()){var r=t(i);this.activate(e.parent("li"),n),this.activate(r,r.parent(),function(){e.trigger({type:"shown.bs.tab",relatedTarget:o})})}}},e.prototype.activate=function(e,n,i){function o(){s.removeClass("active").find("> .dropdown-menu > .active").removeClass("active"),e.addClass("active"),r?(e[0].offsetWidth,e.addClass("in")):e.removeClass("fade"),e.parent(".dropdown-menu")&&e.closest("li.dropdown").addClass("active"),i&&i()}var s=n.find("> .active"),r=i&&t.support.transition&&s.hasClass("fade");r?s.one(t.support.transition.end,o).emulateTransitionEnd(150):o(),s.removeClass("in")};var n=t.fn.tab;t.fn.tab=function(n){return this.each(function(){var i=t(this),o=i.data("bs.tab");o||i.data("bs.tab",o=new e(this)),"string"==typeof n&&o[n]()})},t.fn.tab.Constructor=e,t.fn.tab.noConflict=function(){return t.fn.tab=n,this},t(document).on("click.bs.tab.data-api",'[data-toggle="tab"], [data-toggle="pill"]',function(e){e.preventDefault(),t(this).tab("show")})}(jQuery),function(t){"use strict";var e=function(n,i){this.options=t.extend({},e.DEFAULTS,i),this.$window=t(window).on("scroll.bs.affix.data-api",t.proxy(this.checkPosition,this)).on("click.bs.affix.data-api",t.proxy(this.checkPositionWithEventLoop,this)),this.$element=t(n),this.affixed=this.unpin=this.pinnedOffset=null,this.checkPosition()};e.RESET="affix affix-top affix-bottom",e.DEFAULTS={offset:0},e.prototype.getPinnedOffset=function(){if(this.pinnedOffset)return this.pinnedOffset;this.$element.removeClass(e.RESET).addClass("affix");var t=this.$window.scrollTop(),n=this.$element.offset();return this.pinnedOffset=n.top-t},e.prototype.checkPositionWithEventLoop=function(){setTimeout(t.proxy(this.checkPosition,this),1)},e.prototype.checkPosition=function(){if(this.$element.is(":visible")){var n=t(document).height(),i=this.$window.scrollTop(),o=this.$element.offset(),s=this.options.offset,r=s.top,a=s.bottom;"top"==this.affixed&&(o.top+=i),"object"!=typeof s&&(a=r=s),"function"==typeof r&&(r=s.top(this.$element)),"function"==typeof a&&(a=s.bottom(this.$element));var l=!(null!=this.unpin&&i+this.unpin<=o.top)&&(null!=a&&o.top+this.$element.height()>=n-a?"bottom":null!=r&&r>=i&&"top");if(this.affixed!==l){this.unpin&&this.$element.css("top","");var h="affix"+(l?"-"+l:""),c=t.Event(h+".bs.affix");this.$element.trigger(c),c.isDefaultPrevented()||(this.affixed=l,this.unpin="bottom"==l?this.getPinnedOffset():null,this.$element.removeClass(e.RESET).addClass(h).trigger(t.Event(h.replace("affix","affixed"))),"bottom"==l&&this.$element.offset({top:n-a-this.$element.height()}))}}};var n=t.fn.affix;t.fn.affix=function(n){return this.each(function(){var i=t(this),o=i.data("bs.affix"),s="object"==typeof n&&n;o||i.data("bs.affix",o=new e(this,s)),"string"==typeof n&&o[n]()})},t.fn.affix.Constructor=e,t.fn.affix.noConflict=function(){return t.fn.affix=n,this},t(window).on("load",function(){t('[data-spy="affix"]').each(function(){var e=t(this),n=e.data();n.offset=n.offset||{},n.offsetBottom&&(n.offset.bottom=n.offsetBottom),n.offsetTop&&(n.offset.top=n.offsetTop),e.affix(n)})})}(jQuery),"function"!=typeof Object.create&&(Object.create=function(t){function e(){}return e.prototype=t,new e}),function(t,e,n,i){var o={init:function(e,n){var i=this;i.elem=n,i.$elem=t(n),i.imageSrc=i.$elem.data("zoom-image")?i.$elem.data("zoom-image"):i.$elem.attr("src"),i.options=t.extend({},t.fn.elevateZoom.options,e),i.options.tint&&(i.options.lensColour="none",i.options.lensOpacity="1"),"inner"==i.options.zoomType&&(i.options.showLens=!1),i.$elem.parent().removeAttr("title").removeAttr("alt"),i.zoomImage=i.imageSrc,i.refresh(1),t("#"+i.options.gallery+" a").click(function(e){return i.options.galleryActiveClass&&(t("#"+i.options.gallery+" a").removeClass(i.options.galleryActiveClass),t(this).addClass(i.options.galleryActiveClass)),e.preventDefault(),t(this).data("zoom-image")?i.zoomImagePre=t(this).data("zoom-image"):i.zoomImagePre=t(this).data("image"),i.swaptheimage(t(this).data("image"),i.zoomImagePre),!1})},refresh:function(t){var e=this;setTimeout(function(){e.fetch(e.imageSrc)},t||e.options.refresh)},fetch:function(t){var e=this,n=new Image;n.onload=function(){e.largeWidth=n.width,e.largeHeight=n.height,e.startZoom(),e.currentImage=e.imageSrc,e.options.onZoomedImageLoaded(e.$elem)},n.src=t},startZoom:function(){var e=this;if(e.nzWidth=e.$elem.width(),e.nzHeight=e.$elem.height(),e.isWindowActive=!1,e.isLensActive=!1,e.isTintActive=!1,e.overWindow=!1,e.options.imageCrossfade&&(e.zoomWrap=e.$elem.wrap('<div style="height:'+e.nzHeight+"px;width:"+e.nzWidth+'px;" class="zoomWrapper" />'),e.$elem.css("position","absolute")),e.zoomLock=1,e.scrollingLock=!1,e.changeBgSize=!1,e.currentZoomLevel=e.options.zoomLevel,e.nzOffset=e.$elem.offset(),e.widthRatio=e.largeWidth/e.currentZoomLevel/e.nzWidth,e.heightRatio=e.largeHeight/e.currentZoomLevel/e.nzHeight,"window"==e.options.zoomType&&(e.zoomWindowStyle="overflow: hidden;background-position: 0px 0px;text-align:center;background-color: "+String(e.options.zoomWindowBgColour)+";width: "+String(e.options.zoomWindowWidth)+"px;height: "+String(e.options.zoomWindowHeight)+"px;float: left;background-size: "+e.largeWidth/e.currentZoomLevel+"px "+e.largeHeight/e.currentZoomLevel+"px;display: none;z-index:100;border: "+String(e.options.borderSize)+"px solid "+e.options.borderColour+";background-repeat: no-repeat;position: absolute;"),"inner"==e.options.zoomType){var n=e.$elem.css("border-left-width");e.zoomWindowStyle="overflow: hidden;margin-left: "+String(n)+";margin-top: "+String(n)+";background-position: 0px 0px;width: "+String(e.nzWidth)+"px;height: "+String(e.nzHeight)+"px;float: left;display: none;cursor:"+e.options.cursor+";px solid "+e.options.borderColour+";background-repeat: no-repeat;position: absolute;"}"window"==e.options.zoomType&&(lensHeight=e.nzHeight<e.options.zoomWindowWidth/e.widthRatio?e.nzHeight:String(e.options.zoomWindowHeight/e.heightRatio),lensWidth=e.largeWidth<e.options.zoomWindowWidth?e.nzWidth:e.options.zoomWindowWidth/e.widthRatio,e.lensStyle="background-position: 0px 0px;width: "+String(e.options.zoomWindowWidth/e.widthRatio)+"px;height: "+String(e.options.zoomWindowHeight/e.heightRatio)+"px;float: right;display: none;overflow: hidden;z-index: 999;-webkit-transform: translateZ(0);opacity:"+e.options.lensOpacity+";filter: alpha(opacity = "+100*e.options.lensOpacity+"); zoom:1;width:"+lensWidth+"px;height:"+lensHeight+"px;background-color:"+e.options.lensColour+";cursor:"+e.options.cursor+";border: "+e.options.lensBorderSize+"px solid "+e.options.lensBorderColour+";background-repeat: no-repeat;position: absolute;"),e.tintStyle="display: block;position: absolute;background-color: "+e.options.tintColour+";filter:alpha(opacity=0);opacity: 0;width: "+e.nzWidth+"px;height: "+e.nzHeight+"px;",e.lensRound="","lens"==e.options.zoomType&&(e.lensStyle="background-position: 0px 0px;float: left;display: none;border: "+String(e.options.borderSize)+"px solid "+e.options.borderColour+";width:"+String(e.options.lensSize)+"px;height:"+String(e.options.lensSize)+"px;background-repeat: no-repeat;position: absolute;"),"round"==e.options.lensShape&&(e.lensRound="border-top-left-radius: "+String(e.options.lensSize/2+e.options.borderSize)+"px;border-top-right-radius: "+String(e.options.lensSize/2+e.options.borderSize)+"px;border-bottom-left-radius: "+String(e.options.lensSize/2+e.options.borderSize)+"px;border-bottom-right-radius: "+String(e.options.lensSize/2+e.options.borderSize)+"px;"),e.zoomContainer=t('<div class="zoomContainer" style="-webkit-transform: translateZ(0);position:absolute;left:'+e.nzOffset.left+"px;top:"+e.nzOffset.top+"px;height:"+e.nzHeight+"px;width:"+e.nzWidth+'px;"></div>'),t("body").append(e.zoomContainer),e.options.containLensZoom&&"lens"==e.options.zoomType&&e.zoomContainer.css("overflow","hidden"),"inner"!=e.options.zoomType&&(e.zoomLens=t("<div class='zoomLens' style='"+e.lensStyle+e.lensRound+"'>&nbsp;</div>").appendTo(e.zoomContainer).click(function(){e.$elem.trigger("click")}),e.options.tint&&(e.tintContainer=t("<div/>").addClass("tintContainer"),
e.zoomTint=t("<div class='zoomTint' style='"+e.tintStyle+"'></div>"),e.zoomLens.wrap(e.tintContainer),e.zoomTintcss=e.zoomLens.after(e.zoomTint),e.zoomTintImage=t('<img style="position: absolute; left: 0px; top: 0px; max-width: none; width: '+e.nzWidth+"px; height: "+e.nzHeight+'px;" src="'+e.imageSrc+'">').appendTo(e.zoomLens).click(function(){e.$elem.trigger("click")}))),isNaN(e.options.zoomWindowPosition)?e.zoomWindow=t("<div style='z-index:999;left:"+e.windowOffsetLeft+"px;top:"+e.windowOffsetTop+"px;"+e.zoomWindowStyle+"' class='zoomWindow'>&nbsp;</div>").appendTo("body").click(function(){e.$elem.trigger("click")}):e.zoomWindow=t("<div style='z-index:999;left:"+e.windowOffsetLeft+"px;top:"+e.windowOffsetTop+"px;"+e.zoomWindowStyle+"' class='zoomWindow'>&nbsp;</div>").appendTo(e.zoomContainer).click(function(){e.$elem.trigger("click")}),e.zoomWindowContainer=t("<div/>").addClass("zoomWindowContainer").css("width",e.options.zoomWindowWidth),e.zoomWindow.wrap(e.zoomWindowContainer),"lens"==e.options.zoomType&&e.zoomLens.css({backgroundImage:"url('"+e.imageSrc+"')"}),"window"==e.options.zoomType&&e.zoomWindow.css({backgroundImage:"url('"+e.imageSrc+"')"}),"inner"==e.options.zoomType&&e.zoomWindow.css({backgroundImage:"url('"+e.imageSrc+"')"}),e.$elem.bind("touchmove",function(t){t.preventDefault(),e.setPosition(t.originalEvent.touches[0]||t.originalEvent.changedTouches[0])}),e.zoomContainer.bind("touchmove",function(t){"inner"==e.options.zoomType&&e.showHideWindow("show"),t.preventDefault(),e.setPosition(t.originalEvent.touches[0]||t.originalEvent.changedTouches[0])}),e.zoomContainer.bind("touchend",function(t){e.showHideWindow("hide"),e.options.showLens&&e.showHideLens("hide"),e.options.tint&&"inner"!=e.options.zoomType&&e.showHideTint("hide")}),e.$elem.bind("touchend",function(t){e.showHideWindow("hide"),e.options.showLens&&e.showHideLens("hide"),e.options.tint&&"inner"!=e.options.zoomType&&e.showHideTint("hide")}),e.options.showLens&&(e.zoomLens.bind("touchmove",function(t){t.preventDefault(),e.setPosition(t.originalEvent.touches[0]||t.originalEvent.changedTouches[0])}),e.zoomLens.bind("touchend",function(t){e.showHideWindow("hide"),e.options.showLens&&e.showHideLens("hide"),e.options.tint&&"inner"!=e.options.zoomType&&e.showHideTint("hide")})),e.$elem.bind("mousemove",function(t){0==e.overWindow&&e.setElements("show"),e.lastX===t.clientX&&e.lastY===t.clientY||(e.setPosition(t),e.currentLoc=t),e.lastX=t.clientX,e.lastY=t.clientY}),e.zoomContainer.bind("mousemove",function(t){0==e.overWindow&&e.setElements("show"),e.lastX===t.clientX&&e.lastY===t.clientY||(e.setPosition(t),e.currentLoc=t),e.lastX=t.clientX,e.lastY=t.clientY}),"inner"!=e.options.zoomType&&e.zoomLens.bind("mousemove",function(t){e.lastX===t.clientX&&e.lastY===t.clientY||(e.setPosition(t),e.currentLoc=t),e.lastX=t.clientX,e.lastY=t.clientY}),e.options.tint&&"inner"!=e.options.zoomType&&e.zoomTint.bind("mousemove",function(t){e.lastX===t.clientX&&e.lastY===t.clientY||(e.setPosition(t),e.currentLoc=t),e.lastX=t.clientX,e.lastY=t.clientY}),"inner"==e.options.zoomType&&e.zoomWindow.bind("mousemove",function(t){e.lastX===t.clientX&&e.lastY===t.clientY||(e.setPosition(t),e.currentLoc=t),e.lastX=t.clientX,e.lastY=t.clientY}),e.zoomContainer.add(e.$elem).mouseenter(function(){0==e.overWindow&&e.setElements("show")}).mouseleave(function(){e.scrollLock||e.setElements("hide")}),"inner"!=e.options.zoomType&&e.zoomWindow.mouseenter(function(){e.overWindow=!0,e.setElements("hide")}).mouseleave(function(){e.overWindow=!1}),e.minZoomLevel=e.options.minZoomLevel?e.options.minZoomLevel:2*e.options.scrollZoomIncrement,e.options.scrollZoom&&e.zoomContainer.add(e.$elem).bind("mousewheel DOMMouseScroll MozMousePixelScroll",function(n){e.scrollLock=!0,clearTimeout(t.data(this,"timer")),t.data(this,"timer",setTimeout(function(){e.scrollLock=!1},250));var i=n.originalEvent.wheelDelta||-1*n.originalEvent.detail;return n.stopImmediatePropagation(),n.stopPropagation(),n.preventDefault(),0<i/120?e.currentZoomLevel>=e.minZoomLevel&&e.changeZoomLevel(e.currentZoomLevel-e.options.scrollZoomIncrement):e.options.maxZoomLevel?e.currentZoomLevel<=e.options.maxZoomLevel&&e.changeZoomLevel(parseFloat(e.currentZoomLevel)+e.options.scrollZoomIncrement):e.changeZoomLevel(parseFloat(e.currentZoomLevel)+e.options.scrollZoomIncrement),!1})},setElements:function(t){if(!this.options.zoomEnabled)return!1;"show"==t&&this.isWindowSet&&("inner"==this.options.zoomType&&this.showHideWindow("show"),"window"==this.options.zoomType&&this.showHideWindow("show"),this.options.showLens&&this.showHideLens("show"),this.options.tint&&"inner"!=this.options.zoomType&&this.showHideTint("show")),"hide"==t&&("window"==this.options.zoomType&&this.showHideWindow("hide"),this.options.tint||this.showHideWindow("hide"),this.options.showLens&&this.showHideLens("hide"),this.options.tint&&this.showHideTint("hide"))},setPosition:function(t){if(!this.options.zoomEnabled)return!1;this.nzHeight=this.$elem.height(),this.nzWidth=this.$elem.width(),this.nzOffset=this.$elem.offset(),this.options.tint&&"inner"!=this.options.zoomType&&(this.zoomTint.css({top:0}),this.zoomTint.css({left:0})),this.options.responsive&&!this.options.scrollZoom&&this.options.showLens&&(lensHeight=this.nzHeight<this.options.zoomWindowWidth/this.widthRatio?this.nzHeight:String(this.options.zoomWindowHeight/this.heightRatio),lensWidth=this.largeWidth<this.options.zoomWindowWidth?this.nzWidth:this.options.zoomWindowWidth/this.widthRatio,this.widthRatio=this.largeWidth/this.nzWidth,this.heightRatio=this.largeHeight/this.nzHeight,"lens"!=this.options.zoomType&&(lensHeight=this.nzHeight<this.options.zoomWindowWidth/this.widthRatio?this.nzHeight:String(this.options.zoomWindowHeight/this.heightRatio),lensWidth=this.options.zoomWindowWidth<this.options.zoomWindowWidth?this.nzWidth:this.options.zoomWindowWidth/this.widthRatio,this.zoomLens.css("width",lensWidth),this.zoomLens.css("height",lensHeight),this.options.tint&&(this.zoomTintImage.css("width",this.nzWidth),this.zoomTintImage.css("height",this.nzHeight))),"lens"==this.options.zoomType&&this.zoomLens.css({width:String(this.options.lensSize)+"px",height:String(this.options.lensSize)+"px"})),this.zoomContainer.css({top:this.nzOffset.top}),this.zoomContainer.css({left:this.nzOffset.left}),this.mouseLeft=parseInt(t.pageX-this.nzOffset.left),this.mouseTop=parseInt(t.pageY-this.nzOffset.top),"window"==this.options.zoomType&&(this.Etoppos=this.mouseTop<this.zoomLens.height()/2,this.Eboppos=this.mouseTop>this.nzHeight-this.zoomLens.height()/2-2*this.options.lensBorderSize,this.Eloppos=this.mouseLeft<0+this.zoomLens.width()/2,this.Eroppos=this.mouseLeft>this.nzWidth-this.zoomLens.width()/2-2*this.options.lensBorderSize),"inner"==this.options.zoomType&&(this.Etoppos=this.mouseTop<this.nzHeight/2/this.heightRatio,this.Eboppos=this.mouseTop>this.nzHeight-this.nzHeight/2/this.heightRatio,this.Eloppos=this.mouseLeft<0+this.nzWidth/2/this.widthRatio,this.Eroppos=this.mouseLeft>this.nzWidth-this.nzWidth/2/this.widthRatio-2*this.options.lensBorderSize),0>=this.mouseLeft||0>this.mouseTop||this.mouseLeft>this.nzWidth||this.mouseTop>this.nzHeight?this.setElements("hide"):(this.options.showLens&&(this.lensLeftPos=String(this.mouseLeft-this.zoomLens.width()/2),this.lensTopPos=String(this.mouseTop-this.zoomLens.height()/2)),this.Etoppos&&(this.lensTopPos=0),this.Eloppos&&(this.tintpos=this.lensLeftPos=this.windowLeftPos=0),"window"==this.options.zoomType&&(this.Eboppos&&(this.lensTopPos=Math.max(this.nzHeight-this.zoomLens.height()-2*this.options.lensBorderSize,0)),this.Eroppos&&(this.lensLeftPos=this.nzWidth-this.zoomLens.width()-2*this.options.lensBorderSize)),"inner"==this.options.zoomType&&(this.Eboppos&&(this.lensTopPos=Math.max(this.nzHeight-2*this.options.lensBorderSize,0)),this.Eroppos&&(this.lensLeftPos=this.nzWidth-this.nzWidth-2*this.options.lensBorderSize)),"lens"==this.options.zoomType&&(this.windowLeftPos=String(-1*((t.pageX-this.nzOffset.left)*this.widthRatio-this.zoomLens.width()/2)),this.windowTopPos=String(-1*((t.pageY-this.nzOffset.top)*this.heightRatio-this.zoomLens.height()/2)),this.zoomLens.css({backgroundPosition:this.windowLeftPos+"px "+this.windowTopPos+"px"}),this.changeBgSize&&(this.nzHeight>this.nzWidth?("lens"==this.options.zoomType&&this.zoomLens.css({"background-size":this.largeWidth/this.newvalueheight+"px "+this.largeHeight/this.newvalueheight+"px"}),this.zoomWindow.css({"background-size":this.largeWidth/this.newvalueheight+"px "+this.largeHeight/this.newvalueheight+"px"})):("lens"==this.options.zoomType&&this.zoomLens.css({"background-size":this.largeWidth/this.newvaluewidth+"px "+this.largeHeight/this.newvaluewidth+"px"}),this.zoomWindow.css({"background-size":this.largeWidth/this.newvaluewidth+"px "+this.largeHeight/this.newvaluewidth+"px"})),this.changeBgSize=!1),this.setWindowPostition(t)),this.options.tint&&"inner"!=this.options.zoomType&&this.setTintPosition(t),"window"==this.options.zoomType&&this.setWindowPostition(t),"inner"==this.options.zoomType&&this.setWindowPostition(t),this.options.showLens&&(this.fullwidth&&"lens"!=this.options.zoomType&&(this.lensLeftPos=0),this.zoomLens.css({left:this.lensLeftPos+"px",top:this.lensTopPos+"px"})))},showHideWindow:function(t){"show"!=t||this.isWindowActive||(this.options.zoomWindowFadeIn?this.zoomWindow.stop(!0,!0,!1).fadeIn(this.options.zoomWindowFadeIn):this.zoomWindow.show(),this.isWindowActive=!0),"hide"==t&&this.isWindowActive&&(this.options.zoomWindowFadeOut?this.zoomWindow.stop(!0,!0).fadeOut(this.options.zoomWindowFadeOut):this.zoomWindow.hide(),this.isWindowActive=!1)},showHideLens:function(t){"show"!=t||this.isLensActive||(this.options.lensFadeIn?this.zoomLens.stop(!0,!0,!1).fadeIn(this.options.lensFadeIn):this.zoomLens.show(),this.isLensActive=!0),"hide"==t&&this.isLensActive&&(this.options.lensFadeOut?this.zoomLens.stop(!0,!0).fadeOut(this.options.lensFadeOut):this.zoomLens.hide(),this.isLensActive=!1)},showHideTint:function(t){"show"!=t||this.isTintActive||(this.options.zoomTintFadeIn?this.zoomTint.css({opacity:this.options.tintOpacity}).animate().stop(!0,!0).fadeIn("slow"):(this.zoomTint.css({opacity:this.options.tintOpacity}).animate(),this.zoomTint.show()),this.isTintActive=!0),"hide"==t&&this.isTintActive&&(this.options.zoomTintFadeOut?this.zoomTint.stop(!0,!0).fadeOut(this.options.zoomTintFadeOut):this.zoomTint.hide(),this.isTintActive=!1)},setLensPostition:function(t){},setWindowPostition:function(e){var n=this;if(isNaN(n.options.zoomWindowPosition))n.externalContainer=t("#"+n.options.zoomWindowPosition),n.externalContainerWidth=n.externalContainer.width(),n.externalContainerHeight=n.externalContainer.height(),n.externalContainerOffset=n.externalContainer.offset(),n.windowOffsetTop=n.externalContainerOffset.top,n.windowOffsetLeft=n.externalContainerOffset.left;else switch(n.options.zoomWindowPosition){case 1:n.windowOffsetTop=n.options.zoomWindowOffety,n.windowOffsetLeft=+n.nzWidth;break;case 2:n.options.zoomWindowHeight>n.nzHeight&&(n.windowOffsetTop=-1*(n.options.zoomWindowHeight/2-n.nzHeight/2),n.windowOffsetLeft=n.nzWidth);break;case 3:n.windowOffsetTop=n.nzHeight-n.zoomWindow.height()-2*n.options.borderSize,n.windowOffsetLeft=n.nzWidth;break;case 4:n.windowOffsetTop=n.nzHeight,n.windowOffsetLeft=n.nzWidth;break;case 5:n.windowOffsetTop=n.nzHeight,n.windowOffsetLeft=n.nzWidth-n.zoomWindow.width()-2*n.options.borderSize;break;case 6:n.options.zoomWindowHeight>n.nzHeight&&(n.windowOffsetTop=n.nzHeight,n.windowOffsetLeft=-1*(n.options.zoomWindowWidth/2-n.nzWidth/2+2*n.options.borderSize));break;case 7:n.windowOffsetTop=n.nzHeight,n.windowOffsetLeft=0;break;case 8:n.windowOffsetTop=n.nzHeight,n.windowOffsetLeft=-1*(n.zoomWindow.width()+2*n.options.borderSize);break;case 9:n.windowOffsetTop=n.nzHeight-n.zoomWindow.height()-2*n.options.borderSize,n.windowOffsetLeft=-1*(n.zoomWindow.width()+2*n.options.borderSize);break;case 10:n.options.zoomWindowHeight>n.nzHeight&&(n.windowOffsetTop=-1*(n.options.zoomWindowHeight/2-n.nzHeight/2),n.windowOffsetLeft=-1*(n.zoomWindow.width()+2*n.options.borderSize));break;case 11:n.windowOffsetTop=n.options.zoomWindowOffety,n.windowOffsetLeft=-1*(n.zoomWindow.width()+2*n.options.borderSize);break;case 12:n.windowOffsetTop=-1*(n.zoomWindow.height()+2*n.options.borderSize),n.windowOffsetLeft=-1*(n.zoomWindow.width()+2*n.options.borderSize);break;case 13:n.windowOffsetTop=-1*(n.zoomWindow.height()+2*n.options.borderSize),n.windowOffsetLeft=0;break;case 14:n.options.zoomWindowHeight>n.nzHeight&&(n.windowOffsetTop=-1*(n.zoomWindow.height()+2*n.options.borderSize),n.windowOffsetLeft=-1*(n.options.zoomWindowWidth/2-n.nzWidth/2+2*n.options.borderSize));break;case 15:n.windowOffsetTop=-1*(n.zoomWindow.height()+2*n.options.borderSize),n.windowOffsetLeft=n.nzWidth-n.zoomWindow.width()-2*n.options.borderSize;break;case 16:n.windowOffsetTop=-1*(n.zoomWindow.height()+2*n.options.borderSize),n.windowOffsetLeft=n.nzWidth;break;default:n.windowOffsetTop=n.options.zoomWindowOffety,n.windowOffsetLeft=n.nzWidth}n.isWindowSet=!0,n.windowOffsetTop+=n.options.zoomWindowOffety,n.windowOffsetLeft+=n.options.zoomWindowOffetx,n.zoomWindow.css({top:n.windowOffsetTop}),n.zoomWindow.css({left:n.windowOffsetLeft}),"inner"==n.options.zoomType&&(n.zoomWindow.css({top:0}),n.zoomWindow.css({left:0})),n.windowLeftPos=String(-1*((e.pageX-n.nzOffset.left)*n.widthRatio-n.zoomWindow.width()/2)),n.windowTopPos=String(-1*((e.pageY-n.nzOffset.top)*n.heightRatio-n.zoomWindow.height()/2)),n.Etoppos&&(n.windowTopPos=0),n.Eloppos&&(n.windowLeftPos=0),n.Eboppos&&(n.windowTopPos=-1*(n.largeHeight/n.currentZoomLevel-n.zoomWindow.height())),n.Eroppos&&(n.windowLeftPos=-1*(n.largeWidth/n.currentZoomLevel-n.zoomWindow.width())),n.fullheight&&(n.windowTopPos=0),n.fullwidth&&(n.windowLeftPos=0),"window"!=n.options.zoomType&&"inner"!=n.options.zoomType||(1==n.zoomLock&&(1>=n.widthRatio&&(n.windowLeftPos=0),1>=n.heightRatio&&(n.windowTopPos=0)),n.largeHeight<n.options.zoomWindowHeight&&(n.windowTopPos=0),n.largeWidth<n.options.zoomWindowWidth&&(n.windowLeftPos=0),n.options.easing?(n.xp||(n.xp=0),n.yp||(n.yp=0),n.loop||(n.loop=setInterval(function(){n.xp+=(n.windowLeftPos-n.xp)/n.options.easingAmount,n.yp+=(n.windowTopPos-n.yp)/n.options.easingAmount,n.scrollingLock?(clearInterval(n.loop),n.xp=n.windowLeftPos,n.yp=n.windowTopPos,n.xp=-1*((e.pageX-n.nzOffset.left)*n.widthRatio-n.zoomWindow.width()/2),n.yp=-1*((e.pageY-n.nzOffset.top)*n.heightRatio-n.zoomWindow.height()/2),n.changeBgSize&&(n.nzHeight>n.nzWidth?("lens"==n.options.zoomType&&n.zoomLens.css({"background-size":n.largeWidth/n.newvalueheight+"px "+n.largeHeight/n.newvalueheight+"px"}),n.zoomWindow.css({"background-size":n.largeWidth/n.newvalueheight+"px "+n.largeHeight/n.newvalueheight+"px"})):("lens"!=n.options.zoomType&&n.zoomLens.css({"background-size":n.largeWidth/n.newvaluewidth+"px "+n.largeHeight/n.newvalueheight+"px"}),n.zoomWindow.css({"background-size":n.largeWidth/n.newvaluewidth+"px "+n.largeHeight/n.newvaluewidth+"px"})),n.changeBgSize=!1),n.zoomWindow.css({backgroundPosition:n.windowLeftPos+"px "+n.windowTopPos+"px"}),n.scrollingLock=!1,n.loop=!1):(n.changeBgSize&&(n.nzHeight>n.nzWidth?("lens"==n.options.zoomType&&n.zoomLens.css({"background-size":n.largeWidth/n.newvalueheight+"px "+n.largeHeight/n.newvalueheight+"px"}),n.zoomWindow.css({"background-size":n.largeWidth/n.newvalueheight+"px "+n.largeHeight/n.newvalueheight+"px"})):("lens"!=n.options.zoomType&&n.zoomLens.css({"background-size":n.largeWidth/n.newvaluewidth+"px "+n.largeHeight/n.newvaluewidth+"px"}),n.zoomWindow.css({"background-size":n.largeWidth/n.newvaluewidth+"px "+n.largeHeight/n.newvaluewidth+"px"})),n.changeBgSize=!1),n.zoomWindow.css({backgroundPosition:n.xp+"px "+n.yp+"px"}))},16))):(n.changeBgSize&&(n.nzHeight>n.nzWidth?("lens"==n.options.zoomType&&n.zoomLens.css({"background-size":n.largeWidth/n.newvalueheight+"px "+n.largeHeight/n.newvalueheight+"px"}),n.zoomWindow.css({"background-size":n.largeWidth/n.newvalueheight+"px "+n.largeHeight/n.newvalueheight+"px"})):("lens"==n.options.zoomType&&n.zoomLens.css({"background-size":n.largeWidth/n.newvaluewidth+"px "+n.largeHeight/n.newvaluewidth+"px"}),n.largeHeight/n.newvaluewidth<n.options.zoomWindowHeight?n.zoomWindow.css({"background-size":n.largeWidth/n.newvaluewidth+"px "+n.largeHeight/n.newvaluewidth+"px"}):n.zoomWindow.css({"background-size":n.largeWidth/n.newvalueheight+"px "+n.largeHeight/n.newvalueheight+"px"})),n.changeBgSize=!1),n.zoomWindow.css({backgroundPosition:n.windowLeftPos+"px "+n.windowTopPos+"px"})))},setTintPosition:function(t){this.nzOffset=this.$elem.offset(),this.tintpos=String(-1*(t.pageX-this.nzOffset.left-this.zoomLens.width()/2)),this.tintposy=String(-1*(t.pageY-this.nzOffset.top-this.zoomLens.height()/2)),this.Etoppos&&(this.tintposy=0),this.Eloppos&&(this.tintpos=0),this.Eboppos&&(this.tintposy=-1*(this.nzHeight-this.zoomLens.height()-2*this.options.lensBorderSize)),this.Eroppos&&(this.tintpos=-1*(this.nzWidth-this.zoomLens.width()-2*this.options.lensBorderSize)),this.options.tint&&(this.fullheight&&(this.tintposy=0),this.fullwidth&&(this.tintpos=0),this.zoomTintImage.css({left:this.tintpos+"px"}),this.zoomTintImage.css({top:this.tintposy+"px"}))},swaptheimage:function(e,n){var i=this,o=new Image;i.options.loadingIcon&&(i.spinner=t("<div style=\"background: url('"+i.options.loadingIcon+"') no-repeat center;height:"+i.nzHeight+"px;width:"+i.nzWidth+'px;z-index: 2000;position: absolute; background-position: center center;"></div>'),i.$elem.after(i.spinner)),i.options.onImageSwap(i.$elem),o.onload=function(){i.largeWidth=o.width,i.largeHeight=o.height,i.zoomImage=n,i.zoomWindow.css({"background-size":i.largeWidth+"px "+i.largeHeight+"px"}),i.zoomWindow.css({"background-size":i.largeWidth+"px "+i.largeHeight+"px"}),i.swapAction(e,n)},o.src=n},swapAction:function(e,n){var i=this,o=new Image;if(o.onload=function(){i.nzHeight=o.height,i.nzWidth=o.width,i.options.onImageSwapComplete(i.$elem),i.doneCallback()},o.src=e,i.currentZoomLevel=i.options.zoomLevel,i.options.maxZoomLevel=!1,"lens"==i.options.zoomType&&i.zoomLens.css({backgroundImage:"url('"+n+"')"}),"window"==i.options.zoomType&&i.zoomWindow.css({backgroundImage:"url('"+n+"')"}),"inner"==i.options.zoomType&&i.zoomWindow.css({backgroundImage:"url('"+n+"')"}),i.currentImage=n,i.options.imageCrossfade){var s=i.$elem,r=s.clone();i.$elem.attr("src",e),i.$elem.after(r),r.stop(!0).fadeOut(i.options.imageCrossfade,function(){t(this).remove()}),i.$elem.width("auto").removeAttr("width"),i.$elem.height("auto").removeAttr("height"),s.fadeIn(i.options.imageCrossfade),i.options.tint&&"inner"!=i.options.zoomType&&(s=i.zoomTintImage,r=s.clone(),i.zoomTintImage.attr("src",n),i.zoomTintImage.after(r),r.stop(!0).fadeOut(i.options.imageCrossfade,function(){t(this).remove()}),s.fadeIn(i.options.imageCrossfade),i.zoomTint.css({height:i.$elem.height()}),i.zoomTint.css({width:i.$elem.width()})),i.zoomContainer.css("height",i.$elem.height()),i.zoomContainer.css("width",i.$elem.width()),"inner"!=i.options.zoomType||i.options.constrainType||(i.zoomWrap.parent().css("height",i.$elem.height()),i.zoomWrap.parent().css("width",i.$elem.width()),i.zoomWindow.css("height",i.$elem.height()),i.zoomWindow.css("width",i.$elem.width()))}else i.$elem.attr("src",e),i.options.tint&&(i.zoomTintImage.attr("src",n),i.zoomTintImage.attr("height",i.$elem.height()),i.zoomTintImage.css({height:i.$elem.height()}),i.zoomTint.css({height:i.$elem.height()})),i.zoomContainer.css("height",i.$elem.height()),i.zoomContainer.css("width",i.$elem.width());i.options.imageCrossfade&&(i.zoomWrap.css("height",i.$elem.height()),i.zoomWrap.css("width",i.$elem.width())),i.options.constrainType&&("height"==i.options.constrainType&&(i.zoomContainer.css("height",i.options.constrainSize),i.zoomContainer.css("width","auto"),i.options.imageCrossfade?(i.zoomWrap.css("height",i.options.constrainSize),i.zoomWrap.css("width","auto"),i.constwidth=i.zoomWrap.width()):(i.$elem.css("height",i.options.constrainSize),i.$elem.css("width","auto"),i.constwidth=i.$elem.width()),"inner"==i.options.zoomType&&(i.zoomWrap.parent().css("height",i.options.constrainSize),i.zoomWrap.parent().css("width",i.constwidth),i.zoomWindow.css("height",i.options.constrainSize),i.zoomWindow.css("width",i.constwidth)),i.options.tint&&(i.tintContainer.css("height",i.options.constrainSize),i.tintContainer.css("width",i.constwidth),i.zoomTint.css("height",i.options.constrainSize),i.zoomTint.css("width",i.constwidth),i.zoomTintImage.css("height",i.options.constrainSize),i.zoomTintImage.css("width",i.constwidth))),"width"==i.options.constrainType&&(i.zoomContainer.css("height","auto"),i.zoomContainer.css("width",i.options.constrainSize),i.options.imageCrossfade?(i.zoomWrap.css("height","auto"),i.zoomWrap.css("width",i.options.constrainSize),i.constheight=i.zoomWrap.height()):(i.$elem.css("height","auto"),i.$elem.css("width",i.options.constrainSize),i.constheight=i.$elem.height()),"inner"==i.options.zoomType&&(i.zoomWrap.parent().css("height",i.constheight),i.zoomWrap.parent().css("width",i.options.constrainSize),i.zoomWindow.css("height",i.constheight),i.zoomWindow.css("width",i.options.constrainSize)),i.options.tint&&(i.tintContainer.css("height",i.constheight),i.tintContainer.css("width",i.options.constrainSize),i.zoomTint.css("height",i.constheight),i.zoomTint.css("width",i.options.constrainSize),i.zoomTintImage.css("height",i.constheight),i.zoomTintImage.css("width",i.options.constrainSize))))},doneCallback:function(){this.options.loadingIcon&&this.spinner.hide(),this.nzOffset=this.$elem.offset(),this.nzWidth=this.$elem.width(),this.nzHeight=this.$elem.height(),this.currentZoomLevel=this.options.zoomLevel,this.widthRatio=this.largeWidth/this.nzWidth,this.heightRatio=this.largeHeight/this.nzHeight,"window"==this.options.zoomType&&(lensHeight=this.nzHeight<this.options.zoomWindowWidth/this.widthRatio?this.nzHeight:String(this.options.zoomWindowHeight/this.heightRatio),lensWidth=this.options.zoomWindowWidth<this.options.zoomWindowWidth?this.nzWidth:this.options.zoomWindowWidth/this.widthRatio,this.zoomLens&&(this.zoomLens.css("width",lensWidth),this.zoomLens.css("height",lensHeight)))},getCurrentImage:function(){return this.zoomImage},getGalleryList:function(){var e=this;return e.gallerylist=[],e.options.gallery?t("#"+e.options.gallery+" a").each(function(){var n="";t(this).data("zoom-image")?n=t(this).data("zoom-image"):t(this).data("image")&&(n=t(this).data("image")),n==e.zoomImage?e.gallerylist.unshift({href:""+n,title:t(this).find("img").attr("title")}):e.gallerylist.push({href:""+n,title:t(this).find("img").attr("title")})}):e.gallerylist.push({href:""+e.zoomImage,title:t(this).find("img").attr("title")}),e.gallerylist},changeZoomLevel:function(t){this.scrollingLock=!0,this.newvalue=parseFloat(t).toFixed(2),newvalue=parseFloat(t).toFixed(2),maxheightnewvalue=this.largeHeight/(this.options.zoomWindowHeight/this.nzHeight*this.nzHeight),maxwidthtnewvalue=this.largeWidth/(this.options.zoomWindowWidth/this.nzWidth*this.nzWidth),"inner"!=this.options.zoomType&&(maxheightnewvalue<=newvalue?(this.heightRatio=this.largeHeight/maxheightnewvalue/this.nzHeight,this.newvalueheight=maxheightnewvalue,this.fullheight=!0):(this.heightRatio=this.largeHeight/newvalue/this.nzHeight,this.newvalueheight=newvalue,this.fullheight=!1),maxwidthtnewvalue<=newvalue?(this.widthRatio=this.largeWidth/maxwidthtnewvalue/this.nzWidth,this.newvaluewidth=maxwidthtnewvalue,this.fullwidth=!0):(this.widthRatio=this.largeWidth/newvalue/this.nzWidth,this.newvaluewidth=newvalue,this.fullwidth=!1),"lens"==this.options.zoomType&&(maxheightnewvalue<=newvalue?(this.fullwidth=!0,this.newvaluewidth=maxheightnewvalue):(this.widthRatio=this.largeWidth/newvalue/this.nzWidth,this.newvaluewidth=newvalue,this.fullwidth=!1))),"inner"==this.options.zoomType&&(maxheightnewvalue=parseFloat(this.largeHeight/this.nzHeight).toFixed(2),maxwidthtnewvalue=parseFloat(this.largeWidth/this.nzWidth).toFixed(2),newvalue>maxheightnewvalue&&(newvalue=maxheightnewvalue),newvalue>maxwidthtnewvalue&&(newvalue=maxwidthtnewvalue),maxheightnewvalue<=newvalue?(this.heightRatio=this.largeHeight/newvalue/this.nzHeight,this.newvalueheight=newvalue>maxheightnewvalue?maxheightnewvalue:newvalue,this.fullheight=!0):(this.heightRatio=this.largeHeight/newvalue/this.nzHeight,this.newvalueheight=newvalue>maxheightnewvalue?maxheightnewvalue:newvalue,this.fullheight=!1),maxwidthtnewvalue<=newvalue?(this.widthRatio=this.largeWidth/newvalue/this.nzWidth,this.newvaluewidth=newvalue>maxwidthtnewvalue?maxwidthtnewvalue:newvalue,this.fullwidth=!0):(this.widthRatio=this.largeWidth/newvalue/this.nzWidth,this.newvaluewidth=newvalue,this.fullwidth=!1)),scrcontinue=!1,"inner"==this.options.zoomType&&(this.nzWidth>this.nzHeight&&(this.newvaluewidth<=maxwidthtnewvalue?scrcontinue=!0:(scrcontinue=!1,this.fullwidth=this.fullheight=!0)),this.nzHeight>this.nzWidth&&(this.newvaluewidth<=maxwidthtnewvalue?scrcontinue=!0:(scrcontinue=!1,this.fullwidth=this.fullheight=!0))),"inner"!=this.options.zoomType&&(scrcontinue=!0),scrcontinue&&(this.zoomLock=0,this.changeZoom=!0,this.options.zoomWindowHeight/this.heightRatio<=this.nzHeight&&(this.currentZoomLevel=this.newvalueheight,"lens"!=this.options.zoomType&&"inner"!=this.options.zoomType&&(this.changeBgSize=!0,this.zoomLens.css({height:String(this.options.zoomWindowHeight/this.heightRatio)+"px"})),"lens"==this.options.zoomType||"inner"==this.options.zoomType)&&(this.changeBgSize=!0),this.options.zoomWindowWidth/this.widthRatio<=this.nzWidth&&("inner"!=this.options.zoomType&&this.newvaluewidth>this.newvalueheight&&(this.currentZoomLevel=this.newvaluewidth),"lens"!=this.options.zoomType&&"inner"!=this.options.zoomType&&(this.changeBgSize=!0,this.zoomLens.css({width:String(this.options.zoomWindowWidth/this.widthRatio)+"px"})),"lens"==this.options.zoomType||"inner"==this.options.zoomType)&&(this.changeBgSize=!0),"inner"==this.options.zoomType&&(this.changeBgSize=!0,this.nzWidth>this.nzHeight&&(this.currentZoomLevel=this.newvaluewidth),this.nzHeight>this.nzWidth&&(this.currentZoomLevel=this.newvaluewidth))),this.setPosition(this.currentLoc)},closeAll:function(){self.zoomWindow&&self.zoomWindow.hide(),self.zoomLens&&self.zoomLens.hide(),self.zoomTint&&self.zoomTint.hide()},changeState:function(t){"enable"==t&&(this.options.zoomEnabled=!0),"disable"==t&&(this.options.zoomEnabled=!1)}};t.fn.elevateZoom=function(e){return this.each(function(){var n=Object.create(o);n.init(e,this),t.data(this,"elevateZoom",n)})},t.fn.elevateZoom.options={zoomActivation:"hover",zoomEnabled:!0,preloading:1,zoomLevel:1,scrollZoom:!1,scrollZoomIncrement:.1,minZoomLevel:!1,maxZoomLevel:!1,easing:!1,easingAmount:12,lensSize:200,zoomWindowWidth:400,zoomWindowHeight:400,zoomWindowOffetx:0,zoomWindowOffety:0,zoomWindowPosition:1,zoomWindowBgColour:"#fff",lensFadeIn:!1,lensFadeOut:!1,debug:!1,zoomWindowFadeIn:!1,zoomWindowFadeOut:!1,zoomWindowAlwaysShow:!1,zoomTintFadeIn:!1,zoomTintFadeOut:!1,borderSize:4,showLens:!0,borderColour:"#888",lensBorderSize:1,lensBorderColour:"#000",lensShape:"square",zoomType:"window",containLensZoom:!1,lensColour:"white",lensOpacity:.4,lenszoom:!1,tint:!1,tintColour:"#333",tintOpacity:.4,gallery:!1,galleryActiveClass:"zoomGalleryActive",imageCrossfade:!1,constrainType:!1,constrainSize:!1,loadingIcon:!1,cursor:"default",responsive:!0,onComplete:t.noop,onZoomedImageLoaded:function(){},onImageSwap:t.noop,onImageSwapComplete:t.noop}}(jQuery,window,document),function(t,e,n,i){"use strict";t.fn.pagepiling=function(o){function s(t){t.addClass("pp-table").wrapInner('<div class="pp-tableCell" style="height:100%" />')}function r(e){return t(".pp-section.active").index(".pp-section")>e.index(".pp-section")?"up":"down"}function a(e,n){var i={destination:e,animated:n,activeSection:t(".pp-section.active"),anchorLink:e.data("anchor"),sectionIndex:e.index(".pp-section"),toMove:e,yMovement:r(e),leavingSection:t(".pp-section.active").index(".pp-section")+1};if(!i.activeSection.is(e)){void 0===i.animated&&(i.animated=!0),void 0!==i.anchorLink&&p(i.anchorLink,i.sectionIndex),i.destination.addClass("active").siblings().removeClass("active"),i.sectionsToMove=c(i),"down"===i.yMovement?(i.translate3d=P(),i.scrolling="-100%",X.css3||i.sectionsToMove.each(function(e){e!=i.activeSection.index(".pp-section")&&t(this).css(u(i.scrolling))}),i.animateSection=i.activeSection):(i.translate3d="translate3d(0px, 0px, 0px)",i.scrolling="0",i.animateSection=e),t.isFunction(X.onLeave)&&X.onLeave.call(this,i.leavingSection,i.sectionIndex+1,i.yMovement),l(i),D(i.anchorLink),H(i.anchorLink,i.sectionIndex),N=i.anchorLink;var o=(new Date).getTime();R=o}}function l(e){X.css3?(b(e.animateSection,e.translate3d,e.animated),e.sectionsToMove.each(function(){b(t(this),e.translate3d,e.animated)}),setTimeout(function(){h(e)},X.scrollingSpeed)):(e.scrollOptions=u(e.scrolling),e.animated?e.animateSection.animate(e.scrollOptions,X.scrollingSpeed,X.easing,function(){d(e),h(e)}):(e.animateSection.css(u(e.scrolling)),setTimeout(function(){d(e),h(e)},400)))}function h(e){t.isFunction(X.afterLoad)&&X.afterLoad.call(this,e.anchorLink,e.sectionIndex+1)}function c(e){return"down"===e.yMovement?t(".pp-section").map(function(n){if(n<e.destination.index(".pp-section"))return t(this)}):t(".pp-section").map(function(n){if(n>e.destination.index(".pp-section"))return t(this)})}function d(e){"up"===e.yMovement&&e.sectionsToMove.each(function(n){t(this).css(u(e.scrolling))})}function u(t){return"vertical"===X.direction?{top:t}:{left:t}}function p(t,e){X.anchors.length?(location.hash=t,f(location.hash)):f(String(e))}function f(e){e=e.replace("#",""),t("body")[0].className=t("body")[0].className.replace(/\b\s?pp-viewing-[^\s]+\b/g,""),t("body").addClass("pp-viewing-"+e)}function g(){var i=n.location.hash.replace("#",""),o=i,s=t(e).find('.pp-section[data-anchor="'+o+'"]');s.length>0&&a(s,X.animateAnchor)}function m(){return(new Date).getTime()-R<V+X.scrollingSpeed}function v(){var i=n.location.hash.replace("#","").split("/"),o=i[0];if(o.length&&o&&o!==N){var s;s=isNaN(o)?t(e).find('[data-anchor="'+o+'"]'):t(".pp-section").eq(o-1),a(s)}}function y(t){return{"-webkit-transform":t,"-moz-transform":t,"-ms-transform":t,transform:t}}function b(t,e,n){t.toggleClass("pp-easing",n),t.css(y(e))}function w(e){var i=(new Date).getTime();e=e||n.event;var o=e.wheelDelta||-e.deltaY||-e.detail,s=Math.max(-1,Math.min(1,o)),r=void 0!==e.wheelDeltaX||void 0!==e.deltaX,a=Math.abs(e.wheelDeltaX)<Math.abs(e.wheelDelta)||Math.abs(e.deltaX)<Math.abs(e.deltaY)||!r;Z.length>149&&Z.shift(),Z.push(Math.abs(o));var l=i-G;if(G=i,l>200&&(Z=[]),!m()){var h=t(".pp-section.active"),c=z(h);return x(Z,10)>=x(Z,70)&&a&&(s<0?T("down",c):s>0&&T("up",c)),!1}}function x(t,e){for(var n=0,i=t.slice(Math.max(t.length-e,1)),o=0;o<i.length;o++)n+=i[o];return Math.ceil(n/e)}function T(t,e){var n,i;if("down"==t?(n="bottom",i=$.moveSectionDown):(n="top",i=$.moveSectionUp),e.length>0){if(!S(n,e))return!0;i()}else i()}function S(t,e){return"top"===t?!e.scrollTop():"bottom"===t?e.scrollTop()+1+e.innerHeight()>=e[0].scrollHeight:void 0}function z(t){return t.filter(".pp-scrollable")}function C(){M.get(0).addEventListener?(M.get(0).removeEventListener("mousewheel",w,!1),M.get(0).removeEventListener("wheel",w,!1)):M.get(0).detachEvent("onmousewheel",w)}function _(){M.get(0).addEventListener?(M.get(0).addEventListener("mousewheel",w,!1),M.get(0).addEventListener("wheel",w,!1)):M.get(0).attachEvent("onmousewheel",w)}function I(){if(j){var t=k();M.off("touchstart "+t.down).on("touchstart "+t.down,B),M.off("touchmove "+t.move).on("touchmove "+t.move,O)}}function E(){if(j){var t=k();M.off("touchstart "+t.down),M.off("touchmove "+t.move)}}function k(){return n.PointerEvent?{down:"pointerdown",move:"pointermove",up:"pointerup"}:{down:"MSPointerDown",move:"MSPointerMove",up:"MSPointerUp"}}function W(t){var e=new Array
;return e.y=void 0!==t.pageY&&(t.pageY||t.pageX)?t.pageY:t.touches[0].pageY,e.x=void 0!==t.pageX&&(t.pageY||t.pageX)?t.pageX:t.touches[0].pageX,e}function L(t){return void 0===t.pointerType||"mouse"!=t.pointerType}function B(t){var e=t.originalEvent;if(L(e)){var n=W(e);q=n.y,F=n.x}}function O(e){var n=e.originalEvent;if(!A(e.target)&&L(n)){var i=t(".pp-section.active"),o=z(i);if(o.length||e.preventDefault(),!m()){var s=W(n);U=s.y,Y=s.x,"horizontal"===X.direction&&Math.abs(F-Y)>Math.abs(q-U)?Math.abs(F-Y)>M.width()/100*X.touchSensitivity&&(F>Y?T("down",o):Y>F&&T("up",o)):Math.abs(q-U)>M.height()/100*X.touchSensitivity&&(q>U?T("down",o):U>q&&T("up",o))}}}function A(e,n){n=n||0;var i=t(e).parent();return!!(n<X.normalScrollElementTouchThreshold&&i.is(X.normalScrollElements))||n!=X.normalScrollElementTouchThreshold&&A(i,++n)}function H(e,n){X.navigation&&(t("#pp-nav").find(".active").removeClass("active"),e?t("#pp-nav").find('a[href="#'+e+'"]').addClass("active"):t("#pp-nav").find("li").eq(n).find("a").addClass("active"))}function D(e){X.menu&&(t(X.menu).find(".active").removeClass("active"),t(X.menu).find('[data-menuanchor="'+e+'"]').addClass("active"))}function P(){return"vertical"!==X.direction?"translate3d(-100%, 0px, 0px)":"translate3d(0px, -100%, 0px)"}var N,$=t.fn.pagepiling,M=t(this),R=0,j="ontouchstart"in n||navigator.msMaxTouchPoints>0||navigator.maxTouchPoints,q=0,F=0,U=0,Y=0,Z=[],V=600,X=t.extend(!0,{direction:"vertical",menu:null,verticalCentered:!0,sectionsColor:[],anchors:[],scrollingSpeed:700,easing:"easeInQuart",loopBottom:!1,loopTop:!1,css3:!0,navigation:{textColor:"#000",bulletsColor:"#000",position:"right",tooltips:[]},normalScrollElements:null,normalScrollElementTouchThreshold:5,touchSensitivity:5,keyboardScrolling:!0,sectionSelector:".section",animateAnchor:!1,afterLoad:null,onLeave:null,afterRender:null},o);t.extend(t.easing,{easeInQuart:function(t,e,n,i,o){return i*(e/=o)*e*e*e+n}}),$.setScrollingSpeed=function(t){X.scrollingSpeed=t},$.setMouseWheelScrolling=function(t){t?_():C()},$.setAllowScrolling=function(t){t?($.setMouseWheelScrolling(!0),I()):($.setMouseWheelScrolling(!1),E())},$.setKeyboardScrolling=function(t){X.keyboardScrolling=t},$.moveSectionUp=function(){var e=t(".pp-section.active").prev(".pp-section");!e.length&&X.loopTop&&(e=t(".pp-section").last()),e.length&&a(e)},$.moveSectionDown=function(){var e=t(".pp-section.active").next(".pp-section");!e.length&&X.loopBottom&&(e=t(".pp-section").first()),e.length&&a(e)},$.moveTo=function(n){var i="";i=isNaN(n)?t(e).find('[data-anchor="'+n+'"]'):t(".pp-section").eq(n-1),i.length>0&&a(i)},t(X.sectionSelector).each(function(){t(this).addClass("pp-section")}),X.css3&&(X.css3=function(){var t,o=e.createElement("p"),s={webkitTransform:"-webkit-transform",OTransform:"-o-transform",msTransform:"-ms-transform",MozTransform:"-moz-transform",transform:"transform"};e.body.insertBefore(o,null);for(var r in s)o.style[r]!==i&&(o.style[r]="translate3d(1px,1px,1px)",t=n.getComputedStyle(o).getPropertyValue(s[r]));return e.body.removeChild(o),t!==i&&t.length>0&&"none"!==t}()),t(M).css({overflow:"hidden","-ms-touch-action":"none","touch-action":"none"}),$.setAllowScrolling(!0),t.isEmptyObject(X.navigation)||function(){t("body").append('<div id="pp-nav"><ul></ul></div>');var e=t("#pp-nav");e.css("color",X.navigation.textColor),e.addClass(X.navigation.position);for(var n=0;n<t(".pp-section").length;n++){var i="";if(X.anchors.length&&(i=X.anchors[n]),"undefined"!==X.navigation.tooltips){var o=X.navigation.tooltips[n];void 0===o&&(o="")}e.find("ul").append('<li data-tooltip="'+o+'"><a href="#'+i+'"><span></span></a></li>')}e.find("span").css("border-color",X.navigation.bulletsColor)}();var Q=t(".pp-section").length;t(".pp-section").each(function(e){t(this).data("data-index",e),t(this).css("z-index",Q),e||0!==t(".pp-section.active").length||t(this).addClass("active"),void 0!==X.anchors[e]&&t(this).attr("data-anchor",X.anchors[e]),void 0!==X.sectionsColor[e]&&t(this).css("background-color",X.sectionsColor[e]),X.verticalCentered&&!t(this).hasClass("pp-scrollable")&&s(t(this)),Q-=1}).promise().done(function(){X.navigation&&(t("#pp-nav").css("margin-top","-"+t("#pp-nav").height()/2+"px"),t("#pp-nav").find("li").eq(t(".pp-section.active").index(".pp-section")).find("a").addClass("active")),t(n).on("load",function(){g()}),t.isFunction(X.afterRender)&&X.afterRender.call(this)}),t(n).on("hashchange",v),t(e).keydown(function(e){if(X.keyboardScrolling&&!m())switch(e.which){case 38:case 33:$.moveSectionUp();break;case 40:case 34:$.moveSectionDown();break;case 36:$.moveTo(1);break;case 35:$.moveTo(t(".pp-section").length);break;case 37:$.moveSectionUp();break;case 39:$.moveSectionDown();break;default:return}}),X.normalScrollElements&&(t(e).on("mouseenter",X.normalScrollElements,function(){$.setMouseWheelScrolling(!1)}),t(e).on("mouseleave",X.normalScrollElements,function(){$.setMouseWheelScrolling(!0)}));var G=(new Date).getTime();t(e).on("click touchstart","#pp-nav a",function(e){e.preventDefault();var n=t(this).parent().index();a(t(".pp-section").eq(n))}),t(e).on({mouseenter:function(){var e=t(this).data("tooltip");t('<div class="pp-tooltip '+X.navigation.position+'">'+e+"</div>").hide().appendTo(t(this)).fadeIn(200)},mouseleave:function(){t(this).find(".pp-tooltip").fadeOut(200,function(){t(this).remove()})}},"#pp-nav li")}}(jQuery,document,window),function(){var t,e,n,i,o,s=function(t,e){return function(){return t.apply(e,arguments)}},r=[].indexOf||function(t){for(var e=0,n=this.length;n>e;e++)if(e in this&&this[e]===t)return e;return-1};e=function(){function t(){}return t.prototype.extend=function(t,e){var n,i;for(n in e)i=e[n],null==t[n]&&(t[n]=i);return t},t.prototype.isMobile=function(t){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(t)},t.prototype.createEvent=function(t,e,n,i){var o;return null==e&&(e=!1),null==n&&(n=!1),null==i&&(i=null),null!=document.createEvent?(o=document.createEvent("CustomEvent"),o.initCustomEvent(t,e,n,i)):null!=document.createEventObject?(o=document.createEventObject(),o.eventType=t):o.eventName=t,o},t.prototype.emitEvent=function(t,e){return null!=t.dispatchEvent?t.dispatchEvent(e):e in(null!=t)?t[e]():"on"+e in(null!=t)?t["on"+e]():void 0},t.prototype.addEvent=function(t,e,n){return null!=t.addEventListener?t.addEventListener(e,n,!1):null!=t.attachEvent?t.attachEvent("on"+e,n):t[e]=n},t.prototype.removeEvent=function(t,e,n){return null!=t.removeEventListener?t.removeEventListener(e,n,!1):null!=t.detachEvent?t.detachEvent("on"+e,n):delete t[e]},t.prototype.innerHeight=function(){return"innerHeight"in window?window.innerHeight:document.documentElement.clientHeight},t}(),n=this.WeakMap||this.MozWeakMap||(n=function(){function t(){this.keys=[],this.values=[]}return t.prototype.get=function(t){var e,n,i,o;for(o=this.keys,e=n=0,i=o.length;i>n;e=++n)if(o[e]===t)return this.values[e]},t.prototype.set=function(t,e){var n,i,o,s;for(s=this.keys,n=i=0,o=s.length;o>i;n=++i)if(s[n]===t)return void(this.values[n]=e);return this.keys.push(t),this.values.push(e)},t}()),t=this.MutationObserver||this.WebkitMutationObserver||this.MozMutationObserver||(t=function(){function t(){"undefined"!=typeof console&&null!==console&&console.warn("MutationObserver is not supported by your browser."),"undefined"!=typeof console&&null!==console&&console.warn("WOW.js cannot detect dom mutations, please call .sync() after loading new content.")}return t.notSupported=!0,t.prototype.observe=function(){},t}()),i=this.getComputedStyle||function(t,e){return this.getPropertyValue=function(e){var n;return"float"===e&&(e="styleFloat"),o.test(e)&&e.replace(o,function(t,e){return e.toUpperCase()}),(null!=(n=t.currentStyle)?n[e]:void 0)||null},this},o=/(\-([a-z]){1})/g,this.WOW=function(){function o(t){null==t&&(t={}),this.scrollCallback=s(this.scrollCallback,this),this.scrollHandler=s(this.scrollHandler,this),this.resetAnimation=s(this.resetAnimation,this),this.start=s(this.start,this),this.scrolled=!0,this.config=this.util().extend(t,this.defaults),null!=t.scrollContainer&&(this.config.scrollContainer=document.querySelector(t.scrollContainer)),this.animationNameCache=new n,this.wowEvent=this.util().createEvent(this.config.boxClass)}return o.prototype.defaults={boxClass:"wow",animateClass:"animated",offset:0,mobile:!0,live:!0,callback:null,scrollContainer:null},o.prototype.init=function(){var t;return this.element=window.document.documentElement,"interactive"===(t=document.readyState)||"complete"===t?this.start():this.util().addEvent(document,"DOMContentLoaded",this.start),this.finished=[]},o.prototype.start=function(){var e,n,i,o;if(this.stopped=!1,this.boxes=function(){var t,n,i,o;for(i=this.element.querySelectorAll("."+this.config.boxClass),o=[],t=0,n=i.length;n>t;t++)e=i[t],o.push(e);return o}.call(this),this.all=function(){var t,n,i,o;for(i=this.boxes,o=[],t=0,n=i.length;n>t;t++)e=i[t],o.push(e);return o}.call(this),this.boxes.length)if(this.disabled())this.resetStyle();else for(o=this.boxes,n=0,i=o.length;i>n;n++)e=o[n],this.applyStyle(e,!0);return this.disabled()||(this.util().addEvent(this.config.scrollContainer||window,"scroll",this.scrollHandler),this.util().addEvent(window,"resize",this.scrollHandler),this.interval=setInterval(this.scrollCallback,50)),this.config.live?new t(function(t){return function(e){var n,i,o,s,r;for(r=[],n=0,i=e.length;i>n;n++)s=e[n],r.push(function(){var t,e,n,i;for(n=s.addedNodes||[],i=[],t=0,e=n.length;e>t;t++)o=n[t],i.push(this.doSync(o));return i}.call(t));return r}}(this)).observe(document.body,{childList:!0,subtree:!0}):void 0},o.prototype.stop=function(){return this.stopped=!0,this.util().removeEvent(this.config.scrollContainer||window,"scroll",this.scrollHandler),this.util().removeEvent(window,"resize",this.scrollHandler),null!=this.interval?clearInterval(this.interval):void 0},o.prototype.sync=function(e){return t.notSupported?this.doSync(this.element):void 0},o.prototype.doSync=function(t){var e,n,i,o,s;if(null==t&&(t=this.element),1===t.nodeType){for(t=t.parentNode||t,o=t.querySelectorAll("."+this.config.boxClass),s=[],n=0,i=o.length;i>n;n++)e=o[n],r.call(this.all,e)<0?(this.boxes.push(e),this.all.push(e),this.stopped||this.disabled()?this.resetStyle():this.applyStyle(e,!0),s.push(this.scrolled=!0)):s.push(void 0);return s}},o.prototype.show=function(t){return this.applyStyle(t),t.className=t.className+" "+this.config.animateClass,null!=this.config.callback&&this.config.callback(t),this.util().emitEvent(t,this.wowEvent),this.util().addEvent(t,"animationend",this.resetAnimation),this.util().addEvent(t,"oanimationend",this.resetAnimation),this.util().addEvent(t,"webkitAnimationEnd",this.resetAnimation),this.util().addEvent(t,"MSAnimationEnd",this.resetAnimation),t},o.prototype.applyStyle=function(t,e){var n,i,o;return i=t.getAttribute("data-wow-duration"),n=t.getAttribute("data-wow-delay"),o=t.getAttribute("data-wow-iteration"),this.animate(function(s){return function(){return s.customStyle(t,e,i,n,o)}}(this))},o.prototype.animate=function(){return"requestAnimationFrame"in window?function(t){return window.requestAnimationFrame(t)}:function(t){return t()}}(),o.prototype.resetStyle=function(){var t,e,n,i,o;for(i=this.boxes,o=[],e=0,n=i.length;n>e;e++)t=i[e],o.push(t.style.visibility="visible");return o},o.prototype.resetAnimation=function(t){var e;return t.type.toLowerCase().indexOf("animationend")>=0?(e=t.target||t.srcElement,e.className=e.className.replace(this.config.animateClass,"").trim()):void 0},o.prototype.customStyle=function(t,e,n,i,o){return e&&this.cacheAnimationName(t),t.style.visibility=e?"hidden":"visible",n&&this.vendorSet(t.style,{animationDuration:n}),i&&this.vendorSet(t.style,{animationDelay:i}),o&&this.vendorSet(t.style,{animationIterationCount:o}),this.vendorSet(t.style,{animationName:e?"none":this.cachedAnimationName(t)}),t},o.prototype.vendors=["moz","webkit"],o.prototype.vendorSet=function(t,e){var n,i,o,s;i=[];for(n in e)o=e[n],t[""+n]=o,i.push(function(){var e,i,r,a;for(r=this.vendors,a=[],e=0,i=r.length;i>e;e++)s=r[e],a.push(t[""+s+n.charAt(0).toUpperCase()+n.substr(1)]=o);return a}.call(this));return i},o.prototype.vendorCSS=function(t,e){var n,o,s,r,a,l;for(a=i(t),r=a.getPropertyCSSValue(e),s=this.vendors,n=0,o=s.length;o>n;n++)l=s[n],r=r||a.getPropertyCSSValue("-"+l+"-"+e);return r},o.prototype.animationName=function(t){var e;try{e=this.vendorCSS(t,"animation-name").cssText}catch(n){e=i(t).getPropertyValue("animation-name")}return"none"===e?"":e},o.prototype.cacheAnimationName=function(t){return this.animationNameCache.set(t,this.animationName(t))},o.prototype.cachedAnimationName=function(t){return this.animationNameCache.get(t)},o.prototype.scrollHandler=function(){return this.scrolled=!0},o.prototype.scrollCallback=function(){var t;return!this.scrolled||(this.scrolled=!1,this.boxes=function(){var e,n,i,o;for(i=this.boxes,o=[],e=0,n=i.length;n>e;e++)(t=i[e])&&(this.isVisible(t)?this.show(t):o.push(t));return o}.call(this),this.boxes.length||this.config.live)?void 0:this.stop()},o.prototype.offsetTop=function(t){for(var e;void 0===t.offsetTop;)t=t.parentNode;for(e=t.offsetTop;t=t.offsetParent;)e+=t.offsetTop;return e},o.prototype.isVisible=function(t){var e,n,i,o,s;return n=t.getAttribute("data-wow-offset")||this.config.offset,s=this.config.scrollContainer&&this.config.scrollContainer.scrollTop||window.pageYOffset,o=s+Math.min(this.element.clientHeight,this.util().innerHeight())-n,i=this.offsetTop(t),e=i+t.clientHeight,o>=i&&e>=s},o.prototype.util=function(){return null!=this._util?this._util:this._util=new e},o.prototype.disabled=function(){return!this.config.mobile&&this.util().isMobile(navigator.userAgent)},o}()}.call(this),function(t,e){"function"==typeof define&&define.amd?define("jquery-bridget/jquery-bridget",["jquery"],function(n){return e(t,n)}):"object"==typeof module&&module.exports?module.exports=e(t,require("jquery")):t.jQueryBridget=e(t,t.jQuery)}(window,function(t,e){"use strict";function n(n,s,a){function l(t,e,i){var o,s="$()."+n+'("'+e+'")';return t.each(function(t,l){var h=a.data(l,n);if(!h)return void r(n+" not initialized. Cannot call methods, i.e. "+s);var c=h[e];if(!c||"_"==e.charAt(0))return void r(s+" is not a valid method");var d=c.apply(h,i);o=void 0===o?d:o}),void 0!==o?o:t}function h(t,e){t.each(function(t,i){var o=a.data(i,n);o?(o.option(e),o._init()):(o=new s(i,e),a.data(i,n,o))})}(a=a||e||t.jQuery)&&(s.prototype.option||(s.prototype.option=function(t){a.isPlainObject(t)&&(this.options=a.extend(!0,this.options,t))}),a.fn[n]=function(t){if("string"==typeof t){return l(this,t,o.call(arguments,1))}return h(this,t),this},i(a))}function i(t){!t||t&&t.bridget||(t.bridget=n)}var o=Array.prototype.slice,s=t.console,r=void 0===s?function(){}:function(t){s.error(t)};return i(e||t.jQuery),n}),function(t,e){"function"==typeof define&&define.amd?define("ev-emitter/ev-emitter",e):"object"==typeof module&&module.exports?module.exports=e():t.EvEmitter=e()}("undefined"!=typeof window?window:this,function(){function t(){}var e=t.prototype;return e.on=function(t,e){if(t&&e){var n=this._events=this._events||{},i=n[t]=n[t]||[];return-1==i.indexOf(e)&&i.push(e),this}},e.once=function(t,e){if(t&&e){this.on(t,e);var n=this._onceEvents=this._onceEvents||{};return(n[t]=n[t]||{})[e]=!0,this}},e.off=function(t,e){var n=this._events&&this._events[t];if(n&&n.length){var i=n.indexOf(e);return-1!=i&&n.splice(i,1),this}},e.emitEvent=function(t,e){var n=this._events&&this._events[t];if(n&&n.length){var i=0,o=n[i];e=e||[];for(var s=this._onceEvents&&this._onceEvents[t];o;){var r=s&&s[o];r&&(this.off(t,o),delete s[o]),o.apply(this,e),i+=r?0:1,o=n[i]}return this}},t}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("get-size/get-size",[],function(){return e()}):"object"==typeof module&&module.exports?module.exports=e():t.getSize=e()}(window,function(){"use strict";function t(t){var e=parseFloat(t);return-1==t.indexOf("%")&&!isNaN(e)&&e}function e(){}function n(){for(var t={width:0,height:0,innerWidth:0,innerHeight:0,outerWidth:0,outerHeight:0},e=0;h>e;e++){t[l[e]]=0}return t}function i(t){var e=getComputedStyle(t);return e||a("Style returned "+e+". Are you running this code in a hidden iframe on Firefox? See http://bit.ly/getsizebug1"),e}function o(){if(!c){c=!0;var e=document.createElement("div");e.style.width="200px",e.style.padding="1px 2px 3px 4px",e.style.borderStyle="solid",e.style.borderWidth="1px 2px 3px 4px",e.style.boxSizing="border-box";var n=document.body||document.documentElement;n.appendChild(e);var o=i(e);s.isBoxSizeOuter=r=200==t(o.width),n.removeChild(e)}}function s(e){if(o(),"string"==typeof e&&(e=document.querySelector(e)),e&&"object"==typeof e&&e.nodeType){var s=i(e);if("none"==s.display)return n();var a={};a.width=e.offsetWidth,a.height=e.offsetHeight;for(var c=a.isBorderBox="border-box"==s.boxSizing,d=0;h>d;d++){var u=l[d],p=s[u],f=parseFloat(p);a[u]=isNaN(f)?0:f}var g=a.paddingLeft+a.paddingRight,m=a.paddingTop+a.paddingBottom,v=a.marginLeft+a.marginRight,y=a.marginTop+a.marginBottom,b=a.borderLeftWidth+a.borderRightWidth,w=a.borderTopWidth+a.borderBottomWidth,x=c&&r,T=t(s.width);!1!==T&&(a.width=T+(x?0:g+b));var S=t(s.height);return!1!==S&&(a.height=S+(x?0:m+w)),a.innerWidth=a.width-(g+b),a.innerHeight=a.height-(m+w),a.outerWidth=a.width+v,a.outerHeight=a.height+y,a}}var r,a="undefined"==typeof console?e:function(t){console.error(t)},l=["paddingLeft","paddingRight","paddingTop","paddingBottom","marginLeft","marginRight","marginTop","marginBottom","borderLeftWidth","borderRightWidth","borderTopWidth","borderBottomWidth"],h=l.length,c=!1;return s}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("desandro-matches-selector/matches-selector",e):"object"==typeof module&&module.exports?module.exports=e():t.matchesSelector=e()}(window,function(){"use strict";var t=function(){var t=Element.prototype;if(t.matches)return"matches";if(t.matchesSelector)return"matchesSelector";for(var e=["webkit","moz","ms","o"],n=0;n<e.length;n++){var i=e[n],o=i+"MatchesSelector";if(t[o])return o}}();return function(e,n){return e[t](n)}}),function(t,e){"function"==typeof define&&define.amd?define("fizzy-ui-utils/utils",["desandro-matches-selector/matches-selector"],function(n){return e(t,n)}):"object"==typeof module&&module.exports?module.exports=e(t,require("desandro-matches-selector")):t.fizzyUIUtils=e(t,t.matchesSelector)}(window,function(t,e){var n={};n.extend=function(t,e){for(var n in e)t[n]=e[n];return t},n.modulo=function(t,e){return(t%e+e)%e},n.makeArray=function(t){var e=[];if(Array.isArray(t))e=t;else if(t&&"number"==typeof t.length)for(var n=0;n<t.length;n++)e.push(t[n]);else e.push(t);return e},n.removeFrom=function(t,e){var n=t.indexOf(e);-1!=n&&t.splice(n,1)},n.getParent=function(t,n){for(;t!=document.body;)if(t=t.parentNode,e(t,n))return t},n.getQueryElement=function(t){return"string"==typeof t?document.querySelector(t):t},n.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},n.filterFindElements=function(t,i){t=n.makeArray(t);var o=[];return t.forEach(function(t){if(t instanceof HTMLElement){if(!i)return void o.push(t);e(t,i)&&o.push(t);for(var n=t.querySelectorAll(i),s=0;s<n.length;s++)o.push(n[s])}}),o},n.debounceMethod=function(t,e,n){var i=t.prototype[e],o=e+"Timeout";t.prototype[e]=function(){var t=this[o];t&&clearTimeout(t);var e=arguments,s=this;this[o]=setTimeout(function(){i.apply(s,e),delete s[o]},n||100)}},n.docReady=function(t){var e=document.readyState;"complete"==e||"interactive"==e?t():document.addEventListener("DOMContentLoaded",t)},n.toDashed=function(t){return t.replace(/(.)([A-Z])/g,function(t,e,n){return e+"-"+n}).toLowerCase()};var i=t.console;return n.htmlInit=function(e,o){n.docReady(function(){var s=n.toDashed(o),r="data-"+s,a=document.querySelectorAll("["+r+"]"),l=document.querySelectorAll(".js-"+s),h=n.makeArray(a).concat(n.makeArray(l)),c=r+"-options",d=t.jQuery;h.forEach(function(t){var n,s=t.getAttribute(r)||t.getAttribute(c);try{n=s&&JSON.parse(s)}catch(e){return void(i&&i.error("Error parsing "+r+" on "+t.className+": "+e))}var a=new e(t,n);d&&d.data(t,o,a)})})},n}),function(t,e){"function"==typeof define&&define.amd?define("outlayer/item",["ev-emitter/ev-emitter","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("ev-emitter"),require("get-size")):(t.Outlayer={},t.Outlayer.Item=e(t.EvEmitter,t.getSize))}(window,function(t,e){"use strict";function n(t){for(var e in t)return!1;return null,!0}function i(t,e){t&&(this.element=t,this.layout=e,this.position={x:0,y:0},this._create())}var o=document.documentElement.style,s="string"==typeof o.transition?"transition":"WebkitTransition",r="string"==typeof o.transform?"transform":"WebkitTransform",a={WebkitTransition:"webkitTransitionEnd",transition:"transitionend"}[s],l={transform:r,transition:s,transitionDuration:s+"Duration",transitionProperty:s+"Property",transitionDelay:s+"Delay"},h=i.prototype=Object.create(t.prototype);h.constructor=i,h._create=function(){this._transn={ingProperties:{},clean:{},onEnd:{}},this.css({position:"absolute"})},h.handleEvent=function(t){var e="on"+t.type;this[e]&&this[e](t)},h.getSize=function(){this.size=e(this.element)},h.css=function(t){var e=this.element.style;for(var n in t){e[l[n]||n]=t[n]}},h.getPosition=function(){var t=getComputedStyle(this.element),e=this.layout._getOption("originLeft"),n=this.layout._getOption("originTop"),i=t[e?"left":"right"],o=t[n?"top":"bottom"],s=this.layout.size,r=-1!=i.indexOf("%")?parseFloat(i)/100*s.width:parseInt(i,10),a=-1!=o.indexOf("%")?parseFloat(o)/100*s.height:parseInt(o,10);r=isNaN(r)?0:r,a=isNaN(a)?0:a,r-=e?s.paddingLeft:s.paddingRight,a-=n?s.paddingTop:s.paddingBottom,this.position.x=r,this.position.y=a},h.layoutPosition=function(){var t=this.layout.size,e={},n=this.layout._getOption("originLeft"),i=this.layout._getOption("originTop"),o=n?"paddingLeft":"paddingRight",s=n?"left":"right",r=n?"right":"left",a=this.position.x+t[o];e[s]=this.getXValue(a),e[r]="";var l=i?"paddingTop":"paddingBottom",h=i?"top":"bottom",c=i?"bottom":"top",d=this.position.y+t[l];e[h]=this.getYValue(d),e[c]="",this.css(e),this.emitEvent("layout",[this])},h.getXValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&!e?t/this.layout.size.width*100+"%":t+"px"},h.getYValue=function(t){var e=this.layout._getOption("horizontal");return this.layout.options.percentPosition&&e?t/this.layout.size.height*100+"%":t+"px"},h._transitionTo=function(t,e){this.getPosition();var n=this.position.x,i=this.position.y,o=parseInt(t,10),s=parseInt(e,10),r=o===this.position.x&&s===this.position.y;if(this.setPosition(t,e),r&&!this.isTransitioning)return void this.layoutPosition();var a=t-n,l=e-i,h={};h.transform=this.getTranslate(a,l),this.transition({to:h,onTransitionEnd:{transform:this.layoutPosition},isCleaning:!0})},h.getTranslate=function(t,e){var n=this.layout._getOption("originLeft"),i=this.layout._getOption("originTop");return t=n?t:-t,e=i?e:-e,"translate3d("+t+"px, "+e+"px, 0)"},h.goTo=function(t,e){this.setPosition(t,e),this.layoutPosition()},h.moveTo=h._transitionTo,h.setPosition=function(t,e){this.position.x=parseInt(t,10),this.position.y=parseInt(e,10)},h._nonTransition=function(t){this.css(t.to),t.isCleaning&&this._removeStyles(t.to);for(var e in t.onTransitionEnd)t.onTransitionEnd[e].call(this)},h.transition=function(t){if(!parseFloat(this.layout.options.transitionDuration))return void this._nonTransition(t);var e=this._transn;for(var n in t.onTransitionEnd)e.onEnd[n]=t.onTransitionEnd[n];for(n in t.to)e.ingProperties[n]=!0,t.isCleaning&&(e.clean[n]=!0);if(t.from){this.css(t.from);this.element.offsetHeight;null}this.enableTransition(t.to),this.css(t.to),this.isTransitioning=!0};var c="opacity,"+function(t){return t.replace(/([A-Z])/g,function(t){return"-"+t.toLowerCase()})}(r);h.enableTransition=function(){if(!this.isTransitioning){var t=this.layout.options.transitionDuration;t="number"==typeof t?t+"ms":t,this.css({transitionProperty:c,transitionDuration:t,transitionDelay:this.staggerDelay||0}),this.element.addEventListener(a,this,!1)}},h.onwebkitTransitionEnd=function(t){this.ontransitionend(t)},h.onotransitionend=function(t){this.ontransitionend(t)};var d={"-webkit-transform":"transform"};h.ontransitionend=function(t){if(t.target===this.element){var e=this._transn,i=d[t.propertyName]||t.propertyName;if(delete e.ingProperties[i],n(e.ingProperties)&&this.disableTransition(),i in e.clean&&(this.element.style[t.propertyName]="",delete e.clean[i]),i in e.onEnd){e.onEnd[i].call(this),delete e.onEnd[i]}this.emitEvent("transitionEnd",[this])}},h.disableTransition=function(){this.removeTransitionStyles(),this.element.removeEventListener(a,this,!1),this.isTransitioning=!1},h._removeStyles=function(t){var e={};for(var n in t)e[n]="";this.css(e)};var u={transitionProperty:"",transitionDuration:"",transitionDelay:""};return h.removeTransitionStyles=function(){this.css(u)},h.stagger=function(t){t=isNaN(t)?0:t,this.staggerDelay=t+"ms"},h.removeElem=function(){this.element.parentNode.removeChild(this.element),this.css({display:""}),this.emitEvent("remove",[this])},h.remove=function(){return s&&parseFloat(this.layout.options.transitionDuration)?(this.once("transitionEnd",function(){this.removeElem()}),void this.hide()):void this.removeElem()},h.reveal=function(){delete this.isHidden,this.css({display:""});var t=this.layout.options,e={};e[this.getHideRevealTransitionEndProperty("visibleStyle")]=this.onRevealTransitionEnd,this.transition({from:t.hiddenStyle,to:t.visibleStyle,isCleaning:!0,onTransitionEnd:e})},h.onRevealTransitionEnd=function(){this.isHidden||this.emitEvent("reveal")},h.getHideRevealTransitionEndProperty=function(t){var e=this.layout.options[t];if(e.opacity)return"opacity";for(var n in e)return n},h.hide=function(){this.isHidden=!0,this.css({display:""});var t=this.layout.options,e={};e[this.getHideRevealTransitionEndProperty("hiddenStyle")]=this.onHideTransitionEnd,this.transition({from:t.visibleStyle,to:t.hiddenStyle,isCleaning:!0,onTransitionEnd:e})},h.onHideTransitionEnd=function(){this.isHidden&&(this.css({display:"none"}),this.emitEvent("hide"))},h.destroy=function(){this.css({position:"",left:"",right:"",top:"",bottom:"",transition:"",transform:""})},i}),function(t,e){"use strict";"function"==typeof define&&define.amd?define("outlayer/outlayer",["ev-emitter/ev-emitter","get-size/get-size","fizzy-ui-utils/utils","./item"],function(n,i,o,s){return e(t,n,i,o,s)}):"object"==typeof module&&module.exports?module.exports=e(t,require("ev-emitter"),require("get-size"),require("fizzy-ui-utils"),require("./item")):t.Outlayer=e(t,t.EvEmitter,t.getSize,t.fizzyUIUtils,t.Outlayer.Item)}(window,function(t,e,n,i,o){"use strict";function s(t,e){var n=i.getQueryElement(t);if(!n)return void(l&&l.error("Bad element for "+this.constructor.namespace+": "+(n||t)));this.element=n,h&&(this.$element=h(this.element)),this.options=i.extend({},this.constructor.defaults),this.option(e);var o=++d;this.element.outlayerGUID=o,u[o]=this,this._create(),this._getOption("initLayout")&&this.layout()}function r(t){function e(){t.apply(this,arguments)}return e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e}function a(t){if("number"==typeof t)return t;var e=t.match(/(^\d*\.?\d*)(\w*)/),n=e&&e[1],i=e&&e[2];return n.length?(n=parseFloat(n))*(f[i]||1):0}var l=t.console,h=t.jQuery,c=function(){},d=0,u={};s.namespace="outlayer",s.Item=o,s.defaults={containerStyle:{position:"relative"},initLayout:!0,originLeft:!0,originTop:!0,resize:!0,resizeContainer:!0,transitionDuration:"0.4s",hiddenStyle:{opacity:0,transform:"scale(0.001)"},visibleStyle:{opacity:1,transform:"scale(1)"}};var p=s.prototype;i.extend(p,e.prototype),p.option=function(t){i.extend(this.options,t)},p._getOption=function(t){var e=this.constructor.compatOptions[t];return e&&void 0!==this.options[e]?this.options[e]:this.options[t]},s.compatOptions={initLayout:"isInitLayout",horizontal:"isHorizontal",layoutInstant:"isLayoutInstant",originLeft:"isOriginLeft",originTop:"isOriginTop",resize:"isResizeBound",resizeContainer:"isResizingContainer"},p._create=function(){this.reloadItems(),this.stamps=[],this.stamp(this.options.stamp),i.extend(this.element.style,this.options.containerStyle),this._getOption("resize")&&this.bindResize()},p.reloadItems=function(){this.items=this._itemize(this.element.children)},p._itemize=function(t){for(var e=this._filterFindItemElements(t),n=this.constructor.Item,i=[],o=0;o<e.length;o++){var s=e[o],r=new n(s,this);i.push(r)}return i},p._filterFindItemElements=function(t){return i.filterFindElements(t,this.options.itemSelector)},p.getItemElements=function(){return this.items.map(function(t){return t.element})},p.layout=function(){this._resetLayout(),this._manageStamps();var t=this._getOption("layoutInstant"),e=void 0!==t?t:!this._isLayoutInited;this.layoutItems(this.items,e),this._isLayoutInited=!0},p._init=p.layout,p._resetLayout=function(){this.getSize()},p.getSize=function(){this.size=n(this.element)},p._getMeasurement=function(t,e){var i,o=this.options[t];o?("string"==typeof o?i=this.element.querySelector(o):o instanceof HTMLElement&&(i=o),this[t]=i?n(i)[e]:o):this[t]=0},p.layoutItems=function(t,e){t=this._getItemsForLayout(t),this._layoutItems(t,e),this._postLayout()},p._getItemsForLayout=function(t){return t.filter(function(t){return!t.isIgnored})},p._layoutItems=function(t,e){if(this._emitCompleteOnItems("layout",t),t&&t.length){var n=[];t.forEach(function(t){var i=this._getItemLayoutPosition(t);i.item=t,i.isInstant=e||t.isLayoutInstant,n.push(i)},this),this._processLayoutQueue(n)}},p._getItemLayoutPosition=function(){return{x:0,y:0}},p._processLayoutQueue=function(t){this.updateStagger(),t.forEach(function(t,e){this._positionItem(t.item,t.x,t.y,t.isInstant,e)},this)},p.updateStagger=function(){var t=this.options.stagger;return null===t||void 0===t?void(this.stagger=0):(this.stagger=a(t),this.stagger)},p._positionItem=function(t,e,n,i,o){i?t.goTo(e,n):(t.stagger(o*this.stagger),t.moveTo(e,n))},p._postLayout=function(){this.resizeContainer()},p.resizeContainer=function(){if(this._getOption("resizeContainer")){var t=this._getContainerSize();t&&(this._setContainerMeasure(t.width,!0),this._setContainerMeasure(t.height,!1))}},p._getContainerSize=c,p._setContainerMeasure=function(t,e){if(void 0!==t){var n=this.size;n.isBorderBox&&(t+=e?n.paddingLeft+n.paddingRight+n.borderLeftWidth+n.borderRightWidth:n.paddingBottom+n.paddingTop+n.borderTopWidth+n.borderBottomWidth),t=Math.max(t,0),this.element.style[e?"width":"height"]=t+"px"}},p._emitCompleteOnItems=function(t,e){function n(){o.dispatchEvent(t+"Complete",null,[e])}function i(){++r==s&&n()}var o=this,s=e.length;if(!e||!s)return void n();var r=0;e.forEach(function(e){e.once(t,i)})},p.dispatchEvent=function(t,e,n){var i=e?[e].concat(n):n;if(this.emitEvent(t,i),h)if(this.$element=this.$element||h(this.element),e){var o=h.Event(e);o.type=t,this.$element.trigger(o,n)}else this.$element.trigger(t,n)},p.ignore=function(t){var e=this.getItem(t);e&&(e.isIgnored=!0)},p.unignore=function(t){var e=this.getItem(t);e&&delete e.isIgnored},p.stamp=function(t){(t=this._find(t))&&(this.stamps=this.stamps.concat(t),t.forEach(this.ignore,this))},p.unstamp=function(t){(t=this._find(t))&&t.forEach(function(t){i.removeFrom(this.stamps,t),this.unignore(t)},this)},p._find=function(t){return t?("string"==typeof t&&(t=this.element.querySelectorAll(t)),t=i.makeArray(t)):void 0},p._manageStamps=function(){this.stamps&&this.stamps.length&&(this._getBoundingRect(),this.stamps.forEach(this._manageStamp,this))},p._getBoundingRect=function(){var t=this.element.getBoundingClientRect(),e=this.size;this._boundingRect={left:t.left+e.paddingLeft+e.borderLeftWidth,top:t.top+e.paddingTop+e.borderTopWidth,right:t.right-(e.paddingRight+e.borderRightWidth),bottom:t.bottom-(e.paddingBottom+e.borderBottomWidth)}},
p._manageStamp=c,p._getElementOffset=function(t){var e=t.getBoundingClientRect(),i=this._boundingRect,o=n(t);return{left:e.left-i.left-o.marginLeft,top:e.top-i.top-o.marginTop,right:i.right-e.right-o.marginRight,bottom:i.bottom-e.bottom-o.marginBottom}},p.handleEvent=i.handleEvent,p.bindResize=function(){t.addEventListener("resize",this),this.isResizeBound=!0},p.unbindResize=function(){t.removeEventListener("resize",this),this.isResizeBound=!1},p.onresize=function(){this.resize()},i.debounceMethod(s,"onresize",100),p.resize=function(){this.isResizeBound&&this.needsResizeLayout()&&this.layout()},p.needsResizeLayout=function(){var t=n(this.element);return this.size&&t&&t.innerWidth!==this.size.innerWidth},p.addItems=function(t){var e=this._itemize(t);return e.length&&(this.items=this.items.concat(e)),e},p.appended=function(t){var e=this.addItems(t);e.length&&(this.layoutItems(e,!0),this.reveal(e))},p.prepended=function(t){var e=this._itemize(t);if(e.length){var n=this.items.slice(0);this.items=e.concat(n),this._resetLayout(),this._manageStamps(),this.layoutItems(e,!0),this.reveal(e),this.layoutItems(n)}},p.reveal=function(t){if(this._emitCompleteOnItems("reveal",t),t&&t.length){var e=this.updateStagger();t.forEach(function(t,n){t.stagger(n*e),t.reveal()})}},p.hide=function(t){if(this._emitCompleteOnItems("hide",t),t&&t.length){var e=this.updateStagger();t.forEach(function(t,n){t.stagger(n*e),t.hide()})}},p.revealItemElements=function(t){var e=this.getItems(t);this.reveal(e)},p.hideItemElements=function(t){var e=this.getItems(t);this.hide(e)},p.getItem=function(t){for(var e=0;e<this.items.length;e++){var n=this.items[e];if(n.element==t)return n}},p.getItems=function(t){t=i.makeArray(t);var e=[];return t.forEach(function(t){var n=this.getItem(t);n&&e.push(n)},this),e},p.remove=function(t){var e=this.getItems(t);this._emitCompleteOnItems("remove",e),e&&e.length&&e.forEach(function(t){t.remove(),i.removeFrom(this.items,t)},this)},p.destroy=function(){var t=this.element.style;t.height="",t.position="",t.width="",this.items.forEach(function(t){t.destroy()}),this.unbindResize();var e=this.element.outlayerGUID;delete u[e],delete this.element.outlayerGUID,h&&h.removeData(this.element,this.constructor.namespace)},s.data=function(t){t=i.getQueryElement(t);var e=t&&t.outlayerGUID;return e&&u[e]},s.create=function(t,e){var n=r(s);return n.defaults=i.extend({},s.defaults),i.extend(n.defaults,e),n.compatOptions=i.extend({},s.compatOptions),n.namespace=t,n.data=s.data,n.Item=r(o),i.htmlInit(n,t),h&&h.bridget&&h.bridget(t,n),n};var f={ms:1,s:1e3};return s.Item=o,s}),function(t,e){"function"==typeof define&&define.amd?define(["outlayer/outlayer","get-size/get-size"],e):"object"==typeof module&&module.exports?module.exports=e(require("outlayer"),require("get-size")):t.Masonry=e(t.Outlayer,t.getSize)}(window,function(t,e){var n=t.create("masonry");return n.compatOptions.fitWidth="isFitWidth",n.prototype._resetLayout=function(){this.getSize(),this._getMeasurement("columnWidth","outerWidth"),this._getMeasurement("gutter","outerWidth"),this.measureColumns(),this.colYs=[];for(var t=0;t<this.cols;t++)this.colYs.push(0);this.maxY=0},n.prototype.measureColumns=function(){if(this.getContainerWidth(),!this.columnWidth){var t=this.items[0],n=t&&t.element;this.columnWidth=n&&e(n).outerWidth||this.containerWidth}var i=this.columnWidth+=this.gutter,o=this.containerWidth+this.gutter,s=o/i,r=i-o%i,a=r&&1>r?"round":"floor";s=Math[a](s),this.cols=Math.max(s,1)},n.prototype.getContainerWidth=function(){var t=this._getOption("fitWidth"),n=t?this.element.parentNode:this.element,i=e(n);this.containerWidth=i&&i.innerWidth},n.prototype._getItemLayoutPosition=function(t){t.getSize();var e=t.size.outerWidth%this.columnWidth,n=e&&1>e?"round":"ceil",i=Math[n](t.size.outerWidth/this.columnWidth);i=Math.min(i,this.cols);for(var o=this._getColGroup(i),s=Math.min.apply(Math,o),r=o.indexOf(s),a={x:this.columnWidth*r,y:s},l=s+t.size.outerHeight,h=this.cols+1-o.length,c=0;h>c;c++)this.colYs[r+c]=l;return a},n.prototype._getColGroup=function(t){if(2>t)return this.colYs;for(var e=[],n=this.cols+1-t,i=0;n>i;i++){var o=this.colYs.slice(i,i+t);e[i]=Math.max.apply(Math,o)}return e},n.prototype._manageStamp=function(t){var n=e(t),i=this._getElementOffset(t),o=this._getOption("originLeft"),s=o?i.left:i.right,r=s+n.outerWidth,a=Math.floor(s/this.columnWidth);a=Math.max(0,a);var l=Math.floor(r/this.columnWidth);l-=r%this.columnWidth?0:1,l=Math.min(this.cols-1,l);for(var h=this._getOption("originTop"),c=(h?i.top:i.bottom)+n.outerHeight,d=a;l>=d;d++)this.colYs[d]=Math.max(c,this.colYs[d])},n.prototype._getContainerSize=function(){this.maxY=Math.max.apply(Math,this.colYs);var t={height:this.maxY};return this._getOption("fitWidth")&&(t.width=this._getContainerFitWidth()),t},n.prototype._getContainerFitWidth=function(){for(var t=0,e=this.cols;--e&&0===this.colYs[e];)t++;return(this.cols-t)*this.columnWidth-this.gutter},n.prototype.needsResizeLayout=function(){var t=this.containerWidth;return this.getContainerWidth(),t!=this.containerWidth},n}),function(t){var e=!1;if("function"==typeof define&&define.amd&&(define(t),e=!0),"object"==typeof exports&&(module.exports=t(),e=!0),!e){var n=window.Cookies,i=window.Cookies=t();i.noConflict=function(){return window.Cookies=n,i}}}(function(){function t(){for(var t=0,e={};t<arguments.length;t++){var n=arguments[t];for(var i in n)e[i]=n[i]}return e}function e(n){function i(e,o,s){var r;if("undefined"!=typeof document){if(arguments.length>1){if(s=t({path:"/"},i.defaults,s),"number"==typeof s.expires){var a=new Date;a.setMilliseconds(a.getMilliseconds()+864e5*s.expires),s.expires=a}try{r=JSON.stringify(o),/^[\{\[]/.test(r)&&(o=r)}catch(t){}return o=n.write?n.write(o,e):encodeURIComponent(String(o)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g,decodeURIComponent),e=encodeURIComponent(String(e)),e=e.replace(/%(23|24|26|2B|5E|60|7C)/g,decodeURIComponent),e=e.replace(/[\(\)]/g,escape),document.cookie=[e,"=",o,s.expires?"; expires="+s.expires.toUTCString():"",s.path?"; path="+s.path:"",s.domain?"; domain="+s.domain:"",s.secure?"; secure":""].join("")}e||(r={});for(var l=document.cookie?document.cookie.split("; "):[],h=/(%[0-9A-Z]{2})+/g,c=0;c<l.length;c++){var d=l[c].split("="),u=d.slice(1).join("=");'"'===u.charAt(0)&&(u=u.slice(1,-1));try{var p=d[0].replace(h,decodeURIComponent);if(u=n.read?n.read(u,p):n(u,p)||u.replace(h,decodeURIComponent),this.json)try{u=JSON.parse(u)}catch(t){}if(e===p){r=u;break}e||(r[p]=u)}catch(t){}}return r}}return i.set=i,i.get=function(t){return i.call(i,t)},i.getJSON=function(){return i.apply({json:!0},[].slice.call(arguments))},i.defaults={},i.remove=function(e,n){i(e,"",t(n,{expires:-1}))},i.withConverter=e,i}return e(function(){})}),function(t){t&&(t.fn.headroom=function(e){return this.each(function(){var n=t(this),i=n.data("headroom"),o="object"==typeof e&&e;o=t.extend(!0,{},Headroom.options,o),i||(i=new Headroom(this,o),i.init(),n.data("headroom",i)),"string"==typeof e&&(i[e](),"destroy"===e&&n.removeData("headroom"))})},t("[data-headroom]").each(function(){var e=t(this);e.headroom(e.data())}))}(window.Zepto||window.jQuery),function(t,e){"use strict";"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?module.exports=e():t.Headroom=e()}(this,function(){"use strict";function t(t){this.callback=t,this.ticking=!1}function e(t){return t&&"undefined"!=typeof window&&(t===window||t.nodeType)}function n(t){if(arguments.length<=0)throw new Error("Missing arguments in extend function");var i,o,s=t||{};for(o=1;o<arguments.length;o++){var r=arguments[o]||{};for(i in r)"object"!=typeof s[i]||e(s[i])?s[i]=s[i]||r[i]:s[i]=n(s[i],r[i])}return s}function i(t){return t===Object(t)?t:{down:t,up:t}}function o(t,e){e=n(e,o.options),this.lastKnownScrollY=0,this.elem=t,this.tolerance=i(e.tolerance),this.classes=e.classes,this.offset=e.offset,this.scroller=e.scroller,this.initialised=!1,this.onPin=e.onPin,this.onUnpin=e.onUnpin,this.onTop=e.onTop,this.onNotTop=e.onNotTop,this.onBottom=e.onBottom,this.onNotBottom=e.onNotBottom}var s={bind:!!function(){}.bind,classList:"classList"in document.documentElement,rAF:!!(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame)};return window.requestAnimationFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame,t.prototype={constructor:t,update:function(){this.callback&&this.callback(),this.ticking=!1},requestTick:function(){this.ticking||(requestAnimationFrame(this.rafCallback||(this.rafCallback=this.update.bind(this))),this.ticking=!0)},handleEvent:function(){this.requestTick()}},o.prototype={constructor:o,init:function(){return o.cutsTheMustard?(this.debouncer=new t(this.update.bind(this)),this.elem.classList.add(this.classes.initial),setTimeout(this.attachEvent.bind(this),100),this):void 0},destroy:function(){var t=this.classes;this.initialised=!1,this.elem.classList.remove(t.unpinned,t.pinned,t.top,t.notTop,t.initial),this.scroller.removeEventListener("scroll",this.debouncer,!1)},attachEvent:function(){this.initialised||(this.lastKnownScrollY=this.getScrollY(),this.initialised=!0,this.scroller.addEventListener("scroll",this.debouncer,!1),this.debouncer.handleEvent())},unpin:function(){var t=this.elem.classList,e=this.classes;!t.contains(e.pinned)&&t.contains(e.unpinned)||(t.add(e.unpinned),t.remove(e.pinned),this.onUnpin&&this.onUnpin.call(this))},pin:function(){var t=this.elem.classList,e=this.classes;t.contains(e.unpinned)&&(t.remove(e.unpinned),t.add(e.pinned),this.onPin&&this.onPin.call(this))},top:function(){var t=this.elem.classList,e=this.classes;t.contains(e.top)||(t.add(e.top),t.remove(e.notTop),this.onTop&&this.onTop.call(this))},notTop:function(){var t=this.elem.classList,e=this.classes;t.contains(e.notTop)||(t.add(e.notTop),t.remove(e.top),this.onNotTop&&this.onNotTop.call(this))},bottom:function(){var t=this.elem.classList,e=this.classes;t.contains(e.bottom)||(t.add(e.bottom),t.remove(e.notBottom),this.onBottom&&this.onBottom.call(this))},notBottom:function(){var t=this.elem.classList,e=this.classes;t.contains(e.notBottom)||(t.add(e.notBottom),t.remove(e.bottom),this.onNotBottom&&this.onNotBottom.call(this))},getScrollY:function(){return void 0!==this.scroller.pageYOffset?this.scroller.pageYOffset:void 0!==this.scroller.scrollTop?this.scroller.scrollTop:(document.documentElement||document.body.parentNode||document.body).scrollTop},getViewportHeight:function(){return window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight},getElementPhysicalHeight:function(t){return Math.max(t.offsetHeight,t.clientHeight)},getScrollerPhysicalHeight:function(){return this.scroller===window||this.scroller===document.body?this.getViewportHeight():this.getElementPhysicalHeight(this.scroller)},getDocumentHeight:function(){var t=document.body,e=document.documentElement;return Math.max(t.scrollHeight,e.scrollHeight,t.offsetHeight,e.offsetHeight,t.clientHeight,e.clientHeight)},getElementHeight:function(t){return Math.max(t.scrollHeight,t.offsetHeight,t.clientHeight)},getScrollerHeight:function(){return this.scroller===window||this.scroller===document.body?this.getDocumentHeight():this.getElementHeight(this.scroller)},isOutOfBounds:function(t){var e=0>t,n=t+this.getScrollerPhysicalHeight()>this.getScrollerHeight();return e||n},toleranceExceeded:function(t,e){return Math.abs(t-this.lastKnownScrollY)>=this.tolerance[e]},shouldUnpin:function(t,e){var n=t>this.lastKnownScrollY,i=t>=this.offset;return n&&i&&e},shouldPin:function(t,e){var n=t<this.lastKnownScrollY,i=t<=this.offset;return n&&e||i},update:function(){var t=this.getScrollY(),e=t>this.lastKnownScrollY?"down":"up",n=this.toleranceExceeded(t,e);this.isOutOfBounds(t)||(t<=this.offset?this.top():this.notTop(),t+this.getViewportHeight()>=this.getScrollerHeight()?this.bottom():this.notBottom(),this.shouldUnpin(t,n)?this.unpin():this.shouldPin(t,n)&&this.pin(),this.lastKnownScrollY=t)}},o.options={tolerance:{up:0,down:0},offset:0,scroller:window,classes:{pinned:"headroom--pinned",unpinned:"headroom--unpinned",top:"headroom--top",notTop:"headroom--not-top",bottom:"headroom--bottom",notBottom:"headroom--not-bottom",initial:"headroom"}},o.cutsTheMustard=void 0!==s&&s.rAF&&s.bind&&s.classList,o}),"undefined"==typeof WeakMap&&function(){var t=Object.defineProperty,e=Date.now()%1e9,n=function(){this.name="__st"+(1e9*Math.random()>>>0)+e+++"__"};n.prototype={set:function(e,n){var i=e[this.name];return i&&i[0]===e?i[1]=n:t(e,this.name,{value:[e,n],writable:!0}),this},get:function(t){var e;return(e=t[this.name])&&e[0]===t?e[1]:void 0},delete:function(t){var e=t[this.name];return!(!e||e[0]!==t)&&(e[0]=e[1]=void 0,!0)},has:function(t){var e=t[this.name];return!!e&&e[0]===t}},window.WeakMap=n}(),function(t){function e(t){w.push(t),b||(b=!0,g(i))}function n(t){return window.ShadowDOMPolyfill&&window.ShadowDOMPolyfill.wrapIfNeeded(t)||t}function i(){b=!1;var t=w;w=[],t.sort(function(t,e){return t.uid_-e.uid_});var e=!1;t.forEach(function(t){var n=t.takeRecords();o(t),n.length&&(t.callback_(n,t),e=!0)}),e&&i()}function o(t){t.nodes_.forEach(function(e){var n=m.get(e);n&&n.forEach(function(e){e.observer===t&&e.removeTransientObservers()})})}function s(t,e){for(var n=t;n;n=n.parentNode){var i=m.get(n);if(i)for(var o=0;o<i.length;o++){var s=i[o],r=s.options;if(n===t||r.subtree){var a=e(r);a&&s.enqueue(a)}}}}function r(t){this.callback_=t,this.nodes_=[],this.records_=[],this.uid_=++x}function a(t,e){this.type=t,this.target=e,this.addedNodes=[],this.removedNodes=[],this.previousSibling=null,this.nextSibling=null,this.attributeName=null,this.attributeNamespace=null,this.oldValue=null}function l(t){var e=new a(t.type,t.target);return e.addedNodes=t.addedNodes.slice(),e.removedNodes=t.removedNodes.slice(),e.previousSibling=t.previousSibling,e.nextSibling=t.nextSibling,e.attributeName=t.attributeName,e.attributeNamespace=t.attributeNamespace,e.oldValue=t.oldValue,e}function h(t,e){return T=new a(t,e)}function c(t){return S||(S=l(T),S.oldValue=t,S)}function d(){T=S=void 0}function u(t){return t===S||t===T}function p(t,e){return t===e?t:S&&u(t)?S:null}function f(t,e,n){this.observer=t,this.target=e,this.options=n,this.transientObservedNodes=[]}if(!t.JsMutationObserver){var g,m=new WeakMap;if(/Trident|Edge/.test(navigator.userAgent))g=setTimeout;else if(window.setImmediate)g=window.setImmediate;else{var v=[],y=String(Math.random());window.addEventListener("message",function(t){if(t.data===y){var e=v;v=[],e.forEach(function(t){t()})}}),g=function(t){v.push(t),window.postMessage(y,"*")}}var b=!1,w=[],x=0;r.prototype={observe:function(t,e){if(t=n(t),!e.childList&&!e.attributes&&!e.characterData||e.attributeOldValue&&!e.attributes||e.attributeFilter&&e.attributeFilter.length&&!e.attributes||e.characterDataOldValue&&!e.characterData)throw new SyntaxError;var i=m.get(t);i||m.set(t,i=[]);for(var o,s=0;s<i.length;s++)if(i[s].observer===this){o=i[s],o.removeListeners(),o.options=e;break}o||(o=new f(this,t,e),i.push(o),this.nodes_.push(t)),o.addListeners()},disconnect:function(){this.nodes_.forEach(function(t){for(var e=m.get(t),n=0;n<e.length;n++){var i=e[n];if(i.observer===this){i.removeListeners(),e.splice(n,1);break}}},this),this.records_=[]},takeRecords:function(){var t=this.records_;return this.records_=[],t}};var T,S;f.prototype={enqueue:function(t){var n=this.observer.records_,i=n.length;if(n.length>0){var o=n[i-1],s=p(o,t);if(s)return void(n[i-1]=s)}else e(this.observer);n[i]=t},addListeners:function(){this.addListeners_(this.target)},addListeners_:function(t){var e=this.options;e.attributes&&t.addEventListener("DOMAttrModified",this,!0),e.characterData&&t.addEventListener("DOMCharacterDataModified",this,!0),e.childList&&t.addEventListener("DOMNodeInserted",this,!0),(e.childList||e.subtree)&&t.addEventListener("DOMNodeRemoved",this,!0)},removeListeners:function(){this.removeListeners_(this.target)},removeListeners_:function(t){var e=this.options;e.attributes&&t.removeEventListener("DOMAttrModified",this,!0),e.characterData&&t.removeEventListener("DOMCharacterDataModified",this,!0),e.childList&&t.removeEventListener("DOMNodeInserted",this,!0),(e.childList||e.subtree)&&t.removeEventListener("DOMNodeRemoved",this,!0)},addTransientObserver:function(t){if(t!==this.target){this.addListeners_(t),this.transientObservedNodes.push(t);var e=m.get(t);e||m.set(t,e=[]),e.push(this)}},removeTransientObservers:function(){var t=this.transientObservedNodes;this.transientObservedNodes=[],t.forEach(function(t){this.removeListeners_(t);for(var e=m.get(t),n=0;n<e.length;n++)if(e[n]===this){e.splice(n,1);break}},this)},handleEvent:function(t){switch(t.stopImmediatePropagation(),t.type){case"DOMAttrModified":var e=t.attrName,n=t.relatedNode.namespaceURI,i=t.target,o=new h("attributes",i);o.attributeName=e,o.attributeNamespace=n;var r=t.attrChange===MutationEvent.ADDITION?null:t.prevValue;s(i,function(t){if(t.attributes&&(!t.attributeFilter||!t.attributeFilter.length||-1!==t.attributeFilter.indexOf(e)||-1!==t.attributeFilter.indexOf(n)))return t.attributeOldValue?c(r):o});break;case"DOMCharacterDataModified":var i=t.target,o=h("characterData",i),r=t.prevValue;s(i,function(t){if(t.characterData)return t.characterDataOldValue?c(r):o});break;case"DOMNodeRemoved":this.addTransientObserver(t.target);case"DOMNodeInserted":var a,l,u=t.target;"DOMNodeInserted"===t.type?(a=[u],l=[]):(a=[],l=[u]);var p=u.previousSibling,f=u.nextSibling,o=h("childList",t.target.parentNode);o.addedNodes=a,o.removedNodes=l,o.previousSibling=p,o.nextSibling=f,s(t.relatedNode,function(t){if(t.childList)return o})}d()}},t.JsMutationObserver=r,t.MutationObserver||(t.MutationObserver=r,r._isPolyfilled=!0)}}(self),function(t,e,n){"use strict";function i(n){if(o=e.documentElement,s=e.body,j(),ot=this,n=n||{},ht=n.constants||{},n.easing)for(var i in n.easing)U[i]=n.easing[i];mt=n.edgeStrategy||"set",at={beforerender:n.beforerender,render:n.render,keyframe:n.keyframe},lt=!1!==n.forceHeight,lt&&(Ot=n.scale||1),ct=n.mobileDeceleration||S,ut=!1!==n.smoothScrolling,pt=n.smoothScrollingDuration||C,ft={targetTop:ot.getScrollTop()},Rt=(n.mobileCheck||function(){return/Android|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent||navigator.vendor||t.opera)})(),Rt?(rt=e.getElementById(n.skrollrBody||z),rt&&it(),Y(),It(o,[y,x],[b])):It(o,[y,w],[b]),ot.refresh(),bt(t,"resize orientationchange",function(){var t=o.clientWidth,e=o.clientHeight;(e!==Nt||t!==Pt)&&(Nt=e,Pt=t,$t=!0)});var r=q();return function t(){X(),yt=r(t)}(),ot}var o,s,r={get:function(){return ot},init:function(t){return ot||new i(t)},VERSION:"0.6.30"},a=Object.prototype.hasOwnProperty,l=t.Math,h=t.getComputedStyle,c="touchstart",d="touchmove",u="touchcancel",p="touchend",f="skrollable",g=f+"-before",m=f+"-between",v=f+"-after",y="skrollr",b="no-"+y,w=y+"-desktop",x=y+"-mobile",T="linear",S=.004,z="skrollr-body",C=200,_="center",I="bottom",E="___skrollable_id",k=/^(?:input|textarea|button|select)$/i,W=/^\s+|\s+$/g,L=/^data(?:-(_\w+))?(?:-?(-?\d*\.?\d+p?))?(?:-?(start|end|top|center|bottom))?(?:-?(top|center|bottom))?$/,B=/\s*(@?[\w\-\[\]]+)\s*:\s*(.+?)\s*(?:;|$)/gi,O=/^(@?[a-z\-]+)\[(\w+)\]$/,A=/-([a-z0-9_])/g,H=function(t,e){return e.toUpperCase()},D=/[\-+]?[\d]*\.?[\d]+/g,P=/\{\?\}/g,N=/rgba?\(\s*-?\d+\s*,\s*-?\d+\s*,\s*-?\d+/g,$=/[a-z\-]+-gradient/g,M="",R="",j=function(){var t=/^(?:O|Moz|webkit|ms)|(?:-(?:o|moz|webkit|ms)-)/;if(h){var e=h(s,null);for(var n in e)if(M=n.match(t)||+n==n&&e[n].match(t))break;if(!M)return void(M=R="");M=M[0],"-"===M.slice(0,1)?(R=M,M={"-webkit-":"webkit","-moz-":"Moz","-ms-":"ms","-o-":"O"}[M]):R="-"+M.toLowerCase()+"-"}},q=function(){var e=t.requestAnimationFrame||t[M.toLowerCase()+"RequestAnimationFrame"],n=Wt();return(Rt||!e)&&(e=function(e){var i=Wt()-n,o=l.max(0,1e3/60-i);return t.setTimeout(function(){n=Wt(),e()},o)}),e},F=function(){var e=t.cancelAnimationFrame||t[M.toLowerCase()+"CancelAnimationFrame"];return(Rt||!e)&&(e=function(e){return t.clearTimeout(e)}),e},U={begin:function(){return 0},end:function(){return 1},linear:function(t){return t},quadratic:function(t){return t*t},cubic:function(t){return t*t*t},swing:function(t){return-l.cos(t*l.PI)/2+.5},sqrt:function(t){return l.sqrt(t)},outCubic:function(t){return l.pow(t-1,3)+1},bounce:function(t){var e;if(.5083>=t)e=3;else if(.8489>=t)e=9;else if(.96208>=t)e=27;else{if(!(.99981>=t))return 1;e=91}return 1-l.abs(3*l.cos(t*e*1.028)/e)}};i.prototype.refresh=function(t){var i,o,s=!1;for(t===n?(s=!0,st=[],Mt=0,t=e.getElementsByTagName("*")):t.length===n&&(t=[t]),i=0,o=t.length;o>i;i++){var r=t[i],a=r,l=[],h=ut,c=mt,d=!1;if(s&&E in r&&delete r[E],r.attributes){for(var u=0,p=r.attributes.length;p>u;u++){var g=r.attributes[u];if("data-anchor-target"!==g.name)if("data-smooth-scrolling"!==g.name)if("data-edge-strategy"!==g.name)if("data-emit-events"!==g.name){var m=g.name.match(L);if(null!==m){var v={props:g.value,element:r,eventType:g.name.replace(A,H)};l.push(v);var y=m[1];y&&(v.constant=y.substr(1));var b=m[2];/p$/.test(b)?(v.isPercentage=!0,v.offset=(0|b.slice(0,-1))/100):v.offset=0|b;var w=m[3],x=m[4]||w;w&&"start"!==w&&"end"!==w?(v.mode="relative",v.anchors=[w,x]):(v.mode="absolute","end"===w?v.isEnd=!0:v.isPercentage||(v.offset=v.offset*Ot))}}else d=!0;else c=g.value;else h="off"!==g.value;else if(null===(a=e.querySelector(g.value)))throw'Unable to find anchor target "'+g.value+'"'}if(l.length){var T,S,z;!s&&E in r?(z=r[E],T=st[z].styleAttr,S=st[z].classAttr):(z=r[E]=Mt++,T=r.style.cssText,S=_t(r)),st[z]={element:r,styleAttr:T,classAttr:S,anchorTarget:a,keyFrames:l,smoothScrolling:h,edgeStrategy:c,emitEvents:d,lastFrameIndex:-1},It(r,[f],[])}}}for(St(),i=0,o=t.length;o>i;i++){var C=st[t[i][E]];C!==n&&(Q(C),K(C))}return ot},i.prototype.relativeToAbsolute=function(t,e,n){var i=o.clientHeight,s=t.getBoundingClientRect(),r=s.top,a=s.bottom-s.top;return e===I?r-=i:e===_&&(r-=i/2),n===I?r+=a:n===_&&(r+=a/2),(r+=ot.getScrollTop())+.5|0},i.prototype.animateTo=function(t,e){e=e||{};var i=Wt(),o=ot.getScrollTop(),s=e.duration===n?1e3:e.duration;return dt={startTop:o,topDiff:t-o,targetTop:t,duration:s,startTime:i,endTime:i+s,easing:U[e.easing||T],done:e.done},dt.topDiff||(dt.done&&dt.done.call(ot,!1),dt=n),ot},i.prototype.stopAnimateTo=function(){dt&&dt.done&&dt.done.call(ot,!0),dt=n},i.prototype.isAnimatingTo=function(){return!!dt},i.prototype.isMobile=function(){return Rt},i.prototype.setScrollTop=function(e,n){return gt=!0===n,Rt?jt=l.min(l.max(e,0),Bt):t.scrollTo(0,e),ot},i.prototype.getScrollTop=function(){return Rt?jt:t.pageYOffset||o.scrollTop||s.scrollTop||0},i.prototype.getMaxScrollTop=function(){return Bt},i.prototype.on=function(t,e){return at[t]=e,ot},i.prototype.off=function(t){return delete at[t],ot},i.prototype.destroy=function(){F()(yt),xt(),It(o,[b],[y,w,x]);for(var t=0,e=st.length;e>t;t++)nt(st[t].element);o.style.overflow=s.style.overflow="",o.style.height=s.style.height="",rt&&r.setStyle(rt,"transform","none"),ot=n,rt=n,at=n,lt=n,Bt=0,Ot=1,ht=n,ct=n,At="down",Ht=-1,Pt=0,Nt=0,$t=!1,dt=n,ut=n,pt=n,ft=n,gt=n,Mt=0,mt=n,Rt=!1,jt=0,vt=n};var Y=function(){var i,r,a,h,f,g,m,v,y,b,w,x;bt(o,[c,d,u,p].join(" "),function(t){var o=t.changedTouches[0];for(h=t.target;3===h.nodeType;)h=h.parentNode;switch(f=o.clientY,g=o.clientX,b=t.timeStamp,k.test(h.tagName)||t.preventDefault(),t.type){case c:i&&i.blur(),ot.stopAnimateTo(),i=h,r=m=f,a=g,y=b;break;case d:k.test(h.tagName)&&e.activeElement!==h&&t.preventDefault(),v=f-m,x=b-w,ot.setScrollTop(jt-v,!0),m=f,w=b;break;default:case u:case p:var s=r-f,T=a-g;if(49>T*T+s*s){if(!k.test(i.tagName)){i.focus();var S=e.createEvent("MouseEvents");S.initMouseEvent("click",!0,!0,t.view,1,o.screenX,o.screenY,o.clientX,o.clientY,t.ctrlKey,t.altKey,t.shiftKey,t.metaKey,0,null),i.dispatchEvent(S)}return}i=n;var z=v/x;z=l.max(l.min(z,3),-3);var C=l.abs(z/ct),_=z*C+.5*ct*C*C,I=ot.getScrollTop()-_,E=0;I>Bt?(E=(Bt-I)/_,I=Bt):0>I&&(E=-I/_,I=0),C*=1-E,ot.animateTo(I+.5|0,{easing:"outCubic",duration:C})}}),t.scrollTo(0,0),o.style.overflow=s.style.overflow="hidden"},Z=function(){var t,e,n,i,s,r,a,h,c,d,u,p=o.clientHeight,f=zt();for(h=0,c=st.length;c>h;h++)for(t=st[h],e=t.element,n=t.anchorTarget,i=t.keyFrames,s=0,r=i.length;r>s;s++)a=i[s],d=a.offset,u=f[a.constant]||0,a.frame=d,a.isPercentage&&(d*=p,a.frame=d),"relative"===a.mode&&(nt(e),a.frame=ot.relativeToAbsolute(n,a.anchors[0],a.anchors[1])-d,nt(e,!0)),a.frame+=u,lt&&!a.isEnd&&a.frame>Bt&&(Bt=a.frame);for(Bt=l.max(Bt,Ct()),h=0,c=st.length;c>h;h++){for(t=st[h],i=t.keyFrames,s=0,r=i.length;r>s;s++)a=i[s],u=f[a.constant]||0,a.isEnd&&(a.frame=Bt-a.offset+u);t.keyFrames.sort(Lt)}},V=function(t,e){for(var n=0,i=st.length;i>n;n++){var o,s,l=st[n],h=l.element,c=l.smoothScrolling?t:e,d=l.keyFrames,u=d.length,p=d[0],y=d[d.length-1],b=c<p.frame,w=c>y.frame,x=b?p:y,T=l.emitEvents,S=l.lastFrameIndex;if(b||w){if(b&&-1===l.edge||w&&1===l.edge)continue;switch(b?(It(h,[g],[v,m]),T&&S>-1&&(Tt(h,p.eventType,At),l.lastFrameIndex=-1)):(It(h,[v],[g,m]),T&&u>S&&(Tt(h,y.eventType,At),l.lastFrameIndex=u)),l.edge=b?-1:1,l.edgeStrategy){case"reset":nt(h);continue;case"ease":c=x.frame;break;default:case"set":var z=x.props;for(o in z)a.call(z,o)&&(s=et(z[o].value),0===o.indexOf("@")?h.setAttribute(o.substr(1),s):r.setStyle(h,o,s));continue}}else 0!==l.edge&&(It(h,[f,m],[g,v]),l.edge=0);for(var C=0;u-1>C;C++)if(c>=d[C].frame&&c<=d[C+1].frame){var _=d[C],I=d[C+1];for(o in _.props)if(a.call(_.props,o)){var E=(c-_.frame)/(I.frame-_.frame);E=_.props[o].easing(E),s=tt(_.props[o].value,I.props[o].value,E),s=et(s),0===o.indexOf("@")?h.setAttribute(o.substr(1),s):r.setStyle(h,o,s)}T&&S!==C&&("down"===At?Tt(h,_.eventType,At):Tt(h,I.eventType,At),l.lastFrameIndex=C);break}}},X=function(){$t&&($t=!1,St());var t,e,i=ot.getScrollTop(),o=Wt();if(dt)o>=dt.endTime?(i=dt.targetTop,t=dt.done,dt=n):(e=dt.easing((o-dt.startTime)/dt.duration),i=dt.startTop+e*dt.topDiff|0),ot.setScrollTop(i,!0);else if(!gt){var s=ft.targetTop-i;s&&(ft={startTop:Ht,topDiff:i-Ht,targetTop:i,startTime:Dt,endTime:Dt+pt}),o<=ft.endTime&&(e=U.sqrt((o-ft.startTime)/pt),i=ft.startTop+e*ft.topDiff|0)}if(gt||Ht!==i){At=i>Ht?"down":Ht>i?"up":At,gt=!1;var a={curTop:i,lastTop:Ht,maxTop:Bt,direction:At};!1!==(at.beforerender&&at.beforerender.call(ot,a))&&(V(i,ot.getScrollTop()),Rt&&rt&&r.setStyle(rt,"transform","translate(0, "+-jt+"px) "+vt),Ht=i,at.render&&at.render.call(ot,a)),t&&t.call(ot,!1)}Dt=o},Q=function(t){for(var e=0,n=t.keyFrames.length;n>e;e++){for(var i,o,s,r,a=t.keyFrames[e],l={};null!==(r=B.exec(a.props));)s=r[1],o=r[2],i=s.match(O),null!==i?(s=i[1],i=i[2]):i=T,o=o.indexOf("!")?G(o):[o.slice(1)],l[s]={value:o,easing:U[i]};a.props=l}},G=function(t){var e=[];return N.lastIndex=0,t=t.replace(N,function(t){return t.replace(D,function(t){return t/255*100+"%"})}),R&&($.lastIndex=0,t=t.replace($,function(t){return R+t})),t=t.replace(D,function(t){return e.push(+t),"{?}"}),e.unshift(t),e},K=function(t){var e,n,i={};for(e=0,n=t.keyFrames.length;n>e;e++)J(t.keyFrames[e],i);for(i={},e=t.keyFrames.length-1;e>=0;e--)J(t.keyFrames[e],i)},J=function(t,e){var n;for(n in e)a.call(t.props,n)||(t.props[n]=e[n]);for(n in t.props)e[n]=t.props[n]},tt=function(t,e,n){var i,o=t.length;if(o!==e.length)throw"Can't interpolate between \""+t[0]+'" and "'+e[0]+'"';var s=[t[0]];for(i=1;o>i;i++)s[i]=t[i]+(e[i]-t[i])*n;return s},et=function(t){var e=1;return P.lastIndex=0,t[0].replace(P,function(){return t[e++]})},nt=function(t,e){t=[].concat(t);for(var n,i,o=0,s=t.length;s>o;o++)i=t[o],(n=st[i[E]])&&(e?(i.style.cssText=n.dirtyStyleAttr,It(i,n.dirtyClassAttr)):(n.dirtyStyleAttr=i.style.cssText,n.dirtyClassAttr=_t(i),i.style.cssText=n.styleAttr,It(i,n.classAttr)))},it=function(){vt="translateZ(0)",r.setStyle(rt,"transform",vt);var t=h(rt),e=t.getPropertyValue("transform"),n=t.getPropertyValue(R+"transform");e&&"none"!==e||n&&"none"!==n||(vt="")};r.setStyle=function(t,e,n){var i=t.style;if("zIndex"===(e=e.replace(A,H).replace("-","")))isNaN(n)?i[e]=n:i[e]=""+(0|n);else if("float"===e)i.styleFloat=i.cssFloat=n;else try{M&&(i[M+e.slice(0,1).toUpperCase()+e.slice(1)]=n),i[e]=n}catch(t){}};var ot,st,rt,at,lt,ht,ct,dt,ut,pt,ft,gt,mt,vt,yt,bt=r.addEvent=function(e,n,i){var o=function(e){return e=e||t.event,e.target||(e.target=e.srcElement),e.preventDefault||(e.preventDefault=function(){e.returnValue=!1,e.defaultPrevented=!0}),i.call(this,e)};n=n.split(" ");for(var s,r=0,a=n.length;a>r;r++)s=n[r],e.addEventListener?e.addEventListener(s,i,!1):e.attachEvent("on"+s,o),qt.push({element:e,name:s,listener:i})},wt=r.removeEvent=function(t,e,n){e=e.split(" ");for(var i=0,o=e.length;o>i;i++)t.removeEventListener?t.removeEventListener(e[i],n,!1):t.detachEvent("on"+e[i],n)},xt=function(){for(var t,e=0,n=qt.length;n>e;e++)t=qt[e],wt(t.element,t.name,t.listener);qt=[]},Tt=function(t,e,n){at.keyframe&&at.keyframe.call(ot,t,e,n)},St=function(){var t=ot.getScrollTop();Bt=0,lt&&!Rt&&(s.style.height=""),Z(),lt&&!Rt&&(s.style.height=Bt+o.clientHeight+"px"),Rt?ot.setScrollTop(l.min(ot.getScrollTop(),Bt)):ot.setScrollTop(t,!0),gt=!0},zt=function(){var t,e,n=o.clientHeight,i={};for(t in ht)e=ht[t],"function"==typeof e?e=e.call(ot):/p$/.test(e)&&(e=e.slice(0,-1)/100*n),i[t]=e;return i},Ct=function(){var t=0;return rt&&(t=l.max(rt.offsetHeight,rt.scrollHeight)),l.max(t,s.scrollHeight,s.offsetHeight,o.scrollHeight,o.offsetHeight,o.clientHeight)-o.clientHeight},_t=function(e){var n="className";return t.SVGElement&&e instanceof t.SVGElement&&(e=e[n],n="baseVal"),e[n]},It=function(e,i,o){var s="className";if(t.SVGElement&&e instanceof t.SVGElement&&(e=e[s],s="baseVal"),o===n)return void(e[s]=i);for(var r=e[s],a=0,l=o.length;l>a;a++)r=kt(r).replace(kt(o[a])," ");r=Et(r);for(var h=0,c=i.length;c>h;h++)-1===kt(r).indexOf(kt(i[h]))&&(r+=" "+i[h]);e[s]=Et(r)},Et=function(t){return t.replace(W,"")},kt=function(t){return" "+t+" "},Wt=Date.now||function(){return+new Date},Lt=function(t,e){return t.frame-e.frame},Bt=0,Ot=1,At="down",Ht=-1,Dt=Wt(),Pt=0,Nt=0,$t=!1,Mt=0,Rt=!1,jt=0,qt=[];"function"==typeof define&&define.amd?define([],function(){return r}):"undefined"!=typeof module&&module.exports?module.exports=r:t.skrollr=r}(window,document),function(t,e){var n,i="superslides";n=function(n,i){this.options=e.extend({play:!1,animation_speed:600,animation_easing:"swing",animation:"slide",inherit_width_from:t,inherit_height_from:t,pagination:!0,hashchange:!1,scrollable:!0,elements:{preserve:".preserve",nav:".slides-navigation",container:".slides-container",pagination:".slides-pagination"}},i);var o=this,s=e("<div>",{class:"slides-control"}),r=1;this.$el=e(n),this.$container=this.$el.find(this.options.elements.container);var a={containers:function(){o.init?(o.$el.css({height:o.height}),o.$control.css({width:o.width*r,left:-o.width}),o.$container.css({})):(e("body").css({margin:0}),o.$el.css({position:"relative",overflow:"hidden",width:"100%",height:o.height}),o.$control.css({position:"relative",transform:"translate3d(0)",height:"100%",width:o.width*r,left:-o.width}),o.$container.css({display:"none",margin:"0",padding:"0",listStyle:"none",position:"relative",height:"100%"})),1===o.size()&&o.$el.find(o.options.elements.nav).hide()},images:function(){var t=o.$container.find("img").not(o.options.elements.preserve);t.removeAttr("width").removeAttr("height").css({"-webkit-backface-visibility":"hidden","-ms-interpolation-mode":"bicubic",position:"absolute",left:"0",top:"0","z-index":"-1","max-width":"none"}),t.each(function(){var t=o.image._aspectRatio(this),n=this;if(e.data(this,"processed"))o.image._scale(n,t),o.image._center(n,t);else{var i=new Image;i.onload=function(){o.image._scale(n,t),o.image._center(n,t),e.data(n,"processed",!0)},i.src=this.src}})},children:function(){var t=o.$container.children();t.is("img")&&(t.each(function(){if(e(this).is("img")){e(this).wrap("<div>");var t=e(this).attr("id");e(this).removeAttr("id"),e(this).parent().attr("id",t)}}),t=o.$container.children()),
o.init||t.css({display:"none",left:2*o.width}),t.css({position:"absolute",overflow:"hidden",height:"100%",width:o.width,top:0,zIndex:0})}},l={slide:function(t,e){var n=o.$container.children();n.eq(t.upcoming_slide).css({left:t.upcoming_position,display:"block"}),o.$control.animate({left:t.offset},o.options.animation_speed,o.options.animation_easing,function(){o.size()>1&&(o.$control.css({left:-o.width}),n.eq(t.upcoming_slide).css({left:o.width,zIndex:2}),t.outgoing_slide>=0&&n.eq(t.outgoing_slide).css({left:o.width,display:"none",zIndex:0})),e()})},fade:function(t,e){var n=this,i=n.$container.children(),o=i.eq(t.outgoing_slide),s=i.eq(t.upcoming_slide);s.css({left:this.width,opacity:0,display:"block"}).animate({opacity:1},n.options.animation_speed,n.options.animation_easing),t.outgoing_slide>=0?o.animate({opacity:0},n.options.animation_speed,n.options.animation_easing,function(){n.size()>1&&(i.eq(t.upcoming_slide).css({zIndex:2}),t.outgoing_slide>=0&&i.eq(t.outgoing_slide).css({opacity:1,display:"none",zIndex:0})),e()}):(s.css({zIndex:2}),e())}};l=e.extend(l,e.fn.superslides.fx);var h={_centerY:function(t){var n=e(t);n.css({top:(o.height-n.height())/2})},_centerX:function(t){var n=e(t);n.css({left:(o.width-n.width())/2})},_center:function(t){o.image._centerX(t),o.image._centerY(t)},_aspectRatio:function(t){if(!t.naturalHeight&&!t.naturalWidth){var e=new Image;e.src=t.src,t.naturalHeight=e.height,t.naturalWidth=e.width}return t.naturalHeight/t.naturalWidth},_scale:function(t,n){n=n||o.image._aspectRatio(t);var i=o.height/o.width,s=e(t);i>n?s.css({height:o.height,width:o.height/n}):s.css({height:o.width*n,width:o.width})}},c={_setCurrent:function(t){if(o.$pagination){var e=o.$pagination.children();e.removeClass("current"),e.eq(t).addClass("current")}},_addItem:function(t){var n=t+1,i=n,s=o.$container.children().eq(t),r=s.attr("id");r&&(i=r),e("<a>",{href:"#"+i,text:i}).appendTo(o.$pagination)},_setup:function(){if(o.options.pagination&&1!==o.size()){var t=e("<nav>",{class:o.options.elements.pagination.replace(/^\./,"")});o.$pagination=t.appendTo(o.$el);for(var n=0;o.size()>n;n++)o.pagination._addItem(n)}},_events:function(){o.$el.on("click",o.options.elements.pagination+" a",function(t){t.preventDefault();var e,n=o._parseHash(this.hash);(e=o._upcomingSlide(n,!0))!==o.current&&o.animate(e,function(){o.start()})})}};return this.css=a,this.image=h,this.pagination=c,this.fx=l,this.animation=this.fx[this.options.animation],this.$control=this.$container.wrap(s).parent(".slides-control"),o._findPositions(),o.width=o._findWidth(),o.height=o._findHeight(),this.css.children(),this.css.containers(),this.css.images(),this.pagination._setup(),function(){return r=o._findMultiplier(),o.$el.on("click",o.options.elements.nav+" a",function(t){t.preventDefault(),o.stop(),e(this).hasClass("next")?o.animate("next",function(){o.start()}):o.animate("prev",function(){o.start()})}),e(document).on("keyup",function(t){37===t.keyCode&&o.animate("prev"),39===t.keyCode&&o.animate("next")}),e(t).on("resize",function(){setTimeout(function(){var t=o.$container.children();o.width=o._findWidth(),o.height=o._findHeight(),t.css({width:o.width,left:o.width}),o.css.containers(),o.css.images()},10)}),o.options.hashchange&&e(t).on("hashchange",function(){var t,e=o._parseHash();(t=o._upcomingSlide(e))>=0&&t!==o.current&&o.animate(t)}),o.pagination._events(),o.start(),o}()},n.prototype={_findWidth:function(){return e(this.options.inherit_width_from).width()},_findHeight:function(){return e(this.options.inherit_height_from).height()},_findMultiplier:function(){return 1===this.size()?1:3},_upcomingSlide:function(t,e){if(e&&!isNaN(t)&&(t-=1),/next/.test(t))return this._nextInDom();if(/prev/.test(t))return this._prevInDom();if(/\d/.test(t))return+t;if(t&&/\w/.test(t)){var n=this._findSlideById(t);return n>=0?n:0}return 0},_findSlideById:function(t){return this.$container.find("#"+t).index()},_findPositions:function(t,e){e=e||this,void 0===t&&(t=-1),e.current=t,e.next=e._nextInDom(),e.prev=e._prevInDom()},_nextInDom:function(){var t=this.current+1;return t===this.size()&&(t=0),t},_prevInDom:function(){var t=this.current-1;return 0>t&&(t=this.size()-1),t},_parseHash:function(e){return e=e||t.location.hash,e=e.replace(/^#/,""),e&&!isNaN(+e)&&(e=+e),e},size:function(){return this.$container.children().length},destroy:function(){return this.$el.removeData()},update:function(){this.css.children(),this.css.containers(),this.css.images(),this.pagination._addItem(this.size()),this._findPositions(this.current),this.$el.trigger("updated.slides")},stop:function(){clearInterval(this.play_id),delete this.play_id,this.$el.trigger("stopped.slides")},start:function(){var n=this;n.options.hashchange?e(t).trigger("hashchange"):this.animate(),this.options.play&&(this.play_id&&this.stop(),this.play_id=setInterval(function(){n.animate()},this.options.play)),this.$el.trigger("started.slides")},animate:function(e,n){var i=this,o={};if(!(this.animating||(this.animating=!0,void 0===e&&(e="next"),o.upcoming_slide=this._upcomingSlide(e),o.upcoming_slide>=this.size()))){if(o.outgoing_slide=this.current,o.upcoming_position=2*this.width,o.offset=-o.upcoming_position,("prev"===e||o.outgoing_slide>e)&&(o.upcoming_position=0,o.offset=0),i.size()>1&&i.pagination._setCurrent(o.upcoming_slide),i.options.hashchange){var s=o.upcoming_slide+1,r=i.$container.children(":eq("+o.upcoming_slide+")").attr("id");t.location.hash=r||s}i.$el.trigger("animating.slides",[o]),i.animation(o,function(){i._findPositions(o.upcoming_slide,i),"function"==typeof n&&n(),i.animating=!1,i.$el.trigger("animated.slides"),i.init||(i.$el.trigger("init.slides"),i.init=!0,i.$container.fadeIn("fast"))})}}},e.fn[i]=function(t,o){var s=[];return this.each(function(){var r,a,l;return r=e(this),a=r.data(i),l="object"==typeof t&&t,a||(s=r.data(i,a=new n(this,l))),"string"==typeof t&&"function"==typeof(s=a[t])?s=s.call(a,o):void 0}),s},e.fn[i].fx={}}(this,jQuery),console.log("info bubble ini"),window.InfoBubble=InfoBubble,InfoBubble.prototype.ARROW_SIZE_=15,InfoBubble.prototype.ARROW_STYLE_=0,InfoBubble.prototype.SHADOW_STYLE_=1,InfoBubble.prototype.MIN_WIDTH_=50,InfoBubble.prototype.ARROW_POSITION_=50,InfoBubble.prototype.PADDING_=10,InfoBubble.prototype.BORDER_WIDTH_=1,InfoBubble.prototype.BORDER_COLOR_="#ccc",InfoBubble.prototype.BORDER_RADIUS_=10,InfoBubble.prototype.BACKGROUND_COLOR_="#fff",InfoBubble.prototype.CLOSE_SRC_="https://maps.gstatic.com/intl/en_us/mapfiles/iw_close.gif",InfoBubble.prototype.extend=function(t,e){return function(t){for(var e in t.prototype)this.prototype[e]=t.prototype[e];return this}.apply(t,[e])},InfoBubble.prototype.buildDom_=function(){var t=this.bubble_=document.createElement("DIV");t.style.position="absolute",t.style.zIndex=this.baseZIndex_,(this.tabsContainer_=document.createElement("DIV")).style.position="relative";var e=this.close_=document.createElement("IMG");e.style.position="absolute",e.style.border=0,e.style.zIndex=this.baseZIndex_+1,e.style.cursor="pointer",e.className="js-info-bubble-close",e.src=this.get("closeSrc");var n=this;google.maps.event.addDomListener(e,"click",function(){n.close(),google.maps.event.trigger(n,"closeclick")});var i=this.contentContainer_=document.createElement("DIV");i.style.overflowX="auto",i.style.overflowY="auto",i.style.cursor="default",i.style.clear="both",i.style.position="relative";var o=this.content_=document.createElement("DIV");i.appendChild(o);var s=this.arrow_=document.createElement("DIV");s.style.position="relative";var r=this.arrowOuter_=document.createElement("DIV"),a=this.arrowInner_=document.createElement("DIV"),l=this.getArrowSize_();r.style.position=a.style.position="absolute",r.style.left=a.style.left="50%",r.style.height=a.style.height="0",r.style.width=a.style.width="0",r.style.marginLeft=this.px(-l),r.style.borderWidth=this.px(l),r.style.borderBottomWidth=0;var h=this.bubbleShadow_=document.createElement("DIV");h.style.position="absolute",t.style.display=h.style.display="none",t.appendChild(this.tabsContainer_),t.appendChild(e),t.appendChild(i),s.appendChild(r),s.appendChild(a),t.appendChild(s);var c=document.createElement("style");c.setAttribute("type","text/css"),this.animationName_="_ibani_"+Math.round(1e4*Math.random());var d="."+this.animationName_+"{-webkit-animation-name:"+this.animationName_+";-webkit-animation-duration:0.5s;-webkit-animation-iteration-count:1;}@-webkit-keyframes "+this.animationName_+" {from {-webkit-transform: scale(0)}50% {-webkit-transform: scale(1.2)}90% {-webkit-transform: scale(0.95)}to {-webkit-transform: scale(1)}}";c.textContent=d,document.getElementsByTagName("head")[0].appendChild(c)},InfoBubble.prototype.setBackgroundClassName=function(t){this.set("backgroundClassName",t)},InfoBubble.prototype.setBackgroundClassName=InfoBubble.prototype.setBackgroundClassName,InfoBubble.prototype.backgroundClassName_changed=function(){this.content_.className=this.get("backgroundClassName")},InfoBubble.prototype.backgroundClassName_changed=InfoBubble.prototype.backgroundClassName_changed,InfoBubble.prototype.setTabClassName=function(t){this.set("tabClassName",t)},InfoBubble.prototype.setTabClassName=InfoBubble.prototype.setTabClassName,InfoBubble.prototype.tabClassName_changed=function(){this.updateTabStyles_()},InfoBubble.prototype.tabClassName_changed=InfoBubble.prototype.tabClassName_changed,InfoBubble.prototype.getArrowStyle_=function(){return parseInt(this.get("arrowStyle"),10)||0},InfoBubble.prototype.setArrowStyle=function(t){this.set("arrowStyle",t)},InfoBubble.prototype.setArrowStyle=InfoBubble.prototype.setArrowStyle,InfoBubble.prototype.arrowStyle_changed=function(){this.arrowSize_changed()},InfoBubble.prototype.arrowStyle_changed=InfoBubble.prototype.arrowStyle_changed,InfoBubble.prototype.getArrowSize_=function(){return parseInt(this.get("arrowSize"),10)||0},InfoBubble.prototype.setArrowSize=function(t){this.set("arrowSize",t)},InfoBubble.prototype.setArrowSize=InfoBubble.prototype.setArrowSize,InfoBubble.prototype.arrowSize_changed=function(){this.borderWidth_changed()},InfoBubble.prototype.arrowSize_changed=InfoBubble.prototype.arrowSize_changed,InfoBubble.prototype.setArrowPosition=function(t){this.set("arrowPosition",t)},InfoBubble.prototype.setArrowPosition=InfoBubble.prototype.setArrowPosition,InfoBubble.prototype.getArrowPosition_=function(){return parseInt(this.get("arrowPosition"),10)||0},InfoBubble.prototype.arrowPosition_changed=function(){var t=this.getArrowPosition_();this.arrowOuter_.style.left=this.arrowInner_.style.left=t+"%",this.redraw_()},InfoBubble.prototype.arrowPosition_changed=InfoBubble.prototype.arrowPosition_changed,InfoBubble.prototype.setZIndex=function(t){this.set("zIndex",t)},InfoBubble.prototype.setZIndex=InfoBubble.prototype.setZIndex,InfoBubble.prototype.getZIndex=function(){return parseInt(this.get("zIndex"),10)||this.baseZIndex_},InfoBubble.prototype.zIndex_changed=function(){var t=this.getZIndex();this.bubble_.style.zIndex=this.baseZIndex_=t,this.close_.style.zIndex=t+1},InfoBubble.prototype.zIndex_changed=InfoBubble.prototype.zIndex_changed,InfoBubble.prototype.setShadowStyle=function(t){this.set("shadowStyle",t)},InfoBubble.prototype.setShadowStyle=InfoBubble.prototype.setShadowStyle,InfoBubble.prototype.getShadowStyle_=function(){return parseInt(this.get("shadowStyle"),10)||0},InfoBubble.prototype.shadowStyle_changed=function(){var t=this.getShadowStyle_(),e="",n="",i="";switch(t){case 0:e="none";break;case 1:n="40px 15px 10px rgba(33,33,33,0.3)",i="transparent";break;case 2:n="0 0 2px rgba(33,33,33,0.3)",i="rgba(33,33,33,0.35)"}this.bubbleShadow_.style.boxShadow=this.bubbleShadow_.style.webkitBoxShadow=this.bubbleShadow_.style.MozBoxShadow=n,this.bubbleShadow_.style.backgroundColor=i,this.isOpen_&&(this.bubbleShadow_.style.display=e,this.draw())},InfoBubble.prototype.shadowStyle_changed=InfoBubble.prototype.shadowStyle_changed,InfoBubble.prototype.showCloseButton=function(){this.set("hideCloseButton",!1)},InfoBubble.prototype.showCloseButton=InfoBubble.prototype.showCloseButton,InfoBubble.prototype.hideCloseButton=function(){this.set("hideCloseButton",!0)},InfoBubble.prototype.hideCloseButton=InfoBubble.prototype.hideCloseButton,InfoBubble.prototype.hideCloseButton_changed=function(){this.close_.style.display=this.get("hideCloseButton")?"none":""},InfoBubble.prototype.hideCloseButton_changed=InfoBubble.prototype.hideCloseButton_changed,InfoBubble.prototype.setBackgroundColor=function(t){t&&this.set("backgroundColor",t)},InfoBubble.prototype.setBackgroundColor=InfoBubble.prototype.setBackgroundColor,InfoBubble.prototype.backgroundColor_changed=function(){var t=this.get("backgroundColor");this.contentContainer_.style.backgroundColor=t,this.arrowInner_.style.borderColor=t+" transparent transparent",this.updateTabStyles_()},InfoBubble.prototype.backgroundColor_changed=InfoBubble.prototype.backgroundColor_changed,InfoBubble.prototype.setBorderColor=function(t){t&&this.set("borderColor",t)},InfoBubble.prototype.setBorderColor=InfoBubble.prototype.setBorderColor,InfoBubble.prototype.borderColor_changed=function(){var t=this.get("borderColor"),e=this.contentContainer_,n=this.arrowOuter_;e.style.borderColor=t,n.style.borderColor=t+" transparent transparent",e.style.borderStyle=n.style.borderStyle=this.arrowInner_.style.borderStyle="solid",this.updateTabStyles_()},InfoBubble.prototype.borderColor_changed=InfoBubble.prototype.borderColor_changed,InfoBubble.prototype.setBorderRadius=function(t){this.set("borderRadius",t)},InfoBubble.prototype.setBorderRadius=InfoBubble.prototype.setBorderRadius,InfoBubble.prototype.getBorderRadius_=function(){return parseInt(this.get("borderRadius"),10)||0},InfoBubble.prototype.borderRadius_changed=function(){var t=this.getBorderRadius_(),e=this.getBorderWidth_();this.contentContainer_.style.borderRadius=this.contentContainer_.style.MozBorderRadius=this.contentContainer_.style.webkitBorderRadius=this.bubbleShadow_.style.borderRadius=this.bubbleShadow_.style.MozBorderRadius=this.bubbleShadow_.style.webkitBorderRadius=this.px(t),this.tabsContainer_.style.paddingLeft=this.tabsContainer_.style.paddingRight=this.px(t+e),this.redraw_()},InfoBubble.prototype.borderRadius_changed=InfoBubble.prototype.borderRadius_changed,InfoBubble.prototype.getBorderWidth_=function(){return parseInt(this.get("borderWidth"),10)||0},InfoBubble.prototype.setBorderWidth=function(t){this.set("borderWidth",t)},InfoBubble.prototype.setBorderWidth=InfoBubble.prototype.setBorderWidth,InfoBubble.prototype.borderWidth_changed=function(){var t=this.getBorderWidth_();this.contentContainer_.style.borderWidth=this.px(t),this.tabsContainer_.style.top=this.px(t),this.updateArrowStyle_(),this.updateTabStyles_(),this.borderRadius_changed(),this.redraw_()},InfoBubble.prototype.borderWidth_changed=InfoBubble.prototype.borderWidth_changed,InfoBubble.prototype.updateArrowStyle_=function(){var t=this.getBorderWidth_(),e=this.getArrowSize_(),n=this.getArrowStyle_(),i=this.px(e),o=this.px(Math.max(0,e-t)),s=this.arrowOuter_,r=this.arrowInner_;this.arrow_.style.marginTop=this.px(-t),s.style.borderTopWidth=i,r.style.borderTopWidth=o,0==n||1==n?(s.style.borderLeftWidth=i,r.style.borderLeftWidth=o):s.style.borderLeftWidth=r.style.borderLeftWidth=0,0==n||2==n?(s.style.borderRightWidth=i,r.style.borderRightWidth=o):s.style.borderRightWidth=r.style.borderRightWidth=0,n<2?(s.style.marginLeft=this.px(-e),r.style.marginLeft=this.px(-(e-t))):s.style.marginLeft=r.style.marginLeft=0,s.style.display=0==t?"none":""},InfoBubble.prototype.setPadding=function(t){this.set("padding",t)},InfoBubble.prototype.setPadding=InfoBubble.prototype.setPadding,InfoBubble.prototype.setCloseSrc=function(t){t&&this.close_&&(this.close_.src=t)},InfoBubble.prototype.setCloseSrc=InfoBubble.prototype.setCloseSrc,InfoBubble.prototype.getPadding_=function(){return parseInt(this.get("padding"),10)||0},InfoBubble.prototype.padding_changed=function(){var t=this.getPadding_();this.contentContainer_.style.padding=this.px(t),this.updateTabStyles_(),this.redraw_()},InfoBubble.prototype.padding_changed=InfoBubble.prototype.padding_changed,InfoBubble.prototype.px=function(t){return t?t+"px":t},InfoBubble.prototype.addEvents_=function(){var t=["mousedown","mousemove","mouseover","mouseout","mouseup","mousewheel","DOMMouseScroll","touchstart","touchend","touchmove","dblclick","contextmenu","click"],e=this.bubble_;this.listeners_=[];for(var n,i=0;n=t[i];i++)this.listeners_.push(google.maps.event.addDomListener(e,n,function(t){t.cancelBubble=!0,t.stopPropagation&&t.stopPropagation()}))},InfoBubble.prototype.onAdd=function(){this.bubble_||this.buildDom_(),this.addEvents_();var t=this.getPanes();t&&(t.floatPane.appendChild(this.bubble_),t.floatShadow.appendChild(this.bubbleShadow_)),google.maps.event.trigger(this,"domready")},InfoBubble.prototype.onAdd=InfoBubble.prototype.onAdd,InfoBubble.prototype.draw=function(){var t=this.getProjection();if(t){var e=this.get("position");if(!e)return void this.close();var n=0;this.activeTab_&&(n=this.activeTab_.offsetHeight);var i=this.getAnchorHeight_(),o=this.getArrowSize_(),s=this.getArrowPosition_();s/=100;var r=t.fromLatLngToDivPixel(e),a=this.contentContainer_.offsetWidth,l=this.bubble_.offsetHeight;if(a){var h=r.y-(l+o);i&&(h-=i);var c=r.x-a*s;this.bubble_.style.top=this.px(h),this.bubble_.style.left=this.px(c);switch(parseInt(this.get("shadowStyle"),10)){case 1:this.bubbleShadow_.style.top=this.px(h+n-1),this.bubbleShadow_.style.left=this.px(c),this.bubbleShadow_.style.width=this.px(a),this.bubbleShadow_.style.height=this.px(this.contentContainer_.offsetHeight-o);break;case 2:a*=.8,this.bubbleShadow_.style.top=i?this.px(r.y):this.px(r.y+o),this.bubbleShadow_.style.left=this.px(r.x-a*s),this.bubbleShadow_.style.width=this.px(a),this.bubbleShadow_.style.height=this.px(2)}}}},InfoBubble.prototype.draw=InfoBubble.prototype.draw,InfoBubble.prototype.onRemove=function(){this.bubble_&&this.bubble_.parentNode&&this.bubble_.parentNode.removeChild(this.bubble_),this.bubbleShadow_&&this.bubbleShadow_.parentNode&&this.bubbleShadow_.parentNode.removeChild(this.bubbleShadow_);for(var t,e=0;t=this.listeners_[e];e++)google.maps.event.removeListener(t)},InfoBubble.prototype.onRemove=InfoBubble.prototype.onRemove,InfoBubble.prototype.isOpen=function(){return this.isOpen_},InfoBubble.prototype.isOpen=InfoBubble.prototype.isOpen,InfoBubble.prototype.close=function(){this.bubble_&&(this.bubble_.style.display="none",this.bubble_.className=this.bubble_.className.replace(this.animationName_,"")),this.bubbleShadow_&&(this.bubbleShadow_.style.display="none",this.bubbleShadow_.className=this.bubbleShadow_.className.replace(this.animationName_,"")),this.isOpen_=!1},InfoBubble.prototype.close=InfoBubble.prototype.close,InfoBubble.prototype.open=function(t,e){var n=this;window.setTimeout(function(){n.open_(t,e)},0)},InfoBubble.prototype.open_=function(t,e){if(this.updateContent_(),t&&this.setMap(t),e&&(this.set("anchor",e),this.bindTo("anchorPoint",e),this.bindTo("position",e)),this.bubble_.style.display=this.bubbleShadow_.style.display="",!this.get("disableAnimation")&&(this.bubble_.className+=" "+this.animationName_,this.bubbleShadow_.className+=" "+this.animationName_),this.redraw_(),this.isOpen_=!0,!this.get("disableAutoPan")){var n=this;window.setTimeout(function(){n.panToView()},200)}},InfoBubble.prototype.open=InfoBubble.prototype.open,InfoBubble.prototype.setPosition=function(t){t&&this.set("position",t)},InfoBubble.prototype.setPosition=InfoBubble.prototype.setPosition,InfoBubble.prototype.getPosition=function(){return this.get("position")},InfoBubble.prototype.getPosition=InfoBubble.prototype.getPosition,InfoBubble.prototype.position_changed=function(){this.draw()},InfoBubble.prototype.position_changed=InfoBubble.prototype.position_changed,InfoBubble.prototype.panToView=function(){var t=this.getProjection();if(t&&this.bubble_){var e=this.getAnchorHeight_(),n=this.bubble_.offsetHeight+e,i=this.get("map"),o=i.getDiv(),s=o.offsetHeight,r=this.getPosition(),a=t.fromLatLngToContainerPixel(i.getCenter()),l=t.fromLatLngToContainerPixel(r),h=a.y-n,c=s-a.y,d=h<0,u=0;d&&(h*=-1,u=(h+c)/2),l.y-=u,r=t.fromContainerPixelToLatLng(l),i.getCenter()!=r&&i.panTo(r)}},InfoBubble.prototype.panToView=InfoBubble.prototype.panToView,InfoBubble.prototype.htmlToDocumentFragment_=function(t){t=t.replace(/^\s*([\S\s]*)\b\s*$/,"$1");var e=document.createElement("DIV");if(e.innerHTML=t,1==e.childNodes.length)return e.removeChild(e.firstChild);for(var n=document.createDocumentFragment();e.firstChild;)n.appendChild(e.firstChild);return n},InfoBubble.prototype.removeChildren_=function(t){if(t)for(var e;e=t.firstChild;)t.removeChild(e)},InfoBubble.prototype.setContent=function(t){this.set("content",t)},InfoBubble.prototype.setContent=InfoBubble.prototype.setContent,InfoBubble.prototype.getContent=function(){return this.get("content")},InfoBubble.prototype.getContent=InfoBubble.prototype.getContent,InfoBubble.prototype.updateContent_=function(){if(this.content_){this.removeChildren_(this.content_);var t=this.getContent();if(t){"string"==typeof t&&(t=this.htmlToDocumentFragment_(t)),this.content_.appendChild(t);for(var e,n=this,i=this.content_.getElementsByTagName("IMG"),o=0;e=i[o];o++)google.maps.event.addDomListener(e,"load",function(){n.imageLoaded_()})}this.redraw_()}},InfoBubble.prototype.imageLoaded_=function(){var t=!this.get("disableAutoPan");this.redraw_(),!t||0!=this.tabs_.length&&0!=this.activeTab_.index||this.panToView()},InfoBubble.prototype.updateTabStyles_=function(){if(this.tabs_&&this.tabs_.length){for(var t,e=0;t=this.tabs_[e];e++)this.setTabStyle_(t.tab);this.activeTab_.style.zIndex=this.baseZIndex_;var n=this.getBorderWidth_(),i=this.getPadding_()/2;this.activeTab_.style.borderBottomWidth=0,this.activeTab_.style.paddingBottom=this.px(i+n)}},InfoBubble.prototype.setTabStyle_=function(t){var e=this.get("backgroundColor"),n=this.get("borderColor"),i=this.getBorderRadius_(),o=this.getBorderWidth_(),s=this.getPadding_(),r=this.px(-Math.max(s,i)),a=this.px(i),l=this.baseZIndex_;t.index&&(l-=t.index);var h={cssFloat:"left",position:"relative",cursor:"pointer",backgroundColor:e,border:this.px(o)+" solid "+n,padding:this.px(s/2)+" "+this.px(s),marginRight:r,whiteSpace:"nowrap",borderRadiusTopLeft:a,MozBorderRadiusTopleft:a,webkitBorderTopLeftRadius:a,borderRadiusTopRight:a,MozBorderRadiusTopright:a,webkitBorderTopRightRadius:a,zIndex:l,display:"inline"};for(var c in h)t.style[c]=h[c];var d=this.get("tabClassName");void 0!=d&&(t.className+=" "+d)},InfoBubble.prototype.addTabActions_=function(t){var e=this;t.listener_=google.maps.event.addDomListener(t,"click",function(){e.setTabActive_(this)})},InfoBubble.prototype.setTabActive=function(t){var e=this.tabs_[t-1];e&&this.setTabActive_(e.tab)},InfoBubble.prototype.setTabActive=InfoBubble.prototype.setTabActive,InfoBubble.prototype.setTabActive_=function(t){if(!t)return this.setContent(""),void this.updateContent_();var e=this.getPadding_()/2,n=this.getBorderWidth_();if(this.activeTab_){var i=this.activeTab_;i.style.zIndex=this.baseZIndex_-i.index,i.style.paddingBottom=this.px(e),i.style.borderBottomWidth=this.px(n)}t.style.zIndex=this.baseZIndex_,t.style.borderBottomWidth=0,t.style.marginBottomWidth="-10px",t.style.paddingBottom=this.px(e+n),this.setContent(this.tabs_[t.index].content),this.updateContent_(),this.activeTab_=t,this.redraw_()},InfoBubble.prototype.setMaxWidth=function(t){this.set("maxWidth",t)},InfoBubble.prototype.setMaxWidth=InfoBubble.prototype.setMaxWidth,InfoBubble.prototype.maxWidth_changed=function(){this.redraw_()},InfoBubble.prototype.maxWidth_changed=InfoBubble.prototype.maxWidth_changed,InfoBubble.prototype.setMaxHeight=function(t){this.set("maxHeight",t)},InfoBubble.prototype.setMaxHeight=InfoBubble.prototype.setMaxHeight,InfoBubble.prototype.maxHeight_changed=function(){this.redraw_()},InfoBubble.prototype.maxHeight_changed=InfoBubble.prototype.maxHeight_changed,InfoBubble.prototype.setMinWidth=function(t){this.set("minWidth",t)},InfoBubble.prototype.setMinWidth=InfoBubble.prototype.setMinWidth,InfoBubble.prototype.minWidth_changed=function(){this.redraw_()},InfoBubble.prototype.minWidth_changed=InfoBubble.prototype.minWidth_changed,InfoBubble.prototype.setMinHeight=function(t){this.set("minHeight",t)},InfoBubble.prototype.setMinHeight=InfoBubble.prototype.setMinHeight,InfoBubble.prototype.minHeight_changed=function(){this.redraw_()},InfoBubble.prototype.minHeight_changed=InfoBubble.prototype.minHeight_changed,InfoBubble.prototype.addTab=function(t,e){var n=document.createElement("DIV");n.innerHTML=t,this.setTabStyle_(n),this.addTabActions_(n),this.tabsContainer_.appendChild(n),this.tabs_.push({label:t,content:e,tab:n}),n.index=this.tabs_.length-1,n.style.zIndex=this.baseZIndex_-n.index,this.activeTab_||this.setTabActive_(n),n.className=n.className+" "+this.animationName_,this.redraw_()},InfoBubble.prototype.addTab=InfoBubble.prototype.addTab,InfoBubble.prototype.updateTab=function(t,e,n){if(!(!this.tabs_.length||t<0||t>=this.tabs_.length)){var i=this.tabs_[t];void 0!=e&&(i.tab.innerHTML=i.label=e),void 0!=n&&(i.content=n),this.activeTab_==i.tab&&(this.setContent(i.content),this.updateContent_()),this.redraw_()}},InfoBubble.prototype.updateTab=InfoBubble.prototype.updateTab,InfoBubble.prototype.removeTab=function(t){if(!(!this.tabs_.length||t<0||t>=this.tabs_.length)){var e=this.tabs_[t];e.tab.parentNode.removeChild(e.tab),google.maps.event.removeListener(e.tab.listener_),this.tabs_.splice(t,1),delete e;for(var n,i=0;n=this.tabs_[i];i++)n.tab.index=i;e.tab==this.activeTab_&&(this.tabs_[t]?this.activeTab_=this.tabs_[t].tab:this.tabs_[t-1]?this.activeTab_=this.tabs_[t-1].tab:this.activeTab_=void 0,this.setTabActive_(this.activeTab_)),this.redraw_()}},InfoBubble.prototype.removeTab=InfoBubble.prototype.removeTab,InfoBubble.prototype.getElementSize_=function(t,e,n){var i=document.createElement("DIV");i.style.display="inline",i.style.position="absolute",i.style.visibility="hidden","string"==typeof t?i.innerHTML=t:i.appendChild(t.cloneNode(!0)),document.body.appendChild(i);var o=new google.maps.Size(i.offsetWidth,i.offsetHeight);return e&&o.width>e&&(i.style.width=this.px(e),o=new google.maps.Size(i.offsetWidth,i.offsetHeight)),n&&o.height>n&&(i.style.height=this.px(n),o=new google.maps.Size(i.offsetWidth,i.offsetHeight)),document.body.removeChild(i),delete i,o},InfoBubble.prototype.redraw_=function(){this.figureOutSize_(),this.positionCloseButton_(),this.draw()},InfoBubble.prototype.figureOutSize_=function(){var t=this.get("map");if(t){var e=this.getPadding_(),n=(this.getBorderWidth_(),this.getBorderRadius_(),this.getArrowSize_()),i=t.getDiv(),o=2*n,s=i.offsetWidth-o,r=i.offsetHeight-o-this.getAnchorHeight_(),a=0,l=this.get("minWidth")||0,h=this.get("minHeight")||0,c=this.get("maxWidth")||0,d=this.get("maxHeight")||0;c=Math.min(s,c),d=Math.min(r,d);var u=0;if(this.tabs_.length)for(var p,f=0;p=this.tabs_[f];f++){var g=this.getElementSize_(p.tab,c,d),m=this.getElementSize_(p.content,c,d);l<g.width&&(l=g.width),u+=g.width,h<g.height&&(h=g.height),g.height>a&&(a=g.height),l<m.width&&(l=m.width),h<m.height&&(h=m.height)}else{var v=this.get("content");if("string"==typeof v&&(v=this.htmlToDocumentFragment_(v)),v){var m=this.getElementSize_(v,c,d);l<m.width&&(l=m.width),h<m.height&&(h=m.height)}}c&&(l=Math.min(l,c)),d&&(h=Math.min(h,d)),l=Math.max(l,u),l==u&&(l+=2*e),n*=2,l=Math.max(l,n),l>s&&(l=s),h>r&&(h=r-a),this.tabsContainer_&&(this.tabHeight_=a,this.tabsContainer_.style.width=this.px(u)),this.contentContainer_.style.width=this.px(l),this.contentContainer_.style.height=this.px(h)}},InfoBubble.prototype.getAnchorHeight_=function(){if(this.get("anchor")){var t=this.get("anchorPoint");if(t)return-1*t.y}return 0},InfoBubble.prototype.anchorPoint_changed=function(){this.draw()},InfoBubble.prototype.anchorPoint_changed=InfoBubble.prototype.anchorPoint_changed,InfoBubble.prototype.positionCloseButton_=function(){var t=(this.getBorderRadius_(),this.getBorderWidth_()),e=2,n=2;this.tabs_.length&&this.tabHeight_&&(n+=this.tabHeight_),n+=t,e+=t;var i=this.contentContainer_;i&&i.clientHeight<i.scrollHeight&&(e+=15),this.close_.style.right=this.px(e),this.close_.style.top=this.px(n)},function(t){var e={mode:"horizontal",slideSelector:"",infiniteLoop:!0,hideControlOnEnd:!1,speed:500,easing:null,slideMargin:0,startSlide:0,randomStart:!1,captions:!1,ticker:!1,tickerHover:!1,adaptiveHeight:!1,adaptiveHeightSpeed:500,video:!1,useCSS:!0,preloadImages:"visible",responsive:!0,slideZIndex:50,wrapperClass:"bx-wrapper",touchEnabled:!0,swipeThreshold:50,oneToOneTouch:!0,preventDefaultSwipeX:!0,preventDefaultSwipeY:!1,ariaLive:!0,ariaHidden:!0,keyboardEnabled:!1,pager:!0,pagerType:"full",pagerShortSeparator:" / ",pagerSelector:null,buildPager:null,pagerCustom:null,controls:!0,nextText:"Next",prevText:"Prev",nextSelector:null,prevSelector:null,autoControls:!1,startText:"Start",stopText:"Stop",autoControlsCombine:!1,autoControlsSelector:null,auto:!1,pause:4e3,autoStart:!0,autoDirection:"next",stopAutoOnClick:!1,autoHover:!1,autoDelay:0,autoSlideForOnePage:!1,minSlides:1,maxSlides:1,moveSlides:0,slideWidth:0,shrinkItems:!1,onSliderLoad:function(){return!0},onSlideBefore:function(){return!0},onSlideAfter:function(){return!0},onSlideNext:function(){return!0},onSlidePrev:function(){return!0},onSliderResize:function(){return!0}};t.fn.bxSlider=function(n){if(0===this.length)return this;if(this.length>1)return this.each(function(){t(this).bxSlider(n)}),this;var o={},s=this,r=t(window).width(),a=t(window).height();if(!t(s).data("bxSlider")){var l=function(){t(s).data("bxSlider")||(o.settings=t.extend({},e,n),o.settings.slideWidth=parseInt(o.settings.slideWidth),o.children=s.children(o.settings.slideSelector),o.children.length<o.settings.minSlides&&(o.settings.minSlides=o.children.length),o.children.length<o.settings.maxSlides&&(o.settings.maxSlides=o.children.length),o.settings.randomStart&&(o.settings.startSlide=Math.floor(Math.random()*o.children.length)),o.active={index:o.settings.startSlide},o.carousel=o.settings.minSlides>1||o.settings.maxSlides>1,o.carousel&&(o.settings.preloadImages="all"),o.minThreshold=o.settings.minSlides*o.settings.slideWidth+(o.settings.minSlides-1)*o.settings.slideMargin,o.maxThreshold=o.settings.maxSlides*o.settings.slideWidth+(o.settings.maxSlides-1)*o.settings.slideMargin,o.working=!1,o.controls={},o.interval=null,o.animProp="vertical"===o.settings.mode?"top":"left",o.usingCSS=o.settings.useCSS&&"fade"!==o.settings.mode&&function(){for(var t=document.createElement("div"),e=["WebkitPerspective","MozPerspective","OPerspective","msPerspective"],n=0;n<e.length;n++)if(void 0!==t.style[e[n]])return o.cssPrefix=e[n].replace("Perspective","").toLowerCase(),o.animProp="-"+o.cssPrefix+"-transform",!0;return!1}(),"vertical"===o.settings.mode&&(o.settings.maxSlides=o.settings.minSlides),s.data("origStyle",s.attr("style")),s.children(o.settings.slideSelector).each(function(){t(this).data("origStyle",t(this).attr("style"))}),h())},h=function(){var e=o.children.eq(o.settings.startSlide);s.wrap('<div class="'+o.settings.wrapperClass+'"><div class="bx-viewport"></div></div>'),o.viewport=s.parent(),o.settings.ariaLive&&!o.settings.ticker&&o.viewport.attr("aria-live","polite"),o.loader=t('<div class="bx-loading" />'),o.viewport.prepend(o.loader),s.css({width:"horizontal"===o.settings.mode?1e3*o.children.length+215+"%":"auto",position:"relative"}),o.usingCSS&&o.settings.easing?s.css("-"+o.cssPrefix+"-transition-timing-function",o.settings.easing):o.settings.easing||(o.settings.easing="swing"),o.viewport.css({width:"100%",overflow:"hidden",position:"relative"}),o.viewport.parent().css({maxWidth:p()}),o.children.css({float:"horizontal"===o.settings.mode?"left":"none",listStyle:"none",position:"relative"}),o.children.css("width",f()),"horizontal"===o.settings.mode&&o.settings.slideMargin>0&&o.children.css("marginRight",o.settings.slideMargin),
"vertical"===o.settings.mode&&o.settings.slideMargin>0&&o.children.css("marginBottom",o.settings.slideMargin),"fade"===o.settings.mode&&(o.children.css({position:"absolute",zIndex:0,display:"none"}),o.children.eq(o.settings.startSlide).css({zIndex:o.settings.slideZIndex,display:"block"})),o.controls.el=t('<div class="bx-controls" />'),o.settings.captions&&z(),o.active.last=o.settings.startSlide===m()-1,o.settings.video&&s.fitVids(),("all"===o.settings.preloadImages||o.settings.ticker)&&(e=o.children),o.settings.ticker?o.settings.pager=!1:(o.settings.controls&&T(),o.settings.auto&&o.settings.autoControls&&S(),o.settings.pager&&x(),(o.settings.controls||o.settings.autoControls||o.settings.pager)&&o.viewport.after(o.controls.el)),c(e,d)},c=function(e,n){var i=e.find('img:not([src=""]), iframe').length,o=0;return 0===i?void n():void e.find('img:not([src=""]), iframe').each(function(){t(this).one("load error",function(){++o===i&&n()}).each(function(){this.complete&&t(this).trigger("load")})})},d=function(){if(o.settings.infiniteLoop&&"fade"!==o.settings.mode&&!o.settings.ticker){var e="vertical"===o.settings.mode?o.settings.minSlides:o.settings.maxSlides,n=o.children.slice(0,e).clone(!0).addClass("bx-clone"),i=o.children.slice(-e).clone(!0).addClass("bx-clone");o.settings.ariaHidden&&(n.attr("aria-hidden",!0),i.attr("aria-hidden",!0)),s.append(n).prepend(i)}o.loader.remove(),y(),"vertical"===o.settings.mode&&(o.settings.adaptiveHeight=!0),o.viewport.height(u()),s.redrawSlider(),o.settings.onSliderLoad.call(s,o.active.index),o.initialized=!0,o.settings.responsive&&t(window).bind("resize",F),o.settings.auto&&o.settings.autoStart&&(m()>1||o.settings.autoSlideForOnePage)&&A(),o.settings.ticker&&H(),o.settings.pager&&W(o.settings.startSlide),o.settings.controls&&O(),o.settings.touchEnabled&&!o.settings.ticker&&$(),o.settings.keyboardEnabled&&!o.settings.ticker&&t(document).keydown(N)},u=function(){var e=0,n=t();if("vertical"===o.settings.mode||o.settings.adaptiveHeight)if(o.carousel){var s=1===o.settings.moveSlides?o.active.index:o.active.index*v();for(n=o.children.eq(s),i=1;i<=o.settings.maxSlides-1;i++)n=s+i>=o.children.length?n.add(o.children.eq(i-1)):n.add(o.children.eq(s+i))}else n=o.children.eq(o.active.index);else n=o.children;return"vertical"===o.settings.mode?(n.each(function(n){e+=t(this).outerHeight()}),o.settings.slideMargin>0&&(e+=o.settings.slideMargin*(o.settings.minSlides-1))):e=Math.max.apply(Math,n.map(function(){return t(this).outerHeight(!1)}).get()),"border-box"===o.viewport.css("box-sizing")?e+=parseFloat(o.viewport.css("padding-top"))+parseFloat(o.viewport.css("padding-bottom"))+parseFloat(o.viewport.css("border-top-width"))+parseFloat(o.viewport.css("border-bottom-width")):"padding-box"===o.viewport.css("box-sizing")&&(e+=parseFloat(o.viewport.css("padding-top"))+parseFloat(o.viewport.css("padding-bottom"))),e},p=function(){var t="100%";return o.settings.slideWidth>0&&(t="horizontal"===o.settings.mode?o.settings.maxSlides*o.settings.slideWidth+(o.settings.maxSlides-1)*o.settings.slideMargin:o.settings.slideWidth),t},f=function(){var t=o.settings.slideWidth,e=o.viewport.width();if(0===o.settings.slideWidth||o.settings.slideWidth>e&&!o.carousel||"vertical"===o.settings.mode)t=e;else if(o.settings.maxSlides>1&&"horizontal"===o.settings.mode){if(e>o.maxThreshold)return t;e<o.minThreshold?t=(e-o.settings.slideMargin*(o.settings.minSlides-1))/o.settings.minSlides:o.settings.shrinkItems&&(t=Math.floor((e+o.settings.slideMargin)/Math.ceil((e+o.settings.slideMargin)/(t+o.settings.slideMargin))-o.settings.slideMargin))}return t},g=function(){var t=1,e=null;return"horizontal"===o.settings.mode&&o.settings.slideWidth>0?o.viewport.width()<o.minThreshold?t=o.settings.minSlides:o.viewport.width()>o.maxThreshold?t=o.settings.maxSlides:(e=o.children.first().width()+o.settings.slideMargin,t=Math.floor((o.viewport.width()+o.settings.slideMargin)/e)):"vertical"===o.settings.mode&&(t=o.settings.minSlides),t},m=function(){var t=0,e=0,n=0;if(o.settings.moveSlides>0)if(o.settings.infiniteLoop)t=Math.ceil(o.children.length/v());else for(;e<o.children.length;)++t,e=n+g(),n+=o.settings.moveSlides<=g()?o.settings.moveSlides:g();else t=Math.ceil(o.children.length/g());return t},v=function(){return o.settings.moveSlides>0&&o.settings.moveSlides<=g()?o.settings.moveSlides:g()},y=function(){var t,e,n;o.children.length>o.settings.maxSlides&&o.active.last&&!o.settings.infiniteLoop?"horizontal"===o.settings.mode?(e=o.children.last(),t=e.position(),b(-(t.left-(o.viewport.width()-e.outerWidth())),"reset",0)):"vertical"===o.settings.mode&&(n=o.children.length-o.settings.minSlides,t=o.children.eq(n).position(),b(-t.top,"reset",0)):(t=o.children.eq(o.active.index*v()).position(),o.active.index===m()-1&&(o.active.last=!0),void 0!==t&&("horizontal"===o.settings.mode?b(-t.left,"reset",0):"vertical"===o.settings.mode&&b(-t.top,"reset",0)))},b=function(e,n,i,r){var a,l;o.usingCSS?(l="vertical"===o.settings.mode?"translate3d(0, "+e+"px, 0)":"translate3d("+e+"px, 0, 0)",s.css("-"+o.cssPrefix+"-transition-duration",i/1e3+"s"),"slide"===n?(s.css(o.animProp,l),0!==i?s.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(e){t(e.target).is(s)&&(s.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),L())}):L()):"reset"===n?s.css(o.animProp,l):"ticker"===n&&(s.css("-"+o.cssPrefix+"-transition-timing-function","linear"),s.css(o.animProp,l),0!==i?s.bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd",function(e){t(e.target).is(s)&&(s.unbind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd"),b(r.resetValue,"reset",0),D())}):(b(r.resetValue,"reset",0),D()))):(a={},a[o.animProp]=e,"slide"===n?s.animate(a,i,o.settings.easing,function(){L()}):"reset"===n?s.css(o.animProp,e):"ticker"===n&&s.animate(a,i,"linear",function(){b(r.resetValue,"reset",0),D()}))},w=function(){for(var e="",n="",i=m(),s=0;s<i;s++)n="",o.settings.buildPager&&t.isFunction(o.settings.buildPager)||o.settings.pagerCustom?(n=o.settings.buildPager(s),o.pagerEl.addClass("bx-custom-pager")):(n=s+1,o.pagerEl.addClass("bx-default-pager")),e+='<div class="bx-pager-item"><a href="" data-slide-index="'+s+'" class="bx-pager-link">'+n+"</a></div>";o.pagerEl.html(e)},x=function(){o.settings.pagerCustom?o.pagerEl=t(o.settings.pagerCustom):(o.pagerEl=t('<div class="bx-pager" />'),o.settings.pagerSelector?t(o.settings.pagerSelector).html(o.pagerEl):o.controls.el.addClass("bx-has-pager").append(o.pagerEl),w()),o.pagerEl.on("click touchend","a",k)},T=function(){o.controls.next=t('<a class="bx-next" href="">'+o.settings.nextText+"</a>"),o.controls.prev=t('<a class="bx-prev" href="">'+o.settings.prevText+"</a>"),o.controls.next.bind("click touchend",C),o.controls.prev.bind("click touchend",_),o.settings.nextSelector&&t(o.settings.nextSelector).append(o.controls.next),o.settings.prevSelector&&t(o.settings.prevSelector).append(o.controls.prev),o.settings.nextSelector||o.settings.prevSelector||(o.controls.directionEl=t('<div class="bx-controls-direction" />'),o.controls.directionEl.append(o.controls.prev).append(o.controls.next),o.controls.el.addClass("bx-has-controls-direction").append(o.controls.directionEl))},S=function(){o.controls.start=t('<div class="bx-controls-auto-item"><a class="bx-start" href="">'+o.settings.startText+"</a></div>"),o.controls.stop=t('<div class="bx-controls-auto-item"><a class="bx-stop" href="">'+o.settings.stopText+"</a></div>"),o.controls.autoEl=t('<div class="bx-controls-auto" />'),o.controls.autoEl.on("click",".bx-start",I),o.controls.autoEl.on("click",".bx-stop",E),o.settings.autoControlsCombine?o.controls.autoEl.append(o.controls.start):o.controls.autoEl.append(o.controls.start).append(o.controls.stop),o.settings.autoControlsSelector?t(o.settings.autoControlsSelector).html(o.controls.autoEl):o.controls.el.addClass("bx-has-controls-auto").append(o.controls.autoEl),B(o.settings.autoStart?"stop":"start")},z=function(){o.children.each(function(e){var n=t(this).find("img:first").attr("title");void 0!==n&&(""+n).length&&t(this).append('<div class="bx-caption"><span>'+n+"</span></div>")})},C=function(t){t.preventDefault(),o.controls.el.hasClass("disabled")||(o.settings.auto&&o.settings.stopAutoOnClick&&s.stopAuto(),s.goToNextSlide())},_=function(t){t.preventDefault(),o.controls.el.hasClass("disabled")||(o.settings.auto&&o.settings.stopAutoOnClick&&s.stopAuto(),s.goToPrevSlide())},I=function(t){s.startAuto(),t.preventDefault()},E=function(t){s.stopAuto(),t.preventDefault()},k=function(e){var n,i;e.preventDefault(),o.controls.el.hasClass("disabled")||(o.settings.auto&&o.settings.stopAutoOnClick&&s.stopAuto(),n=t(e.currentTarget),void 0!==n.attr("data-slide-index")&&(i=parseInt(n.attr("data-slide-index")))!==o.active.index&&s.goToSlide(i))},W=function(e){var n=o.children.length;return"short"===o.settings.pagerType?(o.settings.maxSlides>1&&(n=Math.ceil(o.children.length/o.settings.maxSlides)),void o.pagerEl.html(e+1+o.settings.pagerShortSeparator+n)):(o.pagerEl.find("a").removeClass("active"),void o.pagerEl.each(function(n,i){t(i).find("a").eq(e).addClass("active")}))},L=function(){if(o.settings.infiniteLoop){var t="";0===o.active.index?t=o.children.eq(0).position():o.active.index===m()-1&&o.carousel?t=o.children.eq((m()-1)*v()).position():o.active.index===o.children.length-1&&(t=o.children.eq(o.children.length-1).position()),t&&("horizontal"===o.settings.mode?b(-t.left,"reset",0):"vertical"===o.settings.mode&&b(-t.top,"reset",0))}o.working=!1,o.settings.onSlideAfter.call(s,o.children.eq(o.active.index),o.oldIndex,o.active.index)},B=function(t){o.settings.autoControlsCombine?o.controls.autoEl.html(o.controls[t]):(o.controls.autoEl.find("a").removeClass("active"),o.controls.autoEl.find("a:not(.bx-"+t+")").addClass("active"))},O=function(){1===m()?(o.controls.prev.addClass("disabled"),o.controls.next.addClass("disabled")):!o.settings.infiniteLoop&&o.settings.hideControlOnEnd&&(0===o.active.index?(o.controls.prev.addClass("disabled"),o.controls.next.removeClass("disabled")):o.active.index===m()-1?(o.controls.next.addClass("disabled"),o.controls.prev.removeClass("disabled")):(o.controls.prev.removeClass("disabled"),o.controls.next.removeClass("disabled")))},A=function(){o.settings.autoDelay>0?setTimeout(s.startAuto,o.settings.autoDelay):(s.startAuto(),t(window).focus(function(){s.startAuto()}).blur(function(){s.stopAuto()})),o.settings.autoHover&&s.hover(function(){o.interval&&(s.stopAuto(!0),o.autoPaused=!0)},function(){o.autoPaused&&(s.startAuto(!0),o.autoPaused=null)})},H=function(){var e,n,i,r,a,l,h,c,d=0;"next"===o.settings.autoDirection?s.append(o.children.clone().addClass("bx-clone")):(s.prepend(o.children.clone().addClass("bx-clone")),e=o.children.first().position(),d="horizontal"===o.settings.mode?-e.left:-e.top),b(d,"reset",0),o.settings.pager=!1,o.settings.controls=!1,o.settings.autoControls=!1,o.settings.tickerHover&&(o.usingCSS?(r="horizontal"===o.settings.mode?4:5,o.viewport.hover(function(){n=s.css("-"+o.cssPrefix+"-transform"),i=parseFloat(n.split(",")[r]),b(i,"reset",0)},function(){c=0,o.children.each(function(e){c+="horizontal"===o.settings.mode?t(this).outerWidth(!0):t(this).outerHeight(!0)}),a=o.settings.speed/c,l="horizontal"===o.settings.mode?"left":"top",h=a*(c-Math.abs(parseInt(i))),D(h)})):o.viewport.hover(function(){s.stop()},function(){c=0,o.children.each(function(e){c+="horizontal"===o.settings.mode?t(this).outerWidth(!0):t(this).outerHeight(!0)}),a=o.settings.speed/c,l="horizontal"===o.settings.mode?"left":"top",h=a*(c-Math.abs(parseInt(s.css(l)))),D(h)})),D()},D=function(t){var e,n,i,r=t||o.settings.speed,a={left:0,top:0},l={left:0,top:0};"next"===o.settings.autoDirection?a=s.find(".bx-clone").first().position():l=o.children.first().position(),e="horizontal"===o.settings.mode?-a.left:-a.top,n="horizontal"===o.settings.mode?-l.left:-l.top,i={resetValue:n},b(e,"ticker",r,i)},P=function(e){var n=t(window),i={top:n.scrollTop(),left:n.scrollLeft()},o=e.offset();return i.right=i.left+n.width(),i.bottom=i.top+n.height(),o.right=o.left+e.outerWidth(),o.bottom=o.top+e.outerHeight(),!(i.right<o.left||i.left>o.right||i.bottom<o.top||i.top>o.bottom)},N=function(t){var e=document.activeElement.tagName.toLowerCase();if(null==new RegExp(e,["i"]).exec("input|textarea")&&P(s)){if(39===t.keyCode)return C(t),!1;if(37===t.keyCode)return _(t),!1}},$=function(){o.touch={start:{x:0,y:0},end:{x:0,y:0}},o.viewport.bind("touchstart MSPointerDown pointerdown",M),o.viewport.on("click",".bxslider a",function(t){o.viewport.hasClass("click-disabled")&&(t.preventDefault(),o.viewport.removeClass("click-disabled"))})},M=function(t){if(o.controls.el.addClass("disabled"),o.working)t.preventDefault(),o.controls.el.removeClass("disabled");else{o.touch.originalPos=s.position();var e=t.originalEvent,n=void 0!==e.changedTouches?e.changedTouches:[e];o.touch.start.x=n[0].pageX,o.touch.start.y=n[0].pageY,o.viewport.get(0).setPointerCapture&&(o.pointerId=e.pointerId,o.viewport.get(0).setPointerCapture(o.pointerId)),o.viewport.bind("touchmove MSPointerMove pointermove",j),o.viewport.bind("touchend MSPointerUp pointerup",q),o.viewport.bind("MSPointerCancel pointercancel",R)}},R=function(t){b(o.touch.originalPos.left,"reset",0),o.controls.el.removeClass("disabled"),o.viewport.unbind("MSPointerCancel pointercancel",R),o.viewport.unbind("touchmove MSPointerMove pointermove",j),o.viewport.unbind("touchend MSPointerUp pointerup",q),o.viewport.get(0).releasePointerCapture&&o.viewport.get(0).releasePointerCapture(o.pointerId)},j=function(t){var e=t.originalEvent,n=void 0!==e.changedTouches?e.changedTouches:[e],i=Math.abs(n[0].pageX-o.touch.start.x),s=Math.abs(n[0].pageY-o.touch.start.y),r=0,a=0;3*i>s&&o.settings.preventDefaultSwipeX?t.preventDefault():3*s>i&&o.settings.preventDefaultSwipeY&&t.preventDefault(),"fade"!==o.settings.mode&&o.settings.oneToOneTouch&&("horizontal"===o.settings.mode?(a=n[0].pageX-o.touch.start.x,r=o.touch.originalPos.left+a):(a=n[0].pageY-o.touch.start.y,r=o.touch.originalPos.top+a),b(r,"reset",0))},q=function(t){o.viewport.unbind("touchmove MSPointerMove pointermove",j),o.controls.el.removeClass("disabled");var e=t.originalEvent,n=void 0!==e.changedTouches?e.changedTouches:[e],i=0,r=0;o.touch.end.x=n[0].pageX,o.touch.end.y=n[0].pageY,"fade"===o.settings.mode?(r=Math.abs(o.touch.start.x-o.touch.end.x))>=o.settings.swipeThreshold&&(o.touch.start.x>o.touch.end.x?s.goToNextSlide():s.goToPrevSlide(),s.stopAuto()):("horizontal"===o.settings.mode?(r=o.touch.end.x-o.touch.start.x,i=o.touch.originalPos.left):(r=o.touch.end.y-o.touch.start.y,i=o.touch.originalPos.top),!o.settings.infiniteLoop&&(0===o.active.index&&r>0||o.active.last&&r<0)?b(i,"reset",200):Math.abs(r)>=o.settings.swipeThreshold?(r<0?s.goToNextSlide():s.goToPrevSlide(),s.stopAuto()):b(i,"reset",200)),o.viewport.unbind("touchend MSPointerUp pointerup",q),o.viewport.get(0).releasePointerCapture&&o.viewport.get(0).releasePointerCapture(o.pointerId)},F=function(e){if(o.initialized)if(o.working)window.setTimeout(F,10);else{var n=t(window).width(),i=t(window).height();r===n&&a===i||(r=n,a=i,s.redrawSlider(),o.settings.onSliderResize.call(s,o.active.index))}},U=function(t){var e=g();o.settings.ariaHidden&&!o.settings.ticker&&(o.children.attr("aria-hidden","true"),o.children.slice(t,t+e).attr("aria-hidden","false"))},Y=function(t){return t<0?o.settings.infiniteLoop?m()-1:o.active.index:t>=m()?o.settings.infiniteLoop?0:o.active.index:t};return s.goToSlide=function(e,n){var i,r,a,l,h=!0,c=0,d={left:0,top:0},p=null;if(o.oldIndex=o.active.index,o.active.index=Y(e),!o.working&&o.active.index!==o.oldIndex){if(o.working=!0,void 0!==(h=o.settings.onSlideBefore.call(s,o.children.eq(o.active.index),o.oldIndex,o.active.index))&&!h)return o.active.index=o.oldIndex,void(o.working=!1);"next"===n?o.settings.onSlideNext.call(s,o.children.eq(o.active.index),o.oldIndex,o.active.index)||(h=!1):"prev"===n&&(o.settings.onSlidePrev.call(s,o.children.eq(o.active.index),o.oldIndex,o.active.index)||(h=!1)),o.active.last=o.active.index>=m()-1,(o.settings.pager||o.settings.pagerCustom)&&W(o.active.index),o.settings.controls&&O(),"fade"===o.settings.mode?(o.settings.adaptiveHeight&&o.viewport.height()!==u()&&o.viewport.animate({height:u()},o.settings.adaptiveHeightSpeed),o.children.filter(":visible").fadeOut(o.settings.speed).css({zIndex:0}),o.children.eq(o.active.index).css("zIndex",o.settings.slideZIndex+1).fadeIn(o.settings.speed,function(){t(this).css("zIndex",o.settings.slideZIndex),L()})):(o.settings.adaptiveHeight&&o.viewport.height()!==u()&&o.viewport.animate({height:u()},o.settings.adaptiveHeightSpeed),!o.settings.infiniteLoop&&o.carousel&&o.active.last?"horizontal"===o.settings.mode?(p=o.children.eq(o.children.length-1),d=p.position(),c=o.viewport.width()-p.outerWidth()):(i=o.children.length-o.settings.minSlides,d=o.children.eq(i).position()):o.carousel&&o.active.last&&"prev"===n?(r=1===o.settings.moveSlides?o.settings.maxSlides-v():(m()-1)*v()-(o.children.length-o.settings.maxSlides),p=s.children(".bx-clone").eq(r),d=p.position()):"next"===n&&0===o.active.index?(d=s.find("> .bx-clone").eq(o.settings.maxSlides).position(),o.active.last=!1):e>=0&&(l=e*parseInt(v()),d=o.children.eq(l).position()),void 0!==d?(a="horizontal"===o.settings.mode?-(d.left-c):-d.top,b(a,"slide",o.settings.speed)):o.working=!1),o.settings.ariaHidden&&U(o.active.index*v())}},s.goToNextSlide=function(){if(o.settings.infiniteLoop||!o.active.last){var t=parseInt(o.active.index)+1;s.goToSlide(t,"next")}},s.goToPrevSlide=function(){if(o.settings.infiniteLoop||0!==o.active.index){var t=parseInt(o.active.index)-1;s.goToSlide(t,"prev")}},s.startAuto=function(t){o.interval||(o.interval=setInterval(function(){"next"===o.settings.autoDirection?s.goToNextSlide():s.goToPrevSlide()},o.settings.pause),o.settings.autoControls&&!0!==t&&B("stop"))},s.stopAuto=function(t){o.interval&&(clearInterval(o.interval),o.interval=null,o.settings.autoControls&&!0!==t&&B("start"))},s.getCurrentSlide=function(){return o.active.index},s.getCurrentSlideElement=function(){return o.children.eq(o.active.index)},s.getSlideElement=function(t){return o.children.eq(t)},s.getSlideCount=function(){return o.children.length},s.isWorking=function(){return o.working},s.redrawSlider=function(){o.children.add(s.find(".bx-clone")).outerWidth(f()),o.viewport.css("height",u()),o.settings.ticker||y(),o.active.last&&(o.active.index=m()-1),o.active.index>=m()&&(o.active.last=!0),o.settings.pager&&!o.settings.pagerCustom&&(w(),W(o.active.index)),o.settings.ariaHidden&&U(o.active.index*v())},s.destroySlider=function(){o.initialized&&(o.initialized=!1,t(".bx-clone",this).remove(),o.children.each(function(){void 0!==t(this).data("origStyle")?t(this).attr("style",t(this).data("origStyle")):t(this).removeAttr("style")}),void 0!==t(this).data("origStyle")?this.attr("style",t(this).data("origStyle")):t(this).removeAttr("style"),t(this).unwrap().unwrap(),o.controls.el&&o.controls.el.remove(),o.controls.next&&o.controls.next.remove(),o.controls.prev&&o.controls.prev.remove(),o.pagerEl&&o.settings.controls&&!o.settings.pagerCustom&&o.pagerEl.remove(),t(".bx-caption",this).remove(),o.controls.autoEl&&o.controls.autoEl.remove(),clearInterval(o.interval),o.settings.responsive&&t(window).unbind("resize",F),o.settings.keyboardEnabled&&t(document).unbind("keydown",N),t(this).removeData("bxSlider"))},s.reloadSlider=function(e){void 0!==e&&(n=e),s.destroySlider(),l(),t(s).data("bxSlider",this)},l(),t(s).data("bxSlider",this),this}}}(jQuery);;
function showBasketPopup(e,t){$(".basketMessage").html(""),e?$(".basketMessage").html(t+' has been added to your <a href="'+siteURL+'/basket">basket</a>.'):$(".basketMessage").html("Sorry, an error has occured and "+t+" could not be added to your basket. Please try again."),$(".basketPopup").show()}function showCorrectForm(e){switch(e){case"general":$(".contact-form #press").addClass("__hidden"),$(".contact-form #trade").addClass("__hidden"),$('.page-image img[data-tag="press"]').addClass("__hidden"),$('.page-image img[data-tag="trade"]').addClass("__hidden"),setTimeout(function(){$(".contact-form #press").addClass("__noHeight"),$(".contact-form #trade").addClass("__noHeight")},250);break;case"press":$(".contact-form #trade").addClass("__hidden"),$(".contact-form #general").addClass("__hidden"),$('.page-image img[data-tag="general"]').addClass("__hidden"),$('.page-image img[data-tag="trade"]').addClass("__hidden"),setTimeout(function(){$(".contact-form #trade").addClass("__noHeight"),$(".contact-form #general").addClass("__noHeight")},250);break;case"trade":$(".contact-form #press").addClass("__hidden"),$(".contact-form #general").addClass("__hidden"),$('.page-image img[data-tag="press"]').addClass("__hidden"),$('.page-image img[data-tag="general"]').addClass("__hidden"),setTimeout(function(){$(".contact-form #press").addClass("__noHeight"),$(".contact-form #general").addClass("__noHeight")},250)}setTimeout(function(){$(".contact-form #"+e).removeClass("__noHeight"),$(".contact-form #"+e).removeClass("__hidden"),$('.page-image img[data-tag="'+e+'"]').removeClass("__hidden")},250)}function createMap(e,t,a,i){function s(e,t){var a="#distance_"+e.label,i="#title_"+e.label,s="#website_"+e.label,r=$(i).text(),n=$(a).text(),o=$(s).attr("href");return contantString="<div id='close' class='g-infobubble'><div class='g-infobubble__container'><div class='g-infobubble__container__body'><h4>"+r+"</h4><p>"+t+"</p></div><div class='g-infobubble__container__footer'><a href='"+o+"'>Get Directions</a><a id='close'>"+n+"</a></div></div>"}var r=($(a).data("ukcenter"),$(a).data("coordinates")),n=(!(!r||""===r)&&r.split("|"),$(a).data("overseas")),o=(!(!n||""===n)&&n.split("|"),$(a).data("pincoords")),l=o.split(","),d=new google.maps.Map(a,{center:e,zoom:t,disableDefaultUI:!0,zoomControl:!0,scrollwheel:!1}),c=[{stylers:[{hue:"#64B253"},{saturation:-80}]}];d.setOptions({styles:c});var p={scaledSize:new google.maps.Size(38,38),origin:new google.maps.Point(0,0),anchor:new google.maps.Point(11,30),url:"https://d105txpzekqrfa.cloudfront.net/uploads/20161215113733/Combined-Shape-Copy.svg"};if($(".switch_views").click(function(){$(".js-info-bubble-close").click()}),l.length>0)for(var u=[],h=[],m=0;m<l.length;m++)if(""!==l[m]){var g=l[m].split(" "),v=parseFloat(g[0]),f=parseFloat(g[1]),_=(1+m).toString();u[_]=new google.maps.Marker({position:{lat:v,lng:f},map:d,icon:p,label:_}),google.maps.event.addListener(u[_],"click",function(e){$(".js-info-bubble-close").click(),h[this.label]=new InfoBubble({map:d,content:"country"==i?s(this,"Overseas Retailer"):s(this,"Local Retailer"),shadowStyle:1,padding:0,backgroundColor:"#ffffff",borderRadius:0,arrowSize:15,disableAutoPan:!0,hideCloseButton:!1,arrowPosition:30,backgroundClassName:"transparent",arrowStyle:2,closeSrc:"http://www.freeiconspng.com/uploads/close-button-png-27.png"}),h[this.label].open(d,u[this.label])})}}function startSlider(){for(var e,t=['<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="31px" height="59px" viewBox="0 0 31 59" version="1.1" class="prev-slide coir">','<g id="Home" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square" stroke="#7C7C7C">','<g id="vivid" transform="translate(-45.000000, -553.000000)" stroke="#7C7C7C">','<g id="slider-arrow" transform="translate(60.500000, 582.000000) rotate(-180.000000) translate(-60.500000, -582.000000) translate(46.000000, 553.000000)"  stroke="#7C7C7C">','<path d="M0.201388889,0.201388889 L28.8071201,28.8071201" id="Line"/>','<path d="M0,57.6057312 L28.6057312,29" id="Line"/>',"</g>","</g>","</g>","</svg>"],a=['<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="31px" height="58px" viewBox="0 0 31 58" version="1.1" class="next-slide coir">','<g id="Home" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="square" stroke="#7C7C7C">','<g id="vivid" transform="translate(-1556.000000, -553.000000)" stroke="#7C7C7C">','<g id="slider-arrow" transform="translate(1557.000000, 553.000000)"  stroke="#7C7C7C">','<path d="M0.201388889,0.201388889 L28.8071201,28.8071201" id="Line"/>','<path d="M0,57.6057312 L28.6057312,29" id="Line"/>',"</g>","</g>","</g>","</svg>"],i=document.querySelectorAll(".material-view-slider ul li"),s=0;s<i.length;s++)if(i[s].hasAttribute("data-show")){e=i[s].dataset.show;break}var r;$(".slidee").data("total")>1&&(r=$(".material-view-slider ul#material-view-slider-list").bxSlider({mode:"fade",startSlide:e,nextSelector:"#material-view-slider-next",prevSelector:"#material-view-slider-prev",onSliderLoad:function(){var e=$(".slidee[data-show]").height();$(".material-view-slider").css("min-height",e+"px")},onSlideNext:function(){var e=$("#material-view-slider-prev-text h3").data("current"),t=$("#material-view-slider-prev-text h3").data("total"),a=e+1;a===t+1&&(a=1);var i=a+1,s=a-1;0===s&&(s=t),i===t+1&&(i=1),$("#material-prev-index").text(s),$("#material-next-index").text(i),$("#material-view-slider-prev-text h3").data("current",a);var r=this.getCurrentSlide(),n=$("#material-view-slider-list").children()[r],o=$(n).height();$(".material-view-slider").css("min-height",o+"px");var l=$(n).data("slug"),d=window.location.href,c=d.indexOf("/swatches"),p=c+10,u=d.substr(p),h=u.indexOf("/"),m=p+h+1,g=d.substr(0,m),v=g+l+"/";window.history.pushState(null,"",v)},onSlidePrev:function(){var e=$("#material-view-slider-prev-text h3").data("current"),t=$("#material-view-slider-prev-text h3").data("total"),a=e-1;0===a&&(a=t);var i=a+1,s=a-1;0===s&&(s=t),i===t+1&&(i=1),$("#material-prev-index").text(s),$("#material-next-index").text(i),$("#material-view-slider-prev-text h3").data("current",a);var r=this.getCurrentSlide(),n=$("#material-view-slider-list").children()[r],o=$(n).height();$(".material-view-slider").css("min-height",o+"px");var l=$(n).data("slug"),d=window.location.href,c=d.indexOf("/swatches"),p=c+10,u=d.substr(p),h=u.indexOf("/"),m=p+h+1,g=d.substr(0,m),v=g+l+"/";window.history.pushState(null,"",v)}})),window.onpopstate=function(e){var t=window.location.href,a=t.indexOf("/swatches"),i=a+10,s=t.substr(i),n=s.indexOf("/"),o=i+n+1,l=t.substring(o,t.length-1),d=$('.slidee[data-slug="'+l+'"]').data("index");r.goToSlide(d)},$(".range__goto").on("click",function(e){e.preventDefault(),e.stopPropagation();var t=$(this).parent().data("index");r.goToSlide(t);var a=r.getCurrentSlide(),i=$("#material-view-slider-list").children()[a],s=$(i).data("slug"),n=window.location.href,o=n.indexOf("/swatches"),l=o+10,d=n.substr(l),c=d.indexOf("/"),p=l+c+1,u=n.substr(0,p),h=u+s+"/";window.history.pushState(null,"",h);var m=a+1,g=$("#material-view-slider-prev-text h3").data("total"),v=m-1,f=m+1;return 0===v&&(v=g),f===g+1&&(f=1),$("#material-prev-index").text(v),$("#material-next-index").text(f),$("#material-view-slider-prev-text h3").data("current",m),!1}),$(".bx-prev").addClass("no-effect"),$(".bx-next").addClass("no-effect"),$(".bx-prev").html(t.join("")),$(".bx-next").html(a.join("")),clearInterval(sliderInterval)}function createSuperslider(){$("#super-slider").superslides({play:5e3,animation:"fade",animation_speed:1200}),clearInterval(superslidesInterval)}function createSuperslider(){$("#super-slider").superslides({play:5e3,animation:"fade",animation_speed:1200}),clearInterval(superslidesInterval)}Array.prototype.indexOf||(Array.prototype.indexOf=function(e){for(var t=this,a=0,i=t.length;a<i;++a)if(t[a]===e)return a;return-1}),Array.prototype.map||(Array.prototype.map=function(e,t){for(var a=this,i=[],s=0,r=a.length;s<r;++s)a[s],i.push(e.call(t||window,a[s],s,a));return i}),$(document).ready(function(){$(".top-bar").headroom({offset:50,tolerance:5}),$(".woocommerce-message").length>0&&setTimeout(function(){$(".woocommerce-message").fadeOut(800)},4e3),$("#place_order").length>0&&$("#place_order").on("click",function(e){var t=!1;if(""===$("#shipping_first_name").val()&&($("#shipping_first_name").css("cssText","border: 1px solid #a00 !important"),$(".shipping-address-errors").append("<p>Please enter a first name.</p>"),t=!0),""===$("#shipping_last_name").val()&&($("#shipping_last_name").css("cssText","border: 1px solid #a00 !important"),$(".shipping-address-errors").append("<p>Please enter a last name.</p>"),t=!0),""===$("#shipping_address_1").val()&&($("#shipping_address_1").css("cssText","border: 1px solid #a00 !important"),$(".shipping-address-errors").append("<p>Please enter a street address.</p>"),t=!0),""===$("#shipping_city").val()&&($("#shipping_city").css("cssText","border: 1px solid #a00 !important"),$(".shipping-address-errors").append("<p>Please enter a town or city.</p>"),t=!0),""===$("#shipping_postcode").val()&&($("#shipping_postcode").css("cssText","border: 1px solid #a00 !important"),$(".shipping-address-errors").append("<p>Please enter a post code.</p>"),t=!0),""===$("#billing_email").val()&&($("#billing_email").css("cssText","border: 1px solid #a00 !important"),$(".shipping-address-errors").append("<p>Please enter an email address.</p>"),t=!0),""===$("#account_password").val()&&($("#account_password").css("cssText","border: 1px solid #a00 !important"),$(".shipping-address-errors").append("<p>Please enter an email address.</p>"),t=!0),t)return console.log(6),e.preventDefault(),e.stopPropagation(),!1}),$(".woocommerce").length>0&&$(".woocommerce .form-row").each(function(e,t){var a=$(t).children("label"),i=a.text(),s=$(t).children("input"),r=s.attr("placeholder");if(void 0!==r){""!==r&&(i=r);var n=i.replace("*","").replace("(optional)","");s.attr("placeholder",n)}}),$("input#username").attr("placeholder","Email"),$("input#password").attr("placeholder","Password"),$("input#reg_email").attr("placeholder","Email"),$("input#reg_password").attr("placeholder","Password"),$('.page-template-hospitality-register input[name="reg_submit"]').on("click",function(){var e=$('input[name="reg_email"]').val();$('input[name="reg_username"]').val(e)}),$(document).on("click","#close-basket-popup",function(e){return e.preventDefault(),e.stopPropagation(),$(".basketPopup").hide(),!1}),$(".checkout-button.wc-forward").text("Checkout"),!Modernizr.objectfit&&$(".object-fit-container").length>0&&$(".object-fit-container").each(function(){var e=$(this),t=e.find("img").prop("src");t&&(e.css("background-image","url("+t+")"),e.addClass("fallback-object-fit"))})}),function(){function e(){for(var e=this;-1===e.className.indexOf("nav-menu");)"li"===e.tagName.toLowerCase()&&(-1!==e.className.indexOf("focus")?e.className=e.className.replace(" focus",""):e.className+=" focus"),e=e.parentElement}var t,a,i,s,r,n,o;if((t=document.getElementById("site-navigation"))&&void 0!==(a=t.getElementsByTagName("button")[0])){if(void 0===(i=t.getElementsByTagName("ul")[0]))return void(a.style.display="none");for(i.setAttribute("aria-expanded","false"),-1===i.className.indexOf("nav-menu")&&(i.className+=" nav-menu"),a.onclick=function(){-1!==t.className.indexOf("toggled")?(t.className=t.className.replace(" toggled",""),a.setAttribute("aria-expanded","false"),i.setAttribute("aria-expanded","false")):(t.className+=" toggled",a.setAttribute("aria-expanded","true"),i.setAttribute("aria-expanded","true"))},s=i.getElementsByTagName("a"),r=i.getElementsByTagName("ul"),n=0,o=r.length;n<o;n++)r[n].parentNode.setAttribute("aria-haspopup","true");for(n=0,o=s.length;n<o;n++)s[n].addEventListener("focus",e,!0),s[n].addEventListener("blur",e,!0);!function(e){var t,a,i=e.querySelectorAll(".menu-item-has-children > a, .page_item_has_children > a");if("ontouchstart"in window)for(t=function(e){var t,a=this.parentNode;if(a.classList.contains("focus"))a.classList.remove("focus");else{for(e.preventDefault(),t=0;t<a.parentNode.children.length;++t)a!==a.parentNode.children[t]&&a.parentNode.children[t].classList.remove("focus");a.classList.add("focus")}},a=0;a<i.length;++a)i[a].addEventListener("touchstart",t,!1)}(t)}}(),jQuery(document).ready(function(){var e=jQuery;e(function(){e(".about__timeline__btn").click(function(){e(this).toggleClass("is-active"),e("body").toggleClass("show-about-timeline"),e(".is-active").click(function(){e("body").toggleClass("hide-about-timeline")})})}),e(function(){e(".about__scroller__btn").click(function(){e(this).toggleClass("is-active"),e("body").toggleClass("show-about-scroller"),e(".is-active").click(function(){e("body").toggleClass("hide-about-scroller")})})}),e(".about__scroller__btn:not(.about__scroller__btn--close)").on("click",function(){e("#pagepilling").pagepiling()}),e(".about__scroller__btn--close").on("click",function(){e("#pillingcss").remove(),e("#pillingjs").remove()}),e(".about__scroller__start").on("click",function(){e.fn.pagepiling.moveTo(1),e("body").scrollTop(e(window).height()),e("#pagepilling").show(),e("#pp-nav").show(),e(".about__scroller").hide(),e(".about__timeline").hide(),e(".about__scroller__btn").hide(),e(".about__sidetitle").hide()}),e(".scroller__top").on("click",function(){e(".about__scroller").show(),e(".about__timeline").show(),e(".about__scroller__btn").show(),e(".about__sidetitle").show(),e("#pagepilling").hide(),e("#pp-nav").hide(),e("body").scrollTop(0)}),e(".section__next").on("click",function(){e.fn.pagepiling.moveSectionDown()})});var $=jQuery;$(document).ready(function(){$("#basket-link").on("click",function(e){e.preventDefault(),e.stopPropagation(),document.querySelector(".basket-dropdown").classList.contains("open")?document.querySelector(".basket-dropdown").classList.remove("open"):document.querySelector(".basket-dropdown").classList.add("open")}),$(".close-basket-dropdown").on("click",function(e){e.preventDefault(),e.stopPropagation(),document.querySelector(".basket-dropdown").classList.remove("open")})});var $=jQuery;$(document).ready(function(){if($("body").hasClass("page-template-contact")){var e=setInterval(function(){window.location.hash&&window.scrollTo(0,0)},1);setTimeout(function(){clearInterval(e)},200)}$(".contact-select select").change(function(){var e=$(".contact-select select").val(),t=setInterval(function(){window.location.hash&&window.scrollTo(0,0)},1);setTimeout(function(){clearInterval(t)},200),window.location.hash=e,showCorrectForm(e)});var t=window.location.hash.substr(1);if(""!==t){["general","press","trade"].indexOf(t)>-1&&($('.contact-select select option[value="'+t+'"]').attr("selected","selected"),showCorrectForm(t))}}),$(document).ready(function(){if($("body").hasClass("page-template-retailer")){var e=window.location.search.substr(1).split("=")[0],t={},a=14,i=document.getElementById("google-map"),s=$(i).data("ukcenter"),r=$(i).data("overseascenter");if(""!==s){var n=s.split(" ");t={lat:parseFloat(n[0]),lng:parseFloat(n[1])},a=11}else if(""!==r){var n=r.split(" ");t={lat:parseFloat(n[0]),lng:parseFloat(n[1])},a=7}else t={lat:51.475,lng:-.1875},a=14;createMap(t,a,i,e)}});var $=jQuery,INSP_CONTENT={};switch(INSP_CONTENT.hash=window.location.hash,INSP_CONTENT.hash){case"#room-shots":INSP_CONTENT.content="photos";break;case"#videos":INSP_CONTENT.content="videos";break;default:INSP_CONTENT.content="social"}$(document).ready(function(){if("social"!==INSP_CONTENT.content){$(".inspiration__social").hide();var e=".inspiration__"+INSP_CONTENT.content;$(e).show()}if("photos"===INSP_CONTENT.content&&$(".grid").masonry({itemSelector:".grid-item",percentPosition:!0}),$("body").hasClass("page-template-inspiration")){for(var t=function(e,t){var i=a[e]-a[t];i>-25&&(i=-25);var s=-2*i+"px";$($(".timeline__event__line")[e]).css("margin-top",s)},a=[],i=0;i<10;i++)void 0!==$(".timeline__event__ball")[i]?a[i]=$($(".timeline__event__ball")[i]).offset().top:a[i]=1e7;a[1]<a[0]&&t(1,0),a[3]<a[2]&&t(3,2),a[5]<a[4]&&t(5,4),a[7]<a[6]&&t(7,6),a[9]<a[8]&&t(9,8)}});var $=jQuery;$(document).ready(function(){$(".insp-menu__link").on("click",function(e){e.preventDefault(),e.stopPropagation();var t=$(this).data("content");switch(window.location.hash=t,t){case"social":$(".inspiration__photos").hide(),$(".inspiration__videos").hide(),$(".inspiration__social").show();break;case"room-shots":$(".inspiration__social").hide(),$(".inspiration__videos").hide(),$(".inspiration__photos").show(),$(".grid").masonry({itemSelector:".grid-item",percentPosition:!0});break;case"videos":$(".inspiration__photos").hide(),$(".inspiration__social").hide(),$(".inspiration__videos").show()}return!1})}),jQuery(document).ready(function(){var e=jQuery;e(function(){e(".main-menu__button").on("click",function(t){e(this).toggleClass("is-active"),e("body").toggleClass("show-menu");var a=!0;e("header").hasClass("collapsed")&&(e("header").removeClass("collapsed"),a=!1),e(".show-menu .main-menu__wrap").css("z-index","99999"),setTimeout(function(){e(".top-bar").toggleClass("-relative"),a&&window.innerWidth<451&&e("header").addClass("collapsed"),e(".top-bar").hasClass("apply-dark-background")?e(".top-bar").removeClass("apply-dark-background"):e(".top-bar").addClass("apply-dark-background"),e(".show-menu .main-menu__wrap").css("z-index","99999")},800),window.innerWidth<993&&(e("body").hasClass("show-menu")?e(".top-bar__left").hide():setTimeout(function(){e(".top-bar__left").show()},400))})}),e("html").click(function(){e("body").removeClass("show-menu"),e(".main-menu__button").removeClass("is-active")}),e(".main-menu, .main-menu__button").click(function(e){e.stopPropagation()})}),$(window).resize(function(){$("body").hasClass("show-menu")&&(window.innerWidth<993?$(".top-bar__left").hide():$(".top-bar__left").show())});var $=jQuery;$(document).ready(function(){$(".change-image-view").on("click",function(e){e.preventDefault(),e.stopPropagation();var t,a,i,s=$(this).data("view");return"top"===s?(t=$(this).data("angle"),a="angle",i="auto"):(t=$(this).data("top"),a="top",i="450px"),$(this).siblings("img").attr("src",t),$(this).data("view",a),$(this).siblings("img").on("load",function(){$(this).parent().css("height",i);var e=$(this).parent().parent().parent().parent().height();$(".material-view-slider").css("min-height",e+"px")}),!1}),$(document).on("click","#add-swatch-to-basket",function(e){e.preventDefault(),e.stopPropagation(),$("body").css("cursor","wait"),$("a").css("cssText","cursor: wait !important;");var t=($(this).data("product-name"),$(this).data("product-id")),a=window.location.href+"?post_type=product&add-to-cart="+t;return $.get(a).done(function(){window.location.reload(),$("body").removeClass("basket-empty"),$("body").addClass("basket-full");var e=parseInt($("#num-items-basket").text()),t=e+1;$("#num-items-basket").text(t)}).fail(function(){}),!1})});var sliderInterval=setInterval(function(){if($(".slidee").length>0){var e=$($(".slidee")[0]).data("total");$(".slidee").length===e&&startSlider()}},1),$=jQuery;$(document).ready(function(){var e=$(".materials-slider").bxSlider({mode:"fade",onSliderLoad:function(){var e=$(".materials-slider li.material-slide")[0],t=$(e).data("material");$(".next-slide.--material-slider").addClass(t),$(".prev-slide.--material-slider").addClass(t)}});$(".next-slide.--material-slider").on("click",function(){e.goToNextSlide();var t;$(".slide__list li").each(function(e,a){$(a).children("img").hasClass("active")&&(t=$(a).data("slide"),$(a).children("img").removeClass("active"))});var a=t+1;5===t&&(a=0),$('.slide__list li[data-slide="'+a+'"] img').addClass("active");var i=$(".materials-slider li.material-slide")[t],s=$(i).data("material"),r=$(".materials-slider li.material-slide")[a],n=$(r).data("material");$(this).removeClass(s),$(".prev-slide").removeClass(s),$(this).addClass(n),$(".prev-slide").addClass(n)}),$(".prev-slide.--material-slider").on("click",function(){e.goToPrevSlide();var t;$(".slide__list li").each(function(e,a){$(a).children("img").hasClass("active")&&(t=$(a).data("slide"),$(a).children("img").removeClass("active"))});var a=t-1;0===t&&(a=5),$('.slide__list li[data-slide="'+a+'"] img').addClass("active");var i=$(".materials-slider li.material-slide")[t],s=$(i).data("material"),r=$(".materials-slider li.material-slide")[a],n=$(r).data("material");$(this).removeClass(s),$(".next-slide").removeClass(s),$(this).addClass(n),$(".next-slide").addClass(n)}),$(".slide__list li").on("click",function(){var t=$(this).data("slide");e.goToSlide(t),$(this).siblings().each(function(e,t){var a;$(t).children("img").hasClass("active")&&(a=$(t).data("slide")),$('li[data-slide="'+a+'"] img').removeClass("active")}),$('li[data-slide="'+t+'"] img').addClass("active")}),setTimeout(function(){$(".material-slide").each(function(e,t){$(t).css({top:0,bottom:0})})},500)});var $=jQuery;$(document).ready(function(){function e(){if(1===$(".overseas-partners").length){var e=$(".retailer-search input").val(),t=e.replace(/\s/g,"");if(""===t)return void alert("Please enter a post code");var a=window.location.origin+window.location.pathname+"?postcode="+encodeURIComponent(t);window.location.href=a}else if(1===$(".uk-retailers").length){var i=$(".retailer-search select").val(),a=window.location.origin+window.location.pathname+"?country="+encodeURIComponent(i);window.location.href=a}}function t(){$(".retailer-search input").hide(),$(".retailer-search select").show(),$(this).text("UK Retailers"),$(this).removeClass("overseas-partners"),$(this).addClass("uk-retailers");var e=document.querySelector(".uk-retailers");e&&(e.removeEventListener("click",t),e.addEventListener("click",a))}function a(){$(".retailer-search select").hide(),$(".retailer-search input").show(),$(this).text("Overseas Partners"),$(this).removeClass("uk-retailers"),$(this).addClass("overseas-partners");var e=document.querySelector(".overseas-partners");e&&(e.removeEventListener("click",a),e.addEventListener("click",t))}var i=document.querySelector(".overseas-partners");i&&i.addEventListener("click",t),document.getElementById("search-form")&&(document.getElementById("search-form").onkeydown=function(t){if(13==t.keyCode)return t.preventDefault(),e()}),$(".retailer-search button").on("click",function(){return e()})}),$(document).ready(function(){$(".open-acc").click(function(){$(this).find("img").toggleClass("rotate-icon"),console.log($(this))})}),$(document).ready(function(){var e=$(".r_card"),t=$(".retailer-result-dropdown"),a=$("#switch-views-one"),i=$("#switch-views-two"),s=$("#list-view-retailer"),r=$("#card-view-retailer");a.click(function(){s.css("stroke","rgb(0, 0, 0)"),r.css("stroke","rgb(204, 204, 204)"),e.css("display","none"),t.css("display","block")}),i.click(function(){r.css("stroke","rgb(0, 0, 0)"),s.css("stroke","rgb(204, 204, 204)"),t.css("display","none"),e.css("display","block")}),$("#get_country").val()&&(e.css("display","block"),$(".switch_views").css("display","none"))}),$=jQuery;var superslidesInterval=setInterval(function(){$("#super-slider").length>0&&createSuperslider()},1);$(function(){var e=$(".wp-video")[0];e&&(e.addEventListener("playing",function(){$("#super-slider").superslides("stop")}),e.addEventListener("pause",function(){$("#super-slider").superslides("playing")}))}),$(document).ready(function(){$(".slide__numbers li").on("click",function(){var e=$(this).text(),t=parseInt(e.replace("0","").replace(".",""))-1;$("#super-slider").superslides("animate",t)}),$(".slide__arrow--down").on("click",function(){var e=$(window).height(),t=e-50;$("body").animate({scrollTop:t},1100)})}),$=jQuery;var superslidesInterval=setInterval(function(){$("#super-slider").length>0&&createSuperslider()},1);$(function(){var e=$(".wp-video-shortcode")[0];e&&(e.addEventListener("playing",function(){$("#super-slider").superslides("stop")}),e.addEventListener("pause",function(){$("#super-slider").superslides("playing")}))}),$(document).ready(function(){$(".slide__numbers li").on("click",function(){var e=$(this).text(),t=parseInt(e.replace("0","").replace(".",""))-1;$("#super-slider").superslides("animate",t)}),$(".slide__arrow--down").on("click",function(){var e=$(window).height(),t=e-50;$("body").animate({scrollTop:t},1100)})});
//# sourceMappingURL=maps/master.min.js.map
;
/**
 * WordPress inline HTML embed
 *
 * @since 4.4.0
 *
 * This file cannot have ampersands in it. This is to ensure
 * it can be embedded in older versions of WordPress.
 * See https://core.trac.wordpress.org/changeset/35708.
 */
(function ( window, document ) {
	'use strict';

	var supportedBrowser = false,
		loaded = false;

		if ( document.querySelector ) {
			if ( window.addEventListener ) {
				supportedBrowser = true;
			}
		}

	/** @namespace wp */
	window.wp = window.wp || {};

	if ( !! window.wp.receiveEmbedMessage ) {
		return;
	}

	window.wp.receiveEmbedMessage = function( e ) {
		var data = e.data;
		if ( ! ( data.secret || data.message || data.value ) ) {
			return;
		}

		if ( /[^a-zA-Z0-9]/.test( data.secret ) ) {
			return;
		}

		var iframes = document.querySelectorAll( 'iframe[data-secret="' + data.secret + '"]' ),
			blockquotes = document.querySelectorAll( 'blockquote[data-secret="' + data.secret + '"]' ),
			i, source, height, sourceURL, targetURL;

		for ( i = 0; i < blockquotes.length; i++ ) {
			blockquotes[ i ].style.display = 'none';
		}

		for ( i = 0; i < iframes.length; i++ ) {
			source = iframes[ i ];

			if ( e.source !== source.contentWindow ) {
				continue;
			}

			source.removeAttribute( 'style' );

			/* Resize the iframe on request. */
			if ( 'height' === data.message ) {
				height = parseInt( data.value, 10 );
				if ( height > 1000 ) {
					height = 1000;
				} else if ( ~~height < 200 ) {
					height = 200;
				}

				source.height = height;
			}

			/* Link to a specific URL on request. */
			if ( 'link' === data.message ) {
				sourceURL = document.createElement( 'a' );
				targetURL = document.createElement( 'a' );

				sourceURL.href = source.getAttribute( 'src' );
				targetURL.href = data.value;

				/* Only continue if link hostname matches iframe's hostname. */
				if ( targetURL.host === sourceURL.host ) {
					if ( document.activeElement === source ) {
						window.top.location.href = data.value;
					}
				}
			}
		}
	};

	function onLoad() {
		if ( loaded ) {
			return;
		}

		loaded = true;

		var isIE10 = -1 !== navigator.appVersion.indexOf( 'MSIE 10' ),
			isIE11 = !!navigator.userAgent.match( /Trident.*rv:11\./ ),
			iframes = document.querySelectorAll( 'iframe.wp-embedded-content' ),
			iframeClone, i, source, secret;

		for ( i = 0; i < iframes.length; i++ ) {
			source = iframes[ i ];

			if ( ! source.getAttribute( 'data-secret' ) ) {
				/* Add secret to iframe */
				secret = Math.random().toString( 36 ).substr( 2, 10 );
				source.src += '#?secret=' + secret;
				source.setAttribute( 'data-secret', secret );
			}

			/* Remove security attribute from iframes in IE10 and IE11. */
			if ( ( isIE10 || isIE11 ) ) {
				iframeClone = source.cloneNode( true );
				iframeClone.removeAttribute( 'security' );
				source.parentNode.replaceChild( iframeClone, source );
			}
		}
	}

	if ( supportedBrowser ) {
		window.addEventListener( 'message', window.wp.receiveEmbedMessage, false );
		document.addEventListener( 'DOMContentLoaded', onLoad, false );
		window.addEventListener( 'load', onLoad, false );
	}
})( window, document );
;
;
var mejsL10n = {"language":"en","strings":{"mejs.install-flash":"You are using a browser that does not have Flash player enabled or installed. Please turn on your Flash player plugin or download the latest version from https:\/\/get.adobe.com\/flashplayer\/","mejs.fullscreen-off":"Turn off Fullscreen","mejs.fullscreen-on":"Go Fullscreen","mejs.download-video":"Download Video","mejs.fullscreen":"Fullscreen","mejs.time-jump-forward":["Jump forward 1 second","Jump forward %1 seconds"],"mejs.loop":"Toggle Loop","mejs.play":"Play","mejs.pause":"Pause","mejs.close":"Close","mejs.time-slider":"Time Slider","mejs.time-help-text":"Use Left\/Right Arrow keys to advance one second, Up\/Down arrows to advance ten seconds.","mejs.time-skip-back":["Skip back 1 second","Skip back %1 seconds"],"mejs.captions-subtitles":"Captions\/Subtitles","mejs.captions-chapters":"Chapters","mejs.none":"None","mejs.mute-toggle":"Mute Toggle","mejs.volume-help-text":"Use Up\/Down Arrow keys to increase or decrease volume.","mejs.unmute":"Unmute","mejs.mute":"Mute","mejs.volume-slider":"Volume Slider","mejs.video-player":"Video Player","mejs.audio-player":"Audio Player","mejs.ad-skip":"Skip ad","mejs.ad-skip-info":["Skip in 1 second","Skip in %1 seconds"],"mejs.source-chooser":"Source Chooser","mejs.stop":"Stop","mejs.speed-rate":"Speed Rate","mejs.live-broadcast":"Live Broadcast","mejs.afrikaans":"Afrikaans","mejs.albanian":"Albanian","mejs.arabic":"Arabic","mejs.belarusian":"Belarusian","mejs.bulgarian":"Bulgarian","mejs.catalan":"Catalan","mejs.chinese":"Chinese","mejs.chinese-simplified":"Chinese (Simplified)","mejs.chinese-traditional":"Chinese (Traditional)","mejs.croatian":"Croatian","mejs.czech":"Czech","mejs.danish":"Danish","mejs.dutch":"Dutch","mejs.english":"English","mejs.estonian":"Estonian","mejs.filipino":"Filipino","mejs.finnish":"Finnish","mejs.french":"French","mejs.galician":"Galician","mejs.german":"German","mejs.greek":"Greek","mejs.haitian-creole":"Haitian Creole","mejs.hebrew":"Hebrew","mejs.hindi":"Hindi","mejs.hungarian":"Hungarian","mejs.icelandic":"Icelandic","mejs.indonesian":"Indonesian","mejs.irish":"Irish","mejs.italian":"Italian","mejs.japanese":"Japanese","mejs.korean":"Korean","mejs.latvian":"Latvian","mejs.lithuanian":"Lithuanian","mejs.macedonian":"Macedonian","mejs.malay":"Malay","mejs.maltese":"Maltese","mejs.norwegian":"Norwegian","mejs.persian":"Persian","mejs.polish":"Polish","mejs.portuguese":"Portuguese","mejs.romanian":"Romanian","mejs.russian":"Russian","mejs.serbian":"Serbian","mejs.slovak":"Slovak","mejs.slovenian":"Slovenian","mejs.spanish":"Spanish","mejs.swahili":"Swahili","mejs.swedish":"Swedish","mejs.tagalog":"Tagalog","mejs.thai":"Thai","mejs.turkish":"Turkish","mejs.ukrainian":"Ukrainian","mejs.vietnamese":"Vietnamese","mejs.welsh":"Welsh","mejs.yiddish":"Yiddish"}};;
/*!
 * MediaElement.js
 * http://www.mediaelementjs.com/
 *
 * Wrapper that mimics native HTML5 MediaElement (audio and video)
 * using a variety of technologies (pure JavaScript, Flash, iframe)
 *
 * Copyright 2010-2017, John Dyer (http://j.hn/)
 * License: MIT
 *
 */(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

},{}],2:[function(_dereq_,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = _dereq_(1);

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"1":1}],3:[function(_dereq_,module,exports){
(function (global){
var win;

if (typeof window !== "undefined") {
    win = window;
} else if (typeof global !== "undefined") {
    win = global;
} else if (typeof self !== "undefined"){
    win = self;
} else {
    win = {};
}

module.exports = win;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(_dereq_,module,exports){
(function (root) {

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {}
  
  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  function Promise(fn) {
    if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
    if (typeof fn !== 'function') throw new TypeError('not a function');
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];

    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    Promise._immediateFn(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;
        if (newValue instanceof Promise) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise._immediateFn(function() {
        if (!self._handled) {
          Promise._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(function (value) {
        if (done) return;
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) return;
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) return;
      done = true;
      reject(self, ex);
    }
  }

  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new (this.constructor)(noop);

    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise.all = function (arr) {
    var args = Array.prototype.slice.call(arr);

    return new Promise(function (resolve, reject) {
      if (args.length === 0) return resolve([]);
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise.resolve = function (value) {
    if (value && typeof value === 'object' && value.constructor === Promise) {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  };

  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // Use polyfill for setImmediate for performance gains
  Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) { setImmediate(fn); }) ||
    function (fn) {
      setTimeoutFunc(fn, 0);
    };

  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  /**
   * Set the immediate function to execute callbacks
   * @param fn {function} Function to execute
   * @deprecated
   */
  Promise._setImmediateFn = function _setImmediateFn(fn) {
    Promise._immediateFn = fn;
  };

  /**
   * Change the function to execute on unhandled rejection
   * @param {function} fn Function to execute on unhandled rejection
   * @deprecated
   */
  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
    Promise._unhandledRejectionFn = fn;
  };
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }

})(this);

},{}],5:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _mejs = _dereq_(7);

var _mejs2 = _interopRequireDefault(_mejs);

var _en = _dereq_(15);

var _general = _dereq_(27);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var i18n = { lang: 'en', en: _en.EN };

i18n.language = function () {
	for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
		args[_key] = arguments[_key];
	}

	if (args !== null && args !== undefined && args.length) {

		if (typeof args[0] !== 'string') {
			throw new TypeError('Language code must be a string value');
		}

		if (!/^[a-z]{2,3}((\-|_)[a-z]{2})?$/i.test(args[0])) {
			throw new TypeError('Language code must have format 2-3 letters and. optionally, hyphen, underscore followed by 2 more letters');
		}

		i18n.lang = args[0];

		if (i18n[args[0]] === undefined) {
			args[1] = args[1] !== null && args[1] !== undefined && _typeof(args[1]) === 'object' ? args[1] : {};
			i18n[args[0]] = !(0, _general.isObjectEmpty)(args[1]) ? args[1] : _en.EN;
		} else if (args[1] !== null && args[1] !== undefined && _typeof(args[1]) === 'object') {
			i18n[args[0]] = args[1];
		}
	}

	return i18n.lang;
};

i18n.t = function (message) {
	var pluralParam = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;


	if (typeof message === 'string' && message.length) {

		var str = void 0,
		    pluralForm = void 0;

		var language = i18n.language();

		var _plural = function _plural(input, number, form) {

			if ((typeof input === 'undefined' ? 'undefined' : _typeof(input)) !== 'object' || typeof number !== 'number' || typeof form !== 'number') {
				return input;
			}

			var _pluralForms = function () {
				return [function () {
					return arguments.length <= 1 ? undefined : arguments[1];
				}, function () {
					return (arguments.length <= 0 ? undefined : arguments[0]) === 1 ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 2 ? undefined : arguments[2];
				}, function () {
					return (arguments.length <= 0 ? undefined : arguments[0]) === 0 || (arguments.length <= 0 ? undefined : arguments[0]) === 1 ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 2 ? undefined : arguments[2];
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 === 1 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 !== 11) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) !== 0) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1 || (arguments.length <= 0 ? undefined : arguments[0]) === 11) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 2 || (arguments.length <= 0 ? undefined : arguments[0]) === 12) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) > 2 && (arguments.length <= 0 ? undefined : arguments[0]) < 20) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else {
						return arguments.length <= 4 ? undefined : arguments[4];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 0 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 > 0 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 < 20) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 === 1 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 !== 11) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 >= 2 && ((arguments.length <= 0 ? undefined : arguments[0]) % 100 < 10 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 20)) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return [3];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 === 1 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 !== 11) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 >= 2 && (arguments.length <= 0 ? undefined : arguments[0]) % 10 <= 4 && ((arguments.length <= 0 ? undefined : arguments[0]) % 100 < 10 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 20)) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) >= 2 && (arguments.length <= 0 ? undefined : arguments[0]) <= 4) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 >= 2 && (arguments.length <= 0 ? undefined : arguments[0]) % 10 <= 4 && ((arguments.length <= 0 ? undefined : arguments[0]) % 100 < 10 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 20)) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 === 1) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 === 2) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 === 3 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 === 4) {
						return arguments.length <= 4 ? undefined : arguments[4];
					} else {
						return arguments.length <= 1 ? undefined : arguments[1];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 2) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) > 2 && (arguments.length <= 0 ? undefined : arguments[0]) < 7) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) > 6 && (arguments.length <= 0 ? undefined : arguments[0]) < 11) {
						return arguments.length <= 4 ? undefined : arguments[4];
					} else {
						return arguments.length <= 5 ? undefined : arguments[5];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 0) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 2) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 3 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 <= 10) {
						return arguments.length <= 4 ? undefined : arguments[4];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 11) {
						return arguments.length <= 5 ? undefined : arguments[5];
					} else {
						return arguments.length <= 6 ? undefined : arguments[6];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 0 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 > 1 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 < 11) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 100 > 10 && (arguments.length <= 0 ? undefined : arguments[0]) % 100 < 20) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else {
						return arguments.length <= 4 ? undefined : arguments[4];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 === 2) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}, function () {
					return (arguments.length <= 0 ? undefined : arguments[0]) !== 11 && (arguments.length <= 0 ? undefined : arguments[0]) % 10 === 1 ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 2 ? undefined : arguments[2];
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) % 10 >= 2 && (arguments.length <= 0 ? undefined : arguments[0]) % 10 <= 4 && ((arguments.length <= 0 ? undefined : arguments[0]) % 100 < 10 || (arguments.length <= 0 ? undefined : arguments[0]) % 100 >= 20)) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 2) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) !== 8 && (arguments.length <= 0 ? undefined : arguments[0]) !== 11) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else {
						return arguments.length <= 4 ? undefined : arguments[4];
					}
				}, function () {
					return (arguments.length <= 0 ? undefined : arguments[0]) === 0 ? arguments.length <= 1 ? undefined : arguments[1] : arguments.length <= 2 ? undefined : arguments[2];
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 2) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 3) {
						return arguments.length <= 3 ? undefined : arguments[3];
					} else {
						return arguments.length <= 4 ? undefined : arguments[4];
					}
				}, function () {
					if ((arguments.length <= 0 ? undefined : arguments[0]) === 0) {
						return arguments.length <= 1 ? undefined : arguments[1];
					} else if ((arguments.length <= 0 ? undefined : arguments[0]) === 1) {
						return arguments.length <= 2 ? undefined : arguments[2];
					} else {
						return arguments.length <= 3 ? undefined : arguments[3];
					}
				}];
			}();

			return _pluralForms[form].apply(null, [number].concat(input));
		};

		if (i18n[language] !== undefined) {
			str = i18n[language][message];
			if (pluralParam !== null && typeof pluralParam === 'number') {
				pluralForm = i18n[language]['mejs.plural-form'];
				str = _plural.apply(null, [str, pluralParam, pluralForm]);
			}
		}

		if (!str && i18n.en) {
			str = i18n.en[message];
			if (pluralParam !== null && typeof pluralParam === 'number') {
				pluralForm = i18n.en['mejs.plural-form'];
				str = _plural.apply(null, [str, pluralParam, pluralForm]);
			}
		}

		str = str || message;

		if (pluralParam !== null && typeof pluralParam === 'number') {
			str = str.replace('%1', pluralParam);
		}

		return (0, _general.escapeHTML)(str);
	}

	return message;
};

_mejs2.default.i18n = i18n;

if (typeof mejsL10n !== 'undefined') {
	_mejs2.default.i18n.language(mejsL10n.language, mejsL10n.strings);
}

exports.default = i18n;

},{"15":15,"27":27,"7":7}],6:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(7);

var _mejs2 = _interopRequireDefault(_mejs);

var _general = _dereq_(27);

var _media2 = _dereq_(28);

var _renderer = _dereq_(8);

var _constants = _dereq_(25);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MediaElement = function MediaElement(idOrNode, options, sources) {
	var _this = this;

	_classCallCheck(this, MediaElement);

	var t = this;

	sources = Array.isArray(sources) ? sources : null;

	t.defaults = {
		renderers: [],

		fakeNodeName: 'mediaelementwrapper',

		pluginPath: 'build/',

		shimScriptAccess: 'sameDomain'
	};

	options = Object.assign(t.defaults, options);

	t.mediaElement = _document2.default.createElement(options.fakeNodeName);

	var id = idOrNode,
	    error = false;

	if (typeof idOrNode === 'string') {
		t.mediaElement.originalNode = _document2.default.getElementById(idOrNode);
	} else {
		t.mediaElement.originalNode = idOrNode;
		id = idOrNode.id;
	}

	if (t.mediaElement.originalNode === undefined || t.mediaElement.originalNode === null) {
		return null;
	}

	t.mediaElement.options = options;
	id = id || 'mejs_' + Math.random().toString().slice(2);

	t.mediaElement.originalNode.setAttribute('id', id + '_from_mejs');

	var tagName = t.mediaElement.originalNode.tagName.toLowerCase();
	if (['video', 'audio'].indexOf(tagName) > -1 && !t.mediaElement.originalNode.getAttribute('preload')) {
		t.mediaElement.originalNode.setAttribute('preload', 'none');
	}

	t.mediaElement.originalNode.parentNode.insertBefore(t.mediaElement, t.mediaElement.originalNode);

	t.mediaElement.appendChild(t.mediaElement.originalNode);

	var processURL = function processURL(url, type) {
		if (_window2.default.location.protocol === 'https:' && url.indexOf('http:') === 0 && _constants.IS_IOS && _mejs2.default.html5media.mediaTypes.indexOf(type) > -1) {
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function () {
				if (this.readyState === 4 && this.status === 200) {
					var _url = _window2.default.URL || _window2.default.webkitURL,
					    blobUrl = _url.createObjectURL(this.response);
					t.mediaElement.originalNode.setAttribute('src', blobUrl);
					return blobUrl;
				}
				return url;
			};
			xhr.open('GET', url);
			xhr.responseType = 'blob';
			xhr.send();
		}

		return url;
	};

	var mediaFiles = void 0;

	if (sources !== null) {
		mediaFiles = sources;
	} else if (t.mediaElement.originalNode !== null) {

		mediaFiles = [];

		switch (t.mediaElement.originalNode.nodeName.toLowerCase()) {
			case 'iframe':
				mediaFiles.push({
					type: '',
					src: t.mediaElement.originalNode.getAttribute('src')
				});
				break;
			case 'audio':
			case 'video':
				var _sources = t.mediaElement.originalNode.children.length,
				    nodeSource = t.mediaElement.originalNode.getAttribute('src');

				if (nodeSource) {
					var node = t.mediaElement.originalNode,
					    type = (0, _media2.formatType)(nodeSource, node.getAttribute('type'));
					mediaFiles.push({
						type: type,
						src: processURL(nodeSource, type)
					});
				}

				for (var i = 0; i < _sources; i++) {
					var n = t.mediaElement.originalNode.children[i];
					if (n.tagName.toLowerCase() === 'source') {
						var src = n.getAttribute('src'),
						    _type = (0, _media2.formatType)(src, n.getAttribute('type'));
						mediaFiles.push({ type: _type, src: processURL(src, _type) });
					}
				}
				break;
		}
	}

	t.mediaElement.id = id;
	t.mediaElement.renderers = {};
	t.mediaElement.events = {};
	t.mediaElement.promises = [];
	t.mediaElement.renderer = null;
	t.mediaElement.rendererName = null;

	t.mediaElement.changeRenderer = function (rendererName, mediaFiles) {

		var t = _this,
		    media = Object.keys(mediaFiles[0]).length > 2 ? mediaFiles[0] : mediaFiles[0].src;

		if (t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null && t.mediaElement.renderer.name === rendererName) {
			t.mediaElement.renderer.pause();
			if (t.mediaElement.renderer.stop) {
				t.mediaElement.renderer.stop();
			}
			t.mediaElement.renderer.show();
			t.mediaElement.renderer.setSrc(media);
			return true;
		}

		if (t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null) {
			t.mediaElement.renderer.pause();
			if (t.mediaElement.renderer.stop) {
				t.mediaElement.renderer.stop();
			}
			t.mediaElement.renderer.hide();
		}

		var newRenderer = t.mediaElement.renderers[rendererName],
		    newRendererType = null;

		if (newRenderer !== undefined && newRenderer !== null) {
			newRenderer.show();
			newRenderer.setSrc(media);
			t.mediaElement.renderer = newRenderer;
			t.mediaElement.rendererName = rendererName;
			return true;
		}

		var rendererArray = t.mediaElement.options.renderers.length ? t.mediaElement.options.renderers : _renderer.renderer.order;

		for (var _i = 0, total = rendererArray.length; _i < total; _i++) {
			var index = rendererArray[_i];

			if (index === rendererName) {
				var rendererList = _renderer.renderer.renderers;
				newRendererType = rendererList[index];

				var renderOptions = Object.assign(newRendererType.options, t.mediaElement.options);
				newRenderer = newRendererType.create(t.mediaElement, renderOptions, mediaFiles);
				newRenderer.name = rendererName;

				t.mediaElement.renderers[newRendererType.name] = newRenderer;
				t.mediaElement.renderer = newRenderer;
				t.mediaElement.rendererName = rendererName;
				newRenderer.show();
				return true;
			}
		}

		return false;
	};

	t.mediaElement.setSize = function (width, height) {
		if (t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null) {
			t.mediaElement.renderer.setSize(width, height);
		}
	};

	t.mediaElement.generateError = function (message, urlList) {
		message = message || '';
		urlList = Array.isArray(urlList) ? urlList : [];
		var event = (0, _general.createEvent)('error', t.mediaElement);
		event.message = message;
		event.urls = urlList;
		t.mediaElement.dispatchEvent(event);
		error = true;
	};

	var props = _mejs2.default.html5media.properties,
	    methods = _mejs2.default.html5media.methods,
	    addProperty = function addProperty(obj, name, onGet, onSet) {
		var oldValue = obj[name];
		var getFn = function getFn() {
			return onGet.apply(obj, [oldValue]);
		},
		    setFn = function setFn(newValue) {
			oldValue = onSet.apply(obj, [newValue]);
			return oldValue;
		};

		Object.defineProperty(obj, name, {
			get: getFn,
			set: setFn
		});
	},
	    assignGettersSetters = function assignGettersSetters(propName) {
		if (propName !== 'src') {

			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1),
			    getFn = function getFn() {
				return t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null && typeof t.mediaElement.renderer['get' + capName] === 'function' ? t.mediaElement.renderer['get' + capName]() : null;
			},
			    setFn = function setFn(value) {
				if (t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null && typeof t.mediaElement.renderer['set' + capName] === 'function') {
					t.mediaElement.renderer['set' + capName](value);
				}
			};

			addProperty(t.mediaElement, propName, getFn, setFn);
			t.mediaElement['get' + capName] = getFn;
			t.mediaElement['set' + capName] = setFn;
		}
	},
	    getSrc = function getSrc() {
		return t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null ? t.mediaElement.renderer.getSrc() : null;
	},
	    setSrc = function setSrc(value) {
		var mediaFiles = [];

		if (typeof value === 'string') {
			mediaFiles.push({
				src: value,
				type: value ? (0, _media2.getTypeFromFile)(value) : ''
			});
		} else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.src !== undefined) {
			var _src = (0, _media2.absolutizeUrl)(value.src),
			    _type2 = value.type,
			    media = Object.assign(value, {
				src: _src,
				type: (_type2 === '' || _type2 === null || _type2 === undefined) && _src ? (0, _media2.getTypeFromFile)(_src) : _type2
			});
			mediaFiles.push(media);
		} else if (Array.isArray(value)) {
			for (var _i2 = 0, total = value.length; _i2 < total; _i2++) {

				var _src2 = (0, _media2.absolutizeUrl)(value[_i2].src),
				    _type3 = value[_i2].type,
				    _media = Object.assign(value[_i2], {
					src: _src2,
					type: (_type3 === '' || _type3 === null || _type3 === undefined) && _src2 ? (0, _media2.getTypeFromFile)(_src2) : _type3
				});

				mediaFiles.push(_media);
			}
		}

		var renderInfo = _renderer.renderer.select(mediaFiles, t.mediaElement.options.renderers.length ? t.mediaElement.options.renderers : []),
		    event = void 0;

		if (!t.mediaElement.paused) {
			t.mediaElement.pause();
			event = (0, _general.createEvent)('pause', t.mediaElement);
			t.mediaElement.dispatchEvent(event);
		}
		t.mediaElement.originalNode.src = mediaFiles[0].src || '';

		if (renderInfo === null && mediaFiles[0].src) {
			t.mediaElement.generateError('No renderer found', mediaFiles);
			return;
		}

		return mediaFiles[0].src ? t.mediaElement.changeRenderer(renderInfo.rendererName, mediaFiles) : null;
	},
	    triggerAction = function triggerAction(methodName, args) {
		try {
			if (methodName === 'play' && t.mediaElement.rendererName === 'native_dash') {
				var response = t.mediaElement.renderer[methodName](args);
				if (response && typeof response.then === 'function') {
					response.catch(function () {
						if (t.mediaElement.paused) {
							setTimeout(function () {
								var tmpResponse = t.mediaElement.renderer.play();
								if (tmpResponse !== undefined) {
									tmpResponse.catch(function () {
										if (!t.mediaElement.renderer.paused) {
											t.mediaElement.renderer.pause();
										}
									});
								}
							}, 150);
						}
					});
				}
			} else {
				t.mediaElement.renderer[methodName](args);
			}
		} catch (e) {
			t.mediaElement.generateError(e, mediaFiles);
		}
	},
	    assignMethods = function assignMethods(methodName) {
		t.mediaElement[methodName] = function () {
			for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
				args[_key] = arguments[_key];
			}

			if (t.mediaElement.renderer !== undefined && t.mediaElement.renderer !== null && typeof t.mediaElement.renderer[methodName] === 'function') {
				if (t.mediaElement.promises.length) {
					Promise.all(t.mediaElement.promises).then(function () {
						triggerAction(methodName, args);
					}).catch(function (e) {
						t.mediaElement.generateError(e, mediaFiles);
					});
				} else {
					triggerAction(methodName, args);
				}
			}
			return null;
		};
	};

	addProperty(t.mediaElement, 'src', getSrc, setSrc);
	t.mediaElement.getSrc = getSrc;
	t.mediaElement.setSrc = setSrc;

	for (var _i3 = 0, total = props.length; _i3 < total; _i3++) {
		assignGettersSetters(props[_i3]);
	}

	for (var _i4 = 0, _total = methods.length; _i4 < _total; _i4++) {
		assignMethods(methods[_i4]);
	}

	t.mediaElement.addEventListener = function (eventName, callback) {
		t.mediaElement.events[eventName] = t.mediaElement.events[eventName] || [];

		t.mediaElement.events[eventName].push(callback);
	};
	t.mediaElement.removeEventListener = function (eventName, callback) {
		if (!eventName) {
			t.mediaElement.events = {};
			return true;
		}

		var callbacks = t.mediaElement.events[eventName];

		if (!callbacks) {
			return true;
		}

		if (!callback) {
			t.mediaElement.events[eventName] = [];
			return true;
		}

		for (var _i5 = 0; _i5 < callbacks.length; _i5++) {
			if (callbacks[_i5] === callback) {
				t.mediaElement.events[eventName].splice(_i5, 1);
				return true;
			}
		}
		return false;
	};

	t.mediaElement.dispatchEvent = function (event) {
		var callbacks = t.mediaElement.events[event.type];
		if (callbacks) {
			for (var _i6 = 0; _i6 < callbacks.length; _i6++) {
				callbacks[_i6].apply(null, [event]);
			}
		}
	};

	if (mediaFiles.length) {
		t.mediaElement.src = mediaFiles;
	}

	if (t.mediaElement.promises.length) {
		Promise.all(t.mediaElement.promises).then(function () {
			if (t.mediaElement.options.success) {
				t.mediaElement.options.success(t.mediaElement, t.mediaElement.originalNode);
			}
		}).catch(function () {
			if (error && t.mediaElement.options.error) {
				t.mediaElement.options.error(t.mediaElement, t.mediaElement.originalNode);
			}
		});
	} else {
		if (t.mediaElement.options.success) {
			t.mediaElement.options.success(t.mediaElement, t.mediaElement.originalNode);
		}

		if (error && t.mediaElement.options.error) {
			t.mediaElement.options.error(t.mediaElement, t.mediaElement.originalNode);
		}
	}

	return t.mediaElement;
};

_window2.default.MediaElement = MediaElement;
_mejs2.default.MediaElement = MediaElement;

exports.default = MediaElement;

},{"2":2,"25":25,"27":27,"28":28,"3":3,"7":7,"8":8}],7:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mejs = {};

mejs.version = '4.2.6';

mejs.html5media = {
	properties: ['volume', 'src', 'currentTime', 'muted', 'duration', 'paused', 'ended', 'buffered', 'error', 'networkState', 'readyState', 'seeking', 'seekable', 'currentSrc', 'preload', 'bufferedBytes', 'bufferedTime', 'initialTime', 'startOffsetTime', 'defaultPlaybackRate', 'playbackRate', 'played', 'autoplay', 'loop', 'controls'],
	readOnlyProperties: ['duration', 'paused', 'ended', 'buffered', 'error', 'networkState', 'readyState', 'seeking', 'seekable'],

	methods: ['load', 'play', 'pause', 'canPlayType'],

	events: ['loadstart', 'durationchange', 'loadedmetadata', 'loadeddata', 'progress', 'canplay', 'canplaythrough', 'suspend', 'abort', 'error', 'emptied', 'stalled', 'play', 'playing', 'pause', 'waiting', 'seeking', 'seeked', 'timeupdate', 'ended', 'ratechange', 'volumechange'],

	mediaTypes: ['audio/mp3', 'audio/ogg', 'audio/oga', 'audio/wav', 'audio/x-wav', 'audio/wave', 'audio/x-pn-wav', 'audio/mpeg', 'audio/mp4', 'video/mp4', 'video/webm', 'video/ogg', 'video/ogv']
};

_window2.default.mejs = mejs;

exports.default = mejs;

},{"3":3}],8:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.renderer = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mejs = _dereq_(7);

var _mejs2 = _interopRequireDefault(_mejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Renderer = function () {
	function Renderer() {
		_classCallCheck(this, Renderer);

		this.renderers = {};
		this.order = [];
	}

	_createClass(Renderer, [{
		key: 'add',
		value: function add(renderer) {
			if (renderer.name === undefined) {
				throw new TypeError('renderer must contain at least `name` property');
			}

			this.renderers[renderer.name] = renderer;
			this.order.push(renderer.name);
		}
	}, {
		key: 'select',
		value: function select(mediaFiles) {
			var renderers = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

			var renderersLength = renderers.length;

			renderers = renderers.length ? renderers : this.order;

			if (!renderersLength) {
				var rendererIndicator = [/^(html5|native)/i, /^flash/i, /iframe$/i],
				    rendererRanking = function rendererRanking(renderer) {
					for (var i = 0, total = rendererIndicator.length; i < total; i++) {
						if (rendererIndicator[i].test(renderer)) {
							return i;
						}
					}
					return rendererIndicator.length;
				};

				renderers.sort(function (a, b) {
					return rendererRanking(a) - rendererRanking(b);
				});
			}

			for (var i = 0, total = renderers.length; i < total; i++) {
				var key = renderers[i],
				    _renderer = this.renderers[key];

				if (_renderer !== null && _renderer !== undefined) {
					for (var j = 0, jl = mediaFiles.length; j < jl; j++) {
						if (typeof _renderer.canPlayType === 'function' && typeof mediaFiles[j].type === 'string' && _renderer.canPlayType(mediaFiles[j].type)) {
							return {
								rendererName: _renderer.name,
								src: mediaFiles[j].src
							};
						}
					}
				}
			}

			return null;
		}
	}, {
		key: 'order',
		set: function set(order) {
			if (!Array.isArray(order)) {
				throw new TypeError('order must be an array of strings.');
			}

			this._order = order;
		},
		get: function get() {
			return this._order;
		}
	}, {
		key: 'renderers',
		set: function set(renderers) {
			if (renderers !== null && (typeof renderers === 'undefined' ? 'undefined' : _typeof(renderers)) !== 'object') {
				throw new TypeError('renderers must be an array of objects.');
			}

			this._renderers = renderers;
		},
		get: function get() {
			return this._renderers;
		}
	}]);

	return Renderer;
}();

var renderer = exports.renderer = new Renderer();

_mejs2.default.Renderers = renderer;

},{"7":7}],9:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _i18n = _dereq_(5);

var _i18n2 = _interopRequireDefault(_i18n);

var _player = _dereq_(16);

var _player2 = _interopRequireDefault(_player);

var _constants = _dereq_(25);

var Features = _interopRequireWildcard(_constants);

var _general = _dereq_(27);

var _dom = _dereq_(26);

var _media = _dereq_(28);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.assign(_player.config, {
	usePluginFullScreen: true,

	fullscreenText: null,

	useFakeFullscreen: false
});

Object.assign(_player2.default.prototype, {
	isFullScreen: false,

	isNativeFullScreen: false,

	isInIframe: false,

	isPluginClickThroughCreated: false,

	fullscreenMode: '',

	containerSizeTimeout: null,

	buildfullscreen: function buildfullscreen(player) {
		if (!player.isVideo) {
			return;
		}

		player.isInIframe = _window2.default.location !== _window2.default.parent.location;

		player.detectFullscreenMode();

		var t = this,
		    fullscreenTitle = (0, _general.isString)(t.options.fullscreenText) ? t.options.fullscreenText : _i18n2.default.t('mejs.fullscreen'),
		    fullscreenBtn = _document2.default.createElement('div');

		fullscreenBtn.className = t.options.classPrefix + 'button ' + t.options.classPrefix + 'fullscreen-button';
		fullscreenBtn.innerHTML = '<button type="button" aria-controls="' + t.id + '" title="' + fullscreenTitle + '" aria-label="' + fullscreenTitle + '" tabindex="0"></button>';
		t.addControlElement(fullscreenBtn, 'fullscreen');

		fullscreenBtn.addEventListener('click', function () {
			var isFullScreen = Features.HAS_TRUE_NATIVE_FULLSCREEN && Features.IS_FULLSCREEN || player.isFullScreen;

			if (isFullScreen) {
				player.exitFullScreen();
			} else {
				player.enterFullScreen();
			}
		});

		player.fullscreenBtn = fullscreenBtn;

		t.options.keyActions.push({
			keys: [70],
			action: function action(player, media, key, event) {
				if (!event.ctrlKey) {
					if (typeof player.enterFullScreen !== 'undefined') {
						if (player.isFullScreen) {
							player.exitFullScreen();
						} else {
							player.enterFullScreen();
						}
					}
				}
			}
		});

		t.exitFullscreenCallback = function (e) {
			var key = e.which || e.keyCode || 0;
			if (key === 27 && (Features.HAS_TRUE_NATIVE_FULLSCREEN && Features.IS_FULLSCREEN || t.isFullScreen)) {
				player.exitFullScreen();
			}
		};

		t.globalBind('keydown', t.exitFullscreenCallback);

		t.normalHeight = 0;
		t.normalWidth = 0;

		if (Features.HAS_TRUE_NATIVE_FULLSCREEN) {
			var fullscreenChanged = function fullscreenChanged() {
				if (player.isFullScreen) {
					if (Features.isFullScreen()) {
						player.isNativeFullScreen = true;

						player.setControlsSize();
					} else {
						player.isNativeFullScreen = false;

						player.exitFullScreen();
					}
				}
			};

			player.globalBind(Features.FULLSCREEN_EVENT_NAME, fullscreenChanged);
		}
	},
	cleanfullscreen: function cleanfullscreen(player) {
		player.exitFullScreen();
		player.globalUnbind('keydown', player.exitFullscreenCallback);
	},
	detectFullscreenMode: function detectFullscreenMode() {
		var t = this,
		    isNative = t.media.rendererName !== null && /(native|html5)/i.test(t.media.rendererName);

		var mode = '';

		if (Features.HAS_TRUE_NATIVE_FULLSCREEN && isNative) {
			mode = 'native-native';
		} else if (Features.HAS_TRUE_NATIVE_FULLSCREEN && !isNative) {
			mode = 'plugin-native';
		} else if (t.usePluginFullScreen && Features.SUPPORT_POINTER_EVENTS) {
			mode = 'plugin-click';
		}

		t.fullscreenMode = mode;
		return mode;
	},
	enterFullScreen: function enterFullScreen() {
		var t = this,
		    isNative = t.media.rendererName !== null && /(html5|native)/i.test(t.media.rendererName),
		    containerStyles = getComputedStyle(t.getElement(t.container));

		if (t.options.useFakeFullscreen === false && Features.IS_IOS && Features.HAS_IOS_FULLSCREEN && typeof t.media.originalNode.webkitEnterFullscreen === 'function' && t.media.originalNode.canPlayType((0, _media.getTypeFromFile)(t.media.getSrc()))) {
			t.media.originalNode.webkitEnterFullscreen();
			return;
		}

		(0, _dom.addClass)(_document2.default.documentElement, t.options.classPrefix + 'fullscreen');
		(0, _dom.addClass)(t.getElement(t.container), t.options.classPrefix + 'container-fullscreen');

		t.normalHeight = parseFloat(containerStyles.height);
		t.normalWidth = parseFloat(containerStyles.width);

		if (t.fullscreenMode === 'native-native' || t.fullscreenMode === 'plugin-native') {
			Features.requestFullScreen(t.getElement(t.container));

			if (t.isInIframe) {
				setTimeout(function checkFullscreen() {

					if (t.isNativeFullScreen) {
						var percentErrorMargin = 0.002,
						    windowWidth = _window2.default.innerWidth || _document2.default.documentElement.clientWidth || _document2.default.body.clientWidth,
						    screenWidth = screen.width,
						    absDiff = Math.abs(screenWidth - windowWidth),
						    marginError = screenWidth * percentErrorMargin;

						if (absDiff > marginError) {
							t.exitFullScreen();
						} else {
							setTimeout(checkFullscreen, 500);
						}
					}
				}, 1000);
			}
		}

		t.getElement(t.container).style.width = '100%';
		t.getElement(t.container).style.height = '100%';

		t.containerSizeTimeout = setTimeout(function () {
			t.getElement(t.container).style.width = '100%';
			t.getElement(t.container).style.height = '100%';
			t.setControlsSize();
		}, 500);

		if (isNative) {
			t.node.style.width = '100%';
			t.node.style.height = '100%';
		} else {
			var elements = t.getElement(t.container).querySelectorAll('embed, object, video'),
			    _total = elements.length;
			for (var i = 0; i < _total; i++) {
				elements[i].style.width = '100%';
				elements[i].style.height = '100%';
			}
		}

		if (t.options.setDimensions && typeof t.media.setSize === 'function') {
			t.media.setSize(screen.width, screen.height);
		}

		var layers = t.getElement(t.layers).children,
		    total = layers.length;
		for (var _i = 0; _i < total; _i++) {
			layers[_i].style.width = '100%';
			layers[_i].style.height = '100%';
		}

		if (t.fullscreenBtn) {
			(0, _dom.removeClass)(t.fullscreenBtn, t.options.classPrefix + 'fullscreen');
			(0, _dom.addClass)(t.fullscreenBtn, t.options.classPrefix + 'unfullscreen');
		}

		t.setControlsSize();
		t.isFullScreen = true;

		var zoomFactor = Math.min(screen.width / t.width, screen.height / t.height),
		    captionText = t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'captions-text');
		if (captionText) {
			captionText.style.fontSize = zoomFactor * 100 + '%';
			captionText.style.lineHeight = 'normal';
			t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'captions-position').style.bottom = '45px';
		}
		var event = (0, _general.createEvent)('enteredfullscreen', t.getElement(t.container));
		t.getElement(t.container).dispatchEvent(event);
	},
	exitFullScreen: function exitFullScreen() {
		var t = this,
		    isNative = t.media.rendererName !== null && /(native|html5)/i.test(t.media.rendererName);

		clearTimeout(t.containerSizeTimeout);

		if (Features.HAS_TRUE_NATIVE_FULLSCREEN && (Features.IS_FULLSCREEN || t.isFullScreen)) {
			Features.cancelFullScreen();
		}

		(0, _dom.removeClass)(_document2.default.documentElement, t.options.classPrefix + 'fullscreen');
		(0, _dom.removeClass)(t.getElement(t.container), t.options.classPrefix + 'container-fullscreen');

		if (t.options.setDimensions) {
			t.getElement(t.container).style.width = t.normalWidth + 'px';
			t.getElement(t.container).style.height = t.normalHeight + 'px';

			if (isNative) {
				t.node.style.width = t.normalWidth + 'px';
				t.node.style.height = t.normalHeight + 'px';
			} else {
				var elements = t.getElement(t.container).querySelectorAll('embed, object, video'),
				    _total2 = elements.length;
				for (var i = 0; i < _total2; i++) {
					elements[i].style.width = t.normalWidth + 'px';
					elements[i].style.height = t.normalHeight + 'px';
				}
			}

			if (typeof t.media.setSize === 'function') {
				t.media.setSize(t.normalWidth, t.normalHeight);
			}

			var layers = t.getElement(t.layers).children,
			    total = layers.length;
			for (var _i2 = 0; _i2 < total; _i2++) {
				layers[_i2].style.width = t.normalWidth + 'px';
				layers[_i2].style.height = t.normalHeight + 'px';
			}
		}

		if (t.fullscreenBtn) {
			(0, _dom.removeClass)(t.fullscreenBtn, t.options.classPrefix + 'unfullscreen');
			(0, _dom.addClass)(t.fullscreenBtn, t.options.classPrefix + 'fullscreen');
		}

		t.setControlsSize();
		t.isFullScreen = false;

		var captionText = t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'captions-text');
		if (captionText) {
			captionText.style.fontSize = '';
			captionText.style.lineHeight = '';
			t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'captions-position').style.bottom = '';
		}
		var event = (0, _general.createEvent)('exitedfullscreen', t.getElement(t.container));
		t.getElement(t.container).dispatchEvent(event);
	}
});

},{"16":16,"2":2,"25":25,"26":26,"27":27,"28":28,"3":3,"5":5}],10:[function(_dereq_,module,exports){
'use strict';

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _player = _dereq_(16);

var _player2 = _interopRequireDefault(_player);

var _i18n = _dereq_(5);

var _i18n2 = _interopRequireDefault(_i18n);

var _general = _dereq_(27);

var _dom = _dereq_(26);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.assign(_player.config, {
	playText: null,

	pauseText: null
});

Object.assign(_player2.default.prototype, {
	buildplaypause: function buildplaypause(player, controls, layers, media) {
		var t = this,
		    op = t.options,
		    playTitle = (0, _general.isString)(op.playText) ? op.playText : _i18n2.default.t('mejs.play'),
		    pauseTitle = (0, _general.isString)(op.pauseText) ? op.pauseText : _i18n2.default.t('mejs.pause'),
		    play = _document2.default.createElement('div');

		play.className = t.options.classPrefix + 'button ' + t.options.classPrefix + 'playpause-button ' + t.options.classPrefix + 'play';
		play.innerHTML = '<button type="button" aria-controls="' + t.id + '" title="' + playTitle + '" aria-label="' + pauseTitle + '" tabindex="0"></button>';
		play.addEventListener('click', function () {
			if (t.paused) {
				t.play();
			} else {
				t.pause();
			}
		});

		var playBtn = play.querySelector('button');
		t.addControlElement(play, 'playpause');

		function togglePlayPause(which) {
			if ('play' === which) {
				(0, _dom.removeClass)(play, t.options.classPrefix + 'play');
				(0, _dom.removeClass)(play, t.options.classPrefix + 'replay');
				(0, _dom.addClass)(play, t.options.classPrefix + 'pause');
				playBtn.setAttribute('title', pauseTitle);
				playBtn.setAttribute('aria-label', pauseTitle);
			} else {

				(0, _dom.removeClass)(play, t.options.classPrefix + 'pause');
				(0, _dom.removeClass)(play, t.options.classPrefix + 'replay');
				(0, _dom.addClass)(play, t.options.classPrefix + 'play');
				playBtn.setAttribute('title', playTitle);
				playBtn.setAttribute('aria-label', playTitle);
			}
		}

		togglePlayPause('pse');

		media.addEventListener('loadedmetadata', function () {
			if (media.rendererName.indexOf('flash') === -1) {
				togglePlayPause('pse');
			}
		});
		media.addEventListener('play', function () {
			togglePlayPause('play');
		});
		media.addEventListener('playing', function () {
			togglePlayPause('play');
		});
		media.addEventListener('pause', function () {
			togglePlayPause('pse');
		});
		media.addEventListener('ended', function () {
			if (!player.options.loop) {
				(0, _dom.removeClass)(play, t.options.classPrefix + 'pause');
				(0, _dom.removeClass)(play, t.options.classPrefix + 'play');
				(0, _dom.addClass)(play, t.options.classPrefix + 'replay');
				playBtn.setAttribute('title', playTitle);
				playBtn.setAttribute('aria-label', playTitle);
			}
		});
	}
});

},{"16":16,"2":2,"26":26,"27":27,"5":5}],11:[function(_dereq_,module,exports){
'use strict';

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _player = _dereq_(16);

var _player2 = _interopRequireDefault(_player);

var _i18n = _dereq_(5);

var _i18n2 = _interopRequireDefault(_i18n);

var _constants = _dereq_(25);

var _time = _dereq_(30);

var _dom = _dereq_(26);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.assign(_player.config, {
	enableProgressTooltip: true,

	useSmoothHover: true,

	forceLive: false
});

Object.assign(_player2.default.prototype, {
	buildprogress: function buildprogress(player, controls, layers, media) {

		var lastKeyPressTime = 0,
		    mouseIsDown = false,
		    startedPaused = false;

		var t = this,
		    autoRewindInitial = player.options.autoRewind,
		    tooltip = player.options.enableProgressTooltip ? '<span class="' + t.options.classPrefix + 'time-float">' + ('<span class="' + t.options.classPrefix + 'time-float-current">00:00</span>') + ('<span class="' + t.options.classPrefix + 'time-float-corner"></span>') + '</span>' : '',
		    rail = _document2.default.createElement('div');

		rail.className = t.options.classPrefix + 'time-rail';
		rail.innerHTML = '<span class="' + t.options.classPrefix + 'time-total ' + t.options.classPrefix + 'time-slider">' + ('<span class="' + t.options.classPrefix + 'time-buffering"></span>') + ('<span class="' + t.options.classPrefix + 'time-loaded"></span>') + ('<span class="' + t.options.classPrefix + 'time-current"></span>') + ('<span class="' + t.options.classPrefix + 'time-hovered no-hover"></span>') + ('<span class="' + t.options.classPrefix + 'time-handle"><span class="' + t.options.classPrefix + 'time-handle-content"></span></span>') + ('' + tooltip) + '</span>';

		t.addControlElement(rail, 'progress');

		t.options.keyActions.push({
			keys: [37, 227],
			action: function action(player) {
				if (!isNaN(player.duration) && player.duration > 0) {
					if (player.isVideo) {
						player.showControls();
						player.startControlsTimer();
					}

					player.getElement(player.container).querySelector('.' + _player.config.classPrefix + 'time-total').focus();

					var newTime = Math.max(player.currentTime - player.options.defaultSeekBackwardInterval(player), 0);
					player.setCurrentTime(newTime);
				}
			}
		}, {
			keys: [39, 228],
			action: function action(player) {

				if (!isNaN(player.duration) && player.duration > 0) {
					if (player.isVideo) {
						player.showControls();
						player.startControlsTimer();
					}

					player.getElement(player.container).querySelector('.' + _player.config.classPrefix + 'time-total').focus();

					var newTime = Math.min(player.currentTime + player.options.defaultSeekForwardInterval(player), player.duration);
					player.setCurrentTime(newTime);
				}
			}
		});

		t.rail = controls.querySelector('.' + t.options.classPrefix + 'time-rail');
		t.total = controls.querySelector('.' + t.options.classPrefix + 'time-total');
		t.loaded = controls.querySelector('.' + t.options.classPrefix + 'time-loaded');
		t.current = controls.querySelector('.' + t.options.classPrefix + 'time-current');
		t.handle = controls.querySelector('.' + t.options.classPrefix + 'time-handle');
		t.timefloat = controls.querySelector('.' + t.options.classPrefix + 'time-float');
		t.timefloatcurrent = controls.querySelector('.' + t.options.classPrefix + 'time-float-current');
		t.slider = controls.querySelector('.' + t.options.classPrefix + 'time-slider');
		t.hovered = controls.querySelector('.' + t.options.classPrefix + 'time-hovered');
		t.buffer = controls.querySelector('.' + t.options.classPrefix + 'time-buffering');
		t.newTime = 0;
		t.forcedHandlePause = false;
		t.setTransformStyle = function (element, value) {
			element.style.transform = value;
			element.style.webkitTransform = value;
			element.style.MozTransform = value;
			element.style.msTransform = value;
			element.style.OTransform = value;
		};

		t.buffer.style.display = 'none';

		var handleMouseMove = function handleMouseMove(e) {
			var totalStyles = getComputedStyle(t.total),
			    offsetStyles = (0, _dom.offset)(t.total),
			    width = t.total.offsetWidth,
			    transform = function () {
				if (totalStyles.webkitTransform !== undefined) {
					return 'webkitTransform';
				} else if (totalStyles.mozTransform !== undefined) {
					return 'mozTransform ';
				} else if (totalStyles.oTransform !== undefined) {
					return 'oTransform';
				} else if (totalStyles.msTransform !== undefined) {
					return 'msTransform';
				} else {
					return 'transform';
				}
			}(),
			    cssMatrix = function () {
				if ('WebKitCSSMatrix' in window) {
					return 'WebKitCSSMatrix';
				} else if ('MSCSSMatrix' in window) {
					return 'MSCSSMatrix';
				} else if ('CSSMatrix' in window) {
					return 'CSSMatrix';
				}
			}();

			var percentage = 0,
			    leftPos = 0,
			    pos = 0,
			    x = void 0;

			if (e.originalEvent && e.originalEvent.changedTouches) {
				x = e.originalEvent.changedTouches[0].pageX;
			} else if (e.changedTouches) {
				x = e.changedTouches[0].pageX;
			} else {
				x = e.pageX;
			}

			if (t.getDuration()) {
				if (x < offsetStyles.left) {
					x = offsetStyles.left;
				} else if (x > width + offsetStyles.left) {
					x = width + offsetStyles.left;
				}

				pos = x - offsetStyles.left;
				percentage = pos / width;
				t.newTime = percentage <= 0.02 ? 0 : percentage * t.getDuration();

				if (mouseIsDown && t.getCurrentTime() !== null && t.newTime.toFixed(4) !== t.getCurrentTime().toFixed(4)) {
					t.setCurrentRailHandle(t.newTime);
					t.updateCurrent(t.newTime);
				}

				if (!_constants.IS_IOS && !_constants.IS_ANDROID) {
					if (pos < 0) {
						pos = 0;
					}
					if (t.options.useSmoothHover && cssMatrix !== null && typeof window[cssMatrix] !== 'undefined') {
						var matrix = new window[cssMatrix](getComputedStyle(t.handle)[transform]),
						    handleLocation = matrix.m41,
						    hoverScaleX = pos / parseFloat(getComputedStyle(t.total).width) - handleLocation / parseFloat(getComputedStyle(t.total).width);

						t.hovered.style.left = handleLocation + 'px';
						t.setTransformStyle(t.hovered, 'scaleX(' + hoverScaleX + ')');
						t.hovered.setAttribute('pos', pos);

						if (hoverScaleX >= 0) {
							(0, _dom.removeClass)(t.hovered, 'negative');
						} else {
							(0, _dom.addClass)(t.hovered, 'negative');
						}
					}

					if (t.timefloat) {
						var half = t.timefloat.offsetWidth / 2,
						    offsetContainer = mejs.Utils.offset(t.getElement(t.container)),
						    tooltipStyles = getComputedStyle(t.timefloat);

						if (x - offsetContainer.left < t.timefloat.offsetWidth) {
							leftPos = half;
						} else if (x - offsetContainer.left >= t.getElement(t.container).offsetWidth - half) {
							leftPos = t.total.offsetWidth - half;
						} else {
							leftPos = pos;
						}

						if ((0, _dom.hasClass)(t.getElement(t.container), t.options.classPrefix + 'long-video')) {
							leftPos += parseFloat(tooltipStyles.marginLeft) / 2 + t.timefloat.offsetWidth / 2;
						}

						t.timefloat.style.left = leftPos + 'px';
						t.timefloatcurrent.innerHTML = (0, _time.secondsToTimeCode)(t.newTime, player.options.alwaysShowHours, player.options.showTimecodeFrameCount, player.options.framesPerSecond, player.options.secondsDecimalLength, player.options.timeFormat);
						t.timefloat.style.display = 'block';
					}
				}
			} else if (!_constants.IS_IOS && !_constants.IS_ANDROID && t.timefloat) {
				leftPos = t.timefloat.offsetWidth + width >= t.getElement(t.container).offsetWidth ? t.timefloat.offsetWidth / 2 : 0;
				t.timefloat.style.left = leftPos + 'px';
				t.timefloat.style.left = leftPos + 'px';
				t.timefloat.style.display = 'block';
			}
		},
		    updateSlider = function updateSlider() {
			var seconds = t.getCurrentTime(),
			    timeSliderText = _i18n2.default.t('mejs.time-slider'),
			    time = (0, _time.secondsToTimeCode)(seconds, player.options.alwaysShowHours, player.options.showTimecodeFrameCount, player.options.framesPerSecond, player.options.secondsDecimalLength, player.options.timeFormat),
			    duration = t.getDuration();

			t.slider.setAttribute('role', 'slider');
			t.slider.tabIndex = 0;

			if (media.paused) {
				t.slider.setAttribute('aria-label', timeSliderText);
				t.slider.setAttribute('aria-valuemin', 0);
				t.slider.setAttribute('aria-valuemax', duration);
				t.slider.setAttribute('aria-valuenow', seconds);
				t.slider.setAttribute('aria-valuetext', time);
			} else {
				t.slider.removeAttribute('aria-label');
				t.slider.removeAttribute('aria-valuemin');
				t.slider.removeAttribute('aria-valuemax');
				t.slider.removeAttribute('aria-valuenow');
				t.slider.removeAttribute('aria-valuetext');
			}
		},
		    restartPlayer = function restartPlayer() {
			if (new Date() - lastKeyPressTime >= 1000) {
				t.play();
			}
		},
		    handleMouseup = function handleMouseup() {
			if (mouseIsDown && t.getCurrentTime() !== null && t.newTime.toFixed(4) !== t.getCurrentTime().toFixed(4)) {
				t.setCurrentTime(t.newTime);
				t.setCurrentRail();
				t.updateCurrent(t.newTime);
			}
			if (t.forcedHandlePause) {
				t.slider.focus();
				t.play();
			}
			t.forcedHandlePause = false;
		};

		t.slider.addEventListener('focus', function () {
			player.options.autoRewind = false;
		});
		t.slider.addEventListener('blur', function () {
			player.options.autoRewind = autoRewindInitial;
		});
		t.slider.addEventListener('keydown', function (e) {
			if (new Date() - lastKeyPressTime >= 1000) {
				startedPaused = t.paused;
			}

			if (t.options.keyActions.length) {

				var keyCode = e.which || e.keyCode || 0,
				    duration = t.getDuration(),
				    seekForward = player.options.defaultSeekForwardInterval(media),
				    seekBackward = player.options.defaultSeekBackwardInterval(media);

				var seekTime = t.getCurrentTime();
				var volume = t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'volume-slider');

				if (keyCode === 38 || keyCode === 40) {
					if (volume) {
						volume.style.display = 'block';
					}
					if (t.isVideo) {
						t.showControls();
						t.startControlsTimer();
					}

					var newVolume = keyCode === 38 ? Math.min(t.volume + 0.1, 1) : Math.max(t.volume - 0.1, 0),
					    mutePlayer = newVolume <= 0;
					t.setVolume(newVolume);
					t.setMuted(mutePlayer);
					return;
				} else {
					if (volume) {
						volume.style.display = 'none';
					}
				}

				switch (keyCode) {
					case 37:
						if (t.getDuration() !== Infinity) {
							seekTime -= seekBackward;
						}
						break;
					case 39:
						if (t.getDuration() !== Infinity) {
							seekTime += seekForward;
						}
						break;
					case 36:
						seekTime = 0;
						break;
					case 35:
						seekTime = duration;
						break;
					case 13:
					case 32:
						if (_constants.IS_FIREFOX) {
							if (t.paused) {
								t.play();
							} else {
								t.pause();
							}
						}
						return;
					default:
						return;
				}

				seekTime = seekTime < 0 ? 0 : seekTime >= duration ? duration : Math.floor(seekTime);
				lastKeyPressTime = new Date();
				if (!startedPaused) {
					player.pause();
				}

				if (seekTime < t.getDuration() && !startedPaused) {
					setTimeout(restartPlayer, 1100);
				}

				t.setCurrentTime(seekTime);
				player.showControls();

				e.preventDefault();
				e.stopPropagation();
			}
		});

		var events = ['mousedown', 'touchstart'];

		t.slider.addEventListener('dragstart', function () {
			return false;
		});

		for (var i = 0, total = events.length; i < total; i++) {
			t.slider.addEventListener(events[i], function (e) {
				t.forcedHandlePause = false;
				if (t.getDuration() !== Infinity) {
					if (e.which === 1 || e.which === 0) {
						if (!t.paused) {
							t.pause();
							t.forcedHandlePause = true;
						}

						mouseIsDown = true;
						handleMouseMove(e);
						var endEvents = ['mouseup', 'touchend'];

						for (var j = 0, totalEvents = endEvents.length; j < totalEvents; j++) {
							t.getElement(t.container).addEventListener(endEvents[j], function (event) {
								var target = event.target;
								if (target === t.slider || target.closest('.' + t.options.classPrefix + 'time-slider')) {
									handleMouseMove(event);
								}
							});
						}
						t.globalBind('mouseup.dur touchend.dur', function () {
							handleMouseup();
							mouseIsDown = false;
							if (t.timefloat) {
								t.timefloat.style.display = 'none';
							}
						});
					}
				}
			}, _constants.SUPPORT_PASSIVE_EVENT && events[i] === 'touchstart' ? { passive: true } : false);
		}
		t.slider.addEventListener('mouseenter', function (e) {
			if (e.target === t.slider && t.getDuration() !== Infinity) {
				t.getElement(t.container).addEventListener('mousemove', function (event) {
					var target = event.target;
					if (target === t.slider || target.closest('.' + t.options.classPrefix + 'time-slider')) {
						handleMouseMove(event);
					}
				});
				if (t.timefloat && !_constants.IS_IOS && !_constants.IS_ANDROID) {
					t.timefloat.style.display = 'block';
				}
				if (t.hovered && !_constants.IS_IOS && !_constants.IS_ANDROID && t.options.useSmoothHover) {
					(0, _dom.removeClass)(t.hovered, 'no-hover');
				}
			}
		});
		t.slider.addEventListener('mouseleave', function () {
			if (t.getDuration() !== Infinity) {
				if (!mouseIsDown) {
					if (t.timefloat) {
						t.timefloat.style.display = 'none';
					}
					if (t.hovered && t.options.useSmoothHover) {
						(0, _dom.addClass)(t.hovered, 'no-hover');
					}
				}
			}
		});

		t.broadcastCallback = function (e) {
			var broadcast = controls.querySelector('.' + t.options.classPrefix + 'broadcast');
			if (!t.options.forceLive && t.getDuration() !== Infinity) {
				if (broadcast) {
					t.slider.style.display = '';
					broadcast.remove();
				}

				player.setProgressRail(e);
				if (!t.forcedHandlePause) {
					player.setCurrentRail(e);
				}
				updateSlider();
			} else if (!broadcast || t.options.forceLive) {
				var label = _document2.default.createElement('span');
				label.className = t.options.classPrefix + 'broadcast';
				label.innerText = _i18n2.default.t('mejs.live-broadcast');
				t.slider.style.display = 'none';
				t.rail.appendChild(label);
			}
		};

		media.addEventListener('progress', t.broadcastCallback);
		media.addEventListener('timeupdate', t.broadcastCallback);
		media.addEventListener('play', function () {
			t.buffer.style.display = 'none';
		});
		media.addEventListener('playing', function () {
			t.buffer.style.display = 'none';
		});
		media.addEventListener('seeking', function () {
			t.buffer.style.display = '';
		});
		media.addEventListener('seeked', function () {
			t.buffer.style.display = 'none';
		});
		media.addEventListener('pause', function () {
			t.buffer.style.display = 'none';
		});
		media.addEventListener('waiting', function () {
			t.buffer.style.display = '';
		});
		media.addEventListener('loadeddata', function () {
			t.buffer.style.display = '';
		});
		media.addEventListener('canplay', function () {
			t.buffer.style.display = 'none';
		});
		media.addEventListener('error', function () {
			t.buffer.style.display = 'none';
		});

		t.getElement(t.container).addEventListener('controlsresize', function (e) {
			if (t.getDuration() !== Infinity) {
				player.setProgressRail(e);
				if (!t.forcedHandlePause) {
					player.setCurrentRail(e);
				}
			}
		});
	},
	cleanprogress: function cleanprogress(player, controls, layers, media) {
		media.removeEventListener('progress', player.broadcastCallback);
		media.removeEventListener('timeupdate', player.broadcastCallback);
		if (player.rail) {
			player.rail.remove();
		}
	},
	setProgressRail: function setProgressRail(e) {
		var t = this,
		    target = e !== undefined ? e.detail.target || e.target : t.media;

		var percent = null;

		if (target && target.buffered && target.buffered.length > 0 && target.buffered.end && t.getDuration()) {
			percent = target.buffered.end(target.buffered.length - 1) / t.getDuration();
		} else if (target && target.bytesTotal !== undefined && target.bytesTotal > 0 && target.bufferedBytes !== undefined) {
				percent = target.bufferedBytes / target.bytesTotal;
			} else if (e && e.lengthComputable && e.total !== 0) {
					percent = e.loaded / e.total;
				}

		if (percent !== null) {
			percent = Math.min(1, Math.max(0, percent));

			if (t.loaded) {
				t.setTransformStyle(t.loaded, 'scaleX(' + percent + ')');
			}
		}
	},
	setCurrentRailHandle: function setCurrentRailHandle(fakeTime) {
		var t = this;
		t.setCurrentRailMain(t, fakeTime);
	},
	setCurrentRail: function setCurrentRail() {
		var t = this;
		t.setCurrentRailMain(t);
	},
	setCurrentRailMain: function setCurrentRailMain(t, fakeTime) {
		if (t.getCurrentTime() !== undefined && t.getDuration()) {
			var nTime = typeof fakeTime === 'undefined' ? t.getCurrentTime() : fakeTime;

			if (t.total && t.handle) {
				var tW = parseFloat(getComputedStyle(t.total).width);

				var newWidth = Math.round(tW * nTime / t.getDuration()),
				    handlePos = newWidth - Math.round(t.handle.offsetWidth / 2);

				handlePos = handlePos < 0 ? 0 : handlePos;
				t.setTransformStyle(t.current, 'scaleX(' + newWidth / tW + ')');
				t.setTransformStyle(t.handle, 'translateX(' + handlePos + 'px)');

				if (t.options.useSmoothHover && !(0, _dom.hasClass)(t.hovered, 'no-hover')) {
					var pos = parseInt(t.hovered.getAttribute('pos'), 10);
					pos = isNaN(pos) ? 0 : pos;

					var hoverScaleX = pos / tW - handlePos / tW;

					t.hovered.style.left = handlePos + 'px';
					t.setTransformStyle(t.hovered, 'scaleX(' + hoverScaleX + ')');

					if (hoverScaleX >= 0) {
						(0, _dom.removeClass)(t.hovered, 'negative');
					} else {
						(0, _dom.addClass)(t.hovered, 'negative');
					}
				}
			}
		}
	}
});

},{"16":16,"2":2,"25":25,"26":26,"30":30,"5":5}],12:[function(_dereq_,module,exports){
'use strict';

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _player = _dereq_(16);

var _player2 = _interopRequireDefault(_player);

var _time = _dereq_(30);

var _dom = _dereq_(26);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.assign(_player.config, {
	duration: 0,

	timeAndDurationSeparator: '<span> | </span>'
});

Object.assign(_player2.default.prototype, {
	buildcurrent: function buildcurrent(player, controls, layers, media) {
		var t = this,
		    time = _document2.default.createElement('div');

		time.className = t.options.classPrefix + 'time';
		time.setAttribute('role', 'timer');
		time.setAttribute('aria-live', 'off');
		time.innerHTML = '<span class="' + t.options.classPrefix + 'currenttime">' + (0, _time.secondsToTimeCode)(0, player.options.alwaysShowHours, player.options.showTimecodeFrameCount, player.options.framesPerSecond, player.options.secondsDecimalLength, player.options.timeFormat) + '</span>';

		t.addControlElement(time, 'current');
		player.updateCurrent();
		t.updateTimeCallback = function () {
			if (t.controlsAreVisible) {
				player.updateCurrent();
			}
		};
		media.addEventListener('timeupdate', t.updateTimeCallback);
	},
	cleancurrent: function cleancurrent(player, controls, layers, media) {
		media.removeEventListener('timeupdate', player.updateTimeCallback);
	},
	buildduration: function buildduration(player, controls, layers, media) {
		var t = this,
		    currTime = controls.lastChild.querySelector('.' + t.options.classPrefix + 'currenttime');

		if (currTime) {
			controls.querySelector('.' + t.options.classPrefix + 'time').innerHTML += t.options.timeAndDurationSeparator + '<span class="' + t.options.classPrefix + 'duration">' + ((0, _time.secondsToTimeCode)(t.options.duration, t.options.alwaysShowHours, t.options.showTimecodeFrameCount, t.options.framesPerSecond, t.options.secondsDecimalLength, t.options.timeFormat) + '</span>');
		} else {
			if (controls.querySelector('.' + t.options.classPrefix + 'currenttime')) {
				(0, _dom.addClass)(controls.querySelector('.' + t.options.classPrefix + 'currenttime').parentNode, t.options.classPrefix + 'currenttime-container');
			}

			var duration = _document2.default.createElement('div');
			duration.className = t.options.classPrefix + 'time ' + t.options.classPrefix + 'duration-container';
			duration.innerHTML = '<span class="' + t.options.classPrefix + 'duration">' + ((0, _time.secondsToTimeCode)(t.options.duration, t.options.alwaysShowHours, t.options.showTimecodeFrameCount, t.options.framesPerSecond, t.options.secondsDecimalLength, t.options.timeFormat) + '</span>');

			t.addControlElement(duration, 'duration');
		}

		t.updateDurationCallback = function () {
			if (t.controlsAreVisible) {
				player.updateDuration();
			}
		};

		media.addEventListener('timeupdate', t.updateDurationCallback);
	},
	cleanduration: function cleanduration(player, controls, layers, media) {
		media.removeEventListener('timeupdate', player.updateDurationCallback);
	},
	updateCurrent: function updateCurrent() {
		var t = this;

		var currentTime = t.getCurrentTime();

		if (isNaN(currentTime)) {
			currentTime = 0;
		}

		var timecode = (0, _time.secondsToTimeCode)(currentTime, t.options.alwaysShowHours, t.options.showTimecodeFrameCount, t.options.framesPerSecond, t.options.secondsDecimalLength, t.options.timeFormat);

		if (timecode.length > 5) {
			(0, _dom.addClass)(t.getElement(t.container), t.options.classPrefix + 'long-video');
		} else {
			(0, _dom.removeClass)(t.getElement(t.container), t.options.classPrefix + 'long-video');
		}

		if (t.getElement(t.controls).querySelector('.' + t.options.classPrefix + 'currenttime')) {
			t.getElement(t.controls).querySelector('.' + t.options.classPrefix + 'currenttime').innerText = timecode;
		}
	},
	updateDuration: function updateDuration() {
		var t = this;

		var duration = t.getDuration();

		if (isNaN(duration) || duration === Infinity || duration < 0) {
			t.media.duration = t.options.duration = duration = 0;
		}

		if (t.options.duration > 0) {
			duration = t.options.duration;
		}

		var timecode = (0, _time.secondsToTimeCode)(duration, t.options.alwaysShowHours, t.options.showTimecodeFrameCount, t.options.framesPerSecond, t.options.secondsDecimalLength, t.options.timeFormat);

		if (timecode.length > 5) {
			(0, _dom.addClass)(t.getElement(t.container), t.options.classPrefix + 'long-video');
		} else {
			(0, _dom.removeClass)(t.getElement(t.container), t.options.classPrefix + 'long-video');
		}

		if (t.getElement(t.controls).querySelector('.' + t.options.classPrefix + 'duration') && duration > 0) {
			t.getElement(t.controls).querySelector('.' + t.options.classPrefix + 'duration').innerHTML = timecode;
		}
	}
});

},{"16":16,"2":2,"26":26,"30":30}],13:[function(_dereq_,module,exports){
'use strict';

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(7);

var _mejs2 = _interopRequireDefault(_mejs);

var _i18n = _dereq_(5);

var _i18n2 = _interopRequireDefault(_i18n);

var _player = _dereq_(16);

var _player2 = _interopRequireDefault(_player);

var _time = _dereq_(30);

var _general = _dereq_(27);

var _dom = _dereq_(26);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.assign(_player.config, {
	startLanguage: '',

	tracksText: null,

	chaptersText: null,

	tracksAriaLive: false,

	hideCaptionsButtonWhenEmpty: true,

	toggleCaptionsButtonWhenOnlyOne: false,

	slidesSelector: ''
});

Object.assign(_player2.default.prototype, {
	hasChapters: false,

	buildtracks: function buildtracks(player, controls, layers, media) {

		this.findTracks();

		if (!player.tracks.length && (!player.trackFiles || !player.trackFiles.length === 0)) {
			return;
		}

		var t = this,
		    attr = t.options.tracksAriaLive ? ' role="log" aria-live="assertive" aria-atomic="false"' : '',
		    tracksTitle = (0, _general.isString)(t.options.tracksText) ? t.options.tracksText : _i18n2.default.t('mejs.captions-subtitles'),
		    chaptersTitle = (0, _general.isString)(t.options.chaptersText) ? t.options.chaptersText : _i18n2.default.t('mejs.captions-chapters'),
		    total = player.trackFiles === null ? player.tracks.length : player.trackFiles.length;

		if (t.domNode.textTracks) {
			for (var i = t.domNode.textTracks.length - 1; i >= 0; i--) {
				t.domNode.textTracks[i].mode = 'hidden';
			}
		}

		t.cleartracks(player);

		player.captions = _document2.default.createElement('div');
		player.captions.className = t.options.classPrefix + 'captions-layer ' + t.options.classPrefix + 'layer';
		player.captions.innerHTML = '<div class="' + t.options.classPrefix + 'captions-position ' + t.options.classPrefix + 'captions-position-hover"' + attr + '>' + ('<span class="' + t.options.classPrefix + 'captions-text"></span>') + '</div>';
		player.captions.style.display = 'none';
		layers.insertBefore(player.captions, layers.firstChild);

		player.captionsText = player.captions.querySelector('.' + t.options.classPrefix + 'captions-text');

		player.captionsButton = _document2.default.createElement('div');
		player.captionsButton.className = t.options.classPrefix + 'button ' + t.options.classPrefix + 'captions-button';
		player.captionsButton.innerHTML = '<button type="button" aria-controls="' + t.id + '" title="' + tracksTitle + '" aria-label="' + tracksTitle + '" tabindex="0"></button>' + ('<div class="' + t.options.classPrefix + 'captions-selector ' + t.options.classPrefix + 'offscreen">') + ('<ul class="' + t.options.classPrefix + 'captions-selector-list">') + ('<li class="' + t.options.classPrefix + 'captions-selector-list-item">') + ('<input type="radio" class="' + t.options.classPrefix + 'captions-selector-input" ') + ('name="' + player.id + '_captions" id="' + player.id + '_captions_none" ') + 'value="none" checked disabled>' + ('<label class="' + t.options.classPrefix + 'captions-selector-label ') + (t.options.classPrefix + 'captions-selected" ') + ('for="' + player.id + '_captions_none">' + _i18n2.default.t('mejs.none') + '</label>') + '</li>' + '</ul>' + '</div>';

		t.addControlElement(player.captionsButton, 'tracks');

		player.captionsButton.querySelector('.' + t.options.classPrefix + 'captions-selector-input').disabled = false;

		player.chaptersButton = _document2.default.createElement('div');
		player.chaptersButton.className = t.options.classPrefix + 'button ' + t.options.classPrefix + 'chapters-button';
		player.chaptersButton.innerHTML = '<button type="button" aria-controls="' + t.id + '" title="' + chaptersTitle + '" aria-label="' + chaptersTitle + '" tabindex="0"></button>' + ('<div class="' + t.options.classPrefix + 'chapters-selector ' + t.options.classPrefix + 'offscreen">') + ('<ul class="' + t.options.classPrefix + 'chapters-selector-list"></ul>') + '</div>';

		var subtitleCount = 0;

		for (var _i = 0; _i < total; _i++) {
			var kind = player.tracks[_i].kind,
			    src = player.tracks[_i].src;
			if (src.trim()) {
				if (kind === 'subtitles' || kind === 'captions') {
					subtitleCount++;
				} else if (kind === 'chapters' && !controls.querySelector('.' + t.options.classPrefix + 'chapter-selector')) {
					player.captionsButton.parentNode.insertBefore(player.chaptersButton, player.captionsButton);
				}
			}
		}

		player.trackToLoad = -1;
		player.selectedTrack = null;
		player.isLoadingTrack = false;

		for (var _i2 = 0; _i2 < total; _i2++) {
			var _kind = player.tracks[_i2].kind;
			if (player.tracks[_i2].src.trim() && (_kind === 'subtitles' || _kind === 'captions')) {
				player.addTrackButton(player.tracks[_i2].trackId, player.tracks[_i2].srclang, player.tracks[_i2].label);
			}
		}

		player.loadNextTrack();

		var inEvents = ['mouseenter', 'focusin'],
		    outEvents = ['mouseleave', 'focusout'];

		if (t.options.toggleCaptionsButtonWhenOnlyOne && subtitleCount === 1) {
			player.captionsButton.addEventListener('click', function (e) {
				var trackId = 'none';
				if (player.selectedTrack === null) {
					trackId = player.tracks[0].trackId;
				}
				var keyboard = e.keyCode || e.which;
				player.setTrack(trackId, typeof keyboard !== 'undefined');
			});
		} else {
			var labels = player.captionsButton.querySelectorAll('.' + t.options.classPrefix + 'captions-selector-label'),
			    captions = player.captionsButton.querySelectorAll('input[type=radio]');

			for (var _i3 = 0, _total = inEvents.length; _i3 < _total; _i3++) {
				player.captionsButton.addEventListener(inEvents[_i3], function () {
					(0, _dom.removeClass)(this.querySelector('.' + t.options.classPrefix + 'captions-selector'), t.options.classPrefix + 'offscreen');
				});
			}

			for (var _i4 = 0, _total2 = outEvents.length; _i4 < _total2; _i4++) {
				player.captionsButton.addEventListener(outEvents[_i4], function () {
					(0, _dom.addClass)(this.querySelector('.' + t.options.classPrefix + 'captions-selector'), t.options.classPrefix + 'offscreen');
				});
			}

			for (var _i5 = 0, _total3 = captions.length; _i5 < _total3; _i5++) {
				captions[_i5].addEventListener('click', function (e) {
					var keyboard = e.keyCode || e.which;
					player.setTrack(this.value, typeof keyboard !== 'undefined');
				});
			}

			for (var _i6 = 0, _total4 = labels.length; _i6 < _total4; _i6++) {
				labels[_i6].addEventListener('click', function (e) {
					var radio = (0, _dom.siblings)(this, function (el) {
						return el.tagName === 'INPUT';
					})[0],
					    event = (0, _general.createEvent)('click', radio);
					radio.dispatchEvent(event);
					e.preventDefault();
				});
			}

			player.captionsButton.addEventListener('keydown', function (e) {
				e.stopPropagation();
			});
		}

		for (var _i7 = 0, _total5 = inEvents.length; _i7 < _total5; _i7++) {
			player.chaptersButton.addEventListener(inEvents[_i7], function () {
				if (this.querySelector('.' + t.options.classPrefix + 'chapters-selector-list').children.length) {
					(0, _dom.removeClass)(this.querySelector('.' + t.options.classPrefix + 'chapters-selector'), t.options.classPrefix + 'offscreen');
				}
			});
		}

		for (var _i8 = 0, _total6 = outEvents.length; _i8 < _total6; _i8++) {
			player.chaptersButton.addEventListener(outEvents[_i8], function () {
				(0, _dom.addClass)(this.querySelector('.' + t.options.classPrefix + 'chapters-selector'), t.options.classPrefix + 'offscreen');
			});
		}

		player.chaptersButton.addEventListener('keydown', function (e) {
			e.stopPropagation();
		});

		if (!player.options.alwaysShowControls) {
			player.getElement(player.container).addEventListener('controlsshown', function () {
				(0, _dom.addClass)(player.getElement(player.container).querySelector('.' + t.options.classPrefix + 'captions-position'), t.options.classPrefix + 'captions-position-hover');
			});

			player.getElement(player.container).addEventListener('controlshidden', function () {
				if (!media.paused) {
					(0, _dom.removeClass)(player.getElement(player.container).querySelector('.' + t.options.classPrefix + 'captions-position'), t.options.classPrefix + 'captions-position-hover');
				}
			});
		} else {
			(0, _dom.addClass)(player.getElement(player.container).querySelector('.' + t.options.classPrefix + 'captions-position'), t.options.classPrefix + 'captions-position-hover');
		}

		media.addEventListener('timeupdate', function () {
			player.displayCaptions();
		});

		if (player.options.slidesSelector !== '') {
			player.slidesContainer = _document2.default.querySelectorAll(player.options.slidesSelector);

			media.addEventListener('timeupdate', function () {
				player.displaySlides();
			});
		}
	},
	cleartracks: function cleartracks(player) {
		if (player) {
			if (player.captions) {
				player.captions.remove();
			}
			if (player.chapters) {
				player.chapters.remove();
			}
			if (player.captionsText) {
				player.captionsText.remove();
			}
			if (player.captionsButton) {
				player.captionsButton.remove();
			}
			if (player.chaptersButton) {
				player.chaptersButton.remove();
			}
		}
	},
	rebuildtracks: function rebuildtracks() {
		var t = this;
		t.findTracks();
		t.buildtracks(t, t.getElement(t.controls), t.getElement(t.layers), t.media);
	},
	findTracks: function findTracks() {
		var t = this,
		    tracktags = t.trackFiles === null ? t.node.querySelectorAll('track') : t.trackFiles,
		    total = tracktags.length;

		t.tracks = [];
		for (var i = 0; i < total; i++) {
			var track = tracktags[i],
			    srclang = track.getAttribute('srclang').toLowerCase() || '',
			    trackId = t.id + '_track_' + i + '_' + track.getAttribute('kind') + '_' + srclang;
			t.tracks.push({
				trackId: trackId,
				srclang: srclang,
				src: track.getAttribute('src'),
				kind: track.getAttribute('kind'),
				label: track.getAttribute('label') || '',
				entries: [],
				isLoaded: false
			});
		}
	},
	setTrack: function setTrack(trackId, setByKeyboard) {

		var t = this,
		    radios = t.captionsButton.querySelectorAll('input[type="radio"]'),
		    captions = t.captionsButton.querySelectorAll('.' + t.options.classPrefix + 'captions-selected'),
		    track = t.captionsButton.querySelector('input[value="' + trackId + '"]');

		for (var i = 0, total = radios.length; i < total; i++) {
			radios[i].checked = false;
		}

		for (var _i9 = 0, _total7 = captions.length; _i9 < _total7; _i9++) {
			(0, _dom.removeClass)(captions[_i9], t.options.classPrefix + 'captions-selected');
		}

		track.checked = true;
		var labels = (0, _dom.siblings)(track, function (el) {
			return (0, _dom.hasClass)(el, t.options.classPrefix + 'captions-selector-label');
		});
		for (var _i10 = 0, _total8 = labels.length; _i10 < _total8; _i10++) {
			(0, _dom.addClass)(labels[_i10], t.options.classPrefix + 'captions-selected');
		}

		if (trackId === 'none') {
			t.selectedTrack = null;
			(0, _dom.removeClass)(t.captionsButton, t.options.classPrefix + 'captions-enabled');
		} else {
			for (var _i11 = 0, _total9 = t.tracks.length; _i11 < _total9; _i11++) {
				var _track = t.tracks[_i11];
				if (_track.trackId === trackId) {
					if (t.selectedTrack === null) {
						(0, _dom.addClass)(t.captionsButton, t.options.classPrefix + 'captions-enabled');
					}
					t.selectedTrack = _track;
					t.captions.setAttribute('lang', t.selectedTrack.srclang);
					t.displayCaptions();
					break;
				}
			}
		}

		var event = (0, _general.createEvent)('captionschange', t.media);
		event.detail.caption = t.selectedTrack;
		t.media.dispatchEvent(event);

		if (!setByKeyboard) {
			setTimeout(function () {
				t.getElement(t.container).focus();
			}, 500);
		}
	},
	loadNextTrack: function loadNextTrack() {
		var t = this;

		t.trackToLoad++;
		if (t.trackToLoad < t.tracks.length) {
			t.isLoadingTrack = true;
			t.loadTrack(t.trackToLoad);
		} else {
			t.isLoadingTrack = false;
			t.checkForTracks();
		}
	},
	loadTrack: function loadTrack(index) {
		var t = this,
		    track = t.tracks[index];

		if (track !== undefined && (track.src !== undefined || track.src !== "")) {
			(0, _dom.ajax)(track.src, 'text', function (d) {
				track.entries = typeof d === 'string' && /<tt\s+xml/ig.exec(d) ? _mejs2.default.TrackFormatParser.dfxp.parse(d) : _mejs2.default.TrackFormatParser.webvtt.parse(d);

				track.isLoaded = true;
				t.enableTrackButton(track);
				t.loadNextTrack();

				if (track.kind === 'slides') {
					t.setupSlides(track);
				} else if (track.kind === 'chapters' && !t.hasChapters) {
						t.drawChapters(track);
						t.hasChapters = true;
					}
			}, function () {
				t.removeTrackButton(track.trackId);
				t.loadNextTrack();
			});
		}
	},
	enableTrackButton: function enableTrackButton(track) {
		var t = this,
		    lang = track.srclang,
		    target = _document2.default.getElementById('' + track.trackId);

		if (!target) {
			return;
		}

		var label = track.label;

		if (label === '') {
			label = _i18n2.default.t(_mejs2.default.language.codes[lang]) || lang;
		}
		target.disabled = false;
		var targetSiblings = (0, _dom.siblings)(target, function (el) {
			return (0, _dom.hasClass)(el, t.options.classPrefix + 'captions-selector-label');
		});
		for (var i = 0, total = targetSiblings.length; i < total; i++) {
			targetSiblings[i].innerHTML = label;
		}

		if (t.options.startLanguage === lang) {
			target.checked = true;
			var event = (0, _general.createEvent)('click', target);
			target.dispatchEvent(event);
		}
	},
	removeTrackButton: function removeTrackButton(trackId) {
		var element = _document2.default.getElementById('' + trackId);
		if (element) {
			var button = element.closest('li');
			if (button) {
				button.remove();
			}
		}
	},
	addTrackButton: function addTrackButton(trackId, lang, label) {
		var t = this;
		if (label === '') {
			label = _i18n2.default.t(_mejs2.default.language.codes[lang]) || lang;
		}

		t.captionsButton.querySelector('ul').innerHTML += '<li class="' + t.options.classPrefix + 'captions-selector-list-item">' + ('<input type="radio" class="' + t.options.classPrefix + 'captions-selector-input" ') + ('name="' + t.id + '_captions" id="' + trackId + '" value="' + trackId + '" disabled>') + ('<label class="' + t.options.classPrefix + 'captions-selector-label"') + ('for="' + trackId + '">' + label + ' (loading)</label>') + '</li>';
	},
	checkForTracks: function checkForTracks() {
		var t = this;

		var hasSubtitles = false;

		if (t.options.hideCaptionsButtonWhenEmpty) {
			for (var i = 0, total = t.tracks.length; i < total; i++) {
				var kind = t.tracks[i].kind;
				if ((kind === 'subtitles' || kind === 'captions') && t.tracks[i].isLoaded) {
					hasSubtitles = true;
					break;
				}
			}

			t.captionsButton.style.display = hasSubtitles ? '' : 'none';
			t.setControlsSize();
		}
	},
	displayCaptions: function displayCaptions() {
		if (this.tracks === undefined) {
			return;
		}

		var t = this,
		    track = t.selectedTrack,
		    sanitize = function sanitize(html) {
			var div = _document2.default.createElement('div');
			div.innerHTML = html;

			var scripts = div.getElementsByTagName('script');
			var i = scripts.length;
			while (i--) {
				scripts[i].remove();
			}

			var allElements = div.getElementsByTagName('*');
			for (var _i12 = 0, n = allElements.length; _i12 < n; _i12++) {
				var attributesObj = allElements[_i12].attributes,
				    attributes = Array.prototype.slice.call(attributesObj);

				for (var j = 0, total = attributes.length; j < total; j++) {
					if (attributes[j].name.startsWith('on') || attributes[j].value.startsWith('javascript')) {
						allElements[_i12].remove();
					} else if (attributes[j].name === 'style') {
						allElements[_i12].removeAttribute(attributes[j].name);
					}
				}
			}
			return div.innerHTML;
		};

		if (track !== null && track.isLoaded) {
			var i = t.searchTrackPosition(track.entries, t.media.currentTime);
			if (i > -1) {
				t.captionsText.innerHTML = sanitize(track.entries[i].text);
				t.captionsText.className = t.options.classPrefix + 'captions-text ' + (track.entries[i].identifier || '');
				t.captions.style.display = '';
				t.captions.style.height = '0px';
				return;
			}
			t.captions.style.display = 'none';
		} else {
			t.captions.style.display = 'none';
		}
	},
	setupSlides: function setupSlides(track) {
		var t = this;
		t.slides = track;
		t.slides.entries.imgs = [t.slides.entries.length];
		t.showSlide(0);
	},
	showSlide: function showSlide(index) {
		var _this = this;

		var t = this;

		if (t.tracks === undefined || t.slidesContainer === undefined) {
			return;
		}

		var url = t.slides.entries[index].text;

		var img = t.slides.entries[index].imgs;

		if (img === undefined || img.fadeIn === undefined) {
			var image = _document2.default.createElement('img');
			image.src = url;
			image.addEventListener('load', function () {
				var self = _this,
				    visible = (0, _dom.siblings)(self, function (el) {
					return visible(el);
				});
				self.style.display = 'none';
				t.slidesContainer.innerHTML += self.innerHTML;
				(0, _dom.fadeIn)(t.slidesContainer.querySelector(image));
				for (var i = 0, total = visible.length; i < total; i++) {
					(0, _dom.fadeOut)(visible[i], 400);
				}
			});
			t.slides.entries[index].imgs = img = image;
		} else if (!(0, _dom.visible)(img)) {
			var _visible = (0, _dom.siblings)(self, function (el) {
				return _visible(el);
			});
			(0, _dom.fadeIn)(t.slidesContainer.querySelector(img));
			for (var i = 0, total = _visible.length; i < total; i++) {
				(0, _dom.fadeOut)(_visible[i]);
			}
		}
	},
	displaySlides: function displaySlides() {
		var t = this;

		if (this.slides === undefined) {
			return;
		}

		var slides = t.slides,
		    i = t.searchTrackPosition(slides.entries, t.media.currentTime);

		if (i > -1) {
			t.showSlide(i);
		}
	},
	drawChapters: function drawChapters(chapters) {
		var t = this,
		    total = chapters.entries.length;

		if (!total) {
			return;
		}

		t.chaptersButton.querySelector('ul').innerHTML = '';

		for (var i = 0; i < total; i++) {
			t.chaptersButton.querySelector('ul').innerHTML += '<li class="' + t.options.classPrefix + 'chapters-selector-list-item" ' + 'role="menuitemcheckbox" aria-live="polite" aria-disabled="false" aria-checked="false">' + ('<input type="radio" class="' + t.options.classPrefix + 'captions-selector-input" ') + ('name="' + t.id + '_chapters" id="' + t.id + '_chapters_' + i + '" value="' + chapters.entries[i].start + '" disabled>') + ('<label class="' + t.options.classPrefix + 'chapters-selector-label"') + ('for="' + t.id + '_chapters_' + i + '">' + chapters.entries[i].text + '</label>') + '</li>';
		}

		var radios = t.chaptersButton.querySelectorAll('input[type="radio"]'),
		    labels = t.chaptersButton.querySelectorAll('.' + t.options.classPrefix + 'chapters-selector-label');

		for (var _i13 = 0, _total10 = radios.length; _i13 < _total10; _i13++) {
			radios[_i13].disabled = false;
			radios[_i13].checked = false;
			radios[_i13].addEventListener('click', function (e) {
				var self = this,
				    listItems = t.chaptersButton.querySelectorAll('li'),
				    label = (0, _dom.siblings)(self, function (el) {
					return (0, _dom.hasClass)(el, t.options.classPrefix + 'chapters-selector-label');
				})[0];

				self.checked = true;
				self.parentNode.setAttribute('aria-checked', true);
				(0, _dom.addClass)(label, t.options.classPrefix + 'chapters-selected');
				(0, _dom.removeClass)(t.chaptersButton.querySelector('.' + t.options.classPrefix + 'chapters-selected'), t.options.classPrefix + 'chapters-selected');

				for (var _i14 = 0, _total11 = listItems.length; _i14 < _total11; _i14++) {
					listItems[_i14].setAttribute('aria-checked', false);
				}

				var keyboard = e.keyCode || e.which;
				if (typeof keyboard === 'undefined') {
					setTimeout(function () {
						t.getElement(t.container).focus();
					}, 500);
				}

				t.media.setCurrentTime(parseFloat(self.value));
				if (t.media.paused) {
					t.media.play();
				}
			});
		}

		for (var _i15 = 0, _total12 = labels.length; _i15 < _total12; _i15++) {
			labels[_i15].addEventListener('click', function (e) {
				var radio = (0, _dom.siblings)(this, function (el) {
					return el.tagName === 'INPUT';
				})[0],
				    event = (0, _general.createEvent)('click', radio);
				radio.dispatchEvent(event);
				e.preventDefault();
			});
		}
	},
	searchTrackPosition: function searchTrackPosition(tracks, currentTime) {
		var lo = 0,
		    hi = tracks.length - 1,
		    mid = void 0,
		    start = void 0,
		    stop = void 0;

		while (lo <= hi) {
			mid = lo + hi >> 1;
			start = tracks[mid].start;
			stop = tracks[mid].stop;

			if (currentTime >= start && currentTime < stop) {
				return mid;
			} else if (start < currentTime) {
				lo = mid + 1;
			} else if (start > currentTime) {
				hi = mid - 1;
			}
		}

		return -1;
	}
});

_mejs2.default.language = {
	codes: {
		af: 'mejs.afrikaans',
		sq: 'mejs.albanian',
		ar: 'mejs.arabic',
		be: 'mejs.belarusian',
		bg: 'mejs.bulgarian',
		ca: 'mejs.catalan',
		zh: 'mejs.chinese',
		'zh-cn': 'mejs.chinese-simplified',
		'zh-tw': 'mejs.chines-traditional',
		hr: 'mejs.croatian',
		cs: 'mejs.czech',
		da: 'mejs.danish',
		nl: 'mejs.dutch',
		en: 'mejs.english',
		et: 'mejs.estonian',
		fl: 'mejs.filipino',
		fi: 'mejs.finnish',
		fr: 'mejs.french',
		gl: 'mejs.galician',
		de: 'mejs.german',
		el: 'mejs.greek',
		ht: 'mejs.haitian-creole',
		iw: 'mejs.hebrew',
		hi: 'mejs.hindi',
		hu: 'mejs.hungarian',
		is: 'mejs.icelandic',
		id: 'mejs.indonesian',
		ga: 'mejs.irish',
		it: 'mejs.italian',
		ja: 'mejs.japanese',
		ko: 'mejs.korean',
		lv: 'mejs.latvian',
		lt: 'mejs.lithuanian',
		mk: 'mejs.macedonian',
		ms: 'mejs.malay',
		mt: 'mejs.maltese',
		no: 'mejs.norwegian',
		fa: 'mejs.persian',
		pl: 'mejs.polish',
		pt: 'mejs.portuguese',
		ro: 'mejs.romanian',
		ru: 'mejs.russian',
		sr: 'mejs.serbian',
		sk: 'mejs.slovak',
		sl: 'mejs.slovenian',
		es: 'mejs.spanish',
		sw: 'mejs.swahili',
		sv: 'mejs.swedish',
		tl: 'mejs.tagalog',
		th: 'mejs.thai',
		tr: 'mejs.turkish',
		uk: 'mejs.ukrainian',
		vi: 'mejs.vietnamese',
		cy: 'mejs.welsh',
		yi: 'mejs.yiddish'
	}
};

_mejs2.default.TrackFormatParser = {
	webvtt: {
		pattern: /^((?:[0-9]{1,2}:)?[0-9]{2}:[0-9]{2}([,.][0-9]{1,3})?) --\> ((?:[0-9]{1,2}:)?[0-9]{2}:[0-9]{2}([,.][0-9]{3})?)(.*)$/,

		parse: function parse(trackText) {
			var lines = trackText.split(/\r?\n/),
			    entries = [];

			var timecode = void 0,
			    text = void 0,
			    identifier = void 0;

			for (var i = 0, total = lines.length; i < total; i++) {
				timecode = this.pattern.exec(lines[i]);

				if (timecode && i < lines.length) {
					if (i - 1 >= 0 && lines[i - 1] !== '') {
						identifier = lines[i - 1];
					}
					i++;

					text = lines[i];
					i++;
					while (lines[i] !== '' && i < lines.length) {
						text = text + '\n' + lines[i];
						i++;
					}
					text = text.trim().replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, "<a href='$1' target='_blank'>$1</a>");
					entries.push({
						identifier: identifier,
						start: (0, _time.convertSMPTEtoSeconds)(timecode[1]) === 0 ? 0.200 : (0, _time.convertSMPTEtoSeconds)(timecode[1]),
						stop: (0, _time.convertSMPTEtoSeconds)(timecode[3]),
						text: text,
						settings: timecode[5]
					});
				}
				identifier = '';
			}
			return entries;
		}
	},

	dfxp: {
		parse: function parse(trackText) {
			trackText = $(trackText).filter('tt');
			var container = trackText.firstChild,
			    lines = container.querySelectorAll('p'),
			    styleNode = trackText.getElementById('' + container.attr('style')),
			    entries = [];

			var styles = void 0;

			if (styleNode.length) {
				styleNode.removeAttribute('id');
				var attributes = styleNode.attributes;
				if (attributes.length) {
					styles = {};
					for (var i = 0, total = attributes.length; i < total; i++) {
						styles[attributes[i].name.split(":")[1]] = attributes[i].value;
					}
				}
			}

			for (var _i16 = 0, _total13 = lines.length; _i16 < _total13; _i16++) {
				var style = void 0,
				    _temp = {
					start: null,
					stop: null,
					style: null,
					text: null
				};

				if (lines.eq(_i16).attr('begin')) {
					_temp.start = (0, _time.convertSMPTEtoSeconds)(lines.eq(_i16).attr('begin'));
				}
				if (!_temp.start && lines.eq(_i16 - 1).attr('end')) {
					_temp.start = (0, _time.convertSMPTEtoSeconds)(lines.eq(_i16 - 1).attr('end'));
				}
				if (lines.eq(_i16).attr('end')) {
					_temp.stop = (0, _time.convertSMPTEtoSeconds)(lines.eq(_i16).attr('end'));
				}
				if (!_temp.stop && lines.eq(_i16 + 1).attr('begin')) {
					_temp.stop = (0, _time.convertSMPTEtoSeconds)(lines.eq(_i16 + 1).attr('begin'));
				}

				if (styles) {
					style = '';
					for (var _style in styles) {
						style += _style + ':' + styles[_style] + ';';
					}
				}
				if (style) {
					_temp.style = style;
				}
				if (_temp.start === 0) {
					_temp.start = 0.200;
				}
				_temp.text = lines.eq(_i16).innerHTML.trim().replace(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, "<a href='$1' target='_blank'>$1</a>");
				entries.push(_temp);
			}
			return entries;
		}
	}
};

},{"16":16,"2":2,"26":26,"27":27,"30":30,"5":5,"7":7}],14:[function(_dereq_,module,exports){
'use strict';

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _player = _dereq_(16);

var _player2 = _interopRequireDefault(_player);

var _i18n = _dereq_(5);

var _i18n2 = _interopRequireDefault(_i18n);

var _constants = _dereq_(25);

var _general = _dereq_(27);

var _dom = _dereq_(26);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.assign(_player.config, {
	muteText: null,

	unmuteText: null,

	allyVolumeControlText: null,

	hideVolumeOnTouchDevices: true,

	audioVolume: 'horizontal',

	videoVolume: 'vertical',

	startVolume: 0.8
});

Object.assign(_player2.default.prototype, {
	buildvolume: function buildvolume(player, controls, layers, media) {
		if ((_constants.IS_ANDROID || _constants.IS_IOS) && this.options.hideVolumeOnTouchDevices) {
			return;
		}

		var t = this,
		    mode = t.isVideo ? t.options.videoVolume : t.options.audioVolume,
		    muteText = (0, _general.isString)(t.options.muteText) ? t.options.muteText : _i18n2.default.t('mejs.mute'),
		    unmuteText = (0, _general.isString)(t.options.unmuteText) ? t.options.unmuteText : _i18n2.default.t('mejs.unmute'),
		    volumeControlText = (0, _general.isString)(t.options.allyVolumeControlText) ? t.options.allyVolumeControlText : _i18n2.default.t('mejs.volume-help-text'),
		    mute = _document2.default.createElement('div');

		mute.className = t.options.classPrefix + 'button ' + t.options.classPrefix + 'volume-button ' + t.options.classPrefix + 'mute';
		mute.innerHTML = mode === 'horizontal' ? '<button type="button" aria-controls="' + t.id + '" title="' + muteText + '" aria-label="' + muteText + '" tabindex="0"></button>' : '<button type="button" aria-controls="' + t.id + '" title="' + muteText + '" aria-label="' + muteText + '" tabindex="0"></button>' + ('<a href="javascript:void(0);" class="' + t.options.classPrefix + 'volume-slider" ') + ('aria-label="' + _i18n2.default.t('mejs.volume-slider') + '" aria-valuemin="0" aria-valuemax="100" role="slider" ') + 'aria-orientation="vertical">' + ('<span class="' + t.options.classPrefix + 'offscreen">' + volumeControlText + '</span>') + ('<div class="' + t.options.classPrefix + 'volume-total">') + ('<div class="' + t.options.classPrefix + 'volume-current"></div>') + ('<div class="' + t.options.classPrefix + 'volume-handle"></div>') + '</div>' + '</a>';

		t.addControlElement(mute, 'volume');

		t.options.keyActions.push({
			keys: [38],
			action: function action(player) {
				var volumeSlider = player.getElement(player.container).querySelector('.' + _player.config.classPrefix + 'volume-slider');
				if (volumeSlider || player.getElement(player.container).querySelector('.' + _player.config.classPrefix + 'volume-slider').matches(':focus')) {
					volumeSlider.style.display = 'block';
				}
				if (player.isVideo) {
					player.showControls();
					player.startControlsTimer();
				}

				var newVolume = Math.min(player.volume + 0.1, 1);
				player.setVolume(newVolume);
				if (newVolume > 0) {
					player.setMuted(false);
				}
			}
		}, {
			keys: [40],
			action: function action(player) {
				var volumeSlider = player.getElement(player.container).querySelector('.' + _player.config.classPrefix + 'volume-slider');
				if (volumeSlider) {
					volumeSlider.style.display = 'block';
				}

				if (player.isVideo) {
					player.showControls();
					player.startControlsTimer();
				}

				var newVolume = Math.max(player.volume - 0.1, 0);
				player.setVolume(newVolume);

				if (newVolume <= 0.1) {
					player.setMuted(true);
				}
			}
		}, {
			keys: [77],
			action: function action(player) {
				player.getElement(player.container).querySelector('.' + _player.config.classPrefix + 'volume-slider').style.display = 'block';
				if (player.isVideo) {
					player.showControls();
					player.startControlsTimer();
				}
				if (player.media.muted) {
					player.setMuted(false);
				} else {
					player.setMuted(true);
				}
			}
		});

		if (mode === 'horizontal') {
			var anchor = _document2.default.createElement('a');
			anchor.className = t.options.classPrefix + 'horizontal-volume-slider';
			anchor.href = 'javascript:void(0);';
			anchor.setAttribute('aria-label', _i18n2.default.t('mejs.volume-slider'));
			anchor.setAttribute('aria-valuemin', 0);
			anchor.setAttribute('aria-valuemax', 100);
			anchor.setAttribute('role', 'slider');
			anchor.innerHTML += '<span class="' + t.options.classPrefix + 'offscreen">' + volumeControlText + '</span>' + ('<div class="' + t.options.classPrefix + 'horizontal-volume-total">') + ('<div class="' + t.options.classPrefix + 'horizontal-volume-current"></div>') + ('<div class="' + t.options.classPrefix + 'horizontal-volume-handle"></div>') + '</div>';
			mute.parentNode.insertBefore(anchor, mute.nextSibling);
		}

		var mouseIsDown = false,
		    mouseIsOver = false,
		    modified = false,
		    updateVolumeSlider = function updateVolumeSlider() {
			var volume = Math.floor(media.volume * 100);
			volumeSlider.setAttribute('aria-valuenow', volume);
			volumeSlider.setAttribute('aria-valuetext', volume + '%');
		};

		var volumeSlider = mode === 'vertical' ? t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'volume-slider') : t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'horizontal-volume-slider'),
		    volumeTotal = mode === 'vertical' ? t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'volume-total') : t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'horizontal-volume-total'),
		    volumeCurrent = mode === 'vertical' ? t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'volume-current') : t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'horizontal-volume-current'),
		    volumeHandle = mode === 'vertical' ? t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'volume-handle') : t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'horizontal-volume-handle'),
		    positionVolumeHandle = function positionVolumeHandle(volume) {

			if (volume === null || isNaN(volume) || volume === undefined) {
				return;
			}

			volume = Math.max(0, volume);
			volume = Math.min(volume, 1);

			if (volume === 0) {
				(0, _dom.removeClass)(mute, t.options.classPrefix + 'mute');
				(0, _dom.addClass)(mute, t.options.classPrefix + 'unmute');
				var button = mute.firstElementChild;
				button.setAttribute('title', unmuteText);
				button.setAttribute('aria-label', unmuteText);
			} else {
				(0, _dom.removeClass)(mute, t.options.classPrefix + 'unmute');
				(0, _dom.addClass)(mute, t.options.classPrefix + 'mute');
				var _button = mute.firstElementChild;
				_button.setAttribute('title', muteText);
				_button.setAttribute('aria-label', muteText);
			}

			var volumePercentage = volume * 100 + '%',
			    volumeStyles = getComputedStyle(volumeHandle);

			if (mode === 'vertical') {
				volumeCurrent.style.bottom = 0;
				volumeCurrent.style.height = volumePercentage;
				volumeHandle.style.bottom = volumePercentage;
				volumeHandle.style.marginBottom = -parseFloat(volumeStyles.height) / 2 + 'px';
			} else {
				volumeCurrent.style.left = 0;
				volumeCurrent.style.width = volumePercentage;
				volumeHandle.style.left = volumePercentage;
				volumeHandle.style.marginLeft = -parseFloat(volumeStyles.width) / 2 + 'px';
			}
		},
		    handleVolumeMove = function handleVolumeMove(e) {
			var totalOffset = (0, _dom.offset)(volumeTotal),
			    volumeStyles = getComputedStyle(volumeTotal);

			modified = true;

			var volume = null;

			if (mode === 'vertical') {
				var railHeight = parseFloat(volumeStyles.height),
				    newY = e.pageY - totalOffset.top;

				volume = (railHeight - newY) / railHeight;

				if (totalOffset.top === 0 || totalOffset.left === 0) {
					return;
				}
			} else {
				var railWidth = parseFloat(volumeStyles.width),
				    newX = e.pageX - totalOffset.left;

				volume = newX / railWidth;
			}

			volume = Math.max(0, volume);
			volume = Math.min(volume, 1);

			positionVolumeHandle(volume);

			t.setMuted(volume === 0);
			t.setVolume(volume);

			e.preventDefault();
			e.stopPropagation();
		},
		    toggleMute = function toggleMute() {
			if (t.muted) {
				positionVolumeHandle(0);
				(0, _dom.removeClass)(mute, t.options.classPrefix + 'mute');
				(0, _dom.addClass)(mute, t.options.classPrefix + 'unmute');
			} else {
				positionVolumeHandle(media.volume);
				(0, _dom.removeClass)(mute, t.options.classPrefix + 'unmute');
				(0, _dom.addClass)(mute, t.options.classPrefix + 'mute');
			}
		};

		player.getElement(player.container).addEventListener('keydown', function (e) {
			var hasFocus = !!e.target.closest('.' + t.options.classPrefix + 'container');
			if (!hasFocus && mode === 'vertical') {
				volumeSlider.style.display = 'none';
			}
		});

		mute.addEventListener('mouseenter', function (e) {
			if (e.target === mute) {
				volumeSlider.style.display = 'block';
				mouseIsOver = true;
				e.preventDefault();
				e.stopPropagation();
			}
		});
		mute.addEventListener('focusin', function () {
			volumeSlider.style.display = 'block';
			mouseIsOver = true;
		});

		mute.addEventListener('focusout', function (e) {
			if ((!e.relatedTarget || e.relatedTarget && !e.relatedTarget.matches('.' + t.options.classPrefix + 'volume-slider')) && mode === 'vertical') {
				volumeSlider.style.display = 'none';
			}
		});
		mute.addEventListener('mouseleave', function () {
			mouseIsOver = false;
			if (!mouseIsDown && mode === 'vertical') {
				volumeSlider.style.display = 'none';
			}
		});
		mute.addEventListener('focusout', function () {
			mouseIsOver = false;
		});
		mute.addEventListener('keydown', function (e) {
			if (t.options.keyActions.length) {
				var keyCode = e.which || e.keyCode || 0,
				    volume = media.volume;

				switch (keyCode) {
					case 38:
						volume = Math.min(volume + 0.1, 1);
						break;
					case 40:
						volume = Math.max(0, volume - 0.1);
						break;
					default:
						return true;
				}

				mouseIsDown = false;
				positionVolumeHandle(volume);
				media.setVolume(volume);

				e.preventDefault();
				e.stopPropagation();
			}
		});
		mute.querySelector('button').addEventListener('click', function () {
			media.setMuted(!media.muted);
			var event = (0, _general.createEvent)('volumechange', media);
			media.dispatchEvent(event);
		});

		volumeSlider.addEventListener('dragstart', function () {
			return false;
		});

		volumeSlider.addEventListener('mouseover', function () {
			mouseIsOver = true;
		});
		volumeSlider.addEventListener('focusin', function () {
			volumeSlider.style.display = 'block';
			mouseIsOver = true;
		});
		volumeSlider.addEventListener('focusout', function () {
			mouseIsOver = false;
			if (!mouseIsDown && mode === 'vertical') {
				volumeSlider.style.display = 'none';
			}
		});
		volumeSlider.addEventListener('mousedown', function (e) {
			handleVolumeMove(e);
			t.globalBind('mousemove.vol', function (event) {
				var target = event.target;
				if (mouseIsDown && (target === volumeSlider || target.closest(mode === 'vertical' ? '.' + t.options.classPrefix + 'volume-slider' : '.' + t.options.classPrefix + 'horizontal-volume-slider'))) {
					handleVolumeMove(event);
				}
			});
			t.globalBind('mouseup.vol', function () {
				mouseIsDown = false;
				if (!mouseIsOver && mode === 'vertical') {
					volumeSlider.style.display = 'none';
				}
			});
			mouseIsDown = true;
			e.preventDefault();
			e.stopPropagation();
		});

		media.addEventListener('volumechange', function (e) {
			if (!mouseIsDown) {
				toggleMute();
			}
			updateVolumeSlider(e);
		});

		var rendered = false;
		media.addEventListener('rendererready', function () {
			if (!modified) {
				setTimeout(function () {
					rendered = true;
					if (player.options.startVolume === 0 || media.originalNode.muted) {
						media.setMuted(true);
						player.options.startVolume = 0;
					}
					media.setVolume(player.options.startVolume);
					t.setControlsSize();
				}, 250);
			}
		});

		media.addEventListener('loadedmetadata', function () {
			setTimeout(function () {
				if (!modified && !rendered) {
					if (player.options.startVolume === 0 || media.originalNode.muted) {
						media.setMuted(true);
						player.options.startVolume = 0;
					}
					media.setVolume(player.options.startVolume);
					t.setControlsSize();
				}
				rendered = false;
			}, 250);
		});

		if (player.options.startVolume === 0 || media.originalNode.muted) {
			media.setMuted(true);
			player.options.startVolume = 0;
			toggleMute();
		}

		t.getElement(t.container).addEventListener('controlsresize', function () {
			toggleMute();
		});
	}
});

},{"16":16,"2":2,"25":25,"26":26,"27":27,"5":5}],15:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var EN = exports.EN = {
	'mejs.plural-form': 1,

	'mejs.download-file': 'Download File',

	'mejs.install-flash': 'You are using a browser that does not have Flash player enabled or installed. Please turn on your Flash player plugin or download the latest version from https://get.adobe.com/flashplayer/',

	'mejs.fullscreen': 'Fullscreen',

	'mejs.play': 'Play',
	'mejs.pause': 'Pause',

	'mejs.time-slider': 'Time Slider',
	'mejs.time-help-text': 'Use Left/Right Arrow keys to advance one second, Up/Down arrows to advance ten seconds.',
	'mejs.live-broadcast': 'Live Broadcast',

	'mejs.volume-help-text': 'Use Up/Down Arrow keys to increase or decrease volume.',
	'mejs.unmute': 'Unmute',
	'mejs.mute': 'Mute',
	'mejs.volume-slider': 'Volume Slider',

	'mejs.video-player': 'Video Player',
	'mejs.audio-player': 'Audio Player',

	'mejs.captions-subtitles': 'Captions/Subtitles',
	'mejs.captions-chapters': 'Chapters',
	'mejs.none': 'None',
	'mejs.afrikaans': 'Afrikaans',
	'mejs.albanian': 'Albanian',
	'mejs.arabic': 'Arabic',
	'mejs.belarusian': 'Belarusian',
	'mejs.bulgarian': 'Bulgarian',
	'mejs.catalan': 'Catalan',
	'mejs.chinese': 'Chinese',
	'mejs.chinese-simplified': 'Chinese (Simplified)',
	'mejs.chinese-traditional': 'Chinese (Traditional)',
	'mejs.croatian': 'Croatian',
	'mejs.czech': 'Czech',
	'mejs.danish': 'Danish',
	'mejs.dutch': 'Dutch',
	'mejs.english': 'English',
	'mejs.estonian': 'Estonian',
	'mejs.filipino': 'Filipino',
	'mejs.finnish': 'Finnish',
	'mejs.french': 'French',
	'mejs.galician': 'Galician',
	'mejs.german': 'German',
	'mejs.greek': 'Greek',
	'mejs.haitian-creole': 'Haitian Creole',
	'mejs.hebrew': 'Hebrew',
	'mejs.hindi': 'Hindi',
	'mejs.hungarian': 'Hungarian',
	'mejs.icelandic': 'Icelandic',
	'mejs.indonesian': 'Indonesian',
	'mejs.irish': 'Irish',
	'mejs.italian': 'Italian',
	'mejs.japanese': 'Japanese',
	'mejs.korean': 'Korean',
	'mejs.latvian': 'Latvian',
	'mejs.lithuanian': 'Lithuanian',
	'mejs.macedonian': 'Macedonian',
	'mejs.malay': 'Malay',
	'mejs.maltese': 'Maltese',
	'mejs.norwegian': 'Norwegian',
	'mejs.persian': 'Persian',
	'mejs.polish': 'Polish',
	'mejs.portuguese': 'Portuguese',
	'mejs.romanian': 'Romanian',
	'mejs.russian': 'Russian',
	'mejs.serbian': 'Serbian',
	'mejs.slovak': 'Slovak',
	'mejs.slovenian': 'Slovenian',
	'mejs.spanish': 'Spanish',
	'mejs.swahili': 'Swahili',
	'mejs.swedish': 'Swedish',
	'mejs.tagalog': 'Tagalog',
	'mejs.thai': 'Thai',
	'mejs.turkish': 'Turkish',
	'mejs.ukrainian': 'Ukrainian',
	'mejs.vietnamese': 'Vietnamese',
	'mejs.welsh': 'Welsh',
	'mejs.yiddish': 'Yiddish'
};

},{}],16:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.config = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(7);

var _mejs2 = _interopRequireDefault(_mejs);

var _mediaelement = _dereq_(6);

var _mediaelement2 = _interopRequireDefault(_mediaelement);

var _default = _dereq_(17);

var _default2 = _interopRequireDefault(_default);

var _i18n = _dereq_(5);

var _i18n2 = _interopRequireDefault(_i18n);

var _constants = _dereq_(25);

var _general = _dereq_(27);

var _time = _dereq_(30);

var _media = _dereq_(28);

var _dom = _dereq_(26);

var dom = _interopRequireWildcard(_dom);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_mejs2.default.mepIndex = 0;

_mejs2.default.players = {};

var config = exports.config = {
	poster: '',

	showPosterWhenEnded: false,

	showPosterWhenPaused: false,

	defaultVideoWidth: 480,

	defaultVideoHeight: 270,

	videoWidth: -1,

	videoHeight: -1,

	defaultAudioWidth: 400,

	defaultAudioHeight: 40,

	defaultSeekBackwardInterval: function defaultSeekBackwardInterval(media) {
		return media.getDuration() * 0.05;
	},

	defaultSeekForwardInterval: function defaultSeekForwardInterval(media) {
		return media.getDuration() * 0.05;
	},

	setDimensions: true,

	audioWidth: -1,

	audioHeight: -1,

	loop: false,

	autoRewind: true,

	enableAutosize: true,

	timeFormat: '',

	alwaysShowHours: false,

	showTimecodeFrameCount: false,

	framesPerSecond: 25,

	alwaysShowControls: false,

	hideVideoControlsOnLoad: false,

	hideVideoControlsOnPause: false,

	clickToPlayPause: true,

	controlsTimeoutDefault: 1500,

	controlsTimeoutMouseEnter: 2500,

	controlsTimeoutMouseLeave: 1000,

	iPadUseNativeControls: false,

	iPhoneUseNativeControls: false,

	AndroidUseNativeControls: false,

	features: ['playpause', 'current', 'progress', 'duration', 'tracks', 'volume', 'fullscreen'],

	useDefaultControls: false,

	isVideo: true,

	stretching: 'auto',

	classPrefix: 'mejs__',

	enableKeyboard: true,

	pauseOtherPlayers: true,

	secondsDecimalLength: 0,

	customError: null,

	keyActions: [{
		keys: [32, 179],
		action: function action(player) {

			if (!_constants.IS_FIREFOX) {
				if (player.paused || player.ended) {
					player.play();
				} else {
					player.pause();
				}
			}
		}
	}]
};

_mejs2.default.MepDefaults = config;

var MediaElementPlayer = function () {
	function MediaElementPlayer(node, o) {
		_classCallCheck(this, MediaElementPlayer);

		var t = this,
		    element = typeof node === 'string' ? _document2.default.getElementById(node) : node;

		if (!(t instanceof MediaElementPlayer)) {
			return new MediaElementPlayer(element, o);
		}

		t.node = t.media = element;

		if (!t.node) {
			return;
		}

		if (t.media.player) {
			return t.media.player;
		}

		t.hasFocus = false;

		t.controlsAreVisible = true;

		t.controlsEnabled = true;

		t.controlsTimer = null;

		t.currentMediaTime = 0;

		t.proxy = null;

		if (o === undefined) {
			var options = t.node.getAttribute('data-mejsoptions');
			o = options ? JSON.parse(options) : {};
		}

		t.options = Object.assign({}, config, o);

		if (t.options.loop && !t.media.getAttribute('loop')) {
			t.media.loop = true;
			t.node.loop = true;
		} else if (t.media.loop) {
			t.options.loop = true;
		}

		if (!t.options.timeFormat) {
			t.options.timeFormat = 'mm:ss';
			if (t.options.alwaysShowHours) {
				t.options.timeFormat = 'hh:mm:ss';
			}
			if (t.options.showTimecodeFrameCount) {
				t.options.timeFormat += ':ff';
			}
		}

		(0, _time.calculateTimeFormat)(0, t.options, t.options.framesPerSecond || 25);

		t.id = 'mep_' + _mejs2.default.mepIndex++;

		_mejs2.default.players[t.id] = t;

		t.init();

		return t;
	}

	_createClass(MediaElementPlayer, [{
		key: 'getElement',
		value: function getElement(element) {
			return element;
		}
	}, {
		key: 'init',
		value: function init() {
			var t = this,
			    playerOptions = Object.assign({}, t.options, {
				success: function success(media, domNode) {
					t._meReady(media, domNode);
				},
				error: function error(e) {
					t._handleError(e);
				}
			}),
			    tagName = t.node.tagName.toLowerCase();

			t.isDynamic = tagName !== 'audio' && tagName !== 'video' && tagName !== 'iframe';
			t.isVideo = t.isDynamic ? t.options.isVideo : tagName !== 'audio' && t.options.isVideo;
			t.mediaFiles = null;
			t.trackFiles = null;

			if (_constants.IS_IPAD && t.options.iPadUseNativeControls || _constants.IS_IPHONE && t.options.iPhoneUseNativeControls) {
				t.node.setAttribute('controls', true);

				if (_constants.IS_IPAD && t.node.getAttribute('autoplay')) {
					t.play();
				}
			} else if ((t.isVideo || !t.isVideo && (t.options.features.length || t.options.useDefaultControls)) && !(_constants.IS_ANDROID && t.options.AndroidUseNativeControls)) {
				t.node.removeAttribute('controls');
				var videoPlayerTitle = t.isVideo ? _i18n2.default.t('mejs.video-player') : _i18n2.default.t('mejs.audio-player');

				var offscreen = _document2.default.createElement('span');
				offscreen.className = t.options.classPrefix + 'offscreen';
				offscreen.innerText = videoPlayerTitle;
				t.media.parentNode.insertBefore(offscreen, t.media);

				t.container = _document2.default.createElement('div');
				t.getElement(t.container).id = t.id;
				t.getElement(t.container).className = t.options.classPrefix + 'container ' + t.options.classPrefix + 'container-keyboard-inactive ' + t.media.className;
				t.getElement(t.container).tabIndex = 0;
				t.getElement(t.container).setAttribute('role', 'application');
				t.getElement(t.container).setAttribute('aria-label', videoPlayerTitle);
				t.getElement(t.container).innerHTML = '<div class="' + t.options.classPrefix + 'inner">' + ('<div class="' + t.options.classPrefix + 'mediaelement"></div>') + ('<div class="' + t.options.classPrefix + 'layers"></div>') + ('<div class="' + t.options.classPrefix + 'controls"></div>') + '</div>';
				t.getElement(t.container).addEventListener('focus', function (e) {
					if (!t.controlsAreVisible && !t.hasFocus && t.controlsEnabled) {
						t.showControls(true);

						var btnSelector = (0, _general.isNodeAfter)(e.relatedTarget, t.getElement(t.container)) ? '.' + t.options.classPrefix + 'controls .' + t.options.classPrefix + 'button:last-child > button' : '.' + t.options.classPrefix + 'playpause-button > button',
						    button = t.getElement(t.container).querySelector(btnSelector);

						button.focus();
					}
				});
				t.node.parentNode.insertBefore(t.getElement(t.container), t.node);

				if (!t.options.features.length && !t.options.useDefaultControls) {
					t.getElement(t.container).style.background = 'transparent';
					t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'controls').style.display = 'none';
				}

				if (t.isVideo && t.options.stretching === 'fill' && !dom.hasClass(t.getElement(t.container).parentNode, t.options.classPrefix + 'fill-container')) {
					t.outerContainer = t.media.parentNode;

					var wrapper = _document2.default.createElement('div');
					wrapper.className = t.options.classPrefix + 'fill-container';
					t.getElement(t.container).parentNode.insertBefore(wrapper, t.getElement(t.container));
					wrapper.appendChild(t.getElement(t.container));
				}

				if (_constants.IS_ANDROID) {
					dom.addClass(t.getElement(t.container), t.options.classPrefix + 'android');
				}
				if (_constants.IS_IOS) {
					dom.addClass(t.getElement(t.container), t.options.classPrefix + 'ios');
				}
				if (_constants.IS_IPAD) {
					dom.addClass(t.getElement(t.container), t.options.classPrefix + 'ipad');
				}
				if (_constants.IS_IPHONE) {
					dom.addClass(t.getElement(t.container), t.options.classPrefix + 'iphone');
				}
				dom.addClass(t.getElement(t.container), t.isVideo ? t.options.classPrefix + 'video' : t.options.classPrefix + 'audio');

				if (_constants.IS_SAFARI && !_constants.IS_IOS) {

					dom.addClass(t.getElement(t.container), t.options.classPrefix + 'hide-cues');

					var cloneNode = t.node.cloneNode(),
					    children = t.node.children,
					    mediaFiles = [],
					    tracks = [];

					for (var i = 0, total = children.length; i < total; i++) {
						var childNode = children[i];

						(function () {
							switch (childNode.tagName.toLowerCase()) {
								case 'source':
									var elements = {};
									Array.prototype.slice.call(childNode.attributes).forEach(function (item) {
										elements[item.name] = item.value;
									});
									elements.type = (0, _media.formatType)(elements.src, elements.type);
									mediaFiles.push(elements);
									break;
								case 'track':
									childNode.mode = 'hidden';
									tracks.push(childNode);
									break;
								default:
									cloneNode.appendChild(childNode);
									break;
							}
						})();
					}

					t.node.remove();
					t.node = t.media = cloneNode;

					if (mediaFiles.length) {
						t.mediaFiles = mediaFiles;
					}
					if (tracks.length) {
						t.trackFiles = tracks;
					}
				}

				t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'mediaelement').appendChild(t.node);

				t.media.player = t;

				t.controls = t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'controls');
				t.layers = t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'layers');

				var tagType = t.isVideo ? 'video' : 'audio',
				    capsTagName = tagType.substring(0, 1).toUpperCase() + tagType.substring(1);

				if (t.options[tagType + 'Width'] > 0 || t.options[tagType + 'Width'].toString().indexOf('%') > -1) {
					t.width = t.options[tagType + 'Width'];
				} else if (t.node.style.width !== '' && t.node.style.width !== null) {
					t.width = t.node.style.width;
				} else if (t.node.getAttribute('width')) {
					t.width = t.node.getAttribute('width');
				} else {
					t.width = t.options['default' + capsTagName + 'Width'];
				}

				if (t.options[tagType + 'Height'] > 0 || t.options[tagType + 'Height'].toString().indexOf('%') > -1) {
					t.height = t.options[tagType + 'Height'];
				} else if (t.node.style.height !== '' && t.node.style.height !== null) {
					t.height = t.node.style.height;
				} else if (t.node.getAttribute('height')) {
					t.height = t.node.getAttribute('height');
				} else {
					t.height = t.options['default' + capsTagName + 'Height'];
				}

				t.initialAspectRatio = t.height >= t.width ? t.width / t.height : t.height / t.width;

				t.setPlayerSize(t.width, t.height);

				playerOptions.pluginWidth = t.width;
				playerOptions.pluginHeight = t.height;
			} else if (!t.isVideo && !t.options.features.length && !t.options.useDefaultControls) {
					t.node.style.display = 'none';
				}

			_mejs2.default.MepDefaults = playerOptions;

			new _mediaelement2.default(t.media, playerOptions, t.mediaFiles);

			if (t.getElement(t.container) !== undefined && t.options.features.length && t.controlsAreVisible && !t.options.hideVideoControlsOnLoad) {
				var event = (0, _general.createEvent)('controlsshown', t.getElement(t.container));
				t.getElement(t.container).dispatchEvent(event);
			}
		}
	}, {
		key: 'showControls',
		value: function showControls(doAnimation) {
			var t = this;

			doAnimation = doAnimation === undefined || doAnimation;

			if (t.controlsAreVisible || !t.isVideo) {
				return;
			}

			if (doAnimation) {
				(function () {
					dom.fadeIn(t.getElement(t.controls), 200, function () {
						dom.removeClass(t.getElement(t.controls), t.options.classPrefix + 'offscreen');
						var event = (0, _general.createEvent)('controlsshown', t.getElement(t.container));
						t.getElement(t.container).dispatchEvent(event);
					});

					var controls = t.getElement(t.container).querySelectorAll('.' + t.options.classPrefix + 'control');

					var _loop = function _loop(i, total) {
						dom.fadeIn(controls[i], 200, function () {
							dom.removeClass(controls[i], t.options.classPrefix + 'offscreen');
						});
					};

					for (var i = 0, total = controls.length; i < total; i++) {
						_loop(i, total);
					}
				})();
			} else {
				dom.removeClass(t.getElement(t.controls), t.options.classPrefix + 'offscreen');
				t.getElement(t.controls).style.display = '';
				t.getElement(t.controls).style.opacity = 1;

				var controls = t.getElement(t.container).querySelectorAll('.' + t.options.classPrefix + 'control');
				for (var i = 0, total = controls.length; i < total; i++) {
					dom.removeClass(controls[i], t.options.classPrefix + 'offscreen');
					controls[i].style.display = '';
				}

				var event = (0, _general.createEvent)('controlsshown', t.getElement(t.container));
				t.getElement(t.container).dispatchEvent(event);
			}

			t.controlsAreVisible = true;
			t.setControlsSize();
		}
	}, {
		key: 'hideControls',
		value: function hideControls(doAnimation, forceHide) {
			var t = this;

			doAnimation = doAnimation === undefined || doAnimation;

			if (forceHide !== true && (!t.controlsAreVisible || t.options.alwaysShowControls || t.paused && t.readyState === 4 && (!t.options.hideVideoControlsOnLoad && t.currentTime <= 0 || !t.options.hideVideoControlsOnPause && t.currentTime > 0) || t.isVideo && !t.options.hideVideoControlsOnLoad && !t.readyState || t.ended)) {
				return;
			}

			if (doAnimation) {
				(function () {
					dom.fadeOut(t.getElement(t.controls), 200, function () {
						dom.addClass(t.getElement(t.controls), t.options.classPrefix + 'offscreen');
						t.getElement(t.controls).style.display = '';
						var event = (0, _general.createEvent)('controlshidden', t.getElement(t.container));
						t.getElement(t.container).dispatchEvent(event);
					});

					var controls = t.getElement(t.container).querySelectorAll('.' + t.options.classPrefix + 'control');

					var _loop2 = function _loop2(i, total) {
						dom.fadeOut(controls[i], 200, function () {
							dom.addClass(controls[i], t.options.classPrefix + 'offscreen');
							controls[i].style.display = '';
						});
					};

					for (var i = 0, total = controls.length; i < total; i++) {
						_loop2(i, total);
					}
				})();
			} else {
				dom.addClass(t.getElement(t.controls), t.options.classPrefix + 'offscreen');
				t.getElement(t.controls).style.display = '';
				t.getElement(t.controls).style.opacity = 0;

				var controls = t.getElement(t.container).querySelectorAll('.' + t.options.classPrefix + 'control');
				for (var i = 0, total = controls.length; i < total; i++) {
					dom.addClass(controls[i], t.options.classPrefix + 'offscreen');
					controls[i].style.display = '';
				}

				var event = (0, _general.createEvent)('controlshidden', t.getElement(t.container));
				t.getElement(t.container).dispatchEvent(event);
			}

			t.controlsAreVisible = false;
		}
	}, {
		key: 'startControlsTimer',
		value: function startControlsTimer(timeout) {
			var t = this;

			timeout = typeof timeout !== 'undefined' ? timeout : t.options.controlsTimeoutDefault;

			t.killControlsTimer('start');

			t.controlsTimer = setTimeout(function () {
				t.hideControls();
				t.killControlsTimer('hide');
			}, timeout);
		}
	}, {
		key: 'killControlsTimer',
		value: function killControlsTimer() {
			var t = this;

			if (t.controlsTimer !== null) {
				clearTimeout(t.controlsTimer);
				delete t.controlsTimer;
				t.controlsTimer = null;
			}
		}
	}, {
		key: 'disableControls',
		value: function disableControls() {
			var t = this;

			t.killControlsTimer();
			t.controlsEnabled = false;
			t.hideControls(false, true);
		}
	}, {
		key: 'enableControls',
		value: function enableControls() {
			var t = this;

			t.controlsEnabled = true;
			t.showControls(false);
		}
	}, {
		key: '_setDefaultPlayer',
		value: function _setDefaultPlayer() {
			var t = this;
			if (t.proxy) {
				t.proxy.pause();
			}
			t.proxy = new _default2.default(t);
			t.media.addEventListener('loadedmetadata', function () {
				if (t.getCurrentTime() > 0 && t.currentMediaTime > 0) {
					t.setCurrentTime(t.currentMediaTime);
					if (!_constants.IS_IOS && !_constants.IS_ANDROID) {
						t.play();
					}
				}
			});
		}
	}, {
		key: '_meReady',
		value: function _meReady(media, domNode) {
			var t = this,
			    autoplayAttr = domNode.getAttribute('autoplay'),
			    autoplay = !(autoplayAttr === undefined || autoplayAttr === null || autoplayAttr === 'false'),
			    isNative = media.rendererName !== null && /(native|html5)/i.test(t.media.rendererName);

			if (t.getElement(t.controls)) {
				t.enableControls();
			}

			if (t.getElement(t.container) && t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'overlay-play')) {
				t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'overlay-play').style.display = '';
			}

			if (t.created) {
				return;
			}

			t.created = true;
			t.media = media;
			t.domNode = domNode;

			if (!(_constants.IS_ANDROID && t.options.AndroidUseNativeControls) && !(_constants.IS_IPAD && t.options.iPadUseNativeControls) && !(_constants.IS_IPHONE && t.options.iPhoneUseNativeControls)) {
				if (!t.isVideo && !t.options.features.length && !t.options.useDefaultControls) {
					if (autoplay && isNative) {
						t.play();
					}

					if (t.options.success) {

						if (typeof t.options.success === 'string') {
							_window2.default[t.options.success](t.media, t.domNode, t);
						} else {
							t.options.success(t.media, t.domNode, t);
						}
					}

					return;
				}

				t.featurePosition = {};

				t._setDefaultPlayer();

				t.buildposter(t, t.getElement(t.controls), t.getElement(t.layers), t.media);
				t.buildkeyboard(t, t.getElement(t.controls), t.getElement(t.layers), t.media);
				t.buildoverlays(t, t.getElement(t.controls), t.getElement(t.layers), t.media);

				if (t.options.useDefaultControls) {
					var defaultControls = ['playpause', 'current', 'progress', 'duration', 'tracks', 'volume', 'fullscreen'];
					t.options.features = defaultControls.concat(t.options.features.filter(function (item) {
						return defaultControls.indexOf(item) === -1;
					}));
				}

				t.buildfeatures(t, t.getElement(t.controls), t.getElement(t.layers), t.media);

				var event = (0, _general.createEvent)('controlsready', t.getElement(t.container));
				t.getElement(t.container).dispatchEvent(event);

				t.setPlayerSize(t.width, t.height);
				t.setControlsSize();

				if (t.isVideo) {
					t.clickToPlayPauseCallback = function () {

						if (t.options.clickToPlayPause) {
							var button = t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'overlay-button'),
							    pressed = button.getAttribute('aria-pressed');

							if (t.paused && pressed) {
								t.pause();
							} else if (t.paused) {
								t.play();
							} else {
								t.pause();
							}

							button.setAttribute('aria-pressed', !pressed);
							t.getElement(t.container).focus();
						}
					};

					t.createIframeLayer();

					t.media.addEventListener('click', t.clickToPlayPauseCallback);

					if ((_constants.IS_ANDROID || _constants.IS_IOS) && !t.options.alwaysShowControls) {
						t.node.addEventListener('touchstart', function () {
							if (t.controlsAreVisible) {
								t.hideControls(false);
							} else {
								if (t.controlsEnabled) {
									t.showControls(false);
								}
							}
						}, _constants.SUPPORT_PASSIVE_EVENT ? { passive: true } : false);
					} else {
						t.getElement(t.container).addEventListener('mouseenter', function () {
							if (t.controlsEnabled) {
								if (!t.options.alwaysShowControls) {
									t.killControlsTimer('enter');
									t.showControls();
									t.startControlsTimer(t.options.controlsTimeoutMouseEnter);
								}
							}
						});
						t.getElement(t.container).addEventListener('mousemove', function () {
							if (t.controlsEnabled) {
								if (!t.controlsAreVisible) {
									t.showControls();
								}
								if (!t.options.alwaysShowControls) {
									t.startControlsTimer(t.options.controlsTimeoutMouseEnter);
								}
							}
						});
						t.getElement(t.container).addEventListener('mouseleave', function () {
							if (t.controlsEnabled) {
								if (!t.paused && !t.options.alwaysShowControls) {
									t.startControlsTimer(t.options.controlsTimeoutMouseLeave);
								}
							}
						});
					}

					if (t.options.hideVideoControlsOnLoad) {
						t.hideControls(false);
					}

					if (t.options.enableAutosize) {
						t.media.addEventListener('loadedmetadata', function (e) {
							var target = e !== undefined ? e.detail.target || e.target : t.media;
							if (t.options.videoHeight <= 0 && !t.domNode.getAttribute('height') && !t.domNode.style.height && target !== null && !isNaN(target.videoHeight)) {
								t.setPlayerSize(target.videoWidth, target.videoHeight);
								t.setControlsSize();
								t.media.setSize(target.videoWidth, target.videoHeight);
							}
						});
					}
				}

				t.media.addEventListener('play', function () {
					t.hasFocus = true;

					for (var playerIndex in _mejs2.default.players) {
						if (_mejs2.default.players.hasOwnProperty(playerIndex)) {
							var p = _mejs2.default.players[playerIndex];

							if (p.id !== t.id && t.options.pauseOtherPlayers && !p.paused && !p.ended) {
								p.pause();
								p.hasFocus = false;
							}
						}
					}

					if (!(_constants.IS_ANDROID || _constants.IS_IOS) && !t.options.alwaysShowControls && t.isVideo) {
						t.hideControls();
					}
				});

				t.media.addEventListener('ended', function () {
					if (t.options.autoRewind) {
						try {
							t.setCurrentTime(0);

							setTimeout(function () {
								var loadingElement = t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'overlay-loading');
								if (loadingElement && loadingElement.parentNode) {
									loadingElement.parentNode.style.display = 'none';
								}
							}, 20);
						} catch (exp) {
							
						}
					}

					if (typeof t.media.renderer.stop === 'function') {
						t.media.renderer.stop();
					} else {
						t.pause();
					}

					if (t.setProgressRail) {
						t.setProgressRail();
					}
					if (t.setCurrentRail) {
						t.setCurrentRail();
					}

					if (t.options.loop) {
						t.play();
					} else if (!t.options.alwaysShowControls && t.controlsEnabled) {
						t.showControls();
					}
				});

				t.media.addEventListener('loadedmetadata', function () {

					(0, _time.calculateTimeFormat)(t.getDuration(), t.options, t.options.framesPerSecond || 25);

					if (t.updateDuration) {
						t.updateDuration();
					}
					if (t.updateCurrent) {
						t.updateCurrent();
					}

					if (!t.isFullScreen) {
						t.setPlayerSize(t.width, t.height);
						t.setControlsSize();
					}
				});

				var duration = null;
				t.media.addEventListener('timeupdate', function () {
					if (!isNaN(t.getDuration()) && duration !== t.getDuration()) {
						duration = t.getDuration();
						(0, _time.calculateTimeFormat)(duration, t.options, t.options.framesPerSecond || 25);

						if (t.updateDuration) {
							t.updateDuration();
						}
						if (t.updateCurrent) {
							t.updateCurrent();
						}

						t.setControlsSize();
					}
				});

				t.getElement(t.container).addEventListener('click', function (e) {
					dom.addClass(e.currentTarget, t.options.classPrefix + 'container-keyboard-inactive');
				});

				t.getElement(t.container).addEventListener('focusin', function (e) {
					dom.removeClass(e.currentTarget, t.options.classPrefix + 'container-keyboard-inactive');
					if (t.isVideo && !_constants.IS_ANDROID && !_constants.IS_IOS && t.controlsEnabled && !t.options.alwaysShowControls) {
						t.killControlsTimer('enter');
						t.showControls();
						t.startControlsTimer(t.options.controlsTimeoutMouseEnter);
					}
				});

				t.getElement(t.container).addEventListener('focusout', function (e) {
					setTimeout(function () {
						if (e.relatedTarget) {
							if (t.keyboardAction && !e.relatedTarget.closest('.' + t.options.classPrefix + 'container')) {
								t.keyboardAction = false;
								if (t.isVideo && !t.options.alwaysShowControls && !t.paused) {
									t.startControlsTimer(t.options.controlsTimeoutMouseLeave);
								}
							}
						}
					}, 0);
				});

				setTimeout(function () {
					t.setPlayerSize(t.width, t.height);
					t.setControlsSize();
				}, 0);

				t.globalResizeCallback = function () {
					if (!(t.isFullScreen || _constants.HAS_TRUE_NATIVE_FULLSCREEN && _document2.default.webkitIsFullScreen)) {
						t.setPlayerSize(t.width, t.height);
					}

					t.setControlsSize();
				};

				t.globalBind('resize', t.globalResizeCallback);
			}

			if (autoplay && isNative) {
				t.play();
			}

			if (t.options.success) {
				if (typeof t.options.success === 'string') {
					_window2.default[t.options.success](t.media, t.domNode, t);
				} else {
					t.options.success(t.media, t.domNode, t);
				}
			}
		}
	}, {
		key: '_handleError',
		value: function _handleError(e, media, node) {
			var t = this,
			    play = t.getElement(t.layers).querySelector('.' + t.options.classPrefix + 'overlay-play');

			if (play) {
				play.style.display = 'none';
			}

			if (t.options.error) {
				t.options.error(e, media, node);
			}

			if (t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'cannotplay')) {
				t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'cannotplay').remove();
			}

			var errorContainer = _document2.default.createElement('div');
			errorContainer.className = t.options.classPrefix + 'cannotplay';
			errorContainer.style.width = '100%';
			errorContainer.style.height = '100%';

			var errorContent = typeof t.options.customError === 'function' ? t.options.customError(t.media, t.media.originalNode) : t.options.customError,
			    imgError = '';

			if (!errorContent) {
				var poster = t.media.originalNode.getAttribute('poster');
				if (poster) {
					imgError = '<img src="' + poster + '" alt="' + _mejs2.default.i18n.t('mejs.download-file') + '">';
				}

				if (e.message) {
					errorContent = '<p>' + e.message + '</p>';
				}

				if (e.urls) {
					for (var i = 0, total = e.urls.length; i < total; i++) {
						var url = e.urls[i];
						errorContent += '<a href="' + url.src + '" data-type="' + url.type + '"><span>' + _mejs2.default.i18n.t('mejs.download-file') + ': ' + url.src + '</span></a>';
					}
				}
			}

			if (errorContent && t.getElement(t.layers).querySelector('.' + t.options.classPrefix + 'overlay-error')) {
				errorContainer.innerHTML = errorContent;
				t.getElement(t.layers).querySelector('.' + t.options.classPrefix + 'overlay-error').innerHTML = '' + imgError + errorContainer.outerHTML;
				t.getElement(t.layers).querySelector('.' + t.options.classPrefix + 'overlay-error').parentNode.style.display = 'block';
			}

			if (t.controlsEnabled) {
				t.disableControls();
			}
		}
	}, {
		key: 'setPlayerSize',
		value: function setPlayerSize(width, height) {
			var t = this;

			if (!t.options.setDimensions) {
				return false;
			}

			if (typeof width !== 'undefined') {
				t.width = width;
			}

			if (typeof height !== 'undefined') {
				t.height = height;
			}

			switch (t.options.stretching) {
				case 'fill':
					if (t.isVideo) {
						t.setFillMode();
					} else {
						t.setDimensions(t.width, t.height);
					}
					break;
				case 'responsive':
					t.setResponsiveMode();
					break;
				case 'none':
					t.setDimensions(t.width, t.height);
					break;

				default:
					if (t.hasFluidMode() === true) {
						t.setResponsiveMode();
					} else {
						t.setDimensions(t.width, t.height);
					}
					break;
			}
		}
	}, {
		key: 'hasFluidMode',
		value: function hasFluidMode() {
			var t = this;

			return t.height.toString().indexOf('%') !== -1 || t.node && t.node.style.maxWidth && t.node.style.maxWidth !== 'none' && t.node.style.maxWidth !== t.width || t.node && t.node.currentStyle && t.node.currentStyle.maxWidth === '100%';
		}
	}, {
		key: 'setResponsiveMode',
		value: function setResponsiveMode() {
			var t = this,
			    parent = function () {

				var parentEl = void 0,
				    el = t.getElement(t.container);

				while (el) {
					try {
						if (_constants.IS_FIREFOX && el.tagName.toLowerCase() === 'html' && _window2.default.self !== _window2.default.top && _window2.default.frameElement !== null) {
							return _window2.default.frameElement;
						} else {
							parentEl = el.parentElement;
						}
					} catch (e) {
						parentEl = el.parentElement;
					}

					if (parentEl && dom.visible(parentEl)) {
						return parentEl;
					}
					el = parentEl;
				}

				return null;
			}(),
			    parentStyles = parent ? getComputedStyle(parent, null) : getComputedStyle(_document2.default.body, null),
			    nativeWidth = function () {
				if (t.isVideo) {
					if (t.media.videoWidth && t.media.videoWidth > 0) {
						return t.media.videoWidth;
					} else if (t.node.getAttribute('width')) {
						return t.node.getAttribute('width');
					} else {
						return t.options.defaultVideoWidth;
					}
				} else {
					return t.options.defaultAudioWidth;
				}
			}(),
			    nativeHeight = function () {
				if (t.isVideo) {
					if (t.media.videoHeight && t.media.videoHeight > 0) {
						return t.media.videoHeight;
					} else if (t.node.getAttribute('height')) {
						return t.node.getAttribute('height');
					} else {
						return t.options.defaultVideoHeight;
					}
				} else {
					return t.options.defaultAudioHeight;
				}
			}(),
			    aspectRatio = function () {
				var ratio = 1;
				if (!t.isVideo) {
					return ratio;
				}

				if (t.media.videoWidth && t.media.videoWidth > 0 && t.media.videoHeight && t.media.videoHeight > 0) {
					ratio = t.height >= t.width ? t.media.videoWidth / t.media.videoHeight : t.media.videoHeight / t.media.videoWidth;
				} else {
					ratio = t.initialAspectRatio;
				}

				if (isNaN(ratio) || ratio < 0.01 || ratio > 100) {
					ratio = 1;
				}

				return ratio;
			}(),
			    parentHeight = parseFloat(parentStyles.height);

			var newHeight = void 0,
			    parentWidth = parseFloat(parentStyles.width);

			if (t.isVideo) {
				if (t.height === '100%') {
					newHeight = parseFloat(parentWidth * nativeHeight / nativeWidth, 10);
				} else {
					newHeight = t.height >= t.width ? parseFloat(parentWidth / aspectRatio, 10) : parseFloat(parentWidth * aspectRatio, 10);
				}
			} else {
				newHeight = nativeHeight;
			}

			if (isNaN(newHeight)) {
				newHeight = parentHeight;
			}

			if (t.getElement(t.container).parentNode.length > 0 && t.getElement(t.container).parentNode.tagName.toLowerCase() === 'body') {
				parentWidth = _window2.default.innerWidth || _document2.default.documentElement.clientWidth || _document2.default.body.clientWidth;
				newHeight = _window2.default.innerHeight || _document2.default.documentElement.clientHeight || _document2.default.body.clientHeight;
			}

			if (newHeight && parentWidth) {
				t.getElement(t.container).style.width = parentWidth + 'px';
				t.getElement(t.container).style.height = newHeight + 'px';

				t.node.style.width = '100%';
				t.node.style.height = '100%';

				if (t.isVideo && t.media.setSize) {
					t.media.setSize(parentWidth, newHeight);
				}

				var layerChildren = t.getElement(t.layers).children;
				for (var i = 0, total = layerChildren.length; i < total; i++) {
					layerChildren[i].style.width = '100%';
					layerChildren[i].style.height = '100%';
				}
			}
		}
	}, {
		key: 'setFillMode',
		value: function setFillMode() {
			var t = this;
			var isIframe = _window2.default.self !== _window2.default.top && _window2.default.frameElement !== null;
			var parent = function () {
				var parentEl = void 0,
				    el = t.getElement(t.container);

				while (el) {
					try {
						if (_constants.IS_FIREFOX && el.tagName.toLowerCase() === 'html' && _window2.default.self !== _window2.default.top && _window2.default.frameElement !== null) {
							return _window2.default.frameElement;
						} else {
							parentEl = el.parentElement;
						}
					} catch (e) {
						parentEl = el.parentElement;
					}

					if (parentEl && dom.visible(parentEl)) {
						return parentEl;
					}
					el = parentEl;
				}

				return null;
			}();
			var parentStyles = parent ? getComputedStyle(parent, null) : getComputedStyle(_document2.default.body, null);

			if (t.node.style.height !== 'none' && t.node.style.height !== t.height) {
				t.node.style.height = 'auto';
			}
			if (t.node.style.maxWidth !== 'none' && t.node.style.maxWidth !== t.width) {
				t.node.style.maxWidth = 'none';
			}

			if (t.node.style.maxHeight !== 'none' && t.node.style.maxHeight !== t.height) {
				t.node.style.maxHeight = 'none';
			}

			if (t.node.currentStyle) {
				if (t.node.currentStyle.height === '100%') {
					t.node.currentStyle.height = 'auto';
				}
				if (t.node.currentStyle.maxWidth === '100%') {
					t.node.currentStyle.maxWidth = 'none';
				}
				if (t.node.currentStyle.maxHeight === '100%') {
					t.node.currentStyle.maxHeight = 'none';
				}
			}

			if (!isIframe && !parseFloat(parentStyles.width)) {
				parent.style.width = t.media.offsetWidth + 'px';
			}

			if (!isIframe && !parseFloat(parentStyles.height)) {
				parent.style.height = t.media.offsetHeight + 'px';
			}

			parentStyles = getComputedStyle(parent);

			var parentWidth = parseFloat(parentStyles.width),
			    parentHeight = parseFloat(parentStyles.height);

			t.setDimensions('100%', '100%');

			var poster = t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'poster>img');
			if (poster) {
				poster.style.display = '';
			}

			var targetElement = t.getElement(t.container).querySelectorAll('object, embed, iframe, video'),
			    initHeight = t.height,
			    initWidth = t.width,
			    scaleX1 = parentWidth,
			    scaleY1 = initHeight * parentWidth / initWidth,
			    scaleX2 = initWidth * parentHeight / initHeight,
			    scaleY2 = parentHeight,
			    bScaleOnWidth = scaleX2 > parentWidth === false,
			    finalWidth = bScaleOnWidth ? Math.floor(scaleX1) : Math.floor(scaleX2),
			    finalHeight = bScaleOnWidth ? Math.floor(scaleY1) : Math.floor(scaleY2),
			    width = bScaleOnWidth ? parentWidth + 'px' : finalWidth + 'px',
			    height = bScaleOnWidth ? finalHeight + 'px' : parentHeight + 'px';

			for (var i = 0, total = targetElement.length; i < total; i++) {
				targetElement[i].style.height = height;
				targetElement[i].style.width = width;
				if (t.media.setSize) {
					t.media.setSize(width, height);
				}

				targetElement[i].style.marginLeft = Math.floor((parentWidth - finalWidth) / 2) + 'px';
				targetElement[i].style.marginTop = 0;
			}
		}
	}, {
		key: 'setDimensions',
		value: function setDimensions(width, height) {
			var t = this;

			width = (0, _general.isString)(width) && width.indexOf('%') > -1 ? width : parseFloat(width) + 'px';
			height = (0, _general.isString)(height) && height.indexOf('%') > -1 ? height : parseFloat(height) + 'px';

			t.getElement(t.container).style.width = width;
			t.getElement(t.container).style.height = height;

			var layers = t.getElement(t.layers).children;
			for (var i = 0, total = layers.length; i < total; i++) {
				layers[i].style.width = width;
				layers[i].style.height = height;
			}
		}
	}, {
		key: 'setControlsSize',
		value: function setControlsSize() {
			var t = this;

			if (!dom.visible(t.getElement(t.container))) {
				return;
			}

			if (t.rail && dom.visible(t.rail)) {
				var totalStyles = t.total ? getComputedStyle(t.total, null) : null,
				    totalMargin = totalStyles ? parseFloat(totalStyles.marginLeft) + parseFloat(totalStyles.marginRight) : 0,
				    railStyles = getComputedStyle(t.rail),
				    railMargin = parseFloat(railStyles.marginLeft) + parseFloat(railStyles.marginRight);

				var siblingsWidth = 0;

				var siblings = dom.siblings(t.rail, function (el) {
					return el !== t.rail;
				}),
				    total = siblings.length;
				for (var i = 0; i < total; i++) {
					siblingsWidth += siblings[i].offsetWidth;
				}

				siblingsWidth += totalMargin + (totalMargin === 0 ? railMargin * 2 : railMargin) + 1;

				t.getElement(t.container).style.minWidth = siblingsWidth + 'px';

				var event = (0, _general.createEvent)('controlsresize', t.getElement(t.container));
				t.getElement(t.container).dispatchEvent(event);
			} else {
				var children = t.getElement(t.controls).children;
				var minWidth = 0;

				for (var _i = 0, _total = children.length; _i < _total; _i++) {
					minWidth += children[_i].offsetWidth;
				}

				t.getElement(t.container).style.minWidth = minWidth + 'px';
			}
		}
	}, {
		key: 'addControlElement',
		value: function addControlElement(element, key) {

			var t = this;

			if (t.featurePosition[key] !== undefined) {
				var child = t.getElement(t.controls).children[t.featurePosition[key] - 1];
				child.parentNode.insertBefore(element, child.nextSibling);
			} else {
				t.getElement(t.controls).appendChild(element);
				var children = t.getElement(t.controls).children;
				for (var i = 0, total = children.length; i < total; i++) {
					if (element === children[i]) {
						t.featurePosition[key] = i;
						break;
					}
				}
			}
		}
	}, {
		key: 'createIframeLayer',
		value: function createIframeLayer() {
			var t = this;

			if (t.isVideo && t.media.rendererName !== null && t.media.rendererName.indexOf('iframe') > -1 && !_document2.default.getElementById(t.media.id + '-iframe-overlay')) {

				var layer = _document2.default.createElement('div'),
				    target = _document2.default.getElementById(t.media.id + '_' + t.media.rendererName);

				layer.id = t.media.id + '-iframe-overlay';
				layer.className = t.options.classPrefix + 'iframe-overlay';
				layer.addEventListener('click', function (e) {
					if (t.options.clickToPlayPause) {
						if (t.paused) {
							t.play();
						} else {
							t.pause();
						}

						e.preventDefault();
						e.stopPropagation();
					}
				});

				target.parentNode.insertBefore(layer, target);
			}
		}
	}, {
		key: 'resetSize',
		value: function resetSize() {
			var t = this;

			setTimeout(function () {
				t.setPlayerSize(t.width, t.height);
				t.setControlsSize();
			}, 50);
		}
	}, {
		key: 'setPoster',
		value: function setPoster(url) {
			var t = this;

			if (t.getElement(t.container)) {
				var posterDiv = t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'poster');

				if (!posterDiv) {
					posterDiv = _document2.default.createElement('div');
					posterDiv.className = t.options.classPrefix + 'poster ' + t.options.classPrefix + 'layer';
					t.getElement(t.layers).appendChild(posterDiv);
				}

				var posterImg = posterDiv.querySelector('img');

				if (!posterImg && url) {
					posterImg = _document2.default.createElement('img');
					posterImg.className = t.options.classPrefix + 'poster-img';
					posterImg.width = '100%';
					posterImg.height = '100%';
					posterDiv.style.display = '';
					posterDiv.appendChild(posterImg);
				}

				if (url) {
					posterImg.setAttribute('src', url);
					posterDiv.style.backgroundImage = 'url("' + url + '")';
					posterDiv.style.display = '';
				} else if (posterImg) {
					posterDiv.style.backgroundImage = 'none';
					posterDiv.style.display = 'none';
					posterImg.remove();
				} else {
					posterDiv.style.display = 'none';
				}
			} else if (_constants.IS_IPAD && t.options.iPadUseNativeControls || _constants.IS_IPHONE && t.options.iPhoneUseNativeControls || _constants.IS_ANDROID && t.options.AndroidUseNativeControls) {
				t.media.originalNode.poster = url;
			}
		}
	}, {
		key: 'changeSkin',
		value: function changeSkin(className) {
			var t = this;

			t.getElement(t.container).className = t.options.classPrefix + 'container ' + className;
			t.setPlayerSize(t.width, t.height);
			t.setControlsSize();
		}
	}, {
		key: 'globalBind',
		value: function globalBind(events, callback) {
			var t = this,
			    doc = t.node ? t.node.ownerDocument : _document2.default;

			events = (0, _general.splitEvents)(events, t.id);
			if (events.d) {
				var eventList = events.d.split(' ');
				for (var i = 0, total = eventList.length; i < total; i++) {
					eventList[i].split('.').reduce(function (part, e) {
						doc.addEventListener(e, callback, false);
						return e;
					}, '');
				}
			}
			if (events.w) {
				var _eventList = events.w.split(' ');
				for (var _i2 = 0, _total2 = _eventList.length; _i2 < _total2; _i2++) {
					_eventList[_i2].split('.').reduce(function (part, e) {
						_window2.default.addEventListener(e, callback, false);
						return e;
					}, '');
				}
			}
		}
	}, {
		key: 'globalUnbind',
		value: function globalUnbind(events, callback) {
			var t = this,
			    doc = t.node ? t.node.ownerDocument : _document2.default;

			events = (0, _general.splitEvents)(events, t.id);
			if (events.d) {
				var eventList = events.d.split(' ');
				for (var i = 0, total = eventList.length; i < total; i++) {
					eventList[i].split('.').reduce(function (part, e) {
						doc.removeEventListener(e, callback, false);
						return e;
					}, '');
				}
			}
			if (events.w) {
				var _eventList2 = events.w.split(' ');
				for (var _i3 = 0, _total3 = _eventList2.length; _i3 < _total3; _i3++) {
					_eventList2[_i3].split('.').reduce(function (part, e) {
						_window2.default.removeEventListener(e, callback, false);
						return e;
					}, '');
				}
			}
		}
	}, {
		key: 'buildfeatures',
		value: function buildfeatures(player, controls, layers, media) {
			var t = this;

			for (var i = 0, total = t.options.features.length; i < total; i++) {
				var feature = t.options.features[i];
				if (t['build' + feature]) {
					try {
						t['build' + feature](player, controls, layers, media);
					} catch (e) {
						console.error('error building ' + feature, e);
					}
				}
			}
		}
	}, {
		key: 'buildposter',
		value: function buildposter(player, controls, layers, media) {
			var t = this,
			    poster = _document2.default.createElement('div');

			poster.className = t.options.classPrefix + 'poster ' + t.options.classPrefix + 'layer';
			layers.appendChild(poster);

			var posterUrl = media.originalNode.getAttribute('poster');

			if (player.options.poster !== '') {
				if (posterUrl && _constants.IS_IOS) {
					media.originalNode.removeAttribute('poster');
				}
				posterUrl = player.options.poster;
			}

			if (posterUrl) {
				t.setPoster(posterUrl);
			} else if (t.media.renderer !== null && typeof t.media.renderer.getPosterUrl === 'function') {
				t.setPoster(t.media.renderer.getPosterUrl());
			} else {
				poster.style.display = 'none';
			}

			media.addEventListener('play', function () {
				poster.style.display = 'none';
			});

			media.addEventListener('playing', function () {
				poster.style.display = 'none';
			});

			if (player.options.showPosterWhenEnded && player.options.autoRewind) {
				media.addEventListener('ended', function () {
					poster.style.display = '';
				});
			}

			media.addEventListener('error', function () {
				poster.style.display = 'none';
			});

			if (player.options.showPosterWhenPaused) {
				media.addEventListener('pause', function () {
					if (!player.ended) {
						poster.style.display = '';
					}
				});
			}
		}
	}, {
		key: 'buildoverlays',
		value: function buildoverlays(player, controls, layers, media) {

			if (!player.isVideo) {
				return;
			}

			var t = this,
			    loading = _document2.default.createElement('div'),
			    error = _document2.default.createElement('div'),
			    bigPlay = _document2.default.createElement('div');

			loading.style.display = 'none';
			loading.className = t.options.classPrefix + 'overlay ' + t.options.classPrefix + 'layer';
			loading.innerHTML = '<div class="' + t.options.classPrefix + 'overlay-loading">' + ('<span class="' + t.options.classPrefix + 'overlay-loading-bg-img"></span>') + '</div>';
			layers.appendChild(loading);

			error.style.display = 'none';
			error.className = t.options.classPrefix + 'overlay ' + t.options.classPrefix + 'layer';
			error.innerHTML = '<div class="' + t.options.classPrefix + 'overlay-error"></div>';
			layers.appendChild(error);

			bigPlay.className = t.options.classPrefix + 'overlay ' + t.options.classPrefix + 'layer ' + t.options.classPrefix + 'overlay-play';
			bigPlay.innerHTML = '<div class="' + t.options.classPrefix + 'overlay-button" role="button" tabindex="0" ' + ('aria-label="' + _i18n2.default.t('mejs.play') + '" aria-pressed="false"></div>');
			bigPlay.addEventListener('click', function () {
				if (t.options.clickToPlayPause) {

					var button = t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'overlay-button'),
					    pressed = button.getAttribute('aria-pressed');

					if (t.paused) {
						t.play();
					} else {
						t.pause();
					}

					button.setAttribute('aria-pressed', !!pressed);
					t.getElement(t.container).focus();
				}
			});

			bigPlay.addEventListener('keydown', function (e) {
				var keyPressed = e.keyCode || e.which || 0;

				if (keyPressed === 13 || _constants.IS_FIREFOX && keyPressed === 32) {
					var event = (0, _general.createEvent)('click', bigPlay);
					bigPlay.dispatchEvent(event);
					return false;
				}
			});

			layers.appendChild(bigPlay);

			if (t.media.rendererName !== null && (/(youtube|facebook)/i.test(t.media.rendererName) && !(t.media.originalNode.getAttribute('poster') || player.options.poster || typeof t.media.renderer.getPosterUrl === 'function' && t.media.renderer.getPosterUrl()) || _constants.IS_STOCK_ANDROID || t.media.originalNode.getAttribute('autoplay'))) {
				bigPlay.style.display = 'none';
			}

			var hasError = false;

			media.addEventListener('play', function () {
				bigPlay.style.display = 'none';
				loading.style.display = 'none';
				error.style.display = 'none';
				hasError = false;
			});
			media.addEventListener('playing', function () {
				bigPlay.style.display = 'none';
				loading.style.display = 'none';
				error.style.display = 'none';
				hasError = false;
			});
			media.addEventListener('seeking', function () {
				bigPlay.style.display = 'none';
				loading.style.display = '';
				hasError = false;
			});
			media.addEventListener('seeked', function () {
				bigPlay.style.display = t.paused && !_constants.IS_STOCK_ANDROID ? '' : 'none';
				loading.style.display = 'none';
				hasError = false;
			});
			media.addEventListener('pause', function () {
				loading.style.display = 'none';
				if (!_constants.IS_STOCK_ANDROID && !hasError) {
					bigPlay.style.display = '';
				}
				hasError = false;
			});
			media.addEventListener('waiting', function () {
				loading.style.display = '';
				hasError = false;
			});

			media.addEventListener('loadeddata', function () {
				loading.style.display = '';

				if (_constants.IS_ANDROID) {
					media.canplayTimeout = setTimeout(function () {
						if (_document2.default.createEvent) {
							var evt = _document2.default.createEvent('HTMLEvents');
							evt.initEvent('canplay', true, true);
							return media.dispatchEvent(evt);
						}
					}, 300);
				}
				hasError = false;
			});
			media.addEventListener('canplay', function () {
				loading.style.display = 'none';

				clearTimeout(media.canplayTimeout);
				hasError = false;
			});

			media.addEventListener('error', function (e) {
				t._handleError(e, t.media, t.node);
				loading.style.display = 'none';
				bigPlay.style.display = 'none';
				hasError = true;
			});

			media.addEventListener('loadedmetadata', function () {
				if (!t.controlsEnabled) {
					t.enableControls();
				}
			});

			media.addEventListener('keydown', function (e) {
				t.onkeydown(player, media, e);
				hasError = false;
			});
		}
	}, {
		key: 'buildkeyboard',
		value: function buildkeyboard(player, controls, layers, media) {

			var t = this;

			t.getElement(t.container).addEventListener('keydown', function () {
				t.keyboardAction = true;
			});

			t.globalKeydownCallback = function (event) {
				var container = _document2.default.activeElement.closest('.' + t.options.classPrefix + 'container'),
				    target = t.media.closest('.' + t.options.classPrefix + 'container');
				t.hasFocus = !!(container && target && container.id === target.id);
				return t.onkeydown(player, media, event);
			};

			t.globalClickCallback = function (event) {
				t.hasFocus = !!event.target.closest('.' + t.options.classPrefix + 'container');
			};

			t.globalBind('keydown', t.globalKeydownCallback);

			t.globalBind('click', t.globalClickCallback);
		}
	}, {
		key: 'onkeydown',
		value: function onkeydown(player, media, e) {

			if (player.hasFocus && player.options.enableKeyboard) {
				for (var i = 0, total = player.options.keyActions.length; i < total; i++) {
					var keyAction = player.options.keyActions[i];

					for (var j = 0, jl = keyAction.keys.length; j < jl; j++) {
						if (e.keyCode === keyAction.keys[j]) {
							keyAction.action(player, media, e.keyCode, e);
							e.preventDefault();
							e.stopPropagation();
							return;
						}
					}
				}
			}

			return true;
		}
	}, {
		key: 'play',
		value: function play() {
			this.proxy.play();
		}
	}, {
		key: 'pause',
		value: function pause() {
			this.proxy.pause();
		}
	}, {
		key: 'load',
		value: function load() {
			this.proxy.load();
		}
	}, {
		key: 'setCurrentTime',
		value: function setCurrentTime(time) {
			this.proxy.setCurrentTime(time);
		}
	}, {
		key: 'getCurrentTime',
		value: function getCurrentTime() {
			return this.proxy.currentTime;
		}
	}, {
		key: 'getDuration',
		value: function getDuration() {
			return this.proxy.duration;
		}
	}, {
		key: 'setVolume',
		value: function setVolume(volume) {
			this.proxy.volume = volume;
		}
	}, {
		key: 'getVolume',
		value: function getVolume() {
			return this.proxy.getVolume();
		}
	}, {
		key: 'setMuted',
		value: function setMuted(value) {
			this.proxy.setMuted(value);
		}
	}, {
		key: 'setSrc',
		value: function setSrc(src) {
			if (!this.controlsEnabled) {
				this.enableControls();
			}
			this.proxy.setSrc(src);
		}
	}, {
		key: 'getSrc',
		value: function getSrc() {
			return this.proxy.getSrc();
		}
	}, {
		key: 'canPlayType',
		value: function canPlayType(type) {
			return this.proxy.canPlayType(type);
		}
	}, {
		key: 'remove',
		value: function remove() {
			var t = this,
			    rendererName = t.media.rendererName,
			    src = t.media.originalNode.src;

			for (var featureIndex in t.options.features) {
				var feature = t.options.features[featureIndex];
				if (t['clean' + feature]) {
					try {
						t['clean' + feature](t, t.getElement(t.layers), t.getElement(t.controls), t.media);
					} catch (e) {
						console.error('error cleaning ' + feature, e);
					}
				}
			}

			var nativeWidth = t.node.getAttribute('width'),
			    nativeHeight = t.node.getAttribute('height');

			if (nativeWidth) {
				if (nativeWidth.indexOf('%') === -1) {
					nativeWidth = nativeWidth + 'px';
				}
			} else {
				nativeWidth = 'auto';
			}

			if (nativeHeight) {
				if (nativeHeight.indexOf('%') === -1) {
					nativeHeight = nativeHeight + 'px';
				}
			} else {
				nativeHeight = 'auto';
			}

			t.node.style.width = nativeWidth;
			t.node.style.height = nativeHeight;

			t.setPlayerSize(0, 0);

			if (!t.isDynamic) {
				(function () {
					t.node.setAttribute('controls', true);
					t.node.setAttribute('id', t.node.getAttribute('id').replace('_' + rendererName, '').replace('_from_mejs', ''));
					var poster = t.getElement(t.container).querySelector('.' + t.options.classPrefix + 'poster>img');
					if (poster) {
						t.node.setAttribute('poster', poster.src);
					}

					delete t.node.autoplay;

					if (t.media.canPlayType((0, _media.getTypeFromFile)(src)) !== '') {
						t.node.setAttribute('src', src);
					}

					if (~rendererName.indexOf('iframe')) {
						var layer = _document2.default.getElementById(t.media.id + '-iframe-overlay');
						layer.remove();
					}

					var node = t.node.cloneNode();
					node.style.display = '';
					t.getElement(t.container).parentNode.insertBefore(node, t.getElement(t.container));
					t.node.remove();

					if (t.mediaFiles) {
						for (var i = 0, total = t.mediaFiles.length; i < total; i++) {
							var source = _document2.default.createElement('source');
							source.setAttribute('src', t.mediaFiles[i].src);
							source.setAttribute('type', t.mediaFiles[i].type);
							node.appendChild(source);
						}
					}
					if (t.trackFiles) {
						var _loop3 = function _loop3(_i4, _total4) {
							var track = t.trackFiles[_i4];
							var newTrack = _document2.default.createElement('track');
							newTrack.kind = track.kind;
							newTrack.label = track.label;
							newTrack.srclang = track.srclang;
							newTrack.src = track.src;

							node.appendChild(newTrack);
							newTrack.addEventListener('load', function () {
								this.mode = 'showing';
								node.textTracks[_i4].mode = 'showing';
							});
						};

						for (var _i4 = 0, _total4 = t.trackFiles.length; _i4 < _total4; _i4++) {
							_loop3(_i4, _total4);
						}
					}

					delete t.node;
					delete t.mediaFiles;
					delete t.trackFiles;
				})();
			} else {
				t.getElement(t.container).parentNode.insertBefore(t.node, t.getElement(t.container));
			}

			if (typeof t.media.renderer.destroy === 'function') {
				t.media.renderer.destroy();
			}

			delete _mejs2.default.players[t.id];

			if (_typeof(t.getElement(t.container)) === 'object') {
				var offscreen = t.getElement(t.container).parentNode.querySelector('.' + t.options.classPrefix + 'offscreen');
				offscreen.remove();
				t.getElement(t.container).remove();
			}
			t.globalUnbind('resize', t.globalResizeCallback);
			t.globalUnbind('keydown', t.globalKeydownCallback);
			t.globalUnbind('click', t.globalClickCallback);

			delete t.media.player;
		}
	}, {
		key: 'paused',
		get: function get() {
			return this.proxy.paused;
		}
	}, {
		key: 'muted',
		get: function get() {
			return this.proxy.muted;
		},
		set: function set(muted) {
			this.setMuted(muted);
		}
	}, {
		key: 'ended',
		get: function get() {
			return this.proxy.ended;
		}
	}, {
		key: 'readyState',
		get: function get() {
			return this.proxy.readyState;
		}
	}, {
		key: 'currentTime',
		set: function set(time) {
			this.setCurrentTime(time);
		},
		get: function get() {
			return this.getCurrentTime();
		}
	}, {
		key: 'duration',
		get: function get() {
			return this.getDuration();
		}
	}, {
		key: 'volume',
		set: function set(volume) {
			this.setVolume(volume);
		},
		get: function get() {
			return this.getVolume();
		}
	}, {
		key: 'src',
		set: function set(src) {
			this.setSrc(src);
		},
		get: function get() {
			return this.getSrc();
		}
	}]);

	return MediaElementPlayer;
}();

_window2.default.MediaElementPlayer = MediaElementPlayer;
_mejs2.default.MediaElementPlayer = MediaElementPlayer;

exports.default = MediaElementPlayer;

},{"17":17,"2":2,"25":25,"26":26,"27":27,"28":28,"3":3,"30":30,"5":5,"6":6,"7":7}],17:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DefaultPlayer = function () {
	function DefaultPlayer(player) {
		_classCallCheck(this, DefaultPlayer);

		this.media = player.media;
		this.isVideo = player.isVideo;
		this.classPrefix = player.options.classPrefix;
		this.createIframeLayer = function () {
			return player.createIframeLayer();
		};
		this.setPoster = function (url) {
			return player.setPoster(url);
		};
		return this;
	}

	_createClass(DefaultPlayer, [{
		key: 'play',
		value: function play() {
			this.media.play();
		}
	}, {
		key: 'pause',
		value: function pause() {
			this.media.pause();
		}
	}, {
		key: 'load',
		value: function load() {
			var t = this;

			if (!t.isLoaded) {
				t.media.load();
			}

			t.isLoaded = true;
		}
	}, {
		key: 'setCurrentTime',
		value: function setCurrentTime(time) {
			this.media.setCurrentTime(time);
		}
	}, {
		key: 'getCurrentTime',
		value: function getCurrentTime() {
			return this.media.currentTime;
		}
	}, {
		key: 'getDuration',
		value: function getDuration() {
			return this.media.getDuration();
		}
	}, {
		key: 'setVolume',
		value: function setVolume(volume) {
			this.media.setVolume(volume);
		}
	}, {
		key: 'getVolume',
		value: function getVolume() {
			return this.media.getVolume();
		}
	}, {
		key: 'setMuted',
		value: function setMuted(value) {
			this.media.setMuted(value);
		}
	}, {
		key: 'setSrc',
		value: function setSrc(src) {
			var t = this,
			    layer = document.getElementById(t.media.id + '-iframe-overlay');

			if (layer) {
				layer.remove();
			}

			t.media.setSrc(src);
			t.createIframeLayer();
			if (t.media.renderer !== null && typeof t.media.renderer.getPosterUrl === 'function') {
				t.setPoster(t.media.renderer.getPosterUrl());
			}
		}
	}, {
		key: 'getSrc',
		value: function getSrc() {
			return this.media.getSrc();
		}
	}, {
		key: 'canPlayType',
		value: function canPlayType(type) {
			return this.media.canPlayType(type);
		}
	}, {
		key: 'paused',
		get: function get() {
			return this.media.paused;
		}
	}, {
		key: 'muted',
		set: function set(muted) {
			this.setMuted(muted);
		},
		get: function get() {
			return this.media.muted;
		}
	}, {
		key: 'ended',
		get: function get() {
			return this.media.ended;
		}
	}, {
		key: 'readyState',
		get: function get() {
			return this.media.readyState;
		}
	}, {
		key: 'currentTime',
		set: function set(time) {
			this.setCurrentTime(time);
		},
		get: function get() {
			return this.getCurrentTime();
		}
	}, {
		key: 'duration',
		get: function get() {
			return this.getDuration();
		}
	}, {
		key: 'volume',
		set: function set(volume) {
			this.setVolume(volume);
		},
		get: function get() {
			return this.getVolume();
		}
	}, {
		key: 'src',
		set: function set(src) {
			this.setSrc(src);
		},
		get: function get() {
			return this.getSrc();
		}
	}]);

	return DefaultPlayer;
}();

exports.default = DefaultPlayer;


_window2.default.DefaultPlayer = DefaultPlayer;

},{"3":3}],18:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _mejs = _dereq_(7);

var _mejs2 = _interopRequireDefault(_mejs);

var _player = _dereq_(16);

var _player2 = _interopRequireDefault(_player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (typeof jQuery !== 'undefined') {
	_mejs2.default.$ = _window2.default.jQuery = _window2.default.$ = jQuery;
} else if (typeof Zepto !== 'undefined') {
	_mejs2.default.$ = _window2.default.Zepto = _window2.default.$ = Zepto;
} else if (typeof ender !== 'undefined') {
	_mejs2.default.$ = _window2.default.ender = _window2.default.$ = ender;
}

(function ($) {
	if (typeof $ !== 'undefined') {
		$.fn.mediaelementplayer = function (options) {
			if (options === false) {
				this.each(function () {
					var player = $(this).data('mediaelementplayer');
					if (player) {
						player.remove();
					}
					$(this).removeData('mediaelementplayer');
				});
			} else {
				this.each(function () {
					$(this).data('mediaelementplayer', new _player2.default(this, options));
				});
			}
			return this;
		};

		$(document).ready(function () {
			$('.' + _mejs2.default.MepDefaults.classPrefix + 'player').mediaelementplayer();
		});
	}
})(_mejs2.default.$);

},{"16":16,"3":3,"7":7}],19:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _mejs = _dereq_(7);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(8);

var _general = _dereq_(27);

var _media = _dereq_(28);

var _constants = _dereq_(25);

var _dom = _dereq_(26);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NativeDash = {

	promise: null,

	load: function load(settings) {
		if (typeof dashjs !== 'undefined') {
			NativeDash.promise = new Promise(function (resolve) {
				resolve();
			}).then(function () {
				NativeDash._createPlayer(settings);
			});
		} else {
			settings.options.path = typeof settings.options.path === 'string' ? settings.options.path : 'https://cdn.dashjs.org/latest/dash.all.min.js';

			NativeDash.promise = NativeDash.promise || (0, _dom.loadScript)(settings.options.path);
			NativeDash.promise.then(function () {
				NativeDash._createPlayer(settings);
			});
		}

		return NativeDash.promise;
	},

	_createPlayer: function _createPlayer(settings) {
		var player = dashjs.MediaPlayer().create();
		_window2.default['__ready__' + settings.id](player);
		return player;
	}
};

var DashNativeRenderer = {
	name: 'native_dash',
	options: {
		prefix: 'native_dash',
		dash: {
			path: 'https://cdn.dashjs.org/latest/dash.all.min.js',
			debug: false,
			drm: {},

			robustnessLevel: ''
		}
	},

	canPlayType: function canPlayType(type) {
		return _constants.HAS_MSE && ['application/dash+xml'].indexOf(type.toLowerCase()) > -1;
	},

	create: function create(mediaElement, options, mediaFiles) {

		var originalNode = mediaElement.originalNode,
		    id = mediaElement.id + '_' + options.prefix,
		    autoplay = originalNode.autoplay,
		    children = originalNode.children;

		var node = null,
		    dashPlayer = null;

		originalNode.removeAttribute('type');
		for (var i = 0, total = children.length; i < total; i++) {
			children[i].removeAttribute('type');
		}

		node = originalNode.cloneNode(true);
		options = Object.assign(options, mediaElement.options);

		var props = _mejs2.default.html5media.properties,
		    events = _mejs2.default.html5media.events.concat(['click', 'mouseover', 'mouseout']),
		    attachNativeEvents = function attachNativeEvents(e) {
			if (e.type !== 'error') {
				var _event = (0, _general.createEvent)(e.type, mediaElement);
				mediaElement.dispatchEvent(_event);
			}
		},
		    assignGettersSetters = function assignGettersSetters(propName) {
			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

			node['get' + capName] = function () {
				return dashPlayer !== null ? node[propName] : null;
			};

			node['set' + capName] = function (value) {
				if (_mejs2.default.html5media.readOnlyProperties.indexOf(propName) === -1) {
					if (propName === 'src') {
						var source = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.src ? value.src : value;
						node[propName] = source;
						if (dashPlayer !== null) {
							dashPlayer.reset();
							for (var _i = 0, _total = events.length; _i < _total; _i++) {
								node.removeEventListener(events[_i], attachNativeEvents);
							}
							dashPlayer = NativeDash._createPlayer({
								options: options.dash,
								id: id
							});

							if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && _typeof(value.drm) === 'object') {
								dashPlayer.setProtectionData(value.drm);
								if ((0, _general.isString)(options.dash.robustnessLevel) && options.dash.robustnessLevel) {
									dashPlayer.getProtectionController().setRobustnessLevel(options.dash.robustnessLevel);
								}
							}
							dashPlayer.attachSource(source);
							if (autoplay) {
								dashPlayer.play();
							}
						}
					} else {
						node[propName] = value;
					}
				}
			};
		};

		for (var _i2 = 0, _total2 = props.length; _i2 < _total2; _i2++) {
			assignGettersSetters(props[_i2]);
		}

		_window2.default['__ready__' + id] = function (_dashPlayer) {
			mediaElement.dashPlayer = dashPlayer = _dashPlayer;

			var dashEvents = dashjs.MediaPlayer.events,
			    assignEvents = function assignEvents(eventName) {
				if (eventName === 'loadedmetadata') {
					dashPlayer.getDebug().setLogToBrowserConsole(options.dash.debug);
					dashPlayer.initialize();
					dashPlayer.setScheduleWhilePaused(false);
					dashPlayer.setFastSwitchEnabled(true);
					dashPlayer.attachView(node);
					dashPlayer.setAutoPlay(false);

					if (_typeof(options.dash.drm) === 'object' && !_mejs2.default.Utils.isObjectEmpty(options.dash.drm)) {
						dashPlayer.setProtectionData(options.dash.drm);
						if ((0, _general.isString)(options.dash.robustnessLevel) && options.dash.robustnessLevel) {
							dashPlayer.getProtectionController().setRobustnessLevel(options.dash.robustnessLevel);
						}
					}
					dashPlayer.attachSource(node.getSrc());
				}

				node.addEventListener(eventName, attachNativeEvents);
			};

			for (var _i3 = 0, _total3 = events.length; _i3 < _total3; _i3++) {
				assignEvents(events[_i3]);
			}

			var assignMdashEvents = function assignMdashEvents(name, data) {
				if (name.toLowerCase() === 'error') {
					mediaElement.generateError(data.message, node.src);
					console.error(data);
				} else {
					var _event2 = (0, _general.createEvent)(name, mediaElement);
					_event2.data = data;
					mediaElement.dispatchEvent(_event2);
				}
			};

			for (var eventType in dashEvents) {
				if (dashEvents.hasOwnProperty(eventType)) {
					dashPlayer.on(dashEvents[eventType], function (e) {
						for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
							args[_key - 1] = arguments[_key];
						}

						return assignMdashEvents(e.type, args);
					});
				}
			}
		};

		if (mediaFiles && mediaFiles.length > 0) {
			for (var _i4 = 0, _total4 = mediaFiles.length; _i4 < _total4; _i4++) {
				if (_renderer.renderer.renderers[options.prefix].canPlayType(mediaFiles[_i4].type)) {
					node.setAttribute('src', mediaFiles[_i4].src);
					if (typeof mediaFiles[_i4].drm !== 'undefined') {
						options.dash.drm = mediaFiles[_i4].drm;
					}
					break;
				}
			}
		}

		node.setAttribute('id', id);

		originalNode.parentNode.insertBefore(node, originalNode);
		originalNode.autoplay = false;
		originalNode.style.display = 'none';

		node.setSize = function (width, height) {
			node.style.width = width + 'px';
			node.style.height = height + 'px';
			return node;
		};

		node.hide = function () {
			node.pause();
			node.style.display = 'none';
			return node;
		};

		node.show = function () {
			node.style.display = '';
			return node;
		};

		node.destroy = function () {
			if (dashPlayer !== null) {
				dashPlayer.reset();
			}
		};

		var event = (0, _general.createEvent)('rendererready', node);
		mediaElement.dispatchEvent(event);

		mediaElement.promises.push(NativeDash.load({
			options: options.dash,
			id: id
		}));

		return node;
	}
};

_media.typeChecks.push(function (url) {
	return ~url.toLowerCase().indexOf('.mpd') ? 'application/dash+xml' : null;
});

_renderer.renderer.add(DashNativeRenderer);

},{"25":25,"26":26,"27":27,"28":28,"3":3,"7":7,"8":8}],20:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.PluginDetector = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(7);

var _mejs2 = _interopRequireDefault(_mejs);

var _i18n = _dereq_(5);

var _i18n2 = _interopRequireDefault(_i18n);

var _renderer = _dereq_(8);

var _general = _dereq_(27);

var _constants = _dereq_(25);

var _media = _dereq_(28);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PluginDetector = exports.PluginDetector = {
	plugins: [],

	hasPluginVersion: function hasPluginVersion(plugin, v) {
		var pv = PluginDetector.plugins[plugin];
		v[1] = v[1] || 0;
		v[2] = v[2] || 0;
		return pv[0] > v[0] || pv[0] === v[0] && pv[1] > v[1] || pv[0] === v[0] && pv[1] === v[1] && pv[2] >= v[2];
	},

	addPlugin: function addPlugin(p, pluginName, mimeType, activeX, axDetect) {
		PluginDetector.plugins[p] = PluginDetector.detectPlugin(pluginName, mimeType, activeX, axDetect);
	},

	detectPlugin: function detectPlugin(pluginName, mimeType, activeX, axDetect) {

		var version = [0, 0, 0],
		    description = void 0,
		    ax = void 0;

		if (_constants.NAV.plugins !== null && _constants.NAV.plugins !== undefined && _typeof(_constants.NAV.plugins[pluginName]) === 'object') {
			description = _constants.NAV.plugins[pluginName].description;
			if (description && !(typeof _constants.NAV.mimeTypes !== 'undefined' && _constants.NAV.mimeTypes[mimeType] && !_constants.NAV.mimeTypes[mimeType].enabledPlugin)) {
				version = description.replace(pluginName, '').replace(/^\s+/, '').replace(/\sr/gi, '.').split('.');
				for (var i = 0, total = version.length; i < total; i++) {
					version[i] = parseInt(version[i].match(/\d+/), 10);
				}
			}
		} else if (_window2.default.ActiveXObject !== undefined) {
			try {
				ax = new ActiveXObject(activeX);
				if (ax) {
					version = axDetect(ax);
				}
			} catch (e) {
				
			}
		}
		return version;
	}
};

PluginDetector.addPlugin('flash', 'Shockwave Flash', 'application/x-shockwave-flash', 'ShockwaveFlash.ShockwaveFlash', function (ax) {
	var version = [],
	    d = ax.GetVariable("$version");

	if (d) {
		d = d.split(" ")[1].split(",");
		version = [parseInt(d[0], 10), parseInt(d[1], 10), parseInt(d[2], 10)];
	}
	return version;
});

var FlashMediaElementRenderer = {
	create: function create(mediaElement, options, mediaFiles) {

		var flash = {};
		var isActive = false;

		flash.options = options;
		flash.id = mediaElement.id + '_' + flash.options.prefix;
		flash.mediaElement = mediaElement;
		flash.flashState = {};
		flash.flashApi = null;
		flash.flashApiStack = [];

		var props = _mejs2.default.html5media.properties,
		    assignGettersSetters = function assignGettersSetters(propName) {
			flash.flashState[propName] = null;

			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

			flash['get' + capName] = function () {
				if (flash.flashApi !== null) {
					if (typeof flash.flashApi['get_' + propName] === 'function') {
						var value = flash.flashApi['get_' + propName]();

						if (propName === 'buffered') {
							return {
								start: function start() {
									return 0;
								},
								end: function end() {
									return value;
								},
								length: 1
							};
						}
						return value;
					} else {
						return null;
					}
				} else {
					return null;
				}
			};

			flash['set' + capName] = function (value) {
				if (propName === 'src') {
					value = (0, _media.absolutizeUrl)(value);
				}

				if (flash.flashApi !== null && flash.flashApi['set_' + propName] !== undefined) {
					try {
						flash.flashApi['set_' + propName](value);
					} catch (e) {
						
					}
				} else {
					flash.flashApiStack.push({
						type: 'set',
						propName: propName,
						value: value
					});
				}
			};
		};

		for (var i = 0, total = props.length; i < total; i++) {
			assignGettersSetters(props[i]);
		}

		var methods = _mejs2.default.html5media.methods,
		    assignMethods = function assignMethods(methodName) {
			flash[methodName] = function () {
				if (isActive) {
					if (flash.flashApi !== null) {
						if (flash.flashApi['fire_' + methodName]) {
							try {
								flash.flashApi['fire_' + methodName]();
							} catch (e) {
								
							}
						} else {
							
						}
					} else {
						flash.flashApiStack.push({
							type: 'call',
							methodName: methodName
						});
					}
				}
			};
		};
		methods.push('stop');
		for (var _i = 0, _total = methods.length; _i < _total; _i++) {
			assignMethods(methods[_i]);
		}

		var initEvents = ['rendererready'];

		for (var _i2 = 0, _total2 = initEvents.length; _i2 < _total2; _i2++) {
			var event = (0, _general.createEvent)(initEvents[_i2], flash);
			mediaElement.dispatchEvent(event);
		}

		_window2.default['__ready__' + flash.id] = function () {

			flash.flashReady = true;
			flash.flashApi = _document2.default.getElementById('__' + flash.id);

			if (flash.flashApiStack.length) {
				for (var _i3 = 0, _total3 = flash.flashApiStack.length; _i3 < _total3; _i3++) {
					var stackItem = flash.flashApiStack[_i3];

					if (stackItem.type === 'set') {
						var propName = stackItem.propName,
						    capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

						flash['set' + capName](stackItem.value);
					} else if (stackItem.type === 'call') {
						flash[stackItem.methodName]();
					}
				}
			}
		};

		_window2.default['__event__' + flash.id] = function (eventName, message) {
			var event = (0, _general.createEvent)(eventName, flash);
			if (message) {
				try {
					event.data = JSON.parse(message);
					event.details.data = JSON.parse(message);
				} catch (e) {
					event.message = message;
				}
			}

			flash.mediaElement.dispatchEvent(event);
		};

		flash.flashWrapper = _document2.default.createElement('div');

		if (['always', 'sameDomain'].indexOf(flash.options.shimScriptAccess) === -1) {
			flash.options.shimScriptAccess = 'sameDomain';
		}

		var autoplay = mediaElement.originalNode.autoplay,
		    flashVars = ['uid=' + flash.id, 'autoplay=' + autoplay, 'allowScriptAccess=' + flash.options.shimScriptAccess, 'preload=' + (mediaElement.originalNode.getAttribute('preload') || '')],
		    isVideo = mediaElement.originalNode !== null && mediaElement.originalNode.tagName.toLowerCase() === 'video',
		    flashHeight = isVideo ? mediaElement.originalNode.height : 1,
		    flashWidth = isVideo ? mediaElement.originalNode.width : 1;

		if (mediaElement.originalNode.getAttribute('src')) {
			flashVars.push('src=' + mediaElement.originalNode.getAttribute('src'));
		}

		if (flash.options.enablePseudoStreaming === true) {
			flashVars.push('pseudostreamstart=' + flash.options.pseudoStreamingStartQueryParam);
			flashVars.push('pseudostreamtype=' + flash.options.pseudoStreamingType);
		}

		if (flash.options.streamDelimiter) {
			flashVars.push('streamdelimiter=' + encodeURIComponent(flash.options.streamDelimiter));
		}

		if (flash.options.proxyType) {
			flashVars.push('proxytype=' + flash.options.proxyType);
		}

		mediaElement.appendChild(flash.flashWrapper);
		mediaElement.originalNode.style.display = 'none';

		var settings = [];

		if (_constants.IS_IE || _constants.IS_EDGE) {
			var specialIEContainer = _document2.default.createElement('div');
			flash.flashWrapper.appendChild(specialIEContainer);

			if (_constants.IS_EDGE) {
				settings = ['type="application/x-shockwave-flash"', 'data="' + flash.options.pluginPath + flash.options.filename + '"', 'id="__' + flash.id + '"', 'width="' + flashWidth + '"', 'height="' + flashHeight + '\'"'];
			} else {
				settings = ['classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"', 'codebase="//download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"', 'id="__' + flash.id + '"', 'width="' + flashWidth + '"', 'height="' + flashHeight + '"'];
			}

			if (!isVideo) {
				settings.push('style="clip: rect(0 0 0 0); position: absolute;"');
			}

			specialIEContainer.outerHTML = '<object ' + settings.join(' ') + '>' + ('<param name="movie" value="' + flash.options.pluginPath + flash.options.filename + '?x=' + new Date() + '" />') + ('<param name="flashvars" value="' + flashVars.join('&amp;') + '" />') + '<param name="quality" value="high" />' + '<param name="bgcolor" value="#000000" />' + '<param name="wmode" value="transparent" />' + ('<param name="allowScriptAccess" value="' + flash.options.shimScriptAccess + '" />') + '<param name="allowFullScreen" value="true" />' + ('<div>' + _i18n2.default.t('mejs.install-flash') + '</div>') + '</object>';
		} else {

			settings = ['id="__' + flash.id + '"', 'name="__' + flash.id + '"', 'play="true"', 'loop="false"', 'quality="high"', 'bgcolor="#000000"', 'wmode="transparent"', 'allowScriptAccess="' + flash.options.shimScriptAccess + '"', 'allowFullScreen="true"', 'type="application/x-shockwave-flash"', 'pluginspage="//www.macromedia.com/go/getflashplayer"', 'src="' + flash.options.pluginPath + flash.options.filename + '"', 'flashvars="' + flashVars.join('&') + '"'];

			if (isVideo) {
				settings.push('width="' + flashWidth + '"');
				settings.push('height="' + flashHeight + '"');
			} else {
				settings.push('style="position: fixed; left: -9999em; top: -9999em;"');
			}

			flash.flashWrapper.innerHTML = '<embed ' + settings.join(' ') + '>';
		}

		flash.flashNode = flash.flashWrapper.lastChild;

		flash.hide = function () {
			isActive = false;
			if (isVideo) {
				flash.flashNode.style.display = 'none';
			}
		};
		flash.show = function () {
			isActive = true;
			if (isVideo) {
				flash.flashNode.style.display = '';
			}
		};
		flash.setSize = function (width, height) {
			flash.flashNode.style.width = width + 'px';
			flash.flashNode.style.height = height + 'px';

			if (flash.flashApi !== null && typeof flash.flashApi.fire_setSize === 'function') {
				flash.flashApi.fire_setSize(width, height);
			}
		};

		flash.destroy = function () {
			flash.flashNode.remove();
		};

		if (mediaFiles && mediaFiles.length > 0) {
			for (var _i4 = 0, _total4 = mediaFiles.length; _i4 < _total4; _i4++) {
				if (_renderer.renderer.renderers[options.prefix].canPlayType(mediaFiles[_i4].type)) {
					flash.setSrc(mediaFiles[_i4].src);
					break;
				}
			}
		}

		return flash;
	}
};

var hasFlash = PluginDetector.hasPluginVersion('flash', [10, 0, 0]);

if (hasFlash) {
	_media.typeChecks.push(function (url) {
		url = url.toLowerCase();

		if (url.startsWith('rtmp')) {
			if (~url.indexOf('.mp3')) {
				return 'audio/rtmp';
			} else {
				return 'video/rtmp';
			}
		} else if (/\.og(a|g)/i.test(url)) {
			return 'audio/ogg';
		} else if (~url.indexOf('.m3u8')) {
			return 'application/x-mpegURL';
		} else if (~url.indexOf('.mpd')) {
			return 'application/dash+xml';
		} else if (~url.indexOf('.flv')) {
			return 'video/flv';
		} else {
			return null;
		}
	});

	var FlashMediaElementVideoRenderer = {
		name: 'flash_video',
		options: {
			prefix: 'flash_video',
			filename: 'mediaelement-flash-video.swf',
			enablePseudoStreaming: false,

			pseudoStreamingStartQueryParam: 'start',

			pseudoStreamingType: 'byte',

			proxyType: '',

			streamDelimiter: ''
		},

		canPlayType: function canPlayType(type) {
			return ~['video/mp4', 'video/rtmp', 'audio/rtmp', 'rtmp/mp4', 'audio/mp4', 'video/flv', 'video/x-flv'].indexOf(type.toLowerCase());
		},

		create: FlashMediaElementRenderer.create

	};
	_renderer.renderer.add(FlashMediaElementVideoRenderer);

	var FlashMediaElementHlsVideoRenderer = {
		name: 'flash_hls',
		options: {
			prefix: 'flash_hls',
			filename: 'mediaelement-flash-video-hls.swf'
		},

		canPlayType: function canPlayType(type) {
			return ~['application/x-mpegurl', 'application/vnd.apple.mpegurl', 'audio/mpegurl', 'audio/hls', 'video/hls'].indexOf(type.toLowerCase());
		},

		create: FlashMediaElementRenderer.create
	};
	_renderer.renderer.add(FlashMediaElementHlsVideoRenderer);

	var FlashMediaElementMdashVideoRenderer = {
		name: 'flash_dash',
		options: {
			prefix: 'flash_dash',
			filename: 'mediaelement-flash-video-mdash.swf'
		},

		canPlayType: function canPlayType(type) {
			return ~['application/dash+xml'].indexOf(type.toLowerCase());
		},

		create: FlashMediaElementRenderer.create
	};
	_renderer.renderer.add(FlashMediaElementMdashVideoRenderer);

	var FlashMediaElementAudioRenderer = {
		name: 'flash_audio',
		options: {
			prefix: 'flash_audio',
			filename: 'mediaelement-flash-audio.swf'
		},

		canPlayType: function canPlayType(type) {
			return ~['audio/mp3'].indexOf(type.toLowerCase());
		},

		create: FlashMediaElementRenderer.create
	};
	_renderer.renderer.add(FlashMediaElementAudioRenderer);

	var FlashMediaElementAudioOggRenderer = {
		name: 'flash_audio_ogg',
		options: {
			prefix: 'flash_audio_ogg',
			filename: 'mediaelement-flash-audio-ogg.swf'
		},

		canPlayType: function canPlayType(type) {
			return ~['audio/ogg', 'audio/oga', 'audio/ogv'].indexOf(type.toLowerCase());
		},

		create: FlashMediaElementRenderer.create
	};
	_renderer.renderer.add(FlashMediaElementAudioOggRenderer);
}

},{"2":2,"25":25,"27":27,"28":28,"3":3,"5":5,"7":7,"8":8}],21:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _mejs = _dereq_(7);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(8);

var _general = _dereq_(27);

var _constants = _dereq_(25);

var _media = _dereq_(28);

var _dom = _dereq_(26);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NativeFlv = {

	promise: null,

	load: function load(settings) {
		if (typeof flvjs !== 'undefined') {
			NativeFlv.promise = new Promise(function (resolve) {
				resolve();
			}).then(function () {
				NativeFlv._createPlayer(settings);
			});
		} else {
			settings.options.path = typeof settings.options.path === 'string' ? settings.options.path : 'https://cdnjs.cloudflare.com/ajax/libs/flv.js/1.3.3/flv.min.js';

			NativeFlv.promise = NativeFlv.promise || (0, _dom.loadScript)(settings.options.path);
			NativeFlv.promise.then(function () {
				NativeFlv._createPlayer(settings);
			});
		}

		return NativeFlv.promise;
	},

	_createPlayer: function _createPlayer(settings) {
		flvjs.LoggingControl.enableDebug = settings.options.debug;
		flvjs.LoggingControl.enableVerbose = settings.options.debug;
		var player = flvjs.createPlayer(settings.options, settings.configs);
		_window2.default['__ready__' + settings.id](player);
		return player;
	}
};

var FlvNativeRenderer = {
	name: 'native_flv',
	options: {
		prefix: 'native_flv',
		flv: {
			path: 'https://cdnjs.cloudflare.com/ajax/libs/flv.js/1.3.3/flv.min.js',

			cors: true,
			debug: false
		}
	},

	canPlayType: function canPlayType(type) {
		return _constants.HAS_MSE && ['video/x-flv', 'video/flv'].indexOf(type.toLowerCase()) > -1;
	},

	create: function create(mediaElement, options, mediaFiles) {

		var originalNode = mediaElement.originalNode,
		    id = mediaElement.id + '_' + options.prefix;

		var node = null,
		    flvPlayer = null;

		node = originalNode.cloneNode(true);
		options = Object.assign(options, mediaElement.options);

		var props = _mejs2.default.html5media.properties,
		    events = _mejs2.default.html5media.events.concat(['click', 'mouseover', 'mouseout']),
		    attachNativeEvents = function attachNativeEvents(e) {
			if (e.type !== 'error') {
				var _event = (0, _general.createEvent)(e.type, mediaElement);
				mediaElement.dispatchEvent(_event);
			}
		},
		    assignGettersSetters = function assignGettersSetters(propName) {
			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

			node['get' + capName] = function () {
				return flvPlayer !== null ? node[propName] : null;
			};

			node['set' + capName] = function (value) {
				if (_mejs2.default.html5media.readOnlyProperties.indexOf(propName) === -1) {
					if (propName === 'src') {
						node[propName] = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.src ? value.src : value;
						if (flvPlayer !== null) {
							var _flvOptions = {};
							_flvOptions.type = 'flv';
							_flvOptions.url = value;
							_flvOptions.cors = options.flv.cors;
							_flvOptions.debug = options.flv.debug;
							_flvOptions.path = options.flv.path;
							var _flvConfigs = options.flv.configs;

							flvPlayer.destroy();
							for (var i = 0, total = events.length; i < total; i++) {
								node.removeEventListener(events[i], attachNativeEvents);
							}
							flvPlayer = NativeFlv._createPlayer({
								options: _flvOptions,
								configs: _flvConfigs,
								id: id
							});
							flvPlayer.attachMediaElement(node);
							flvPlayer.load();
						}
					} else {
						node[propName] = value;
					}
				}
			};
		};

		for (var i = 0, total = props.length; i < total; i++) {
			assignGettersSetters(props[i]);
		}

		_window2.default['__ready__' + id] = function (_flvPlayer) {
			mediaElement.flvPlayer = flvPlayer = _flvPlayer;

			var flvEvents = flvjs.Events,
			    assignEvents = function assignEvents(eventName) {
				if (eventName === 'loadedmetadata') {
					flvPlayer.unload();
					flvPlayer.detachMediaElement();
					flvPlayer.attachMediaElement(node);
					flvPlayer.load();
				}

				node.addEventListener(eventName, attachNativeEvents);
			};

			for (var _i = 0, _total = events.length; _i < _total; _i++) {
				assignEvents(events[_i]);
			}

			var assignFlvEvents = function assignFlvEvents(name, data) {
				if (name === 'error') {
					var message = data[0] + ': ' + data[1] + ' ' + data[2].msg;
					mediaElement.generateError(message, node.src);
				} else {
					var _event2 = (0, _general.createEvent)(name, mediaElement);
					_event2.data = data;
					mediaElement.dispatchEvent(_event2);
				}
			};

			var _loop = function _loop(eventType) {
				if (flvEvents.hasOwnProperty(eventType)) {
					flvPlayer.on(flvEvents[eventType], function () {
						for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
							args[_key] = arguments[_key];
						}

						return assignFlvEvents(flvEvents[eventType], args);
					});
				}
			};

			for (var eventType in flvEvents) {
				_loop(eventType);
			}
		};

		if (mediaFiles && mediaFiles.length > 0) {
			for (var _i2 = 0, _total2 = mediaFiles.length; _i2 < _total2; _i2++) {
				if (_renderer.renderer.renderers[options.prefix].canPlayType(mediaFiles[_i2].type)) {
					node.setAttribute('src', mediaFiles[_i2].src);
					break;
				}
			}
		}

		node.setAttribute('id', id);

		originalNode.parentNode.insertBefore(node, originalNode);
		originalNode.autoplay = false;
		originalNode.style.display = 'none';

		var flvOptions = {};
		flvOptions.type = 'flv';
		flvOptions.url = node.src;
		flvOptions.cors = options.flv.cors;
		flvOptions.debug = options.flv.debug;
		flvOptions.path = options.flv.path;
		var flvConfigs = options.flv.configs;

		node.setSize = function (width, height) {
			node.style.width = width + 'px';
			node.style.height = height + 'px';
			return node;
		};

		node.hide = function () {
			if (flvPlayer !== null) {
				flvPlayer.pause();
			}
			node.style.display = 'none';
			return node;
		};

		node.show = function () {
			node.style.display = '';
			return node;
		};

		node.destroy = function () {
			if (flvPlayer !== null) {
				flvPlayer.destroy();
			}
		};

		var event = (0, _general.createEvent)('rendererready', node);
		mediaElement.dispatchEvent(event);

		mediaElement.promises.push(NativeFlv.load({
			options: flvOptions,
			configs: flvConfigs,
			id: id
		}));

		return node;
	}
};

_media.typeChecks.push(function (url) {
	return ~url.toLowerCase().indexOf('.flv') ? 'video/flv' : null;
});

_renderer.renderer.add(FlvNativeRenderer);

},{"25":25,"26":26,"27":27,"28":28,"3":3,"7":7,"8":8}],22:[function(_dereq_,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _mejs = _dereq_(7);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(8);

var _general = _dereq_(27);

var _constants = _dereq_(25);

var _media = _dereq_(28);

var _dom = _dereq_(26);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NativeHls = {

	promise: null,

	load: function load(settings) {
		if (typeof Hls !== 'undefined') {
			NativeHls.promise = new Promise(function (resolve) {
				resolve();
			}).then(function () {
				NativeHls._createPlayer(settings);
			});
		} else {
			settings.options.path = typeof settings.options.path === 'string' ? settings.options.path : 'https://cdnjs.cloudflare.com/ajax/libs/hls.js/0.8.4/hls.min.js';

			NativeHls.promise = NativeHls.promise || (0, _dom.loadScript)(settings.options.path);
			NativeHls.promise.then(function () {
				NativeHls._createPlayer(settings);
			});
		}

		return NativeHls.promise;
	},

	_createPlayer: function _createPlayer(settings) {
		var player = new Hls(settings.options);
		_window2.default['__ready__' + settings.id](player);
		return player;
	}
};

var HlsNativeRenderer = {
	name: 'native_hls',
	options: {
		prefix: 'native_hls',
		hls: {
			path: 'https://cdnjs.cloudflare.com/ajax/libs/hls.js/0.8.4/hls.min.js',

			autoStartLoad: false,
			debug: false
		}
	},

	canPlayType: function canPlayType(type) {
		return _constants.HAS_MSE && ['application/x-mpegurl', 'application/vnd.apple.mpegurl', 'audio/mpegurl', 'audio/hls', 'video/hls'].indexOf(type.toLowerCase()) > -1;
	},

	create: function create(mediaElement, options, mediaFiles) {

		var originalNode = mediaElement.originalNode,
		    id = mediaElement.id + '_' + options.prefix,
		    preload = originalNode.getAttribute('preload'),
		    autoplay = originalNode.autoplay;

		var hlsPlayer = null,
		    node = null,
		    index = 0,
		    total = mediaFiles.length;

		node = originalNode.cloneNode(true);
		options = Object.assign(options, mediaElement.options);
		options.hls.autoStartLoad = preload && preload !== 'none' || autoplay;

		var props = _mejs2.default.html5media.properties,
		    events = _mejs2.default.html5media.events.concat(['click', 'mouseover', 'mouseout']),
		    attachNativeEvents = function attachNativeEvents(e) {
			if (e.type !== 'error') {
				var _event = (0, _general.createEvent)(e.type, mediaElement);
				mediaElement.dispatchEvent(_event);
			}
		},
		    assignGettersSetters = function assignGettersSetters(propName) {
			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

			node['get' + capName] = function () {
				return hlsPlayer !== null ? node[propName] : null;
			};

			node['set' + capName] = function (value) {
				if (_mejs2.default.html5media.readOnlyProperties.indexOf(propName) === -1) {
					if (propName === 'src') {
						node[propName] = (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value.src ? value.src : value;
						if (hlsPlayer !== null) {
							hlsPlayer.destroy();
							for (var i = 0, _total = events.length; i < _total; i++) {
								node.removeEventListener(events[i], attachNativeEvents);
							}
							hlsPlayer = NativeHls._createPlayer({
								options: options.hls,
								id: id
							});
							hlsPlayer.loadSource(value);
							hlsPlayer.attachMedia(node);
						}
					} else {
						node[propName] = value;
					}
				}
			};
		};

		for (var i = 0, _total2 = props.length; i < _total2; i++) {
			assignGettersSetters(props[i]);
		}

		_window2.default['__ready__' + id] = function (_hlsPlayer) {
			mediaElement.hlsPlayer = hlsPlayer = _hlsPlayer;
			var hlsEvents = Hls.Events,
			    assignEvents = function assignEvents(eventName) {
				if (eventName === 'loadedmetadata') {
					var url = mediaElement.originalNode.src;
					hlsPlayer.detachMedia();
					hlsPlayer.loadSource(url);
					hlsPlayer.attachMedia(node);
				}

				node.addEventListener(eventName, attachNativeEvents);
			};

			for (var _i = 0, _total3 = events.length; _i < _total3; _i++) {
				assignEvents(events[_i]);
			}

			var recoverDecodingErrorDate = void 0,
			    recoverSwapAudioCodecDate = void 0;
			var assignHlsEvents = function assignHlsEvents(name, data) {
				if (name === 'hlsError') {
					console.warn(data);
					data = data[1];

					if (data.fatal) {
						switch (data.type) {
							case 'mediaError':
								var now = new Date().getTime();
								if (!recoverDecodingErrorDate || now - recoverDecodingErrorDate > 3000) {
									recoverDecodingErrorDate = new Date().getTime();
									hlsPlayer.recoverMediaError();
								} else if (!recoverSwapAudioCodecDate || now - recoverSwapAudioCodecDate > 3000) {
									recoverSwapAudioCodecDate = new Date().getTime();
									console.warn('Attempting to swap Audio Codec and recover from media error');
									hlsPlayer.swapAudioCodec();
									hlsPlayer.recoverMediaError();
								} else {
									var message = 'Cannot recover, last media error recovery failed';
									mediaElement.generateError(message, node.src);
									console.error(message);
								}
								break;
							case 'networkError':
								if (data.details === 'manifestLoadError') {
									if (index < total && mediaFiles[index + 1] !== undefined) {
										node.setSrc(mediaFiles[index++].src);
										node.load();
										node.play();
									} else {
										var _message = 'Network error';
										mediaElement.generateError(_message, mediaFiles);
										console.error(_message);
									}
								} else {
									var _message2 = 'Network error';
									mediaElement.generateError(_message2, mediaFiles);
									console.error(_message2);
								}
								break;
							default:
								hlsPlayer.destroy();
								break;
						}
					}
				} else {
					var _event2 = (0, _general.createEvent)(name, mediaElement);
					_event2.data = data;
					mediaElement.dispatchEvent(_event2);
				}
			};

			var _loop = function _loop(eventType) {
				if (hlsEvents.hasOwnProperty(eventType)) {
					hlsPlayer.on(hlsEvents[eventType], function () {
						for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
							args[_key] = arguments[_key];
						}

						return assignHlsEvents(hlsEvents[eventType], args);
					});
				}
			};

			for (var eventType in hlsEvents) {
				_loop(eventType);
			}
		};

		if (total > 0) {
			for (; index < total; index++) {
				if (_renderer.renderer.renderers[options.prefix].canPlayType(mediaFiles[index].type)) {
					node.setAttribute('src', mediaFiles[index].src);
					break;
				}
			}
		}

		if (preload !== 'auto' && !autoplay) {
			node.addEventListener('play', function () {
				if (hlsPlayer !== null) {
					hlsPlayer.startLoad();
				}
			});

			node.addEventListener('pause', function () {
				if (hlsPlayer !== null) {
					hlsPlayer.stopLoad();
				}
			});
		}

		node.setAttribute('id', id);

		originalNode.parentNode.insertBefore(node, originalNode);
		originalNode.autoplay = false;
		originalNode.style.display = 'none';

		node.setSize = function (width, height) {
			node.style.width = width + 'px';
			node.style.height = height + 'px';
			return node;
		};

		node.hide = function () {
			node.pause();
			node.style.display = 'none';
			return node;
		};

		node.show = function () {
			node.style.display = '';
			return node;
		};

		node.destroy = function () {
			if (hlsPlayer !== null) {
				hlsPlayer.stopLoad();
				hlsPlayer.destroy();
			}
		};

		var event = (0, _general.createEvent)('rendererready', node);
		mediaElement.dispatchEvent(event);

		mediaElement.promises.push(NativeHls.load({
			options: options.hls,
			id: id
		}));

		return node;
	}
};

_media.typeChecks.push(function (url) {
	return ~url.toLowerCase().indexOf('.m3u8') ? 'application/x-mpegURL' : null;
});

_renderer.renderer.add(HlsNativeRenderer);

},{"25":25,"26":26,"27":27,"28":28,"3":3,"7":7,"8":8}],23:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(7);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(8);

var _general = _dereq_(27);

var _constants = _dereq_(25);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HtmlMediaElement = {
	name: 'html5',
	options: {
		prefix: 'html5'
	},

	canPlayType: function canPlayType(type) {

		var mediaElement = _document2.default.createElement('video');

		if (_constants.IS_ANDROID && /\/mp(3|4)$/i.test(type) || ~['application/x-mpegurl', 'vnd.apple.mpegurl', 'audio/mpegurl', 'audio/hls', 'video/hls'].indexOf(type.toLowerCase()) && _constants.SUPPORTS_NATIVE_HLS) {
			return 'yes';
		} else if (mediaElement.canPlayType) {
			return mediaElement.canPlayType(type.toLowerCase()).replace(/no/, '');
		} else {
			return '';
		}
	},

	create: function create(mediaElement, options, mediaFiles) {

		var id = mediaElement.id + '_' + options.prefix;
		var isActive = false;

		var node = null;

		if (mediaElement.originalNode === undefined || mediaElement.originalNode === null) {
			node = _document2.default.createElement('audio');
			mediaElement.appendChild(node);
		} else {
			node = mediaElement.originalNode;
		}

		node.setAttribute('id', id);

		var props = _mejs2.default.html5media.properties,
		    assignGettersSetters = function assignGettersSetters(propName) {
			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

			node['get' + capName] = function () {
				return node[propName];
			};

			node['set' + capName] = function (value) {
				if (_mejs2.default.html5media.readOnlyProperties.indexOf(propName) === -1) {
					node[propName] = value;
				}
			};
		};

		for (var i = 0, _total = props.length; i < _total; i++) {
			assignGettersSetters(props[i]);
		}

		var events = _mejs2.default.html5media.events.concat(['click', 'mouseover', 'mouseout']),
		    assignEvents = function assignEvents(eventName) {
			node.addEventListener(eventName, function (e) {
				if (isActive) {
					var _event = (0, _general.createEvent)(e.type, e.target);
					mediaElement.dispatchEvent(_event);
				}
			});
		};

		for (var _i = 0, _total2 = events.length; _i < _total2; _i++) {
			assignEvents(events[_i]);
		}

		node.setSize = function (width, height) {
			node.style.width = width + 'px';
			node.style.height = height + 'px';
			return node;
		};

		node.hide = function () {
			isActive = false;
			node.style.display = 'none';

			return node;
		};

		node.show = function () {
			isActive = true;
			node.style.display = '';

			return node;
		};

		var index = 0,
		    total = mediaFiles.length;
		if (total > 0) {
			for (; index < total; index++) {
				if (_renderer.renderer.renderers[options.prefix].canPlayType(mediaFiles[index].type)) {
					node.setAttribute('src', mediaFiles[index].src);
					break;
				}
			}
		}

		node.addEventListener('error', function (e) {
			if (e.target.error.code === 4 && isActive) {
				if (index < total && mediaFiles[index + 1] !== undefined) {
					node.src = mediaFiles[index++].src;
					node.load();
					node.play();
				} else {
					mediaElement.generateError('Media error: Format(s) not supported or source(s) not found', mediaFiles);
				}
			}
		});

		var event = (0, _general.createEvent)('rendererready', node);
		mediaElement.dispatchEvent(event);

		return node;
	}
};

_window2.default.HtmlMediaElement = _mejs2.default.HtmlMediaElement = HtmlMediaElement;

_renderer.renderer.add(HtmlMediaElement);

},{"2":2,"25":25,"27":27,"3":3,"7":7,"8":8}],24:[function(_dereq_,module,exports){
'use strict';

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(7);

var _mejs2 = _interopRequireDefault(_mejs);

var _renderer = _dereq_(8);

var _general = _dereq_(27);

var _media = _dereq_(28);

var _dom = _dereq_(26);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var YouTubeApi = {
	isIframeStarted: false,

	isIframeLoaded: false,

	iframeQueue: [],

	enqueueIframe: function enqueueIframe(settings) {
		YouTubeApi.isLoaded = typeof YT !== 'undefined' && YT.loaded;

		if (YouTubeApi.isLoaded) {
			YouTubeApi.createIframe(settings);
		} else {
			YouTubeApi.loadIframeApi();
			YouTubeApi.iframeQueue.push(settings);
		}
	},

	loadIframeApi: function loadIframeApi() {
		if (!YouTubeApi.isIframeStarted) {
			(0, _dom.loadScript)('https://www.youtube.com/player_api');
			YouTubeApi.isIframeStarted = true;
		}
	},

	iFrameReady: function iFrameReady() {

		YouTubeApi.isLoaded = true;
		YouTubeApi.isIframeLoaded = true;

		while (YouTubeApi.iframeQueue.length > 0) {
			var settings = YouTubeApi.iframeQueue.pop();
			YouTubeApi.createIframe(settings);
		}
	},

	createIframe: function createIframe(settings) {
		return new YT.Player(settings.containerId, settings);
	},

	getYouTubeId: function getYouTubeId(url) {

		var youTubeId = '';

		if (url.indexOf('?') > 0) {
			youTubeId = YouTubeApi.getYouTubeIdFromParam(url);

			if (youTubeId === '') {
				youTubeId = YouTubeApi.getYouTubeIdFromUrl(url);
			}
		} else {
			youTubeId = YouTubeApi.getYouTubeIdFromUrl(url);
		}

		var id = youTubeId.substring(youTubeId.lastIndexOf('/') + 1);
		youTubeId = id.split('?');
		return youTubeId[0];
	},

	getYouTubeIdFromParam: function getYouTubeIdFromParam(url) {

		if (url === undefined || url === null || !url.trim().length) {
			return null;
		}

		var parts = url.split('?'),
		    parameters = parts[1].split('&');

		var youTubeId = '';

		for (var i = 0, total = parameters.length; i < total; i++) {
			var paramParts = parameters[i].split('=');
			if (paramParts[0] === 'v') {
				youTubeId = paramParts[1];
				break;
			}
		}

		return youTubeId;
	},

	getYouTubeIdFromUrl: function getYouTubeIdFromUrl(url) {

		if (url === undefined || url === null || !url.trim().length) {
			return null;
		}

		var parts = url.split('?');
		url = parts[0];
		return url.substring(url.lastIndexOf('/') + 1);
	},

	getYouTubeNoCookieUrl: function getYouTubeNoCookieUrl(url) {
		if (url === undefined || url === null || !url.trim().length || url.indexOf('//www.youtube') === -1) {
			return url;
		}

		var parts = url.split('/');
		parts[2] = parts[2].replace('.com', '-nocookie.com');
		return parts.join('/');
	}
};

var YouTubeIframeRenderer = {
	name: 'youtube_iframe',

	options: {
		prefix: 'youtube_iframe',

		youtube: {
			autoplay: 0,
			controls: 0,
			disablekb: 1,
			end: 0,
			loop: 0,
			modestbranding: 0,
			playsinline: 0,
			rel: 0,
			showinfo: 0,
			start: 0,
			iv_load_policy: 3,

			nocookie: false,

			imageQuality: null
		}
	},

	canPlayType: function canPlayType(type) {
		return ~['video/youtube', 'video/x-youtube'].indexOf(type.toLowerCase());
	},

	create: function create(mediaElement, options, mediaFiles) {

		var youtube = {},
		    apiStack = [],
		    readyState = 4;

		var youTubeApi = null,
		    paused = true,
		    ended = false,
		    youTubeIframe = null,
		    volume = 1;

		youtube.options = options;
		youtube.id = mediaElement.id + '_' + options.prefix;
		youtube.mediaElement = mediaElement;

		var props = _mejs2.default.html5media.properties,
		    assignGettersSetters = function assignGettersSetters(propName) {

			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

			youtube['get' + capName] = function () {
				if (youTubeApi !== null) {
					var value = null;

					switch (propName) {
						case 'currentTime':
							return youTubeApi.getCurrentTime();
						case 'duration':
							return youTubeApi.getDuration();
						case 'volume':
							volume = youTubeApi.getVolume() / 100;
							return volume;
						case 'paused':
							return paused;
						case 'ended':
							return ended;
						case 'muted':
							return youTubeApi.isMuted();
						case 'buffered':
							var percentLoaded = youTubeApi.getVideoLoadedFraction(),
							    duration = youTubeApi.getDuration();
							return {
								start: function start() {
									return 0;
								},
								end: function end() {
									return percentLoaded * duration;
								},
								length: 1
							};
						case 'src':
							return youTubeApi.getVideoUrl();
						case 'readyState':
							return readyState;
					}

					return value;
				} else {
					return null;
				}
			};

			youtube['set' + capName] = function (value) {
				if (youTubeApi !== null) {
					switch (propName) {
						case 'src':
							var url = typeof value === 'string' ? value : value[0].src,
							    _videoId = YouTubeApi.getYouTubeId(url);

							if (mediaElement.originalNode.autoplay) {
								youTubeApi.loadVideoById(_videoId);
							} else {
								youTubeApi.cueVideoById(_videoId);
							}
							break;
						case 'currentTime':
							youTubeApi.seekTo(value);
							break;
						case 'muted':
							if (value) {
								youTubeApi.mute();
							} else {
								youTubeApi.unMute();
							}
							setTimeout(function () {
								var event = (0, _general.createEvent)('volumechange', youtube);
								mediaElement.dispatchEvent(event);
							}, 50);
							break;
						case 'volume':
							volume = value;
							youTubeApi.setVolume(value * 100);
							setTimeout(function () {
								var event = (0, _general.createEvent)('volumechange', youtube);
								mediaElement.dispatchEvent(event);
							}, 50);
							break;
						case 'readyState':
							var event = (0, _general.createEvent)('canplay', youtube);
							mediaElement.dispatchEvent(event);
							break;
						default:
							
							break;
					}
				} else {
					apiStack.push({ type: 'set', propName: propName, value: value });
				}
			};
		};

		for (var i = 0, total = props.length; i < total; i++) {
			assignGettersSetters(props[i]);
		}

		var methods = _mejs2.default.html5media.methods,
		    assignMethods = function assignMethods(methodName) {
			youtube[methodName] = function () {
				if (youTubeApi !== null) {
					switch (methodName) {
						case 'play':
							paused = false;
							return youTubeApi.playVideo();
						case 'pause':
							paused = true;
							return youTubeApi.pauseVideo();
						case 'load':
							return null;
					}
				} else {
					apiStack.push({ type: 'call', methodName: methodName });
				}
			};
		};

		for (var _i = 0, _total = methods.length; _i < _total; _i++) {
			assignMethods(methods[_i]);
		}

		var youtubeContainer = _document2.default.createElement('div');
		youtubeContainer.id = youtube.id;

		if (youtube.options.youtube.nocookie) {
			mediaElement.originalNode.src = YouTubeApi.getYouTubeNoCookieUrl(mediaFiles[0].src);
		}

		mediaElement.originalNode.parentNode.insertBefore(youtubeContainer, mediaElement.originalNode);
		mediaElement.originalNode.style.display = 'none';

		var isAudio = mediaElement.originalNode.tagName.toLowerCase() === 'audio',
		    height = isAudio ? '1' : mediaElement.originalNode.height,
		    width = isAudio ? '1' : mediaElement.originalNode.width,
		    videoId = YouTubeApi.getYouTubeId(mediaFiles[0].src),
		    youtubeSettings = {
			id: youtube.id,
			containerId: youtubeContainer.id,
			videoId: videoId,
			height: height,
			width: width,
			playerVars: Object.assign({
				controls: 0,
				rel: 0,
				disablekb: 1,
				showinfo: 0,
				modestbranding: 0,
				html5: 1,
				iv_load_policy: 3
			}, youtube.options.youtube),
			origin: _window2.default.location.host,
			events: {
				onReady: function onReady(e) {
					mediaElement.youTubeApi = youTubeApi = e.target;
					mediaElement.youTubeState = {
						paused: true,
						ended: false
					};

					if (apiStack.length) {
						for (var _i2 = 0, _total2 = apiStack.length; _i2 < _total2; _i2++) {

							var stackItem = apiStack[_i2];

							if (stackItem.type === 'set') {
								var propName = stackItem.propName,
								    capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

								youtube['set' + capName](stackItem.value);
							} else if (stackItem.type === 'call') {
								youtube[stackItem.methodName]();
							}
						}
					}

					youTubeIframe = youTubeApi.getIframe();

					if (mediaElement.originalNode.muted) {
						youTubeApi.mute();
					}

					var events = ['mouseover', 'mouseout'],
					    assignEvents = function assignEvents(e) {
						var newEvent = (0, _general.createEvent)(e.type, youtube);
						mediaElement.dispatchEvent(newEvent);
					};

					for (var _i3 = 0, _total3 = events.length; _i3 < _total3; _i3++) {
						youTubeIframe.addEventListener(events[_i3], assignEvents, false);
					}

					var initEvents = ['rendererready', 'loadedmetadata', 'loadeddata', 'canplay'];

					for (var _i4 = 0, _total4 = initEvents.length; _i4 < _total4; _i4++) {
						var event = (0, _general.createEvent)(initEvents[_i4], youtube);
						mediaElement.dispatchEvent(event);
					}
				},
				onStateChange: function onStateChange(e) {
					var events = [];

					switch (e.data) {
						case -1:
							events = ['loadedmetadata'];
							paused = true;
							ended = false;
							break;
						case 0:
							events = ['ended'];
							paused = false;
							ended = !youtube.options.youtube.loop;
							if (!youtube.options.youtube.loop) {
								youtube.stopInterval();
							}
							break;
						case 1:
							events = ['play', 'playing'];
							paused = false;
							ended = false;
							youtube.startInterval();
							break;
						case 2:
							events = ['pause'];
							paused = true;
							ended = false;
							youtube.stopInterval();
							break;
						case 3:
							events = ['progress'];
							ended = false;
							break;
						case 5:
							events = ['loadeddata', 'loadedmetadata', 'canplay'];
							paused = true;
							ended = false;
							break;
					}

					for (var _i5 = 0, _total5 = events.length; _i5 < _total5; _i5++) {
						var event = (0, _general.createEvent)(events[_i5], youtube);
						mediaElement.dispatchEvent(event);
					}
				},
				onError: function onError(e) {
					var event = (0, _general.createEvent)('error', youtube);
					event.data = e.data;
					mediaElement.dispatchEvent(event);
				}
			}
		};

		if (isAudio || mediaElement.originalNode.hasAttribute('playsinline')) {
			youtubeSettings.playerVars.playsinline = 1;
		}

		if (mediaElement.originalNode.controls) {
			youtubeSettings.playerVars.controls = 1;
		}
		if (mediaElement.originalNode.autoplay) {
			youtubeSettings.playerVars.autoplay = 1;
		}
		if (mediaElement.originalNode.loop) {
			youtubeSettings.playerVars.loop = 1;
		}

		YouTubeApi.enqueueIframe(youtubeSettings);

		youtube.onEvent = function (eventName, player, _youTubeState) {
			if (_youTubeState !== null && _youTubeState !== undefined) {
				mediaElement.youTubeState = _youTubeState;
			}
		};

		youtube.setSize = function (width, height) {
			if (youTubeApi !== null) {
				youTubeApi.setSize(width, height);
			}
		};
		youtube.hide = function () {
			youtube.stopInterval();
			youtube.pause();
			if (youTubeIframe) {
				youTubeIframe.style.display = 'none';
			}
		};
		youtube.show = function () {
			if (youTubeIframe) {
				youTubeIframe.style.display = '';
			}
		};
		youtube.destroy = function () {
			youTubeApi.destroy();
		};
		youtube.interval = null;

		youtube.startInterval = function () {
			youtube.interval = setInterval(function () {
				var event = (0, _general.createEvent)('timeupdate', youtube);
				mediaElement.dispatchEvent(event);
			}, 250);
		};
		youtube.stopInterval = function () {
			if (youtube.interval) {
				clearInterval(youtube.interval);
			}
		};
		youtube.getPosterUrl = function () {
			var quality = options.youtube.imageQuality,
			    resolutions = ['default', 'hqdefault', 'mqdefault', 'sddefault', 'maxresdefault'],
			    id = YouTubeApi.getYouTubeId(mediaElement.originalNode.src);
			return quality && resolutions.indexOf(quality) > -1 && id ? 'https://img.youtube.com/vi/' + id + '/' + quality + '.jpg' : '';
		};

		return youtube;
	}
};

_window2.default.onYouTubePlayerAPIReady = function () {
	YouTubeApi.iFrameReady();
};

_media.typeChecks.push(function (url) {
	return (/\/\/(www\.youtube|youtu\.?be)/i.test(url) ? 'video/x-youtube' : null
	);
});

_renderer.renderer.add(YouTubeIframeRenderer);

},{"2":2,"26":26,"27":27,"28":28,"3":3,"7":7,"8":8}],25:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.cancelFullScreen = exports.requestFullScreen = exports.isFullScreen = exports.FULLSCREEN_EVENT_NAME = exports.HAS_NATIVE_FULLSCREEN_ENABLED = exports.HAS_TRUE_NATIVE_FULLSCREEN = exports.HAS_IOS_FULLSCREEN = exports.HAS_MS_NATIVE_FULLSCREEN = exports.HAS_MOZ_NATIVE_FULLSCREEN = exports.HAS_WEBKIT_NATIVE_FULLSCREEN = exports.HAS_NATIVE_FULLSCREEN = exports.SUPPORTS_NATIVE_HLS = exports.SUPPORT_PASSIVE_EVENT = exports.SUPPORT_POINTER_EVENTS = exports.HAS_MSE = exports.IS_STOCK_ANDROID = exports.IS_SAFARI = exports.IS_FIREFOX = exports.IS_CHROME = exports.IS_EDGE = exports.IS_IE = exports.IS_ANDROID = exports.IS_IOS = exports.IS_IPOD = exports.IS_IPHONE = exports.IS_IPAD = exports.UA = exports.NAV = undefined;

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(7);

var _mejs2 = _interopRequireDefault(_mejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var NAV = exports.NAV = _window2.default.navigator;
var UA = exports.UA = NAV.userAgent.toLowerCase();
var IS_IPAD = exports.IS_IPAD = /ipad/i.test(UA) && !_window2.default.MSStream;
var IS_IPHONE = exports.IS_IPHONE = /iphone/i.test(UA) && !_window2.default.MSStream;
var IS_IPOD = exports.IS_IPOD = /ipod/i.test(UA) && !_window2.default.MSStream;
var IS_IOS = exports.IS_IOS = /ipad|iphone|ipod/i.test(UA) && !_window2.default.MSStream;
var IS_ANDROID = exports.IS_ANDROID = /android/i.test(UA);
var IS_IE = exports.IS_IE = /(trident|microsoft)/i.test(NAV.appName);
var IS_EDGE = exports.IS_EDGE = 'msLaunchUri' in NAV && !('documentMode' in _document2.default);
var IS_CHROME = exports.IS_CHROME = /chrome/i.test(UA);
var IS_FIREFOX = exports.IS_FIREFOX = /firefox/i.test(UA);
var IS_SAFARI = exports.IS_SAFARI = /safari/i.test(UA) && !IS_CHROME;
var IS_STOCK_ANDROID = exports.IS_STOCK_ANDROID = /^mozilla\/\d+\.\d+\s\(linux;\su;/i.test(UA);
var HAS_MSE = exports.HAS_MSE = 'MediaSource' in _window2.default;
var SUPPORT_POINTER_EVENTS = exports.SUPPORT_POINTER_EVENTS = function () {
	var element = _document2.default.createElement('x'),
	    documentElement = _document2.default.documentElement,
	    getComputedStyle = _window2.default.getComputedStyle;

	if (!('pointerEvents' in element.style)) {
		return false;
	}

	element.style.pointerEvents = 'auto';
	element.style.pointerEvents = 'x';
	documentElement.appendChild(element);
	var supports = getComputedStyle && getComputedStyle(element, '').pointerEvents === 'auto';
	element.remove();
	return !!supports;
}();

var SUPPORT_PASSIVE_EVENT = exports.SUPPORT_PASSIVE_EVENT = function () {
	var supportsPassive = false;
	try {
		var opts = Object.defineProperty({}, 'passive', {
			get: function get() {
				supportsPassive = true;
			}
		});
		_window2.default.addEventListener('test', null, opts);
	} catch (e) {}

	return supportsPassive;
}();

var html5Elements = ['source', 'track', 'audio', 'video'];
var video = void 0;

for (var i = 0, total = html5Elements.length; i < total; i++) {
	video = _document2.default.createElement(html5Elements[i]);
}

var SUPPORTS_NATIVE_HLS = exports.SUPPORTS_NATIVE_HLS = IS_SAFARI || IS_ANDROID && (IS_CHROME || IS_STOCK_ANDROID) || IS_IE && /edge/i.test(UA);

var hasiOSFullScreen = video.webkitEnterFullscreen !== undefined;

var hasNativeFullscreen = video.requestFullscreen !== undefined;

if (hasiOSFullScreen && /mac os x 10_5/i.test(UA)) {
	hasNativeFullscreen = false;
	hasiOSFullScreen = false;
}

var hasWebkitNativeFullScreen = video.webkitRequestFullScreen !== undefined;
var hasMozNativeFullScreen = video.mozRequestFullScreen !== undefined;
var hasMsNativeFullScreen = video.msRequestFullscreen !== undefined;
var hasTrueNativeFullScreen = hasWebkitNativeFullScreen || hasMozNativeFullScreen || hasMsNativeFullScreen;
var nativeFullScreenEnabled = hasTrueNativeFullScreen;
var fullScreenEventName = '';
var isFullScreen = void 0,
    requestFullScreen = void 0,
    cancelFullScreen = void 0;

if (hasMozNativeFullScreen) {
	nativeFullScreenEnabled = _document2.default.mozFullScreenEnabled;
} else if (hasMsNativeFullScreen) {
	nativeFullScreenEnabled = _document2.default.msFullscreenEnabled;
}

if (IS_CHROME) {
	hasiOSFullScreen = false;
}

if (hasTrueNativeFullScreen) {
	if (hasWebkitNativeFullScreen) {
		fullScreenEventName = 'webkitfullscreenchange';
	} else if (hasMozNativeFullScreen) {
		fullScreenEventName = 'mozfullscreenchange';
	} else if (hasMsNativeFullScreen) {
		fullScreenEventName = 'MSFullscreenChange';
	}

	exports.isFullScreen = isFullScreen = function isFullScreen() {
		if (hasMozNativeFullScreen) {
			return _document2.default.mozFullScreen;
		} else if (hasWebkitNativeFullScreen) {
			return _document2.default.webkitIsFullScreen;
		} else if (hasMsNativeFullScreen) {
			return _document2.default.msFullscreenElement !== null;
		}
	};

	exports.requestFullScreen = requestFullScreen = function requestFullScreen(el) {
		if (hasWebkitNativeFullScreen) {
			el.webkitRequestFullScreen();
		} else if (hasMozNativeFullScreen) {
			el.mozRequestFullScreen();
		} else if (hasMsNativeFullScreen) {
			el.msRequestFullscreen();
		}
	};

	exports.cancelFullScreen = cancelFullScreen = function cancelFullScreen() {
		if (hasWebkitNativeFullScreen) {
			_document2.default.webkitCancelFullScreen();
		} else if (hasMozNativeFullScreen) {
			_document2.default.mozCancelFullScreen();
		} else if (hasMsNativeFullScreen) {
			_document2.default.msExitFullscreen();
		}
	};
}

var HAS_NATIVE_FULLSCREEN = exports.HAS_NATIVE_FULLSCREEN = hasNativeFullscreen;
var HAS_WEBKIT_NATIVE_FULLSCREEN = exports.HAS_WEBKIT_NATIVE_FULLSCREEN = hasWebkitNativeFullScreen;
var HAS_MOZ_NATIVE_FULLSCREEN = exports.HAS_MOZ_NATIVE_FULLSCREEN = hasMozNativeFullScreen;
var HAS_MS_NATIVE_FULLSCREEN = exports.HAS_MS_NATIVE_FULLSCREEN = hasMsNativeFullScreen;
var HAS_IOS_FULLSCREEN = exports.HAS_IOS_FULLSCREEN = hasiOSFullScreen;
var HAS_TRUE_NATIVE_FULLSCREEN = exports.HAS_TRUE_NATIVE_FULLSCREEN = hasTrueNativeFullScreen;
var HAS_NATIVE_FULLSCREEN_ENABLED = exports.HAS_NATIVE_FULLSCREEN_ENABLED = nativeFullScreenEnabled;
var FULLSCREEN_EVENT_NAME = exports.FULLSCREEN_EVENT_NAME = fullScreenEventName;
exports.isFullScreen = isFullScreen;
exports.requestFullScreen = requestFullScreen;
exports.cancelFullScreen = cancelFullScreen;


_mejs2.default.Features = _mejs2.default.Features || {};
_mejs2.default.Features.isiPad = IS_IPAD;
_mejs2.default.Features.isiPod = IS_IPOD;
_mejs2.default.Features.isiPhone = IS_IPHONE;
_mejs2.default.Features.isiOS = _mejs2.default.Features.isiPhone || _mejs2.default.Features.isiPad;
_mejs2.default.Features.isAndroid = IS_ANDROID;
_mejs2.default.Features.isIE = IS_IE;
_mejs2.default.Features.isEdge = IS_EDGE;
_mejs2.default.Features.isChrome = IS_CHROME;
_mejs2.default.Features.isFirefox = IS_FIREFOX;
_mejs2.default.Features.isSafari = IS_SAFARI;
_mejs2.default.Features.isStockAndroid = IS_STOCK_ANDROID;
_mejs2.default.Features.hasMSE = HAS_MSE;
_mejs2.default.Features.supportsNativeHLS = SUPPORTS_NATIVE_HLS;
_mejs2.default.Features.supportsPointerEvents = SUPPORT_POINTER_EVENTS;
_mejs2.default.Features.supportsPassiveEvent = SUPPORT_PASSIVE_EVENT;
_mejs2.default.Features.hasiOSFullScreen = HAS_IOS_FULLSCREEN;
_mejs2.default.Features.hasNativeFullscreen = HAS_NATIVE_FULLSCREEN;
_mejs2.default.Features.hasWebkitNativeFullScreen = HAS_WEBKIT_NATIVE_FULLSCREEN;
_mejs2.default.Features.hasMozNativeFullScreen = HAS_MOZ_NATIVE_FULLSCREEN;
_mejs2.default.Features.hasMsNativeFullScreen = HAS_MS_NATIVE_FULLSCREEN;
_mejs2.default.Features.hasTrueNativeFullScreen = HAS_TRUE_NATIVE_FULLSCREEN;
_mejs2.default.Features.nativeFullScreenEnabled = HAS_NATIVE_FULLSCREEN_ENABLED;
_mejs2.default.Features.fullScreenEventName = FULLSCREEN_EVENT_NAME;
_mejs2.default.Features.isFullScreen = isFullScreen;
_mejs2.default.Features.requestFullScreen = requestFullScreen;
_mejs2.default.Features.cancelFullScreen = cancelFullScreen;

},{"2":2,"3":3,"7":7}],26:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.removeClass = exports.addClass = exports.hasClass = undefined;
exports.loadScript = loadScript;
exports.offset = offset;
exports.toggleClass = toggleClass;
exports.fadeOut = fadeOut;
exports.fadeIn = fadeIn;
exports.siblings = siblings;
exports.visible = visible;
exports.ajax = ajax;

var _window = _dereq_(3);

var _window2 = _interopRequireDefault(_window);

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _mejs = _dereq_(7);

var _mejs2 = _interopRequireDefault(_mejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function loadScript(url) {
	return new Promise(function (resolve, reject) {
		var script = _document2.default.createElement('script');
		script.src = url;
		script.async = true;
		script.onload = function () {
			script.remove();
			resolve();
		};
		script.onerror = function () {
			script.remove();
			reject();
		};
		_document2.default.head.appendChild(script);
	});
}

function offset(el) {
	var rect = el.getBoundingClientRect(),
	    scrollLeft = _window2.default.pageXOffset || _document2.default.documentElement.scrollLeft,
	    scrollTop = _window2.default.pageYOffset || _document2.default.documentElement.scrollTop;
	return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

var hasClassMethod = void 0,
    addClassMethod = void 0,
    removeClassMethod = void 0;

if ('classList' in _document2.default.documentElement) {
	hasClassMethod = function hasClassMethod(el, className) {
		return el.classList !== undefined && el.classList.contains(className);
	};
	addClassMethod = function addClassMethod(el, className) {
		return el.classList.add(className);
	};
	removeClassMethod = function removeClassMethod(el, className) {
		return el.classList.remove(className);
	};
} else {
	hasClassMethod = function hasClassMethod(el, className) {
		return new RegExp('\\b' + className + '\\b').test(el.className);
	};
	addClassMethod = function addClassMethod(el, className) {
		if (!hasClass(el, className)) {
			el.className += ' ' + className;
		}
	};
	removeClassMethod = function removeClassMethod(el, className) {
		el.className = el.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
	};
}

var hasClass = exports.hasClass = hasClassMethod;
var addClass = exports.addClass = addClassMethod;
var removeClass = exports.removeClass = removeClassMethod;

function toggleClass(el, className) {
	hasClass(el, className) ? removeClass(el, className) : addClass(el, className);
}

function fadeOut(el) {
	var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 400;
	var callback = arguments[2];

	if (!el.style.opacity) {
		el.style.opacity = 1;
	}

	var start = null;
	_window2.default.requestAnimationFrame(function animate(timestamp) {
		start = start || timestamp;
		var progress = timestamp - start;
		var opacity = parseFloat(1 - progress / duration, 2);
		el.style.opacity = opacity < 0 ? 0 : opacity;
		if (progress > duration) {
			if (callback && typeof callback === 'function') {
				callback();
			}
		} else {
			_window2.default.requestAnimationFrame(animate);
		}
	});
}

function fadeIn(el) {
	var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 400;
	var callback = arguments[2];

	if (!el.style.opacity) {
		el.style.opacity = 0;
	}

	var start = null;
	_window2.default.requestAnimationFrame(function animate(timestamp) {
		start = start || timestamp;
		var progress = timestamp - start;
		var opacity = parseFloat(progress / duration, 2);
		el.style.opacity = opacity > 1 ? 1 : opacity;
		if (progress > duration) {
			if (callback && typeof callback === 'function') {
				callback();
			}
		} else {
			_window2.default.requestAnimationFrame(animate);
		}
	});
}

function siblings(el, filter) {
	var siblings = [];
	el = el.parentNode.firstChild;
	do {
		if (!filter || filter(el)) {
			siblings.push(el);
		}
	} while (el = el.nextSibling);
	return siblings;
}

function visible(elem) {
	if (elem.getClientRects !== undefined && elem.getClientRects === 'function') {
		return !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
	}
	return !!(elem.offsetWidth || elem.offsetHeight);
}

function ajax(url, dataType, success, error) {
	var xhr = _window2.default.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');

	var type = 'application/x-www-form-urlencoded; charset=UTF-8',
	    completed = false,
	    accept = '*/'.concat('*');

	switch (dataType) {
		case 'text':
			type = 'text/plain';
			break;
		case 'json':
			type = 'application/json, text/javascript';
			break;
		case 'html':
			type = 'text/html';
			break;
		case 'xml':
			type = 'application/xml, text/xml';
			break;
	}

	if (type !== 'application/x-www-form-urlencoded') {
		accept = type + ', */*; q=0.01';
	}

	if (xhr) {
		xhr.open('GET', url, true);
		xhr.setRequestHeader('Accept', accept);
		xhr.onreadystatechange = function () {
			if (completed) {
				return;
			}

			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					completed = true;
					var data = void 0;
					switch (dataType) {
						case 'json':
							data = JSON.parse(xhr.responseText);
							break;
						case 'xml':
							data = xhr.responseXML;
							break;
						default:
							data = xhr.responseText;
							break;
					}
					success(data);
				} else if (typeof error === 'function') {
					error(xhr.status);
				}
			}
		};

		xhr.send();
	}
}

_mejs2.default.Utils = _mejs2.default.Utils || {};
_mejs2.default.Utils.offset = offset;
_mejs2.default.Utils.hasClass = hasClass;
_mejs2.default.Utils.addClass = addClass;
_mejs2.default.Utils.removeClass = removeClass;
_mejs2.default.Utils.toggleClass = toggleClass;
_mejs2.default.Utils.fadeIn = fadeIn;
_mejs2.default.Utils.fadeOut = fadeOut;
_mejs2.default.Utils.siblings = siblings;
_mejs2.default.Utils.visible = visible;
_mejs2.default.Utils.ajax = ajax;
_mejs2.default.Utils.loadScript = loadScript;

},{"2":2,"3":3,"7":7}],27:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.escapeHTML = escapeHTML;
exports.debounce = debounce;
exports.isObjectEmpty = isObjectEmpty;
exports.splitEvents = splitEvents;
exports.createEvent = createEvent;
exports.isNodeAfter = isNodeAfter;
exports.isString = isString;

var _mejs = _dereq_(7);

var _mejs2 = _interopRequireDefault(_mejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function escapeHTML(input) {

	if (typeof input !== 'string') {
		throw new Error('Argument passed must be a string');
	}

	var map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;'
	};

	return input.replace(/[&<>"]/g, function (c) {
		return map[c];
	});
}

function debounce(func, wait) {
	var _this = this,
	    _arguments = arguments;

	var immediate = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;


	if (typeof func !== 'function') {
		throw new Error('First argument must be a function');
	}

	if (typeof wait !== 'number') {
		throw new Error('Second argument must be a numeric value');
	}

	var timeout = void 0;
	return function () {
		var context = _this,
		    args = _arguments;
		var later = function later() {
			timeout = null;
			if (!immediate) {
				func.apply(context, args);
			}
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);

		if (callNow) {
			func.apply(context, args);
		}
	};
}

function isObjectEmpty(instance) {
	return Object.getOwnPropertyNames(instance).length <= 0;
}

function splitEvents(events, id) {
	var rwindow = /^((after|before)print|(before)?unload|hashchange|message|o(ff|n)line|page(hide|show)|popstate|resize|storage)\b/;

	var ret = { d: [], w: [] };
	(events || '').split(' ').forEach(function (v) {
		var eventName = '' + v + (id ? '.' + id : '');

		if (eventName.startsWith('.')) {
			ret.d.push(eventName);
			ret.w.push(eventName);
		} else {
			ret[rwindow.test(v) ? 'w' : 'd'].push(eventName);
		}
	});

	ret.d = ret.d.join(' ');
	ret.w = ret.w.join(' ');
	return ret;
}

function createEvent(eventName, target) {

	if (typeof eventName !== 'string') {
		throw new Error('Event name must be a string');
	}

	var eventFrags = eventName.match(/([a-z]+\.([a-z]+))/i),
	    detail = {
		target: target
	};

	if (eventFrags !== null) {
		eventName = eventFrags[1];
		detail.namespace = eventFrags[2];
	}

	return new window.CustomEvent(eventName, {
		detail: detail
	});
}

function isNodeAfter(sourceNode, targetNode) {

	return !!(sourceNode && targetNode && sourceNode.compareDocumentPosition(targetNode) & 2);
}

function isString(value) {
	return typeof value === 'string';
}

_mejs2.default.Utils = _mejs2.default.Utils || {};
_mejs2.default.Utils.escapeHTML = escapeHTML;
_mejs2.default.Utils.debounce = debounce;
_mejs2.default.Utils.isObjectEmpty = isObjectEmpty;
_mejs2.default.Utils.splitEvents = splitEvents;
_mejs2.default.Utils.createEvent = createEvent;
_mejs2.default.Utils.isNodeAfter = isNodeAfter;
_mejs2.default.Utils.isString = isString;

},{"7":7}],28:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.typeChecks = undefined;
exports.absolutizeUrl = absolutizeUrl;
exports.formatType = formatType;
exports.getMimeFromType = getMimeFromType;
exports.getTypeFromFile = getTypeFromFile;
exports.getExtension = getExtension;
exports.normalizeExtension = normalizeExtension;

var _mejs = _dereq_(7);

var _mejs2 = _interopRequireDefault(_mejs);

var _general = _dereq_(27);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var typeChecks = exports.typeChecks = [];

function absolutizeUrl(url) {

	if (typeof url !== 'string') {
		throw new Error('`url` argument must be a string');
	}

	var el = document.createElement('div');
	el.innerHTML = '<a href="' + (0, _general.escapeHTML)(url) + '">x</a>';
	return el.firstChild.href;
}

function formatType(url) {
	var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	return url && !type ? getTypeFromFile(url) : type;
}

function getMimeFromType(type) {

	if (typeof type !== 'string') {
		throw new Error('`type` argument must be a string');
	}

	return type && type.indexOf(';') > -1 ? type.substr(0, type.indexOf(';')) : type;
}

function getTypeFromFile(url) {

	if (typeof url !== 'string') {
		throw new Error('`url` argument must be a string');
	}

	for (var i = 0, total = typeChecks.length; i < total; i++) {
		var type = typeChecks[i](url);

		if (type) {
			return type;
		}
	}

	var ext = getExtension(url),
	    normalizedExt = normalizeExtension(ext);

	var mime = 'video/mp4';

	if (normalizedExt) {
		if (~['mp4', 'm4v', 'ogg', 'ogv', 'webm', 'flv', 'mpeg', 'mov'].indexOf(normalizedExt)) {
			mime = 'video/' + normalizedExt;
		} else if (~['mp3', 'oga', 'wav', 'mid', 'midi'].indexOf(normalizedExt)) {
			mime = 'audio/' + normalizedExt;
		}
	}

	return mime;
}

function getExtension(url) {

	if (typeof url !== 'string') {
		throw new Error('`url` argument must be a string');
	}

	var baseUrl = url.split('?')[0],
	    baseName = baseUrl.split('\\').pop().split('/').pop();
	return ~baseName.indexOf('.') ? baseName.substring(baseName.lastIndexOf('.') + 1) : '';
}

function normalizeExtension(extension) {

	if (typeof extension !== 'string') {
		throw new Error('`extension` argument must be a string');
	}

	switch (extension) {
		case 'mp4':
		case 'm4v':
			return 'mp4';
		case 'webm':
		case 'webma':
		case 'webmv':
			return 'webm';
		case 'ogg':
		case 'oga':
		case 'ogv':
			return 'ogg';
		default:
			return extension;
	}
}

_mejs2.default.Utils = _mejs2.default.Utils || {};
_mejs2.default.Utils.typeChecks = typeChecks;
_mejs2.default.Utils.absolutizeUrl = absolutizeUrl;
_mejs2.default.Utils.formatType = formatType;
_mejs2.default.Utils.getMimeFromType = getMimeFromType;
_mejs2.default.Utils.getTypeFromFile = getTypeFromFile;
_mejs2.default.Utils.getExtension = getExtension;
_mejs2.default.Utils.normalizeExtension = normalizeExtension;

},{"27":27,"7":7}],29:[function(_dereq_,module,exports){
'use strict';

var _document = _dereq_(2);

var _document2 = _interopRequireDefault(_document);

var _promisePolyfill = _dereq_(4);

var _promisePolyfill2 = _interopRequireDefault(_promisePolyfill);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function (arr) {
	arr.forEach(function (item) {
		if (item.hasOwnProperty('remove')) {
			return;
		}
		Object.defineProperty(item, 'remove', {
			configurable: true,
			enumerable: true,
			writable: true,
			value: function remove() {
				this.parentNode.removeChild(this);
			}
		});
	});
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

(function () {

	if (typeof window.CustomEvent === 'function') {
		return false;
	}

	function CustomEvent(event, params) {
		params = params || { bubbles: false, cancelable: false, detail: undefined };
		var evt = _document2.default.createEvent('CustomEvent');
		evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
		return evt;
	}

	CustomEvent.prototype = window.Event.prototype;
	window.CustomEvent = CustomEvent;
})();

if (typeof Object.assign !== 'function') {
	Object.assign = function (target) {

		if (target === null || target === undefined) {
			throw new TypeError('Cannot convert undefined or null to object');
		}

		var to = Object(target);

		for (var index = 1, total = arguments.length; index < total; index++) {
			var nextSource = arguments[index];

			if (nextSource !== null) {
				for (var nextKey in nextSource) {
					if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
						to[nextKey] = nextSource[nextKey];
					}
				}
			}
		}
		return to;
	};
}

if (!String.prototype.startsWith) {
	String.prototype.startsWith = function (searchString, position) {
		position = position || 0;
		return this.substr(position, searchString.length) === searchString;
	};
}

if (!Element.prototype.matches) {
	Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
		var matches = (this.document || this.ownerDocument).querySelectorAll(s),
		    i = matches.length - 1;
		while (--i >= 0 && matches.item(i) !== this) {}
		return i > -1;
	};
}

if (window.Element && !Element.prototype.closest) {
	Element.prototype.closest = function (s) {
		var matches = (this.document || this.ownerDocument).querySelectorAll(s),
		    i = void 0,
		    el = this;
		do {
			i = matches.length;
			while (--i >= 0 && matches.item(i) !== el) {}
		} while (i < 0 && (el = el.parentElement));
		return el;
	};
}

(function () {
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}

	if (!window.requestAnimationFrame) window.requestAnimationFrame = function (callback) {
		var currTime = new Date().getTime();
		var timeToCall = Math.max(0, 16 - (currTime - lastTime));
		var id = window.setTimeout(function () {
			callback(currTime + timeToCall);
		}, timeToCall);
		lastTime = currTime + timeToCall;
		return id;
	};

	if (!window.cancelAnimationFrame) window.cancelAnimationFrame = function (id) {
		clearTimeout(id);
	};
})();

if (/firefox/i.test(navigator.userAgent)) {
	var getComputedStyle = window.getComputedStyle;
	window.getComputedStyle = function (el, pseudoEl) {
		var t = getComputedStyle(el, pseudoEl);
		return t === null ? { getPropertyValue: function getPropertyValue() {} } : t;
	};
}

if (!window.Promise) {
	window.Promise = _promisePolyfill2.default;
}

(function (constructor) {
	if (constructor && constructor.prototype && constructor.prototype.children === null) {
		Object.defineProperty(constructor.prototype, 'children', {
			get: function get() {
				var i = 0,
				    node = void 0,
				    nodes = this.childNodes,
				    children = [];
				while (node = nodes[i++]) {
					if (node.nodeType === 1) {
						children.push(node);
					}
				}
				return children;
			}
		});
	}
})(window.Node || window.Element);

},{"2":2,"4":4}],30:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.isDropFrame = isDropFrame;
exports.secondsToTimeCode = secondsToTimeCode;
exports.timeCodeToSeconds = timeCodeToSeconds;
exports.calculateTimeFormat = calculateTimeFormat;
exports.convertSMPTEtoSeconds = convertSMPTEtoSeconds;

var _mejs = _dereq_(7);

var _mejs2 = _interopRequireDefault(_mejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isDropFrame() {
	var fps = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 25;

	return !(fps % 1 === 0);
}
function secondsToTimeCode(time) {
	var forceHours = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	var showFrameCount = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
	var fps = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 25;
	var secondsDecimalLength = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;
	var timeFormat = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 'mm:ss';


	time = !time || typeof time !== 'number' || time < 0 ? 0 : time;

	var dropFrames = Math.round(fps * 0.066666),
	    timeBase = Math.round(fps),
	    framesPer24Hours = Math.round(fps * 3600) * 24,
	    framesPer10Minutes = Math.round(fps * 600),
	    frameSep = isDropFrame(fps) ? ';' : ':',
	    hours = void 0,
	    minutes = void 0,
	    seconds = void 0,
	    frames = void 0,
	    f = Math.round(time * fps);

	if (isDropFrame(fps)) {

		if (f < 0) {
			f = framesPer24Hours + f;
		}

		f = f % framesPer24Hours;

		var d = Math.floor(f / framesPer10Minutes);
		var m = f % framesPer10Minutes;
		f = f + dropFrames * 9 * d;
		if (m > dropFrames) {
			f = f + dropFrames * Math.floor((m - dropFrames) / Math.round(timeBase * 60 - dropFrames));
		}

		var timeBaseDivision = Math.floor(f / timeBase);

		hours = Math.floor(Math.floor(timeBaseDivision / 60) / 60);
		minutes = Math.floor(timeBaseDivision / 60) % 60;

		if (showFrameCount) {
			seconds = timeBaseDivision % 60;
		} else {
			seconds = (f / timeBase % 60).toFixed(secondsDecimalLength);
		}
	} else {
		hours = Math.floor(time / 3600) % 24;
		minutes = Math.floor(time / 60) % 60;
		if (showFrameCount) {
			seconds = Math.floor(time % 60);
		} else {
			seconds = (time % 60).toFixed(secondsDecimalLength);
		}
	}
	hours = hours <= 0 ? 0 : hours;
	minutes = minutes <= 0 ? 0 : minutes;
	seconds = seconds <= 0 ? 0 : seconds;

	var timeFormatFrags = timeFormat.split(':');
	var timeFormatSettings = {};
	for (var i = 0, total = timeFormatFrags.length; i < total; ++i) {
		var unique = '';
		for (var j = 0, t = timeFormatFrags[i].length; j < t; j++) {
			if (unique.indexOf(timeFormatFrags[i][j]) < 0) {
				unique += timeFormatFrags[i][j];
			}
		}
		if (~['f', 's', 'm', 'h'].indexOf(unique)) {
			timeFormatSettings[unique] = timeFormatFrags[i].length;
		}
	}

	var result = forceHours || hours > 0 ? (hours < 10 && timeFormatSettings.h > 1 ? '0' + hours : hours) + ':' : '';
	result += (minutes < 10 && timeFormatSettings.m > 1 ? '0' + minutes : minutes) + ':';
	result += '' + (seconds < 10 && timeFormatSettings.s > 1 ? '0' + seconds : seconds);

	if (showFrameCount) {
		frames = (f % timeBase).toFixed(0);
		frames = frames <= 0 ? 0 : frames;
		result += frames < 10 && timeFormatSettings.f ? frameSep + '0' + frames : '' + frameSep + frames;
	}

	return result;
}

function timeCodeToSeconds(time) {
	var fps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 25;


	if (typeof time !== 'string') {
		throw new TypeError('Time must be a string');
	}

	if (time.indexOf(';') > 0) {
		time = time.replace(';', ':');
	}

	if (!/\d{2}(\:\d{2}){0,3}/i.test(time)) {
		throw new TypeError('Time code must have the format `00:00:00`');
	}

	var parts = time.split(':');

	var output = void 0,
	    hours = 0,
	    minutes = 0,
	    seconds = 0,
	    frames = 0,
	    totalMinutes = 0,
	    dropFrames = Math.round(fps * 0.066666),
	    timeBase = Math.round(fps),
	    hFrames = timeBase * 3600,
	    mFrames = timeBase * 60;

	switch (parts.length) {
		default:
		case 1:
			seconds = parseInt(parts[0], 10);
			break;
		case 2:
			minutes = parseInt(parts[0], 10);
			seconds = parseInt(parts[1], 10);
			break;
		case 3:
			hours = parseInt(parts[0], 10);
			minutes = parseInt(parts[1], 10);
			seconds = parseInt(parts[2], 10);
			break;
		case 4:
			hours = parseInt(parts[0], 10);
			minutes = parseInt(parts[1], 10);
			seconds = parseInt(parts[2], 10);
			frames = parseInt(parts[3], 10);
			break;
	}

	if (isDropFrame(fps)) {
		totalMinutes = 60 * hours + minutes;
		output = hFrames * hours + mFrames * minutes + timeBase * seconds + frames - dropFrames * (totalMinutes - Math.floor(totalMinutes / 10));
	} else {
		output = (hFrames * hours + mFrames * minutes + fps * seconds + frames) / fps;
	}

	return parseFloat(output.toFixed(3));
}

function calculateTimeFormat(time, options) {
	var fps = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 25;


	time = !time || typeof time !== 'number' || time < 0 ? 0 : time;

	var hours = Math.floor(time / 3600) % 24,
	    minutes = Math.floor(time / 60) % 60,
	    seconds = Math.floor(time % 60),
	    frames = Math.floor((time % 1 * fps).toFixed(3)),
	    lis = [[frames, 'f'], [seconds, 's'], [minutes, 'm'], [hours, 'h']];

	var format = options.timeFormat,
	    firstTwoPlaces = format[1] === format[0],
	    separatorIndex = firstTwoPlaces ? 2 : 1,
	    separator = format.length < separatorIndex ? format[separatorIndex] : ':',
	    firstChar = format[0],
	    required = false;

	for (var i = 0, len = lis.length; i < len; i++) {
		if (~format.indexOf(lis[i][1])) {
			required = true;
		} else if (required) {
			var hasNextValue = false;
			for (var j = i; j < len; j++) {
				if (lis[j][0] > 0) {
					hasNextValue = true;
					break;
				}
			}

			if (!hasNextValue) {
				break;
			}

			if (!firstTwoPlaces) {
				format = firstChar + format;
			}
			format = lis[i][1] + separator + format;
			if (firstTwoPlaces) {
				format = lis[i][1] + format;
			}
			firstChar = lis[i][1];
		}
	}

	options.timeFormat = format;
}

function convertSMPTEtoSeconds(SMPTE) {

	if (typeof SMPTE !== 'string') {
		throw new TypeError('Argument must be a string value');
	}

	SMPTE = SMPTE.replace(',', '.');

	var decimalLen = ~SMPTE.indexOf('.') ? SMPTE.split('.')[1].length : 0;

	var secs = 0,
	    multiplier = 1;

	SMPTE = SMPTE.split(':').reverse();

	for (var i = 0, total = SMPTE.length; i < total; i++) {
		multiplier = 1;
		if (i > 0) {
			multiplier = Math.pow(60, i);
		}
		secs += Number(SMPTE[i]) * multiplier;
	}
	return Number(secs.toFixed(decimalLen));
}

_mejs2.default.Utils = _mejs2.default.Utils || {};
_mejs2.default.Utils.secondsToTimeCode = secondsToTimeCode;
_mejs2.default.Utils.timeCodeToSeconds = timeCodeToSeconds;
_mejs2.default.Utils.calculateTimeFormat = calculateTimeFormat;
_mejs2.default.Utils.convertSMPTEtoSeconds = convertSMPTEtoSeconds;

},{"7":7}]},{},[29,6,5,15,23,20,19,21,22,24,16,18,17,9,10,11,12,13,14]);
;
/* global console, MediaElementPlayer, mejs */
(function ( window, $ ) {
	// Reintegrate `plugins` since they don't exist in MEJS anymore; it won't affect anything in the player
	if (mejs.plugins === undefined) {
		mejs.plugins = {};
		mejs.plugins.silverlight = [];
		mejs.plugins.silverlight.push({
			types: []
		});
	}

	// Inclusion of old `HtmlMediaElementShim` if it doesn't exist
	mejs.HtmlMediaElementShim = mejs.HtmlMediaElementShim || {
		getTypeFromFile: mejs.Utils.getTypeFromFile
	};

	// Add missing global variables for backward compatibility
	if (mejs.MediaFeatures === undefined) {
		mejs.MediaFeatures = mejs.Features;
	}
	if (mejs.Utility === undefined) {
		mejs.Utility = mejs.Utils;
	}

	/**
	 * Create missing variables and have default `classPrefix` overridden to avoid issues.
	 *
	 * `media` is now a fake wrapper needed to simplify manipulation of various media types,
	 * so in order to access the `video` or `audio` tag, use `media.originalNode` or `player.node`;
	 * `player.container` used to be jQuery but now is a HTML element, and many elements inside
	 * the player rely on it being a HTML now, so its conversion is difficult; however, a
	 * `player.$container` new variable has been added to be used as jQuery object
	 */
	var init = MediaElementPlayer.prototype.init;
	MediaElementPlayer.prototype.init = function () {
		this.options.classPrefix = 'mejs-';
		this.$media = this.$node = $( this.node );
		init.call( this );
	};

	var ready = MediaElementPlayer.prototype._meReady;
	MediaElementPlayer.prototype._meReady = function () {
		this.container = $( this.container) ;
		this.controls = $( this.controls );
		this.layers = $( this.layers );
		ready.apply( this, arguments );
	};

	// Override method so certain elements can be called with jQuery
	MediaElementPlayer.prototype.getElement = function ( el ) {
		return $ !== undefined && el instanceof $ ? el[0] : el;
	};

	// Add jQuery ONLY to most of custom features' arguments for backward compatibility; default features rely 100%
	// on the arguments being HTML elements to work properly
	MediaElementPlayer.prototype.buildfeatures = function ( player, controls, layers, media ) {
		var defaultFeatures = [
			'playpause',
			'current',
			'progress',
			'duration',
			'tracks',
			'volume',
			'fullscreen'
		];
		for (var i = 0, total = this.options.features.length; i < total; i++) {
			var feature = this.options.features[i];
			if (this['build' + feature]) {
				try {
					// Use jQuery for non-default features
					if (defaultFeatures.indexOf(feature) === -1) {
						this['build' + feature]( player, $(controls), $(layers), media );
					} else {
						this['build' + feature]( player, controls, layers, media );
					}

				} catch (e) {
					console.error( 'error building ' + feature, e );
				}
			}
		}
	};

})( window, jQuery );
;
/* global _wpmejsSettings, mejsL10n */
(function( window, $ ) {

	window.wp = window.wp || {};

	function wpMediaElement() {
		var settings = {};

		/**
		 * Initialize media elements.
		 *
		 * Ensures media elements that have already been initialized won't be
		 * processed again.
		 *
		 * @since 4.4.0
		 *
		 * @returns {void}
		 */
		function initialize() {
			if ( typeof _wpmejsSettings !== 'undefined' ) {
				settings = $.extend( true, {}, _wpmejsSettings );
			}
			settings.classPrefix = 'mejs-';
			settings.success = settings.success || function ( mejs ) {
				var autoplay, loop;

				if ( mejs.rendererName && -1 !== mejs.rendererName.indexOf( 'flash' ) ) {
					autoplay = mejs.attributes.autoplay && 'false' !== mejs.attributes.autoplay;
					loop = mejs.attributes.loop && 'false' !== mejs.attributes.loop;

					if ( autoplay ) {
						mejs.addEventListener( 'canplay', function() {
							mejs.play();
						}, false );
					}

					if ( loop ) {
						mejs.addEventListener( 'ended', function() {
							mejs.play();
						}, false );
					}
				}
			};

			/**
			 * Custom error handler.
			 *
			 * Sets up a custom error handler in case a video render fails, and provides a download
			 * link as the fallback.
			 *
			 * @since 4.9.3
			 *
			 * @param {object} media The wrapper that mimics all the native events/properties/methods for all renderers.
			 * @param {object} node  The original HTML video, audio, or iframe tag where the media was loaded.
			 * @returns {string}
			 */
			settings.customError = function ( media, node ) {
				// Make sure we only fall back to a download link for flash files.
				if ( -1 !== media.rendererName.indexOf( 'flash' ) || -1 !== media.rendererName.indexOf( 'flv' ) ) {
					return '<a href="' + node.src + '">' + mejsL10n.strings['mejs.download-video'] + '</a>';
				}
			};

			// Only initialize new media elements.
			$( '.wp-audio-shortcode, .wp-video-shortcode' )
				.not( '.mejs-container' )
				.filter(function () {
					return ! $( this ).parent().hasClass( 'mejs-mediaelement' );
				})
				.mediaelementplayer( settings );
		}

		return {
			initialize: initialize
		};
	}

	window.wp.mediaelement = new wpMediaElement();

	$( window.wp.mediaelement.initialize );

})( window, jQuery );
;
/*!
 * MediaElement.js
 * http://www.mediaelementjs.com/
 *
 * Wrapper that mimics native HTML5 MediaElement (audio and video)
 * using a variety of technologies (pure JavaScript, Flash, iframe)
 *
 * Copyright 2010-2017, John Dyer (http://j.hn/)
 * License: MIT
 *
 */(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

var VimeoApi = {

	promise: null,

	load: function load(settings) {

		if (typeof Vimeo !== 'undefined') {
			VimeoApi._createPlayer(settings);
		} else {
			VimeoApi.promise = VimeoApi.promise || mejs.Utils.loadScript('https://player.vimeo.com/api/player.js');
			VimeoApi.promise.then(function () {
				VimeoApi._createPlayer(settings);
			});
		}
	},

	_createPlayer: function _createPlayer(settings) {
		var player = new Vimeo.Player(settings.iframe);
		window['__ready__' + settings.id](player);
	},

	getVimeoId: function getVimeoId(url) {
		if (url === undefined || url === null) {
			return null;
		}

		var parts = url.split('?');
		url = parts[0];
		return parseInt(url.substring(url.lastIndexOf('/') + 1), 10);
	}
};

var vimeoIframeRenderer = {

	name: 'vimeo_iframe',
	options: {
		prefix: 'vimeo_iframe'
	},

	canPlayType: function canPlayType(type) {
		return ~['video/vimeo', 'video/x-vimeo'].indexOf(type.toLowerCase());
	},

	create: function create(mediaElement, options, mediaFiles) {
		var apiStack = [],
		    vimeo = {},
		    readyState = 4;

		var paused = true,
		    volume = 1,
		    oldVolume = volume,
		    currentTime = 0,
		    bufferedTime = 0,
		    ended = false,
		    duration = 0,
		    vimeoPlayer = null,
		    url = '';

		vimeo.options = options;
		vimeo.id = mediaElement.id + '_' + options.prefix;
		vimeo.mediaElement = mediaElement;

		var errorHandler = function errorHandler(error, target) {
			var event = mejs.Utils.createEvent('error', target);
			event.message = error.name + ': ' + error.message;
			mediaElement.dispatchEvent(event);
		};

		var props = mejs.html5media.properties,
		    assignGettersSetters = function assignGettersSetters(propName) {

			var capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

			vimeo['get' + capName] = function () {
				if (vimeoPlayer !== null) {
					var value = null;

					switch (propName) {
						case 'currentTime':
							return currentTime;

						case 'duration':
							return duration;

						case 'volume':
							return volume;
						case 'muted':
							return volume === 0;
						case 'paused':
							return paused;
						case 'ended':
							return ended;

						case 'src':
							vimeoPlayer.getVideoUrl().then(function (_url) {
								url = _url;
							});

							return url;
						case 'buffered':
							return {
								start: function start() {
									return 0;
								},
								end: function end() {
									return bufferedTime * duration;
								},
								length: 1
							};
						case 'readyState':
							return readyState;
					}
					return value;
				} else {
					return null;
				}
			};

			vimeo['set' + capName] = function (value) {
				if (vimeoPlayer !== null) {
					switch (propName) {
						case 'src':
							var _url2 = typeof value === 'string' ? value : value[0].src,
							    videoId = VimeoApi.getVimeoId(_url2);

							vimeoPlayer.loadVideo(videoId).then(function () {
								if (mediaElement.originalNode.autoplay) {
									vimeoPlayer.play();
								}
							}).catch(function (error) {
								errorHandler(error, vimeo);
							});
							break;
						case 'currentTime':
							vimeoPlayer.setCurrentTime(value).then(function () {
								currentTime = value;
								setTimeout(function () {
									var event = mejs.Utils.createEvent('timeupdate', vimeo);
									mediaElement.dispatchEvent(event);
								}, 50);
							}).catch(function (error) {
								errorHandler(error, vimeo);
							});
							break;
						case 'volume':
							vimeoPlayer.setVolume(value).then(function () {
								volume = value;
								oldVolume = volume;
								setTimeout(function () {
									var event = mejs.Utils.createEvent('volumechange', vimeo);
									mediaElement.dispatchEvent(event);
								}, 50);
							}).catch(function (error) {
								errorHandler(error, vimeo);
							});
							break;
						case 'loop':
							vimeoPlayer.setLoop(value).catch(function (error) {
								errorHandler(error, vimeo);
							});
							break;
						case 'muted':
							if (value) {
								vimeoPlayer.setVolume(0).then(function () {
									volume = 0;
									setTimeout(function () {
										var event = mejs.Utils.createEvent('volumechange', vimeo);
										mediaElement.dispatchEvent(event);
									}, 50);
								}).catch(function (error) {
									errorHandler(error, vimeo);
								});
							} else {
								vimeoPlayer.setVolume(oldVolume).then(function () {
									volume = oldVolume;
									setTimeout(function () {
										var event = mejs.Utils.createEvent('volumechange', vimeo);
										mediaElement.dispatchEvent(event);
									}, 50);
								}).catch(function (error) {
									errorHandler(error, vimeo);
								});
							}
							break;
						case 'readyState':
							var event = mejs.Utils.createEvent('canplay', vimeo);
							mediaElement.dispatchEvent(event);
							break;
						default:
							
							break;
					}
				} else {
					apiStack.push({ type: 'set', propName: propName, value: value });
				}
			};
		};

		for (var i = 0, total = props.length; i < total; i++) {
			assignGettersSetters(props[i]);
		}

		var methods = mejs.html5media.methods,
		    assignMethods = function assignMethods(methodName) {
			vimeo[methodName] = function () {
				if (vimeoPlayer !== null) {
					switch (methodName) {
						case 'play':
							paused = false;
							return vimeoPlayer.play();
						case 'pause':
							paused = true;
							return vimeoPlayer.pause();
						case 'load':
							return null;
					}
				} else {
					apiStack.push({ type: 'call', methodName: methodName });
				}
			};
		};

		for (var _i = 0, _total = methods.length; _i < _total; _i++) {
			assignMethods(methods[_i]);
		}

		window['__ready__' + vimeo.id] = function (_vimeoPlayer) {

			mediaElement.vimeoPlayer = vimeoPlayer = _vimeoPlayer;

			if (apiStack.length) {
				for (var _i2 = 0, _total2 = apiStack.length; _i2 < _total2; _i2++) {
					var stackItem = apiStack[_i2];

					if (stackItem.type === 'set') {
						var propName = stackItem.propName,
						    capName = '' + propName.substring(0, 1).toUpperCase() + propName.substring(1);

						vimeo['set' + capName](stackItem.value);
					} else if (stackItem.type === 'call') {
						vimeo[stackItem.methodName]();
					}
				}
			}

			if (mediaElement.originalNode.muted) {
				vimeoPlayer.setVolume(0);
				volume = 0;
			}

			var vimeoIframe = document.getElementById(vimeo.id);
			var events = void 0;

			events = ['mouseover', 'mouseout'];

			var assignEvents = function assignEvents(e) {
				var event = mejs.Utils.createEvent(e.type, vimeo);
				mediaElement.dispatchEvent(event);
			};

			for (var _i3 = 0, _total3 = events.length; _i3 < _total3; _i3++) {
				vimeoIframe.addEventListener(events[_i3], assignEvents, false);
			}

			vimeoPlayer.on('loaded', function () {
				vimeoPlayer.getDuration().then(function (loadProgress) {
					duration = loadProgress;
					if (duration > 0) {
						bufferedTime = duration * loadProgress;
						if (mediaElement.originalNode.autoplay) {
							paused = false;
							ended = false;
							var event = mejs.Utils.createEvent('play', vimeo);
							mediaElement.dispatchEvent(event);
						}
					}
				}).catch(function (error) {
					errorHandler(error, vimeo);
				});
			});
			vimeoPlayer.on('progress', function () {
				vimeoPlayer.getDuration().then(function (loadProgress) {
					duration = loadProgress;

					if (duration > 0) {
						bufferedTime = duration * loadProgress;
						if (mediaElement.originalNode.autoplay) {
							var initEvent = mejs.Utils.createEvent('play', vimeo);
							mediaElement.dispatchEvent(initEvent);

							var playingEvent = mejs.Utils.createEvent('playing', vimeo);
							mediaElement.dispatchEvent(playingEvent);
						}
					}

					var event = mejs.Utils.createEvent('progress', vimeo);
					mediaElement.dispatchEvent(event);
				}).catch(function (error) {
					errorHandler(error, vimeo);
				});
			});
			vimeoPlayer.on('timeupdate', function () {
				vimeoPlayer.getCurrentTime().then(function (seconds) {
					currentTime = seconds;

					var event = mejs.Utils.createEvent('timeupdate', vimeo);
					mediaElement.dispatchEvent(event);
				}).catch(function (error) {
					errorHandler(error, vimeo);
				});
			});
			vimeoPlayer.on('play', function () {
				paused = false;
				ended = false;
				var event = mejs.Utils.createEvent('play', vimeo);
				mediaElement.dispatchEvent(event);

				var playingEvent = mejs.Utils.createEvent('playing', vimeo);
				mediaElement.dispatchEvent(playingEvent);
			});
			vimeoPlayer.on('pause', function () {
				paused = true;
				ended = false;

				var event = mejs.Utils.createEvent('pause', vimeo);
				mediaElement.dispatchEvent(event);
			});
			vimeoPlayer.on('ended', function () {
				paused = false;
				ended = true;

				var event = mejs.Utils.createEvent('ended', vimeo);
				mediaElement.dispatchEvent(event);
			});

			events = ['rendererready', 'loadedmetadata', 'loadeddata', 'canplay'];

			for (var _i4 = 0, _total4 = events.length; _i4 < _total4; _i4++) {
				var event = mejs.Utils.createEvent(events[_i4], vimeo);
				mediaElement.dispatchEvent(event);
			}
		};

		var height = mediaElement.originalNode.height,
		    width = mediaElement.originalNode.width,
		    vimeoContainer = document.createElement('iframe'),
		    standardUrl = 'https://player.vimeo.com/video/' + VimeoApi.getVimeoId(mediaFiles[0].src);

		var queryArgs = ~mediaFiles[0].src.indexOf('?') ? '?' + mediaFiles[0].src.slice(mediaFiles[0].src.indexOf('?') + 1) : '';
		if (queryArgs && mediaElement.originalNode.autoplay && queryArgs.indexOf('autoplay') === -1) {
			queryArgs += '&autoplay=1';
		}
		if (queryArgs && mediaElement.originalNode.loop && queryArgs.indexOf('loop') === -1) {
			queryArgs += '&loop=1';
		}

		vimeoContainer.setAttribute('id', vimeo.id);
		vimeoContainer.setAttribute('width', width);
		vimeoContainer.setAttribute('height', height);
		vimeoContainer.setAttribute('frameBorder', '0');
		vimeoContainer.setAttribute('src', '' + standardUrl + queryArgs);
		vimeoContainer.setAttribute('webkitallowfullscreen', '');
		vimeoContainer.setAttribute('mozallowfullscreen', '');
		vimeoContainer.setAttribute('allowfullscreen', '');

		mediaElement.originalNode.parentNode.insertBefore(vimeoContainer, mediaElement.originalNode);
		mediaElement.originalNode.style.display = 'none';

		VimeoApi.load({
			iframe: vimeoContainer,
			id: vimeo.id
		});

		vimeo.hide = function () {
			vimeo.pause();
			if (vimeoPlayer) {
				vimeoContainer.style.display = 'none';
			}
		};
		vimeo.setSize = function (width, height) {
			vimeoContainer.setAttribute('width', width);
			vimeoContainer.setAttribute('height', height);
		};
		vimeo.show = function () {
			if (vimeoPlayer) {
				vimeoContainer.style.display = '';
			}
		};

		vimeo.destroy = function () {};

		return vimeo;
	}
};

mejs.Utils.typeChecks.push(function (url) {
	return (/(\/\/player\.vimeo|vimeo\.com)/i.test(url) ? 'video/x-vimeo' : null
	);
});

mejs.Renderers.add(vimeoIframeRenderer);

},{}]},{},[1]);
;
