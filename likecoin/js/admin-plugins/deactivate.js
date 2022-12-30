/* global jQuery, wp */
const { __ } = wp.i18n;

jQuery(() => {
  jQuery('#deactivate-likecoin').click((e) => {
    e.preventDefault();
    const text1 = jQuery('<p></p>').text(__('Sorry to hear you leave.'));
    const text2 = jQuery('<p></p>');
    const link = jQuery('<a></a>', {
      href: '#', // TODO: replace with link
      target: '_blank',
      rel: 'noopener',
    }).text(__('Please let us understand how we can improve by filling in a survey here.'));
    const wrapper = jQuery('<div></div>', {
      id: 'likecoin-deactivate-dialog',
      title: __('LikeCoin Plugin Feedback'),
    });
    text2.append(link);
    wrapper.append(text1);
    wrapper.append(text2);
    jQuery('body').append(wrapper);
    jQuery('#likecoin-deactivate-dialog').dialog({
      resizable: false,
      height: 'auto',
      width: 400,
      modal: true,
      buttons: {
        [__('Survey')]() {
          window.open('#'); // TODO: replace with link
        },
        [__('Deactivate')]() {
          window.location = jQuery('#deactivate-likecoin').attr('href');
          jQuery(this).dialog('close');
        },
      },
    });
  });
});
