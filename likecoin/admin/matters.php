<?php

require_once dirname( __FILE__ ) . '/../includes/class-likecoin-matters-api.php';
require_once dirname( __FILE__ ) . '/views/matters.php';

function likecoin_save_to_matters( $post_id, $post, $update = true ) {
	if ( 'draft' !== get_post_status( $post_id ) ) {
		return;
	}
	$matters_info = get_post_meta( $post_id, LC_MATTERS_INFO, true );
	if ( ! $matters_info ) {
		$matters_info = array(
			'type' => 'post',
		);
	}
	if ( isset( $matters_info['published'] ) && $matters_info['published'] ) {
		return;
	}
	$matters_draft_id = isset( $matters_info['draft_id'] ) ? $matters_info['draft_id'] : null;
	add_filter( 'jetpack_photon_skip_image', '__return_true', 10, 3 );
	$content = apply_filters( 'the_content', $post->post_content );
	$content = likecoin_replace_matters_attachment_url( $content );
	$title   = apply_filters( 'the_title', $post->post_title );
	remove_filter( 'jetpack_photon_skip_image', '__return_true', 10, 3 );
	$api = LikeCoin_Matters_API::get_instance();
	if ( $update && $matters_draft_id ) {
		$draft = $api->update_draft( $matters_draft_id, $title, $content );
		if ( ! isset( $draft['id'] ) ) {
			unset( $matters_info['draft_id'] );
			$matters_draft_id = null;
			update_post_meta( $post_id, LC_MATTERS_INFO, $matters_info );
		} elseif ( $draft['id'] !== $matters_draft_id ) {
			$matters_draft_id         = $draft['id'];
			$matters_info['draft_id'] = $matters_draft_id;
			update_post_meta( $post_id, LC_MATTERS_INFO, $matters_info );
		}
	}
	if ( ! $matters_draft_id ) {
		$draft = $api->new_draft( $title, $content );
		// TODO: handle create fail
		$matters_info['draft_id'] = $draft['id'];
		update_post_meta( $post_id, LC_MATTERS_INFO, $matters_info );
	}
}

function likecoin_publish_to_matters( $post_id, $post ) {
	$matters_info = get_post_meta( $post_id, LC_MATTERS_INFO, true );
	if ( ! $matters_info ) {
		$matters_info = array(
			'type' => 'post',
		);
	}
	if ( isset( $matters_info['published'] ) && $matters_info['published'] ) {
		return;
	}
	$matters_draft_id = isset( $matters_info['draft_id'] ) ? $matters_info['draft_id'] : null;
	add_filter( 'jetpack_photon_skip_image', '__return_true', 10, 3 );
	$content = apply_filters( 'the_content', $post->post_content );
	$content = likecoin_replace_matters_attachment_url( $content );
	$title   = apply_filters( 'the_title', $post->post_title );
	remove_filter( 'jetpack_photon_skip_image', '__return_true', 10, 3 );
	$api = LikeCoin_Matters_API::get_instance();
	if ( ! $matters_draft_id ) {
		$draft = $api->new_draft( $title, $content );
		// TODO: handle create fail
		$matters_draft_id         = $draft['id'];
		$matters_info['draft_id'] = $matters_draft_id;
	} else {
		$api->update_draft( $matters_draft_id, $title, $content );
		// TODO: handle update fail
	}
	$res                       = $api->publish_draft( $matters_draft_id );
	$matters_info['published'] = true;
	update_post_meta( $post_id, LC_MATTERS_INFO, $matters_info );
	// TODO: handle publish fail
}

function likecoin_post_attachment_to_matters( $attachment_id ) {
	$attachment     = get_post( $attachment_id );
	$file_path      = get_attached_file( $attachment_id );
	$file_mime_type = get_post_mime_type( $attachment_id );
	$filename       = basename( $file_path );
	$parent_post    = $attachment->post_parent;
	if ( ! $parent_post ) {
		return;
	}
	$matters_info = get_post_meta( $parent_post, LC_MATTERS_INFO, true );
	if ( ! $matters_info ) {
		$matters_info = array(
			'type' => 'post',
		);
	}
	if ( isset( $matters_info['published'] ) && $matters_info['published'] ) {
		return;
	}
	$matters_draft_id = isset( $matters_info['draft_id'] ) ? $matters_info['draft_id'] : null;
	if ( ! $matters_draft_id ) {
		likecoin_save_to_matters( $parent_post, get_post( $parent_post ), false );
	}
	$attachment_type = null;
	if ( wp_attachment_is( 'image', $attachment_id ) ) {
		$attachment_type = 'image';
	} elseif ( wp_attachment_is( 'audio', $attachment_id ) ) {
		$attachment_type = 'audio';
	}
	if ( ! $attachment_type ) {
		return;
	}
	$api    = LikeCoin_Matters_API::get_instance();
	$res    = $api->post_attachment(
		array(
			'path'      => $file_path,
			'filename'  => $filename,
			'mime_type' => $file_mime_type,
			'type'      => $attachment_type,
		),
		$matters_draft_id
	);
	$params = array(
		'type'          => 'attachment',
		'url'           => $res['path'],
		'attachment_id' => $res['id'],
	);
	update_post_meta( $attachment_id, LC_MATTERS_INFO, $params );
}

function likecoin_check_should_hook_matters_draft() {
	$option = get_option( LC_PUBLISH_OPTION_NAME );
	return isset( $option[ LC_OPTION_SITE_MATTERS_ACCESS_TOKEN ] ) &&
	$option[ LC_OPTION_SITE_MATTERS_ACCESS_TOKEN ] &&
	isset( $option[ LC_OPTION_SITE_MATTERS_AUTO_DRAFT ] ) &&
	$option[ LC_OPTION_SITE_MATTERS_AUTO_DRAFT ];
}

function likecoin_check_should_hook_matters_publish() {
	$option = get_option( LC_PUBLISH_OPTION_NAME );
	return isset( $option[ LC_OPTION_SITE_MATTERS_ACCESS_TOKEN ] ) &&
	$option[ LC_OPTION_SITE_MATTERS_ACCESS_TOKEN ] &&
	isset( $option[ LC_OPTION_SITE_MATTERS_AUTO_PUBLISH ] ) &&
	$option[ LC_OPTION_SITE_MATTERS_AUTO_PUBLISH ];
}

function likecoin_add_matters_admin_hook() {
	if ( likecoin_check_should_hook_matters_draft() ) {
		add_action( 'save_post_post', 'likecoin_save_to_matters', 10, 3 );
		add_action( 'save_post_page', 'likecoin_save_to_matters', 10, 3 );
	}
	if ( likecoin_check_should_hook_matters_publish() ) {
		add_action( 'publish_post', 'likecoin_publish_to_matters', 10, 2 );
	} elseif ( likecoin_check_should_hook_matters_draft() ) {
		add_action( 'publish_post', 'likecoin_save_to_matters', 10, 2 );
	}
}

function likecoin_add_matters_restful_hook() {
	if ( likecoin_check_should_hook_matters_draft() || likecoin_check_should_hook_matters_publish() ) {
		add_action( 'add_attachment', 'likecoin_post_attachment_to_matters', 10, 2 );
	}
}
