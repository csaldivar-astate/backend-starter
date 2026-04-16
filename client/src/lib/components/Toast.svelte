<script lang="ts">
  import { toast } from '$lib/toast.svelte';
</script>

<div class="toast-container" aria-live="polite">
  {#each toast.toasts as t (t.id)}
    <div class="toast toast-{t.kind}" role="status">
      <span>{t.message}</span>
      <button
        type="button"
        aria-label="Dismiss"
        onclick={() => toast.dismiss(t.id)}
      >&times;</button>
    </div>
  {/each}
</div>

<style>
  .toast-container {
    position: fixed;
    top: 1rem;
    right: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    z-index: 1000;
  }
  .toast {
    background: var(--pico-card-background-color, #fff);
    color: var(--pico-color, inherit);
    border-left: 4px solid var(--pico-primary, #0172ad);
    padding: 0.75rem 1rem;
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 220px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
  }
  .toast-success {
    border-color: #2e7d32;
  }
  .toast-error {
    border-color: #c62828;
  }
  .toast button {
    all: unset;
    cursor: pointer;
    padding: 0 0.25rem;
    font-size: 1.25rem;
    line-height: 1;
  }
</style>
