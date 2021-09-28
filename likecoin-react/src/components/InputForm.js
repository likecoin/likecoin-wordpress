import { useRef, useContext, useState, useEffect } from "react";
import SubmitButton from "./SubmitButton";
import CheckBox from "./CheckBox";
import SelectDropDown from "./SelectDropDown";
import Section from "./Section";
import LikecoinInfoTable from "./LikecoinInfoTable";
import LikerInfoContext from "../context/likerInfo-context";

function InputForm(props) {
  const ctx = useContext(LikerInfoContext); 
  console.log("ctx at InputForm: ", ctx);
  const siteLikerIdEnabledRef = useRef();
  const displayOptionRef = useRef();
  const perPostOptionEnabledRef = useRef();
  const likerInfosObj = {};
  const [siteLikerIdEnabled, enableSiteLikerId] = useState(
    ctx.DBsiteLikerIdEnabled
  );
  const [displayOptionSelected, selectDisplayOption] = useState(
    ctx.DBdisplayOptionSelected
  );
  const [perPostOptionEnabled, allowPerPostOption] = useState(
    ctx.DBperPostOptionEnabled
  );

  useEffect(() => {
    enableSiteLikerId(ctx.DBsiteLikerIdEnabled);
    selectDisplayOption(ctx.DBdisplayOptionSelected);
    allowPerPostOption(ctx.DBperPostOptionEnabled);
  }, [
    ctx.DBsiteLikerIdEnabled,
    ctx.DBdisplayOptionSelected,
    ctx.DBperPostOptionEnabled,
  ]);
  function submitHandler(e) {
    e.preventDefault();
    const siteLikerIdEnabled = siteLikerIdEnabledRef.current.checked;
    const displayOption = displayOptionRef.current.value;
    const perPostOptionEnabled = perPostOptionEnabledRef.current.checked;
    const data = {
      siteLikerIdEnabled,
      displayOption,
      perPostOptionEnabled,
      likerInfos: likerInfosObj,
    };
    console.log("data to store in Wordpress DB:", data);
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
        {siteLikerIdEnabled ? <LikecoinInfoTable likerInfos={likerInfosObj} /> : ""}
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