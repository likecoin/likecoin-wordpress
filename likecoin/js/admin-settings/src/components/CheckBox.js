function CheckBox(props) {
  const handleCheck = () => {
    props.handleCheck(!props.checked);
  };
  return (
    <tr>
      <th scope="row" className="optionTitle">
        <label>{props.title}</label>
      </th>
      <td>
        <input
          type="checkbox"
          checked={props.checked}
          disabled={props.disabled}
          onChange={handleCheck}
          ref={props.checkRef}
        />
        <label className="optionDetails">{props.details}</label>
      </td>
    </tr>
  );
}

export default CheckBox;
