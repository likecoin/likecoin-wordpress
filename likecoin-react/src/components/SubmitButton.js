import { __ } from '@wordpress/i18n';
function SubmitButton() {
  return (
    <tr style={{ textAlign: 'left' }}>
      <button className="likecoinSubmitButton">
        {__('Confirm', 'likecoin-react')}
      </button>
    </tr>
  );
}

export default SubmitButton;
