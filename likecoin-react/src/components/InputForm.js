import { useRef, useState } from "react";
import SubmitButton from "./SubmitButton";
import CheckBox from "./CheckBox";
import SelectDropDown from "./SelectDropDown";
import Section from "./Section";
import LikecoinIDTable from "./LikecoinIDTable";

function InputForm(props) {
  const siteLikerIdEnabledRef = useRef();
  const displayOptionRef = useRef();
  const perPostOptionEnabledRef = useRef();
  const [siteLikerIdEnabled, enableSiteLikerId] = useState(false);
  const [displayOptionSelected, selectDisplayOption] = useState('Nonee');
  const [perPostOptionEnabled, allowPerPostOption] = useState(false);
  
  function submitHandler(event) {
    event.preventDefault();
    const siteLikerIdEnabled = siteLikerIdEnabledRef.current.checked;
    const displayOption = displayOptionRef.current.value;
    const perPostOptionEnabled = perPostOptionEnabledRef.current.checked;
    const data = {
      siteLikerIdEnabled,
      displayOption,
      perPostOptionEnabled,
    };
    console.log("data to store:", data);
    props.onAddInput(data);
  }

  return (
    <div>
      <h1> LikeCoin </h1>
      <form onSubmit={submitHandler}>
        <Section title={"Site Liker ID"} />
        <CheckBox
          checked={siteLikerIdEnabled}
          handleCheck={enableSiteLikerId}
          title="Enable site Liker ID"
          details="Override all LikeCoin button with site Liker ID"
          checkRef={siteLikerIdEnabledRef}
        />
        {siteLikerIdEnabled ? <LikecoinIDTable /> : ""}
        <Section title={"Site LikeCoin button display setting"} />
        <SelectDropDown
          selected={displayOptionSelected}
          handleSelect={selectDisplayOption}
          title="Display option"
          selectRef={displayOptionRef}
        />
        <CheckBox
          checked={perPostOptionEnabled}
          handleCheck={allowPerPostOption}
          title="Allow per Post option"
          details="Allow editors to customize display setting per post"
          checkRef={perPostOptionEnabledRef}
        />
        <SubmitButton />
      </form>
      {siteLikerIdEnabled ? <p>Liker ID YES</p> : <p>Liker ID No</p>}
      {displayOptionSelected}
      {perPostOptionEnabled ? <p>Per post YES</p> : <p>Per post NO</p>}
    </div>
  );
}

export default InputForm;