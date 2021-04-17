import { Uri } from "vscode";

export class DueDate {
	public date: Date;

	constructor(public readonly file: Uri, public readonly value: string) {
		this.date = new Date(value);
	}
export enum DueStatus {
	today,
	tomorrow,
	thisWeek,
	later,
}
