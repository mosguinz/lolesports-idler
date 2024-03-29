export interface EsportEvent {
    /** Scheduled start time of the event. */
    startTime: Date;
    state: State;
    /**
     * `match` if there is an ongoing game. `show` if the match has yet to
     *  start, usually preshow content or countdown.
     */
    type: EventType;
    /** The "block" that the event belongs to. Usually "Week X" or "Round X". */
    blockName?: string;
    /** The {@interface League} this event belongs to. */
    league: League;
    /** Present only if `Event.type` has an `EventType` of `match`. */
    match?: Match;
    /** Appears to be only present for live (`inProgress`) events. */
    id?: string;
    tournament?: Tournament;
    streams?: Stream[];
}

/**
 * Represents a league. If obtained from an {@interface Event},
 * the only contains the `name` and `slug`.
 */
export interface League {
    /**
     * The name of the league.
     * This is usually the "preferred" name that the league goes by, e.g.,
     * "LCK" and not "League of Legends Champions Korea".
     */
    name: string;
    /**
     * The URL slug for the league.
     * The slug, among other things, are used:
     *  - as a query parameter for filtering schedules,
     *  - as the path for livestream, `/live/`.
     */
    slug: string;
    id?: string;
    /** The league's icon. Usually suitable for black background. */
    image?: string;
    /**
     * The priority from which to derive the display position of the league
     * on the filter sidebar.
     */
    priority?: number;
    displayPriority?: DisplayPriority;
    /**
     * The region that the league operates in. Usually in ALL-CAPS.
     * For example, `NORTH AMERICA` or `KOREA`.
     */
    region?: string;
}

export interface DisplayPriority {
    position: number;
    status: Status;
}

export type Status = "not_selected" | "selected";

export interface Match {
    id: string;
    flags?: string[];
    teams: MatchTeam[];
    strategy: Strategy;
    games?: Game[];
}

export interface Game {
    number: number;
    id: string;
    state: State;
    teams: GameTeam[];
    vods: any[];
}

export type State = "completed" | "inProgress" | "unstarted";

export interface GameTeam {
    id: string;
    side: string;
}

export interface Strategy {
    type: StrategyType;
    count: number;
}

export type StrategyType = "bestOf" | "playAll";

export interface MatchTeam {
    name: string;
    code: string;
    image: string;
    result: Result;
    record: Record;
    id?: string;
    slug?: string;
}

export interface Record {
    wins: number;
    losses: number;
}

export interface Result {
    outcome: Outcome | null;
    gameWins: number;
}

export type Outcome = "win" | "loss" | "tie";

export interface Stream {
    parameter: string;
    locale: string;
    mediaLocale: MediaLocale;
    provider: string;
    countries: string[];
    offset: number;
    statsStatus: string;
}

export interface MediaLocale {
    locale: string;
    englishName: string;
    translatedName: string;
}

export interface Tournament {
    id: string;
}

export type EventType = "match" | "show";

export interface Pages {
    older: string;
    newer: string;
}


export type HeartBeater = "loggedout" | "heartbeating" | "stopped";

/**
 * This comes from two keys of the `div.RewardsStatusInformer`:
 * `._component.props` and `._component.state`.
 */
export interface RewardStatus {

    /** The game ID. Each game in the series has a different ID. */
    gameId: string;
    tournamentId: string;
    watchType: string;
    children: any[];


    /**
     * **Do not use this value to check if drops are working.**
     * This value indicates if the rewards popup was clicked on (the
     * checkmark below the stream).
     */
    showStatus: boolean;
    rewards: string;
    mission: string;

    /**
     * Earning drops if and only if this key is present. The value of this
     * key is not reliable for determining the drop status. Some of the values
     * include:
     *  - `on`: drops are enabled.
     *  - `off_region_not_configured`:
     *    - if the region has not configured drops, or
     *    - if the logged in account is not eligible for drops due to region
     *      restriction.
     *    - Note that drops may still work despite the value.
     *  - `off_vod_stream`: this is a VOD and is not eligible for drops.
     *  - `unknown`: if the user is not logged in.
     *
     * In most cases, a page refresh is only really warranted if this key
     * is not present or has the value `unknown`.
     */
    drop?: string;
    heartbeater: HeartBeater;
}

export interface AppConfig {
    enabled: boolean
    preferTwitch: boolean
    muteTabs: boolean
    autoCloseTabs: boolean
}

export interface AppSession {
    scheduleTab: chrome.tabs.Tab
    spawnedTabs: chrome.tabs.Tab[]
}
