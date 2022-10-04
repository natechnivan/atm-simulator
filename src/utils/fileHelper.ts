import { readFile, writeFile } from "fs/promises";

export const read = async(name: string, content = "", init = false) => {
	try {
		const result = await readFile(`data/${name}.json`, "utf8");
		return result;
	} catch(err) {
		if(init)
			await writeFile(name, `${content}`);
	}
};

export const write = async(name: string, content: string) => {
	try {
		await writeFile(`data/${name}.json`, content);
	} catch(err) {
		console.error(err);
	}
};