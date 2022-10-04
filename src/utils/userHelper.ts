import { read } from "./fileHelper";

export const getLoggedInUser = async() => {
	const result = await read("login", "");
	if(!result) {
		return "";
	}
	return result;
};