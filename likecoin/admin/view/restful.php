<?php
/**
 * LikeCoin restful view
 *
 * Index of data preparation function used by restful function
 *
 * @package   LikeCoin
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// phpcs:disable WordPress.WP.I18n.NonSingularStringLiteralDomain, WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase

/**
 * Require Matters files
 */
require_once dirname( __FILE__ ) . '/../metabox.php';
require_once dirname( __FILE__ ) . '/../post.php';
require_once dirname( __FILE__ ) . '/../iscn.php';
require_once dirname( __FILE__ ) . '/view.php';

/**
 * Remove matters access token from publisb option
 */
function likecoin_get_publish_option_for_restful() {
	$publish_options = get_option( LC_PUBLISH_OPTION_NAME );
	// Don't give access token to frontend, not useful and security risk.
	if ( isset( $publish_options['site_matters_user']['access_token'] ) ) {
		unset( $publish_options['site_matters_user']['access_token'] );
	}
	return $publish_options;
}

/**
 * Post options data to WordPress database.
 *
 * @param WP_REST_Request $request Full data about the request.
 */
function likecoin_post_main_plugin_options( $request ) {
	$plugin_options          = get_option( LC_BUTTON_OPTION_NAME );
	$params                  = $request->get_json_params();
	$site_liker_id_enabled   = $params['siteLikerIdEnabled'];
	$display_option          = $params['displayOption'];
	$per_post_option_enabled = $params['perPostOptionEnabled'];
	$liker_infos             = $params['siteLikerInfos'];

	$plugin_options['site_likecoin_id_enbled']         = $site_liker_id_enabled;
	$plugin_options[ LC_OPTION_BUTTON_DISPLAY_OPTION ] = $display_option;
	$plugin_options['button_display_author_override']  = $per_post_option_enabled;
	$plugin_options['site_likecoin_user']              = $liker_infos;

	update_option( LC_BUTTON_OPTION_NAME, $plugin_options );
	$plugin_options = get_option( LC_BUTTON_OPTION_NAME );

	$result['code']    = 200;
	$result['data']    = $plugin_options;
	$result['message'] = 'Successfully POST!';
	return rest_ensure_response( $result );
}
/**
 * Get options data from WordPress database.
 *
 * @param WP_REST_Request $request Full data about the request.
 */
function likecoin_get_main_plugin_options( $request ) {
	$plugin_options = get_option( LC_BUTTON_OPTION_NAME );
	if ( ! $plugin_options ) {
		return;
	}
	$result['code']    = 200;
	$result['data']    = $plugin_options;
	$result['message'] = 'Successfully GET main plugin setting data!';
	return rest_ensure_response( $result );
}
/**
 * Post user data to WordPress database.
 *
 * @param WP_REST_Request $request Full data about the request.
 */
function likecoin_post_user_data( $request ) {
	$user          = wp_get_current_user();
	$user_id       = $user->ID;
	$likecoin_user = get_user_meta( $user_id, 'lc_likecoin_user', true );
	$likecoin_id   = get_user_meta( $user_id, 'lc_likecoin_id', true );
	$params        = $request->get_json_params();
	$liker_infos   = $params['userLikerInfos'];
	$likecoin_user = $liker_infos;
	$likecoin_id   = $liker_infos['likecoin_id'];

	update_user_meta( $user_id, 'lc_likecoin_user', $likecoin_user );
	update_user_meta( $user_id, 'lc_likecoin_id', $likecoin_id );

	// retrieve latest data.
	$likecoin_user = get_user_meta( $user_id, 'lc_likecoin_user', true );
	$likecoin_id   = get_user_meta( $user_id, 'lc_likecoin_id', true );

	$result['code']                  = 200;
	$result['data']['likecoin_user'] = $likecoin_user;
	$result['data']['likecoin_id']   = $likecoin_id;
	return rest_ensure_response( $result );
}
/**
 * Get user data from WordPress database.
 *
 * @param WP_REST_Request $request Full data about the request.
 */
function likecoin_get_user_data( $request ) {
	$user          = wp_get_current_user();
	$user_id       = $user->ID;
	$likecoin_user = get_user_meta( $user_id, 'lc_likecoin_user', true );
	if ( ! $likecoin_user ) {
		return;
	}
	$likecoin_id                     = get_user_meta( $user_id, 'lc_likecoin_id', true );
	$result['code']                  = 200;
	$result['data']['likecoin_user'] = $likecoin_user;
	$result['data']['likecoin_id']   = $likecoin_id;
	return rest_ensure_response( $result );
}
/**
 * Post matters login data to WordPress database.
 *
 * @param WP_REST_Request $request Full data about the request.
 */
