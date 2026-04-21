import { useState, useEffect, useCallback } from 'react';
import {
    projectService,
    contactService,
    estimateService,
    userService,
    dashboardService,
    searchService,
    firestoreService
} from '../lib/firebaseService';

/**
 * React Hooks for Database CRUD Operations (Firebase Adapter)
 * 
 * Replaces the REST API hooks with direct Firebase service calls.
 * Maintains the same hook signature for compatibility.
 */

// Adapter to simulate fetchAPI behavior using Firebase services
async function fetchAPI(endpoint: string, options: any = {}) {
    // console.log(`[Firebase Adapter] ${options.method || 'GET'} ${endpoint}`);

    try {
        let result;
        const method = options.method || 'GET';
        const body = options.body ? JSON.parse(options.body) : null;

        // --- PROJECTS ---
        if (endpoint === '/projects') {
            if (method === 'POST') {
                // Create Full Project
                const createResult = await projectService.createFullProject(body);
                if (createResult.success) {
                    // Fetch the created project so the hook receives the full object as expected by UI
                    // Legacy behavior: returned the created object
                    result = await projectService.getById(createResult.projectId!);
                } else {
                    result = createResult;
                }
            }
            else result = await projectService.getAll();
        }
        else if (endpoint.match(/\/projects\/[^/]+$/)) {
            const id = endpoint.split('/')[2];
            if (method === 'PUT') result = await firestoreService.updateDocument('projects', id, body);
            else if (method === 'DELETE') result = await firestoreService.deleteDocument('projects', id);
            else result = await projectService.getById(id);
        }
        else if (endpoint.match(/\/projects\/[^/]+\/full$/)) {
            const id = endpoint.split('/')[2];
            result = await projectService.getFullProject(id);
        }
        else if (endpoint.match(/\/projects\/search\/.+/)) {
            const term = decodeURIComponent(endpoint.split('/')[3]);
            result = await searchService.searchProjects(term);
        }

        // --- CONTACTS ---
        else if (endpoint === '/contacts') {
            if (method === 'POST') result = await contactService.create(body);
            else result = await contactService.getAll();
        }
        else if (endpoint.match(/\/projects\/[^/]+\/contacts$/)) {
            const projectId = endpoint.split('/')[2];
            result = await contactService.getByProjectId(projectId);
        }
        else if (endpoint.match(/\/contacts\/[^/]+$/)) {
            const id = endpoint.split('/')[2];
            if (method === 'PUT') result = await contactService.update(id, body);
            else if (method === 'DELETE') result = await contactService.delete(id);
        }

        // --- ESTIMATES ---
        else if (endpoint === '/estimates') {
            if (method === 'POST') result = await estimateService.create(body);
            else result = await estimateService.getAll();
        }
        else if (endpoint.match(/\/projects\/[^/]+\/estimates$/)) {
            const projectId = endpoint.split('/')[2];
            result = await estimateService.getByProjectId(projectId);
        }
        else if (endpoint.match(/\/estimates\/[^/]+$/)) {
            const id = endpoint.split('/')[2];
            if (method === 'PUT') result = await estimateService.update(id, body);
            else if (method === 'DELETE') result = await estimateService.delete(id);
        }

        // --- USERS ---
        else if (endpoint === '/users') {
            if (method === 'POST') result = await userService.create(body);
            else result = await userService.getAll();
        }
        else if (endpoint.match(/\/users\/[^/]+$/)) {
            const id = endpoint.split('/')[2];
            if (method === 'PUT') result = await userService.update(id, body);
            else if (method === 'DELETE') result = await userService.delete(id);
        }

        // --- DASHBOARD ---
        else if (endpoint === '/dashboard/stats') {
            result = await dashboardService.getStats();
        }
        else if (endpoint.match(/\/dashboard\/recent/)) {
            result = await dashboardService.getRecentActivity();
        }

        else {
            throw new Error(`Endpoint not found: ${endpoint}`);
        }

        if (result.success) {
            return result.data || result;
        } else {
            throw new Error(result.error || 'Firebase operation failed');
        }

    } catch (err: any) {
        console.error('Firebase Adapter Error:', err);
        throw err;
    }
}

// ============================================================================
// PROJECTS HOOKS
// ============================================================================

