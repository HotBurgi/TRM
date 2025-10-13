<script>
  const statuses = ['Backlog', 'In Progress', 'Review', 'Done'];
  const priorities = ['Urgent', 'Medium', 'Low', 'None'];
  let searchTerm = '';

  let issues = [
    { id: 1, title: 'Setup repo', description: 'Initialize project and CI', assignee: 'Alice', status: 'Backlog', priority: 'Urgent' },
    { id: 2, title: 'API spec', description: 'Draft endpoints', assignee: 'Bob', status: 'In Progress', priority: 'Medium' },
    { id: 3, title: 'UI polish', description: 'Tweak styles', assignee: 'Charlie', status: 'Review', priority: 'Low' }
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
    const priority = (fd.get('priority') || 'None').toString();
    if (!title || !assignee) return;

    issues = [...issues, { id: nextId++, title, assignee, description, status, priority }];
    e.currentTarget.reset();
  }

  function updateStatus(id, value) {
    const idx = issues.findIndex(i => i.id === id);
    if (idx !== -1) {
      issues[idx] = { ...issues[idx], status: value };
      issues = issues; // trigger reactivity
    }
  }

  function priorityRank(p) {
    const order = { Urgent: 0, Medium: 1, Low: 2, None: 3 };
    return order[p] ?? 3;
  }
</script>

<main class="container">
  <header>
    <h1>DevTask Manager</h1>
    <div>
      <div class="stats shadow">
        {#each statuses as status}
          <div class="stat">
            <div class="stat-title capitalize">{status}</div>
            <div class="stat-value">{counts[status] || 0}</div>
          </div>
        {/each}
      </div>
    </div>
  </header>

  <div class="topbar">
    <form class="form" on:submit|preventDefault={handleSubmit}>
      <input name="title" placeholder="Title" required class="input input-bordered" />
      <input name="assignee" placeholder="Assignee" required class="input input-bordered" />
      <textarea name="description" placeholder="Description" class="textarea textarea-bordered"></textarea>
      <select name="priority" class="select select-bordered">
        {#each priorities as p}<option>{p}</option>{/each}
      </select>
      <select name="status" class="select select-bordered">
        {#each statuses as s}<option>{s}</option>{/each}
      </select>
      <button type="submit" class="btn btn-primary">Add</button>
    </form>
    <div class="search">
      <input type="text" placeholder="Search title, description, or assignee" bind:value={searchTerm} class="input input-bordered" />
    </div>
  </div>

  <section class="columns">
    {#each statuses as status}
      <div class="column">
        <h3>{status}</h3>
        <div class="list">
          {#each filteredIssues.filter(i => i.status === status).slice().sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority)) as issue (issue.id)}
            <article class="card shadow">
              <div class="card-body">
                <h4 class="card-title">{issue.title}</h4>
                <div class="meta">Assignee: {issue.assignee}</div>
                <div class="meta">Priority: {issue.priority}</div>
                {#if issue.description}<div class="desc">{issue.description}</div>{/if}
                <select
                  class="select select-bordered status-select"
                  bind:value={issue.status}
                  on:change={(e) => updateStatus(issue.id, e.currentTarget.value)}
                >
                  {#each statuses as s}<option value={s}>{s}</option>{/each}
                </select>
              </div>
            </article>
          {/each}
        </div>
      </div>
    {/each}
  </section>
</main>