import { ICommand } from ".";
import { UserBase } from "../../models/user";
import { IWallet, WalletBase } from "../../models/wallet";
import { write } from "../../utils/fileHelper";

export class LoginCommand implements ICommand {
	private inputParams: string[];
	private name: string;

	constructor(inputParams: string[]) {
		this.inputParams = inputParams;
		this.name = "";
	}

	public async execute() {
		// 01. Validate 
		this.setParam();
		if(this.name === "") {
			console.log("Please provide user name");
		}

		// 02. Login & create user
		await this.login();

		// 03. Get user wallet details
		const wallet = await this.getWallet();

		// 04. Return relevant details
		this.getOutputMessage(wallet);
	}

	private setParam() {
		if(this.inputParams[1] === "")
			return;
        
		const name: string = this.inputParams[1];
		this.name = name;
	}

	private async login()  {
		const userModel = new UserBase(this.name);
		const result = await userModel.get();
		
		if(!result) {
			await userModel.create();
		}
		await write("login", this.name);
	}

	private async getWallet() {
		const wallet = new WalletBase();
		const result = await wallet.get(this.name);
		return result;
	}

	private getOutputMessage(wallet: IWallet): void {
		console.log(`Hello, ${this.name}!`);
		console.log(`Your balance is $${wallet.balance || 0}`);

		if(wallet.debtAmount > 0) {
			if(wallet.debtFromUser) {
				console.log(`Owed $${wallet.debtAmount} from ${wallet.debtFromUser} `);
				return;
			}  
			console.log(`Owed $${wallet.debtAmount} to ${wallet.debtToUser} `);
		}
	}
} 