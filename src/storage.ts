/**
 * Wrapper for accessing storage
 */

import { AppConfig, AppSession } from "./types";

const DEFAULT_CONFIG: AppConfig = {
    enabled: false,
    preferTwitch: true,
    muteTabs: true,
    autoCloseTabs: true,
}

export async function getAppConfig() {
    let config: AppConfig = (await chrome.storage.local.get('config'))?.config;
    if (!config || !Object.keys(config).length) {
        console.log("Config not found, using default values");
        await setAppConfig(DEFAULT_CONFIG);
        config = DEFAULT_CONFIG;
    }
    console.log("Config: ", config);
    return config;
}

export async function setAppConfig(config: AppConfig) {
    console.log("Saving config:", config);
    await chrome.storage.local.set({ config: config });
}

export async function updateAppConfig(toUpdate: Partial<AppConfig>) {
    let config = await getAppConfig();
    const updated = Object.assign(config, toUpdate);
    await setAppConfig(updated);
}

export async function getAppSession(): Promise<AppSession> {
    return (await chrome.storage.session.get("appSession"))?.appSession;
}

export async function setAppSession(session: AppSession) {
    await chrome.storage.session.set({ appSession: session });
}

export async function updateAppSession(toUpdate: Partial<AppSession>) {
    let session = await getAppSession();
    const updated = Object.assign(session, toUpdate);
    await setAppSession(updated);
}

export async function pushSpawnedTabs(tabs: chrome.tabs.Tab[]) {
    const session = await getAppSession();
    await updateAppSession({ spawnedTabs: session.spawnedTabs.concat(tabs) });
}
