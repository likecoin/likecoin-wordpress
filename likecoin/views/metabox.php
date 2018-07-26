<?php
  function likecoin_add_meta_box($post) {
    $author = $post->post_author;
    $likecoin_id = get_user_meta($author, 'lc_likecoin_id', true);
    $likecoin_wallet = get_user_meta($author, 'lc_likecoin_wallet', true);
    $widget_position = get_post_meta($post->ID, 'lc_widget_position', true);
    if (!$widget_position) $widget_position = get_user_meta($author, 'lc_widget_position', true);
    if (!$widget_position) $widget_position = '';
    $has_likecoin_id = strlen($likecoin_id) > 0;
?>
<section class="likecoin loginSection" style="<?php echo $has_likecoin_id ? 'display: none' : ''; ?>">
  <div class="likecoin metaMask" style="display: none">
    <h3>Need Meta Mask Plugin</h3>
  </div>
  <div class="likecoin needMainNet" style="display: none">
    <h3>Please switch to Main Network</h3>
  </div>
  <div class="likecoin needUnlock" style="display: none">
    <h3>Please unlock your wallet</h3>
  </div>
  <div class="likecoin needLikeCoinId" style="display: none">
    <h3>Need Like Coin Id</h3>
  </div>
  <div class="likecoin needLogin" style="display: none">
    <h3><a class="loginBtn" style="cursor: pointer">Login to get Like Coin Id</a></h3>
  </div>
</section>
<section class="likecoin optionsSection" style="<?php echo $has_likecoin_id ? '' : 'display: none'; ?>">
  <div style="display:flex">
    <section>
      <div id="updateLikeCoinIdStatus"></div>
      <div>LikeCoin Id: <span id="likecoinId"><?php echo sanitize_text_field($likecoin_id); ?></span>
        <a class="changeBtn" style="cursor: pointer">change</a></div>
      <div>LikeCoin Wallet: <span id="likecoinWallet"><?php echo sanitize_text_field($likecoin_wallet); ?></span></div>
      <label for="lc_widget_option">Display Option</label>
      <select name="lc_widget_option" id="lc_widget_option" class="postbox">
          <option value="both" <?php if ( $widget_position === 'both' ) echo 'selected'; ?>>Top and bottom</option>
          <option value="top" <?php if ( $widget_position === 'top' ) echo 'selected'; ?>>Top</option>
          <option value="bottom" <?php if ( $widget_position === 'bottom' ) echo 'selected'; ?>>Bottom</option>
          <option value="none" <?php if ( $widget_position === 'none' ) echo 'selected'; ?>>None</option>
      </select>
    </section>
    <section style="flex:1;-webkit-flex:1;-ms-flex:1">
      <iframe id="likecoinPreview" scrolling="no" frameborder="0"
        style="pointer-events: none; height: 212px; width: 100%;"
        src="<?php if ( $has_likecoin_id ) echo 'https://button.like.co/in/embed/' . sanitize_text_field($likecoin_id) . '/button'; ?>"
      ></iframe>
    </section>
  </div>
</section>
<?php
  wp_enqueue_script( 'lc_metabox', LC_URI . 'assets/js/likecoin.js', false );
  wp_localize_script(
    'lc_metabox',
    'WP_CONFIG',
    [
      'adminAjaxUrl' => admin_url('admin-ajax.php'),
    ]
  );
  }
?>
