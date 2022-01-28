<?php
/**
 * LikeCoin Matters API client
 *
 * HTTP client for firing GraphQL request to matters
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

/**
 * Inclue required files.
 */
require_once dirname( __FILE__ ) . '/constant/options.php';

/**
 * Matters API Client Class
 */
class LikeCoin_Matters_API {

	/**
	 * Singleton instance
	 *
	 * @var string
	 */
	private static $instance = null;
	/**
	 * GraphQL API endpoint URL
	 *
	 * @var string
	 */
	private $base_url;
	/**
	 * Access token to be used in auth header
	 *
	 * @var string
	 */
	private $access_token;


	/**
	 * Construcut Matters API client instance.
	 */
	private function __construct() {
		$this->base_url     = LC_MATTERS_API_ENDPOINT;
		$this->access_token = '';
	}


	/**
	 * Set instance base URL.
	 *
	 * @param string| $base_url The GraphQL endpoint.
	 */
	public function set_base_url( $base_url ) {
		$this->base_url = $base_url;
	}


	/**
	 * Set instance access token to be used in auth header.
	 *
	 * @param string| $access_token Matters access token to be userd.
	 */
	public function set_access_token( $access_token ) {
		$this->access_token = $access_token;
	}

	/**
	 * Login matters, ignore access token in this method.
	 *
	 * @param string| $email User email.
	 * @param string| $password User password.
	 */
	public function login( $email, $password ) {
		$request = wp_remote_post(
			$this->base_url,
			array(
				'headers' => array(
					'Content-Type' => 'application/json',
				),
				'body'    => wp_json_encode(
					array(
						'query' => 'mutation {
							userLogin(input: {
								email: ' . wp_json_encode( $email ) . ',
								password: ' . wp_json_encode( $password ) . ',
							}) {
								auth
								token
							}
						}',
					)
				),
			)
		);

