function FormTable({ children }) {
  return (
    <table className="form-table" role="presentation">
      <tbody>
        {children}
      </tbody>
    </table>
  );
}

export default FormTable;
