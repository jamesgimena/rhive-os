import { ProjectInput } from './sharedProjectTypes';
import { projectService } from './firebaseService';

/**
 * Creates a full project with all related data (contacts, insurance, billing, etc.)
 * by calling the Firebase service.
 * 
 * Replaces the old REST API call.
 */
export async function createProject(data: ProjectInput) {
    // Call the service which handles automatic collection creation
    const result = await projectService.createFullProject(data);

    if (!result.success) {
        throw new Error(result.error as string || 'Failed to create project');
    }

    // Fetch the full project from the 'leads' collection (second arg = true)
    const fullProjectResult = await projectService.getFullProject(result.projectId!, true);
    if (fullProjectResult.success) {
        return fullProjectResult.data;
    } else {
        throw new Error('Project created but failed to fetch details');
    }
}
