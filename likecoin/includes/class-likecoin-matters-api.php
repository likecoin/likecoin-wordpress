<?php
require_once dirname( __FILE__ ) . '/constant/options.php';

class LikeCoin_Matters_API {

	private static $instance = null;
	private $base_url;
	private $access_token;

	private function __construct() {
		$this->base_url     = LC_MATTERS_API_ENDPOINT;
		$this->access_token = '';
	}

	public function set_base_url( $base_url ) {
		$this->base_url = $base_url;
	}

	public function set_access_token( $access_token ) {
		$this->access_token = $access_token;
	}

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

	private function post_query( $payload ) {
		$request = wp_remote_post(
			$this->base_url,
			array(
				'headers' => array(
					'Content-Type'   => 'application/json',
					'x-access-token' => $this->access_token,
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

	public function new_draft( $title, $html_content ) {
		$payload  = 'mutation {
      putDraft(input: {
        title: ' . wp_json_encode( $title ) . ',
        content: ' . wp_json_encode( $html_content ) . ',
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

	public function update_draft( $id, $title, $html_content ) {
		$payload  = 'mutation {
      putDraft(input: {
				id: ' . wp_json_encode( $id ) . ',
        title: ' . wp_json_encode( $title ) . ',
        content: ' . wp_json_encode( $html_content ) . ',
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
		return $response['putDraft'];
	}

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new LikeCoin_Matters_API();
		}
		$option = get_option( LC_PUBLISH_OPTION_NAME );
		if ( isset( $option[ LC_OPTION_SITE_MATTERS_ACCESS_TOKEN ] ) ) {
			self::$instance->set_access_token( $option[ LC_OPTION_SITE_MATTERS_ACCESS_TOKEN ] );
		}
		return self::$instance;
	}
}
