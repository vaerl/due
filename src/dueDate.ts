import { Range, TextEditor, Uri, window } from "vscode";

export class DueDate {
	public date: Date;
	public hasTime: boolean = false;
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
	}

	dueAt(): DueStatus {
		let difference;
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

	static removeDecorationFor(editor: TextEditor) {
		editor.setDecorations(DueDate.expiredDecoration, []);
		editor.setDecorations(DueDate.todayDecoration, []);
		editor.setDecorations(DueDate.tomorrowDecoration, []);
		editor.setDecorations(DueDate.thisWeekDecoration, []);
		editor.setDecorations(DueDate.laterDecoration, []);
	}
}

export enum DueStatus {
	expired,
	today,
	tomorrow,
	thisWeek,
	later,
}
