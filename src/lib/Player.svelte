<svelte:options runes={true} />

<script lang="ts">
  import * as Select from "$lib/ui/select";

  import * as Card from "$lib/ui/card";
  import * as alpha from "@coderline/alphatab";
  import { onMount, onDestroy } from "svelte";
  import { NotationElement, displayTime, loadTab } from "$lib/player";
  import { readFile } from "@tauri-apps/plugin-fs";
  import { AlphaTabApi, importer } from "@coderline/alphatab";

  import * as DropdownMenu from "$lib/ui/dropdown-menu";

  import { open } from "@tauri-apps/plugin-dialog";
  import Icon from "@iconify/svelte";
  import Header from "./Header.svelte";
  import { log } from "./logger.svelte";
  import Button from "./ui/button/button.svelte";
  import { Play, Pause, Repeat, Upload, Binary, Rewind } from "lucide-svelte";
  import Separator from "./ui/separator/separator.svelte";
  import ModeToggle from "./ModeToggle.svelte";
  import { Description } from "./ui/card";
  import TrackControls from "./TrackControls.svelte";
  import { mode } from "mode-watcher";
  import Zoom from "./Zoom.svelte";
  import CommandPallete from "./CommandPallete.svelte";
  import PlayerControls from "./PlayerControls.svelte";
  let element = $state<HTMLElement>();

  let files = $state<FileList>();

  let score = $state<alpha.model.Score>();
  /** The AlphaTab API. */
  let api = $state<alpha.AlphaTabApi>();
  /** The tracks of the score. */
  let tracks = $derived(score?.tracks ?? []);
  /** The active track index. */
  let activeTrack = $state<number>(0);
  /** The playback speed. */
  let playBackSpeed = $state<number>(1);
  /** The playback speed as a percentage. */
  let speedPercent = $derived<number>(Math.round(playBackSpeed * 100));
  /** The master volume. */
  let masterVolume = $state<number>(1);
  /** The metronome volume. */
  let metronomeVolume = $state<number>(0);
  /** Whether the metronome is active. */
  let isMetronomeActive = $derived<boolean>(metronomeVolume !== 0);
  /** The count-in volume. */
  let countInVolume = $state<number>(0);
  /** Whether the count-in is active. */
  let isCountInActive = $derived<boolean>(countInVolume !== 0);

  /** The volume of the all tracks. */
  let trackVolumes = $state<number[]>([1]);
  /** The volume of the active track. */
  let trackVolume = $derived<number>(trackVolumes[activeTrack] ?? 1);

  let trackMutes = $state<boolean[]>([false]);
  let trackSolos = $state<boolean[]>([false]);
  /** The current progress in the score. */
  let currentProgress = $state<number>(0);
  /** The duration of the score in ms. */
  let scoreDuration = $state<number>(0);

  let scale = $state<number>(1);
  /** The title of the score. */
  let title = $derived<string>(score?.title ?? "No score");
  /** The artist of the score. */
  let artist = $derived<string>(score?.artist ?? "No artist");
  /** The album of the score. */
  let album = $derived<string>(score?.album ?? "No album");

  let isScoreLoaded = $derived(score !== undefined && score !== null);

  let drawerOpen = $state(false);
  let isPlaying = $state<boolean>(false);

  let isLooping = $state(false);

  let paletteOpen = $state(false);

  // Track settings

  $effect(() => {
    if (api?.settings.display.scale) {
      api.updateSettings();
    }
  });
  $effect(() => {
    if (api) {
      api.isLooping = isLooping;
      api.masterVolume = masterVolume;
      api.metronomeVolume = metronomeVolume;
      api.countInVolume = countInVolume;
      api.playbackSpeed = playBackSpeed;
      api.settings.display.scale = scale;
    }
  });

  $effect(() => {
    if (files) {
      const file = files.item(0)!;

      let s: alpha.model.Score | undefined;
      file.arrayBuffer().then((buffer) => {
        s = importer.ScoreLoader.loadScoreFromBytes(new Uint8Array(buffer));
        files = undefined;
        api?.load(s);
        updateMetaData(s);
      });
    }
  });

  $effect(() => {
    api?.scoreLoaded.on((e) => {
      updateMetaData(e);
    });
  });

  $effect(() => {
    if (api) {
      api.playerPositionChanged.on(function (e) {
        scoreDuration = e.endTime;
        currentProgress = 100 * (e.currentTime / e.endTime) || 0;
      });
    }
  });

  $effect(() => {
    if (api) {
      api.playerStateChanged.on((e) => {
        if (e.state === 1) {
          isPlaying = true;
        } else {
          isPlaying = false;
        }
      });
    }
  });

  onMount(async () => {
    element = document.querySelector("#alphaTab")! as HTMLElement;

    api = new AlphaTabApi(element, {
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
        scrollOffsetY: -100,
        enablePlayer: true,
        enableCursor: true,
        enableUserInteraction: true,
        soundFont: `https://cdn.jsdelivr.net/npm/@coderline/alphatab@alpha/dist/soundfont/sonivox.sf2`,
      },
    } as alpha.Settings);
    api.settings.notation.elements.set(NotationElement.ScoreTitle, false);
    api.settings.notation.elements.set(NotationElement.ScoreSubTitle, false);
    api.settings.notation.elements.set(NotationElement.ScoreArtist, false);
    api.settings.notation.elements.set(NotationElement.ScoreAlbum, false);
    api.settings.notation.elements.set(NotationElement.ScoreMusic, false);
    api.settings.notation.elements.set(
      NotationElement.ScoreWordsAndMusic,
      false,
    );
    api.settings.notation.elements.set(NotationElement.ScoreWords, false);

    api.updateSettings();
  });
  onDestroy(async () => {
    if (!api) return;

    api.destroy();
    document.removeEventListener("keydown", onBarPressed);
  });

  $inspect(
    `\nTitle: ${api?.score?.title}\nScore: ${score?.title}\nScore Loaded: ${isScoreLoaded}\nPlaying: ${isPlaying}\nLooping: ${isLooping}\nMetronome Volume: ${metronomeVolume}\nCount-in Volume: ${countInVolume}\nVolume: ${masterVolume}\nPlayback Speed: ${playBackSpeed}\nActive Track Index: ${activeTrack}\nTrack Volume: ${trackVolume}\n`,
  ).with((evt, value) => {
    log.debug(JSON.parse(JSON.stringify(value)));
  });

  function updateScale(s: number) {
    scale = s;
    api!.settings.display.scale = s;
    api!.updateSettings();
    api!.renderTracks([tracks[activeTrack]]);
    log.debug(`Scale: ${s}`);
  }

  function updateMetaData(s: alpha.model.Score) {
    score = s;
    trackVolumes = [];
    for (let i = 0; i < tracks.length; i++) {
      trackVolumes.push(1);
      trackMutes.push(false);
      trackSolos.push(false);
    }
  }
  function setTrackVolume(volume: number, track: number) {
    if (tracks[track]) {
      api?.changeTrackVolume([tracks[track]], volume);
    }
  }

  function toggleLooping() {
    isLooping = !isLooping;
    log.debug(`Loop state: ${isLooping}`);
  }

  function playPause() {
    if (isPlaying) {
      log.debug("Pausing playback");
      api?.playPause();
    } else {
      log.debug("Resuming playback");
      api?.playPause();
      api?.scrollToCursor();
    }
  }

  function toggleMute() {
    api?.changeTrackMute([tracks[activeTrack]], !trackMutes[activeTrack]);
    trackMutes[activeTrack] = !trackMutes[activeTrack];
    log.debug(`Track ${activeTrack} Mute: ${trackMutes[activeTrack]}`);
  }

  function toggleSolo() {
    api?.changeTrackSolo([tracks[activeTrack]], !trackSolos[activeTrack]);
    trackSolos[activeTrack] = !trackSolos[activeTrack];
    log.debug(`Track ${activeTrack} Solo: ${trackSolos[activeTrack]}`);
  }
  function toggleMetronome() {
    metronomeVolume = metronomeVolume === 0 ? 1 : 0;
  }
  function toggleCountIn() {
    countInVolume = countInVolume === 0 ? 1 : 0;
  }
  function onBarPressed(event: KeyboardEvent) {
    if (!api) {
      return;
    }
    if (paletteOpen) {
      return;
    }
    if (event.code === "Space") {
      event.preventDefault();
      playPause();
    }
    if (event.code === "KeyM") {
      event.preventDefault();
      toggleMute();
    }
    if (event.code === "KeyS") {
      event.preventDefault();
      toggleSolo();
    }
    if (event.code === "KeyC") {
      event.preventDefault();
      toggleCountIn();
    }
    if (event.code === "Backspace") {
      event.preventDefault();
      gotoStart();
    }
    if (event.code === "KeyT") {
      event.preventDefault();
      toggleMetronome();
    }
    if (event.code === "KeyL") {
      event.preventDefault();

      toggleLooping();
    }
    if (
      (event.code === "KeyK" && event.ctrlKey === true) ||
      (event.code === "KeyK" && event.metaKey === true)
    ) {
      paletteOpen = !paletteOpen;
      event.preventDefault();
    }
    log.debug(`Keypress: ${event.code}`);
  }
  function gotoStart() {
    api!.stop();
    api!.scrollToCursor();

    if (isPlaying) {
      api!.play();
    }
  }
  async function openFile() {
    const file = await open({
      multiple: false,
      directory: false,
      filters: [{ name: "Tablature", extensions: ["gpx", "gp"] }],
    });
    if (file) {
      const data = await readFile(file);
      let s: alpha.model.Score | undefined;
      s = alpha.importer.ScoreLoader.loadScoreFromBytes(new Uint8Array(data));
      api?.load(s);
      updateMetaData(s);
      log.info(`Loaded score: "${s.title}" by "${s.artist}"`);
    } else {
    }
  }
