import { AppConfig, AppSession, EsportEvent } from "./types";
import * as Scraper from "./scraper";
import * as Storage from "./storage";

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

async function mainEventLoop() {
    const tab = await openSchedulePage();
    const events = await Scraper.getEvents(tab);
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

    // Spawn and save tabs.
    let spawnedTabs: chrome.tabs.Tab[] = [];
    liveEvents.forEach(async (event) => {
        const targetUrl = getStreamUrl(event, config.preferTwitch);
        const session = await Storage.getAppSession();

        if (session.spawnedTabs.find(tab => tab.url === targetUrl)) {
            return;
        }

        const tab = await chrome.tabs.create({ url: targetUrl });
        console.log(`Opening ${event.league.name} event. preferTwitch=${config.preferTwitch}`);
        spawnedTabs.push(tab);

        if (config.muteTabs) {
            await chrome.tabs.update(tab.id!, { muted: true });
        }
    });
    await Storage.pushSpawnedTabs(spawnedTabs);

    if (!config.autoCloseTabs) {
        return;
    }

    // Check if tabs need to be closed.
    const session = await Storage.getAppSession();
    let toClose: number[] = [];
    session.spawnedTabs.forEach(async (savedTab) => {
        const tab = await chrome.tabs.get(savedTab.id!);
        if (!tab.url?.includes("lolesports.com/live")) {
            toClose.push(tab.id!);
        }
    });
    await chrome.tabs.remove(toClose);
    await Storage.removeSpawnedTabs(toClose);

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
    if (newValue.enabled) {
        await mainEventLoop();
    }
});

// Set state as off if the primary tab is killed
chrome.tabs.onRemoved.addListener(async (tabId, removeInfo) => {
    const { scheduleTab } = await Storage.getAppSession();
    if (tabId === scheduleTab.id) {
        await Storage.updateAppConfig({ enabled: false });
    }
});
