<?php

/**
 * Template Name: Retailer Card
 * The cards on the Find a Retailer page 
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function retailer_card( $atts = '' ) {

	$html = '';

	$post_id = false;

	if ( is_array( $atts ) && array_key_exists( 'id', $atts ) ) {
		$post_id = $atts['id'];
	}

	if ( !$post_id ) {
		return $html;
	}

	$distance = false;

	if ( array_key_exists( 'distance', $atts ) ) {
		$distance = $atts['distance'];
	}

	$iterator = 0;

	if ( array_key_exists( 'i', $atts ) ) {
		$iterator = $atts['i'] + 1;
	}

	$post = get_post( $post_id ); 

//	$address = rwmb_meta( 'address', array(), $post_id );

	$address_1 = rwmb_meta( 'retailer_address_1', array(), $post_id );
	$address_2 = rwmb_meta( 'retailer_address_2', array(), $post_id );
	$address_3 = rwmb_meta( 'retailer_address_3', array(), $post_id );
	$address_4 = rwmb_meta( 'retailer_address_4', array(), $post_id );
	$address_5 = rwmb_meta( 'retailer_address_5', array(), $post_id );
	$address_6 = rwmb_meta( 'retailer_town', array(), $post_id );
	$address_7 = rwmb_meta( 'retailer_county', array(), $post_id );
	$address_8 = rwmb_meta( 'retailer_postcode', array(), $post_id );

	$address = '';

	if ( $address_1 != '' ) {
		$address .= $address_1;
	}
	if ( $address_2 != '' ) {
		$address .= "\r\n" . $address_2;
	}
	if ( $address_3 != '' ) {
		$address .= "\r\n" . $address_3;
	}
	if ( $address_4 != '' ) {
		$address .= "\r\n" . $address_4;
	}
	if ( $address_5 != '' ) {
		$address .= "\r\n" . $address_5;
	}
	if ( $address_6 != '' ) {
		$address .= "\r\n" . $address_6;
	}
	if ( $address_7 != '' ) {
		$address .= "\r\n" . $address_7;
	}
	if ( $address_8 != '' ) {
		$address .= "\r\n" . $address_8;
	}

	$phone   = rwmb_meta( 'retailer_telephone_1', array(), $post_id );
	$website = rwmb_meta( 'retailer_website', array(), $post_id );
	$email   = rwmb_meta( 'retailer_email', array(), $post_id );
	$country = ucwords( rwmb_meta( 'retailer_country', array(), $post_id ) );

	$lat = get_post_meta( $post_id, 'retailer_lat', true );
	$lng = get_post_meta( $post_id, 'retailer_lng', true );
	$url = 'http://maps.google.com/maps?q=' . $lat . ',' . $lng . '&ll=' . $lat . ',' . $lng . '&z=12';
 
	if ( $distance != 'overseas' ) {

		$html .= '<div class="retailer">';
		$html .= '<img src="http://d105txpzekqrfa.cloudfront.net/uploads/20161215113733/Combined-Shape-Copy.svg" class="retailer__pin">';
		$html .= '<span class="retailer__iterator">' . $iterator . '</span>';
		$html .= '<div class="border-div">';
		$html .= '<h3 class="retailer__title">' . get_the_title( $post_id ) . '</h3>';
		$html .= '<p class="retailer__address">' . nl2br( $address ) . '</p>';
		if ( $phone != '' ) {
			$html .= '<p class="retailer__phone">' . $phone . '</p>';
		}
		if ( $email != '' ) {
			$html .= '<a class="retailer__email" href="mailto:' . $email . '"><p>Send Email</p></a>';
		}
		$html .= '<a class="retailer_directions" target="_blank" href="' . $url . '">Get Directions</a>';
		if ( $distance ) {
			$html .= '<h3 class="retailer_distance">' . $distance . ' Miles</h3>';
		}
		$html .= '</div>';
		$html .= '</div>';
	}
	else {

		$country_code = get_country_code( $country );

		$html .= '<div class="retailer overseas">';
		$html .= '<div class="border-div clearfix">';
		$html .= '<span class="flag-icon flag-icon-' . $country_code . '"></span>';
		$html .= '<h3 class="retailer__title">' . get_the_title( $post_id ) . '</h3>';
		$html .= '<p class="retailer__address">' . nl2br( $address ) . '</p>';
		$html .= '<div class="retailer__contact">';
		if ( $website != '' ) {
			$html .= '<p class="retailer__website">' . $website . '</p>';
		}
		if ( $phone != '' ) {
			$html .= '<p class="retailer__phone">' . $phone . '</p>';
		}
		if ( $email != '' ) {
			$html .= '<a class="retailer__email" href="mailto:' . $email . '"><p>Send Email</p></a>';
		}
		$html .= '</div>';
		$html .= '<a class="retailer_directions" href="' . $url . '">Get Directions</a>';
		$html .= '</div>';
		$html .= '</div>';
	}

	return $html;
}

add_shortcode( 'retailer-card', 'retailer_card' ); 

function get_country_code( $country ) {

	$country = ucwords( strtolower( $country ) );

	$codes = array(
		'Afghanistan' => 'af',
		'Aland Islands' => 'ax',
		'Albania' => 'al',
		'Algeria' => 'dz',
		'American Samoa' => 'as',
		'Andorra' => 'ad',
		'Angola' => 'ao',
		'Anguilla' => 'ai',
		'Antarctica' => 'aq',
		'Antigua and Barbuda' => 'ag',
		'Argentina' => 'ar',
		'Armenia' => 'am',
		'Aruba' => 'aw',
		'Australia' => 'au',
		'Austria' => 'at',
		'Azerbaijan' => 'az',
		'Bahamas' => 'bs',
		'Bahrain' => 'bh',
		'Bangladesh' => 'bd',
		'Barbados' => 'bb',
		'Belarus' => 'by',
		'Belgium' => 'be',
		'Belize' => 'bz',
		'Benin' => 'bj',
		'Bermuda' => 'bm',
		'Bhutan' => 'bt',
		'Bolivia' => 'bo',
		'Bonaire, Saint Eustatius and Saba' => 'bq',
		'Bosnia and Herzegovina' => 'ba',
		'Botswana' => 'bw',
		'Bouvet Island' => 'bv',
		'Brazil' => 'br',
		'British Indian Ocean Territory' => 'io',
		'British Virgin Islands' => 'vg',
		'Brunei' => 'bn',
		'Bulgaria' => 'bg',
		'Burkina Faso' => 'bf',
		'Burundi' => 'bi',
		'Cambodia' => 'kh',
		'Cameroon' => 'cm',
		'Canada' => 'ca',
		'Cape Verde' => 'cv',
		'Cayman Islands' => 'ky',
		'Central African Republic' => 'cf',
		'Chad' => 'td',
		'Chile' => 'cl',
		'China' => 'cn',
		'Christmas Island' => 'cx',
		'Cocos Islands' => 'cc',
		'Colombia' => 'co',
		'Comoros' => 'km',
		'Cook Islands' => 'ck',
		'Costa Rica' => 'cr',
		'Croatia' => 'hr',
		'Cuba' => 'cu',
		'Curacao' => 'cw',
		'Cyprus' => 'cy',
		'Czech Republic' => 'cz',
		'Democratic Republic of the Congo' => 'cd',
		'Denmark' => 'dk',
		'Djibouti' => 'dj',
		'Dominica' => 'dm',
		'Dominican Republic' => 'do',
		'East Timor' => 'tl',
		'Ecuador' => 'ec',
		'Egypt' => 'eg',
		'El Salvador' => 'sv',
		'Equatorial Guinea' => 'gq',
		'Eritrea' => 'er',
		'Estonia' => 'ee',
		'Ethiopia' => 'et',
		'Falkland Islands' => 'fk',
		'Faroe Islands' => 'fo',
		'Fiji' => 'fj',
		'Finland' => 'fi',
		'France' => 'fr',
		'French Guiana' => 'gf',
		'French Polynesia' => 'pf',
		'French Southern Territories' => 'tf',
		'Gabon' => 'ga',
		'Gambia' => 'gm',
		'Georgia' => 'ge',
		'Germany' => 'de',
		'Ghana' => 'gh',
		'Gibraltar' => 'gi',
		'Greece' => 'gr',
		'Greenland' => 'gl',
		'Grenada' => 'gd',
		'Guadeloupe' => 'gp',
		'Guam' => 'gu',
		'Guatemala' => 'gt',
		'Guernsey' => 'gg',
		'Guinea' => 'gn',
		'Guinea-Bissau' => 'gw',
		'Guyana' => 'gy',
		'Haiti' => 'ht',
		'Heard Island and McDonald Islands' => 'hm',
		'Honduras' => 'hn',
		'Hong Kong' => 'hk',
		'Hungary' => 'hu',
		'Iceland' => 'is',
		'India' => 'in',
		'Indonesia' => 'id',
		'Iran' => 'ir',
		'Iraq' => 'iq',
		'Ireland' => 'ie',
		'Isle of Man' => 'im',
		'Israel' => 'il',
		'Italy' => 'it',
		'Ivory Coast' => 'ci',
		'Jamaica' => 'jm',
		'Japan' => 'jp',
		'Jersey' => 'je',
		'Jordan' => 'jo',
		'Kazakhstan' => 'kz',
		'Kenya' => 'ke',
		'Kiribati' => 'ki',
		'Kosovo' => 'xk',
		'Kuwait' => 'kw',
		'Kyrgyzstan' => 'kg',
		'Laos' => 'la',
		'Latvia' => 'lv',
		'Lebanon' => 'lb',
		'Lesotho' => 'ls',
		'Liberia' => 'lr',
		'Libya' => 'ly',
		'Liechtenstein' => 'li',
		'Lithuania' => 'lt',
		'Luxembourg' => 'lu',
		'Macao' => 'mo',
		'Macedonia' => 'mk',
		'Madagascar' => 'mg',
		'Malawi' => 'mw',
		'Malaysia' => 'my',
		'Maldives' => 'mv',
		'Mali' => 'ml',
		'Malta' => 'mt',
		'Marshall Islands' => 'mh',
		'Martinique' => 'mq',
		'Mauritania' => 'mr',
		'Mauritius' => 'mu',
		'Mayotte' => 'yt',
		'Mexico' => 'mx',
		'Micronesia' => 'fm',
		'Moldova' => 'md',
		'Monaco' => 'mc',
		'Mongolia' => 'mn',
		'Montenegro' => 'me',
		'Montserrat' => 'ms',
		'Morocco' => 'ma',
		'Mozambique' => 'mz',
		'Myanmar' => 'mm',
		'Namibia' => 'na',
		'Nauru' => 'nr',
		'Nepal' => 'np',
		'Netherlands' => 'nl',
		'New Caledonia' => 'nc',
		'New Zealand' => 'nz',
		'Nicaragua' => 'ni',
		'Niger' => 'ne',
		'Nigeria' => 'ng',
		'Niue' => 'nu',
		'Norfolk Island' => 'nf',
		'North Korea' => 'kp',
		'Northern Mariana Islands' => 'mp',
		'Norway' => 'no',
		'Oman' => 'om',
		'Pakistan' => 'pk',
		'Palau' => 'pw',
		'Palestinian Territory' => 'ps',
		'Panama' => 'pa',
		'Papua New Guinea' => 'pg',
		'Paraguay' => 'py',
		'Peru' => 'pe',
		'Philippines' => 'ph',
		'Pitcairn' => 'pn',
		'Poland' => 'pl',
		'Portugal' => 'pt',
		'Puerto Rico' => 'pr',
		'Qatar' => 'qa',
		'Republic of the Congo' => 'cg',
		'Reunion' => 're',
		'Romania' => 'ro',
		'Russia' => 'ru',
		'Rwanda' => 'rw',
		'Saint Barthelemy' => 'bl',
		'Saint Helena' => 'sh',
		'Saint Kitts and Nevis' => 'kn',
		'Saint Lucia' => 'lc',
		'Saint Martin' => 'mf',
		'Saint Pierre and Miquelon' => 'pm',
		'Saint Vincent and the Grenadines' => 'vc',
		'Samoa' => 'ws',
		'San Marino' => 'sm',
		'Sao Tome and Principe' => 'st',
		'Saudi Arabia' => 'sa',
		'Senegal' => 'sn',
		'Serbia' => 'rs',
		'Seychelles' => 'sc',
		'Sierra Leone' => 'sl',
		'Singapore' => 'sg',
		'Sint Maarten' => 'sx',
		'Slovakia' => 'sk',
		'Slovenia' => 'si',
		'Solomon Islands' => 'sb',
		'Somalia' => 'so',
		'South Africa' => 'za',
		'South Georgia and the South Sandwich Islands' => 'gs',
		'South Korea' => 'kr',
		'South Sudan' => 'ss',
		'Spain' => 'es',
		'Sri Lanka' => 'lk',
		'Sudan' => 'sd',
		'Suriname' => 'sr',
		'Svalbard and Jan Mayen' => 'sj',
		'Swaziland' => 'sz',
		'Sweden' => 'se',
		'Switzerland' => 'ch',
		'Syria' => 'sy',
		'Taiwan' => 'tw',
		'Tajikistan' => 'tj',
		'Tanzania' => 'tz',
		'Thailand' => 'th',
		'Togo' => 'tg',
		'Tokelau' => 'tk',
		'Tonga' => 'to',
		'Trinidad and Tobago' => 'tt',
		'Tunisia' => 'tn',
		'Turkey' => 'tr',
		'Turkmenistan' => 'tm',
		'Turks and Caicos Islands' => 'tc',
		'Tuvalu' => 'tv',
		'U.S. Virgin Islands' => 'vi',
		'Uganda' => 'ug',
		'Ukraine' => 'ua',
		'United Arab Emirates' => 'ae',
		'United Kingdom' => 'gb',
		'United States' => 'us',
		'United States Minor Outlying Islands' => 'um',
		'Uruguay' => 'uy',
		'Uzbekistan' => 'uz',
		'Vanuatu' => 'vu',
		'Vatican' => 'va',
		'Venezuela' => 've',
		'Vietnam' => 'vn',
		'Wallis and Futuna' => 'wf',
		'Western Sahara' => 'eh',
		'Yemen' => 'ye',
		'Zambia' => 'zm',
		'Zimbabwe' => 'zw',
	);

	return array_key_exists( $country, $codes ) ? $codes[$country] : '';
}