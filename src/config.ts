import { workspace } from "vscode";

export class DueDateConfig {
	public title: string = "";
	public color: string = "";
	public youngerThan: number = 0;
}

export class DueConfig {
	public static getCategories(): DueDateConfig[] {
		let possibleCategories:
			| DueDateConfig[]
			| undefined = workspace.getConfiguration("due").get("categories");

		console.debug("Config: ", possibleCategories);

		if (possibleCategories) {
			return possibleCategories;
		} else {
			console.error("Could not find a category-config.");
			return [];
		}
	}
}
