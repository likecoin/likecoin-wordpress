import {
  useRef, useContext, useState, useEffect,
} from 'react';
import axios from 'axios';
import { __ } from '@wordpress/i18n';
import LikecoinHeading from '../components/LikecoinHeading';
import Section from '../components/Section';
import SettingNotice from '../components/SettingNotice';
import CheckBox from '../components/CheckBox';
import DropDown from '../components/DropDown';
import SubmitButton from '../components/SubmitButton';
import MattersInfoContext from '../context/site-matters-context';
import MattersDescription from '../components/MattersDescription';
import MattersLoginTable from '../components/MattersLoginTable';
import MattersStatusTable from '../components/MattersStatusTable';

function PublishSettingPage() {
  const mattersCtx = useContext(MattersInfoContext);
  const mattersIdRef = useRef();
  const mattersPasswordRef = useRef();
  const siteMattersAutoSaveDraftRef = useRef();
  const siteMattersAutoPublishRef = useRef();
  const siteMattersAddFooterLinkRef = useRef();
  const ISCNBadgeStyleOptionRef = useRef();
  const ISCNStyleOptions = [
    { value: 'light', label: __('Light Mode', 'likecoin') },
    { value: 'dark', label: __('Dark Mode', 'likecoin') },
    { value: 'none', label: __('None', 'likecoin') },
  ];
  const DBSiteMattersAutoSaveDraft = !!(mattersCtx.DBSiteMattersAutoSaveDraft === '1'
    || mattersCtx.DBSiteMattersAutoSaveDraft === true);
  const DBSiteMattersAutoPublish = !!(mattersCtx.DBSiteMattersAutoPublish === '1'
    || mattersCtx.DBSiteMattersAutoPublish === true);
  const DBSiteMattersAddFooterLink = !!(mattersCtx.DBSiteMattersAddFooterLink === '1'
    || mattersCtx.DBSiteMattersAddFooterLink === true);
  const [savedSuccessful, setSavedSuccessful] = useState(false);
  const [siteMattersId, setSiteMattersId] = useState(
    mattersCtx.DBSiteMattersId,
  );
  const [, setSiteMattersToken] = useState(
    mattersCtx.DBSiteMattersToken,
  );
  const [siteMattersAutoSaveDraft, setSiteMattersAutoSaveDraft] = useState(
    DBSiteMattersAutoSaveDraft,
  );
  const [siteMattersAutoPublish, setSiteMattersAutoPublish] = useState(
    DBSiteMattersAutoPublish,
  );
  const [siteMattersAddFooterLink, setSiteMattersAddFooterLink] = useState(
    DBSiteMattersAddFooterLink,
  );
  const [ISCNBadgeStyleOption, setISCNBadgeStyleOption] = useState(
    mattersCtx.DBISCNBadgeStyleOption,
  );
  const [mattersLoginError, setMattersLoginError] = useState('');
  async function loginToMattersAndSaveDataToWordpress(data) {
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
      // Get token from matters
      const getTokenResponse = await axios.post(
        'https://server-develop.matters.news/graphql',
        getTokenQuery,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      console.log('getTokenResponse:', getTokenResponse);
      if (!getTokenResponse.data.data || getTokenResponse.data.errors) {
        console.log(
          'getTokenResponse.data.errors[0]: ',
          getTokenResponse.data.errors[0],
        );
        throw new Error(getTokenResponse.data.errors[0].message);
      }
      const { token } = getTokenResponse.data.data.userLogin;
      // Get user info from matters
      const getUserInfoResponse = await axios.post(
        'https://server-develop.matters.news/graphql',
        getMattersUserInfoQuery,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        },
      );
      const siteMattersUser = {
        mattersId: getUserInfoResponse.data.data.viewer.userName, // other props: displayName, id
        accessToken: token,
      };

      // Post data to Wordpress DB
      const postToWordpressResponse = await axios.post(
        `${window.wpApiSettings.root}likecoin/v1/publish-setting-page/matters-login`,
        JSON.stringify(siteMattersUser),
        {
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': window.wpApiSettings.nonce, // prevent CORS attack.
          },
        },
      );
      setSiteMattersId(
        postToWordpressResponse.data.data.site_matters_user.matters_id,
      );
      setSiteMattersToken(
        postToWordpressResponse.data.data.site_matters_user.access_token,
      );
      setSavedSuccessful(true);
    } catch (error) {
      if (error.response) {
        if (error.response.data) {
          let errorMessage = 'ERROR:';
          if (error.response.data.errors.length > 0) {
            error.response.data.errors.forEach((e) => {
              if (e.message.indexOf('password') > 0) {
                const passwordIndex = e.message.search('password');
                errorMessage = errorMessage.concat(
                  e.message
                    .slice(0, passwordIndex)
                    .concat('password: "***"}'),
                );
              } else {
                errorMessage = errorMessage.concat(e.message);
              }
            });
          }
          setMattersLoginError(errorMessage);
        }
      } else if (error.message) {
        let errorMessage = 'ERROR:';
        errorMessage = errorMessage.concat(error.message);
        setMattersLoginError(errorMessage);
      }
    }
  }
  async function loginHandler(e) {
    e.preventDefault();
    const mattersId = mattersIdRef.current.value;
    const mattersPassword = mattersPasswordRef.current.value;
    const data = {
      mattersId,
      mattersPassword,
    };
    // send to Matters API.
    await loginToMattersAndSaveDataToWordpress(data);
  }
  async function postMattersOptionDataToWordpress(dataToPost) {
    try {
      await axios.post(
        `${window.wpApiSettings.root}likecoin/v1/publish-setting-page/publish-options`,
        JSON.stringify(dataToPost),
        {
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': window.wpApiSettings.nonce, // prevent CORS attack.
          },
        },
      );
    } catch (error) {
      console.log(error);
    }
  }
  async function handleMattersLogout(e) {
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
    await axios.post(
      `${window.wpApiSettings.root}likecoin/v1/publish-setting-page/matters-login`,
      JSON.stringify(siteMattersUser),
      {
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': window.wpApiSettings.nonce, // prevent CORS attack.
        },
      },
    );
    setSavedSuccessful(true);

    // change context
    mattersCtx.setSiteMattersId('');
    mattersCtx.setSiteMattersToken('');
  }
  function handleNoticeDismiss(e) {
    e.preventDefault();
    setSavedSuccessful(false);
  }
  async function confirmHandler(e) {
    setSavedSuccessful(false);
    e.preventDefault();
    const isSiteMattersAutoSaveDraft = siteMattersAutoSaveDraftRef.current.checked;
    const isSiteMattersAutoPublish = siteMattersAutoPublishRef.current.checked;
    const isSiteMattersAddFooterLink = siteMattersAddFooterLinkRef.current.checked;
    const currentISCNBadgeStyleOption = ISCNBadgeStyleOptionRef.current.value;

    const data = {
      siteMattersAutoSaveDraft: isSiteMattersAutoSaveDraft,
      siteMattersAutoPublish: isSiteMattersAutoPublish,
      siteMattersAddFooterLink: isSiteMattersAddFooterLink,
      ISCNBadgeStyleOption: currentISCNBadgeStyleOption,
    };

    // save to Wordpress DB.
    try {
      await postMattersOptionDataToWordpress(data);
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
    <div className="wrap likecoin">
      <LikecoinHeading />
      {!savedSuccessful && ''}
      {savedSuccessful && (
        <SettingNotice
          text="Settings Saved"
          className="notice-success"
          handleNoticeDismiss={handleNoticeDismiss}
        />
      )}
      <MattersDescription />
      <Section title={__('Login with Matters ID', 'likecoin')} />
      <MattersLoginTable
        loginHandler={loginHandler}
        mattersIdRef={mattersIdRef}
        mattersPasswordRef={mattersPasswordRef}
        mattersLoginError={mattersLoginError}
      />
      <form onSubmit={confirmHandler}>
        <Section title={__('Matters connection status', 'likecoin')} />
        <MattersStatusTable
          siteMattersId={siteMattersId}
          handleMattersLogout={handleMattersLogout}
        />
        <Section title={__('Publish to Matters', 'likecoin')} />
        <table className="form-table" role="presentation">
          <tbody>
            <CheckBox
              checked={siteMattersAutoSaveDraft}
              handleCheck={setSiteMattersAutoSaveDraft}
              title={__('Auto save draft to Matters', 'likecoin')}
              details={__('Auto save draft to Matters', 'likecoin')}
              checkRef={siteMattersAutoSaveDraftRef}
            />
            <CheckBox
              checked={siteMattersAutoPublish}
              handleCheck={setSiteMattersAutoPublish}
              title={__('Auto publish post to Matters', 'likecoin')}
              details={__('Auto publish post to Matters', 'likecoin')}
              checkRef={siteMattersAutoPublishRef}
            />
            <CheckBox
              checked={siteMattersAddFooterLink}
              handleCheck={setSiteMattersAddFooterLink}
              title={__('Add post link in footer', 'likecoin')}
              details={__('Add post link in footer', 'likecoin')}
              checkRef={siteMattersAddFooterLinkRef}
            />
          </tbody>
        </table>
        <Section title={__('Publish to ISCN', 'likecoin')} />
        <table className="form-table" role="presentation">
          <DropDown
            selected={ISCNBadgeStyleOption}
            handleSelect={setISCNBadgeStyleOption}
            title={__('Show ISCN badge in post', 'likecoin')}
            selectRef={ISCNBadgeStyleOptionRef}
            options={ISCNStyleOptions}
          />
        </table>
        <SubmitButton />
      </form>
    </div>
  );
}

export default PublishSettingPage;
