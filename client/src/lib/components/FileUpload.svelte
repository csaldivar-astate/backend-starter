<script lang="ts">
  import { formatBytes } from '$lib/upload';

  interface Props {
    files?: File[];
    accept?: string;
    multiple?: boolean;
    maxSize?: number;
    disabled?: boolean;
    label?: string;
    onSelect?: (files: File[]) => void;
    onError?: (message: string) => void;
  }

  let {
    files = $bindable([]),
    accept,
    multiple = false,
    maxSize,
    disabled = false,
    label = 'Drag files here or click to browse',
    onSelect,
    onError
  }: Props = $props();

  let dragging = $state(false);
  let input: HTMLInputElement | undefined = $state();

  function openPicker(): void {
    if (disabled) return;
    input?.click();
  }

  function handleInputChange(e: Event): void {
    const target = e.currentTarget as HTMLInputElement;
    addFiles(target.files);
    target.value = '';
  }

  function handleDrop(e: DragEvent): void {
    e.preventDefault();
    dragging = false;
    if (disabled) return;
    addFiles(e.dataTransfer?.files ?? null);
  }

  function handleDragOver(e: DragEvent): void {
    e.preventDefault();
    if (!disabled) dragging = true;
  }

  function handleDragLeave(): void {
    dragging = false;
  }

  function addFiles(incoming: FileList | null): void {
    if (!incoming || incoming.length === 0) return;

    const accepted: File[] = [];
    for (const file of Array.from(incoming)) {
      if (maxSize && file.size > maxSize) {
        onError?.(`${file.name} is larger than ${formatBytes(maxSize)}.`);
        continue;
      }
      if (accept && !matchesAccept(file, accept)) {
        onError?.(`${file.name} is not an accepted file type.`);
        continue;
      }
      accepted.push(file);
    }

    if (accepted.length === 0) return;

    files = multiple ? [...files, ...accepted] : accepted.slice(0, 1);
    onSelect?.(files);
  }

  function removeFile(index: number): void {
    files = files.filter((_, i) => i !== index);
    onSelect?.(files);
  }

  function matchesAccept(file: File, acceptAttr: string): boolean {
    const patterns = acceptAttr.split(',').map((s) => s.trim().toLowerCase());
    const name = file.name.toLowerCase();
    const type = file.type.toLowerCase();

    return patterns.some((pattern) => {
      if (pattern.startsWith('.')) return name.endsWith(pattern);
      if (pattern.endsWith('/*')) return type.startsWith(pattern.slice(0, -1));
      return type === pattern;
    });
  }

  function handleKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPicker();
    }
  }
</script>

<div
  class="dropzone"
  class:dragging
  class:disabled
  role="button"
  tabindex={disabled ? -1 : 0}
  aria-disabled={disabled}
  onclick={openPicker}
  onkeydown={handleKeydown}
  ondragover={handleDragOver}
  ondragleave={handleDragLeave}
  ondrop={handleDrop}
>
  <input
    bind:this={input}
    type="file"
    {accept}
    {multiple}
    {disabled}
    onchange={handleInputChange}
  />
  <p class="label">{label}</p>
  {#if accept}
    <small>Accepts: {accept}</small>
  {/if}
  {#if maxSize}
    <small>Max size: {formatBytes(maxSize)}</small>
  {/if}
</div>

{#if files.length > 0}
  <ul class="file-list">
    {#each files as file, i (file.name + file.size + i)}
      <li>
        <span class="name">{file.name}</span>
        <span class="size">{formatBytes(file.size)}</span>
        <button
          type="button"
          class="remove"
          aria-label="Remove {file.name}"
          onclick={() => removeFile(i)}
        >&times;</button>
      </li>
    {/each}
  </ul>
{/if}

<style>
  .dropzone {
    border: 2px dashed var(--pico-muted-border-color, #ccc);
    border-radius: 8px;
    padding: 2rem 1rem;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.15s, background-color 0.15s;
    background: var(--pico-card-background-color, #fff);
  }
  .dropzone:focus-visible {
    outline: 2px solid var(--pico-primary, #0172ad);
    outline-offset: 2px;
  }
  .dropzone.dragging {
    border-color: var(--pico-primary, #0172ad);
    background: var(--pico-primary-background, rgba(1, 114, 173, 0.08));
  }
  .dropzone.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .dropzone input[type='file'] {
    display: none;
  }
  .label {
    margin: 0 0 0.25rem;
    font-weight: 500;
  }
  .dropzone small {
    display: block;
    color: var(--pico-muted-color, #666);
  }
  .file-list {
    list-style: none;
    padding: 0;
    margin: 0.75rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }
  .file-list li {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 0.75rem;
    background: var(--pico-card-background-color, #fff);
    border: 1px solid var(--pico-muted-border-color, #eee);
    border-radius: 4px;
  }
  .file-list .name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .file-list .size {
    color: var(--pico-muted-color, #666);
    font-size: 0.9em;
  }
  .remove {
    all: unset;
    cursor: pointer;
    padding: 0 0.4rem;
    font-size: 1.25rem;
    line-height: 1;
    color: var(--pico-muted-color, #666);
  }
  .remove:hover {
    color: var(--pico-del-color, #c62828);
  }
</style>
