import { __ } from '@wordpress/i18n';

function SubmitButton({ children }) {
  return (
    <div className="submit">
      <button className="button button-primary">
        {__('Confirm', 'likecoin')}
      </button>
      {children}
    </div>
  );
}

export default SubmitButton;
