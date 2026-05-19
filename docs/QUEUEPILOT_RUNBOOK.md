# QueuePilot Runbook

## Overview

QueuePilot is an async job processing system built with:

- Next.js App Router
- Supabase
- OpenAI
- Vercel

The system simulates production-style background job processing with retries, telemetry, audit trails, and dead-letter queue behavior.

---

# Core Features

## Job Creation
Users can create async jobs from the dashboard.

Each job stores:

- title
- input
- job type
- status
- timestamps
- attempt count
- result
- error state

---

## Async Processing

Jobs are processed through:

app/api/process-jobs/route.ts

The worker:

- finds queued jobs
- claims jobs
- marks jobs processing
- processes AI work
- stores results
- handles failures
- tracks retries

---

## Retry System

Failed jobs can retry up to 3 attempts.

Fields used:

- attempt_count
- failed_at
- retried_at
- error_message

When retries exceed limit:

- job enters dead-letter style state
- manual review required

---

## Telemetry System

Telemetry events are stored in:

job_events

Tracked events include:

- job_created
- job_processing
- job_completed
- job_failed

The UI displays telemetry history chronologically on the job details page.

---

## Job Timeline UI

Location:

app/jobs/[id]/page.tsx

The timeline shows:

- event type
- human-readable message
- timestamp

This simulates production observability and audit trail behavior.

---

## Deployment Workflow

Development Flow:

feature branch
→ build verification
→ commit
→ push
→ merge into main
→ deploy through Vercel

---

## Current Architecture

Current worker style:

- simulated polling worker
- route-triggered processing

Future upgrade path:

- Redis
- BullMQ
- dedicated workers
- queues
- scheduled jobs
- distributed processing

---

## Key Learning Objectives

QueuePilot demonstrates:

- async architecture
- retry systems
- telemetry tracking
- audit trails
- failure handling
- worker patterns
- production Git workflows
- deployment workflows

---

## Future Improvements

Potential future upgrades:

- BullMQ integration
- Redis queues
- cron scheduling
- websocket live updates
- worker dashboard
- admin observability panel
- queue prioritization
- concurrency controls
- rate limiting
- distributed workers