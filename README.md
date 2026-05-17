# 3161Project

## Backend API

This project includes a Flask API backed by MySQL.

### Environment Variables

Create a local `.env` file from `.env.example` and update the values for your database:

```bash
cp .env.example .env
```

Required variables:

```text
DB_HOST=localhost
DB_USER=comp3161_user
DB_PASSWORD=comp3161_password
DB_NAME=comp3161_project
JWT_SECRET_KEY=replace-with-a-secure-random-value
```

### Run Locally

```bash
pip install -r requirements.txt
python run.py
```

The health check is available at:

```text
GET /health
```

### Docker

Build and run only the API container:

```bash
docker build -t comp3161-api .
docker run --env-file .env -p 5000:5000 comp3161-api
```

Run the API with a MySQL container:

```bash
docker compose up --build
```

The compose setup initializes MySQL using:

```text
database/schema.sql
database/populate.sql
```

### CI/CD

GitHub Actions is configured in `.github/workflows/backend.yml`.

The workflow:

- installs Python dependencies
- compiles the backend
- smoke tests the Flask `/health` route
- builds the Docker image

### Optimization

The schema includes indexes for common lookup and join columns, especially foreign keys and report filters:

- enrollment lookup by `student_id` and `course_id`
- course lookup by `lecturer_id` and `created_by`
- assignment and submission joins
- calendar event lookup by `course_id` and `event_date`
- forum, thread, and reply lookup columns

The report endpoints use a simple 60-second in-memory TTL cache in `app/cache.py`. This reduces repeated database work for aggregate report queries while keeping the implementation lightweight for a class project.

### Deployment

For Render, Railway, or a similar host, deploy the backend as either a Docker service or a Python web service.

Recommended production start command:

```bash
gunicorn run:app --bind 0.0.0.0:$PORT
```

Set these environment variables in the hosting dashboard:

```text
DB_HOST
DB_USER
DB_PASSWORD
DB_NAME
JWT_SECRET_KEY
```
