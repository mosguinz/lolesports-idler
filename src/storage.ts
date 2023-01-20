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

export async function setAppSession(session: AppSession) {
    await chrome.storage.session.set({ appSession: session });
}
