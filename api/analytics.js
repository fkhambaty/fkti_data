// FKTI Analytics API - Central Storage
// Deploy this to Vercel, Netlify, or any serverless platform
// This stores analytics data centrally so it works across all devices

// For Vercel: Save this as api/analytics.js
// For Netlify: Save this as netlify/functions/analytics.js

// Simple in-memory storage (for demo - use a database in production)
let analyticsData = {
    totalVisits: 0,
    uniqueVisitors: [],
    pageViews: 0,
    dailyStats: {},
    recentVisits: [],
    courseCounts: {}
};

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'POST') {
        try {
            const { analytics } = req.body;
            
            if (analytics) {
                // Merge with existing data
                analyticsData = {
                    totalVisits: Math.max(analyticsData.totalVisits, analytics.totalVisits || 0),
                    pageViews: Math.max(analyticsData.pageViews, analytics.pageViews || 0),
                    uniqueVisitors: [...new Set([...analyticsData.uniqueVisitors, ...(analytics.uniqueVisitors || [])])],
                    dailyStats: { ...analyticsData.dailyStats, ...(analytics.dailyStats || {}) },
                    recentVisits: [...(analytics.recentVisits || []), ...analyticsData.recentVisits].slice(0, 20),
                    courseCounts: { ...analyticsData.courseCounts, ...(analytics.courseCounts || {}) }
                };
                
                // In production, save to database (Firebase, Supabase, MongoDB, etc.)
                // For now, this is in-memory (will reset on server restart)
                
                return res.status(200).json({ success: true, message: 'Analytics saved' });
            }
            
            return res.status(400).json({ error: 'No analytics data provided' });
        } catch (error) {
            console.error('Error saving analytics:', error);
            return res.status(500).json({ error: 'Failed to save analytics' });
        }
    }

    if (req.method === 'GET') {
        try {
            return res.status(200).json({ 
                success: true, 
                analytics: analyticsData 
            });
        } catch (error) {
            console.error('Error loading analytics:', error);
            return res.status(500).json({ error: 'Failed to load analytics' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}

// For Node.js/Express (if not using serverless):
/*
const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/analytics', handler);
app.get('/api/analytics', handler);

app.listen(3000, () => console.log('Analytics API running on port 3000'));
*/


