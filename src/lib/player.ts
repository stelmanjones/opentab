import { model } from "@coderline/alphatab";
import * as alpha from "@coderline/alphatab";
export const FONT = new model.Font("Geist", 13, model.FontStyle.Plain);

const DISPLAY = new alpha.DisplaySettings();
DISPLAY.scale = 1.2;
DISPLAY.staveProfile = 3;

const SETTINGS = new alpha.Settings().fillFromJson(
    JSON.stringify({
        core: {
            fontDirectory: "../font",
        },
        player: {
            scrollOffsetY: -100,
            enablePlayer: true,
            enableCursor: true,
            enableUserInteraction: true,
            soundFont: "/soundfont/distorted.sf2",
        },
    }),
);

export class TrackState {
    isMute: boolean;
    isSolo: boolean;
    volume: number;

    constructor(
        isMute: boolean = false,
        isSolo: boolean = false,
        volume: number = 1,
    ) {
        this.isMute = isMute;
        this.isSolo = isSolo;
        this.volume = volume;
    }
}

export type TrackSelectorProps = {
    items: TrackListItem[];
    active: number;
};
export type TrackListItem = {
    name: string;
    value: number;
};

async function loadTab(url: string): Promise<Uint8Array> {
    const response = await fetch(url);
    const data = await response.arrayBuffer();
    return new Uint8Array(data);
}

function displayTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

enum NotationElement {
    /**
     * The score title shown at the start of the music sheet.
     */
    ScoreTitle = 0,
    /**
     * The score subtitle shown at the start of the music sheet.
     */
    ScoreSubTitle = 1,
    /**
     * The score artist shown at the start of the music sheet.
     */
    ScoreArtist = 2,
    /**
     * The score album shown at the start of the music sheet.
     */
    ScoreAlbum = 3,
    /**
     * The score words author shown at the start of the music sheet.
     */
    ScoreWords = 4,
    /**
     * The score music author shown at the start of the music sheet.
     */
    ScoreMusic = 5,
    /**
     * The score words&music author shown at the start of the music sheet.
     */
    ScoreWordsAndMusic = 6,
    /**
     * The score copyright owner shown at the start of the music sheet.
     */
    ScoreCopyright = 7,
    /**
     * The tuning information of the guitar shown
     * above the staves.
     */
    GuitarTuning = 8,
    /**
     * The track names which are shown in the accolade.
     */
    TrackNames = 9,
    /**
     * The chord diagrams for guitars. Usually shown
     * below the score info.
     */
    ChordDiagrams = 10,
    /**
     * Parenthesis that are shown for tied bends
     * if they are preceeded by bends.
     */
    ParenthesisOnTiedBends = 11,
    /**
     * The tab number for tied notes if the
     * bend of a note is increased at that point.
     */
    TabNotesOnTiedBends = 12,
    /**
     * Zero tab numbers on "dive whammys".
     */
    ZerosOnDiveWhammys = 13,
    /**
     * The alternate endings information on repeats shown above the staff.
     */
    EffectAlternateEndings = 14,
    /**
     * The information about the fret on which the capo is placed shown above the staff.
     */
    EffectCapo = 15,
    /**
     * The chord names shown above beats shown above the staff.
     */
    EffectChordNames = 16,
    /**
     * The crescendo/decrescendo angle  shown above the staff.
     */
    EffectCrescendo = 17,
    /**
     * The beat dynamics  shown above the staff.
     */
    EffectDynamics = 18,
    /**
     * The curved angle for fade in/out effects  shown above the staff.
     */
    EffectFadeIn = 19,
    /**
     * The fermata symbol shown above the staff.
     */
    EffectFermata = 20,
    /**
     * The fingering information.
     */
    EffectFingering = 21,
    /**
     * The harmonics names shown above the staff.
     * (does not represent the harmonic note heads)
     */
    EffectHarmonics = 22,
    /**
     * The let ring name and line above the staff.
     */
    EffectLetRing = 23,
    /**
     * The lyrics of the track shown above the staff.
     */
    EffectLyrics = 24,
    /**
     * The section markers shown above the staff.
     */
    EffectMarker = 25,
    /**
     * The ottava symbol and lines shown above the staff.
     */
    EffectOttavia = 26,
    /**
     * The palm mute name and line shown above the staff.
     */
    EffectPalmMute = 27,
    /**
     * The pick slide information shown above the staff.
     * (does not control the pick slide lines)
     */
    EffectPickSlide = 28,
    /**
     * The pick stroke symbols shown above the staff.
     */
    EffectPickStroke = 29,
    /**
     * The slight beat vibrato waves shown above the staff.
     */
    EffectSlightBeatVibrato = 30,
    /**
     * The slight note vibrato waves shown above the staff.
     */
    EffectSlightNoteVibrato = 31,
    /**
     * The tap/slap/pop effect names shown above the staff.
     */
    EffectTap = 32,
    /**
     * The tempo information shown above the staff.
     */
    EffectTempo = 33,
    /**
     * The additional beat text shown above the staff.
     */
    EffectText = 34,
    /**
     * The trill name and waves shown above the staff.
     */
    EffectTrill = 35,
    /**
     * The triplet feel symbol shown above the staff.
     */
    EffectTripletFeel = 36,
    /**
     * The whammy bar information shown above the staff.
     * (does not control the whammy lines shown within the staff)
     */
    EffectWhammyBar = 37,
    /**
     * The wide beat vibrato waves shown above the staff.
     */
    EffectWideBeatVibrato = 38,
    /**
     * The wide note vibrato waves shown above the staff.
     */
    EffectWideNoteVibrato = 39,
    /**
     * The left hand tap symbol shown above the staff.
     */
    EffectLeftHandTap = 40,
}

export { NotationElement, DISPLAY, loadTab, displayTime, SETTINGS };