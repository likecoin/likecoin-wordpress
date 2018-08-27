/* global WP_CONFIG */
var siteCheckbox = document.querySelector("#".concat(WP_CONFIG.siteButtonCheckboxId));

function onToggleSiteButton() {
  var element = document.querySelector('.site_liekcoin_id_table');

  if (this.checked) {
    element.style.display = '';
  } else {
    element.style.display = 'none';
  }
}

if (siteCheckbox) {
  siteCheckbox.addEventListener('change', onToggleSiteButton);

  if (!siteCheckbox.checked) {
    var element = document.querySelector('.site_liekcoin_id_table');
    element.style.display = 'none';
  }
}