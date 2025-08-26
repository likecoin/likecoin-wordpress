import PropTypes from 'prop-types';

function Tag({ tag }) {
  return (
    <div className="TagOuterDiv">
      <p>
        {' '}
        {tag}
        {' '}
      </p>
    </div>
  );
}

Tag.propTypes = {
  tag: PropTypes.string.isRequired,
};

export default Tag;
