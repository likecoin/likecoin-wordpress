<?php
require_once dirname( __FILE__ ) . '/../includes/class-likecoin-matters-api.php';

function likecoin_save_to_matters( $post_id, $post, $update ) {
	if ( 'draft' !== get_post_status( $post_id ) ) {
		return;
	}
	$content          = apply_filters( 'the_content', $post->post_content );
	$title            = apply_filters( 'the_title', $post->post_title );
	$api              = LikeCoin_Matters_API::get_instance();
	$matters_draft_id = get_post_meta( $post_id, LC_MATTERS_DRAFT_ID, true );

	if ( $update && $matters_draft_id ) {
		$draft = $api->update_draft( $matters_draft_id, $title, $content );
		if ( ! isset( $draft['id'] ) ) {
			delete_post_meta( $post_id, LC_MATTERS_DRAFT_ID );
		} elseif ( $draft['id'] !== $matters_draft_id ) {
			$matters_draft_id = $draft['id'];
			update_post_meta( $post_id, LC_MATTERS_DRAFT_ID, $matters_draft_id );
		}
	} else {
		$draft = $api->new_draft( $title, $content );
		// TODO: handle create fail
		$matters_draft_id = $draft['id'];
		update_post_meta( $post_id, LC_MATTERS_DRAFT_ID, $matters_draft_id );
	}
}

function likecoin_publish_to_matters( $post_id, $post ) {
	$content          = apply_filters( 'the_content', $post->post_content );
	$title            = apply_filters( 'the_title', $post->post_title );
	$api              = LikeCoin_Matters_API::get_instance();
	$matters_draft_id = get_post_meta( $post_id, LC_MATTERS_DRAFT_ID, true );
	if ( ! $matters_draft_id ) {
		$draft = $api->new_draft( $title, $content );
		// TODO: handle create fail
		$matters_draft_id = $draft['id'];
	} else {
		$api->update_draft( $matters_draft_id, $title, $content );
		// TODO: handle update fail
	}
	$res = $api->publish_draft( $matters_draft_id );
	// TODO: handle publish fail
}
