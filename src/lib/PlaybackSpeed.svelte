<script lang="ts">
  import Separator from "./ui/separator/separator.svelte";
  import * as Card from "$lib/ui/card";
  let { value = $bindable() }: { value: number } = $props();
  let label = $state(value);
</script>

<Card.Root
  class="text-center outline bg-primary items-center content-center px-2 text-center -space-y-2 text-black max-h-fit place-self-center  border-none max-w-fit"
>
  <Card.Title class="line-clamp-1 text-md">Playback Speed</Card.Title>

  <Card.Description class="items-center justify-items-center text-center">
    <div class="join mt-2 flex">
      <input
        bind:value
        min={0}
        max={1}
        step={0.05}
        type="range"
        class="range range-xs w-full mx-auto join-item"
      />

      <span class="text-md text-center ml-2 font-bold join-item"
        >{Math.round(label) * 100}%</span
      >
    </div>
  </Card.Description>
</Card.Root>
