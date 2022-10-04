// userName, createdOn, updatedOn
import { IModelBase } from "./index";
import { read, write  } from "../utils/fileHelper";
import { randomUUID } from "crypto";

export interface IUser extends IModelBase {
    name: string;
}

export class UserBase {
	id: string;
	name: string;
	createdOn: Date;
	updatedOn: Date;

	constructor(name: string ) {
		this.name = name;
		this.id = randomUUID();
		this.createdOn = new Date();
		this.updatedOn = new Date();
	}

	public async create() {
		const user: IUser = { ...this };
            
		const content = JSON.stringify(user);
		const fileName =  this.name.replace(" ", "_").concat("_user");
		return await write(fileName, content);
	}

	public async get() {
		const result: string = await read(this.name.replace(" ", "_").concat("_user"), "") as string;
		if(!result) {
			return "";
		}
		return JSON.parse(result);
	}
}