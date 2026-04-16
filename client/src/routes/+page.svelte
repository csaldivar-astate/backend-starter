<script lang="ts">
  import { auth } from '$lib/auth.svelte';
  import { toast } from '$lib/toast.svelte';
</script>

<h1>Welcome</h1>
<p>This is your Svelte + Express starter template.</p>

{#if auth.loading}
  <p aria-busy="true">Checking session…</p>
{:else if auth.user}
  <p>Signed in as <strong>{auth.user.displayName}</strong> ({auth.user.email}).</p>
{:else}
  <p>You are not signed in.</p>
{/if}

<article>
  <header><strong>Next steps</strong></header>
  <ol>
    <li>Add API routes in <code>src/index.ts</code> under the <code>/api</code> prefix.</li>
    <li>Build pages under <code>client/src/routes/</code>.</li>
    <li>Call your API from pages with <code>import &#123; api &#125; from '$lib/api'</code>.</li>
  </ol>
  <footer>
    <button type="button" onclick={() => toast.success('Toasts work!')}>Try a toast</button>
  </footer>
</article>
