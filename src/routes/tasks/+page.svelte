<script>
  // Import the CSS wherever you place it
  import './kanban.css';

  const statuses = ['Backlog', 'In Progress', 'Review', 'Done'];
  let searchTerm = '';

  // Example seed data (remove or replace)
  let issues = [
    { id: 1, title: 'Setup repo', description: 'Initialize project and CI', assignee: 'Alice', status: 'Backlog' },
    { id: 2, title: 'API spec', description: 'Draft endpoints', assignee: 'Bob', status: 'In Progress' },
    { id: 3, title: 'UI polish', description: 'Tweak styles', assignee: 'Charlie', status: 'Review' }
  ];
  let nextId = issues.length ? Math.max(...issues.map(i => i.id)) + 1 : 1;

  $: counts = computeCounts(issues);
  $: filteredIssues = issues.filter(issue => {
    const t = searchTerm.toLowerCase().trim();
    if (!t) return true;
    return issue.title.toLowerCase().includes(t)
      || issue.description.toLowerCase().includes(t)
      || issue.assignee.toLowerCase().includes(t);
  });

  function computeCounts(list) {
    const acc = { 'Backlog': 0, 'In Progress': 0, 'Review': 0, 'Done': 0 };
    for (const it of list) acc[it.status] = (acc[it.status] || 0) + 1;
    return acc;
  }

  function handleSubmit(e) {
    const fd = new FormData(e.currentTarget);
    const title = (fd.get('title') || '').toString().trim();
    const assignee = (fd.get('assignee') || '').toString().trim();
    const description = (fd.get('description') || '').toString().trim();
    const status = (fd.get('status') || 'Backlog').toString();
    if (!title || !assignee) return;

    issues = [...issues, { id: nextId++, title, assignee, description, status }];
    e.currentTarget.reset();
  }

  function updateStatus(id, value) {
    const idx = issues.findIndex(i => i.id === id);
    if (idx !== -1) {
      issues[idx] = { ...issues[idx], status: value };
      issues = issues; // trigger reactivity
    }
  }
</script>

<main class="container">
  <header>
    <h1>DevTask Manager</h1>
    <div class="counts">
      {#each statuses as status}
        <span class="capitalize">{status}: <strong>{counts[status] || 0}</strong></span>
      {/each}
    </div>
  </header>

  <div class="topbar">
    <form class="form" on:submit|preventDefault={handleSubmit}>
      <input name="title" placeholder="Title" required />
      <input name="assignee" placeholder="Assignee" required />
      <textarea name="description" placeholder="Description"></textarea>
      <select name="status">
        {#each statuses as s}<option>{s}</option>{/each}
      </select>
      <button type="submit">Add</button>
    </form>
    <div class="search">
      <input type="text" placeholder="Search title, description, or assignee" bind:value={searchTerm} />
    </div>
  </div>

  <section class="columns">
    {#each statuses as status}
      <div class="column">
        <h3>{status}</h3>
        <div class="list">
          {#each filteredIssues.filter(i => i.status === status) as issue (issue.id)}
            <article class="card">
              <h4>{issue.title}</h4>
              <div class="meta">Assignee: {issue.assignee}</div>
              {#if issue.description}<div class="desc">{issue.description}</div>{/if}
              <select
                class="status-select"
                bind:value={issue.status}
                on:change={(e) => updateStatus(issue.id, e.currentTarget.value)}
              >
                {#each statuses as s}<option value={s}>{s}</option>{/each}
              </select>
            </article>
          {/each}
        </div>
      </div>
    {/each}
  </section>
</main>