function MattersStatusTable(props) {
  return (
    <table class="form-table" role="presentation">
      <tbody>
        <tr>
          <th scope="row">
            <label for="site_matters_user">Connection Status</label>
          </th>
          <td>
            <div>
              <span>
                <b>
                  {props.siteMattersId.length > 0 && (
                    <>
                      Logged in as{' '}
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
                  {props.siteMattersId.length === 0 && <b> Not connected </b>}
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
                    Logout
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
