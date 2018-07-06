<?php
  function likecoin_add_meta_box($post) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'likecoin_author';
    $results = $wpdb->get_results( "SELECT * FROM $table_name WHERE author_id = 1" );
    $likecoin_id = '';
    if (sizeof($results) > 0) {
      $likecoin_id = $results[0]->likecoin_id;
    }
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
  <label>Author Id: <?php echo $post->post_author; ?></label>
  <label>LikeCoin Id:
    <input type="text" id="likecoinId" name="likecoinId" value="<?php echo $likecoin_id; ?>" />
  </label>
  <button id="updateLikeCoinId" type="button">Update</button>
  <div id="updateLikeCoinIdStatus"></div>
</div>
<script>
const AJAX_URL = '<?php echo admin_url('admin-ajax.php'); ?>';
</script>
<script src="/wp-content/plugins/likecoin/assets/js/likecoin.js"></script>
<?php
  }
?>
