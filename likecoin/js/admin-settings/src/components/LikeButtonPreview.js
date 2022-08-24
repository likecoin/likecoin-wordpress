import { __ } from '@wordpress/i18n';
import { ReactComponent as SettingSvg } from './icon/settings.svg';

function LikeButtonPreview(props) {
  const iframeSrc = props.userLikerId.length > 0
    ? `https://button.${props.likecoHost}/in/embed/${props.userLikerId}/button?type=wp&integration=wordpress_plugin`
    : '';
  const iframeStyle = {
    pointerEvents: 'none',
    height: '480px',
    width: '360px',
  };
  return (
    <section className="likecoin optionsSection">
      <section className="previewSection">
        <span style={{ float: 'left' }}>{__('Preview', 'likecoin')}</span>
        <a
          rel="noopener noreferrer"
          target="_blank"
          className="icon"
          href={`https://${props.likecoHost}/in/settings`}
        >
          <SettingSvg />
        </a>
        <div className="centerContainer">
          <figure className="likecoin-embed likecoin-button">
            <iframe
              id="likecoinPreview"
              scrolling="no"
              frameborder="0"
              style={iframeStyle}
              src={iframeSrc}
              title="likecoinButtonIFrame"
            ></iframe>
          </figure>
        </div>
      </section>
    </section>
  );
}

export default LikeButtonPreview;
