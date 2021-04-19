import { Position, Range, TextEditor, Uri, window, workspace } from "vscode";
import * as fs from "fs";
import { DueDate } from "./dueDate";

export class Engine {
	public dueDates: DueDate[] = new Array();

	// match 11.11.1111 and 11.11.1111-11:11
	public exp = "@\\d\\d\\.\\d\\d\\.\\d\\d\\d\\d(-\\d\\d:\\d\\d)?";

	constructor() {}

	scanWorkspace() {
		console.debug("Scanning the workspace for matches.");
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

			// discard all dates in the current file
			this.discardDates(file);

			// match all instances in the extracted text
			const textArray = text.split("\n");
			console.debug("text-array: ", textArray);
			for (let line = 0; line < textArray.length; line++) {
				let match = textArray[line].match(this.exp);

				if (match !== null && match.index !== undefined) {
					console.debug("Matched line: ", match.toString());
					let range = new Range(
						new Position(line, match.index),
						new Position(line, match.index + match[0].length)
					);

					// TODO get todo/text before @
					let date = new DueDate(file, match.toString(), range);
					this.dueDates.push(date);
				}
			}

			console.debug("Done scanning with: ", this.dueDates);
			this.decorate();
		} else {
			console.debug("URI is not a file, ignoring.");
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

		console.debug("Text after getText(): ", text);

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

	getOpenEditor(): TextEditor {
		return window.visibleTextEditors.filter((editor) =>
			this.dueDates.map((d) => d.uri.path).includes(editor.document.uri.path)
		)[0];
	}

	getOpenEditorFor(file: Uri): TextEditor {
		return window.visibleTextEditors.filter(
			(editor) => file.path === editor.document.uri.path
		)[0];
	}

	decorate() {
		const editor = this.getOpenEditor();
		console.log("Decorating editor:", editor);
		DueDate.removeDecorationFor(editor);

		this.dueDates.forEach((date) => {
			if (date.uri.path === editor.document.uri.path) {
				editor.setDecorations(date.getDecoration(), [date.range]);
			}
		});
	}

	discardDates(file: Uri) {
		this.dueDates = this.dueDates.filter((date) => date.uri.path !== file.path);
	}
}
