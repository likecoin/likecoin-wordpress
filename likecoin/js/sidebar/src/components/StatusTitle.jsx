import PropTypes from 'prop-types';

function StatusTitle({ title }) {
  return (
    <div className="SideBarStatusRowTitle">
      <p style={{ marginBottom: '0px' }}>
        {' '}
        {title}
        {' '}
      </p>
    </div>
  );
}

StatusTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default StatusTitle;
