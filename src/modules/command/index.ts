import { DepositCommand } from "./deposit";
import { LoginCommand } from "./login";
import { LogoutCommand } from "./logout";
import { TransferCommand } from "./transfer";
import { WithdrawCommand } from "./withdraw";

export enum Command {
    login = "login",
    deposit = "deposit",
    withdraw = "withdraw",
    transfer = "transfer",
    logout = "logout"
}

export interface ICommand {
    execute():void;
}

export interface ICommandFactory {
    createCommand(command: Command, inputParams: string[]) : ICommand;
}

export class CommandInvoker implements ICommandFactory {
	public createCommand(command: Command, inputParams: string[]): ICommand {
		let cmd: ICommand;
		switch (command)
		{
		case Command.login:
			cmd = new LoginCommand(inputParams);

			break;
		case Command.deposit:
			cmd = new DepositCommand(inputParams);
			break;
		case Command.withdraw:
			cmd = new WithdrawCommand(inputParams);
			break;
		case Command.transfer:
			cmd = new TransferCommand(inputParams);
			break;
		case Command.logout:
			cmd = new LogoutCommand(inputParams);
			break;
		default:
			throw new Error(`Invalid Command: ${command}`);
			break;
		}
		return cmd;
	}
}