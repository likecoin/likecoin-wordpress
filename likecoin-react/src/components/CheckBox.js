function CheckBox(props) {
  const handleCheck = () => {
    props.handleCheck(!props.checked);
  };
  return (
    <tr>
      <label>
        <th className="optionTitle">{props.title}</th>
        <th>
          <input
            type="checkbox"
            checked={props.checked}
            onChange={handleCheck}
            ref={props.checkRef}
            optionDetails
          />
          <label className="optionDetails">{props.details}</label>
        </th>
      </label>
    </tr>
  );
}

export default CheckBox;
