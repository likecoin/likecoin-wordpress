import PropTypes from 'prop-types';

function SettingNotice({ className, text, handleNoticeDismiss }) {
  return (
    <div className={`notice ${className} is-dismissable`}>
      <p>
        <strong>{text}</strong>
      </p>
      <button
        type="button"
        className="notice-dismiss"
        id="notice-dismiss"
        aria-label="Dismiss notice"
        onClick={handleNoticeDismiss}
      >
        <span className="screen-reader-text">Dismiss notice</span>
      </button>
    </div>
  );
}

SettingNotice.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string.isRequired,
  handleNoticeDismiss: PropTypes.func.isRequired,
};

SettingNotice.defaultProps = {
  className: '',
};

export default SettingNotice;
