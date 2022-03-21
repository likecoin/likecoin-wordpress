import CheckMark from './CheckMark';

function CheckBox(props) {
  const handleCheck = () => {
    props.handleCheck(!props.checked);
  };
  return (
    <span className="components-checkbox-control__input-container">
      <input
        type="checkbox"
        checked={props.checked}
        onChange={handleCheck}
        ref={props.checkRef}
        id="inspector-checkbox-control-999"
        className="components-checkbox-control__input"
        style={{ margin: '0 10px 10px 0' }}
      />
      <CheckMark />
    </span>
  );
}

export default CheckBox;
