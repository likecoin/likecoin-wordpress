import PropTypes from 'prop-types';
import FormTableRow from './FormTableRow';

function CheckBox({
  handleCheck,
  checked,
  title,
  details,
  append,
  disabled,
  checkRef,
}) {
  const handleCheckChange = () => {
    handleCheck(!checked);
  };
  return (
    <FormTableRow
      title={title}
      details={details}
      append={append}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={handleCheckChange}
        ref={checkRef}
      />
    </FormTableRow>
  );
}

CheckBox.propTypes = {
  handleCheck: PropTypes.func.isRequired,
  checked: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  details: PropTypes.string,
  append: PropTypes.node,
  disabled: PropTypes.bool,
  checkRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
};

CheckBox.defaultProps = {
  details: '',
  append: null,
  disabled: false,
  checkRef: null,
};

export default CheckBox;
