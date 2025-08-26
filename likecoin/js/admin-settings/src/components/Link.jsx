import PropTypes from 'prop-types';

function Link({ linkAddress, text }) {
  return (
    <a rel="noopener noreferrer" target="_blank" href={linkAddress}>
      {text}
    </a>
  );
}

Link.propTypes = {
  linkAddress: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default Link;
