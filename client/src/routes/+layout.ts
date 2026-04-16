import { auth } from '$lib/auth.svelte';

export const ssr = false;
export const prerender = false;

export async function load(): Promise<Record<string, never>> {
  await auth.refresh();
  return {};
}
