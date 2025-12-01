# API Layer (Future)

תיקייה זו תכיל את כל הקריאות לשרת בעתיד.

## מבנה מתוכנן:

```
api/
├── client.ts          # Axios/Fetch config
├── auth.ts            # login, register, logout
├── reports.ts         # CRUD operations for SymptomReport
└── sync.ts            # Sync logic בין מקומי לשרת
```

## כרגע:

האפליקציה עובדת במצב offline-only עם SQLite מקומי.

## Phase 2 (עתידי):

כאן נוסיף:

- Authentication API calls
- CRUD operations לשרת
- Sync logic
