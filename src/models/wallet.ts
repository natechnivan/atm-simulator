import { IModelBase } from "./index";
import { read, write  } from "../utils/fileHelper";

export interface IWallet extends IModelBase {
    name: string;
    balance: number,
    creditAmount: number,
    debtAmount:number,
    debtFromUser: string,
    debtToUser: string
}

export class WalletBase {
	public async create(wallet: IWallet, name: string): Promise<boolean> {
		const content = JSON.stringify(wallet);
		await write(this.getFileName(name), content);

		return true;
	}

	public async get(name: string) {
		const result: string = await read(this.getFileName(name), "") as string;
		if(!result) {
			return "";
		}
		return JSON.parse(result);
	}

	private getFileName(name: string): string {
		const fileName = name.replace(" ", "_");
		return fileName.concat("_wallet");
	}
}