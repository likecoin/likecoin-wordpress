function CheckBox(props) {
    const handleCheck = () => {
      props.handleCheck(!props.checked);
    };
    return (
      <label>
        <text className="optionTitle"> {props.title} </text>
        <input
          type="checkbox"
          checked={props.checked}
          onChange={handleCheck}
          ref={props.checkRef}
        />
        {props.details}
      </label>
    );
    
}

export default CheckBox;