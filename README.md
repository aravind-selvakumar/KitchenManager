# Kitchen Stock Manager

A web application for managing kitchen stock, inventory, and daily ration usage with cost tracking and reporting.

## Tech Stack

- **Frontend:** React 18 + Vite + React Router + Axios
- **Backend:** ASP.NET Core 8 Web API + Entity Framework Core
- **Database:** SQLite
- **Auth:** JWT Bearer tokens with role-based access (Admin/User)

## Features

| Feature | Details |
|---------|---------|
| **Auth** | Register with role selection, JWT login |
| **Products** | Full CRUD, multiple units (kg/g/L/ml), cost capture, min stock threshold |
| **Rationing** | Daily usage recording, auto cost computation, stock decrement, cost snapshots |
| **Reports** | Daily / Monthly / Custom date range with cost breakdowns |
| **Export** | PDF (jsPDF) and Excel (SheetJS) download for any report |
| **Low Stock Alerts** | Dashboard banner, sidebar badge count, highlighted rows |
| **Users** | Admin-only page for role management and account status |

## Getting Started

### Prerequisites

- .NET SDK 8.0+
- Node.js 18+

### Quick Start

Double-click `start.bat` or run in terminal:

```bash
# Terminal 1: Start backend
cd backend\KitchenManager.API
dotnet run

# Terminal 2: Start frontend
cd frontend
npm install
npm run dev
```

### Access

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **Swagger UI:** http://localhost:5000/swagger

### Default Accounts

| Username | Password | Role |
|----------|----------|------|
| admin | password123 | Admin |
| user1 | password123 | User |
| user2 | password123 | User |

### Sample Data

The app seeds with 10 products, 2 sample ration entries, and 3 users on first run.

## Project Structure

```
KitchenManager/
├── backend/
│   └── KitchenManager.API/
│       ├── Controllers/     # API endpoints
│       ├── Models/          # Entity models
│       ├── DTOs/            # Request/response DTOs
│       ├── Services/        # Business logic
│       └── Data/            # DbContext + seed data
├── frontend/
│   └── src/
│       ├── components/      # Reusable components
│       ├── pages/           # Page components
│       ├── context/         # Auth context
│       └── services/        # API service layer
├── start.bat               # Quick start script
└── README.md
```
