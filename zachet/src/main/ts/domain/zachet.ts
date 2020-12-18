import {AppModel} from "kontext/sd/appmodel";
import {computed, Computed, observable, Observable, observableArray, ObservableArray} from "knockout";
import {sd} from "kontext/sd/sd";
import {Map} from "kontext/sd/types";

declare let app: ZachetApp;

interface TicketProjection {
	id: string,
	task: string
}

let emptyTicket = {
	"id": "", "task": ""
}

class Ticket {
	code: Observable<string> = observable("");
}

class ZachetApp extends AppModel {
	tickets: ObservableArray<Ticket> = observableArray([]);
	
	connect () {
		let bilet: Ticket;
		let tickets: Ticket[];
		sd.get("tickets.json", (data: TicketProjection[]) => {
			this.tickets(tickets);
		});
	}
}

new ZachetApp();