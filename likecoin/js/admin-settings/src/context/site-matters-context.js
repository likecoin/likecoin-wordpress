import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MattersInfoContext = React.createContext({
  DBSiteMattersId: '',
  DBSiteMattersToken: '',
  DBSiteMattersAutoSaveDraft: false,
  DBSiteMattersAutoPublish: false,
  DBSiteMattersAddFooterLink: false,
  DBISCNBadgeStyleOption: 'none',
  setSiteMattersId: () => {},
});

export const MattersInfoProvider = (props) => {
  const [DBSiteMattersId, getDBSiteMattersId] = useState('');
  const [DBSiteMattersToken, getDBSiteMattersToken] = useState('');
  const [DBSiteMattersAutoSaveDraft, getDBSiteMattersAutoSaveDraft] = useState('');
  const [DBSiteMattersAutoPublish, getDBSiteMattersAutoPublish] = useState('');
  const [DBSiteMattersAddFooterLink, getDBSiteMattersAddFooterLink] = useState('');
  const [DBISCNBadgeStyleOption, getDBISCNBadgeStyleOption] = useState('');
  const setSiteMattersId = (id) => getDBSiteMattersId(id);
  const setSiteMattersToken = (token) => getDBSiteMattersToken(token);
  const setSiteMattersAutoSaveDraft = (status) => getDBSiteMattersAutoSaveDraft(status);
  const setSiteMattersAutoPublish = (status) => getDBSiteMattersAutoPublish(status);
  const setSiteMattersAddFooterLink = (status) => getDBSiteMattersAddFooterLink(status);
  const setISCNBadgeStyleOption = (option) => getDBISCNBadgeStyleOption(option);

  async function fetchWordpressDBMattersInfoData() {
    try {
      const response = await axios.get(
        `${window.wpApiSettings.root}likecoin/v1/publish-setting-page`,
        {
          headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': window.wpApiSettings.nonce,
          },
        },
      );
      if (response.data) {
        if (response.data.data.site_matters_user) {
          if (response.data.data.site_matters_user.matters_id.length !== 0) {
            getDBSiteMattersId(response.data.data.site_matters_user.matters_id);
            getDBSiteMattersToken(
              response.data.data.site_matters_user.access_token,
            );
          }
        }
        if (response.data.data.site_matters_auto_save_draft) {
          getDBSiteMattersAutoSaveDraft(
            response.data.data.site_matters_auto_save_draft,
          );
        }
        if (response.data.data.site_matters_auto_publish) {
          getDBSiteMattersAutoPublish(
            response.data.data.site_matters_auto_publish,
          );
        }
        if (response.data.data.site_matters_add_footer_link) {
          getDBSiteMattersAddFooterLink(
            response.data.data.site_matters_add_footer_link,
          );
        }
        if (response.data.data.iscn_badge_style_option) {
          getDBISCNBadgeStyleOption(response.data.data.iscn_badge_style_option);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(() => {
    fetchWordpressDBMattersInfoData();
  }, []);

  return (
    <MattersInfoContext.Provider
      value={{
        DBSiteMattersId,
        DBSiteMattersToken,
        DBSiteMattersAutoSaveDraft,
        DBSiteMattersAutoPublish,
        DBSiteMattersAddFooterLink,
        DBISCNBadgeStyleOption,
        setSiteMattersId,
        setSiteMattersToken,
        setSiteMattersAutoSaveDraft,
        setSiteMattersAutoPublish,
        setSiteMattersAddFooterLink,
        setISCNBadgeStyleOption,
      }}
    >
      {props.children}
    </MattersInfoContext.Provider>
  );
};

export default MattersInfoContext;
