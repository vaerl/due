import { Event, EventEmitter, TreeDataProvider, TreeItem } from "vscode";
import { DueDate } from "./dueDate";

export class DueDateProvider implements TreeDataProvider<DueDate> {
	private dueDates: DueDate[] = [];

	constructor(public status: string) {}

	private _onDidChangeTreeData: EventEmitter<
		DueDate | undefined | null | void
	> = new EventEmitter<DueDate | undefined | null | void>();
	readonly onDidChangeTreeData: Event<DueDate | undefined | null | void> = this
		._onDidChangeTreeData.event;

	getTreeItem(element: DueDate): TreeItem {
		return element;
	}

	// called when initialized
	getChildren(_element?: DueDate): Thenable<DueDate[]> {
		// I can ignore this as there will never be children
		return Promise.resolve(
			this.dueDates.filter((date) => date.dueAt() === this.status)
		);
	}

	update(dueDates: DueDate[]) {
		this.dueDates = dueDates;
		this._onDidChangeTreeData.fire();
	}
}
