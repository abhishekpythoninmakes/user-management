# User Management System

[![Django](https://img.shields.io/badge/Django-5.0-green?logo=django)](https://www.djangoproject.com/)
[![REST Framework](https://img.shields.io/badge/DRF-3.x-red?logo=django)](https://www.django-rest-framework.org/)
[![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)](https://www.python.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

A Django-based **User Management System** with JWT authentication, REST APIs, and CORS enabled.

---

## Installation

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/user_management_system.git
cd user_management_system
Step 2: Create and Activate Virtual Environment
bash
Copy code
python -m venv env
source env/bin/activate   # Linux / Mac
env\Scripts\activate      # Windows (PowerShell)
Step 3: Install Dependencies
bash
Copy code
pip install -r requirements.txt
Step 4: Apply Migrations
bash
Copy code
python manage.py migrate
Step 5: Run Development Server
bash
Copy code
python manage.py runserver
Authentication
JWT authentication powered by djangorestframework-simplejwt.

Obtain token:

bash
Copy code
POST /api/token/
Refresh token:

bash
Copy code
POST /api/token/refresh/
