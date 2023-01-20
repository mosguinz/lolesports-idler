import { AppConfig } from "./types";

const DEFAULT_CONFIG: AppConfig = {
    enabled: false,
    preferTwitch: true,
    muteTabs: true,
    autoCloseTabs: true,
}

async function loadConfig() {
    let config: AppConfig = (await chrome.storage.local.get('config'))?.config;
    if (!Object.keys(config).length) {
        console.log("Config not found, using default values");
        await setDefaultConfig();
        config = DEFAULT_CONFIG;
    }
    console.log("Config: ", config);
    return config;
}

async function setDefaultConfig() {
    await chrome.storage.local.set({ config: DEFAULT_CONFIG });
}

function getCheckboxes(): NodeListOf<HTMLInputElement> {
    return document.querySelectorAll<HTMLInputElement>
        ("form[id=appConfig] > input[type=checkbox]");
}

function updateCheckbox(elementId: string, value: boolean) {
    const cb = document.getElementById(elementId) as HTMLInputElement
    cb.checked = value
}

async function onLoad() {
    const config = await loadConfig();
    const checkboxes = getCheckboxes();
    checkboxes.forEach((cb) => {
        cb.checked = config[cb.id as keyof AppConfig];
    });

    const appConfig = document.getElementById("appConfig") as HTMLFormElement;
    appConfig.addEventListener("change", async () => {
        await onFormChange();
    });
}

async function onFormChange() {
    let config = {} as AppConfig;
    const checkboxes = getCheckboxes();
    checkboxes.forEach((e) => {
        config[e.id as keyof AppConfig] = e.checked;
    });
    console.log(config);
}


window.onload = onLoad;
