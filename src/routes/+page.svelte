<svelte:options runes={true} />

<script lang="ts">
	import { NotationElement } from "$lib//player";
	import { open } from "@tauri-apps/plugin-dialog";
	import { readFile } from "@tauri-apps/plugin-fs";
	import Button from "$lib//ui/button/button.svelte";
	import ModeToggle from "$lib/ModeToggle.svelte";
	import * as alpha from "@coderline/alphatab";
	import { onDestroy, onMount } from "svelte";
	import { Progress } from "$lib//ui/progress";
	import { log } from "$lib//logger.svelte";
	import { InspectionPanel } from "lucide-svelte";
	import Header from "$lib//Header.svelte";
	import { browser } from "$app/environment";
	import Icon from "@iconify/svelte";
	import Player from "$lib//Player.svelte";
</script>

<main class="">
	<Player />
</main>
