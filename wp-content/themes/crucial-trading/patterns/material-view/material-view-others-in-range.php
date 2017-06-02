<?php

$terms = get_the_terms( $post_id, 'product_cat' );
$range = false;

foreach ( $terms as $key => $term ) {

	if ( $term->parent != 0 ) {
		$range = $term->term_id;
	}

}

if ( !$range ) {
	return;
}

$args = array(
	'post_type'   => 'product',
	'posts_per_page' => -1,
	'tax_query'   => array(
		array (
			'taxonomy' => 'product_cat',
			'field'    => 'id',
			'terms'    => $range,
		),
	),
);

$query = new WP_Query( $args );

if ( count( $query->posts ) < 2 ) {
	return;
}

$i = 0;

$num_of_posts = count( $query->posts );
$posts_class  = '';

if ( $num_of_posts > 6 ) {
	$posts_class = 'decrease-width';
}

$html .= '<div class="material__range clearfix">';

foreach ( $query->posts as $key => $material ) {

	$material_id = $material->ID;

	$href = get_the_permalink( $material_id );
	$_src = wp_get_attachment_image_src( get_post_thumbnail_id( $material_id ), 'thumbnail' );
	$src  = is_array( $_src ) && array_key_exists( 0, $_src ) ? $_src[0] : '';
	$alt  = $material->post_title;

	$current       = $material_id == $post_id;
	$current_class = '';

	if ( $current ) {
		$current_class = 'current';
	}

	$html .= "<div class='range__material $current_class $posts_class' data-index='$i'>";
	$html .= "<a href='#' class='range__goto'>";
	$html .= "<img src='$src' alt='$alt'>";
	$html .= "</a>";

	if ( $current ) {
		$html .= "<i class='icon-crucial-tick-thin'></i>";
	}

	$html .= "</div>";

	$i++;

}

$html .= '</div>';
