import { Event, League } from './types';

function _getEvents(): Event[] {
    const element: any = document.querySelector("div.Event");
    const events: Event[] = element?._component?.props?.schedule?.events;
    console.log(events);
    return events || _getEvents(); // TODO: find a better way
}

function _getLeagues(): League[] {
    const element: any = document.querySelector("div.EventFilter");
    const leagues: League[] = element?._component?.props?.leagues;
    console.log(leagues);
    return leagues || _getLeagues(); // TODO: find a better way
}

export async function getEvents(tab: chrome.tabs.Tab) {
    return await chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        func: _getEvents,
        world: "MAIN"
    });
}

export async function getLeagues(tab: chrome.tabs.Tab) {
    return await chrome.scripting.executeScript({
        target: { tabId: tab.id! },
        func: _getLeagues,
        world: "MAIN"
    });
}
