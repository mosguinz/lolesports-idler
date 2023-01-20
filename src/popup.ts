import { AppConfig } from "./types";

const DEFAULT_CONFIG: AppConfig = {
    enabled: false,
    preferTwitch: true,
    muteTabs: true,
    autoCloseTabs: true,
}

async function loadConfig() {
    return await chrome.storage.local.get('config') as AppConfig;
}

async function setDefaultConfig() {
    await chrome.storage.local.set({ config: DEFAULT_CONFIG });
}

function updateCheckbox(elementId: string, value: boolean) {
    const cb = document.getElementById(elementId) as HTMLInputElement
    cb.checked = value
}

async function onLoad() {
    let config = await loadConfig();
    if (!Object.keys(config).length) {
        await setDefaultConfig();
        config = DEFAULT_CONFIG;
    }
    console.log(config);

    updateCheckbox("enabled", config.enabled);
    updateCheckbox("preferTwitch", config.preferTwitch);
    updateCheckbox("muteTabs", config.muteTabs);
    updateCheckbox("autoCloseTabs", config.autoCloseTabs);

    const appConfig = document.getElementById("appConfig") as HTMLFormElement;
    appConfig.addEventListener("change", async () => {
        await onFormChange();
    });
}

async function onFormChange() {
    let config = {} as AppConfig;
    const checkboxes = document.querySelectorAll<HTMLInputElement>("form[id=appConfig] > input[type=checkbox]");
    checkboxes.forEach((e) => {
        config[e.id as keyof AppConfig] = e.checked;
    });
    console.log(config);
}


window.onload = onLoad;
