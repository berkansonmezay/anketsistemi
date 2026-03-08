import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import sqlite3 from 'sqlite3';
import db from './db';

const app = express();
app.use(cors());
app.use(express.json());

// Create Survey
app.post('/api/surveys', (req, res) => {
    const { title, description, sections } = req.body;
    const surveyId = uuidv4();

    // Real implementation would use db transactions, this is a conceptual demo
    const stmt = db.prepare(`INSERT INTO Surveys (Id, Title, Description, Status, CreatedDate) VALUES (?, ?, ?, ?, datetime('now'))`);
    stmt.run(surveyId, title, description, true, (err: Error | null) => {
        if (err) return res.status(500).json({ error: err.message });

        // Insert Sections and Questions mock handling
        // For MVP, we just return success
        res.json({ id: surveyId, message: 'Survey created successfully' });
    });
    stmt.finalize();
});

// Get Survey for Anket Doldurma Sayfası
app.get('/api/surveys/:id', (req, res) => {
    db.get(`SELECT * FROM Surveys WHERE Id = ?`, [req.params.id], (err: Error | null, row: any) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Survey not found' });

        // Abstracted: Fetch questions from Questions table using survey mapping
        res.json({ survey: row });
    });
});

// Get all surveys for Dashboard
app.get('/api/surveys', (req, res) => {
    db.all(`SELECT * FROM Surveys ORDER BY CreatedDate DESC`, [], (err: Error | null, rows: any[]) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// --- Educators API ---

// Get all educators
app.get('/api/educators', (req, res) => {
    db.all(`SELECT * FROM Educators ORDER BY CreatedAt DESC`, [], (err: Error | null, rows: any[]) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Get single educator
app.get('/api/educators/:id', (req, res) => {
    db.get(`SELECT * FROM Educators WHERE Id = ?`, [req.params.id], (err: Error | null, row: any) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Educator not found' });
        res.json(row);
    });
});

// Create educator
app.post('/api/educators', (req, res) => {
    const { Name, Email, Phone, Branch } = req.body;
    const educatorId = uuidv4();

    // Validate inputs (basic)
    if (!Name || !Email) {
        return res.status(400).json({ error: 'Name and Email are required.' });
    }

    const stmt = db.prepare(`INSERT INTO Educators (Id, Name, Email, Phone, Branch) VALUES (?, ?, ?, ?, ?)`);
    stmt.run(educatorId, Name, Email, Phone || null, Branch || null, function (err: Error | null) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: educatorId, Name, Email, Phone, Branch, message: 'Educator created successfully' });
    });
    stmt.finalize();
});

// Update educator
app.put('/api/educators/:id', (req, res) => {
    const { id } = req.params;
    const { Name, Email, Phone, Branch } = req.body;

    const stmt = db.prepare(`UPDATE Educators SET Name = ?, Email = ?, Phone = ?, Branch = ? WHERE Id = ?`);
    stmt.run(Name, Email, Phone || null, Branch || null, id, function (this: sqlite3.RunResult, err: Error | null) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Educator not found' });
        res.json({ id, Name, Email, Phone, Branch, message: 'Educator updated successfully' });
    });
    stmt.finalize();
});

// Delete educator
app.delete('/api/educators/:id', (req, res) => {
    const { id } = req.params;

    const stmt = db.prepare(`DELETE FROM Educators WHERE Id = ?`);
    stmt.run(id, function (this: sqlite3.RunResult, err: Error | null) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Educator not found' });
        res.json({ message: 'Educator deleted successfully' });
    });
    stmt.finalize();
});

// --- Institutions API ---

// Get all institutions
app.get('/api/institutions', (req, res) => {
    db.all(`SELECT * FROM Institutions ORDER BY CreatedAt DESC`, [], (err: Error | null, rows: any[]) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Create institution
app.post('/api/institutions', (req, res) => {
    const { Name, Contact, Phone, Reference, Package, ProcessStatus, Notes } = req.body;
    const instId = uuidv4();

    if (!Name) {
        return res.status(400).json({ error: 'Name is required.' });
    }

    const stmt = db.prepare(`INSERT INTO Institutions (Id, Name, Contact, Phone, Reference, Package, ProcessStatus, Notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    stmt.run(instId, Name, Contact || null, Phone || null, Reference || null, Package || null, ProcessStatus || 'YENİ KURUM', Notes || null, function (err: Error | null) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: instId, Name, message: 'Institution created successfully' });
    });
    stmt.finalize();
});

// Update institution
app.put('/api/institutions/:id', (req, res) => {
    const { id } = req.params;
    const { Name, Contact, Phone, Reference, Package, ProcessStatus, Notes } = req.body;

    const stmt = db.prepare(`UPDATE Institutions SET Name = ?, Contact = ?, Phone = ?, Reference = ?, Package = ?, ProcessStatus = ?, Notes = ? WHERE Id = ?`);
    stmt.run(Name, Contact, Phone, Reference, Package, ProcessStatus, Notes, id, function (this: sqlite3.RunResult, err: Error | null) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Institution not found' });
        res.json({ id, Name, message: 'Institution updated successfully' });
    });
    stmt.finalize();
});

// Delete institution
app.delete('/api/institutions/:id', (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare(`DELETE FROM Institutions WHERE Id = ?`);
    stmt.run(id, function (this: sqlite3.RunResult, err: Error | null) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Institution not found' });
        res.json({ message: 'Institution deleted successfully' });
    });
    stmt.finalize();
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Backend server running on port ${PORT}`));
