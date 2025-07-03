# Stage 1
FROM python:3.12-slim AS deps
WORKDIR /opt

# Install only runtime deps into /opt/python
COPY requirements.txt .
RUN pip install --no-cache-dir -t /opt/python -r requirements.txt \
 && find /opt/python -name "*.py[co]" -delete \
 && find /opt/python -name "__pycache__" -type d -exec rm -rf {} + \
 && find /opt/python -name "tests" -type d -exec rm -rf {} +

# runtime stage
# Rapid-2x tag = smaller & slightly faster; fall back to plain python:3.12 if not available
FROM public.ecr.aws/lambda/python:3.12-x86_64

# Copy trimmed dependencies and application code
COPY --from=deps /opt/python /opt/python
COPY . /var/task

# Extra cleanup (docs, man pages, yum cache) ~100 MB
RUN rm -rf /var/lang/share/{man,doc} /var/lang/lib/python*/test* /var/runtime/__pycache__

# Default Lambda entrypoint: main.handler (change if needed)
CMD ["main.handler"]
