FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /backend

# Install python dependencies
COPY requirements.txt /backend/
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY . /backend/

# Expose port
EXPOSE 8000

# Script to run migrations, seed data, and start server
CMD ["sh", "-c", "alembic upgrade head && python -m app.db.seed && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
