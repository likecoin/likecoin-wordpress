function DropDown(props) {
  const handleSelect = (e) => {
    props.handleSelect(e.target.value);
  };
  return (
    <tr>
      <th className="optionTitle" scope="row">
        <label>{props.title}</label>
      </th>
      <td>
        <select
          ref={props.selectRef}
          onChange={handleSelect}
          value={props.selected}
        >
          {props.options.map((option) => (
            <option value={option.value} key={option.label}> {option.label} </option>
          ))}
        </select>
      </td>
    </tr>
  );
}

export default DropDown;
