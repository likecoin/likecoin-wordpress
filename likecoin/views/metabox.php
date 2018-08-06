<?php
function likecoin_add_meta_box( $post ) {
	$author          = $post->post_author;
	$likecoin_id     = get_user_meta( $author, 'lc_likecoin_id', true );
	$likecoin_wallet = get_user_meta( $author, 'lc_likecoin_wallet', true );
	$widget_position = get_post_meta( $post->ID, 'lc_widget_position', true );
	if ( ! $widget_position ) {
		$widget_position = get_user_meta( $author, 'lc_widget_position', true );
	}
	if ( ! $widget_position ) {
		$widget_position = '';
	}
	$has_likecoin_id = strlen( $likecoin_id ) > 0;
	?>
<section class="likecoin loginSection" style="<?php echo $has_likecoin_id ? 'display: none' : ''; ?>">
	<div class="likecoin webThreeError needMetaMask" style="display: none">
	<h3>Need <a href="https://metamask.io/" target="_blank">Meta Mask Plugin</a></h3>
	</div>
	<div class="likecoin webThreeError needMainNet" style="display: none">
	<h3>Please switch to Main Network</h3>
	</div>
	<div class="likecoin webThreeError needUnlock" style="display: none">
	<h3>Please unlock your wallet</h3>
	</div>
	<div class="likecoin webThreeError needLikeCoinId" style="display: none">
	<h3><a href="https://like.co/in/register" target="_blank">Please register a LikeCoin Id first</a></h3>
	</div>
	<div class="likecoin webThreeError needLogin" style="display: none">
	<h3><a class="loginBtn" style="cursor: pointer">Login to get LikeCoin Id</a></h3>
	</div>
</section>
<section class="likecoin optionsSection" style="<?php echo $has_likecoin_id ? '' : 'display: none'; ?>">
	<div class="optionsContainer">
	<section>
		<div id="updateLikeCoinIdStatus"></div>
		<div class="label">LikeCoin ID <a class="changeBtn">change</a>
			<div class="field" id="likecoinId">
				<a href="https://like.co/<?php echo esc_attr( $likecoin_id ); ?>">
					<?php echo esc_html( $likecoin_id ); ?>
				</a>
			</div>
		</div>
		<div class="label">LikeCoin Wallet
			<div class="field" id="likecoinWallet"><?php echo esc_html( substr( $likecoin_wallet, 0, 6 ) . '...' . substr( $likecoin_wallet, 38, 4 ) ); ?></div>
		</div>
		<div class="label">
			<label for="lc_widget_option">Display Option</label>
			<div><select name="lc_widget_option" id="lc_widget_option" class="postbox">
				<option value="both" 
				<?php
				if ( 'both' === $widget_position ) {
					echo 'selected';
				}
				?>
				>Top and bottom</option>
				<option value="top" 
				<?php
				if ( 'top' === $widget_position ) {
					echo 'selected';
				}
				?>
				>Top</option>
				<option value="bottom" 
				<?php
				if ( 'bottom' === $widget_position ) {
					echo 'selected';
				}
				?>
				>Bottom</option>
				<option value="none" 
				<?php
				if ( 'none' === $widget_position ) {
					echo 'selected';
				}
				?>
				>None</option>
			</select></div>
		</div>
	</section>
	<section class="previewSection">
		<span>This LikeCoin Widget will be shown in your post:</span>
		<a class="icon" href="https://like.co/in" target="_blank"><?php echo file_get_contents( LC_DIR . 'assets/icon/settings.svg' ); ?></a>
		<iframe id="likecoinPreview" scrolling="no" frameborder="0"
		style="pointer-events: none; height: 212px; width: 100%;"
		src="
		<?php
		if ( $has_likecoin_id ) {
			echo esc_url( 'https://button.like.co/in/embed/' . $likecoin_id . '/button' );
		}
		?>
		"
		></iframe>
	</section>
	</div>
	<?php wp_nonce_field( 'lc_save_post', 'lc_metabox_nonce' ); ?>
</section>
	<?php
	wp_register_style( 'lc_metabox', LC_URI . 'assets/css/metabox.css' );
  wp_enqueue_style( 'lc_metabox' );
	wp_enqueue_script( 'lc_metabox', LC_URI . 'assets/js/likecoin.es5.js', false, LC_PLUGIN_VERSION, true );
	wp_localize_script(
		'lc_metabox',
		'WP_CONFIG',
		[
			'nonce'        => wp_create_nonce( 'lc_metabox_ajax' ),
			'adminAjaxUrl' => admin_url( 'admin-ajax.php' ),
		]
	);
}
?>
