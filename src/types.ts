export interface Event {
    /** Scheduled start time of the event. */
    startTime: Date;
    state: State;
    type: EventType;
    /** The "block" that the event belonged to. Usually "Week X" or "Round X". */
    blockName?: string;
    league: League;
    match?: Match;
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
     * The slug, among other things, is used as a query parameter for filtering
     * schedules.
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
    /** The region that the league operates in. Usually in ALL-CAPS. */
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


export type HeartBeater = "loggedout" | "heartbeating";

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
     * Earning drops if and only if this key is present and has the value of
     * `on`. Other values that may display a checkmark but aren't earning
     * drops include:
     *
     *  - `off_region_not_configured`: if the region does not offer drop or
     *  if the broadcast is between games.
     *  - `off_vod_stream`: this is a VOD and is not eligible for drops.
     *  - `unknown`: if the user is not logged in.
     *
     * In most cases, a page refresh is only really warranted if this key
     * is not present or has the value `unknown`.
     */
    drop?: string;
    heartbeater: HeartBeater;
}