function likecoin_post_site_publish_options_data( $request ) {
	$publish_options = get_option( LC_PUBLISH_OPTION_NAME );
	$params          = $request->get_json_params();
	if ( isset( $params['siteMattersAutoSaveDraft'] ) ) {
		$publish_options['site_matters_auto_save_draft'] = $params['siteMattersAutoSaveDraft'];
	}
	if ( isset( $params['siteMattersAutoPublish'] ) ) {
		$publish_options['site_matters_auto_publish'] = $params['siteMattersAutoPublish'];
	}
	if ( isset( $params['siteMattersAddFooterLink'] ) ) {
		$publish_options['site_matters_add_footer_link'] = $params['siteMattersAddFooterLink'];
	}
	if ( isset( $params['ISCNBadgeStyleOption'] ) ) {
		$publish_options['iscn_badge_style_option'] = $params['ISCNBadgeStyleOption'];
	}
	update_option( LC_PUBLISH_OPTION_NAME, $publish_options );
	$return_payload = likecoin_get_publish_option_for_restful();
	$result['code'] = 200;
	$result['data'] = $return_payload;
	return rest_ensure_response( $result );
}
/**
 * Post matters login data to WordPress database.
 *
 * @param WP_REST_Request $request Full data about the request.
 */
function likecoin_login_matters( $request ) {
	$params               = $request->get_json_params();
	$matters_id           = $params['mattersId'];
	$matters_password     = $params['mattersPassword'];
	$api                  = LikeCoin_Matters_API::get_instance();
	$results              = $api->login( $matters_id, $matters_password );
	$matters_access_token = isset( $results['data']['userLogin']['token'] ) ? $results['data']['userLogin']['token'] : null;
	$user_info_results    = array();
	if ( isset( $matters_access_token ) ) {
		$user_info_results             = $api->query_user_info( $matters_access_token );
		$matters_info                  = array();
		$matters_info['matters_token'] = $matters_access_token;
		$matters_info['matters_id']    = $user_info_results['userName'];
		likecoin_save_site_matters_login_data( $matters_info );
		return rest_ensure_response( array_merge( $results['data'], array( 'viewer' => $user_info_results ) ) );
	} else {
		return rest_ensure_response( $results );
	}
}
/**
 * Log out from Matters
 *
 * @param WP_REST_Request $request Full data about the request.
 */
function likecoin_logout_matters( $request ) {
	likecoin_logout_matters_session();
	$result['code'] = 200;
	return rest_ensure_response( $result );
}
/**
 * Post matters login data to WordPress database.
 *
 * @param array | $matters_info valid matters login info.
 */
function likecoin_save_site_matters_login_data( $matters_info ) {
	$publish_options                                      = get_option( LC_PUBLISH_OPTION_NAME );
	$publish_options['site_matters_user']['matters_id']   = $matters_info['matters_id'];
	$publish_options['site_matters_user']['access_token'] = $matters_info['matters_token'];
	update_option( LC_PUBLISH_OPTION_NAME, $publish_options );
	$return_payload = likecoin_get_publish_option_for_restful();
	$result['code'] = 200;
	$result['data'] = $return_payload;
	return rest_ensure_response( $result );
}
/**
 * Get matters login data from WordPress database.
 *
 * @param WP_REST_Request $request Full data about the request.
 */
function likecoin_get_site_matters_data( $request ) {
	$return_payload = likecoin_get_publish_option_for_restful();
	// incl. login and publish data.
	if ( ! $return_payload ) {
		$return_payload = array();
	}
	$result['code'] = 200;
	$result['data'] = $return_payload;
	return rest_ensure_response( $result );
}

/**
 * Add refresh publish status endpoint
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Response
 */
function likecoin_rest_refresh_publish_status( $request ) {
	$post_id = $request['id'];
	$post    = get_post( $post_id );
	if ( ! isset( $post ) ) {
		return new WP_Error( 'post_not_found', __( 'Post was not found', LC_PLUGIN_SLUG ), array( 'status' => 404 ) );
	}
	$publish_params              = likecoin_get_meta_box_publish_params( $post, true );
	$data                        = likecoin_parse_publish_status( $publish_params );
	$data['wordpress_published'] = get_post_status( $post_id );
	return new WP_REST_Response( $data, 200 );
}

/**
 * Get post data and metadata as json
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Response
 */
function likecoin_rest_prepare_post_iscn_register_data( $request ) {
	$post_id = $request['id'];
	$post    = get_post( $post_id );
	if ( ! isset( $post ) ) {
		return new WP_Error( 'post_not_found', __( 'Post was not found', LC_PLUGIN_SLUG ), array( 'status' => 404 ) );
	}
	$files          = likecoin_format_post_to_json_data( $post );
	$response       = array(
		'files' => $files,
	);
	$publish_params = likecoin_get_meta_box_publish_params( $post, true );
	if ( isset( $publish_params['ipfs_hash'] ) ) {
		$response['mattersIPFSHash']             = $publish_params['ipfs_hash'];
		$response['mattersId']                   = $publish_params['matters_id'];
		$response['mattersPublishedArticleHash'] = $publish_params['article_hash'];
		$response['mattersArticleId']            = $publish_params['article_id'];
		$response['mattersArticleSlug']          = $publish_params['article_slug'];
	}
	$iscn_related_post_meta        = likecoin_get_post_iscn_meta( $post );
	$response['title']             = $iscn_related_post_meta['title'];
	$response['author']            = $iscn_related_post_meta['author'];
	$response['authorDescription'] = $iscn_related_post_meta['author_description'];
	$response['description']       = $iscn_related_post_meta['description'];
	$response['url']               = $iscn_related_post_meta['url'];
	$response['tags']              = $iscn_related_post_meta['tags'];
	return new WP_REST_Response( $response, 200 );
}

