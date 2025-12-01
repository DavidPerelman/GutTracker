## מודלים

### SymptomReport - דיווח תסמינים

מייצג דיווח יומי אחד של משתמש על מצב מערכת העיכול.

#### שדות המודל:

**מזהים:**

- `id: string` - UUID ייחודי לדיווח
- `userId: string` - מזהה המשתמש (עכשיו: `"user1"`, בעתיד: מ-Authentication)
- `reportedAt: Date` - תאריך ושעת הדיווח

**תסמינים (סולם 0-10):**

- `bloating: number` - רמת נפיחות
- `constipation: number` - רמת עצירות
- `pain: number` - רמת כאב בטן

**יציאות:**

- `stoolFrequency: number` - כמות יציאות מאז הדיווח הקודם
- `stoolQuality?: string` - איכות הצואה (חובה אם `frequency > 0`)
  - דוגמאות: "רכה", "קשה", "תקינה", "נוזלית"

**מדדים כלליים (חובה):**

- `appetite: number` - רמת תיאבון (1-10)
- `stressLevel: number` - רמת סטרס (1-10)
- `waterCups: number` - כמות כוסות מים שנשתו

**תזונה ופעילות (אופציונלי):**

- `mealsSinceLastReport?: string` - תיאור חופשי של הארוחות
  - דוגמה: "בוקר: ביצים ולחם מלא, צהריים: עוף עם אורז, ערב: סלט"
- `physicalActivitySinceLastReport?: string` - תיאור פעילות גופנית
  - דוגמה: "ריצה 30 דקות", "חדר כושר שעה"

**שינה:**

- `sleepHours?: number` - כמות שעות שינה בלילה האחרון
- `sleepReportedToday: boolean` - דגל האם כבר דווח שינה היום (למנוע דיווח כפול)

**הערות:**

- `notes?: string` - הערות חופשיות נוספות

**מטא-דאטה:**

- `createdAt: Date` - תאריך יצירת הרשומה
- `updatedAt: Date` - תאריך עדכון אחרון

---

#### חוקי Validation:

1. **חובה:**

   - id, userId, reportedAt
   - bloating, constipation, pain (0-10)
   - stoolFrequency
   - appetite, stressLevel (1-10)
   - waterCups
   - sleepReportedToday
   - createdAt, updatedAt

2. **תלוי-תנאי:**

   - `stoolQuality` - חובה אם `stoolFrequency > 0`

3. **אופציונלי:**

   - mealsSinceLastReport
   - physicalActivitySinceLastReport
   - sleepHours
   - notes

4. **הגבלות:**
   - `sleepHours` - ניתן לדווח פעם אחת ביום בלבד
   - תסמינים: 0-10 בלבד
   - מדדים כלליים: 1-10 בלבד

---

#### דוגמה לאובייקט תקין:

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user1",
  "reportedAt": "2024-12-01T14:30:00.000Z",
  "bloating": 7,
  "constipation": 3,
  "pain": 5,
  "stoolFrequency": 2,
  "stoolQuality": "רכה",
  "appetite": 8,
  "stressLevel": 6,
  "waterCups": 6,
  "mealsSinceLastReport": "בוקר: שייק בננה עם שיבולת שועל, צהריים: עוף עם אורז וירקות מאודים",
  "physicalActivitySinceLastReport": "ריצה 30 דקות בבוקר",
  "sleepHours": 7,
  "sleepReportedToday": true,
  "notes": "היום הרגשתי טוב יותר מאתמול",
  "createdAt": "2024-12-01T14:30:00.000Z",
  "updatedAt": "2024-12-01T14:30:00.000Z"
}
```

---

#### דוגמה לדיווח מינימלי (רק שדות חובה):

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "userId": "user1",
  "reportedAt": "2024-12-01T08:00:00.000Z",
  "bloating": 3,
  "constipation": 2,
  "pain": 1,
  "stoolFrequency": 0,
  "appetite": 7,
  "stressLevel": 4,
  "waterCups": 4,
  "sleepReportedToday": false,
  "createdAt": "2024-12-01T08:00:00.000Z",
  "updatedAt": "2024-12-01T08:00:00.000Z"
}
```
