<?php

class LikeCoin_Matters_API {

	private static $instance = null;
	private $base_url;
	private $access_token;

	private function __construct() {
	}

	public function set_base_url( $base_url ) {
		$this->base_url = $base_url;
	}

	public function set_access_token( $access_token ) {
		$this->access_token = $access_token;
	}

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
			error_log( $request->get_error_message() );
			// TODO: show error message
			return;
		}
		$decoded_response = json_decode( $request['body'], true );
		if ( ! $decoded_response || ! isset( $decoded_response['data'] ) ) {
			error_log( $request['body'] );
			// TODO: show error message
			return;
		}
		return $decoded_response['data'];
	}

	private function post_multipart_query( $query, $variables, $file ) {
		$file_path      = $file['path'];
		$filename       = $file['filename'];
		$file_mime_type = $file['mime_type'];
		$boundary       = base64_encode( wp_generate_password( 24 ) );
		$request        = wp_remote_post(
			$this->base_url,
			array(
				'headers' => array(
					'Content-Type'   => 'multipart/form-data; boundary=' . $boundary,
					'x-access-token' => $this->access_token,
				),
				'body'    => '--' . $boundary . "\r
Content-Disposition: form-data; name=\"operations\"\r
\r
" . wp_json_encode(
					array(
						'query'     => $query,
						'variables' => $variables,
					)
				) . "\r
--" . $boundary . "\r
Content-Disposition: form-data; name=\"map\"\r
\r
{ \"0\": [\"variables.input.file\"] }\r
--" . $boundary . "\r
Content-Disposition: form-data; name=\"0\"; filename=\"" . $filename . "\"\r
Content-Type: " . $file_mime_type . "\r
\r
" . file_get_contents( $file_path ) . "\r
\r
--" . $boundary . '--',
			)
		);
		if ( is_wp_error( $request ) ) {
			error_log( $request->get_error_message() );
			// TODO: show error message
			return;
		}
		$decoded_response = json_decode( $request['body'], true );
		if ( ! $decoded_response || ! isset( $decoded_response['data'] ) ) {
			error_log( $request['body'] );
			// TODO: show error message
			return;
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
		return $response['publishArticle'];
	}

	public function post_attachment( $file, $draft_id ) {
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
				'type'       => 'embed',
				'entityType' => 'draft',
				'entityId'   => wp_json_encode( $draft_id ),
				'file'       => null,
			),
		);
		$response  = $this->post_multipart_query( $payload, $variables, $file );
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
		return $response['putDraft'];
	}

	public static function get_instance() {
		if ( null === self::$instance ) {
			self::$instance = new LikeCoin_Matters_API();
		}
		return self::$instance;
	}
}
