<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    open: boolean;
    title?: string;
    onClose?: () => void;
    children?: Snippet;
  }

  let { open = $bindable(false), title, onClose, children }: Props = $props();

  function close(): void {
    open = false;
    onClose?.();
  }
</script>

{#if open}
  <dialog open>
    <article>
      <header>
        <button type="button" class="close" aria-label="Close" onclick={close}></button>
        {#if title}<h2>{title}</h2>{/if}
      </header>
      {@render children?.()}
    </article>
  </dialog>
{/if}
