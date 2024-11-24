> [!NOTE]
> All frontend code for **Student Marketplace**.

# Details

This repository contains the frontend application for our project, built using **React**, **Vite**, and **Supabase**. The application enables users to browse, add, and trade items, providing a seamless e-commerce experience.

## Getting Started

To set up the project locally, follow these steps:

### Prerequisites

Ensure you have the following installed on your system:

-   [Node.js](https://nodejs.org/) (v16 or higher)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

## Environment Setup

To use the frontend locally, you need to set up a `.env` file in the `frontend` directory with the necessary database and environment variables. `.env` file stores sensitive keys in the setup. This file should always be excluded from version control. The `.env` file is included in `.gitignore` to prevent accidental commits.

### Steps to Configure `.env`:

1. Create a `.env` file in the root of the `frontend` directory:

    ```bash
    touch .env
    ```

2. Add the following content to the `.env` file, replacing `<value>` with your actual values:

    ```env
    VITE_SUPABASE_URL=<supabase-url>
    VITE_SUPABASE_ANON_KEY=<anon-key>
    ```

3. Save the file. This file contains sensitive information, so **do not commit it to version control**. It is already added to `.gitignore`.

## Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:6969`.

## Building for Production

To create a production build:

```bash
npm run build
```

The build files will be generated in the `dist` directory.

## Deployment

Coming soon...

## Support

For any questions or assistance, feel free to contact the contributors of this project.
