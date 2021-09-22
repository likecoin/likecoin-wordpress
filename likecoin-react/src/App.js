import "./App.css";
import InputForm from "./components/InputForm";
function App() {
  
  function postDataToWordpress(dataToPost) {
    console.log("window.wpApiSettings: ", window.wpApiSettings);
    fetch(`${window.wpApiSettings.root}likecoin-react/v1/main-settingpage`, {
      method: "GET",
      // body: JSON.stringify(dataToPost),
      headers: {
        "Content-Type": "application/json",
        "X-WP-Nonce": window.wpApiSettings.nonce,
      },
    })
    .then(res=>res.json())
      .then((res) => {
        console.log('res: ', res);
        console.log('res.data: ', res.data);
        console.log("Successfully Post!");
      })
      .catch((e) => {
        console.log(`error: ${e}`);
      });
  }
  
  return (
    <div className="App">
      <p>Hi from React !!! :) </p>
      <InputForm onAddInput={postDataToWordpress} />
    </div>
  );
}

export default App;
