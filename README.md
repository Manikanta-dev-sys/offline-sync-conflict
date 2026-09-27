# Offline Sync Conflict

A backend system for handling offline data synchronization across multiple devices with version tracking and conflict resolution.

## 📌 Project Overview

Offline Sync Conflict is a backend API designed to synchronize document changes made from multiple devices.

The system tracks document versions and detects conflicts when a device attempts to synchronize changes based on an outdated version.

It supports:

- Document creation
- Document retrieval
- Document updates
- Version tracking
- Change history
- Conflict detection
- Server-wins resolution
- Client-wins resolution
- Duplicate request detection
- Out-of-order synchronization handling
- REST API
- Swagger API documentation

## 🎯 Problem Statement

When multiple devices work on the same data while offline, each device may modify an older version of the data.

When the devices reconnect, the server needs to determine whether:

1. The client's version is still current.
2. A conflict has occurred.
3. The server version should be retained.
4. The client version should be accepted.

This project implements version-based synchronization and conflict handling.

## 🛠️ Technology Stack

### Backend

- Node.js
- Express.js

### Database

- PostgreSQL

### API Testing

- Postman

### API Documentation

- Swagger UI

### Development Environment

- Visual Studio Code

## 📂 Project Structure

```text
offline-sync-conflict/
│
├── src/
│   ├── controllers/
│   │   └── syncController.js
│   │
│   ├── routes/
│   │   └── syncRoutes.js
│   │
│   ├── services/
│   │   └── conflictService.js
│   │
│   ├── db.js
│   ├── server.js
│   └── swagger.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md