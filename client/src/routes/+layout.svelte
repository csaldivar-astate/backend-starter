<script lang="ts">
  import '../app.css';
  import Toast from '$lib/components/Toast.svelte';

  let { children } = $props();
</script>

<main class="container">
  {@render children()}
</main>
<Toast />
