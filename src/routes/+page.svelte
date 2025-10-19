<script>
  import { onMount } from 'svelte';
  import TaskForm from '$lib/TaskForm.svelte';
  /** @typedef {'Backlog'|'In Progress'|'Review'|'Done'} Status */
  /** @typedef {'Urgent'|'Medium'|'Low'|'None'} Priority */
  /** @typedef {{ id:number; title:string; assignee:string; description:string; priority:Priority; status:Status }} Task */
  
  /** @type {Status[]} */
  const statuses = ['Backlog', 'In Progress', 'Review', 'Done'];
  /** @type {Priority[]} */
  const priorities = ['Urgent', 'Medium', 'Low', 'None'];
  let searchTerm = '';
  let showModal = false;
  let editing = null; // holds the task being edited or null
  /** @type {Task | null} */
  let editTarget = null;

  /** @type {Task[]} */
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

  /** @type {Record<Status, number>} */
  $: counts = computeCounts(issues);
  $: filteredIssues = issues.filter(issue => {
    const t = searchTerm.toLowerCase().trim();
    if (!t) return true;
    return issue.title.toLowerCase().includes(t)
      || issue.description.toLowerCase().includes(t)
      || issue.assignee.toLowerCase().includes(t);
  });

  /** @param {Task[]} list */
  function computeCounts(list) {
    /** @type {Record<Status, number>} */
    const acc = { 'Backlog': 0, 'In Progress': 0, 'Review': 0, 'Done': 0 };
    for (const it of list) acc[it.status] = (acc[it.status] || 0) + 1;
    return acc;
  }

  /** @param {{title:string; assignee:string; description:string; status:Status; priority:Priority}} data */
  function addIssueFromForm(data) {
    const { title, assignee, description, status, priority } = data;
    if (!title || !assignee) return;
    // If editing, update existing; else add new
    if (editTarget) {
      issues = issues.map(i => i.id === editTarget.id ? { ...i, title, assignee, description, status, priority } : i);
    } else {
      issues = [...issues, { id: nextId++, title, assignee, description, status, priority }];
    }
    saveTasksToLocalStorage();
    showModal = false;
    editTarget = null;
  }

  /** @param {number} id @param {Status} value */
  function updateStatus(id, value) {
    // Immutable update to ensure Svelte reactivity and count recomputation
    issues = issues.map(i => i.id === id ? { ...i, status: /** @type {Status} */(value) } : i);
    saveTasksToLocalStorage();
  }

  /** @param {Priority} p */
  function priorityRank(p) {
    const order = { Urgent: 0, Medium: 1, Low: 2, None: 3 };
    return order[p] ?? 3;
  }

  /** @param {number} id */
  function deleteTask(id) {
    issues = issues.filter(issue => issue.id !== id);
    saveTasksToLocalStorage();
  }

  /** Open modal to edit an existing task */
  /** @param {Task} t */
  function openEdit(t) {
    editTarget = { ...t };
    showModal = true;
  }
</script>

