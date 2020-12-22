/* global ajaxurl, jQuery, wp */

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

if (wp) {
  let lastIsSaving = false;
  wp.data.subscribe(async () => {
    const isSavingPost = wp.data.select('core/editor').isSavingPost();
    if (isSavingPost !== lastIsSaving && !isSavingPost) {
      lastIsSaving = isSavingPost;
      await sleep(1000);
      const res = await jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: 'action=likecoin_get_error_notice',
      });
      if (res) {
        const errorMsg = res.errors ? res.errors.map((e) => e.message || e).join(', ') : res;
        wp.data.dispatch('core/notices').createNotice(
          'error', // Can be one of: success, info, warning, error.
          `LikeCoin Error: ${errorMsg}`, // Text string to display.
          {
            isDismissible: true,
          },
        );
      }
    }
    lastIsSaving = isSavingPost;
  });
}
