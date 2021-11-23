import {
  useRef, useState, useEffect,
} from 'react';
import axios from 'axios';
import { useSelect, useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import LikecoinHeading from '../components/LikecoinHeading';
import Section from '../components/Section';
import SettingNotice from '../components/SettingNotice';
import CheckBox from '../components/CheckBox';
import DropDown from '../components/DropDown';
import SubmitButton from '../components/SubmitButton';
import MattersDescription from '../components/MattersDescription';
import MattersLoginTable from '../components/MattersLoginTable';
import MattersStatusTable from '../components/MattersStatusTable';
import { SITE_MATTERS_STORE_NAME } from '../store/site-matters-store';

function PublishSettingPage() {
  // eslint-disable-next-line arrow-body-style
  const {
    DBSiteMattersId,
    DBSiteMattersAutoSaveDraft,
    DBSiteMattersAutoPublish,
    DBSiteMattersAddFooterLink,
    DBISCNBadgeStyleOption,
  } = useSelect((select) => select(SITE_MATTERS_STORE_NAME).selectSiteMattersOptions());
  const { postSiteMattersOptions, postSiteMattersLogin } = useDispatch(
    SITE_MATTERS_STORE_NAME,
  );
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
  const [savedSuccessful, setSavedSuccessful] = useState(false);
  const [siteMattersId, setSiteMattersId] = useState(
    DBSiteMattersId,
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
    DBISCNBadgeStyleOption,
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
        'https://server.matters.news/graphql',
        getTokenQuery,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!getTokenResponse.data.data || getTokenResponse.data.errors) {
        throw new Error(getTokenResponse.data.errors[0].message);
      }
      const { token } = getTokenResponse.data.data.userLogin;
      // Get user info from matters
      const getUserInfoResponse = await axios.post(
        'https://server.matters.news/graphql',
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

      // change global state & DB
      postSiteMattersLogin(siteMattersUser);

      // change local state
      setSiteMattersId(getUserInfoResponse.data.data.viewer.userName);
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
                  e.message.slice(0, passwordIndex).concat('password: "***"}'),
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
  async function handleMattersLogout(e) {
    setSavedSuccessful(false);
    e.preventDefault();

    // set local state
    setSiteMattersId('');

    const siteMattersUser = {
      mattersId: '',
      accessToken: '',
    };

    // change global state & DB
    postSiteMattersLogin(siteMattersUser);
    setSavedSuccessful(true);
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
      // Change global state & DB
      postSiteMattersOptions(data);
      setSavedSuccessful(true);
    } catch (error) {
      console.error('Error occured when saving to Wordpress DB: ', error); // eslint-disable-line no-console
      setSavedSuccessful(false);
    }
  }

  useEffect(() => {
    setSiteMattersId(DBSiteMattersId);
    setSiteMattersAutoSaveDraft(DBSiteMattersAutoSaveDraft);
    setSiteMattersAutoPublish(DBSiteMattersAutoPublish);
    setSiteMattersAddFooterLink(DBSiteMattersAddFooterLink);
    setISCNBadgeStyleOption(DBISCNBadgeStyleOption);
  }, [
    DBSiteMattersId,
    DBSiteMattersAutoSaveDraft,
    DBSiteMattersAutoPublish,
    DBSiteMattersAddFooterLink,
    DBISCNBadgeStyleOption,
  ]);

  return (
    <div className="wrap likecoin">
      <LikecoinHeading />
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