<main class="container">
  <header>
    <h1>The Real Manager</h1>
    <div>
      <div class="stats shadow">
        {#each statuses as status}
          <div class="stat">
            <div class="stat-title capitalize">{status}</div>
            <div class="stat-value">{counts[status] ?? 0}</div>
          </div>
        {/each}
      </div>
    </div>
  </header>

  <div class="topbar">
    <button type="button" class="btn btn-primary" on:click={() => showModal = true}>ADD TASK</button>
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
              <!-- new compact controls: edit emoji + delete -->
              <div class="card-controls">
                <button
                  class="icon-btn edit"
                  on:click={() => openEdit(issue)}
                  title="Edit task"
                  aria-label="Edit task"
                ></button>
                <button
                  class="icon-btn delete"
                  on:click={() => deleteTask(issue.id)}
                  title="Delete task"
                  aria-label="Delete task"
                ></button>
              </div>

              <div class="card-body">
                <h4 class="card-title" style="padding-right: 64px;">{issue.title}</h4>
                <div class="meta">Assignee: {issue.assignee}</div>
                <div class="meta priority-row">
                  <span class="priority-dot" data-priority={issue.priority} aria-hidden="true"></span>
                  <span class="priority-text">{issue.priority}</span>
                </div>
                {#if issue.description}<div class="desc" style="word-wrap: break-word; word-break: break-word; overflow-wrap: break-word; white-space: normal; max-width: 100%;">{issue.description}</div>{/if}
                <select
                  class="select select-bordered status-select"
                  bind:value={issue.status}
                  on:change={(e) => updateStatus(issue.id, e.currentTarget.value)}
                >
                  {#each statuses as s}<option value={s}>{s}</option>{/each}
                </select>
                <!-- removed old Edit button -->
                <!--
                <div class="actions">
                  <button class="btn btn-sm btn-outline" on:click={() => openEdit(issue)}>Edit</button>
                </div>
                -->
              </div>
            </article>
          {/each}
        </div>
      </div>
    {/each}
  </section>
  {#if showModal}
    <div
      class="task-modal-backdrop"
      role="button"
      aria-label="Close add task dialog"
      tabindex="0"
      on:click={() => showModal = false}
      on:keydown={(e) => (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') && (showModal = false)}
    ></div>
    <div class="task-modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
      <!-- X Cancel Button -->
      <button 
        class="modal-close-btn"
        on:click={() => { showModal = false; editTarget = null; }}
        aria-label="Close"
      >
        ✕
      </button>
      
      <h2 id="task-modal-title" class="modal-title">{editTarget ? 'Edit Task' : 'Add Task'}</h2>
      <TaskForm {statuses} {priorities}
        initial={editTarget ? {
          title: editTarget.title,
          assignee: editTarget.assignee,
          description: editTarget.description,
          status: editTarget.status,
          priority: editTarget.priority
        } : undefined}
        submitLabel={editTarget ? 'Save Changes' : 'Add Task'}
        on:submit={(e) => addIssueFromForm(e.detail)}
        on:cancel={() => { showModal = false; editTarget = null; }}
      />
    </div>
  {/if}
</main>

<style>
  :root {
    --page-bg: #f8fafc;
    --card-border: #e5e7eb;
    --card-border-strong: #cbd5e1;
    --text-muted: #6b7280;
    --text-strong: #111827;
  }

  .task-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 999;
    animation: fadeIn 150ms ease-out;
  }
  .task-modal {
    position: fixed;
    top: 50vh;
    left: 50vw;
    transform: translate(-50%, -50%);
    background: var(--page-bg);
    padding: 2rem;
    border-radius: 0.75rem;
    width: min(600px, 90vw);
    max-height: 90vh;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 15px 40px rgba(0,0,0,0.2);
    animation: pop 160ms ease-out;
    border: 1px solid var(--card-border);
  }

  /* X Close Button */
  .modal-close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: none;
    background: rgba(0, 0, 0, 0.1);
    color: #6b7280;
    font-size: 1.2rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1001;
    transition: all 0.15s ease;
  }
  .modal-close-btn:hover {
    background: rgba(0, 0, 0, 0.15);
    color: #374151;
  }

  /* Large Modal Title */
  .modal-title {
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    margin-top: 0;
    padding-right: 3rem;
    color: var(--text-strong);
    text-align: center;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes pop { from { opacity: 0; transform: translate(-50%, -46%) scale(0.98); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }

  /* Card refinements */
  .card {
    background: #ffffff; /* clearer background */
    border: 2px solid #94a3b8; /* crisper border */
    border-radius: 0.75rem;
    box-shadow: 0 10px 24px rgba(0,0,0,0.10); /* slightly stronger */
  }
  .card-title {
    color: #0f172a; /* darker title */
    font-weight: 800;
    letter-spacing: 0.2px;
  }
  .meta {
    color: #334155; /* darker meta text */
    font-size: 0.92rem;
  }
  .desc {
    color: #1f2937; /* darker body text */
    margin-top: 0.25rem;
    line-height: 1.4;
  }

  /* Compact icon buttons in card corner (unique class names to avoid conflicts) */
  .card-controls {
    position: absolute;
    top: 8px;
    right: 8px;
    display: inline-flex;
    gap: 6px;
    z-index: 1;
  }
  .icon-btn {
    width: 28px;
    height: 28px;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    border: 1px solid #94a3b8;
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
    color: #ffffff;
    background: #111827;
  }
  .icon-btn.edit {
    background: #0ea5e9; /* blue for edit */
    border-color: #0284c7;
  }
  .icon-btn.edit::before {
    content: '';
    width: 16px;
    height: 16px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  .icon-btn.delete {
    background: #ef4444; /* red for delete */
    border-color: #b91c1c;
  }
  .icon-btn.delete::before {
    content: '';
    width: 14px;
    height: 14px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white' stroke-width='2.5'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M6 18L18 6M6 6l12 12'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
  .icon-btn:hover { filter: brightness(0.95); }

  /* Priority dot styles */
  .priority-row {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
  }
  .priority-dot {
    width: 10px;
    height: 10px;
    border-radius: 999px;
    display: inline-block;
    border: 1px solid #ffffff80;
    box-shadow: 0 0 0 1px #00000010 inset;
  }
  /* Re-implemented colored dots via data attribute (no inline styles) */
  .priority-dot[data-priority="Urgent"] { background: #ef4444; }
  .priority-dot[data-priority="Medium"] { background: #f59e0b; }
  .priority-dot[data-priority="Low"]    { background: #10b981; }
  .priority-dot[data-priority="None"]   { background: #9ca3af; }

  /* Keep existing modal styles */
  /* ...existing code... */
</style>