import { Uri } from "vscode";

export class DueDate {
	public date: Date;

	constructor(
		public readonly uri: Uri,
		dateMatch: string,
		public readonly range: Range
	) {
		this.date = new Date(dateMatch.substring(1));
	}

export enum DueStatus {
	today,
	tomorrow,
	thisWeek,
	later,
}
