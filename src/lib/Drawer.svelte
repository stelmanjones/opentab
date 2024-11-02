<script lang="ts">
    import type { Snippet } from "svelte";
    import * as alpha from "@coderline/alphatab";
    import {log } from '$lib/logger.svelte'

  let {speed=$bindable(),volume=$bindable(),tempo,trackVolumes,children,active,selectTrack,tracks,updateTrackVolume}: {speed:number, volume:number,children?: Snippet,active:number,selectTrack: (idx: number) => void, tracks: alpha.model.Track[],trackVolumes: number[],updateTrackVolume: (volume: number, track: number) => void, tempo:number} = $props()
  let bpm = $state(0)
  let speedPercentage = $derived(Math.round(speed * 100))
  let volumePercentage = $derived(Math.round(volume * 100))
    
  function logVolumeChange(track: number, volume: number) {
    log.info(
      `Set volume for track ${tracks[track].name} to ${Math.round(volume * 100)}%`
    )
  }


</script>







<div class="drawer">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <!-- Page content here -->
    <label for="my-drawer" class="btn bg-primary border-2 border-black drawer-button text-black"
      >Tracks</label
    >
  </div>
  <div class="drawer-side">
    <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"
    ></label>
  >
    <ul class="menu bg-base-200 text-base-content min-h-full w-80 p-4">
      <label for="playbackSpeedSlider" class="text-lg ml-2 font-medium join-horizontal">Playback Speed</label>
     <div class="join">
       
      
        <input
            id="PlaybackSpeedSlider"
        bind:value={speed}
        min={0}
        max={1}
        step={0.05}
        type="range"
        class="range range-xs w-full mx-auto join-item place-self-center"
          onchange={() => {
            
            bpm = Math.round(tracks[active].score.tempo)
          }}
      />
        <!-- TODO: Fix displayed BPM -->
          <p class="text-lg text-center ml-2 font-medium join-item "
        >{speedPercentage}% ({bpm})</p
      >
        </div>
      <label for="masterVolumeSlider" class="text-lg ml-2 font-medium join-item">Volume</label>
       <div class="join">
       
      
        <input
            id="masterVolumeSlider"
        bind:value={volume}
        min={0}
        max={1}
        step={0.05}
        type="range"
        class="range range-xs w-full mx-auto join-item place-self-center"
      />
          <p class="text-lg text-center ml-2 font-medium join-item "
        >{volumePercentage}%</p
      >
        </div>

      {#each tracks as track,i}
        <li>
    <label for="trackVolume" onclick={() => {selectTrack(i)}} class="text-lg ml-2 font-medium join-item">{track.name}</label>
       <div class="join">
       
      
        <input
            id="trackVolume"
        bind:value={trackVolumes[i]}
        min={0}
        max={1}
        step={0.05}
        type="range"
        class="range range-xs w-full mx-auto join-item place-self-center"
        onchange="{() => {
            logVolumeChange(i, trackVolumes[i]);
            updateTrackVolume(trackVolumes[i], i);
          }}"      />
          <p class="text-lg text-center ml-2 font-medium join-item "
        >{Math.round(trackVolumes[i] * 100)}%</p
      >
        </div>

    
  </li>

        
      {/each}


      <li>
        
      </li>
      {#if children }
      {@render children()}
{:else}
<div></div>
{/if}
      <li></li>
    </ul>
  </div>
</div>
