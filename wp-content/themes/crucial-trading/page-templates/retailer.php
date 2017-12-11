<?php
/**
 * Template Name: Retailer
 *
 * The find a retailer page template
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

$error = false;

$uk_retailers       = array();
$overseas_retailers = array();

$uk_center       = '';
$overseas_center = '';
$pin_coords      = '';

if ( is_array( $_GET ) ) {

	if ( array_key_exists( 'postcode', $_GET ) ) {


		$postcode        = $_GET['postcode'];
		$postcode_tags   = strip_tags( $postcode );
		$postcode_trim   = trim( $postcode_tags );
		$postcode_filter = filter_var( $postcode_trim, FILTER_SANITIZE_STRING );

		$encoded  = urlencode( $postcode_filter );
		$url      = "http://maps.google.com/maps/api/geocode/json?address={$encoded}";
		$json     = file_get_contents( $url );
		$response = json_decode( $json, true );

		if ( is_array( $response ) && array_key_exists( 'status', $response ) ) {

			if ( $response['status'] != 'OK' ) {
				$error = 1;
			} else {

				$search_lat = $response['results'][0]['geometry']['location']['lat'];
				$search_lng = $response['results'][0]['geometry']['location']['lng'];
				$uk_center  = $search_lat . ' ' . $search_lng;

				$args = array(
					'post_type' => 'retailer',
					'orderby'   => 'menu_order',
					'order'     => 'ASC',
					'posts_per_page' => -1,
					'tax_query' => array(
						array(
							'taxonomy' => 'retailer_type',
							'field'    => 'slug',
							'terms'    => 'retailer',
						),
					),
				);

				$query = new WP_Query( $args );

				if ( !$query->have_posts() ) {
					$error = 10;
				} else {

					$retailers = array();

					for ( $i = 0; $i < $query->post_count; $i++ ) {

						$post    = $query->posts[$i];
						$post_id = $post->ID;

						$lat = get_post_meta( $post_id, 'retailer_lat', true );
						$lng = get_post_meta( $post_id, 'retailer_lng', true );

						$post->lat = $lat;
						$post->lng = $lng;

						array_push( $retailers, $post );
					}

					for ( $i2 = 0; $i2 < count( $retailers ); $i2++ ) {

						$distance = distance_between_lat_lng( $search_lat, $search_lng, $retailers[$i2]->lat, $retailers[$i2]->lng );

						if ( $distance < 10 ) {
							$retailers[$i2]->distance = round( $distance );
							array_push( $uk_retailers, $retailers[$i2] );
						}
					}

					// var_dump($a);

					function cmp( $a, $b ) {
						return $a->distance - $b->distance;
					}

					usort( $uk_retailers, 'cmp' );

					for ( $i3 = 0; $i3 < count( $uk_retailers ); $i3++ ) {
						$pin_coords .= $uk_retailers[$i3]->lat . ' ' . $uk_retailers[$i3]->lng . ',';
					}
				}
			}
		} else {
			$error = 1;
		}

	} else if ( array_key_exists( 'country', $_GET ) ) {

		$country = $_GET['country'];
		$enccoun = urlencode( $country );

		$url      = "http://maps.google.com/maps/api/geocode/json?address={$enccoun}";
		$json     = file_get_contents( $url );
		$response = json_decode( $json, true );

		if ( is_array( $response ) && array_key_exists( 'status', $response ) ) {

			if ( $response['status'] == 'OK' ) {
				$overseas_center  = $response['results'][0]['geometry']['location']['lat'] . ' ' . $response['results'][0]['geometry']['location']['lng'];
			} else {
				$error = 10;
			}
		} else {
			$error = 10;
		}

		$args = array(
			'post_type' => 'retailer',
			'orderby'   => 'menu_order',
			'order'     => 'ASC',
			'posts_per_page' => -1,
			'tax_query' => array(
				array(
					'taxonomy' => 'retailer_type',
					'field'    => 'slug',
					'terms'    => 'overseas',
				),
			),
		);

		$query = new WP_Query( $args );

		if ( !$query->have_posts() ) {
			$error = 10;
		} else {

			for ( $i = 0; $i < $query->post_count; $i++ ) {

				$post         = $query->posts[$i];
				$post_id      = $post->ID;
				$post_country = strtolower( rwmb_meta( 'retailer_country', array(), $post_id ) );

				if ( $country == $post_country ) {

					$lat = get_post_meta( $post_id, 'retailer_lat', true );
					$lng = get_post_meta( $post_id, 'retailer_lng', true );

					$pin_coords .= $lat . ' ' . $lng . ',';
					array_push( $overseas_retailers, $post );
				}
			}
		}
	}
}

get_header();

echo do_shortcode( '[header size="small"]' );

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[retailer-search-box]' );

echo do_shortcode( '[google-map uk-center="' . $uk_center . '" overseas-center="' . $overseas_center . '" pin-coords="' . $pin_coords . '"]' );

echo switch_views();



if ( count( $uk_retailers ) > 0 ) {

	// echo '<h2 class="page-subtitle">Search Results</h2>';
	// echo '<span></span>';
	// echo '<div class="clearfix" style="display: flex; flex-flow: row wrap">';
	$local_html = (
		"<div class='retailer-result-dropdown panel-group'>
      <div class='retailer-result-dropdown__header'>
				<h2>Local Retailers</h2>
			</div>"
	);

	for ( $i3 = 0; $i3 < count( $uk_retailers ); $i3++ ) {

		$id   = $uk_retailers[$i3]->ID;

		$post_type = $uk_retailers[$i3]->post_type;
		$_post_id = $uk_retailers[$i3]->ID;
		$title = $post_id = $uk_retailers[$i3]->post_title;
		$retailer_postcode = get_post_meta($_post_id, "retailer_postcode", true);
		$local_html .= retailer_loop($title, $_post_id, true, false, $iterator = $i3, true, $retailer_postcode);
		echo do_shortcode( '[retailer-card id="' . $id . '" miles="' . $retailer_postcode . '" i="' . $i3 . '"]' );
	}

	$local_html .= (
		"</div>"
	);

	echo $local_html;
}

if ( count( $overseas_retailers ) > 0 ) {
	for ( $i4 = 0; $i4 < count( $overseas_retailers ); $i4++ ) {
		echo do_shortcode( '[retailer-card id="' . $overseas_retailers[$i4]->ID . '" distance="overseas"]' );
	}
}

if ( count( $uk_retailers ) == 0 && count( $overseas_retailers ) == 0 ) {
	$error = 2;
}

if ( $error && is_array( $_GET ) && ( array_key_exists( 'postcode', $_GET ) || array_key_exists( 'country', $_GET ) ) ) {

	$msg = '';

	switch ( $error ) {
		case 1  : $msg = 'Sorry, we could not find that post code.'; break;
		case 2  : $msg = 'Sorry, there are no retailers in your area.'; break;
		case 10 : $msg = 'Sorry, an error has occured.'; break;
	}

	echo '<h2 class="page-subtitle">' . $msg . '</h2>';
}

$showroom_args = array(
	'post_type' => 'retailer',
	'orderby'   => 'menu_order',
	'order'     => 'ASC',
	'tax_query' => array(
		array(
			'taxonomy' => 'retailer_type',
			'field'    => 'slug',
			'terms'    => 'showroom',
		),
	),
);
// var_dump(222);

?>
<div id="accordion">
<?php
// Show only on search page.
// We could test if key postcode on the array $_GET
// WE also show this functon if no error as we'll get an index error of no results for the $dist query ie $uk_retailers[<number>]
if  (array_key_exists('postcode', $_GET) && !$error) {
	echo studio_retailers('Studio Retailers', 'studio', false, $uk_retailers);
}
echo retailers('Online Retailers', '', 'online', true);
echo retailers('Showrooms');

?>
</div>
<?php
$showroom_query = new WP_Query( $showroom_args );

if ( $showroom_query->have_posts() ) :

	echo (
		"<div class='r_card clearfix'>
			<h2 class='page-subtitle'>Showrooms</h2>
			<span></span>
			<div class='clearfix'>"
	);

	for ( $i2 = 0; $i2 < $showroom_query->post_count; $i2++ ) {
		echo do_shortcode( '[showroom-card type="showroom" id="' . $showroom_query->posts[$i2]->ID . '"]' );
	}

	echo '</div></div>';

endif;

$online_args = array(
	'post_type' => 'retailer',
	'orderby'   => 'menu_order',
	'order'     => 'ASC',
	'tax_query' => array(
		array(
			'taxonomy' => 'retailer_type',
			'field'    => 'slug',
			'terms'    => 'online',
		),
	),
);

$online_query = new WP_Query( $online_args );

if ( $online_query->have_posts() ) :

	echo (
		"<div class='r_card clearfix'>
			<h2 class='page-subtitle'>Online Retailers</h2>
			<span></span>
			<div class='clearfix'>"
	);

	for ( $i3 = 0; $i3 < $online_query->post_count; $i3++ ) {
		echo do_shortcode( '[showroom-card type="online" id="' . $online_query->posts[$i3]->ID . '"]' );
	}

	echo '</div></div>';

endif;

get_footer();
