<?php

// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain

function likecoin_set_admin_errors( $message, $type = 'general' ) {
	$error   = array(
		'message' => $message,
		'type'    => $type,
	);
	$user_id = get_current_user_id();
	set_transient( "likecoin_errors_{$user_id}", $error, 10 );
}

function likecoin_get_admin_errors() {
	$user_id = get_current_user_id();
	$error   = get_transient( "likecoin_errors_{$user_id}" );
	return $error;
}

function likecoin_clear_admin_errors() {
	$user_id = get_current_user_id();
	delete_transient( "likecoin_errors_{$user_id}" );
}

function likecoin_show_admin_errors() {
	$user_id = get_current_user_id();
	$error   = get_transient( "likecoin_errors_{$user_id}" );
	if ( $error ) {
		if ( 'publish' === $error['type'] ) {
			$title       = __( 'LikeCoin publish error', LC_PLUGIN_SLUG );
			$option_page = LC_PUBLISH_SITE_OPTIONS_PAGE;
		} else {
			$title       = __( 'LikeCoin plugin error:', LC_PLUGIN_SLUG );
			$option_page = LC_BUTTON_SITE_OPTIONS_PAGE;
		}
		?>
		<div class="notice notice-error">
			<p><?php echo esc_html( $title ); ?></p>
			<p><?php echo esc_html( $error['message'] ); ?></p>
			<a href="
			<?php echo esc_url( admin_url( 'options-general.php?page=' . $option_page ) ); ?> "><?php esc_html__( 'Please confirm your settings are correct', LC_PLUGIN_SLUG ); ?></a>
		</div>
		<?php
		// do not delete since gutenberg fetch edit post once before restful
		// delete_transient( "likecoin_errors_{$user_id}" );
	}
}
