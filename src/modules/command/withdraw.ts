import { ICommand } from ".";
import { IWallet, WalletBase } from "../../models/wallet";
import { getLoggedInUser } from "../../utils/userHelper";

export class WithdrawCommand implements ICommand {
	private inputParams: string[];
	private user: string;
	private amount: number;

	constructor(inputParams: string[]) {
		this.inputParams = inputParams;
		this.user = "";
		this.amount = 0;
	}

	public async execute() {
		// 01. Validate
		if(!await this.validateParams()) {
			return;
		}

		// 02. Debit from wallet
		const wallet = await this.debit(this.user, this.amount);

		// 03 Display message
		this.displayMessage(wallet);
	}

	private async validateParams() {
		const logInUser = await getLoggedInUser();
		if(!logInUser) {
			console.log("Please login to continue");
			return false;
		}

		this.user = logInUser;
		this.amount = parseInt(this.inputParams[1]) || 0;
		if(!this.amount) {
			console.log("Please enter amount");
			return false;
		} else if(this.amount < 1) {
			console.log("Please enter valid amount");
			return false;
		}
		return true;
	}

	private async debit(userName: string, amount: number) {
		let walletObj: IWallet;
		try {
			const wallet = new WalletBase();
			const result = await wallet.get(userName);

			if(result) {
				walletObj = result as IWallet;
				if(walletObj.balance >= amount) {
					walletObj.balance -= amount;
					walletObj.updatedOn = new Date();
				} else {
					throw new Error("Insufficient balance");
				}
			} else {
				throw new Error("Wallet not found");
			}
			return walletObj;
		} catch(err) {
			console.log("Error: Please try again later:" + err);
		}
	}

	private displayMessage(wallet: IWallet | undefined) {
		if(wallet) {
			console.log(`Your balance is $${wallet.balance}`);
		}
	}
} 