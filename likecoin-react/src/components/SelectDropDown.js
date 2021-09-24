function SelectDropDown(props) {
    const handleSelect = (e) => {
      props.handleSelect(e.target.value);
    };
  return (
    <tr>
      <label>
        <th className="optionTitle">{props.title}</th>
        <th>
          <select ref={props.selectRef} onChange={handleSelect}>
            <option> Page and Post</option>
            <option> Post Only</option>
            <option> None</option>
          </select>
        </th>
      </label>
    </tr>
  );
}

export default SelectDropDown;