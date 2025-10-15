<script>
    import TaskForm from '$lib/TaskForm.svelte';
    import { onMount } from 'svelte';

    /** @typedef {'Backlog'|'In Progress'|'Review'|'Done'} Status */
    /** @typedef {'Urgent'|'Medium'|'Low'|'None'} Priority */
    /** @typedef {{ title:string; assignee:string; description:string; status:Status; priority:Priority }} Incoming */

    /** @type {Status[]} */
    const statuses = ['Backlog', 'In Progress', 'Review', 'Done'];
    /** @type {Priority[]} */
    const priorities = ['Urgent', 'Medium', 'Low', 'None'];

    let nextId = 1;

        function loadNextId() {
        if (typeof localStorage !== 'undefined') {
            const savedTasks = localStorage.getItem('tasks');
            const savedNextId = localStorage.getItem('nextId');
            let tasks = [];
            if (savedTasks) tasks = JSON.parse(savedTasks);
            if (savedNextId) {
                nextId = parseInt(savedNextId);
            } else {
                    // @ts-ignore
                    nextId = tasks.length ? Math.max(...tasks.map((/** @type {{id:number}} */i) => i.id)) + 1 : 1;
            }
        }
    }

        /** @param {Incoming} task */
        function saveTask(task) {
        if (typeof localStorage === 'undefined') return;
        const saved = localStorage.getItem('tasks');
        const issues = saved ? JSON.parse(saved) : [];
        const newTask = { id: nextId++, ...task };
        localStorage.setItem('tasks', JSON.stringify([...issues, newTask]));
        localStorage.setItem('nextId', String(nextId));
    }

        /** @param {{ detail: Incoming }} e */
        function handleSubmit(e) {
        const data = e.detail;
        if (!data?.title || !data?.assignee) return;
        saveTask(data);
        // Navigate to home
        window.location.href = '/';
    }

    onMount(loadNextId);
</script>

<main class="min-h-screen bg-base-200 flex items-center justify-center p-4">
	<section class="card bg-base-100 shadow-xl w-full max-w-3xl">
		<div class="card-body gap-4">
			<h1 class="text-3xl font-bold">Create Task</h1>
			<TaskForm
				{statuses}
				{priorities}
				on:submit={handleSubmit}
				on:cancel={() => history.back()}
			/>
		</div>
	</section>
</main>