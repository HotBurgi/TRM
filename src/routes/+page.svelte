<script lang="ts">
  let dashboardData = {};
  let tasksData = {};
  let headerData = {};

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

<section>
<h2>Header</h2>
</section>

<section>
  <h2>Dashboard</h2>
</section>

<section>
  <h2>Tasks</h2>
</section>
