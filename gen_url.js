const { deflate } = require('zlib');

const code = `erDiagram
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
        int userId FK
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
    User ||--o| Settings : has
    User ||--o{ PlaySession : plays
    User ||--o{ UserModeStatus : tracks
    Mode ||--o{ PlaySession : categorizes
    Mode ||--o{ UserModeStatus : categorizes
    Mode ||--o{ Content : contains
    Symbol ||--o{ PlaySession : uses
    Symbol ||--o{ UserModeStatus : uses
    Symbol ||--o{ Content : contains
    Symbol ||--o{ SessionDetail : references
    Difficulty ||--o{ PlaySession : sets
    Difficulty ||--o{ UserModeStatus : sets
    Difficulty ||--o{ Content : contains
    PlaySession ||--o{ SessionDetail : records`;

const json = JSON.stringify({ code, mermaid: { theme: 'dark' } });

deflate(Buffer.from(json, 'utf-8'), { level: 9 }, (err, buffer) => {
    if (err) { console.error(err); return; }
    const encoded = buffer.toString('base64url');
    console.log(`https://mermaid.live/edit#pako:${encoded}`);
});
