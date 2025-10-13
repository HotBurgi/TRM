// place files you want to import through the `$lib` alias in this folder.

/* spagnoli */
import { writable } from 'svelte/store';

const STORAGE_KEY = 'devtaskmanager_issues';

function generateId() {
    return Date.now().toString();
}

function createKanbanStore() {
    // Carica i dati iniziali da localStorage
    const storedIssues = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    const initialValue = storedIssues ? JSON.parse(storedIssues) : [];
    

    const { subscribe, set, update } = writable(initialValue);

    subscribe(issues => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
        }
    });

    return {
        subscribe,
        addIssue: (issueData) => update(issues => [
            ...issues,
            { id: generateId(), status: 'Backlog', ...issueData }
        ]),
        moveIssue: (id, newStatus) => update(issues => 
            issues.map(issue => 
                issue.id === id ? { ...issue, status: newStatus } : issue
            )
        ),
        deleteIssue: (id) => update(issues => 
            issues.filter(issue => issue.id !== id)
        ),
        set
    };
}

export const kanbanStore = createKanbanStore();
/* spagnoli */

