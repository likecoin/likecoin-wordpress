import PropTypes from 'prop-types';

function DropDown({
  handleSelect,
  title,
  selectRef,
  selected,
  options,
}) {
  const handleSelectChange = (e) => {
    handleSelect(e.target.value);
  };
  return (
    <tr>
      <th className="optionTitle" scope="row">
        <label htmlFor={`dropdown-${title.replace(/\s+/g, '-').toLowerCase()}`}>{title}</label>
      </th>
      <td>
        <select
          id={`dropdown-${title.replace(/\s+/g, '-').toLowerCase()}`}
          ref={selectRef}
          onChange={handleSelectChange}
          value={selected}
        >
          {options.map((option) => (
            <option value={option.value} key={option.label}>
              {option.label}
            </option>
          ))}
        </select>
      </td>
    </tr>
  );
}

DropDown.propTypes = {
  handleSelect: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  selectRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  selected: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

DropDown.defaultProps = {
  selectRef: null,
};

export default DropDown;
