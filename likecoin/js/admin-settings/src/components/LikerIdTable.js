import {
  useRef, useState, useEffect, useMemo,
} from 'react';
import axios from 'axios';
import { __ } from '@wordpress/i18n';
import { debounce } from 'lodash';
import Text from './Text';

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
    <tr>
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
                  {!isLoading
                    && likerAvatar && (
                      <img
                        id="likecoinAvatar"
                        className="likecoinAvatar"
                        src={likerAvatar}
                        alt="Avatar"
                      />
                  )}
                  {likerIdValue && !isChangingTypingLiker && (
                      <a
                        id="likecoinId"
                        rel="noopener noreferrer"
                        target="_blank"
                        href={`https://${props.likecoHost}/${likerIdValue}`}
                        className="likecoin"
                      >
                        {likerIdValue}
                      </a>
                  )}
                  {(props.editable && (!likerIdValue || isChangingTypingLiker)) && (
                    <div>
                      <input
                        type="text"
                        id="likecoinIdInputBox"
                        ref={likerIdRef}
                        className="likecoinInputBox"
                        onChange={handleLikerIdInputChange}
                      />
                      <p>
                        <a
                          id="likecoinInputLabel"
                          className="likecoinInputLabel"
                          target="blacnk"
                          rel="noopener"
                          href={`https://${props.likecoHost}/in`}
                        >
                          {__('Sign Up / Find my Liker ID', 'likecoin')}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </td>
              <td>
                {!isLoading && (
                  <Text text={likerDisplayName} />
                )}
              </td>
              <td>
                {!isLoading && (
                  <Text text={likerWalletAddress} />
                )}
              </td>
              <td>
                {showChangeButton && props.editable && (
                  <button
                    className="button"
                    type="button"
                    onClick={handleClickOnChange}
                  >{__('Change', 'likecoin')}</button>
                )}
                {showDisconnectButton && props.editable && (
                  <>
                    &nbsp;
                    <button
                      className="button button-danger"
                      type="button"
                      onClick={handleDisconnect}
                    >{__('Disconnect', 'likecoin')}</button>
                  </>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <section className="likecoin loading">
          {likerIdValue
            && isLoading
            && __('Loading...', 'likecoin')}
        </section>

        <section>
          {likerIdValue && !isLoading && !likerAvatar && (
            <div className="likecoin likecoinError userNotFound">
              <h4>{__('Liker ID not found', 'likecoin')}</h4>
            </div>
          )}
        </section>
      </td>
    </tr>
  );
}

export default LikerIdTable;
