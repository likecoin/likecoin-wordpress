import PropTypes from 'prop-types';

function MetaPopUpStatusTitle({ title }) {
  return (
    <div>
      <p className="sidebarPopUpRowTitle">
        {' '}
        {title}
        {' '}
      </p>
    </div>
  );
}

MetaPopUpStatusTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default MetaPopUpStatusTitle;
