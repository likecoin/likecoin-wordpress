import PropTypes from 'prop-types';
import { __ } from '@wordpress/i18n';

function SubmitButton({ children }) {
  return (
    <div className="submit">
      <button type="submit" className="button button-primary">
        {__('Confirm', 'likecoin')}
      </button>
      {children}
    </div>
  );
}

SubmitButton.propTypes = {
  children: PropTypes.node,
};

SubmitButton.defaultProps = {
  children: null,
};

export default SubmitButton;
