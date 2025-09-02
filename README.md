
# User Management and Notes System

A Django-based web application that provides user registration, authentication, profile management, and a full-featured note-taking system with support for file attachments.

---

## Table of Contents

- [Installation and Setup](#installation-and-setup)
- [Usage Guide](#usage-guide)
- [API Endpoints](#api-endpoints)

---

## Installation and Setup

### Prerequisites

- Python 3.8 or higher
- `pip` (Python package installer)
- Virtual environment (recommended)

### Step 1: Clone the Repository

```bash
git clone https://github.com/abhishekpythoninmakes/user-management.git
cd user-management
```

### Step 2: Set Up Virtual Environment

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment:

- **On Windows:**
  ```bash
  venv\Scripts\activate
  ```

- **On macOS and Linux:**
  ```bash
  source venv/bin/activate
  ```

### Step 3: Install Dependencies

Install required Python packages:

```bash
pip install -r requirements.txt
```

**Contents of `requirements.txt`:**

```
Django==4.2.23
django-cors-headers==4.4.0
djangorestframework==3.15.2
djangorestframework-simplejwt==5.3.1
pillow==10.4.0
```

### Step 4: Set Up Database

Run database migrations:

```bash
python manage.py migrate
```

Create a superuser (optional, for accessing the Django admin panel):

```bash
python manage.py createsuperuser
```

Follow the prompts to set a username, email, and password.

### Step 5: Run Development Server

Start the development server:

```bash
python manage.py runserver
```

The application will be accessible at:  
[http://localhost:8000](http://localhost:8000)

---

## Usage Guide

### 1. Registration

- Navigate to: `http://localhost:8000/register`
- Fill in the required fields:
  - Username (availability is validated)
  - Email (availability is validated)
  - Password
  - Confirm Password
- Click **Register**

After successful registration, you will be automatically logged in and redirected to the notes dashboard.

### 2. Login

- Go to: `http://localhost:8000/`
- Enter your username and password
- Click **Login**

You will be redirected to your personal notes dashboard.

### 3. Managing Notes

#### Create a Note

- Click **Add New Note** in the sidebar
- Enter a title and description
- Optionally attach a file (supports images, PDFs, documents, audio, and video)
- Click **Save Note**

#### View Notes

- All your notes are displayed in the main area
- Click any note to view full details and attached files
- Use the search bar to filter notes by title or content
- Sort notes using the dropdown (by date or title)

#### Edit a Note

- Open the note you want to edit
- Click the **Edit** button
- Modify the title or description
- Click **Update Note** to save changes

#### Delete a Note

- Open the note you wish to delete
- Click the **Delete** button
- Confirm deletion in the confirmation dialog

### 4. Managing Profile

- Click **Profile** in the sidebar or navbar
- Update the following information:
  - Full Name
  - Date of Birth
  - Gender
  - Mobile Number
  - Address
- Click **Update Profile** to save changes

### 5. Changing Password

- Go to the **Profile** page
- Scroll down to the **Change Password** section
- Enter:
  - Current password
  - New password
  - Confirm new password
- Click **Change Password** to update

### 6. Logging Out

- Click the **Logout** button in the navbar or sidebar
- You will be logged out and redirected to the login page

---

## API Endpoints

### Authentication Endpoints

| Method | Endpoint                        | Description |
|--------|----------------------------------|-------------|
| POST   | `/api/auth/register/`           | Register a new user |
| POST   | `/api/auth/login/`              | Authenticate and log in |
| POST   | `/api/auth/logout/`             | Log out (blacklists refresh token if using JWT) |
| GET    | `/api/auth/profile/`            | Retrieve current user's profile |
| PUT    | `/api/auth/profile/`            | Update user profile |
| POST   | `/api/auth/change-password/`    | Change user password |
| GET    | `/api/auth/check-username/`     | Check if a username is available |
| GET    | `/api/auth/check-email/`        | Check if an email is already registered |

### Notes Endpoints

| Method | Endpoint               | Description |
|--------|------------------------|-------------|
| GET    | `/api/notes/`          | List all notes (supports `?search=` query parameter) |
| POST   | `/api/notes/`          | Create a new note |
| GET    | `/api/notes/<id>/`     | Retrieve a specific note by ID |
| PUT    | `/api/notes/<id>/`     | Update an existing note |
| DELETE | `/api/notes/<id>/`     | Delete a note by ID |

---

This project is built with scalability and clean architecture in mind, making it suitable for learning, customization, or integration into larger systems.

