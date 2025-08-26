import PropTypes from 'prop-types';

function FormTableRow({
  title, children, details, append,
}) {
  return (
    <tr>
      <th scope="row" className="optionTitle">
        {title}
      </th>
      <td>
        {children}
        {!!details && <span className="description">{details}</span>}
        {append}
      </td>
    </tr>
  );
}

FormTableRow.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
  details: PropTypes.string,
  append: PropTypes.node,
};

FormTableRow.defaultProps = {
  children: null,
  details: '',
  append: null,
};

export default FormTableRow;
