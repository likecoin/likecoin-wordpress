<?php
  function likecoin_add_meta_box($post) {
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
<div class="likecoin hasLikeCoinId" style="display: none">
  <label>Author Id: <?php echo $post->post_author; ?></label>
  <label>LikeCoin Id: <input type="text" name="likecoinId" /></label>
</div>
<script src="/wp-content/plugins/likecoin/assets/js/likecoin.js"></script>
<?php
  }
?>
