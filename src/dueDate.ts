import { Range, Uri } from "vscode";

export class DueDate {
	public date: Date;
	private day = 86400000;

	constructor(
		public readonly uri: Uri,
		dateMatch: string,
		public readonly range: Range
	) {
		this.date = new Date(dateMatch.substring(1));
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
