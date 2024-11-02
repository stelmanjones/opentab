<script lang="ts">
  let { scale, update }: { scale: number; update: (scale: number) => void } =
    $props();
</script>

<div class="card max-h-[68px] items-center text-center bg-primary">
  <h2 class="card-normal text-xl font-medium">Zoom</h2>
  <div class="join max-h-fit flex-row max-w-fit text-center items-center">
    <button
      type="button"
      onclick={() => update(scale - 0.1)}
      class="join-item transition"
    >
      &minus;
    </button>

    <div
      class="w-16 border-l-2 join-item border-r-2 max-h-fit align-middle border-black text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
    >
      {Math.round(scale * 100)} %
    </div>

    <button
      type="button"
      onclick={() => update(scale + 0.1)}
      class="join-item leading-10 transition"
    >
      &plus;
    </button>
  </div>
</div>
