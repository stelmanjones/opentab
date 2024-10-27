<script lang="ts">
	import type { Snippet } from "svelte";
  import "../app.css"
  import { ModeWatcher } from "mode-watcher";

    let {children} : {children: Snippet} = $props()
</script>

<main>
<ModeWatcher/>
    {@render children()}
</main>
