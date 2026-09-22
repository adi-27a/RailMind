FROM python:3.12-slim
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DEFAULT_TIMEOUT=300 \
    PIP_RETRIES=10 \
    PIP_INDEX_URL=https://pypi.org/simple

COPY requirements.txt .
# pip 25.1.1 is a Python 3.12-compatible, pinned installer. Keep this step separate so failures are diagnosable.
RUN python -m pip install --no-cache-dir --default-timeout=300 --retries 10 --index-url https://pypi.org/simple --upgrade "pip==25.1.1"
# Prefer published wheels (not source builds) for the scientific stack while preserving every ML dependency.
RUN python -m pip install --no-cache-dir --default-timeout=300 --retries 10 --index-url https://pypi.org/simple --prefer-binary -r requirements.txt

# Debian slim includes adduser; keep service process unprivileged.
RUN adduser --system --group --home /home/railmind railmind
COPY app ./app
RUN python -m app.training && chown -R railmind:railmind /app

USER railmind
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
