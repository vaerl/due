import { Range, Uri, window } from "vscode";

export class DueDate {
	public date: Date;
	private day = 86400000;

	constructor(
		public readonly uri: Uri,
		dateMatch: string,
		public readonly range: Range
	) {
		// remove @
		dateMatch = dateMatch.substring(1);

		let date = dateMatch.split("-")[0];
		let time = dateMatch.split("-")[1];

		let dateValues = date.split(".");

		if (time) {
			let timeValues = time.split(":");

			this.date = new Date(
				Number.parseInt(dateValues[2]),
				Number.parseInt(dateValues[1]) - 1,
				Number.parseInt(dateValues[0]),
				Number.parseInt(timeValues[0]),
				Number.parseInt(timeValues[1])
			);
		} else {
			this.date = new Date(
				Number.parseInt(dateValues[2]),
				Number.parseInt(dateValues[1]) - 1,
				Number.parseInt(dateValues[0])
			);
		}
	}

	dueAt(): DueStatus {
		let difference = Date.now().valueOf() - this.date.valueOf();

		if (difference < this.day) {
			return DueStatus.today;
		} else if (difference < this.day * 2) {
			return DueStatus.tomorrow;
		} else if (difference < this.day * 7) {
			return DueStatus.thisWeek;
		} else {
			return DueStatus.later;
		}
	}
}

export enum DueStatus {
	today,
	tomorrow,
	thisWeek,
	later,
}
