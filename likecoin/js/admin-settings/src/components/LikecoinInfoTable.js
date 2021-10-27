import { useRef } from 'react';
import { __ } from '@wordpress/i18n';
import Text from './Text';

function LikecoinInfoTable(props) {
  const likerIdRef = useRef();
  return (
    <div>
      <form>
        <tr>
          <label>
            {props.isMainSettingPage && (
              <th className="optionTitle">{__('Site Liker ID', 'likecoin')}</th>
            )}
            <td>
              <table className="form-table likecoinTable">
                <tbody>
                  <tr>
                    <th>{__('Liker ID', 'likecoin')}</th>
                    <th>{__('Display Name', 'likecoin')}</th>
                    <th>{__('Wallet', 'likecoin')}</th>
                    <th> </th>
                  </tr>
                  <tr>
                    <td>
                      <div className="avatarWrapper">
                        {!props.isLoading
                          && props.likerAvatar.length > 0
                          && props.likerAvatar !== '-' && (
                            <img
                              id="likecoinAvatar"
                              className="likecoinAvatar"
                              src={props.likerAvatar}
                              alt="Avatar"
                            />
                        )}
                        {props.likerIdValue.length > 0
                          && !props.isChangingTypingLiker && (
                            <a
                              id="likecoinId"
                              rel="noopener noreferrer"
                              target="_blank"
                              href={`https://like.co/${props.likerIdValue}`}
                              className="likecoin likecoinId"
                            >
                              {props.likerIdValue}
                            </a>
                        )}
                        {(props.likerIdValue.length === 0
                          || props.isChangingTypingLiker) && (
                          <div>
                            <input
                              type="text"
                              id="likecoinIdInputBox"
                              ref={likerIdRef}
                              className="likecoinInputBox"
                              onChange={props.handleLikerIdInputChange}
                            />
                            <p>
                              <a
                                id="likecoinInputLabel"
                                className="likecoinInputLabel"
                                target="blacnk"
                                rel="noopener"
                                href="https://like.co/in"
                              >
                                {__('Sign Up / Find my Liker ID', 'likecoin')}
                              </a>
                            </p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      {!props.isLoading && props.likerDisplayName && (
                        <Text text={props.likerDisplayName} />
                      )}
                    </td>
                    <td>
                      {!props.isLoading && props.likerWalletAddress && (
                        <Text text={props.likerWalletAddress} />
                      )}
                    </td>
                    <td className="actions">
                      {props.showChangeButton && props.editable && (
                        <span className="actionWrapper">
                          <a
                            id="likecoinChangeBtn"
                            type="button"
                            onClick={props.handleClickOnChange}
                          >
                            {__('Change', 'likecoin')}
                          </a>
                        </span>
                      )}
                      {props.showDisconnectButton && props.editable && (
                        <span className="actionWrapper">
                          <a
                            id="likecoinLogoutBtn"
                            type="button"
                            onClick={props.handleDisconnect}
                          >
                            {__('Disconnect', 'likecoin')}
                          </a>
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
              <section className="likecoin loading">
                {props.likerIdValue.length !== 0
                  && props.isLoading
                  && __('Loading...', 'likecoin')}
              </section>

              <section>
                {props.likerAvatar === '-' && !props.isLoading && (
                  <div className="likecoin likecoinError userNotFound">
                    <h4>{__('Liker ID not found', 'likecoin')}</h4>
                  </div>
                )}
              </section>
            </td>
          </label>
        </tr>
      </form>
    </div>
  );
}

export default LikecoinInfoTable;
