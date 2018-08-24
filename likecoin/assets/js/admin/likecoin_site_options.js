/* global WP_CONFIG */

const siteCheckbox = document.querySelector(`#${WP_CONFIG.siteButtonCheckboxId}`);

function onToggleSiteButton() {
  const element = document.querySelector('.site_liekcoin_id_table');
  if (this.checked) {
    element.style.display = '';
  } else {
    element.style.display = 'none';
  }
}

if (siteCheckbox) {
  siteCheckbox.addEventListener('change', onToggleSiteButton);
  if (!siteCheckbox.checked) {
    const element = document.querySelector('.site_liekcoin_id_table');
    element.style.display = 'none';
  }
}
