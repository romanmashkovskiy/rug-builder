var $ = jQuery;

var INSP_CONTENT = {};

INSP_CONTENT.hash = window.location.hash;

switch ( INSP_CONTENT.hash ) {

	case 'room-shots' :
		INSP_CONTENT.content = 'photos';
		break;

	case 'videos' :
		INSP_CONTENT.content = 'videos';
		break;

	default :
		INSP_CONTENT.content = 'social';
		break;
}

if ( INSP_CONTENT.content === 'social' ) {

	
	
}