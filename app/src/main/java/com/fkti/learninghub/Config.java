package com.fkti.learninghub;

/**
 * Configuration class for FKTI Learning Hub URLs
 * 
 * UPDATE THESE URLS AFTER DEPLOYING TO GITHUB PAGES OR OTHER HOSTING
 */
public class Config {
    
    /**
     * Primary URL - Your GitHub Pages deployment
     * Format: https://YOUR_GITHUB_USERNAME.github.io/FKTI-Learning-Hub/
     */
    public static final String PRIMARY_URL = "https://fkhambaty.github.io/FKTI-Learning-Hub/";
    
    /**
     * Backup URL - Alternative hosting (Netlify, Vercel, etc.)
     * Leave empty if not using backup hosting
     */
    public static final String BACKUP_URL = "https://fkti-learning-hub.netlify.app/";
    
    /**
     * Local fallback URL - For offline/development mode
     * This loads content from app assets as last resort
     */
    public static final String LOCAL_URL = "file:///android_asset/web/index.html";
    
    /**
     * Get all URLs in order of preference
     * @return Array of URLs to try in sequence
     */
    public static String[] getAllUrls() {
        return new String[]{
            PRIMARY_URL,
            BACKUP_URL,
            LOCAL_URL
        };
    }
    
    /**
     * Timeout settings
     */
    public static final int URL_TIMEOUT_SECONDS = 15;  // Timeout per URL attempt
    public static final int TOTAL_TIMEOUT_SECONDS = 45; // Total timeout for all attempts
    
    /**
     * Debug settings
     */
    public static final boolean ENABLE_DEBUG_LOGGING = true;
    public static final String LOG_TAG = "FKTI_WebView";
}
