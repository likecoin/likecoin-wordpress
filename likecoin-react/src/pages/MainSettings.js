import InputForm from '../components/InputForm';
function MainSettings() {
  function postDataToWordpress(dataToPost) {
    // TODO? can replace fetch with wp.apiFetch() to get endpoint rather than complete url (but need to put 'wp-api' as dependency)
    fetch(`${window.wpApiSettings.root}likecoin-react/v1/main-settingpage`, {
      method: 'POST',
      body: JSON.stringify(dataToPost),
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': window.wpApiSettings.nonce, // prevent CORS attack.
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log('Successfully post Data to Wordpress!');
      });
  }
  return (
    <div>
      <InputForm onAddInput={postDataToWordpress} />
    </div>
  );
}

export default MainSettings;
