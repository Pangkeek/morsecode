# ER Diagram - MorseCode System

## Entity Relationship Diagram (Mermaid)

```mermaid
erDiagram
    %% ==================== ENTITIES ====================

    User {
        int id PK
        string username UK
        string email UK
        string password
        datetime createdAt
        int totalPlay
        int rank
        float avgWpm
        float avgAccuracy
        string role
    }

    Settings {
        int id PK
        int userId FK, UK
        string theme
        int soundVolume
        boolean showHints
    }

    Mode {
        int id PK
        string name UK
    }

    Symbol {
        int id PK
        string name UK
    }

    Difficulty {
        int id PK
        string name UK
        int amtWord
    }

    PlaySession {
        int id PK
        int userId FK
        int modeId FK
        int difficultyId FK
        int symbolId FK
        float wpm
        float accuracy
        int mistakeCount
        int timeTaken
        datetime createdAt
    }

    SessionDetail {
        int id PK
        int sessionId FK
        int symbolId FK
        string question
        string userAnswer
        string correctAnswer
        boolean isCorrect
        int responseTime
        int orderIndex
    }

    UserModeStatus {
        int id PK
        int userId FK
        int modeId FK
        int difficultyId FK
        int symbolId FK
        float highWpm
        float highAccuracy
        float totalScore
        int mistakeCount
        int time
        int realTime
        datetime updatedAt
    }

    Content {
        int id PK
        int modeId FK
        int difficultyId FK
        int symbolId FK
        string content
    }

    %% ==================== RELATIONSHIPS ====================

    User ||--o| Settings : "has"
    User ||--o{ PlaySession : "plays"
    User ||--o{ UserModeStatus : "tracks"

    Mode ||--o{ PlaySession : "categorizes"
    Mode ||--o{ UserModeStatus : "categorizes"
    Mode ||--o{ Content : "contains"

    Symbol ||--o{ PlaySession : "uses"
    Symbol ||--o{ UserModeStatus : "uses"
    Symbol ||--o{ Content : "contains"
    Symbol ||--o{ SessionDetail : "references"

    Difficulty ||--o{ PlaySession : "sets"
    Difficulty ||--o{ UserModeStatus : "sets"
    Difficulty ||--o{ Content : "contains"

    PlaySession ||--o{ SessionDetail : "records"
```

## Relationship Summary

| Relationship | Type | Description |
|---|---|---|
| User - Settings | 1:1 | ผู้ใช้แต่ละคนมีการตั้งค่าหนึ่งชุด |
| User - PlaySession | 1:N | ผู้ใช้หนึ่งคนเล่นได้หลาย Session |
| User - UserModeStatus | 1:N | ผู้ใช้หนึ่งคนมีสถิติหลายรายการ (ตาม mode/difficulty/symbol) |
| Mode - PlaySession | 1:N | โหมดหนึ่งมีหลาย Session |
| Mode - UserModeStatus | 1:N | โหมดหนึ่งมีสถิติหลายรายการ |
| Mode - Content | 1:N | โหมดหนึ่งมีเนื้อหาหลายรายการ |
| Symbol - PlaySession | 1:N | สัญลักษณ์หนึ่งถูกใช้ในหลาย Session |
| Symbol - SessionDetail | 1:N | สัญลักษณ์หนึ่งถูกอ้างอิงในหลายรายละเอียด |
| Symbol - UserModeStatus | 1:N | สัญลักษณ์หนึ่งมีสถิติหลายรายการ |
| Symbol - Content | 1:N | สัญลักษณ์หนึ่งมีเนื้อหาหลายรายการ |
| Difficulty - PlaySession | 1:N | ระดับความยากหนึ่งมีหลาย Session |
| Difficulty - UserModeStatus | 1:N | ระดับความยากหนึ่งมีสถิติหลายรายการ |
| Difficulty - Content | 1:N | ระดับความยากหนึ่งมีเนื้อหาหลายรายการ |
| PlaySession - SessionDetail | 1:N | Session หนึ่งมีรายละเอียดหลายข้อ |

## Unique Constraints

- **UserModeStatus**: `(userId, modeId, difficultyId, symbolId)` - สถิติเฉพาะตัวต่อ combination
- **Content**: `(modeId, difficultyId, symbolId)` - เนื้อหาเฉพาะตัวต่อ combination
- **Settings**: `userId` - ผู้ใช้หนึ่งคนมีแค่หนึ่งการตั้งค่า

## Cascade Delete Rules

- `User` ถูกลบ → `Settings`, `PlaySession`, `UserModeStatus` ถูกลบตาม
- `PlaySession` ถูกลบ → `SessionDetail` ถูกลบตาม
