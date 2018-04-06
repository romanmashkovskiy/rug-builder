<?php
/**
 * Template Name: Offers Landing
 *
 * Offers Landing Page
 *
 * @package Crucial Trading
 * @since Crucial Trading 1.0
 */

get_header();

echo do_shortcode( '[logo-nav]' );

echo do_shortcode( '[header size="small" bg="true"]' );

?>

<section class="offers-landing__container">
  <div class="offers-landing__line"></div>
  <div class="offers-landing__lead-text">
    <?php the_content(); ?>
  </div>
  <hr />

  <div class="offers-landing__materials">
  <?php
    // Exclude Borders and Offers
    $spring_offers = get_term_by('slug', 'offers', 'product_cat');
    $rug_border = get_term_by('slug', 'rug-borders', 'product_cat');

    // Get Materials
    $products_cats_tax = get_terms( array(
      'taxonomy' => 'product_cat',
      'parent' => 0,
      'exclude' => array($spring_offers->term_id, $rug_border->term_id),
    ));

    // Sort Materials via menu order - same as materials page
    $products_cats_tax = sort_materials_menu_order($products_cats_tax);
  ?>

  <?php
    foreach ( $products_cats_tax as $products_cats ) :
        $project_query = new WP_Query( array(
            'post_type'      => 'product',
            'orderby'        => 'menu_order',
            'order'          => 'ASC',
            'tax_query' => array(
                'relation' => 'AND',
                array(
                    'taxonomy' => 'product_cat',
                    'field' => 'slug',
                    'terms' => 'offers',
                ),
                array(
                    'taxonomy' => 'product_cat',
                    'field' => 'slug',
                    'terms' => $products_cats,
                ),
            ),
        ));
    ?>

    <?php if ($project_query->found_posts > 0 ) : ?>
      <div class="offers-landing__materials__header <?php echo $products_cats->slug; ?>">
        <?php
          $icon_id = get_woocommerce_term_meta( $products_cats->term_id, 'thumbnail_id', true );
    	    $icon_url = wp_get_attachment_url( $icon_id );
          $icon_alt = get_post_meta( $icon_id, '_wp_attachment_image_alt', true);
        ?>
        <h2 class="offers-landing__materials__title"><img src="<?php echo $icon_url; ?>" alt="<?php echo $icon_alt; ?>" /> <?php echo $products_cats->name; ?></h2>
        <div class="offers-landing__materials__description"><?php echo $products_cats->description; ?></div>
      </div>

      <div class="swatches swatches--large clearfix">
        <?php if ( $project_query->have_posts() ) : while ( $project_query->have_posts() ) : $project_query->the_post(); ?>

          <?php
            $title      = get_the_title( $post->ID );
            $link       = get_the_permalink( $post->ID );
            $src        = wp_get_attachment_image_src( get_post_thumbnail_id( $post->ID ), 'small' )[0];
            $reg_price  = $product->get_regular_price();
            $sale_price = $product->get_sale_price();
            $difference = $reg_price - $sale_price;
          ?>

          <div class="swatch">
            <a href="<?php echo $link; ?>" class="no-effect">

              <?php if ( !empty($sale_price) && $difference >= 50 ) : ?>
                <div class="swatch__sale-badge">
                  &pound;<?php echo $difference; ?><span class="swatch__sale-badge__off">OFF</span>
                </div>
              <?php endif; ?>

              <div class="swatch__information clearfix vertical-align">
                <h3 class="swatch__name"><?php echo $title; ?></h3>
                <div class="swatch__price">
                  <?php if ( !empty( $product->get_sale_price() ) ) : ?>
                    <div class="swatch__price--regular swatch__price--regular--strike">&pound;<?php echo $reg_price; ?></div>
                    <div class="swatch__price--sale">NOW &pound;<?php echo $sale_price; ?></div>
                  <?php else : ?>
                    <div class="swatch__price--regular">&pound;<?php echo $reg_price; ?></div>
                  <?php endif; ?>
                </div>
                <!--<div class="swatch__cta">
                  Order Now
                </div>-->
              </div>
              <div class="swatch__image object-fit-container vertical-align">
                <img src="<?php echo $src; ?>" alt="<?php echo $title; ?>">
              </div>
            </a>
          </div>

        <?php endwhile; endif; ?>
        <?php wp_reset_postdata(); ?>
      </div>

      <hr />
    <?php endif; ?>

    <?php endforeach; ?>
    </div>

</section>

<?php

get_footer();
