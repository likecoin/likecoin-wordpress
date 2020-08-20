<?php
function likecoin_load_editor_scripts() {
	// check for gutenberg
	if ( ! function_exists( 'has_blocks' ) ) {
		return;
	}
	wp_enqueue_script(
		'lc_js_editor',
		LC_URI . 'assets/js/dist/admin/likecoin_editor.js',
		array( 'wp-editor', 'wp-i18n' ),
		LC_PLUGIN_VERSION,
		true
	);
}
