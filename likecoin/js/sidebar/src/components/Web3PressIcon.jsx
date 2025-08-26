import PropTypes from 'prop-types';

function Web3PressIcon({ onClick, paddingLeft, color }) {
  const iconContent = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 30 30"
    >
      <g fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
        <g
          fill={color}
          transform="translate(0 1)"
        >
          <path d="M13.4,9.7l0.9-9c0.1-0.9,1.3-0.9,1.4,0l0.9,9c0.2,2,1.8,3.6,3.7,3.7l9,0.9c0.9,0.1,0.9,1.3,0,1.4l-9,0.9
          c-2,0.2-3.6,1.8-3.7,3.7l-0.9,9c-0.1,0.9-1.3,0.9-1.4,0l-0.9-9c-0.2-2-1.8-3.6-3.7-3.7l-9-0.9c-0.9-0.1-0.9-1.3,0-1.4l9-0.9
          C11.7,13.2,13.2,11.7,13.4,9.7z"
          />
        </g>
      </g>
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

Web3PressIcon.propTypes = {
  onClick: PropTypes.func,
  paddingLeft: PropTypes.string,
  color: PropTypes.string.isRequired,
};

Web3PressIcon.defaultProps = {
  onClick: null,
  paddingLeft: null,
};

export default Web3PressIcon;
