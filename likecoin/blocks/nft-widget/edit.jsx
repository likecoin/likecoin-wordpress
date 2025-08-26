/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import PropTypes from 'prop-types';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useEffect, useState } from 'react';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { TextControl, PanelBody, PanelRow } from '@wordpress/components';
import { useSelect } from '@wordpress/data';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
function Edit({
  setAttributes,
  attributes,
}) {
  const iscnInfo = useSelect('core/editor').getEditedPostAttribute('meta').lc_iscn_info;
  const [iscnId, setIscnId] = useState('');

  useEffect(() => {
    const newiscnId = (iscnInfo && iscnInfo.iscn_id) || '';
    setIscnId(newiscnId);
    setAttributes({ iscnId: iscnInfo.iscn_id });
  }, [iscnInfo, setAttributes]);

  const {
    isShowCover,
    isShowLikeBar,
    ctaButtonLabel,
  } = attributes;
  const query = {
    type: 'wp',
    integration: 'wordpress_plugin',
    cta_button_label: ctaButtonLabel,
    iscn_id: iscnId,
  };
  const width = 360;
  let height = 440;
  if (!isShowCover) {
    query.cover = '0';
    height -= 260;
  }
  if (!isShowLikeBar) {
    query.like_bar = '0';
    height -= 60;
  }
  const aspectRatio = (width / height).toFixed(4);
  const querystring = new URLSearchParams(query).toString();
  const blockProps = useBlockProps();
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <figure {...blockProps}>
      {!iscnId && <span>{__('Please publish the post and mint NFT before using this widget', 'likecoin')}</span>}
      {iscnId && (
      <div>
        <InspectorControls>
          <PanelBody title={__('Widget Settings', 'likecoin')} initialOpen>
            <PanelRow>
              <TextControl
                label={__('Collect Button Text', 'likecoin')}
                value={ctaButtonLabel || 'Collect Now'}
                onChange={(value) => setAttributes({ ctaButtonLabel: value })}
              />
            </PanelRow>
          </PanelBody>
        </InspectorControls>
        <iframe
          title={__('NFT Widget', 'likecoin')}
          frameBorder="0"
          style={{
            aspectRatio,
            width: `${width}px`,
            pointerEvents: 'none',
          }}
          src={`https://button.like.co/in/embed/iscn/button?${querystring}`}
        />
      </div>
      )}
    </figure>
  );
}

Edit.propTypes = {
  setAttributes: PropTypes.func.isRequired,
  attributes: PropTypes.shape({
    isShowCover: PropTypes.bool,
    isShowLikeBar: PropTypes.bool,
    ctaButtonLabel: PropTypes.string,
    iscnId: PropTypes.string,
  }).isRequired,
};

export default Edit;
