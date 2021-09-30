function SettingNotice(props) {
  return (
    <div className={`notice ${props.cssClass} is-dismissable`}>
      <p>
        <strong>{props.text}</strong>
      </p>
      <button
        className="notice-dismiss"
        id="notice-dismiss"
        onClick={props.handleNoticeDismiss}
      >
        <span className="screen-reader-text"></span>
      </button>
    </div>
  );
}

export default SettingNotice;