import React, { useState, useEffect } from 'react';
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
  const [DBSiteMattersAutoSaveDraft, getDBSiteMattersAutoSaveDraft] =
    useState('');
  const [DBSiteMattersAutoPublish, getDBSiteMattersAutoPublish] = useState('');
  const [DBSiteMattersAddFooterLink, getDBSiteMattersAddFooterLink] =
    useState('');
  const [DBISCNBadgeStyleOption, getDBISCNBadgeStyleOption] = useState('');
  const setSiteMattersId = (id) => getDBSiteMattersId(id);
  const setSiteMattersToken = (token) => getDBSiteMattersToken(token);
  const setSiteMattersAutoSaveDraft = (status) =>
    getDBSiteMattersAutoSaveDraft(status);
  const setSiteMattersAutoPublish = (status) =>
    getDBSiteMattersAutoPublish(status);
  const setSiteMattersAddFooterLink = (status) =>
    getDBSiteMattersAddFooterLink(status);
  const setISCNBadgeStyleOption = (option) => getDBISCNBadgeStyleOption(option);

  async function fetchWordpressDBMattersInfoData() {
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
            if (res.data.site_matters_user.matters_id.length !== 0) {
              getDBSiteMattersId(res.data.site_matters_user.matters_id);
              getDBSiteMattersToken(res.data.site_matters_user.access_token);
            }
          }
          if (res.data.site_matters_auto_save_draft)
            getDBSiteMattersAutoSaveDraft(
              res.data.site_matters_auto_save_draft
            );
          if (res.data.site_matters_auto_publish)
            getDBSiteMattersAutoPublish(res.data.site_matters_auto_publish);
          if (res.data.site_matters_add_footer_link)
            getDBSiteMattersAddFooterLink(
              res.data.site_matters_add_footer_link
            );
          if (res.data.iscn_badge_style_option)
            getDBISCNBadgeStyleOption(res.data.iscn_badge_style_option);
        }
      });
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
