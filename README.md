# Distributed Systems Playground

A distributed task processing system that demonstrates real-world backend infrastructure patterns such as job queues, worker orchestration, retries, dead-letter queues, and real-time observability.

## Overview
This project implements an event-driven backend system where tasks are processed asynchronously by distributed workers. It simulates how production systems handle failures, retries, and monitoring at scale.

## Key Features
- Asynchronous task processing using Redis Streams
- Worker pool with consumer groups
- Retry mechanism with delayed execution
- Dead Letter Queue (DLQ) for failed tasks
- PostgreSQL-based persistence
- Real-time event streaming via WebSockets
- Dashboard UI for monitoring system state
- Rate limiting on APIs
- Idempotent task handling

## Architecture
Client → API (Express) → PostgreSQL (Task storage) → Redis Streams (Queue) → Worker Consumers (Consumer Groups) → Retry Queue → DLQ → Event Bus → WebSocket Server → Dashboard UI

## Tech Stack
Backend: Node.js, Express, TypeScript
Queue: Redis Streams
Database: PostgreSQL
Realtime: WebSockets
Frontend: React, Tailwind CSS

## Task Lifecycle
Queued → Running → Completed
Failed → Retry → Success or DLQ

## How It Works
1. A client sends a task via the REST API
2. The task is stored in PostgreSQL
3. The task ID is pushed to a Redis Stream
4. A worker consumes the task via a consumer group
5. The worker processes the task
6. On success, the task is marked completed
7. On failure, the task is sent to the retry queue
8. After exceeding retry limit, the task is moved to the DLQ
9. Events are emitted via WebSocket and reflected in the dashboard

## Dashboard
- System metrics (queued, running, completed, DLQ)
- Real-time task timeline
- Task table with status and attempts

## Setup Instructions
Clone the repository:
git clone https://github.com/yashwork-byte/Distributed-Systems-Playground
cd distributed-systems-playground

Backend setup:
cd backend
npm install

Create a .env file:
DATABASE_URL=your_postgres_url
REDIS_URL=redis://localhost:6379

Run backend:
npm run dev

Frontend setup:
cd dashboard-ui
npm install
npm run dev

## API Endpoints
POST /tasks
Body:
{
  "type": "email",
  "payload": {}
}

GET /tasks

GET /metrics

## WebSocket
Connect to:
ws://localhost:8080

Events:
TASK_RECEIVED
TASK_STARTED
TASK_COMPLETED
TASK_FAILED
TASK_RETRY
TASK_DLQ

## Limitations
- No worker crash recovery (XPENDING/XCLAIM not implemented)
- No horizontal scaling across multiple nodes
- Event bus is in-memory
- No authentication or multi-tenancy

## Future Improvements
- Worker crash recovery using Redis pending entries
- Distributed event streaming (Kafka or NATS)
- Dockerized multi-node deployment
- Metrics visualization (throughput, latency)
- Authentication and access control

## Learnings
- Distributed queue design
- Failure handling and retry strategies
- At-least-once delivery semantics
- Idempotency in distributed systems
- Real-time observability patterns

## Author
Yash Tarun