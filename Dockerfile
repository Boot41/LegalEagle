##############################
# Stage 1: Build the Go Backend
##############################
FROM golang:1.24.0 AS backend_builder
WORKDIR /app/backend

# Copy go.mod and go.sum from the server directory and download dependencies
COPY server/go.mod server/go.sum ./
RUN go mod tidy

# Copy the rest of the backend source (including .env and migration files if needed)
COPY server/ .

# Build the backend binary
RUN CGO_ENABLED=0 go build -o LegalEagle

##############################
# Stage 2: Build the Frontend
##############################
FROM node:18 AS frontend_builder
WORKDIR /app/frontend

# Copy package files and install dependencies
COPY client/package.json client/package-lock.json ./
RUN npm install

# Copy the rest of the frontend source (including .env)
COPY client/ .

# Build the frontend for production
RUN npm run build

##############################
# Final Stage: Serve Backend & Frontend with Go
##############################
FROM golang:1.24.0 AS final
WORKDIR /app

# Copy the backend binary and its .env from the builder stage
COPY --from=backend_builder /app/backend/LegalEagle /app/LegalEagle
COPY server/.env /app/

# Copy the migration files
COPY server/db/migrations /app/db/migrations

# Copy frontend build files into a directory Go will serve
COPY --from=frontend_builder /app/frontend/dist /app/frontend/dist

# Expose backend port
EXPOSE 8000

# Run the Go backend (which will also serve frontend files)
CMD ["/app/LegalEagle"]
