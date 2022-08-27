import React, { useState } from "react";
import { token, canisterId, createActor } from "../../../declarations/token"
import { AuthClient } from '@dfinity/auth-client';

function Faucet(props) {

  const [isDisabled, setDisabled] = useState(false);
  const [result, setResult] = useState("Gimme gimme");

  async function handleClick(event) {
    setDisabled(true);

    const authClient = await AuthClient.create();
    const identity = await authClient.getIdentity();

    const authenticatedCanister = createActor(canisterId, {
      agentOptions: {
        identity,
      },
    });

    const confirmation = await authenticatedCanister.payOut();
    setResult(confirmation);
  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>Get your free EXIA tokens here! Claim 1,000 EXIA tokens to your account {props.userPrincipal}.</label>
      <p className="trade-buttons">
        <button id="btn-payout" onClick={handleClick} disabled={isDisabled}>
          {result}
        </button>
      </p>
    </div>
  );
}

export default Faucet;
