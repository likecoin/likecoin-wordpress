function FormTableRow(props) {
  return (
    <tr>
      <th scope="row" className="optionTitle">
        <label>{props.title}</label>
      </th>
      <td>
        {props.children}
        {!!props.details && <p class="description">{props.details}</p>}
      </td>
    </tr>
  );
}

export default FormTableRow;
