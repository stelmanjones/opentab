<script lang="ts">
	import * as ToggleGroup from "$lib/ui/toggle-group";


    let {isLooping, isMuted, isMetronomeActive, isCountInActive} = $props()
</script>

<ToggleGroup.Root size="lg" type="multiple"> 
    <ToggleGroup.Item value="Looping">
        <button >

        </button> 
        
    </ToggleGroup.Item>

</ToggleGroup.Root>
