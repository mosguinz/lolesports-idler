import { AppConfig } from "./types";
import * as Storage from "./storage";

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
    const config = await Storage.getAppConfig();
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
    await Storage.setAppConfig(config);
}


window.onload = onLoad;
