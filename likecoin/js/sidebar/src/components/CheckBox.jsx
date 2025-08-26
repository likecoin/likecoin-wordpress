import PropTypes from 'prop-types';
import CheckMark from './CheckMark';

function CheckBox({ handleCheck, checked, checkRef }) {
  const onCheck = () => {
    handleCheck(!checked);
  };
  return (
    <span className="components-checkbox-control__input-container">
      <input
        type="checkbox"
        checked={checked}
        onChange={onCheck}
        ref={checkRef}
        id="inspector-checkbox-control-999"
        className="components-checkbox-control__input"
        style={{ margin: '0 10px 10px 0' }}
      />
      <CheckMark />
    </span>
  );
}

CheckBox.propTypes = {
  handleCheck: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  checkRef: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
};

CheckBox.defaultProps = {
  checkRef: null,
};

export default CheckBox;
