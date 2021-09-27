import { useRef, useState, useEffect } from "react";
import Test from "./Test";
import axios from "axios";
// import SubmitButton from "./SubmitButton";
function LikecoinInfoTable(props) {
  const likerIdRef = useRef();
  const [likerIdValue, getLikerIdValue] = useState("");
  const [likerDisplayName, getLikerDisplayName] = useState("");
  const [likerWalletAddress, getLikerWalletAddress] = useState("");
  const [likerAvatar, getLikerAvatar] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [query, setQuery] = useState('');
  async function fetchLikeCoinID(likerId) {
    setIsLoading(true);
    console.log(`start fetching ${likerId}`);
    try {
      const response = await axios.get(
        `https://api.like.co/users/id/${likerId}/min`
      );
      getLikerDisplayName(response.data.displayName);
      getLikerWalletAddress(response.data.cosmosWallet); // change wallet address based on database.
      getLikerAvatar(response.data.avatar);
      console.log("response: ", response);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }
  function handleChange(e) {
    const typingLikerId = e.target.value;
    getLikerIdValue(typingLikerId); // change liker Id based on user immediate input.
  }

  useEffect(() => {
    setTimeout(() => {
      console.log("waiting..");
      fetchLikeCoinID(likerIdValue);
    }, 500);
    return () => {
      console.log("start clean up"); // CleanUp function to re-start the timer
    }; 
  }, [likerIdValue, likerDisplayName]);

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
      {/* <td>{likerIdValue.length > 0 && likerIdValue.length} </td> */}
      <td>{likerIdValue.length === 0 && isLoading && "loading..."} </td>
      <td>{likerIdValue.length === 0 && !isLoading && "User not found"} </td>
    </div>
  );
}

export default LikecoinInfoTable;
