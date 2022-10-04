import { ICommand } from ".";
import { UserBase } from "../../models/user";
import { IWallet, WalletBase } from "../../models/wallet";
import { getLoggedInUser } from "../../utils/userHelper";

export class TransferCommand implements ICommand {
	private inputParams: string[];
	private amount: number;
	private fromUser: string;
	private toUser: string;

	constructor(inputParams: string[]) {
		this.inputParams = inputParams;
		this.amount = 0;
		this.fromUser = "";
		this.toUser = "";
	}

	public async execute() {
		// 01. Validate input params
		if(!await this.validateParams()) {
			return;
		}   

		// 02. Process transfer of fund
		const response = await this.transfer();

		// 03. Display message
		if(response) {
			this.displayMessage(response.userWallet, response.transferAmount);
		} else {
			console.log("Please try later");
		}
	}

	private async validateParams() {
		try {
			const logInUser = await getLoggedInUser();
			if(!logInUser) {
				console.log("Please login to continue");
				return false;
			}

			this.fromUser = logInUser;
			this.toUser = this.inputParams[1];

			if(!this.toUser) {
				console.log("Payee mssing: Please provide valid payee detail");
				return false;
			} else {
				const user = await new UserBase(this.toUser).get();
				if(!user) {
					console.log("Invalid payee: Please provide valid payee detail");
					return false;
				}
			}

			this.amount = parseInt(this.inputParams[2]) || 0;
			if(!this.amount) {
				console.log("Please enter amount");
				return false;
			} else if(this.amount < 1) {
				console.log("Please enter valid amount");
				return false;
			}
			return true;
		} catch(err) {
			console.log(err);
			return false;
		}
	}

	private async transfer() {
		let userWallet: IWallet;
		let payeeWallet: IWallet;
		let transferAmount = 0;

		try {
			const walletBase = new WalletBase();
			const result = await walletBase.get(this.fromUser);

			if(result) {
				userWallet = result;
				payeeWallet = await walletBase.get(this.toUser);
                
				if(!payeeWallet) {
					throw new Error("Payee Wallet not found");
				}

				userWallet.updatedOn = new Date();
				transferAmount = this.calculateDebt(userWallet, transferAmount, payeeWallet);

				// Credit to target user
				await walletBase.create(payeeWallet, this.toUser);

				// Debit from logged in user
				await walletBase.create(userWallet, this.fromUser);
			} else {
				throw new Error("User wallet not found");
			}
			return  { userWallet, transferAmount };
		} catch(err) {
			console.log("Error: Please try again later:" + err);
		}
	}

	private calculateDebt(userWallet: IWallet, transferAmount: number, payeeWallet: IWallet) {
		const currentBalance = userWallet.balance - this.amount;
		const borrower = !userWallet.debtToUser && userWallet.debtFromUser;

		if (!borrower) {
			if (currentBalance < 0) {
				transferAmount = userWallet.balance;
				userWallet.balance = 0;
				userWallet.debtAmount += Math.abs(currentBalance);
				userWallet.debtToUser = this.toUser;
			} else {
				transferAmount = this.amount;
				userWallet.balance = currentBalance;
				userWallet.debtAmount = 0;
				userWallet.debtToUser = "";
			}

			payeeWallet.balance += transferAmount;
			payeeWallet.creditAmount = transferAmount;
			payeeWallet.debtFromUser = this.fromUser;
		} else {
			if(userWallet.debtFromUser === this.toUser) {
				userWallet.debtAmount -= this.amount;
			}
		}
		userWallet.updatedOn = new Date();
		payeeWallet.debtAmount = userWallet.debtAmount;
		payeeWallet.updatedOn = new Date();

		return transferAmount;
	}

	private displayMessage(targetUserWallet: IWallet , amount: number) {
		if(amount > 0) {
			console.log(`Transferred $${amount} to ${ this.toUser}`);
		}
		console.log(`Your balance is $${ targetUserWallet.balance }`);
		if(targetUserWallet.debtAmount > 0) {
			if(targetUserWallet.debtToUser) {
				console.log(`Owed $${targetUserWallet.debtAmount} to ${ targetUserWallet.debtToUser }`);
			} else {
				console.log(`Owed $${targetUserWallet.debtAmount} from ${ targetUserWallet.debtFromUser }`);
			}
		}
	}
} 