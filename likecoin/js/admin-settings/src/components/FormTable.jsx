import PropTypes from 'prop-types';

function FormTable({ children }) {
  return (
    <table className="form-table" role="presentation">
      <tbody>
        {children}
      </tbody>
    </table>
  );
}

FormTable.propTypes = {
  children: PropTypes.node,
};

FormTable.defaultProps = {
  children: null,
};

export default FormTable;
