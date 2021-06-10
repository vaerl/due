import { Range, TreeItem, TreeItemCollapsibleState, Uri } from "vscode";
import { DueConfig } from "./config";

export class DueDate extends TreeItem {
	public date: Date;
	public hasTime: boolean = false;
	private day = 86400000;

	public text?: Text;

	constructor(
		public readonly uri: Uri,
		public line: number,
		dateMatch: string,
		public readonly range: Range,
		public textMatch?: string
	) {
		super(getDateString(dateMatch), TreeItemCollapsibleState.None);
		// remove @
		dateMatch = dateMatch.substring(1);

		let date = dateMatch.split("-")[0];
		let time = dateMatch.split("-")[1];

		let dateValues = date.split(".");

		this.date = new Date(
			Number.parseInt(dateValues[2]),
			Number.parseInt(dateValues[1]) - 1,
			Number.parseInt(dateValues[0])
		);

		if (time) {
			this.hasTime = true;
			let timeValues = time.split(":");

			this.date = new Date(
				Number.parseInt(dateValues[2]),
				Number.parseInt(dateValues[1]) - 1,
				Number.parseInt(dateValues[0]),
				Number.parseInt(timeValues[0]),
				Number.parseInt(timeValues[1]),
				0,
				0
			);
		} else {
			this.date = new Date(
				Number.parseInt(dateValues[2]),
				Number.parseInt(dateValues[1]) - 1,
				Number.parseInt(dateValues[0]),
				0,
				0,
				0,
				0
			);
		}

		if (textMatch) {
			this.text = new Text(textMatch);

			// TODO use better text here?
			super.label = this.text.value + " - " + dateMatch;
		}
	}

	dueAt(): string {
		let difference: number;

		if (this.hasTime) {
			// since i have specified a time, I can simply calculate the difference like this
			let today = new Date();
			today.setSeconds(0);
			today.setMilliseconds(0);
			difference = this.date.valueOf() - today.valueOf();
		} else {
			let today = new Date();
			today.setHours(0);
			today.setMinutes(0);
			today.setSeconds(0);
			today.setMilliseconds(0);

			difference = this.date.valueOf() - today.valueOf();
		}

		let categories = DueConfig.getCategories();
		for (let index = 0; index < categories.length; index++) {
			const conf = categories[index];
			if (difference < conf.youngerThan) {
				return conf.title;
			}
		}

		// return error if the above does not match
		return DueConfig.getCategories()[DueConfig.getCategories().length - 1]
			.title;
	}
}

export enum DueStatus {
	expired,
	today,
	tomorrow,
	thisWeek,
	later,
	done,
}

export class Text {
	public value: string;
	// optional, as this might not be a task
	public completed?: boolean;

	constructor(textMatch: String) {
		let parts = textMatch.split("]");

		// splitting at a non-existing character yields undefined - check if thats happening
		if (parts[1]) {
			// there is a task here
			this.value = parts[1].trim();

			// basically results to '- [x' or '- ['
			let markdownTaskRest = parts[0].trim();
			if (markdownTaskRest[markdownTaskRest.length - 1] === "x") {
				this.completed = true;
			} else {
				this.completed = false;
			}
		} else {
			// no task here, check for headline
			this.value = parts[0]
				.split("")
				.filter((part) => part !== "#")
				.join("")
				.trim();
		}
		console.debug("Text: ", this);
	}
}
function getDateString(dateMatch: string): string {
	dateMatch = dateMatch.substring(1);
	dateMatch = dateMatch.substring(0, dateMatch.length);
	return dateMatch;
}
