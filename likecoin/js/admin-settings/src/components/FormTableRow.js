function FormTableRow(props) {
  return (
    <tr>
      <th scope="row" className="optionTitle">
        <label>{props.title}</label>
      </th>
      <td>
        {props.children}
        {!!props.details && <span class="description">{props.details}</span>}
        {props.append}
      </td>
    </tr>
  );
}

export default FormTableRow;
