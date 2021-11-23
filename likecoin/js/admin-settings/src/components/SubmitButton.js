import { __ } from '@wordpress/i18n';

function SubmitButton() {
  return (
    <div style={{ textAlign: 'left' }}>
      <button className="likecoinSubmitButton">
        {__('Confirm', 'likecoin')}
      </button>
    </div>
  );
}

export default SubmitButton;
