import {
  useRef, useState, useEffect, useMemo,
} from 'react';
import axios from 'axios';
import { __ } from '@wordpress/i18n';
import { debounce } from 'lodash';

function LikerIdTable(props) {
  const likerIdRef = useRef();
  const [likerIdValue, setLikerIdValue] = useState(props.defaultLikerId);
  const [likerDisplayName, setLikerDisplayName] = useState(
    props.defaultLikerDisplayName,
  );
  const [likerWalletAddress, setLikerWalletAddress] = useState(
    props.defaultLikerWalletAddress,
  );
  const [likerAvatar, setLikerAvatar] = useState(props.defaultLikerAvatar);
  const [isLoading, setIsLoading] = useState(false);
  const [isChangingTypingLiker, setIsChangingTypingLiker] = useState(false);
  const [showChangeButton, setShowChangeButton] = useState(true);
  const [showDisconnectButton, setShowDisconnectButton] = useState(false);
  // Update Data based on data returned by likecoin server.
  const fetchLikeCoinID = useMemo(
    () => debounce(async (likerId) => {
      if (!likerId) return;
      try {
        const response = await axios.get(
          `https://api.${props.likecoHost}/users/id/${likerId}/min`,
        );
        const {
          user,
          displayName,
          likeWallet,
          avatar,
        } = response.data;
        setLikerIdValue(user);
        setLikerDisplayName(displayName);
        setLikerWalletAddress(likeWallet);
        setLikerAvatar(avatar);
        setIsLoading(false);
        props.onLikerIdUpdate({
          likerIdValue: user,
          likerDisplayName: displayName,
          likerWalletAddress: likeWallet,
          likerAvatar: avatar,
        });
      } catch (error) {
        setIsLoading(false);
        setLikerIdValue('');
        setLikerDisplayName('');
        setLikerWalletAddress('');
        setLikerAvatar('');
      }
    }, 500),
    // setting dep on prop causes infinite loop, might need refactoring
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
  useEffect(() => {
    fetchLikeCoinID(likerIdValue);
  }, [fetchLikeCoinID, likerIdValue]);
  useEffect(() => {
    setLikerIdValue(props.defaultLikerId);
    setLikerDisplayName(props.defaultLikerDisplayName);
    setLikerWalletAddress(props.defaultLikerWalletAddress);
    setLikerAvatar(props.defaultLikerAvatar);
    setShowChangeButton(!!props.defaultLikerId);
    setShowDisconnectButton(!!props.defaultLikerId);
    setIsChangingTypingLiker(!props.defaultLikerId);
  }, [
    props.defaultLikerId,
    props.defaultLikerDisplayName,
    props.defaultLikerWalletAddress,
    props.defaultLikerAvatar,
  ]);
  useEffect(() => {
    setShowDisconnectButton(!!likerIdValue);
    setShowChangeButton(!!likerIdValue);
  }, [
    likerIdValue,
  ]);
  function handleClickOnChange(e) {
    e.preventDefault();
    setIsChangingTypingLiker(true);
  }
  function handleDisconnect(e) {
    e.preventDefault();
    setLikerIdValue('');
    setLikerDisplayName('');
    setLikerWalletAddress('');
    setLikerAvatar('');
    props.onLikerIdUpdate({
      likerIdValue: '',
      likerDisplayName: '',
      likerWalletAddress: '',
      likerAvatar: '',
    });
  }
  function handleLikerIdInputChange(e) {
    e.preventDefault();
    setIsChangingTypingLiker(true);
    setIsLoading(true);
    const typingLikerId = e.target.value;
    setLikerIdValue(typingLikerId); // change liker Id based on user immediate input.
  }

  return (
    <>
      {(props.editable && (!likerIdValue || isChangingTypingLiker)) && (
        <div className="tablenav top">
          <div className="alignleft actions">
            <input
              ref={likerIdRef}
              id="likecoinIdInputBox"
              className="likecoinInputBox"
              type="text"
              placeholder={__('Search your Liker ID', 'likecoin')}
              onChange={handleLikerIdInputChange}
            />
            &nbsp;
            <a
              id="likecoinInputLabel"
              className="likecoinInputLabel"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://${props.likecoHost}/in`}
            >
              {__('Sign Up / Find my Liker ID', 'likecoin')}
            </a>
          </div>
          <br className="clear" />
        </div>
      )}
      {isLoading ? (
        likerIdValue && (
          <p className="description">
            {__('Loading...', 'likecoin')}
          </p>
        )
      ) : (
        likerDisplayName && (
          <table className="wp-list-table widefat fixed striped table-view-list">
            <thead>
              <tr>
                <th>{__('Liker ID', 'likecoin')}</th>
                <th>{__('Wallet', 'likecoin')}</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="column-username column-primary">
                  {likerAvatar && (
                    <img
                      id="likecoinAvatar"
                      src={likerAvatar}
                      width="48"
                      height="48"
                      alt="Avatar"
                    />
                  )}
                  <strong>
                    <a
                      id="likecoinId"
                      rel="noopener noreferrer"
                      target="_blank"
                      href={`https://${props.likecoHost}/${likerIdValue}`}
                      className="likecoin"
                    >{likerDisplayName}</a>
                  </strong>
                </td>
                <td>{likerWalletAddress}</td>
                <td>
                  {props.editable && (
                    <>
                      {showChangeButton && (
                        <button
                          className="button"
                          type="button"
                          onClick={handleClickOnChange}
                        >{__('Change', 'likecoin')}</button>
                      )}
                      {showDisconnectButton && (
                        <>
                          &nbsp;
                          <button
                            className="button button-danger"
                            type="button"
                            onClick={handleDisconnect}
                          >{__('Disconnect', 'likecoin')}</button>
                        </>
                      )}
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        )
      )}

      <section>
        {likerIdValue && !isLoading && !likerAvatar && (
          <div className="likecoin likecoinError userNotFound">
            <h4>{__('Liker ID not found', 'likecoin')}</h4>
          </div>
        )}
      </section>
    </>
  );
}

export default LikerIdTable;
