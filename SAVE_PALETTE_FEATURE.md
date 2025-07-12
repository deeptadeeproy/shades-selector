# Save Palette Feature

## Overview

The save palette feature allows logged-in users to save their generated color palettes to projects. This feature includes:

- A "Save Palette" button that appears when users are logged in
- A project selection modal with fuzzy search functionality
- The ability to create new projects on-the-fly
- Success notifications when palettes are saved

## How It Works

### 1. Save Button
- Only visible when the user is logged in
- Located below the "See Code" and "Alerts" buttons in the color controls section
- Styled with a green background to indicate a positive action

### 2. Project Selection Modal
When the save button is clicked, a modal opens that allows users to:

#### Search Projects
- Type to search through existing projects
- Uses fuzzy search algorithm for better matching
- Shows all projects by default when no search query is entered

#### Create New Projects
- If no project matches the search query, users can create a new one
- The search query becomes the default project name
- Users can modify the name before creating

#### Select and Save
- Click on any project to select it
- Selected project is highlighted with a checkmark
- Click "Save to Project" to complete the action

### 3. Fuzzy Search Algorithm
The fuzzy search implementation:
- Matches characters in order (e.g., "proj" matches "My Project")
- Gives higher scores to consecutive matches
- Prioritizes matches that appear earlier in the project name
- Returns results sorted by relevance score

### 4. Backend Integration
The feature integrates with the existing backend:
- Uses the `/api/projects` endpoints for project management
- Uses the `/api/palettes/save` endpoint for palette storage
- Requires authentication tokens for all operations
- Stores palette configuration (hue, chroma, isLight) along with colors

## Technical Implementation

### Components
- `ProjectSelectionModal`: Main modal component for project selection
- `Toast`: Notification component for success/error messages
- `fuzzySearch`: Utility functions for search functionality

### API Functions
- `getUserProjects(token)`: Fetch user's projects
- `createProject(name, description, token)`: Create new project
- `savePalette(name, config, colors, token)`: Save palette
- `savePaletteToProject(projectId, paletteId, token)`: Link palette to project

### State Management
- Project list and filtered results
- Search query and new project name
- Loading states and error handling
- Toast notifications

## User Flow

1. User generates a color palette using the controls
2. User clicks "Save Palette" button (only visible when logged in)
3. If not logged in, user is redirected to login page
4. Project selection modal opens showing all user's projects
5. User can search for specific projects or create a new one
6. User selects a project and clicks "Save to Project"
7. Palette is saved to the backend and linked to the selected project
8. Success notification appears
9. Modal closes and user returns to palette editor

## Error Handling

- Network errors are displayed in the modal
- Invalid project names show validation errors
- Authentication errors redirect to login
- Loading states prevent multiple submissions

## Future Enhancements

- Allow users to name their palettes before saving
- Add palette preview in project selection
- Support for palette categories/tags
- Bulk operations for multiple palettes
- Export palettes from projects 