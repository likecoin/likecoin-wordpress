/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save({ attributes }) {
  const {
    iscnId,
    ctaButtonLabel,
  } = attributes;
  const query = {
    type: 'wp',
    integration: 'wordpress_plugin',
    cta_button_label: ctaButtonLabel,
    iscn_id: iscnId,
  };
  const height = 40;
  const width = 160;
  const querystring = new URLSearchParams(query).toString();
  return (
    <figure {...useBlockProps.save()}>
      {iscnId && <iframe
        title={__('NFT Widget', 'likecoin')}
        frameborder="0"
        style={{ height, minWidth: width }}
        src={`https://button.like.co/in/embed/nft/button?${querystring}`}
      />}
    </figure>
  );
}
