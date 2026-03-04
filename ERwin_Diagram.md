# ERwin Diagram - MorseCode System (Physical Data Model)

## Physical Database Schema - PostgreSQL

ERwin-style Physical Data Model แสดง Table, Column, Data Type, Constraints, และ Foreign Keys ทั้งหมด

---

## ERwin Notation Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    MorseCode - Physical Data Model (ERwin Style)                               │
└─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘


 ┌──────────────────────────────┐          ┌──────────────────────────────┐
 │           User               │          │          Settings            │
 ├──────────────────────────────┤          ├──────────────────────────────┤
 │ *PK  id         INTEGER      │──── 1:1 ─│ *PK  id         INTEGER      │
 │      username   VARCHAR  UQ  │          │ *FK  userId     INTEGER  UQ  │
 │      email      VARCHAR  UQ  │          │      theme      VARCHAR      │
 │      password   VARCHAR      │          │      soundVolume INTEGER     │
 │      createdAt  TIMESTAMP    │          │      showHints  BOOLEAN      │
 │      totalPlay  INTEGER      │          └──────────────────────────────┘
 │      rank       INTEGER      │
 │      avgWpm     FLOAT        │
 │      avgAccuracy FLOAT       │
 │      role       VARCHAR      │
 └──────────┬───────────────────┘
            │
            │ 1:N                                1:N                           1:N
            │                    ┌─────────────────────────────┐  ┌──────────────────────────────┐
            │                    │           Mode              │  │          Symbol               │
            │                    ├─────────────────────────────┤  ├──────────────────────────────┤
            │                    │ *PK  id     INTEGER         │  │ *PK  id     INTEGER          │
            │                    │      name   VARCHAR  UQ     │  │      name   VARCHAR  UQ      │
            │                    └──────────┬──────────────────┘  └──────────┬───────────────────┘
            │                               │                                │
            │                               │ 1:N                            │ 1:N
            │                               │                                │
            │    ┌──────────────────────────────────┐                        │
            │    │         Difficulty                │                        │
            │    ├──────────────────────────────────┤                        │
            │    │ *PK  id       INTEGER             │                        │
            │    │      name     VARCHAR  UQ         │                        │
            │    │      amtWord  INTEGER              │                        │
            │    └──────────┬───────────────────────┘                        │
            │               │                                                │
            │               │ 1:N                                            │
            ▼               ▼                          ▼                     ▼
 ┌──────────────────────────────────────────────────────────────────────────────┐
 │                              PlaySession                                     │
 ├──────────────────────────────────────────────────────────────────────────────┤
 │ *PK  id            INTEGER                                                   │
 │ *FK  userId        INTEGER  → User.id         ON DELETE CASCADE              │
 │ *FK  modeId        INTEGER  → Mode.id                                        │
 │ *FK  difficultyId  INTEGER  → Difficulty.id                                  │
 │ *FK  symbolId      INTEGER  → Symbol.id                                      │
 │      wpm           FLOAT                                                     │
 │      accuracy      FLOAT                                                     │
 │      mistakeCount  INTEGER                                                   │
 │      timeTaken     INTEGER                                                   │
 │      createdAt     TIMESTAMP                                                 │
 └──────────────────────────────┬───────────────────────────────────────────────┘
                                │
                                │ 1:N
                                ▼
 ┌──────────────────────────────────────────────────────────────────────────────┐
 │                             SessionDetail                                    │
 ├──────────────────────────────────────────────────────────────────────────────┤
 │ *PK  id            INTEGER                                                   │
 │ *FK  sessionId     INTEGER  → PlaySession.id  ON DELETE CASCADE              │
 │ *FK  symbolId      INTEGER  → Symbol.id                                      │
 │      question      VARCHAR                                                   │
 │      userAnswer    VARCHAR                                                   │
 │      correctAnswer VARCHAR                                                   │
 │      isCorrect     BOOLEAN                                                   │
 │      responseTime  INTEGER                                                   │
 │      orderIndex    INTEGER                                                   │
 └──────────────────────────────────────────────────────────────────────────────┘


  User.id ──┐
  Mode.id ──┤
  Diff.id ──┤─── 1:N ──▶
  Symb.id ──┘
 ┌──────────────────────────────────────────────────────────────────────────────┐
 │                            UserModeStatus                                    │
 ├──────────────────────────────────────────────────────────────────────────────┤
 │ *PK  id            INTEGER                                                   │
 │ *FK  userId        INTEGER  → User.id         ON DELETE CASCADE              │
 │ *FK  modeId        INTEGER  → Mode.id                                        │
 │ *FK  difficultyId  INTEGER  → Difficulty.id                                  │
 │ *FK  symbolId      INTEGER  → Symbol.id                                      │
 │      highWpm       FLOAT                                                     │
 │      highAccuracy  FLOAT                                                     │
 │      totalScore    FLOAT                                                     │
 │      mistakeCount  INTEGER                                                   │
 │      time          INTEGER                                                   │
 │      realTime      INTEGER                                                   │
 │      updatedAt     TIMESTAMP                                                 │
 ├──────────────────────────────────────────────────────────────────────────────┤
 │ UQ (userId, modeId, difficultyId, symbolId)                                  │
 └──────────────────────────────────────────────────────────────────────────────┘


  Mode.id ──┐
  Diff.id ──┤─── 1:N ──▶
  Symb.id ──┘
 ┌──────────────────────────────────────────────────────────────────────────────┐
 │                              Content                                         │
 ├──────────────────────────────────────────────────────────────────────────────┤
 │ *PK  id            INTEGER                                                   │
 │ *FK  modeId        INTEGER  → Mode.id                                        │
 │ *FK  difficultyId  INTEGER  → Difficulty.id                                  │
 │ *FK  symbolId      INTEGER  → Symbol.id                                      │
 │      content       VARCHAR                                                   │
 ├──────────────────────────────────────────────────────────────────────────────┤
 │ UQ (modeId, difficultyId, symbolId)                                          │
 └──────────────────────────────────────────────────────────────────────────────┘
