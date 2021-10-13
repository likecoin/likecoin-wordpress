import { __ } from '@wordpress/i18n';

function MattersStatusTable(props) {
  return (
    <table className="form-table" role="presentation">
      <tbody>
        <tr>
          <th scope="row">
            <label for="site_matters_user">
              {__('Connection Status', 'likecoin-react')}
            </label>
          </th>
          <td>
            <div>
              <span>
                <b>
                  {props.siteMattersId.length > 0 && (
                    <>
                      {__('Logged in as ', 'likecoin-react')}
                      <a
                        rel="noopener noreferrer"
                        target="_blank"
                        href={`https://matters.news/@${props.siteMattersId}`}
                      >
                        {props.siteMattersId}
                        {'    '}
                      </a>
                    </>
                  )}
                  {props.siteMattersId.length === 0 && (
                    <b> {__('Not connected', 'likecoin-react')} </b>
                  )}
                </b>
              </span>
              {props.siteMattersId.length > 0 && (
                <span className="actionWrapper" style={{ paddingLeft: '20px' }}>
                  <a
                    id="lcMattersIdLogoutButton"
                    type="button"
                    onClick={props.handleMattersLogout}
                    target="_blank"
                    href="#"
                  >
                    {__('Logout', 'likecoin-react')}
                  </a>
                </span>
              )}
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default MattersStatusTable;
