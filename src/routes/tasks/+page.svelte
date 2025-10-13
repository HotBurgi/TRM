<script type="js">
    import Column from '$lib/components/Column.svelte';
    import NewIssueForm from '$lib/components/NewIssueForm.svelte';
    // Importa lo store usando l'alias di SvelteKit $lib
    import { kanbanStore } from '$lib/index.js'; 

    const statuses = ['Backlog', 'In Progress', 'Review', 'Done'];
    let searchTerm = '';

    // Calcolo dei conteggi per l'header
    $: counts = $kanbanStore.reduce((acc, issue) => {
        acc[issue.status] = (acc[issue.status] || 0) + 1;
        return acc;
    }, { 'Backlog': 0, 'In Progress': 0, 'Review': 0, 'Done': 0 });

    // Filtra le issue per la barra di ricerca
    $: filteredIssues = $kanbanStore.filter(issue => {
        const term = searchTerm.toLowerCase().trim();
        if (!term) return true; 

        return issue.title.toLowerCase().includes(term) ||
               issue.description.toLowerCase().includes(term) ||
               issue.assignee.toLowerCase().includes(term);
    });
</script>

<main class="container mx-auto p-4 max-w-7xl">
    <header class="mb-6 border-b pb-4 flex justify-between items-end">
        <h1 class="text-3xl font-extrabold text-gray-900">DevTask Manager</h1>
        <div class="flex space-x-4 text-sm font-medium text-gray-600">
            {#each statuses as status}
                <span class="capitalize">
                    {status}: <strong class="text-gray-900">{counts[status]}</strong>
                </span>
            {/each}
        </div>
    </header>

    <div class="flex items-center justify-between mb-6 space-x-4">
        <NewIssueForm />
        <input 
            type="text" 
            placeholder="Cerca per titolo, descrizione o assegnatario" 
            bind:value={searchTerm}
            class="p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full max-w-sm transition duration-150"
        />
    </div>

    <div class="flex flex-wrap -mx-2 md:flex-nowrap">
        {#each statuses as status}
            <Column 
                {status} 
                issues={filteredIssues.filter(issue => issue.status === status)} 
            />
        {/each}
    </div>
</main>