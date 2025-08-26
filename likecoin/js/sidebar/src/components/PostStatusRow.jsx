import PropTypes from 'prop-types';
import StatusTitle from './StatusTitle';

function PostStatusRow({ title, status }) {
  return (
    <div className="flexBoxRow">
      <StatusTitle title={title} />
      <div>{status}</div>
    </div>
  );
}

PostStatusRow.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
};

export default PostStatusRow;