```

---

## Physical Table Specifications

### Table: `User`
| Column | Data Type | Constraints | Default | Description |
|--------|-----------|-------------|---------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | - | รหัสผู้ใช้ |
| username | VARCHAR(255) | NOT NULL, UNIQUE | - | ชื่อผู้ใช้ |
| email | VARCHAR(255) | NOT NULL, UNIQUE | - | อีเมล |
| password | VARCHAR(255) | NOT NULL | - | รหัสผ่าน (bcrypt hashed) |
| createdAt | TIMESTAMP | NOT NULL | now() | วันที่สร้างบัญชี |
| totalPlay | INTEGER | NOT NULL | 0 | จำนวนเกมที่เล่นทั้งหมด |
| rank | INTEGER | NOT NULL | 0 | อันดับผู้ใช้ |
| avgWpm | DOUBLE PRECISION | NOT NULL | 0 | คะแนนเฉลี่ย WPM |
| avgAccuracy | DOUBLE PRECISION | NOT NULL | 0 | ความแม่นยำเฉลี่ย (%) |
| role | VARCHAR(255) | NOT NULL | "USER" | บทบาท (USER / ADMIN) |

### Table: `Settings`
| Column | Data Type | Constraints | Default | Description |
|--------|-----------|-------------|---------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | - | รหัสการตั้งค่า |
| userId | INTEGER | FK, NOT NULL, UNIQUE | - | รหัสผู้ใช้ (อ้างอิง User.id) |
| theme | VARCHAR(255) | NOT NULL | "dark" | ธีม (dark / light) |
| soundVolume | INTEGER | NOT NULL | 50 | ระดับเสียง (0-100) |
| showHints | BOOLEAN | NOT NULL | true | แสดงคำใบ้ |

### Table: `Mode`
| Column | Data Type | Constraints | Default | Description |
|--------|-----------|-------------|---------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | - | รหัสโหมด |
| name | VARCHAR(255) | NOT NULL, UNIQUE | - | ชื่อโหมด (encode / decode) |

### Table: `Symbol`
| Column | Data Type | Constraints | Default | Description |
|--------|-----------|-------------|---------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | - | รหัสสัญลักษณ์ |
| name | VARCHAR(255) | NOT NULL, UNIQUE | - | ชื่อสัญลักษณ์ (a-z / word) |

### Table: `Difficulty`
| Column | Data Type | Constraints | Default | Description |
|--------|-----------|-------------|---------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | - | รหัสระดับความยาก |
| name | VARCHAR(255) | NOT NULL, UNIQUE | - | ชื่อระดับ (easy / medium / hard / expert) |
| amtWord | INTEGER | NOT NULL | 10 | จำนวนคำต่อรอบ |

### Table: `PlaySession`
| Column | Data Type | Constraints | Default | Description |
|--------|-----------|-------------|---------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | - | รหัส Session |
| userId | INTEGER | FK, NOT NULL | - | รหัสผู้ใช้ → User.id (CASCADE) |
| modeId | INTEGER | FK, NOT NULL | - | รหัสโหมด → Mode.id |
| difficultyId | INTEGER | FK, NOT NULL | - | รหัสระดับ → Difficulty.id |
| symbolId | INTEGER | FK, NOT NULL | - | รหัสสัญลักษณ์ → Symbol.id |
| wpm | DOUBLE PRECISION | NOT NULL | - | คำต่อนาที |
| accuracy | DOUBLE PRECISION | NOT NULL | - | ความแม่นยำ (%) |
| mistakeCount | INTEGER | NOT NULL | 0 | จำนวนผิด |
| timeTaken | INTEGER | NOT NULL | 0 | เวลาที่ใช้ (วินาที) |
| createdAt | TIMESTAMP | NOT NULL | now() | วันที่เล่น |

### Table: `SessionDetail`
| Column | Data Type | Constraints | Default | Description |
|--------|-----------|-------------|---------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | - | รหัสรายละเอียด |
| sessionId | INTEGER | FK, NOT NULL | - | รหัส Session → PlaySession.id (CASCADE) |
| symbolId | INTEGER | FK, NOT NULL | - | รหัสสัญลักษณ์ → Symbol.id |
| question | VARCHAR(255) | NOT NULL | - | คำถามที่แสดง |
| userAnswer | VARCHAR(255) | NOT NULL | - | คำตอบของผู้ใช้ |
| correctAnswer | VARCHAR(255) | NOT NULL | - | คำตอบที่ถูกต้อง |
| isCorrect | BOOLEAN | NOT NULL | - | ตอบถูกหรือไม่ |
| responseTime | INTEGER | NOT NULL | 0 | เวลาตอบ (มิลลิวินาที) |
| orderIndex | INTEGER | NOT NULL | 0 | ลำดับคำถาม |

### Table: `UserModeStatus`
| Column | Data Type | Constraints | Default | Description |
|--------|-----------|-------------|---------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | - | รหัสสถิติ |
| userId | INTEGER | FK, NOT NULL | - | รหัสผู้ใช้ → User.id (CASCADE) |
| modeId | INTEGER | FK, NOT NULL | - | รหัสโหมด → Mode.id |
| difficultyId | INTEGER | FK, NOT NULL | - | รหัสระดับ → Difficulty.id |
| symbolId | INTEGER | FK, NOT NULL | - | รหัสสัญลักษณ์ → Symbol.id |
| highWpm | DOUBLE PRECISION | NOT NULL | 0 | WPM สูงสุด |
| highAccuracy | DOUBLE PRECISION | NOT NULL | 0 | ความแม่นยำสูงสุด (%) |
| totalScore | DOUBLE PRECISION | NOT NULL | 0 | คะแนนรวม |
| mistakeCount | INTEGER | NOT NULL | 0 | จำนวนผิดสะสม |
| time | INTEGER | NOT NULL | 0 | เวลารวม (วินาที) |
| realTime | INTEGER | NOT NULL | 0 | เวลาจริง (วินาที) |
| updatedAt | TIMESTAMP | NOT NULL | auto | อัปเดตล่าสุด |

**UNIQUE CONSTRAINT:** `(userId, modeId, difficultyId, symbolId)`

### Table: `Content`
| Column | Data Type | Constraints | Default | Description |
|--------|-----------|-------------|---------|-------------|
| id | INTEGER | PK, AUTO_INCREMENT | - | รหัสเนื้อหา |
| modeId | INTEGER | FK, NOT NULL | - | รหัสโหมด → Mode.id |
| difficultyId | INTEGER | FK, NOT NULL | - | รหัสระดับ → Difficulty.id |
| symbolId | INTEGER | FK, NOT NULL | - | รหัสสัญลักษณ์ → Symbol.id |
| content | TEXT | NOT NULL | - | เนื้อหาเกม |

**UNIQUE CONSTRAINT:** `(modeId, difficultyId, symbolId)`

---

## Foreign Key Reference Map

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      FOREIGN KEY RELATIONSHIPS                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  Settings.userId ──────────────────► User.id          (CASCADE DELETE)   │
│                                                                          │
│  PlaySession.userId ───────────────► User.id          (CASCADE DELETE)   │
│  PlaySession.modeId ───────────────► Mode.id          (RESTRICT)        │
│  PlaySession.difficultyId ─────────► Difficulty.id    (RESTRICT)        │
│  PlaySession.symbolId ─────────────► Symbol.id        (RESTRICT)        │
│                                                                          │
│  SessionDetail.sessionId ──────────► PlaySession.id   (CASCADE DELETE)   │
│  SessionDetail.symbolId ───────────► Symbol.id        (RESTRICT)        │
│                                                                          │
│  UserModeStatus.userId ────────────► User.id          (CASCADE DELETE)   │
│  UserModeStatus.modeId ────────────► Mode.id          (RESTRICT)        │
│  UserModeStatus.difficultyId ──────► Difficulty.id    (RESTRICT)        │
│  UserModeStatus.symbolId ──────────► Symbol.id        (RESTRICT)        │
│                                                                          │
│  Content.modeId ───────────────────► Mode.id          (RESTRICT)        │
│  Content.difficultyId ─────────────► Difficulty.id    (RESTRICT)        │
│  Content.symbolId ─────────────────► Symbol.id        (RESTRICT)        │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Index Summary

| Table | Index Type | Columns | Name |
|-------|-----------|---------|------|
| User | PRIMARY KEY | id | User_pkey |
| User | UNIQUE | username | User_username_key |
| User | UNIQUE | email | User_email_key |
| Settings | PRIMARY KEY | id | Settings_pkey |
| Settings | UNIQUE | userId | Settings_userId_key |
| Mode | PRIMARY KEY | id | Mode_pkey |
| Mode | UNIQUE | name | Mode_name_key |
| Symbol | PRIMARY KEY | id | Symbol_pkey |
| Symbol | UNIQUE | name | Symbol_name_key |
| Difficulty | PRIMARY KEY | id | Difficulty_pkey |
| Difficulty | UNIQUE | name | Difficulty_name_key |
| PlaySession | PRIMARY KEY | id | PlaySession_pkey |
| SessionDetail | PRIMARY KEY | id | SessionDetail_pkey |
| UserModeStatus | PRIMARY KEY | id | UserModeStatus_pkey |
| UserModeStatus | UNIQUE | (userId, modeId, difficultyId, symbolId) | UserModeStatus_userId_modeId_difficultyId_symbolId_key |
| Content | PRIMARY KEY | id | Content_pkey |
| Content | UNIQUE | (modeId, difficultyId, symbolId) | Content_modeId_difficultyId_symbolId_key |

---

## Cardinality Summary

| Parent | Child | Cardinality | Relationship |
|--------|-------|-------------|-------------|
| User | Settings | 1 : 0..1 | Optional one-to-one |
| User | PlaySession | 1 : 0..N | One-to-many |
| User | UserModeStatus | 1 : 0..N | One-to-many |
| Mode | PlaySession | 1 : 0..N | One-to-many |
| Mode | UserModeStatus | 1 : 0..N | One-to-many |
| Mode | Content | 1 : 0..N | One-to-many |
| Symbol | PlaySession | 1 : 0..N | One-to-many |
| Symbol | SessionDetail | 1 : 0..N | One-to-many |
| Symbol | UserModeStatus | 1 : 0..N | One-to-many |
| Symbol | Content | 1 : 0..N | One-to-many |
| Difficulty | PlaySession | 1 : 0..N | One-to-many |
| Difficulty | UserModeStatus | 1 : 0..N | One-to-many |
| Difficulty | Content | 1 : 0..N | One-to-many |
| PlaySession | SessionDetail | 1 : 0..N | One-to-many |
