<script lang="ts">
  let dashboardData = {};
  let tasksData = {};
  let headerData = {};

  // Usa onMount per eseguire fetch client-side
  import { onMount } from 'svelte';

  onMount(async () => {
    const [dashboardRes, tasksRes, headerRes] = await Promise.all([
      fetch('/dashboard'),
      fetch('/tasks'),
      fetch('/header')
    ]);

    dashboardData = await dashboardRes.json();
    tasksData = await tasksRes.json();
    headerData = await headerRes.json();
  });
</script>

<h1>{headerData.title} {headerData.logo}</h1>

<section>
  <h2>{dashboardData.title}</h2>
  <p>{dashboardData.content}</p>
</section>

<section>
  <h2>Tasks</h2>
  <ul>
    {#each tasksData.tasks as task}
      <li>{task}</li>
    {/each}
  </ul>
</section>
