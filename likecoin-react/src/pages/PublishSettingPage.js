import { useRef, useContext, useState, useEffect, useMemo } from 'react';
import LikecoinHeading from '../components/LikecoinHeading';
import Section from '../components/Section';
import SettingNotice from '../components/SettingNotice';
import CheckBox from '../components/CheckBox';
import DropDown from '../components/DropDown';
import SubmitButton from '../components/SubmitButton';
import MattersInfoContext from '../context/site-matters-context';

function PublishSettingPage() {
  const mattersCtx = useContext(MattersInfoContext);
  const mattersIdRef = useRef();
  const mattersPasswordRef = useRef();
  const siteMattersAutoSaveDraftRef = useRef();
  const siteMattersAutoPublishRef = useRef();
  const siteMattersAddFooterLinkRef = useRef();
  const ISCNBadgeStyleOptionRef = useRef();
  const ISCNStyleOptions = [
    { value: 'light', label: 'Light Mode' },
    { value: 'dark', label: 'Ddark Mode' },
    { value: 'none', label: 'None' },
  ];
  const DBSiteMattersAutoSaveDraft =
    mattersCtx.DBSiteMattersAutoSaveDraft === '1' ||
    mattersCtx.DBSiteMattersAutoSaveDraft === true
      ? true
      : false;
  const DBSiteMattersAutoPublish =
    mattersCtx.DBSiteMattersAutoPublish === '1' ||
    mattersCtx.DBSiteMattersAutoPublish === true
      ? true
      : false;
  const DBSiteMattersAddFooterLink =
    mattersCtx.DBSiteMattersAddFooterLink === '1' ||
    mattersCtx.DBSiteMattersAddFooterLink === true
      ? true
      : false;
  const [savedSuccessful, setSavedSuccessful] = useState(false);
  const [siteMattersId, setSiteMattersId] = useState(
    mattersCtx.DBSiteMattersId
  );
  const [siteMattersToken, setSiteMattersToken] = useState(
    mattersCtx.DBSiteMattersToken
  );
  const [siteMattersAutoSaveDraft, setSiteMattersAutoSaveDraft] = useState(
    DBSiteMattersAutoSaveDraft
  );
  const [siteMattersAutoPublish, setSiteMattersAutoPublish] = useState(
    DBSiteMattersAutoPublish
  );
  const [siteMattersAddFooterLink, setSiteMattersAddFooterLink] = useState(
    DBSiteMattersAddFooterLink
  );
  const [ISCNBadgeStyleOption, setISCNBadgeStyleOption] = useState(
    mattersCtx.DBISCNBadgeStyleOption
  );
  const [mattersLoginError, setMattersLoginError] = useState('');

  function loginToMattersAndSaveDataToWordpress(data) {
    const getTokenQuery = JSON.stringify({
      query: `mutation {
            userLogin(input: {
                email: "${data.mattersId}",
                password: "${data.mattersPassword}"
            }) {
                auth
                token
            } 
          }`,
    });
    const getMattersUserInfoQuery = JSON.stringify({
      query: 'query { viewer { id userName displayName}}',
    });
    try {
      fetch('https://server-develop.matters.news/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: getTokenQuery,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.errors) {
            let errorMessage = 'ERROR:';
            if (res.errors.length > 0) {
              res.errors.forEach((error) => {
                if (error.message.indexOf('password') > 0) {
                  const passwordIndex = error.message.search('password');
                  errorMessage = error.message
                    .slice(0, passwordIndex)
                    .concat('password: "***"}');
                } else {
                  errorMessage = errorMessage.concat(error.message);
                }
              });
            }
            setMattersLoginError(errorMessage);
            throw new Error('Failed when post to matters graphQL', {
              message: res.errors,
            });
          }

          const token = res.data.userLogin.token;

          // Get user Id from matters
          fetch('https://server-develop.matters.news/graphql', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token,
            },
            body: getMattersUserInfoQuery,
          })
            .then((res) => res.json())
            .then((res) => {
              const siteMattersUser = {
                mattersId: res.data.viewer.userName, // other props: displayName, id
                accessToken: token,
              };
              // Post data to Wordpress DB
              fetch(
                `${window.wpApiSettings.root}likecoin-react/v1/publish-setting-page/matters-login`,
                {
                  method: 'POST',
                  body: JSON.stringify(siteMattersUser),
                  headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': window.wpApiSettings.nonce, // prevent CORS attack.
                  },
                }
              )
                .then((res) => res.json())
                .then((res) => {
                  console.log(
                    'Successully saved matters login data to Wordpress!'
                  );
                  fetch(
                    `${window.wpApiSettings.root}likecoin-react/v1/publish-setting-page`,
                    {
                      method: 'GET',
                      headers: {
                        'Content-Type': 'application/json',
                        'X-WP-Nonce': window.wpApiSettings.nonce,
                      },
                    }
                  )
                    .then((res) => res.json())
                    .then((res) => {
                      if (res.data) {
                        if (res.data.site_matters_user) {
                          if (
                            res.data.site_matters_user.matters_id.length !== 0
                          ) {
                            setSiteMattersId(
                              res.data.site_matters_user.matters_id
                            );
                            setSiteMattersToken(
                              res.data.site_matters_user.access_token
                            );
                          }
                        }
                      }
                      setSavedSuccessful(true);
                    });
                });
            });
        });
    } catch (error) {
      console.log('error:', error);
    }
  }
  function loginHandler(e) {
    e.preventDefault();
    const mattersId = mattersIdRef.current.value;
    const mattersPassword = mattersPasswordRef.current.value;
    const data = {
      mattersId,
      mattersPassword,
    };
    // send to Matters API.
    try {
      loginToMattersAndSaveDataToWordpress(data);
    } catch (error) {
      console.log('error happened when logging to Matters. error: ', error);
    }
  }
  function postMattersOptionDataToWordpress(dataToPost) {
    // TODO? can replace fetch with wp.apiFetch() to get endpoint rather than complete url (but need to put 'wp-api' as dependency)
    fetch(
      `${window.wpApiSettings.root}likecoin-react/v1/publish-setting-page/publish-options`,
      {
        method: 'POST',
        body: JSON.stringify(dataToPost),
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.wpApiSettings.nonce, // prevent CORS attack.
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        console.log('Successfully post Data to Wordpress!');
      });
  }
  function handleMattersLogout(e) {
    setSavedSuccessful(false);
    e.preventDefault();
    // set state
    setSiteMattersId('');
    setSiteMattersToken('');

    // change DB
    const siteMattersUser = {
      mattersId: '', // other props: displayName, id
      accessToken: '',
    };
    fetch(
      `${window.wpApiSettings.root}likecoin-react/v1/publish-setting-page/matters-login`,
      {
        method: 'POST',
        body: JSON.stringify(siteMattersUser),
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.wpApiSettings.nonce, // prevent CORS attack.
        },
      }
    )
      .then((res) => res.json())
      .then((res) => {
        console.log('Successully saved matters login data to Wordpress!');
        setSavedSuccessful(true);
      });

    // change context
    mattersCtx.setSiteMattersId('');
    mattersCtx.setSiteMattersToken('');
  }
  function handleNoticeDismiss(e) {
    e.preventDefault();
    setSavedSuccessful(false);
  }
  function confirmHandler(e) {
    setSavedSuccessful(false);
    e.preventDefault();
    const siteMattersAutoSaveDraft =
      siteMattersAutoSaveDraftRef.current.checked;
    const siteMattersAutoPublish = siteMattersAutoPublishRef.current.checked;
    const siteMattersAddFooterLink =
      siteMattersAddFooterLinkRef.current.checked;
    const ISCNBadgeStyleOption = ISCNBadgeStyleOptionRef.current.value;

    const data = {
      siteMattersAutoSaveDraft,
      siteMattersAutoPublish,
      siteMattersAddFooterLink,
      ISCNBadgeStyleOption,
    };

    // save to Wordpress DB.
    try {
      postMattersOptionDataToWordpress(data);
      setSavedSuccessful(true);
    } catch (error) {
      console.log('Error occured when saving to Wordpress DB: ', error);
      setSavedSuccessful(false);
    }
  }
  useEffect(() => {
    setSiteMattersId(mattersCtx.DBSiteMattersId);
    setSiteMattersToken(mattersCtx.DBSiteMattersToken);
    setSiteMattersAutoSaveDraft(mattersCtx.DBSiteMattersAutoSaveDraft);
    setSiteMattersAutoPublish(mattersCtx.DBSiteMattersAutoPublish);
    setSiteMattersAddFooterLink(mattersCtx.DBSiteMattersAddFooterLink);
    setISCNBadgeStyleOption(mattersCtx.DBISCNBadgeStyleOption);
  }, [mattersCtx]);

  useEffect(() => {
    setSiteMattersAutoSaveDraft(DBSiteMattersAutoSaveDraft);
    setSiteMattersAutoPublish(DBSiteMattersAutoPublish);
    setSiteMattersAddFooterLink(DBSiteMattersAddFooterLink);
  }, [
    DBSiteMattersAutoSaveDraft,
    DBSiteMattersAutoPublish,
    DBSiteMattersAddFooterLink,
    mattersCtx,
  ]);
  return (
    <>
      <LikecoinHeading />
      {!savedSuccessful && ''}
      {savedSuccessful && (
        <SettingNotice
          text="Settings Saved"
          className="notice-success"
          handleNoticeDismiss={handleNoticeDismiss}
        />
      )}
      <div style={{ textAlign: 'left' }}>
        <p></p>
        <h2>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://matters.news"
          >
            <img
              height="32"
              weight="32"
              src="https://matters.news/static/icon-144x144.png"
              alt="matters-logo"
            ></img>
          </a>
          What is Matters.news?
        </h2>
        <p></p>
        <p>
          <a
            rel="noopener noreferrer"
            target="_blank"
            href="https://matters.news"
          >
            Matters
          </a>
          is a decentralized, cryptocurrency driven content creation and
          discussion platform.
        </p>
        <p>
          By publishing on Matters, your articles will be stored to the
          distributed InterPlanetary File System (
          <a rel="noopener noreferrer" target="_blank" href="https://ipfs.io">
            IPFS
          </a>
          ) nodes and get rewarded. Take the first step to publish your creation
          and reclaim your ownership of data!
        </p>
        <br />
      </div>
      <Section title={'Login with Matters ID'} />
      <form onSubmit={loginHandler}>
        <table className="form-table">
          <tbody>
            <tr>
              <td>
                <label for="matters_id">Matters login email</label>
                <input
                  type="text"
                  name="lc_matters_id"
                  id="matters_id"
                  ref={mattersIdRef}
                ></input>
              </td>
              <td>
                <label for="matters_password">Password</label>
                <input
                  type="password"
                  name="lc_matters_password"
                  id="matters_password"
                  ref={mattersPasswordRef}
                ></input>
              </td>
            </tr>
            <tr>
              <td className="actions" style={{ float: 'left' }}>
                <span className="actionWrapper" style={{ border: '0px' }}>
                  <input
                    id="lcMattersIdLoginBtn"
                    type="submit"
                    value="login"
                  ></input>
                </span>
              </td>
              <td>
                <span id="lcMattersErrorMessage">{mattersLoginError}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </form>
      <form onSubmit={confirmHandler}>
        <Section title={'Matters connection status'} />
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
                      {siteMattersId.length > 0 && (
                        <>
                          Logged in as{' '}
                          <a
                            rel="noopener noreferrer"
                            target="_blank"
                            href={`https://matters.news/@${siteMattersId}`}
                          >
                            {siteMattersId}
                            {'    '}
                          </a>
                        </>
                      )}
                      {siteMattersId.length === 0 && <b> Not connected </b>}
                    </b>
                  </span>
                  {siteMattersId.length > 0 && (
                    <span
                      className="actionWrapper"
                      style={{ paddingLeft: '20px' }}
                    >
                      <a
                        id="lcMattersIdLogoutButton"
                        type="button"
                        onClick={handleMattersLogout}
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
        <Section title={'Publish to Matters'} />
        <table className="form-table" role="presentation">
          <tbody>
            <CheckBox
              checked={siteMattersAutoSaveDraft}
              handleCheck={setSiteMattersAutoSaveDraft}
              title="Auto save draft to Matters"
              details="Auto save draft to Matters"
              checkRef={siteMattersAutoSaveDraftRef}
            />
            <CheckBox
              checked={siteMattersAutoPublish}
              handleCheck={setSiteMattersAutoPublish}
              title="Auto publish post to Matters"
              details="Auto publish post to Matters"
              checkRef={siteMattersAutoPublishRef}
            />
            <CheckBox
              checked={siteMattersAddFooterLink}
              handleCheck={setSiteMattersAddFooterLink}
              title="Add post link in footer"
              details="Add post link in footer"
              checkRef={siteMattersAddFooterLinkRef}
            />
          </tbody>
        </table>
        <Section title={'Publish to ISCN'} />
        <table className="form-table" role="presentation">
          <DropDown
            selected={ISCNBadgeStyleOption}
            handleSelect={setISCNBadgeStyleOption}
            title="Show ISCN badge in post"
            selectRef={ISCNBadgeStyleOptionRef}
            options={ISCNStyleOptions}
          />
        </table>
        <SubmitButton />
      </form>
    </>
  );
}

export default PublishSettingPage;
