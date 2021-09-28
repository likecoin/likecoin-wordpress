import { useRef, useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { debounce } from "lodash";
import Test from "./Test";
import LikerInfoContext from "../context/likerInfo-context";

function LikecoinInfoTable(props) {
  const ctx = useContext(LikerInfoContext); 
  console.log("ctx at LikecoinInfoTable: ", ctx); // undefined !?
  const [likerIdValue, getLikerIdValue] = useState(ctx.DBLikerId);
  const [likerDisplayName, getLikerDisplayName] = useState(ctx.DBdisplayName);
  const [likerWalletAddress, getLikerWalletAddress] = useState(ctx.DBwallet);
  const [likerAvatar, getLikerAvatar] = useState(ctx.DBavatar);
  const [isLoading, setIsLoading] = useState(false);
  const likerIdRef = useRef();
  function handleChange(e) {
    const typingLikerId = e.target.value;
    getLikerIdValue(typingLikerId); // change liker Id based on user immediate input.
  }
  useEffect(() => {
    getLikerIdValue(ctx.DBLikerId);
    getLikerDisplayName(ctx.DBdisplayName);
    getLikerWalletAddress(ctx.DBwallet);
    getLikerAvatar(ctx.DBavatar);
  }, [ctx.DBLikerId, ctx.DBdisplayName, ctx.DBwallet, ctx.DBavatar]);

  // Update Data
  const fetchLikeCoinID = useMemo(
    () =>
      debounce(async (likerId) => {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `https://api.like.co/users/id/${likerId}/min`
          );
          getLikerDisplayName(response.data.displayName);
          getLikerWalletAddress(response.data.cosmosWallet); // change wallet address based on database.
          getLikerAvatar(response.data.avatar);
          props.likerInfos.likecoin_id = response.data.user;
          props.likerInfos.display_name = response.data.displayName;
          props.likerInfos.wallet = response.data.cosmosWallet;
          props.likerInfos.avatar = response.data.avatar;
          console.log("props: ", props);
          console.log("response: ", response);
          setIsLoading(false);
        } catch (error) {
          console.log(error);
          setIsLoading(false);
        }
      }, 500),
    []
  );
  useEffect(() => {
    fetchLikeCoinID(likerIdValue);
  }, [fetchLikeCoinID, likerIdValue]);


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
                    {!isLoading && likerAvatar.length > 0 && (
                      <img
                        id="likecoinAvatar"
                        class="likecoinAvatar"
                        src={likerAvatar}
                        alt="Avatar"
                      />
                    )}
                    <input
                      type="text"
                      id="likerId"
                      ref={likerIdRef}
                      onChange={handleChange}
                    />
                  </td>
                  <td>
                    {!isLoading && likerDisplayName && (
                      <Test text={likerDisplayName} />
                    )}
                  </td>

                  <td>
                    {!isLoading && likerWalletAddress && (
                      <Test text={likerWalletAddress} />
                    )}
                  </td>
                </tr>
              </td>
            </th>
          </label>
        </tr>
      </form>
      <td>{likerIdValue.length !== 0 && isLoading && "loading..."} </td>
      <td>
        {likerIdValue.length !== 0 &&
          !isLoading &&
          !likerDisplayName &&
          "Liker ID not found"}
      </td>
    </div>
  );
}

export default LikecoinInfoTable;
