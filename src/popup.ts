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

async function writeConfig(config: AppConfig) {
    console.log("Saving config:", config);
    await chrome.storage.local.set({ config: config });
}

async function setDefaultConfig() {
    await writeConfig(DEFAULT_CONFIG);
}

/**
 * Get the checkbox elements from the popup page.
 * The `id` attribute of the checkboxes are guaranteed to
 * be a key of {@interface AppConfig}.
 */
function getCheckboxes(): NodeListOf<HTMLInputElement> {
    return document.querySelectorAll<HTMLInputElement>
        ("form[id=appConfig] > input[type=checkbox]");
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
    await writeConfig(config);
}


window.onload = onLoad;
