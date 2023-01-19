import { Event, League } from './types';

function getEvents(): Event[] {
    const element: any = document.querySelector("div.Event");
    const events: Event[] = element?._component?.props?.schedule?.events;
    console.log(events);
    return events
}

function getLeagues(): League[] {
    const element: any = document.querySelector("div.EventFilter");
    const leagues: League[] = element?._component?.props?.leagues;
    console.log(leagues);
    return leagues;
}

getEvents();
getLeagues();
