function SelectDropDown(props) {
  const handleSelect = (e) => {
    props.handleSelect(e.target.value);
  };
  const options = [
    { value: "always", label: "Page and Post" },
    { value: "post", label: "Post Only" },
    { value: "none", label: "None" },
  ];
  return (
    <tr>
      <label>
        <th className="optionTitle">{props.title}</th>
        <th>
          <select
            ref={props.selectRef}
            onChange={handleSelect}
            value={props.selected}
          >
            {options.map((option)=> (
              <option value={option.value}> {option.label} </option>
            ))}
          </select>
        </th>
      </label>
    </tr>
  );
}

export default SelectDropDown;
