import { useRef, useState } from "react";
import SubmitButton from "./SubmitButton";
import CheckBox from "./CheckBox";
import SelectDropDown from "./SelectDropDown";

function InputForm(props) {
  const likerIdRef = useRef();
  const siteLikerIdEnabledRef = useRef();
  const displayOptionRef = useRef();
  const perPostOptionEnabledRef = useRef();
  // const [likerIdFilled, setLikerId] = useState(false);
  const [siteLikerIdEnabled, enableSiteLikerId] = useState(false);
  const [displayOptionSelected, selectDisplayOption] = useState('Nonee');
  const [perPostOptionEnabled, allowPerPostOption] = useState(false);
  
  function submitHandler(event) {
    event.preventDefault();
    const likerId = likerIdRef.current.value;
    const siteLikerIdEnabled = siteLikerIdEnabledRef.current.checked;
    const displayOption = displayOptionRef.current.value;
    const perPostOptionEnabled = perPostOptionEnabledRef.current.checked;
    const data = {
      likerId,
      siteLikerIdEnabled,
      displayOption,
      perPostOptionEnabled,
    };
    console.log("data to store:", data);
    props.onAddInput(data);
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
        <label>Input Your Liker ID</label>
        <input type="text" required id="likerId" ref={likerIdRef} />
        <br />
        <CheckBox
          checked={siteLikerIdEnabled}
          handleCheck={enableSiteLikerId}
          title="Enable site Liker ID"
          details="Override all LikeCoin button with site Liker ID"
          checkRef={siteLikerIdEnabledRef}
        />
        <br />
        <SelectDropDown
          selected={displayOptionSelected}
          handleSelect={selectDisplayOption}
          title="Display option"
          selectRef={displayOptionRef}
        />
        <br />
        <CheckBox
          checked={perPostOptionEnabled}
          handleCheck={allowPerPostOption}
          title="Allow per Post option"
          details="Allow editors to customize display setting per post"
          checkRef={perPostOptionEnabledRef}
        />
        <br />
        <SubmitButton />
      </form>
      {siteLikerIdEnabled ? <p>Liker ID YES</p> : <p>Liker ID No</p>}
      {displayOptionSelected}
      {perPostOptionEnabled ? <p>Per post YES</p> : <p>Per post NO</p>}
    </div>
  );
}

export default InputForm;