-- Resume AI Database Schema
-- Run this once to set up the PostgreSQL database

CREATE DATABASE resume_ai;

\c resume_ai;

CREATE TABLE IF NOT EXISTS candidates (
    id        SERIAL PRIMARY KEY,
    name      VARCHAR(255) NOT NULL,
    filename  TEXT NOT NULL,
    skills    TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
