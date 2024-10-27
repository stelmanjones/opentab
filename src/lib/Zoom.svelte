<script lang="ts">
  import Separator from "./ui/separator/separator.svelte";

  let { scale, update }: { scale: number; update: (scale: number) => void } =
    $props();
</script>

<div>
  <label for="Quantity" class="sr-only"> Quantity </label>

  <div class="flex items-center rounded outline bg-primary">
    <button
      type="button"
      onclick={() => update(scale - 0.1)}
      class="size-10 leading-10 text-gray-600 transition hover:opacity-75"
    >
      &minus;
    </button>
    <Separator orientation="vertical" class="max-h-full h-6" />

    <div
      class="w-16 border-l-2 border-r-2 h-full align-middle border-black text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
    >
      {Math.round(scale * 100)} %
    </div>

    <button
      type="button"
      onclick={() => update(scale + 0.1)}
      class="size-10 leading-10 text-gray-600 transition hover:opacity-75"
    >
      &plus;
    </button>
  </div>
</div>
