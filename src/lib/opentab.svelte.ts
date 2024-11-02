import * as alpha from "@coderline/alphatab";
import { NotationElement } from "./player";
import { log } from "./logger.svelte";

export default class OpenTab {
  public element = $state<HTMLElement>();

  public files = $state<FileList>();

  public score = $state<alpha.model.Score>();

  /** The AlphaTab API. */
  public api = $state<alpha.AlphaTabApi>();

  /** The tracks of the score. */
  public tracks = $derived(this.score?.tracks ?? []);

  /** The active track index. */
  public activeTrack = $state<number>(0);

  /** The playback speed. */
  public playBackSpeed = $state<number>(1);

  /** The master volume. */
  public masterVolume = $state<number>(1);

  /** The metronome volume. */
  public metronomeVolume = $state<number>(0);

  /** Whether the metronome is active. */
  public isMetronomeActive = $derived<boolean>(this.metronomeVolume !== 0);

  /** The count-in volume. */
  public countInVolume = $state<number>(0);

  /** Whether the count-in is active. */
  public isCountInActive = $derived<boolean>(this.countInVolume !== 0);

  /** The volume of the all tracks. */
  public trackVolumes = $state<number[]>([1]);

  /** The volume of the active track. */
  public trackVolume = $derived<number>(
    this.trackVolumes[this.activeTrack] ?? 1,
  );

  public trackMutes = $state<boolean[]>([false]);

  public trackSolos = $state<boolean[]>([false]);

  /** The current progress in the score. */
  public currentProgress = $state<number>(0);

  /** The duration of the score in ms. */
  public scoreDuration = $state<number>(0);

  public scale = $state<number>(1);

  /** The title of the score. */
  public title = $derived<string>(this.score?.title ?? "No score");

  /** The artist of the score. */
  public artist = $derived<string>(this.score?.artist ?? "No artist");

  /** The album of the score. */
  public album = $derived<string>(this.score?.album ?? "No album");

  public isScoreLoaded = $derived(
    this.score !== undefined && this.score !== null,
  );

  public isPlaying = $state<boolean>(false);

  public isLooping = $state(false);

  public paletteOpen = $state(false);

  constructor(element: HTMLElement) {
    this.api = new alpha.AlphaTabApi(element, {
      core: {
        engine: "svg",
        fontDirectory: "font/",
      },
      display: {
        stretchForce: 0.5,
        staveProfile: 3,
        scale: 1.2,
      },

      player: {
        scrollOffsetY: -400,
        enablePlayer: true,
        enableCursor: true,
        enableUserInteraction: true,
        nativeBrowserSmoothScroll: true,
        scrollMode: alpha.ScrollMode.OffScreen,
        soundFont: `https://cdn.jsdelivr.net/npm/@coderline/alphatab@alpha/dist/soundfont/sonivox.sf2`,
      },
    } as alpha.Settings);
    this.api.settings.notation.elements.set(NotationElement.ScoreTitle, false);
    this.api.settings.notation.elements.set(
      NotationElement.ScoreSubTitle,
      false,
    );
    this.api.settings.notation.elements.set(NotationElement.ScoreArtist, false);
    this.api.settings.notation.elements.set(NotationElement.ScoreAlbum, false);
    this.api.settings.notation.elements.set(NotationElement.ScoreMusic, false);
    this.api.settings.notation.elements.set(
      NotationElement.ScoreWordsAndMusic,
      false,
    );
    this.api.settings.notation.elements.set(NotationElement.ScoreWords, false);

    this.api.updateSettings();
  }

  public updateScale(s: number) {
    if (this) {
      this.scale = s;

      this.api!.settings.display.scale = s;
      this.api!.updateSettings();
      this.api!.renderTracks([this.tracks[this.activeTrack]]);
      log.debug(`Scale: ${s}`);
    }
  }

  public updateMetaData(s: alpha.model.Score) {
    if (this) {
      this.score = s;
      this.trackVolumes = [];
      for (let i = 0; i < this.tracks.length; i++) {
        this.trackVolumes.push(1);
        this.trackMutes.push(false);
        this.trackSolos.push(false);
      }
    }
  }

  public toggleLooping() {
    this.isLooping = !this.isLooping;
    log.debug(`Loop state: ${this.isLooping}`);
  }

  public playPause() {
    if (this.isPlaying) {
      log.debug("Pausing playback");
      this.api?.playPause();
    } else {
      log.debug("Resuming playback");
      this.api?.playPause();
      this.api?.scrollToCursor();
    }
  }

  public toggleMute() {
    this.api?.changeTrackMute(
      [this.tracks[this.activeTrack]],
      !this.trackMutes[this.activeTrack],
    );
    this.trackMutes[this.activeTrack] = !this.trackMutes[this.activeTrack];
    log.debug(
      `Track ${this.activeTrack} Mute: ${this.trackMutes[this.activeTrack]}`,
    );
  }

  public toggleSolo() {
    this.api?.changeTrackSolo(
      [this.tracks[this.activeTrack]],
      !this.trackSolos[this.activeTrack],
    );

    this.trackSolos[this.activeTrack] = !this.trackSolos[this.activeTrack];
    log.debug(
      `Track ${this.activeTrack} Solo: ${this.trackSolos[this.activeTrack]}`,
    );
  }
  public toggleMetronome() {
    this.metronomeVolume = this.metronomeVolume === 0 ? 1 : 0;
  }
  public toggleCountIn() {
    this.countInVolume = this.countInVolume === 0 ? 1 : 0;
  }
  public gotoStart() {
    this.api!.stop();
    this.api!.scrollToCursor();

    if (this.isPlaying) {
      this.api!.play();
    }
  }
}
