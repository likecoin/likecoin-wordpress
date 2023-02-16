import FormTableRow from './FormTableRow';

function CheckBox(props) {
  const handleCheck = () => {
    props.handleCheck(!props.checked);
  };
  return (
    <FormTableRow
      title={props.title}
      details={props.details}
      append={props.append}
    >
      <input
        type="checkbox"
        checked={props.checked}
        disabled={props.disabled}
        onChange={handleCheck}
        ref={props.checkRef}
      />
    </FormTableRow>
  );
}

export default CheckBox;
