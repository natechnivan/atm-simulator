import { randomUUID } from "crypto";
import { ICommand } from ".";
import { IWallet, WalletBase } from "../../models/wallet";
import { getLoggedInUser } from "../../utils/userHelper";

export class DepositCommand implements ICommand {
	private inputParams: string[];
	private user: string;
	private amount: number;

	constructor(inputParams: string[]) {
		this.inputParams = inputParams;
		this.user = "";
		this.amount = 0;
	}

	public async execute() {
		// 01. Validate input params
		if (!await this.validateParams()) {
			return;
		}

		// 02. Credit to user wallet 
		const response = await this.credit(this.user, this.amount);

		// 03. Display message
		if (response) {
			this.displayMessage(response?.walletObj, response?.debtAmount, response?.lender);
		}
	}

	private async validateParams() {
		const logInUser = await getLoggedInUser();
		if (!logInUser) {
			console.log("Please login first");
			return false;
		}

		this.user = logInUser;
		this.amount = parseInt(this.inputParams[1]) || 0;

		if (!this.amount) {
			console.log("Please enter amount");
			return false;
		} else if (this.amount < 1) {
			console.log("Please enter valid amount");
			return false;
		}
		return true;
	}

	private async credit(userName: string, amount: number) {
		let walletObj: IWallet;
		let debtAmount = 0;
		let lender = "";

		try {
			const wallet = new WalletBase();
			const result = await wallet.get(userName);

			if (result) {
				walletObj = result as IWallet;

				walletObj.creditAmount += this.amount;

				if (walletObj.balance === 0 && walletObj.debtAmount > 0) {
					({ debtAmount, lender } = this.calculateDebt(walletObj, debtAmount, lender));

					if (debtAmount > 0 && debtAmount) {
						await this.payDebt(lender, debtAmount);
					}
				} else {
					walletObj.balance += this.amount;
				}
				walletObj.updatedOn = new Date();
			} else {
				walletObj = this.buildWallet(amount);
			}
			// update wallet
			await wallet.create(walletObj, userName);
			return { walletObj, debtAmount, lender };
		} catch (err) {
			console.log("Error: Please try again later:" + err);
		}
	}

	private calculateDebt(walletObj: IWallet, debtAmount: number, lender: string) {
		const currentBalance = walletObj.balance + this.amount - walletObj.debtAmount;
		if (currentBalance < 0) {
			debtAmount = this.amount;
			lender = walletObj.debtToUser;
			walletObj.debtAmount -= Math.abs(this.amount);
			walletObj.balance = 0;
		} else {
			walletObj.balance += currentBalance;
			debtAmount = walletObj.debtAmount;
			lender = walletObj.debtToUser;
			walletObj.debtAmount = 0;
			walletObj.debtToUser = "";
		}
		return { debtAmount, lender };
	}

	private buildWallet(amount: number): IWallet {
		return {
			id: randomUUID(),
			createdOn: new Date(),
			updatedOn: new Date(),
			name: this.user,
			balance: amount,
			creditAmount: amount,
			debtAmount: 0,
			debtToUser: "",
			debtFromUser: ""
		};
	}

	private displayMessage(wallet: IWallet | undefined, debtAmountPaid: number, payee: string) {
		if (wallet) {
			if (debtAmountPaid > 0 && payee) {
				console.log(`Transferred $${debtAmountPaid} to ${payee}`);
			}

			console.log(`Your balance is $${wallet.balance}`);

			if (wallet.debtAmount > 0) {
				console.log(`Owed $${wallet.debtAmount} to ${wallet.debtToUser}`);
			}
		}
	}

	private async payDebt(targetUser: string, amount: number) {
		const wallet = new WalletBase();
		const targetUserWallet = await wallet.get(targetUser);
		if (targetUserWallet) {
			targetUserWallet.updatedOn = new Date();
			targetUserWallet.balance += amount;
			targetUserWallet.debtAmount -= amount;

			if (targetUserWallet.debtAmount === 0) {
				targetUserWallet.debtFromUser = "";
			}
            await wallet.create(targetUserWallet, targetUser);
		}
	}
} 