import { useRef, useContext } from "react";

import Test from "./Test";
import LikerInfoContext from "../context/likerInfo-context";

function LikecoinInfoTable(props) {
  const ctx = useContext(LikerInfoContext); 
  console.log("ctx at LikecoinInfoTable: ", ctx);
  const likerIdRef = useRef();

  return (
    <div>
      <form>
        <tr>
          <label>
            <th className="optionTitle">Site Liker ID</th>
            <th>
              <td className="likecoinTable">
                <tr>
                  <th>Liker ID</th>
                  <th>Display Name</th>
                  <th>Wallet</th>
                </tr>
                <tr>
                  <td>
                    {!props.isLoading && props.likerAvatar.length > 0 && (
                      <img
                        id="likecoinAvatar"
                        class="likecoinAvatar"
                        src={props.likerAvatar}
                        alt="Avatar"
                      />
                    )}
                    <input
                      type="text"
                      id="likerId"
                      ref={likerIdRef}
                      onChange={props.handleLikerIdInputChange}
                    />
                  </td>
                  <td>
                    {!props.isLoading && props.likerDisplayName && (
                      <Test text={props.likerDisplayName} />
                    )}
                  </td>

                  <td>
                    {!props.isLoading && props.likerWalletAddress && (
                      <Test text={props.likerWalletAddress} />
                    )}
                  </td>
                </tr>
              </td>
            </th>
          </label>
        </tr>
      </form>
      <td>{props.likerIdValue.length !== 0 && props.isLoading && "loading..."} </td>
      <td>
        {props.likerIdValue.length !== 0 &&
          !props.isLoading &&
          !props.likerDisplayName &&
          "Liker ID not found"}
      </td>
    </div>
  );
}

export default LikecoinInfoTable;
