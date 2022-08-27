import React, { useState } from "react";
import { token, canisterId, createActor } from "../../../declarations/token"
import { Principal } from "@dfinity/principal"
import { AuthClient } from '@dfinity/auth-client';

function Transfer() {

  const [receiverId, setId] = useState("");
  const [amount, setAmount] = useState("");
  const [isDisabled, setDisabled] = useState(false);
  const [frontText, setFrontText] = useState("");
  const [isHidden, setHidden] = useState(true);

  async function handleClick() {
    setDisabled(true);
    const receiverAdress = Principal.fromText(receiverId);
    const moneyValue = Number(amount);

    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();
    const authenticatedCanister = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });

    const response = await authenticatedCanister.transferMoney(receiverAdress, moneyValue);
    setFrontText(response);
    setHidden(false);
    setDisabled(false);
  }

  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                value={receiverId}
                onChange={(e) => setId(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </li>
          </ul>
        </fieldset>
        <p className="trade-buttons">
          <button id="btn-transfer" onClick={handleClick} disabled={isDisabled}>
            Transfer
          </button>
        </p>
        <p hidden={isHidden}> {frontText} </p>
      </div>
    </div>
  );
}

export default Transfer;
