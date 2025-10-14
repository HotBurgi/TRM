<script>
  import { onMount } from 'svelte';
  
  const statuses = ['Backlog', 'In Progress', 'Review', 'Done'];
  const priorities = ['Urgent', 'Medium', 'Low', 'None'];
  let searchTerm = '';

  let issues = [];
  let nextId = 1;

  // Function to save tasks to localStorage
  function saveTasksToLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('tasks', JSON.stringify(issues));
      localStorage.setItem('nextId', nextId.toString());
    }
  }

  // Function to load tasks from localStorage
  function loadTasksFromLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      const savedTasks = localStorage.getItem('tasks');
      const savedNextId = localStorage.getItem('nextId');
      
      if (savedTasks) {
        issues = JSON.parse(savedTasks);
      } else {
        // Default tasks if none exist
        issues = [];
      }
      
      if (savedNextId) {
        nextId = parseInt(savedNextId);
      } else {
        nextId = issues.length ? Math.max(...issues.map(i => i.id)) + 1 : 1;
      }
    }
  }

  // Function to check URL parameters for task creation
  function checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const title = urlParams.get('title');
    const assignee = urlParams.get('assignee');
    const description = urlParams.get('description');
    const priority = urlParams.get('priority') || 'None';
    const status = urlParams.get('status') || 'Backlog';

    // If URL contains task parameters, create a new task
    if (title && assignee) {
      const newTask = {
        id: nextId++,
        title: title.trim(),
        assignee: assignee.trim(),
        description: description ? description.trim() : '',
        priority: priority,
        status: status
      };
      
      issues = [...issues, newTask];
      saveTasksToLocalStorage();
      
      // Clean URL after task creation
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  onMount(() => {
    loadTasksFromLocalStorage();
    checkUrlParams();
  });

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
    saveTasksToLocalStorage();
    e.currentTarget.reset();
  }

  function updateStatus(id, value) {
    const idx = issues.findIndex(i => i.id === id);
    if (idx !== -1) {
      issues[idx] = { ...issues[idx], status: value };
      issues = issues; // trigger reactivity
      saveTasksToLocalStorage();
    }
  }

  function priorityRank(p) {
    const order = { Urgent: 0, Medium: 1, Low: 2, None: 3 };
    return order[p] ?? 3;
  }

  function deleteTask(id) {
    issues = issues.filter(issue => issue.id !== id);
    saveTasksToLocalStorage();
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
      <input name="description" placeholder="Description" class="input input-bordered" />
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
            <article class="card shadow" style="position: relative;">
              <button 
                class="btn btn-sm" 
                style="position: absolute; top: 8px; right: 8px; padding: 4px 8px; min-height: auto; height: auto;"
                on:click={() => deleteTask(issue.id)}
                title="Delete task"
              >
                x
              </button>
              <div class="card-body">
                <h4 class="card-title" style="padding-right: 40px;">{issue.title}</h4>
                <div class="meta">Assignee: {issue.assignee}</div>
                <div class="meta">Priority: {issue.priority}</div>
                {#if issue.description}<div class="desc" style="word-wrap: break-word; word-break: break-word; overflow-wrap: break-word; white-space: normal; max-width: 100%;">{issue.description}</div>{/if}
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