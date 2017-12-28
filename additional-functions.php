<?php 
// These functions are included in the theme/plugin functions.php

// adding ACF form head function, if it's not added already

function myplugin_addto_header() {
	
	if( function_exists('acf_form_head')) {
		return;
	}
	else{ 
		acf_form_head();
	}
}
add_action('wp_head', 'myplugin_addto_header', 1);

// ACF ajax
add_action('acf/submit_form', 'my_acf_submit_form', 10, 2);
function my_acf_submit_form( $form, $post_id ) {

    if( is_admin() )
        return;

    //Test if it's a AJAX request.
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
        echo $form['updated_message'];
        die();
    }

}

/**
 * Adding Fancybox Lightbox
 * http://fancyapps.com/fancybox/3/
 */

function fptheme_fancybox_scripts(){
        wp_enqueue_script( 'jquery' );
 
        wp_enqueue_style( 'fancybox-style', get_template_directory_uri() . '/inc/lightbox/jquery.fancybox.css' );
 
        wp_enqueue_script( 'fancybox-script', get_template_directory_uri() .  '/inc/lightbox/jquery.fancybox.min.js', array( 'jquery' ), false, true );

}
add_action( 'wp_enqueue_scripts', 'fptheme_fancybox_scripts' );


function fptheme_fancybox_initialize() { 
	?>
	<script type="text/javascript">
		jQuery(document).ready(function() {            
			jQuery('[data-fancybox]').fancybox({
				arrows : true,
				infobar : false,
				toolbar : false,
				afterShow: function() {
					var formid = $('form').parents('div[id]').attr("id");
					var formidselector = '#' + formid;
			        acf.do_action('show', $(formidselector) ); // this is the action that should actually make all fields including gmap visible
			        acf.do_action('google_map_init', '#acf-field_59bfd44d99af8'); // I also tried this one to target the field itself
			    },
			    afterClose: function(){
				    parent.location.href = parent.location.href;
				},
			});
		});
	</script>
<?php
}

add_action( 'wp_head', 'fptheme_fancybox_initialize' );
?>