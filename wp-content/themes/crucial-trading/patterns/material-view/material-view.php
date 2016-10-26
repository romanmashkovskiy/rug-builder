<?php

/**
 * Template Name: Material View
 * The detailed view of the material on the material page 
 *
 * Contents:
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

function material_view( $atts = '' ) {

	$html = '';

	$html .= '<div class="material coir box-shadow">';
	$html .= '<div class="material__header">';

		$html .= '<div class="header__back">';
		$html .= '<a href="#">Back to Materials</a>';
		$html .= '</div>';

		$html .= '<div class="header__titles">';
		$html .= '<h1>Boucle Natural</h1>';
		$html .= '<h3>Code: SM102</h3>';
		$html .= '</div>';

		$html .= '<div class="header__links">';
		$html .= '<ul>';
		$html .= '<li><a href="#">Print Factsheet</h3></a></li>';
		$html .= '<li><a href="#">Get a Quote</a></li>';
		$html .= '<li><a href="#">Rug Builder</a></li>';
		$html .= '<li><a href="#">Order Swatch</a></li>';
		$html .= '</ul>';
		$html .= '</div>';

	$html .= '</div>';
	$html .= '<div class="material__body">';

		$html .= '<div class="image-container">';
		$html .= '<img src="" alt="">';
		$html .= '<a href="#" id="change-image-view">Change View</a>';

			$html .= '<div class="material__info clearfix">';
			$html .= '<a href="#" id="hide-material-info">Hide</a>';
			$html .= '<div class="info__section">';
			$html .= '<h3>100% Coir</h3>';
			$html .= '</div>';
			$html .= '<div class="info__section">';
			$html .= '<h3>£200/m2</h3>';
			$html .= '</div>';
			$html .= '<div class="info__section">';
			$html .= '<h3>Up to 4m</h3>';
			$html .= '</div>';
			$html .= '<div class="info__section">';
			$html .= '<h3>Underlay</h3>';
			$html .= '</div>';
			$html .= '</div>';

		$html .= '</div>';

	$html .= '</div>';
	$html .= '</div>';

	return $html;
}

add_shortcode( 'material-view', 'material_view' );