export function useProjects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchAPI('/projects');
            setProjects(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const createProject = async (projectData: any) => {
        try {
            const newProject = await fetchAPI('/projects', {
                method: 'POST',
                body: JSON.stringify(projectData),
            });
            setProjects(prev => [newProject, ...prev]);
            return newProject;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateProject = async (id: number | string, updates: any) => {
        try {
            const updated = await fetchAPI(`/projects/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updates),
            });
            setProjects(prev => prev.map(p => p.id === id ? updated : p));
            return updated;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteProject = async (id: number | string) => {
        try {
            await fetchAPI(`/projects/${id}`, { method: 'DELETE' });
            setProjects(prev => prev.filter(p => p.id !== id));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return {
        projects,
        loading,
        error,
        refresh: fetchProjects,
        createProject,
        updateProject,
        deleteProject,
    };
}

export function useProject(id: number | string) {
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProject = useCallback(async () => {
        if (!id) return;
        try {
            setLoading(true);
            const data = await fetchAPI(`/projects/${id}/full`);
            setProject(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchProject();
    }, [fetchProject]);

    return { project, loading, error, refresh: fetchProject };
}

// ============================================================================
// CONTACTS HOOKS
// ============================================================================

export function useContacts(projectId?: number | string) {
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchContacts = useCallback(async () => {
        try {
            setLoading(true);
            const endpoint = projectId
                ? `/projects/${projectId}/contacts`
                : '/contacts';
            const data = await fetchAPI(endpoint);
            setContacts(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        if (projectId !== undefined) fetchContacts();
    }, [fetchContacts]);

    const createContact = async (contactData: any) => {
        try {
            const newContact = await fetchAPI('/contacts', {
                method: 'POST',
                body: JSON.stringify(contactData),
            });
            setContacts(prev => [...prev, newContact]);
            return newContact;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateContact = async (id: number | string, updates: any) => {
        try {
            const updated = await fetchAPI(`/contacts/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updates),
            });
            setContacts(prev => prev.map(c => c.id === id ? updated : c));
            return updated;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteContact = async (id: number | string) => {
        try {
            await fetchAPI(`/contacts/${id}`, { method: 'DELETE' });
            setContacts(prev => prev.filter(c => c.id !== id));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return {
        contacts,
        loading,
        error,
        refresh: fetchContacts,
        createContact,
        updateContact,
        deleteContact,
    };
}

// ============================================================================
// ESTIMATES HOOKS
// ============================================================================

export function useEstimates(projectId?: number | string) {
    const [estimates, setEstimates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEstimates = useCallback(async () => {
        try {
            setLoading(true);
            const endpoint = projectId
                ? `/projects/${projectId}/estimates`
                : '/estimates';
            const data = await fetchAPI(endpoint);
            setEstimates(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        if (projectId !== undefined) fetchEstimates();
    }, [fetchEstimates]);

    const createEstimate = async (estimateData: any) => {
        try {
            const newEstimate = await fetchAPI('/estimates', {
                method: 'POST',
                body: JSON.stringify(estimateData),
            });
            setEstimates(prev => [newEstimate, ...prev]);
            return newEstimate;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateEstimate = async (id: number | string, updates: any) => {
        try {
            const updated = await fetchAPI(`/estimates/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updates),
            });
            setEstimates(prev => prev.map(e => e.id === id ? updated : e));
            return updated;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteEstimate = async (id: number | string) => {
        try {
            await fetchAPI(`/estimates/${id}`, { method: 'DELETE' });
            setEstimates(prev => prev.filter(e => e.id !== id));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return {
        estimates,
        loading,
        error,
        refresh: fetchEstimates,
        createEstimate,
        updateEstimate,
        deleteEstimate,
    };
}

// ============================================================================
// USERS HOOKS
// ============================================================================

export function useUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchAPI('/users');
            setUsers(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const createUser = async (userData: any) => {
        try {
            const newUser = await fetchAPI('/users', {
                method: 'POST',
                body: JSON.stringify(userData),
            });
            setUsers(prev => [...prev, newUser]);
            return newUser;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const updateUser = async (id: number | string, updates: any) => {
        try {
            const updated = await fetchAPI(`/users/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updates),
            });
            setUsers(prev => prev.map(u => u.id === id ? updated : u));
            return updated;
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    const deleteUser = async (id: number | string) => {
        try {
            await fetchAPI(`/users/${id}`, { method: 'DELETE' });
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (err: any) {
            setError(err.message);
            throw err;
        }
    };

    return {
        users,
        loading,
        error,
        refresh: fetchUsers,
        createUser,
        updateUser,
        deleteUser,
    };
}

// ============================================================================
// DASHBOARD HOOKS
// ============================================================================

export function useDashboardStats() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchAPI('/dashboard/stats');
            setStats(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, error, refresh: fetchStats };
}

export function useRecentActivity(limit: number = 10) {
    const [activity, setActivity] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchActivity = useCallback(async () => {
        try {
            setLoading(true);
            const data = await fetchAPI(`/dashboard/recent?limit=${limit}`);
            setActivity(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchActivity();
    }, [fetchActivity]);

    return { activity, loading, error, refresh: fetchActivity };
}

// ============================================================================
// SEARCH HOOK
// ============================================================================

export function useProjectSearch() {
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const search = async (term: string) => {
        if (!term.trim()) {
            setResults([]);
            return;
        }

        try {
            setLoading(true);
            const data = await fetchAPI(`/projects/search/${encodeURIComponent(term)}`);
            setResults(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { results, loading, error, search };
}
