import { Range, TextEditor, Uri, window } from "vscode";

export class DueDate {
	public date: Date;
	private day = 86400000;

	private static expiredDecoration = window.createTextEditorDecorationType({
		color: "red",
		fontWeight: "bold",
	});

	private static todayDecoration = window.createTextEditorDecorationType({
		color: "orange",
		fontWeight: "bold",
	});

	private static tomorrowDecoration = window.createTextEditorDecorationType({
		color: "purple",
		fontWeight: "bold",
	});

	private static thisWeekDecoration = window.createTextEditorDecorationType({
		color: "blue",
		fontWeight: "bold",
	});

	private static doneDecoration = window.createTextEditorDecorationType({
		color: "green",
		fontWeight: "bold",
	});

	private static laterDecoration = window.createTextEditorDecorationType({
		color: "grey",
		fontWeight: "bold",
	});
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
		switch (this.dueAt()) {
			case DueStatus.expired:
				return DueDate.expiredDecoration;
			case DueStatus.today:
				return DueDate.todayDecoration;
			case DueStatus.tomorrow:
				return DueDate.tomorrowDecoration;
			case DueStatus.thisWeek:
				return DueDate.thisWeekDecoration;
			case DueStatus.later:
				return DueDate.laterDecoration;
			default:
				return DueDate.laterDecoration;
		}
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
