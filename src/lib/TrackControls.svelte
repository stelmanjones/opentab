<script lang="ts">
  import * as alpha from "@coderline/alphatab";

  import * as Sheet from "$lib/ui/sheet";
  import { ScrollArea } from "$lib/ui/scroll-area";
  import { Button, buttonVariants } from "$lib/ui/button";

  let {
    open = $bindable(),
    tracks,
    updateTrackVolume,
    trackVolumes = $bindable(),
    selectTrack,
    active,
  }: {
    open: boolean;
    tracks: alpha.model.Track[];
    trackVolumes: number[];
    updateTrackVolume: (volume: number, track: number) => void;
    selectTrack: (index: number) => void;
    active: number;
  } = $props();

  let activeTrack = $state(active);

  $effect(() => {
    if (activeTrack) {
      activeTrack = active;
    }
  });
</script>

<Sheet.Root bind:open>
  <Sheet.Trigger
    class={`${buttonVariants({ variant: "outline" })} bg-primary text-white`}
    >Tracks</Sheet.Trigger
  >

  <Sheet.Content class="h-max max-h-[80%] z-[4000]">
    <Sheet.Header>
      <Sheet.Title>Tracks</Sheet.Title>
    </Sheet.Header>
    <ScrollArea>
      {#each tracks as track, i}
        <div
          class={`w-full h-full items-center mx-auto ${i === activeTrack ? "bg-muted" : ""}`}
        >
          <Button
            class={`grid grid-flow-row space-y-5 w-full items-center`}
            onclick={() => {
              selectTrack(i);
              activeTrack = i;
            }}
          >
            <div>
              <p class=" text-md font-medium">{track.name}</p>
              <p class=" text-lg font-medium">
                {Math.round(trackVolumes[i] * 100) ?? 100}%
              </p>
            </div>
          </Button>
          <input
            class={`w-full h-full items-center mx-auto ${i === activeTrack ? "bg-muted" : "bg-primary"}`}
            type="range"
            min="0"
            max="1"
            step="0.01"
            bind:value={trackVolumes[i]}
            onchange={() => {
              updateTrackVolume(trackVolumes[i], i);
            }}
          />
        </div>
      {/each}
    </ScrollArea>
  </Sheet.Content>
</Sheet.Root>