/**
 * Add likecoin arweave Id and IPFS data saving endpoint.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Response
 */
function likecoin_rest_arweave_save_metadata( $request ) {
	$post_id                    = $request['id'];
	$arweave_info['ipfs_hash']  = $request['arweaveIPFSHash'];
	$arweave_info['arweave_id'] = $request['arweaveId'];
	update_post_meta( $post_id, LC_ARWEAVE_INFO, $arweave_info );
	return new WP_REST_Response( array( 'data' => $arweave_info ), 200 );
}

/**
 * Add submit iscn hash endpoint
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Response
 */
function likecoin_rest_update_iscn_hash_and_version( $request ) {
	$post_id = $request['id'];
	$params  = $request->get_json_params();
	$post    = get_post( $post_id );
	if ( ! isset( $post ) ) {
		return new WP_Error( 'post_not_found', __( 'Post was not found', LC_PLUGIN_SLUG ), array( 'status' => 404 ) );
	}
	$iscn_mainnet_info = get_post_meta( $post_id, LC_ISCN_INFO, true );
	if ( ! is_array( $iscn_mainnet_info ) ) {
		$iscn_mainnet_info = array();
	}
	if ( isset( $params['iscnHash'] ) ) {
		$iscn_hash                      = $params['iscnHash'];
		$iscn_mainnet_info['iscn_hash'] = $iscn_hash;
	}
	$data = array();
	if ( isset( $params['iscnId'] ) ) {
		$iscn_id                      = $params['iscnId'];
		$iscn_mainnet_info['iscn_id'] = $iscn_id;
		$data['iscn_id']              = $iscn_id;
	}
	if ( isset( $params['iscnVersion'] ) && isset( $params['iscnTimestamp'] ) ) {
		$iscn_version                         = $params['iscnVersion'];
		$iscn_timestamp                       = $params['iscnTimestamp'];
		$iscn_mainnet_info['iscn_version']    = $iscn_version;
		$iscn_mainnet_info['last_saved_time'] = $iscn_timestamp;
		$data['iscnVersion']                  = $iscn_version;
		$data['iscnTimestamp']                = $iscn_timestamp;
	}
	// only allow to publish to mainnet going forward.
	update_post_meta( $post_id, LC_ISCN_INFO, $iscn_mainnet_info );
	return new WP_REST_Response( $data, 200 );
}

/**
 * Add get ISCN related info.
 *
 * @param WP_REST_Request $request Full data about the request.
 * @return WP_Error|WP_REST_Response
 */
function likecoin_get_iscn_full_info( $request ) {
	$post_id = $request['id'];
	$params  = $request->get_json_params();
	$post    = get_post( $post_id );
	if ( ! isset( $post ) ) {
		return new WP_Error( 'post_not_found', __( 'Post was not found', LC_PLUGIN_SLUG ), array( 'status' => 404 ) );
	}
	$iscn_full_info = array();
	$iscn_info      = get_post_meta( $post_id, LC_ISCN_INFO, true );
	if ( is_array( $iscn_info ) ) {
		$iscn_full_info['iscnHash'] = $iscn_info['iscn_hash'];
		$iscn_full_info['iscnId']   = $iscn_info['iscn_id'];
		// iscnVersion should be taken from chain API.
		$iscn_full_info['iscnTimestamp'] = $iscn_info['last_saved_time'];
		$iscn_full_info['iscnVersion']   = $iscn_info['iscn_version'];
	}
	$arweave_info = get_post_meta( $post_id, LC_ARWEAVE_INFO, true );
	if ( is_array( $arweave_info ) ) {
		$iscn_full_info['arweaveId']       = $arweave_info['arweave_id'];
		$iscn_full_info['arweaveIPFSHash'] = $arweave_info['ipfs_hash'];
	}
	$publish_params = likecoin_get_meta_box_publish_params( $post, true );
	if ( is_array( $publish_params ) ) {
		$iscn_full_info['mattersIPFSHash']             = $publish_params['ipfs_hash'];
		$iscn_full_info['mattersArticleId']            = $publish_params['article_id'];
		$iscn_full_info['mattersPublishedArticleHash'] = $publish_params['article_hash'];
		$iscn_full_info['mattersId']                   = $publish_params['matters_id'];
		$iscn_full_info['mattersArticleSlug']          = $publish_params['article_slug'];
	}
	$iscn_related_post_meta              = likecoin_get_post_iscn_meta( $post );
	$iscn_full_info['title']             = $iscn_related_post_meta['title'];
	$iscn_full_info['author']            = $iscn_related_post_meta['author'];
	$iscn_full_info['authorDescription'] = $iscn_related_post_meta['author_description'];
	$iscn_full_info['description']       = $iscn_related_post_meta['description'];
	$iscn_full_info['url']               = $iscn_related_post_meta['url'];
	$iscn_full_info['tags']              = $iscn_related_post_meta['tags'];
	return new WP_REST_Response( $iscn_full_info, 200 );
}

