import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";

actor Token {
    Debug.print("Canister Deployed");
    var owner: Principal = Principal.fromText("vmoe5-vmulv-rmoc2-epo2i-zqmoe-hlqoc-rnjvv-z6mf7-zchdd-77mp7-dqe");
    var totalSupply: Nat = 1000000000;
    var symbol: Text = "EXIA";

    //map is not stable so need to implement method in the motoko documentation (preupgrade, postupgrade)
    private stable var stableBalances: [(Principal, Nat)] = [];
    private var balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);

    //for first time starter (not upgrade) so canister will still have initial balance;
    if (balances.size() < 1) {
        balances.put(owner, totalSupply);
    };

    public query func balanceOf(who: Principal): async Nat {

        let balance : Nat = switch (balances.get(who)) {
            case null 0;
            case (?result) result;
        };

        return balance;
    };

    public query func getSymbol(): async Text {
        return symbol;
    };

    public shared(msg) func payOut(): async Text {
        // Debug.print(debug_show(msg.caller));
        if (balances.get(msg.caller) == null) {
            let amount = 10000;
            let result = await transferMoney(msg.caller, amount);
            return result;
        } else {
            return "Already claimed";
        }
    };

    public shared(msg) func transferMoney(to: Principal, valueToTransfer: Nat): async Text {

        let senderMoneyAmount = await balanceOf(msg.caller);

        if (senderMoneyAmount > valueToTransfer) {

            let newSenderBalance: Nat = senderMoneyAmount - valueToTransfer;
            balances.put(msg.caller, newSenderBalance);

            let receiverMoneyAmount = await balanceOf(to);
            let newReceiverBalance: Nat = receiverMoneyAmount + valueToTransfer;
            balances.put(to, newReceiverBalance);

            return "Transfer Success";

        } else {

            return "Insufficient amount";

        }
    };

    system func preupgrade() {
        stableBalances := Iter.toArray(balances.entries())
    };

    system func postupgrade() {
        balances := HashMap.fromIter<Principal, Nat>(stableBalances.vals(), 1, Principal.equal, Principal.hash);

        if (balances.size() < 1) {
            balances.put(owner, totalSupply);
        }
    };
};