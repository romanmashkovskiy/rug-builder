<?php

$html .= '<div class="material__details clearfix">';

if ( $fibre ) {

	$html .= '<div class="info__section">';
	$html .= '<p>' . $fibre . '</p>';
	$html .= '</div>';
}

if ( $price ) {
	$html .= '<div class="info__section">';
	$html .= '<p>£' . $price . ' sq/m</p>';
	$html .= '</div>';
}

if ( $width ) {
	$html .= '<div class="info__section">';
	$html .= '<p>' . $width . '</p>';
	$html .= '</div>';
}

if ( $backing ) {
	$html .= '<div class="info__section">';
	$html .= '<p>' . $backing . '</p>';
	$html .= '</div>';
}

if ( $under_1 ) {
	$html .= '<div class="info__section">';
	$html .= '<p>' . $under_1 . '</p>';
	$html .= '</div>';
}

if ( $under_2 ) {
	$html .= '<div class="info__section">';
	$html .= '<p>' . $under_2 . '</p>';
	$html .= '</div>';
} 

if ( $under_3 ) {
	$html .= '<div class="info__section">';
	$html .= '<p>' . $under_3 . '</p>';
	$html .= '</div>';
}

if ( $suit_1 ) {

	$html .= '<div class="info__section">';
	$html .= '<p>' . $suit_1 . '</p>';
	$html .= '</div>';
}

if ( $suit_2 ) {

	$html .= '<div class="info__section">';
	$html .= '<p>' . $suit_2 . '</p>';
	$html .= '</div>';
}

if ( $suit_3 ) {

	$html .= '<div class="info__section">';
	$html .= '<p>' . $suit_3 . '</p>';
	$html .= '</div>';
}		

$html .= '</div>';