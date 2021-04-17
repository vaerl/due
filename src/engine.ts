import { workspace } from "vscode";
import * as fs from "fs";
import { DueDate } from "./dueDate";

export class Engine {
	public dueDates: DueDate[] = new Array();

	// match 11.11.1111 and 11.11.1111-11:11
	public exp = "@\\d\\d\\.\\d\\d\\.\\d\\d\\d\\d(-\\d\\d:\\d\\d)?";

	constructor() {}

	initiateScan() {
	scanWorkspace() {
		console.debug("Scanning the workspace for matches.");
		workspace.findFiles("*").then((files) => {
			console.debug("Found files in workspace: ", files);
			files.forEach((file) => {
				if (file.scheme === "file") {
					let text: any = null;

					workspace.textDocuments.forEach((td) => {
						if (td.uri === file) {
							text = td.getText();
						}
					});

					if (text === null) {
						fs.readFile(file.path, "utf8", (err, data) => {
							if (data) {
								console.debug("Read data with fs: ", data);
								text = data;
								let match;
								while ((match = this.matcher.exec(text))) {
									console.debug("Matched line: ", match.toString());
									this.dueDates.push(new DueDate(file, match.toString()));
								}
							} else {
								console.error(err);
							}
						});
					}
					// TODO await fs-promise and match here
					console.debug("Done scanning with: ", this.dueDates);
				} else {
					console.debug("URI is not a file!");
				}
			});
		});
	}
}
