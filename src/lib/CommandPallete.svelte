<script lang="ts">
  import * as Command from "$lib/ui/command";
  import Icon from "@iconify/svelte";
  import {
    Binary,
    FolderOpen,
    Play,
    Pause,
    VolumeOff,
    Volume2,
    Repeat,
    ZoomIn,
    ZoomOut,
  } from "lucide-svelte";

  let {
    open = $bindable(),
    openFileHandler,
    playPauseHandler,
    soloHandler,
    muteHandler,
    metronomeHandler,
    countInHandler,
    loopHandler,
    zoomInHandler,
    zoomOutHandler,
  }: {
    open: boolean;
    openFileHandler: () => void;
    playPauseHandler: () => void;
    soloHandler: () => void;
    muteHandler: () => void;
    metronomeHandler: () => void;
    countInHandler: () => void;
    loopHandler: () => void;
    zoomInHandler: () => void;
    zoomOutHandler: () => void;
  } = $props();
</script>

<Command.Dialog bind:open>
  <Command.Input placeholder="Type a command..." />
  <Command.List>
    <Command.Empty>No results found.</Command.Empty>
    <Command.Group heading="Settings"></Command.Group>
    <Command.Item
      onclick={() => {
        openFileHandler();
        open = !open;
      }}
    >
      <FolderOpen class="mr-2 h-4 w-4"></FolderOpen>
      <span>Open</span>
    </Command.Item>
    <Command.Group heading="Player">
      <Command.Item
        onclick={() => {
          playPauseHandler();
          open = !open;
        }}
      >
        <Play class="h-2 w-2"></Play>
        <Pause class="mr-2 h-2 w-2"></Pause>
        <span>Play / Pause</span>
      </Command.Item>
      <Command.Item
        onclick={() => {
          soloHandler();
          open = !open;
        }}
      >
        <h1 class="mr-2 text-[24px] font-bold">S</h1>
        <span>Toggle Solo</span>
      </Command.Item>
      <Command.Item
        onclick={() => {
          muteHandler();
          open = !open;
        }}
      >
        <VolumeOff class="mr-2 h-4 w-4" />
        <span>Toggle Mute</span>
      </Command.Item>

      <Command.Item
        onclick={() => {
          countInHandler();
          open = !open;
        }}
      >
        <Binary class="mr-2 h-4 w-4" />
        <span>Toggle Count In</span>
      </Command.Item>
      <Command.Item
        onclick={() => {
          metronomeHandler();
          open = !open;
        }}
      >
        <Icon
          icon="tabler:metronome"
          color={`bg-background`}
          class="w-4 h-4 mr-2"
        ></Icon>

        <span>Toggle Metronome</span>
      </Command.Item>
      <Command.Item
        onclick={() => {
          loopHandler();
          open = !open;
        }}
      >
        <Repeat class="mr-2 h-4 w-4"></Repeat>
        <span>Toggle Loop</span>
      </Command.Item>
    </Command.Group>
    <Command.Group heading="View">
      <Command.Item
        onclick={() => {
          zoomInHandler();
          open = !open;
        }}
      >
        <ZoomIn class="mr-2 h-4 w-4"></ZoomIn>
        <span>Zoom In</span>
      </Command.Item>

      <Command.Item
        onclick={() => {
          zoomOutHandler();
          open = !open;
        }}
      >
        <ZoomOut class="mr-2 h-4 w-4"></ZoomOut>
        <span>Zoom Out</span>
      </Command.Item>
    </Command.Group>
  </Command.List>
</Command.Dialog>
