import sqlite3 from 'sqlite3';
import path from 'path';

// Create and connect to SQLite DB
const dbPath = path.resolve(__dirname, 'survey.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening db', err.message);
    } else {
        // Create Tables matching schema structure from the prompt
        db.serialize(() => {
            // 1. Surveys Table
            db.run(`CREATE TABLE IF NOT EXISTS Surveys (
        Id TEXT PRIMARY KEY,
        Title TEXT,
        Description TEXT,
        Status BOOLEAN,
        CreatedDate DATETIME
      )`);

            // 2. Survey Sections
            db.run(`CREATE TABLE IF NOT EXISTS SurveySections (
        Id TEXT PRIMARY KEY,
        SurveyId TEXT,
        Title TEXT,
        Description TEXT,
        FOREIGN KEY(SurveyId) REFERENCES Surveys(Id)
      )`);

            // 3. Questions
            db.run(`CREATE TABLE IF NOT EXISTS Questions (
        Id TEXT PRIMARY KEY,
        SurveyId TEXT,
        SectionId TEXT,
        QuestionText TEXT,
        QuestionType TEXT,
        Required BOOLEAN,
        Options TEXT, -- JSON serialization representing array
        FOREIGN KEY(SurveyId) REFERENCES Surveys(Id),
        FOREIGN KEY(SectionId) REFERENCES SurveySections(Id)
      )`);

            // 4. Participants
            db.run(`CREATE TABLE IF NOT EXISTS Participants (
        Id TEXT PRIMARY KEY,
        IpAddress TEXT,
        SessionId TEXT,
        SubmittedAt DATETIME
      )`);

            // 5. Answers
            db.run(`CREATE TABLE IF NOT EXISTS Answers (
        Id TEXT PRIMARY KEY,
        QuestionId TEXT,
        ParticipantId TEXT,
        AnswerText TEXT,
        FOREIGN KEY(QuestionId) REFERENCES Questions(Id),
        FOREIGN KEY(ParticipantId) REFERENCES Participants(Id)
      )`);

            // 6. Educators
            db.run(`CREATE TABLE IF NOT EXISTS Educators (
        Id TEXT PRIMARY KEY,
        Name TEXT,
        Email TEXT,
        Phone TEXT,
        Branch TEXT,
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

            // 7. Institutions
            db.run(`CREATE TABLE IF NOT EXISTS Institutions (
        Id TEXT PRIMARY KEY,
        Name TEXT,
        Contact TEXT,
        Phone TEXT,
        Reference TEXT,
        Package TEXT,
        ProcessStatus TEXT,
        Notes TEXT,
        CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )`);

            console.log('Database initialized successfully with schema matching spec.');
        });
    }
});

export default db;
