import { TextEditor, TextEditorDecorationType, window } from "vscode";
import { DueConfig } from "./config";
import { DueDate, DueStatus } from "./dueDate";

export class DecorationDate {
	public decoration: TextEditorDecorationType;
	public dueDates: DueDate[] = [];

	constructor(public status: string, color: string) {
		this.decoration = window.createTextEditorDecorationType({
			color: color,
			fontWeight: "bold",
		});
	}
}

export class DecorationWrapper {
	// initialize this as static to have a single instance of each decoration
	public static decorationDates = DueConfig.getCategories().map(
		(conf) => new DecorationDate(conf.title, conf.color)
	);

	constructor() {}

	/**
	 *
	 * @param dueDates Updates the stored dueDates and re-decorates the document.
	 * @param editor
	 */
	updateDecorations(dueDates: DueDate[], editor: TextEditor) {
		// remove all decorations to make sure there are no lost references
		DecorationWrapper.removeDecorationFor(editor);

		DecorationWrapper.decorationDates.forEach((decDate) => {
			decDate.dueDates = [];
		});
		dueDates.forEach((date) => {
			this.addToSpecific(date);
		});

		// decorate with the new dueDates
		this.decorate(editor);
	}

	private addToSpecific(date: DueDate) {
		let specific = DecorationWrapper.decorationDates.filter(
			(decDate) => decDate.status === date.dueAt()
		)[0];
		specific.dueDates.push(date);
	}

	private decorate(editor: TextEditor) {
		DecorationWrapper.decorationDates.forEach((decDate) => {
			editor.setDecorations(
				decDate.decoration,
				decDate.dueDates
					.filter(
						// check if I should really include this date
						(date) => date.uri.path === editor.document.uri.path
					)
					.map((date) => date.range)
			);
		});
	}

	static removeDecorationFor(editor: TextEditor) {
		DecorationWrapper.decorationDates.forEach((decDate) => {
			editor.setDecorations(decDate.decoration, []);
		});
	}
}
