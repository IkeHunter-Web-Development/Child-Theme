<?php

/**
 * Theme functions and definitions.
 *
 * For additional information on potential customization options,
 * read the developers' documentation:
 *
 * https://developers.elementor.com/docs/hello-elementor-theme/
 *
 * @package HelloElementorChild
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

define('CREDIT_NAME', 'IkeHunter Web Development, LLC');
define('CREDIT_URL', 'https://ikehunter.com/');

/*================================*/
/** Load stylesheets and scripts **/
/*================================*/
define('HELLO_ELEMENTOR_CHILD_VERSION', '2.0.0');

/**
 * Load child theme scripts & styles.
 *
 * @return void
 */
function hello_elementor_child_scripts_styles() {

    wp_enqueue_style(
        'hello-elementor-child-style',
        get_stylesheet_directory_uri() . '/style.css',
        [
            'hello-elementor-theme-style',
        ],
        HELLO_ELEMENTOR_CHILD_VERSION
    );
    wp_enqueue_script('child-theme-scripts', get_stylesheet_directory_uri() . '/script.js', ['jquery'], false, true);
}
add_action('wp_enqueue_scripts', 'hello_elementor_child_scripts_styles', 20);

function child_theme_enqueue_scripts() {
  wp_enqueue_script('child-theme-scripts', get_stylesheet_directory_uri() . '/script.js', ['jquery'], false, true);
  wp_enqueue_style('child-theme-styles', get_stylesheet_directory_uri() . '/style.css');
}

add_action('wp_enqueue_scripts', 'child_theme_enqueue_scripts');


/*================================*/
/** Minor WP Adjustment Scripts. **/
/*================================*/
/**
 * Remove dismissable notifications.
 */
// src: https://labinator.com/disable-admin-notices/
add_action('admin_enqueue_scripts', 'ds_admin_theme_style');
add_action('login_enqueue_scripts', 'ds_admin_theme_style');
function ds_admin_theme_style() {
    echo '<style>.is-dismissible, .notice-info, .notice-warning:not(.update-message), .pfd-onboarding { display: none; }</style>';
}

/**
 * Add Alt tag if missing on frontend.
 */
function add_alt_to_images_if_missing($attr, $attachment = null) {
    if ($attr['alt'] == '') {
        $attr['alt'] = "image";
    }
    return $attr;
}
add_filter('wp_get_attachment_image_attributes', 'add_alt_to_images_if_missing', 10, 2);

/**
 * Brand WP-Admin footer.
 */
function custom_footer_admin() {
    echo 'Website by <a href="' . CREDIT_URL . '">' . CREDIT_NAME . '</a>.';
}
add_filter('admin_footer_text', 'custom_footer_admin');

/*==============================*/
/** General Purpose Shortcodes **/
/*==============================*/
/**
 * Get the current year and display it.
 * Use shortcode [current_year] to dispay.
 */
function current_year_shortcode() {
  $year = date('Y');
  return $year;
}
add_shortcode('current_year', 'current_year_shortcode');

function credit_shortcode() {
  $credit = 'Website by <a href="' . CREDIT_URL . '">' . CREDIT_NAME . '</a>. ';
  return $credit;
}
add_shortcode('credit', 'credit_shortcode');
