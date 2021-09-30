import "./App.css";
import { Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App">
        <Switch>
          <Route path="/" exact>
          </Route>
        </Switch>
    </div>
  );
}

export default App;
