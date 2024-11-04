> [!IMPORTANT]
> Group project repository for **Student Marketplace**.<br /><br />
> COMPSCI 320 (Fall 2024) — **Group #5**<br />
> **Members:** [Christian Dela Cruz](https://github.com/cmpdc), [Xing-Wei Lee](https://github.com/1985lxw), [Sophia Tang](https://github.com/sophiatangg)<br />
> **Manager:** Mahika Arora

# Project Overview

This repository contains all code and documentation related to the **Student Marketplace** project, a platform for students to buy, sell, and exchange items within their university community. The project is structured into clearly defined folders to keep code and documentation organized.

## Folder Structure

-   `.vscode`: Contains workspace-specific VSCode settings for consistent development across team members.
-   `code`: Houses all code-related files, divided into specific subfolders for each part of the project:
    -   `backend`: All server-side code, including API endpoints, database configurations, and business logic.
    -   `frontend`: All client-side code, including UI components, assets, and styling.
    -   `middleware`: Code that interfaces between the backend and frontend, handling data flow and user requests.
-   `docs`: Contains all documentation files for the project, such as design documents, project specifications, and any other relevant resources.

## Important Guidelines

1. **File Organization**:

    - Ensure that all code files are placed in the correct subfolder within `code`.
    - Document-related files should only be placed in the `docs` folder.

2. **Using Git**:

    - Exclude unnecessary files, such as `node_modules`, from commits (handled by `.gitignore`).
    - Always pull the latest changes before starting work to avoid merge conflicts.

3. **Working in VSCode**:

    - Navigate to the desired folder before working on a specific section of the codebase.
    - For instance, to work on backend files, use `cd code/backend` in the terminal.

4. **Getting Started**:

    - **Backend**: Navigate to `code/backend` and run `npm install` to set up dependencies.
    - **Frontend**: Navigate to `code/frontend` and run `npm install` to set up dependencies.
    - **Middleware**: Navigate to `code/middleware` if applicable and set up dependencies.

5. **Collaboration**:
    - Each team member should ensure code adheres to project standards.
    - Use descriptive commit messages and push changes frequently to maintain progress visibility.

## Quick Links

-   **Project Documentation**: Refer to the `docs` folder for all design specifications, UML diagrams, and requirements.
-   **Code Guidelines**: Refer to the `code/README.md` for specific instructions on working within the code folders.

## Others

This README serves as a centralized guide for navigating and contributing to the **Student Marketplace** project. Each aforementioned sections provides essential information to ensure smooth teamwork and project success.
