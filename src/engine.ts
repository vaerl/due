import { Position, Range, TextEditor, Uri, window, workspace } from "vscode";
import * as fs from "fs";
import { DueDate } from "./dueDate";
import { DecorationWrapper } from "./decorationWrapper";

export class Engine {
	public dueDates: DueDate[] = new Array();
	public decWrapper: DecorationWrapper = new DecorationWrapper();

	// match 11.11.1111 and 11.11.1111-11:11
	public exp = "@\\d\\d\\.\\d\\d\\.\\d\\d\\d\\d(-\\d\\d:\\d\\d)?";

	constructor() {}

	scanWorkspace() {
		console.debug("Scanning the workspace for matches.");

		// discard all dueDates for a clean scan
		this.dueDates = [];

		workspace.findFiles("*").then((files) => {
			console.debug("Found files in workspace: ", files);
			files.forEach(async (file) => {
				await this.scanFile(file);
			});
			// TODO make the above part complete synchronously
			console.debug("Scanned all files.");
		});
	}

	async scanFile(file: Uri) {
		// TODO there is some error here when calling it separately for the first time, probably because scanWorkspace sets everything up
		if (file.scheme === "file") {
			let text = await this.getFileText(file);

			// remove possible duplicates by discarding for the current file
			this.discardDates(file);

			// match all instances in the extracted text
			const textArray = text.split("\n");
			for (let line = 0; line < textArray.length; line++) {
				let match = textArray[line].match(this.exp);

				if (match !== null && match.index !== undefined) {
					console.info("Matched line: ", textArray[line]);
					let range = new Range(
						new Position(line, match.index),
						new Position(line, match.index + match[0].length)
					);

					let date = new DueDate(
						file,
						line,
						match.toString(),
						range,
						textArray[line].split("@")[0]
					);
					this.dueDates.push(date);
				}
			}

			console.info("Done scanning with: ", this.dueDates);
			this.decorate();
			// TODO show dueDates in sidebar with the specified task (if present)
		} else {
			console.info("URI is not a file, ignoring.");
		}
	}

	/**
	 *
	 * @param file file to get the text from
	 * @returns text of the file, might be empty
	 */
	getFileText(file: Uri): Promise<string> {
		let text = "";

		// try getting the text - which might not result in anything
		workspace.textDocuments.forEach((td) => {
			if (td.uri === file) {
				text = td.getText();
			}
		});

		// back this up with this
		if (text === "") {
			console.debug("Text was empty after getText(), trying fs.readFile().");

			return new Promise<string>((success, reject) => {
				fs.readFile(file.path, "utf8", (err, data) => {
					if (data) {
						success(data);
					} else {
						console.error("Could not read the file: ", err);
						reject(err);
					}
				});
			});
		} else {
			return Promise.resolve(text);
		}
	}

	/**
	 *
	 * @returns first visible TextEditor that shows dueDates.
	 */
	getOpenEditor(): TextEditor {
		return window.visibleTextEditors.filter((editor) =>
			// TODO think about not filtering - if there are no dueDates, decorate() simply won't do anything
			// TODO if moving to above implementation rename to getFocusedEditor
			this.dueDates.map((d) => d.uri.path).includes(editor.document.uri.path)
		)[0];
	}

	/**
	 *
	 * @param file the file to get the TextEditor for
	 * @returns a TextEditor which shows the given file, may be undefined
	 */
	getOpenEditorFor(file: Uri): TextEditor {
		return window.visibleTextEditors.filter(
			(editor) => file.path === editor.document.uri.path
		)[0];
	}

	decorate() {
		const editor = this.getOpenEditor();
		console.debug("Decorating editor:", editor);

		this.decWrapper.updateDecorations(this.dueDates, editor);
	}

	/**
	 * Discards all dueDates that are part of the given file.
	 * @param file The file to discard dueDates for.
	 */
	discardDates(file: Uri) {
		this.dueDates = this.dueDates.filter((date) => date.uri.path !== file.path);
	}
}
