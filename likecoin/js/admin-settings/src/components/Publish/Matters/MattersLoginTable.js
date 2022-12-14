import { __ } from '@wordpress/i18n';

import FormTable from '../../FormTable';
import FormTableRow from '../../FormTableRow';

function MattersLoginTable(props) {
  return (
    <FormTable>
      <FormTableRow title={__('Connect to Matters', 'likecoin')}>
        <p className="description">{__('Login with Matters ID', 'likecoin')}</p>
        <FormTable>
          <FormTableRow title={__('Matters login email ', 'likecoin')}>
            <input
              ref={props.mattersIdRef}
              id="matters_id"
              name="lc_matters_id"
              type="text"
            />
          </FormTableRow>
          <FormTableRow title={__('Password ', 'likecoin')}>
            <input
              ref={props.mattersPasswordRef}
              id="matters_password"
              name="lc_matters_password"
              type="password"
            />
          </FormTableRow>
          <FormTableRow>
            <input
              id="lcMattersIdLoginBtn"
              className="button button-primary"
              type="button"
              value={__('Login', 'likecoin')}
              onClick={props.loginHandler}
            />
            {props.mattersLoginError && (
              <p id="lcMattersErrorMessage">{props.mattersLoginError}</p>
            )}
          </FormTableRow>
        </FormTable>
      </FormTableRow>
    </FormTable>
  );
}

export default MattersLoginTable;
