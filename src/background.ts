import { AppConfig, AppSession, EsportEvent } from "./types";
import * as Scraper from "./scraper";
import * as Storage from "./storage";


/**
 * Open the LoL Esports schedule page.
 * The session's `scheduleTab` will be set and `spawnedTabs`
 * are reset.
 */
async function openSchedulePage() {
    const tab = await chrome.tabs.create({
        url: "https://lolesports.com/schedule"
    });
    const session: AppSession = {
        scheduleTab: tab,
        spawnedTabs: []
    }
    await Storage.setAppSession(session);
    return tab
}

/**
 * Schema:
 * https://lolesports.com/live/{League.slug}/{Stream.parameter}
 */
function getStreamUrl(event: EsportEvent, preferTwitch: boolean) {
    const streamUrl = `https://lolesports.com/live/${event.league.slug}/`;
    const stream = event.streams?.find(s => s.provider === "twitch");
    if (preferTwitch && stream) {
        return streamUrl + stream.parameter;
    }
    return streamUrl;
}


/**
 * Open the streams using the provided config.
 */
async function openStreams(events: EsportEvent[], config: AppConfig) {
    let spawnedTabs: chrome.tabs.Tab[] = [];
    for (const event of events) {
        const targetUrl = getStreamUrl(event, config.preferTwitch);
        const session = await Storage.getAppSession();

        if (session.spawnedTabs.find(tab => tab.url || tab.pendingUrl === targetUrl)) {
            continue;
        }

        const tab = await chrome.tabs.create({ url: targetUrl });
        console.log(`Opening ${event.league.name} event. preferTwitch=${config.preferTwitch}`);
        spawnedTabs.push(tab);

        await chrome.tabs.update(tab.id!, {
            autoDiscardable: false,
            muted: config.muteTabs
        });
    }
    await Storage.pushSpawnedTabs(spawnedTabs);
}


/**
 * Close tabs that have navigated away from the original target.
 * Usually, streams that have ended will be redirected to the VODs page.
 */
async function closeStaleTabs() {
    const session = await Storage.getAppSession();
    let toClose: number[] = [];
    for (const savedTab of session.spawnedTabs) {
        const tab = await chrome.tabs.get(savedTab.id!);
        console.log("tabcheck", tab);

        if ((tab.url || tab.pendingUrl)
            !== (savedTab.url || savedTab.pendingUrl)) {
            toClose.push(savedTab.id!);
        }
    }

    await chrome.tabs.remove(toClose);
    await Storage.removeSpawnedTabs(toClose);
}

async function mainEventLoop() {
    const { scheduleTab } = await Storage.getAppSession();
    const events = await Scraper.getEvents(scheduleTab);
    const config = await Storage.getAppConfig();

    if (!events.length) {
        console.error("No events found! Did the scraper break?");
        return;
    }
    const liveEvents = events.filter(e => e.state === "inProgress");
    if (!liveEvents.length) {
        console.log("No live events found");
        return;
    }

    await openStreams(liveEvents, config);

    if (config.autoCloseTabs) {
        await closeStaleTabs();
    }
}

async function startIdler() {
    await openSchedulePage();
    await mainEventLoop();
    chrome.alarms.create({ periodInMinutes: 1 });
}

async function stopIdler() {
    await Storage.updateAppConfig({ enabled: false });
    chrome.alarms.clearAll();
}

// This listener's only purpose is to start the idler.
chrome.storage.onChanged.addListener(async (changes, areaName) => {
    const configChanges = changes?.config;
    if (!configChanges) {
        return;
    }

    const newValue: AppConfig = configChanges?.newValue;
    const oldValue: AppConfig = configChanges?.oldValue;
    if (newValue?.enabled === oldValue?.enabled) {
        return;
    }

    newValue.enabled ? await startIdler() : await stopIdler();
});

// Set state as off if the primary tab is killed
chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
    const { scheduleTab } = await Storage.getAppSession();
    if (tabId === scheduleTab.id) {
        await stopIdler();
    }
});

chrome.alarms.onAlarm.addListener(async () => {
    await mainEventLoop();
});
