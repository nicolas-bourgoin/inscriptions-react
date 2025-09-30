<?php
/*
Plugin Name: Inscriptions React
Description: Affiche une table d’inscriptions construite en React.
Version: 1.0
Author: Nicolas Bourgoin
*/

function inscriptions_react_enqueue_scripts($csv_filename = null) {
    $dir_url = plugin_dir_url(__FILE__) . 'dist/assets/';
    $dir_path = plugin_dir_path(__FILE__) . 'dist/assets/';

    // JS
    $js_files = glob($dir_path . 'index-*.js');
    if ($js_files && count($js_files) > 0) {
        $js_file = basename($js_files[0]);

        // Injecte csvFile dans JS AVANT de l'enregistrer
        wp_register_script('inscriptions-react-js', $dir_url . $js_file, [], null, true);
        wp_localize_script('inscriptions-react-js', 'appData', [
            'csvFile' => $csv_filename ?? ''
        ]);
        wp_enqueue_script('inscriptions-react-js');
    }

    // CSS
    $css_files = glob($dir_path . 'index-*.css'); 
    if ($css_files && count($css_files) > 0) {
        $css_file = basename($css_files[0]);
        wp_enqueue_style('inscriptions-react-css', $dir_url . $css_file);
    }
}

function inscriptions_react_shortcode($atts) {
    $atts = shortcode_atts([
        'csv' => null, 
    ], $atts);

    // Enqueue scripts en passant le nom du fichier CSV
    inscriptions_react_enqueue_scripts($atts['csv']);

    ob_start();
    echo '<div id="root"></div>';
    return ob_get_clean();
}

add_filter('script_loader_tag', function ($tag, $handle, $src) {
    if ($handle === 'inscriptions-react-js') {
        return "<script type=\"module\" src=\"$src\"></script>";
    }
    return $tag;
}, 10, 3);


add_shortcode('inscriptions-react', 'inscriptions_react_shortcode');
