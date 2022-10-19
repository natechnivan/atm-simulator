import PromptSync from "prompt-sync";
import { Command, CommandInvoker, ICommand } from "./modules/command";

console.log("\"Welcome to Keeto Bank. \n");
const prompt = PromptSync();
const input = prompt({ });

const args: string[] = input.split(" ");
const commandType : Command = args[0] as Command;
const invoker = new CommandInvoker();

const command: ICommand = invoker.createCommand(commandType, args) as ICommand;
command.execute();