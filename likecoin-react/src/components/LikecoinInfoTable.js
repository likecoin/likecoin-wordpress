import { useRef } from 'react';
import Text from './Text';

function LikecoinInfoTable(props) {
  const likerIdRef = useRef();
  return (
    <div>
      <form>
        <tr>
          <label>
            <th className="optionTitle">Site Liker ID</th>
            <td>
              <table className="form-table likecoinTable">
                <tbody>
                  <tr>
                    <th>Liker ID</th>
                    <th>Display Name</th>
                    <th>Wallet</th>
                    <th> </th>
                  </tr>
                  <tr>
                    <td>
                      <div className="avatarWrapper">
                        {!props.isLoading &&
                          props.likerAvatar.length > 0 &&
                          props.likerAvatar !== '-' && (
                            <img
                              id="likecoinAvatar"
                              className="likecoinAvatar"
                              src={props.likerAvatar}
                              alt="Avatar"
                            />
                          )}
                        {props.likerIdValue.length > 0 &&
                          !props.isChangingSiteLiker && (
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
                        {(props.likerIdValue.length === 0 ||
                          props.isChangingSiteLiker) && (
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
                                Sign Up / Find my Liker ID
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
                      <span className="actionWrapper">
                        <a
                          id="likecoinChangeBtn"
                          type="button"
                          onClick={props.handleIsChangingSiteLiker}
                        >
                          Change
                        </a>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <section className="likecoin loading">
                {props.likerIdValue.length !== 0 &&
                  props.isLoading &&
                  'loading...'}
              </section>
              <section>
                {props.likerAvatar === '-' && !props.isLoading && (
                  <div className="likecoin likecoinError userNotFound">
                    <h4>Liker ID not found</h4>
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