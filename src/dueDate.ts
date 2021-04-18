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
		// TODO discard hour if not specified - this might need two kinds of Dates?
		let difference = this.date.valueOf() - Date.now().valueOf();
		console.debug("this: ", this);
		console.debug("date: ", this.date.valueOf());
		console.debug("now: ", Date.now().valueOf());
		console.debug("Difference: ", difference);

		if (difference < 0) {
			return DueStatus.expired;
		} else if (difference < this.day) {
			return DueStatus.today;
		} else if (difference < this.day * 2) {
			return DueStatus.tomorrow;
		} else if (difference < this.day * 7) {
			return DueStatus.thisWeek;
		} else {
			return DueStatus.later;
		}
	}

	getDecoration() {
		let color: string;

		switch (this.dueAt()) {
			case DueStatus.expired:
				color = "red";
				break;
			case DueStatus.today:
				color = "orange";
				break;
			case DueStatus.tomorrow:
				color = "yellow";
				break;
			case DueStatus.thisWeek:
				color = "blue";
				break;
			case DueStatus.later:
				color = "purple";
				break;
			default:
				color = "grey";
				break;
		}

		return window.createTextEditorDecorationType({
			color: color,
			fontWeight: "bold",
		});
	}
}

export enum DueStatus {
	expired,
	today,
	tomorrow,
	thisWeek,
	later,
}
