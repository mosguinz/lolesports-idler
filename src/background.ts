import { AppConfig, AppSession } from "./types";
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

async function mainEventLoop() {
    const tab = await openSchedulePage();
    const res = await Scraper.getEvents(tab);
    res.forEach(a => { console.log(a); })
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

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {

});
