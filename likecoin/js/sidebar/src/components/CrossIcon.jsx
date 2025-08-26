import PropTypes from 'prop-types';

function CrossIcon({ onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      aria-label="Close"
      style={{
        cursor: 'pointer', background: 'none', border: 'none', padding: 0,
      }}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M14.8384 3.74744C15.2289 3.35691 15.8621 3.35691 16.2526 3.74744C16.6431 4.13796 16.6431 4.77113 16.2526 5.16165L11.4143 10L16.2526 14.8383C16.6431 15.2289 16.6431 15.862 16.2526 16.2526C15.8621 16.6431 15.2289 16.6431 14.8384 16.2526L10 11.4142L5.1617 16.2526C4.77117 16.6431 4.13801 16.6431 3.74748 16.2526C3.35696 15.862 3.35696 15.2289 3.74748 14.8383L8.58583 10L3.74748 5.16165C3.35696 4.77113 3.35696 4.13796 3.74748 3.74744C4.13801 3.35691 4.77117 3.35691 5.1617 3.74744L10 8.58578L14.8384 3.74744Z"
          fill="#9B9B9B"
        />
      </svg>
    </button>
  );
}
CrossIcon.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CrossIcon;
