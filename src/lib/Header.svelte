<script lang="ts">
    import type { Snippet } from "svelte";
  
    let { children } : {children: Snippet} = $props();
  </script>
  
  <div
    class="fixed items-center text-center content-center  w-[99%] mx-2 mt-2 z-[2000] min-h-20 max-h-[85px]"
  
  >
    {@render children()}
  </div>
