import PropTypes from 'prop-types';

function Text({ testRef, text }) {
  return <p ref={testRef}>{text}</p>;
}

Text.propTypes = {
  testRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  text: PropTypes.string.isRequired,
};

Text.defaultProps = {
  testRef: null,
};

export default Text;
