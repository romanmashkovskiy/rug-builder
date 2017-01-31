<?php

foreach ( $social as $key => $post ) {

	if ( $post->from == 'Twitter' ) {

		$image = extract_twitter_image( $post );

		if ( !$image ) {
			continue;
		}

		$text  = extract_twitter_text( $post );
		$time  = extract_twitter_time( $post );
		$link  = extract_twitter_link( $post );

		$shadow_class = $link ? 'has-link' : 'no-link';

		$html .= "<div class='timeline__event twitter-post'>";
		$html .= "<div class='timeline__event__line'><span class='timeline__event__ball'></span></div>";
		$html .= "<i class='icon-crucial-twitter'></i>";

		$html .= "<div class='timeline__event_container'>";
		
		if ( $image ) {
			$html .= "<img src='$image' class='twitter__image box-shadow'>";
		}
		
		$html .= "<div class='timeline__text_container'>";
		
		$html .= "<div class='twitter__text'>$text</div>";
		$html .= "<div class='twitter__time'>$time</div>";

		/*if ( $link ) {
			$html .= "<a href='$link' target='_blank' class='twitter__link'>View Tweet</a>";
		}*/
		
		$html .= "</div>";
		
		$html .= "<div class='twitter__shadow $shadow_class'></div>";
		$html .= "</div></div>";

	} else {

		$image = extract_instagram_image( $post );
		$link  = extract_instagram_link( $post );

		$html .= "<div class='timeline__event insta-post'>";
		$html .= "<div class='timeline__event__line'><span class='timeline__event__ball'></span></div>";
		$html .= "<i class='icon-crucial-instagram'></i>";

		if ( $link ) {
			$html .= "<a href='$link' target='_blank' class='insta__link'>";
		}

		if ( $image ) {
			$html .= "<img src='$image' class='insta__image box-shadow'>";
		}
		
		if ( $link ) {
			$html .= "</a>";
		}
		
		$html .= "</div>";

	}
}