</script>

<main class="">
  <Header>
    <div
      class="grid grid-cols-9 h-fit px-2 py-1 items-center justify-items-center align-middle"
    >
      <section class="flex bg-transparent space-x-1 col-start-1">
        <Button
          class="hover:scale-105 transition outline"
          onclick={async () => {
            await openFile();
          }}
        >
          <Upload width={24} height="24"></Upload>
        </Button>
      </section>

      <div
        class="col-start-2 col-span-2 flex justify-evenly px-2 rounded-[--radius] space-x-3 items-center"
      >
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild let:builder>
            <Button variant="default" class="outline" builders={[builder]}
              >Settings</Button
            >
          </DropdownMenu.Trigger>
          <DropdownMenu.Content class="w-56">
            <DropdownMenu.Label>Controls</DropdownMenu.Label>
            <DropdownMenu.Separator />
            <DropdownMenu.CheckboxItem
              class="space-x-1"
              bind:checked={isLooping}
            >
              <Repeat class="w-[16px] h-[16px]"></Repeat>
              <span>Loop</span>
            </DropdownMenu.CheckboxItem>
            {#if isMetronomeActive}
              <DropdownMenu.CheckboxItem
                class="space-x-1"
                checked
                onclick={toggleMetronome}
              >
                <Icon
                  icon="tabler:metronome"
                  width={16}
                  color={`bg-background`}
                  height={16}
                ></Icon>
                <span>Metronome</span>
              </DropdownMenu.CheckboxItem>
            {:else}
              <DropdownMenu.CheckboxItem
                class="space-x-1"
                onclick={toggleMetronome}
              >
                <Icon
                  icon="tabler:metronome"
                  width={16}
                  color={`bg-background`}
                  height={16}
                ></Icon>
                <span>Metronome</span>
              </DropdownMenu.CheckboxItem>
            {/if}
            {#if isCountInActive}
              <DropdownMenu.CheckboxItem
                class="space-x-1"
                checked
                onclick={toggleCountIn}
              >
                <Binary class="w-[16px] h-[16px]"></Binary>

                <span>Count In</span>
              </DropdownMenu.CheckboxItem>
            {:else}
              <DropdownMenu.CheckboxItem
                class="space-x-1"
                onclick={toggleCountIn}
              >
                <Binary class="w-[16px] h-[16px]"></Binary>

                <span>Count In</span>
              </DropdownMenu.CheckboxItem>
            {/if}
          </DropdownMenu.Content>
        </DropdownMenu.Root>
        <Button
          class="outline"
          onclick={() => {
            toggleSolo();
          }}
        >
          <h1
            class={`hover:scale-105 transition text-[24px] ${trackSolos[activeTrack] ? "text-[#bcff69]" : ""}`}
          >
            S
          </h1>
        </Button>

        <Button onclick={toggleMute} class="outline">
          <Icon
            class="hover:scale-105 transition"
            icon={`${trackMutes[activeTrack] ? "tabler:volume-off" : "tabler:volume"}`}
            color={`${trackMutes[activeTrack] ? "#ff4a53" : ""}`}
            width={24}
            height={24}
          ></Icon>
        </Button>

        <Button onclick={gotoStart} class="outline">
          <Rewind width="24" height="24" class="hover:scale-105 transition"
          ></Rewind>
        </Button>

        <Button onclick={playPause} class="outline">
          {#if isPlaying}
            <Pause width={24} height={24} class="hover:scale-105 transition"
            ></Pause>
          {:else}
            <Play width={24} height={24} class="hover:scale-105 transition"
            ></Play>
          {/if}
        </Button>
      </div>
      <Card.Root
        class="text-center outline bg-primary text-primary-foreground col-start-4 col-span-3 max-h-fit place-self-center mx-2 p-2 border-none max-w-fit"
      >
        <Card.Title class="line-clamp-1">{title}</Card.Title>
        <Card.Description class="text-primary-foreground">
          {artist ? artist : "None"} - {album ? album : "None"}
        </Card.Description>
      </Card.Root>

      <div class="col-start-8 items-center grid grid-flow-row">
        <Zoom {scale} update={updateScale} />
        <!-- <TrackControls bind:open={drawerOpen} bind:trackVolumes={trackVolumes} updateTrackVolume={setTrackVolume} active={activeTrack} selectTrack={(i:number) => { -->
        <!-- 	activeTrack = i -->
        <!-- 	api?.renderTracks([tracks[i]]) -->
        <!-- 	log.info(`Changed track: ${tracks[i].name}`) -->
        <!--   }} tracks={tracks}/> -->
      </div>
      <div class="col-start-9 justify-end space-x-1">
        <ModeToggle />
      </div>
    </div>
  </Header>

  {#if !isScoreLoaded}
    <div
      class={`z-10000 pt-[25%] pointer-events-none w-screen h-screen text-center text-5xl `}
    >
      No score loaded

      <p class="text-muted-foreground mt-[20%]">
        Press <kbd
          class="bg-secondary text-muted-foreground pointer-events-none inline-flex select-none items-center gap-1 rounded border px-1.5 font-mono text-[20px] font-medium opacity-100"
        >
          <span class="text-3xl">⌘K</span>
        </kbd> to open Command Palette
      </p>
    </div>
  {/if}

  <CommandPallete
    bind:open={paletteOpen}
    openFileHandler={openFile}
    playPauseHandler={playPause}
    soloHandler={toggleSolo}
    muteHandler={toggleMute}
    countInHandler={toggleCountIn}
    metronomeHandler={toggleMetronome}
    loopHandler={toggleLooping}
    zoomInHandler={() => updateScale((scale += 0.1))}
    zoomOutHandler={() => updateScale((scale -= 0.1))}
  />

  <div id="alphaTab" class="w-screen h-screen"></div>
</main>
<svelte:window on:keydown={onBarPressed} />
