FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=5000

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY run.py .

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD python -c "import os, urllib.request; urllib.request.urlopen(f'http://127.0.0.1:{os.getenv(\"PORT\", \"5000\")}/health', timeout=3)"

CMD ["sh", "-c", "python -c \"import os, time, mysql.connector; config={'host': os.getenv('DB_HOST'), 'user': os.getenv('DB_USER'), 'password': os.getenv('DB_PASSWORD'), 'database': os.getenv('DB_NAME')};\nfor attempt in range(60):\n    try:\n        conn = mysql.connector.connect(**config); conn.close(); break\n    except Exception as exc:\n        print(f'Waiting for database ({attempt + 1}/60): {exc}', flush=True); time.sleep(2)\nelse:\n    raise SystemExit('Database did not become ready')\" && gunicorn run:app --bind 0.0.0.0:${PORT:-5000}"]