		if ( is_wp_error( $request ) ) {
			return array( 'error' => $request->get_error_message() );
		}
			$decoded_response = json_decode( $request['body'], true );
		if ( ! $decoded_response ) {
			return array( 'error' => $request['body'] );
		}
		return $decoded_response;
	}

	// phpcs:disable WordPress.PHP.DevelopmentFunctions.error_log_error_log

	/**
	 * Post GraphQL query/mutation to matters.
	 *
	 * @param array|  $payload Query payload.
	 * @param string| $access_token Access token of user.
	 */
	private function post_query( $payload, $access_token = null ) {
		$request = wp_remote_post(
			$this->base_url,
			array(
				'headers' => array(
					'Content-Type'   => 'application/json',
					'x-access-token' => isset( $access_token ) ? $access_token : $this->access_token,
				),
				'body'    => wp_json_encode(
					array(
						'query' => $payload,
					)
				),
			)
		);
		if ( is_wp_error( $request ) ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG === true ) {
				error_log( $request->get_error_message() );
			}
			return array( 'error' => $request->get_error_message() );
		}
		$decoded_response = json_decode( $request['body'], true );
		if ( ! $decoded_response || ! isset( $decoded_response['data'] ) ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG === true ) {
				error_log( $request['body'] );
			}
			return array( 'error' => $request['body'] );
		}
		return $decoded_response['data'];
	}

	/**
	 * Post GraphQL single file upload to matters.
	 *
	 * @param array| $query Query payload.
	 * @param array| $variables Query variables.
	 * @param array| $file File infomation.
	 */
	private function post_multipart_query( $query, $variables, $file ) {
		WP_Filesystem();
		global $wp_filesystem;
		$file_path      = $file['path'];
		$filename       = $file['filename'];
		$file_mime_type = $file['mime_type'];
		$file_content   = $wp_filesystem->get_contents( $file_path );
		if ( false === $file_content ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG === true ) {
				error_log( 'Fail to get file content: ' . $file_path );
			}
			return array( 'error' => 'Fail to get file content: ' . $file_path );
		}
		// phpcs:disable WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
		$boundary = base64_encode( wp_generate_password( 24 ) );
		// phpcs:enable WordPress.PHP.DiscouragedPHPFunctions.obfuscation_base64_encode
		$body    = '--' . $boundary . "\r\n";
		$body   .= "Content-Disposition: form-data; name=\"operations\"\r\n";
		$body   .= "\r\n";
		$body   .= wp_json_encode(
			array(
				'query'     => $query,
				'variables' => $variables,
			)
		) . "\r\n";
		$body   .= '--' . $boundary . "\r\n";
		$body   .= "Content-Disposition: form-data; name=\"map\"\r\n";
		$body   .= "\r\n";
		$body   .= "{ \"0\": [\"variables.input.file\"] }\r\n";
		$body   .= '--' . $boundary . "\r\n";
		$body   .= 'Content-Disposition: form-data; name="0"; filename="' . $filename . "\"\r\n";
		$body   .= 'Content-Type: ' . $file_mime_type . "\r\n";
		$body   .= "Content-Transfer-Encoding: binary\r\n";
		$body   .= "\r\n";
		$body   .= $file_content . "\r\n";
		$body   .= "\r\n";
		$body   .= '--' . $boundary . '--';
		$request = wp_remote_post(
			$this->base_url,
			array(
				'headers' => array(
					'Content-Type'   => 'multipart/form-data; boundary=' . $boundary,
					'x-access-token' => $this->access_token,
				),
				'body'    => $body,
			)
		);
		if ( is_wp_error( $request ) ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG === true ) {
				error_log( $request->get_error_message() );
			}
			return array( 'error' => $request->get_error_message() );
		}
		$decoded_response = json_decode( $request['body'], true );
		if ( ! $decoded_response || ! isset( $decoded_response['data'] ) ) {
			if ( defined( 'WP_DEBUG' ) && WP_DEBUG === true ) {
				error_log( $request['body'] );
			}
			return array( 'error' => $request['body'] );
		}
		return $decoded_response['data'];
	}

	/**
	 * Post new draft mutation.
	 *
	 * @param string| $title Draft title.
	 * @param string| $html_content Draft HTML content.
	 * @param array|  $tags Array of tag strings.
	 * @param boolean| $show_error Determine if show likecoin error message.
	 */
	public function new_draft( $title, $html_content, $tags, $show_error = false ) {
		if ( ( false === $show_error || ! $show_error ) && ! $html_content ) {
			return;
		}
		if ( true === $show_error && ! $html_content ) {
			return array( 'error' => 'EMPTY_CONTENT' );
		}
		$payload  = 'mutation {
      putDraft(input: {
        title: ' . wp_json_encode( $title ) . ',
        content: ' . wp_json_encode( $html_content ) . ',
        tags: ' . wp_json_encode( $tags ) . ',
      }) {
        id
      }
		}';
		$response = $this->post_query( $payload );
		if ( isset( $response['error'] ) ) {
			return $response;
		}
		return $response['putDraft'];
	}

	/**
	 * Update draft mutation.
	 *
	 * @param string| $id Draft ID to be updated.
	 * @param string| $title Draft title.
	 * @param string| $html_content Draft HTML content.
	 * @param array|  $tags Array of tag strings.
	 */
	public function update_draft( $id, $title, $html_content, $tags ) {
		$payload  = 'mutation {
      putDraft(input: {
        id: ' . wp_json_encode( $id ) . ',
        title: ' . wp_json_encode( $title ) . ',
        content: ' . wp_json_encode( $html_content ) . ',
        tags: ' . wp_json_encode( $tags ) . ',
      }) {
        id
      }
		}';
		$response = $this->post_query( $payload );
		if ( isset( $response['error'] ) ) {
			return $response;
		}
		return $response['putDraft'];
	}

	/**
	 * Publish draft mutation.
	 *
	 * @param string| $id Draft ID to be published.
	 */
	public function publish_draft( $id ) {
		$payload  = 'mutation {
      publishArticle(input: {
				id: ' . wp_json_encode( $id ) . ',
      }) {
        id
      }
    }';
		$response = $this->post_query( $payload );
		if ( isset( $response['error'] ) ) {
			return $response;
		}
		return $response['publishArticle'];
	}

	/**
	 * Upload attachment file mutation.
	 *
	 * @param array|  $file File information.
	 * @param string| $draft_id Draft ID to be attached.
	 */
	public function post_attachment( $file, $draft_id ) {
		$type      = 'audio' === $file['type'] ? 'embedaudio' : 'embed';
		$payload   = 'mutation ($input: SingleFileUploadInput!) {
      singleFileUpload(input: $input) {
				... on Asset {
					id
					path
				}
      }
		}';
		$variables = array(
			'input' => array(
				'type'       => $type,
				'entityType' => 'draft',
				'entityId'   => wp_json_encode( $draft_id ),
				'file'       => null,
			),
		);
		$response  = $this->post_multipart_query( $payload, $variables, $file );
		if ( isset( $response['error'] ) ) {
			return $response;
		}
		return $response['singleFileUpload'];
	}

	/**
	 * Query Matters post status.
	 *
	 * @param string| $id Draft ID to be query.
	 */
	public function query_post_status( $id ) {
		$payload  = 'query {
      node(
        input:{
					id: ' . wp_json_encode( $id ) . ',
        }
      ) {
        ... on Draft {
          publishState
          article {
            id
            slug
            mediaHash
            dataHash
            author {
              userName
            }
          }
        }
      }
    }';
		$response = $this->post_query( $payload );
		if ( isset( $response['error'] ) ) {
			return $response;
		}
		return $response['node'];
	}

	/**
	 * Query Matters current user info.
	 *
	 * @param string| $access_token Access token of current user.
	 */
	public function query_user_info( $access_token = null ) {
		$payload  = 'query {
			viewer {
				id
				userName
				displayName
			}
    }';
		$response = $this->post_query( $payload, $access_token );
		if ( isset( $response['error'] ) ) {
			return $response;
		}
		return $response['viewer'];
	}

	/**
	 * Get singleton instance of this API client.
	 */
	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new LikeCoin_Matters_API();
		}
		$option = get_option( LC_PUBLISH_OPTION_NAME );
		if ( isset( $option[ LC_OPTION_SITE_MATTERS_USER ] ) &&
			isset( $option[ LC_OPTION_SITE_MATTERS_USER ][ LC_MATTERS_USER_ACCESS_TOKEN_FIELD ] ) ) {
			self::$instance->set_access_token( $option[ LC_OPTION_SITE_MATTERS_USER ][ LC_MATTERS_USER_ACCESS_TOKEN_FIELD ] );
		}
		return self::$instance;
	}
}
