import { ICommand } from ".";
import { write } from "../../utils/fileHelper";
import { getLoggedInUser } from "../../utils/userHelper";
export class LogoutCommand implements ICommand {
	private inputParams: string[];

	constructor(inputParams: string[]) {
		this.inputParams = inputParams;
	}

	public async execute() {
		const logInUser = await getLoggedInUser();

		await write("login", "");
		console.log(`Goodbye, ${ logInUser }!`);
	}
} 