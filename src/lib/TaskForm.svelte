<script>
  import { createEventDispatcher } from 'svelte';

  export let statuses = ['Backlog', 'In Progress', 'Review', 'Done'];
  export let priorities = ['Urgent', 'Medium', 'Low', 'None'];

  // Optional initial values (for future edit use-cases)
  export let initial = {
    title: '',
    assignee: '',
    description: '',
    status: statuses?.[0] ?? 'Backlog',
    priority: priorities?.[3] ?? 'None'
  };

  const dispatch = createEventDispatcher();

  let title = initial.title;
  let assignee = initial.assignee;
  let description = initial.description;
  let status = initial.status || (statuses?.[0] ?? 'Backlog');
  let priority = initial.priority || (priorities?.[3] ?? 'None');

  /** @param {SubmitEvent} e */
  function onSubmit(e) {
    e.preventDefault();
    const data = { title: title.trim(), assignee: assignee.trim(), description: description.trim(), status, priority };
    if (!data.title || !data.assignee) return; // simple validation
    dispatch('submit', data);
  }

  function onCancel() {
    dispatch('cancel');
  }
</script>

<form class="space-y-3" on:submit={onSubmit}>
  <div class="form-control">
    <label class="label" for="task-title"><span class="label-text">Title</span></label>
    <input id="task-title" class="input input-bordered w-full" bind:value={title} name="title" required placeholder="Short summary" />
  </div>

  <div class="form-control">
    <label class="label" for="task-assignee"><span class="label-text">Assignee</span></label>
    <input id="task-assignee" class="input input-bordered w-full" bind:value={assignee} name="assignee" required placeholder="Who's responsible?" />
  </div>

  <div class="form-control">
    <label class="label" for="task-desc"><span class="label-text">Description</span></label>
    <textarea id="task-desc" class="textarea textarea-bordered w-full" rows="4" bind:value={description} name="description" placeholder="Details (optional)"></textarea>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
    <div class="form-control">
      <label class="label" for="task-priority"><span class="label-text">Priority</span></label>
      <select id="task-priority" class="select select-bordered w-full" bind:value={priority} name="priority">
        {#each priorities as p}<option value={p}>{p}</option>{/each}
      </select>
    </div>
    <div class="form-control">
      <label class="label" for="task-status"><span class="label-text">Status</span></label>
      <select id="task-status" class="select select-bordered w-full" bind:value={status} name="status">
        {#each statuses as s}<option value={s}>{s}</option>{/each}
      </select>
    </div>
  </div>

  <div class="flex items-center gap-2 pt-2 justify-end">
    <button type="button" class="btn" on:click={onCancel}>Cancel</button>
    <button type="submit" class="btn btn-primary">Add Task</button>
  </div>
</form>

<style>
  /* Minimal defaults if utility classes aren't present */
  .form-control { display: flex; flex-direction: column; }
  .label { margin-bottom: 4px; }
  .label-text { font-weight: 600; font-size: 0.9rem; }

  .input, .select, .textarea {
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--border-strong, #d1d5db);
    border-radius: 0.5rem;
    background: var(--surface, #ffffff);
    color: var(--text, #1f2937);
  }

  .btn {
    padding: 0.5rem 0.9rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border-strong, transparent);
    cursor: pointer;
    background: var(--surface, #ffffff);
    color: var(--text, #1f2937);
  }
  .btn-primary {
    background: var(--primary, #2563eb);
    color: white;
    border-color: transparent;
  }
  .btn:hover { filter: brightness(0.98); }

  .space-y-3 > * + * { margin-top: 0.75rem; }
  .grid { display: grid; }
  .grid-cols-1 { grid-template-columns: 1fr; }
  .gap-3 { gap: 0.75rem; }
  @media(min-width: 768px) { .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
