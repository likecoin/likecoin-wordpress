import { __ } from '@wordpress/i18n';

function MattersLoginTable(props) {
  return (
    <table className="form-table">
      <tbody>
        <tr>
          <td>
            <label for="matters_id">
              {__('Matters login email ', 'likecoin')}
            </label>
            <input
              type="text"
              name="lc_matters_id"
              id="matters_id"
              ref={props.mattersIdRef}
            ></input>
          </td>
          <td>
            <label for="matters_password">
              {__('Password ', 'likecoin')}
            </label>
            <input
              type="password"
              name="lc_matters_password"
              id="matters_password"
              ref={props.mattersPasswordRef}
            ></input>
          </td>
        </tr>
        <tr>
          <td className="actions" style={{ float: 'left' }}>
            <span className="actionWrapper" style={{ border: '0px' }}>
              <input
                id="lcMattersIdLoginBtn"
                type="button"
                value={__('Login', 'likecoin')}
                onClick={props.loginHandler}
              ></input>
            </span>
          </td>
          <td>
            <span id="lcMattersErrorMessage">{props.mattersLoginError}</span>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default MattersLoginTable;
