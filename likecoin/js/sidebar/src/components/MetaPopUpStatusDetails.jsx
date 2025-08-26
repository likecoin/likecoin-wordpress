import PropTypes from 'prop-types';

function MetaPopUpStatusDetails({ details }) {
  return (
    <div>
      <p>{details}</p>
    </div>
  );
}

MetaPopUpStatusDetails.propTypes = {
  details: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

MetaPopUpStatusDetails.defaultProps = {
  details: '',
};

export default MetaPopUpStatusDetails;
