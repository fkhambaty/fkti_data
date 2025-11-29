package com.fkti.learninghub;

import android.content.Intent;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ProgressBar;
import android.widget.Toast;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import com.google.android.material.floatingactionbutton.FloatingActionButton;

/**
 * Course Activity for individual Python/Airflow courses
 * Displays course content in WebView with enhanced mobile features
 */
public class CourseActivity extends AppCompatActivity {
    
    private WebView webView;
    private ProgressBar progressBar;
    private FloatingActionButton fabQuiz;
    private String courseType;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_course);
        
        // Get course type from intent
        courseType = getIntent().getStringExtra("course_type");
        if (courseType == null) {
            courseType = "python"; // Default to Python course
        }
        
        initializeViews();
        setupToolbar();
        setupWebView();
        setupFloatingActionButton();
        
        // Load the specific course page
        loadCoursePage();
    }
    
    private void initializeViews() {
        webView = findViewById(R.id.webView);
        progressBar = findViewById(R.id.progressBar);
        fabQuiz = findViewById(R.id.fabQuiz);
    }
    
    private void setupToolbar() {
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        
        if (getSupportActionBar() != null) {
            String title = courseType.equals("python") ? 
                "Python for Data Science" : "Apache Airflow Mastery";
            getSupportActionBar().setTitle(title);
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        }
    }
    
    private void setupWebView() {
        WebSettings webSettings = webView.getSettings();
        
        // Enable JavaScript and other web features
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        // Note: setLocalStorageEnabled() is deprecated and replaced by setDomStorageEnabled()
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setAllowFileAccessFromFileURLs(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);
        
        // Optimize for mobile learning
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        webSettings.setRenderPriority(WebSettings.RenderPriority.HIGH);
        // Note: setAppCacheEnabled() is deprecated in favor of Service Workers
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        webSettings.setSupportZoom(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        
        // Set user agent
        String userAgent = webSettings.getUserAgentString();
        webSettings.setUserAgentString(userAgent + " FKTILearningHub/1.0");
        
        // Add JavaScript interface for course-specific functionality
        webView.addJavascriptInterface(new CourseWebAppInterface(), "Android");
        
        // Setup WebViewClient
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // Handle navigation between courses
                if (url.contains("../index.html")) {
                    finish(); // Return to main hub
                    return true;
                } else if (url.contains("python_course") && !courseType.equals("python")) {
                    switchToCourse("python");
                    return true;
                } else if (url.contains("airflow_course") && !courseType.equals("airflow")) {
                    switchToCourse("airflow");
                    return true;
                }
                return false;
            }
            
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
                
                // Inject mobile-optimized CSS for courses
                injectCourseMobileCss();
                
                view.setVisibility(View.VISIBLE);
            }
        });
        
        // Setup WebChromeClient for progress tracking
        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    progressBar.setVisibility(View.VISIBLE);
                    progressBar.setProgress(newProgress);
                } else {
                    progressBar.setVisibility(View.GONE);
                }
            }
        });
    }
    
    private void setupFloatingActionButton() {
        fabQuiz.setOnClickListener(v -> {
            // Get current section from WebView and open quiz
            webView.loadUrl("javascript:Android.getCurrentSection(document.querySelector('.content-section.active').id || 'welcome')");
        });
    }
    
    private void loadCoursePage() {
        progressBar.setVisibility(View.VISIBLE);
        String url = "file:///android_asset/web/" + courseType + "_course/index.html";
        webView.loadUrl(url);
    }
    
    private void injectCourseMobileCss() {
        String courseMobileCSS = 
            "javascript:(function() {" +
            "var style = document.createElement('style');" +
            "style.innerHTML = '" +
            "body { font-size: 16px !important; padding: 0 !important; }" +
            ".container { padding: 0 15px !important; max-width: 100% !important; }" +
            ".nav-btn { min-height: 48px !important; font-size: 14px !important; margin: 2px !important; }" +
            ".lesson-card { margin: 15px 5px !important; padding: 15px !important; }" +
            ".code-example { font-size: 14px !important; }" +
            ".screenshot-placeholder { min-height: 120px !important; }" +
            ".definition-box { padding: 15px !important; margin: 10px 5px !important; }" +
            ".real-life-comparison { grid-template-columns: 1fr !important; }" +
            ".breakdown-row { grid-template-columns: 1fr !important; text-align: center !important; }" +
            ".morning-workflow { flex-direction: column !important; }" +
            ".parallel-tasks { flex-direction: column !important; }" +
            ".usage-examples { grid-template-columns: 1fr !important; }" +
            ".pipeline-step { flex-direction: column !important; text-align: center !important; }" +
            ".hero-container { padding: 15px 10px !important; }" +
            ".nav-section { margin-bottom: 10px !important; }" +
            "';" +
            "document.head.appendChild(style);" +
            "})()";
        
        webView.loadUrl(courseMobileCSS);
    }
    
    private void switchToCourse(String newCourseType) {
        Intent intent = new Intent(this, CourseActivity.class);
        intent.putExtra("course_type", newCourseType);
        startActivity(intent);
        finish();
    }
    
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.course_menu, menu);
        return true;
    }
    
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        
        if (id == android.R.id.home) {
            finish(); // Return to hub
            return true;
        } else if (id == R.id.action_refresh) {
            webView.reload();
            return true;
        } else if (id == R.id.action_quiz) {
            webView.loadUrl("javascript:Android.getCurrentSection('welcome')");
            return true;
        } else if (id == R.id.action_progress) {
            Intent intent = new Intent(this, ProgressActivity.class);
            intent.putExtra("course_type", courseType);
            startActivity(intent);
            return true;
        } else if (id == R.id.action_switch_course) {
            String otherCourse = courseType.equals("python") ? "airflow" : "python";
            switchToCourse(otherCourse);
            return true;
        }
        
        return super.onOptionsItemSelected(item);
    }
    
    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
    
    /**
     * JavaScript Interface for course-specific functionality
     */
    public class CourseWebAppInterface {
        
        @JavascriptInterface
        public void openQuiz(String sectionId) {
            runOnUiThread(() -> {
                Intent intent = new Intent(CourseActivity.this, QuizActivity.class);
                intent.putExtra("course_type", courseType);
                intent.putExtra("section_id", sectionId);
                startActivity(intent);
            });
        }
        
        @JavascriptInterface
        public void getCurrentSection(String sectionId) {
            runOnUiThread(() -> {
                Intent intent = new Intent(CourseActivity.this, QuizActivity.class);
                intent.putExtra("course_type", courseType);
                intent.putExtra("section_id", sectionId);
                startActivity(intent);
            });
        }
        
        @JavascriptInterface
        public void showToast(String message) {
            runOnUiThread(() -> 
                Toast.makeText(CourseActivity.this, message, Toast.LENGTH_SHORT).show()
            );
        }
        
        @JavascriptInterface
        public void shareProgress(String progressData) {
            runOnUiThread(() -> {
                Intent shareIntent = new Intent(Intent.ACTION_SEND);
                shareIntent.setType("text/plain");
                shareIntent.putExtra(Intent.EXTRA_SUBJECT, 
                    "My " + (courseType.equals("python") ? "Python" : "Airflow") + " Learning Progress");
                shareIntent.putExtra(Intent.EXTRA_TEXT, progressData);
                startActivity(Intent.createChooser(shareIntent, "Share Progress"));
            });
        }
        
        @JavascriptInterface
        public void vibrate(int duration) {
            // Provide haptic feedback for interactions
            // Implementation would require vibrator service
        }
        
        @JavascriptInterface
        public void returnToHub() {
            runOnUiThread(() -> finish());
        }
    }
}
