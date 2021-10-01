import { ReactComponent as SettingSvg } from './icon/settings.svg';

function LikeButtonPreview(props) {
  const iframeSrc =
    props.userLikerId.length > 0
      ? `https://button.like.co/in/embed/${props.userLikerId}/button?type=wp&integration=wordpress_plugin`
      : '';
  const iframeStyle = {
    pointerEvents: 'none',
    height: '212px',
    width: '500px',
  };
  return (
    <section class="likecoin optionsSection">
      <section class="previewSection">
        <span style={{ float: 'left' }}>Preview</span>
        <a
          rel="noopener noreferrer"
          target="_blank"
          class="icon"
          href="https://like.co/in/settings"
        >
          <SettingSvg />
        </a>
        <div class="centerContainer">
          <figure class="likecoin-embed likecoin-button">
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
