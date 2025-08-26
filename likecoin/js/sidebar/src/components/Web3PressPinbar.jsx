import PropTypes from 'prop-types';

function Web3PressIconPinbar({ onClick, paddingLeft, color }) {
  const iconContent = (
    <svg
      width="22"
      height="22"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.4,9.7l0.9-9c0.1-0.9,1.3-0.9,1.4,0l0.9,9c0.2,2,1.8,3.6,3.7,3.7l9,0.9c0.9,0.1,0.9,1.3,0,1.4l-9,0.9
          c-2,0.2-3.6,1.8-3.7,3.7l-0.9,9c-0.1,0.9-1.3,0.9-1.4,0l-0.9-9c-0.2-2-1.8-3.6-3.7-3.7l-9-0.9c-0.9-0.1-0.9-1.3,0-1.4l9-0.9
          C11.7,13.2,13.2,11.7,13.4,9.7z"
        fill={color}
      />
    </svg>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        type="button"
        style={{
          paddingLeft: paddingLeft || 0,
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'pointer',
        }}
      >
        {iconContent}
      </button>
    );
  }

  return (
    <div style={paddingLeft ? { paddingLeft } : {}}>
      {iconContent}
    </div>
  );
}

Web3PressIconPinbar.propTypes = {
  onClick: PropTypes.func,
  paddingLeft: PropTypes.string,
  color: PropTypes.string.isRequired,
};

Web3PressIconPinbar.defaultProps = {
  onClick: null,
  paddingLeft: null,
};

export default Web3PressIconPinbar;
