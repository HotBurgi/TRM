<script>
  import { onMount } from 'svelte';
  import TaskForm from '$lib/TaskForm.svelte';
  
  // Type definitions for better TypeScript-like support and IDE autocomplete
  /** @typedef {'Backlog'|'In Progress'|'Review'|'Done'} Status */
  /** @typedef {'Urgent'|'Medium'|'Low'|'None'} Priority */
  /** @typedef {{ id:number; title:string; assignee:string; description:string; priority:Priority; status:Status }} Task */
  
  // Available options for status and priority (used in dropdowns and forms)
  /** @type {Status[]} */
  const statuses = ['Backlog', 'In Progress', 'Review', 'Done'];
  /** @type {Priority[]} */
  const priorities = ['Urgent', 'Medium', 'Low', 'None'];
  
  // Reactive state variables
  let searchTerm = '';  // Current search filter text
  let showModal = false; // Controls modal visibility
  let editing = null; // TODO: This variable is declared but not used - consider removing
  /** @type {Task | null} */
  let editTarget = null; // The task being edited, or null when creating new task

  // Core data stores
  /** @type {Task[]} */
  let issues = []; // Main array containing all tasks
  let nextId = 1; // Auto-incrementing ID for new tasks

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
        // Calculate nextId from existing tasks if not found in storage
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
      
      // Clean URL after task creation to prevent duplicate tasks on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  // Initialize component: load saved data and check for URL parameters
  onMount(() => {
    loadTasksFromLocalStorage();
    checkUrlParams();
  });

  // Reactive computed properties - automatically update when dependencies change
  
  /** @type {Record<Status, number>} */
  $: counts = computeCounts(issues); // Recalculates task counts per status when issues change
  
  $: filteredIssues = issues.filter(issue => {
    // Filters tasks based on search term in title, description, or assignee
    const t = searchTerm.toLowerCase().trim();
    if (!t) return true; // Show all tasks when no search term
    return issue.title.toLowerCase().includes(t)
      || issue.description.toLowerCase().includes(t)
      || issue.assignee.toLowerCase().includes(t);
  });

  // Counts how many tasks per column for the statistics display
  /** @param {Task[]} list */
  function computeCounts(list) {
    /** @type {Record<Status, number>} */
    const acc = { 'Backlog': 0, 'In Progress': 0, 'Review': 0, 'Done': 0 };
    for (const it of list) acc[it.status] = (acc[it.status] || 0) + 1;
    return acc;
  }

  // Create new tasks or update existing ones from form data
  /** @param {{title:string; assignee:string; description:string; status:Status; priority:Priority}} data */
  function addIssueFromForm(data) {
    const { title, assignee, description, status, priority } = data;
    if (!title || !assignee) return; // Basic validation
    
    // If editing, update existing task; otherwise create new task
    if (editTarget) {
      issues = issues.map(i => i.id === editTarget.id ? { ...i, title, assignee, description, status, priority } : i);
    } else {
      issues = [...issues, { id: nextId++, title, assignee, description, status, priority }];
    }
    saveTasksToLocalStorage();
    showModal = false; // Close modal after submission
    editTarget = null; // Reset edit state
  }

  // Move task between columns by updating its status
  /** @param {number} id @param {Status} value */
  function updateStatus(id, value) {
    // Immutable update to ensure Svelte reactivity and count recomputation
    issues = issues.map(i => i.id === id ? { ...i, status: /** @type {Status} */(value) } : i);
    saveTasksToLocalStorage();
  }

  // Converts priority names to numerical values for sorting (Urgent=0, None=3)
  /** @param {Priority} p */
  function priorityRank(p) {
    const order = { Urgent: 0, Medium: 1, Low: 2, None: 3 };
    return order[p] ?? 3; // Default to lowest priority if unknown
  }

  // Permanently remove a task from the system
  /** @param {number} id */
  function deleteTask(id) {
    issues = issues.filter(issue => issue.id !== id);
    saveTasksToLocalStorage();
  }

  // Open modal in edit mode with pre-filled task data
  /** Open modal to edit an existing task */
  /** @param {Task} t */
  function openEdit(t) {
    editTarget = { ...t }; // Create a copy to avoid direct mutation
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
  <!-- DaisyUI Modal Component -->
  <dialog class="modal" class:modal-open={showModal}>
    <div class="modal-box w-11/12 max-w-2xl">
      <!-- Close button -->
      <button 
        class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
        on:click={() => { showModal = false; editTarget = null; }}
        aria-label="Close"
      >
        ✕
      </button>
      
      <!-- Modal Title -->
      <h2 id="task-modal-title" class="text-3xl font-bold mb-6 text-center pr-8">
        {editTarget ? 'Edit Task' : 'Add Task'}
      </h2>
      
      <!-- Task Form -->
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
    
    <!-- Modal backdrop -->
    <form method="dialog" class="modal-backdrop">
      <button on:click={() => { showModal = false; editTarget = null; }}>close</button>
    </form>
  </dialog>
</main>
