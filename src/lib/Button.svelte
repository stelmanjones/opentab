<script lang="ts">
import {Button} from 'bits-ui'
    import type { Snippet } from 'svelte';

let {children, ...attr}: {children: Snippet} = $props()
</script>
<Button.Root  class="inline-flex h-12 items-center justify-center rounded-input bg-background
	px-[21px] text-[15px] font-semibold text-background shadow-mini
	hover:bg-dark/95 active:scale-98 active:transition-all"
  {...attr}
> 
  {@render children()}

</Button.Root>
