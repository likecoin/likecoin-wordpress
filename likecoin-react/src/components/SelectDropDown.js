function SelectDropDown(props) {
    const handleSelect = (e) => {
      props.handleSelect(e.target.value);
    };
  return (
    <div>
      <text className="optionTitle"> {props.title} </text>
      <select ref={props.selectRef} onChange={handleSelect}>
        <option> Page and Post</option>
        <option> Post Only</option>
        <option> None</option>
      </select>
    </div>
  );
}

export default SelectDropDown;