<?php
  function likecoin_add_meta_box($post) {
    $author = $post->post_author;
    $likecoin_id = get_user_meta($post->post_author, 'lc_likecoin_id', true);
    $likecoin_wallet = get_user_meta($post->post_author, 'lc_likecoin_wallet', true);
?>
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
<div class="likecoin hasLikeCoinId" style="<?php echo strlen($likecoin_id) > 0 ? '' : 'display: none'; ?>">
  <label>Author Id: <?php echo esc_attr($author); ?></label>
  <label>LikeCoin Id: <?php echo esc_attr($likecoin_id); ?></label>
  <label>LikeCoin Wallet: <?php echo esc_attr($likecoin_wallet); ?></label>
  <div id="updateLikeCoinIdStatus"></div>
</div>
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
