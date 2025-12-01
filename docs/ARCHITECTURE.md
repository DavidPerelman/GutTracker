# ארכיטקטורת GutTracker

## גישה: Offline-First, Cloud-Ready

### Phase 1 (נוכחי): Offline-Only

```
[React Native App]
       ↓
   [SQLite Local]
```

- כל הנתונים על המכשיר
- משתמש יחיד (`userId: "user1"`)
- אין צורך בחיבור אינטרנט

---

### Phase 2 (עתידי): Multi-User + Cloud Sync

```
[React Native App]
       ↓
   [SQLite Local] ←→ [Backend API] ←→ [PostgreSQL/MongoDB]
                           ↓
                    [Authentication]
```

- Login/Register
- Sync אוטומטי
- גיבוי בענן
- משתמשים מרובים

---

## מבנה שכבות (Layered Architecture)

```
┌─────────────────────────────────┐
│   UI Layer (Screens/Components) │
├─────────────────────────────────┤
│   Business Logic (Hooks/Services)│
├─────────────────────────────────┤
│   Data Access Layer              │
│   ├── Local (SQLite)             │
│   └── Remote (API) - future      │
└─────────────────────────────────┘
```

### עקרונות:

1. **UI לא מדבר ישירות עם Database**
2. **Business Logic מחליט: local או remote**
3. **קל להחליף SQLite ב-API בעתיד**

---

## מודלים

### SymptomReport

- מכיל `userId` - מוכן ל-multi-user
- עכשיו: `userId = "user1"`
- בעתיד: `userId = currentUser.id`

---

## תיקיות

| תיקייה        | תיאור                 | סטטוס            |
| ------------- | --------------------- | ---------------- |
| `models/`     | TypeScript interfaces | ✅ מוכן          |
| `database/`   | SQLite מקומי          | 🚧 הבא           |
| `api/`        | קריאות לשרת           | 📅 עתידי         |
| `services/`   | לוגיקה עסקית          | 📅 לאחר DB       |
| `screens/`    | UI מסכים              | 📅 לאחר services |
| `components/` | UI components         | 📅 לאחר screens  |

---

## Backend (Phase 2)

### טכנולוגיות מתוכננות:

- **Backend:** Node.js + Express / Python + FastAPI
- **Database:** PostgreSQL / MongoDB
- **Auth:** JWT tokens
- **Hosting:** Railway / Render / AWS

### Endpoints מתוכננים:

```
POST   /auth/register
POST   /auth/login
GET    /reports           # כל הדיווחים של המשתמש
POST   /reports           # יצירת דיווח חדש
PUT    /reports/:id       # עדכון
DELETE /reports/:id       # מחיקה
GET    /reports/sync      # sync מאז timestamp
```
