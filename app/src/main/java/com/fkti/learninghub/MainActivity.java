package com.fkti.learninghub;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import java.io.InputStream;
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
 * Main Activity for FKTI Learning Hub
 * Displays the learning hub homepage with course selection
 */
public class MainActivity extends AppCompatActivity {
    
    private WebView webView;
    private ProgressBar progressBar;
    private FloatingActionButton fabProgress;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        
        initializeViews();
        setupToolbar();
        setupWebView();
        setupFloatingActionButton();
        
        // Load the main hub page
        loadHubPage();
    }
    
    private void initializeViews() {
        webView = findViewById(R.id.webView);
        progressBar = findViewById(R.id.progressBar);
        fabProgress = findViewById(R.id.fabProgress);
    }
    
    private void setupToolbar() {
        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        
        if (getSupportActionBar() != null) {
            getSupportActionBar().setTitle("FKTI Learning Hub");
            getSupportActionBar().setDisplayHomeAsUpEnabled(false);
        }
    }
    
    private void setupWebView() {
        WebSettings webSettings = webView.getSettings();
        
        // Enable JavaScript and other web features
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        
        // File access settings for Android 16 compatibility
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setAllowFileAccessFromFileURLs(true);
        webSettings.setAllowUniversalAccessFromFileURLs(true);
        
        // Performance and compatibility settings
        webSettings.setCacheMode(WebSettings.LOAD_DEFAULT);
        webSettings.setRenderPriority(WebSettings.RenderPriority.HIGH);
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        
        // Enable debugging for troubleshooting
        if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.KITKAT) {
            WebView.setWebContentsDebuggingEnabled(true);
        }
        
        // Android 16 specific settings
        webSettings.setJavaScriptCanOpenWindowsAutomatically(true);
        webSettings.setLoadsImagesAutomatically(true);
        webSettings.setBlockNetworkImage(false);
        webSettings.setBlockNetworkLoads(false);
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        webSettings.setSupportZoom(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        
        // Set user agent to indicate mobile app
        String userAgent = webSettings.getUserAgentString();
        webSettings.setUserAgentString(userAgent + " FKTILearningHub/1.0");
        
        // Add JavaScript interface for native communication
        webView.addJavascriptInterface(new WebAppInterface(), "Android");
        
        // Initial setup - full WebViewClient will be set after successful load
        setupWebViewClient();
        
        // Load the hub page
        loadHubPage();
    }
    
    private void setupWebViewClient() {
        // Setup WebViewClient to handle page navigation
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.contains("python_course")) {
                    openCourse("python");
                    return true;
                } else if (url.contains("airflow_course")) {
                    openCourse("airflow");
                    return true;
                }
                return false;
            }
            
            @Override
            public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                progressBar.setVisibility(View.VISIBLE);
                Log.d("FKTI_WebView", "PAGE STARTED: " + url);
                Log.d("FKTI_WebView", "Device: " + android.os.Build.MODEL + ", Android: " + android.os.Build.VERSION.RELEASE);
            }
            
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                progressBar.setVisibility(View.GONE);
                Log.d("FKTI_WebView", "PAGE FINISHED: " + url);
                
                // Check if page actually loaded content
                view.evaluateJavascript(
                    "document.body ? document.body.innerHTML.length : 0", 
                    result -> {
                        Log.d("FKTI_WebView", "Page content length: " + result);
                        if ("0".equals(result)) {
                            Log.e("FKTI_WebView", "Page loaded but has no content!");
                            showErrorPage();
                        }
                    }
                );
                
                // Inject mobile-optimized CSS
                injectMobileCss();
                
                // Hide loading and show content
                view.setVisibility(View.VISIBLE);
            }
            
            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                progressBar.setVisibility(View.GONE);
                Log.e("FKTI_WebView", "ERROR: Code=" + errorCode + ", Description=" + description + ", URL=" + failingUrl);
                
                // Show detailed error for Samsung Galaxy debugging
                String deviceInfo = "Device: " + android.os.Build.MODEL + 
                                  ", Android: " + android.os.Build.VERSION.RELEASE + 
                                  ", WebView: " + view.getSettings().getUserAgentString();
                Log.e("FKTI_WebView", "Device Info: " + deviceInfo);
                
                runOnUiThread(() -> {
                    Toast.makeText(MainActivity.this, 
                        "WebView Error " + errorCode + ": " + description + 
                        "\nTrying alternative loading...", 
                        Toast.LENGTH_LONG).show();
                });
                
                // Try alternative loading method
                loadHubPageAlternative();
            }
            
            @Override
            public void onReceivedHttpError(WebView view, android.webkit.WebResourceRequest request, 
                                          android.webkit.WebResourceResponse errorResponse) {
                super.onReceivedHttpError(view, request, errorResponse);
                Log.e("FKTI_WebView", "HTTP ERROR: " + errorResponse.getStatusCode() + 
                      " for " + request.getUrl());
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
        fabProgress.setOnClickListener(v -> {
            Intent intent = new Intent(MainActivity.this, ProgressActivity.class);
            startActivity(intent);
        });
    }
    
    private void loadHubPage() {
        progressBar.setVisibility(View.VISIBLE);
        Log.d("FKTI_WebView", "Starting to load hub page...");
        
        // Load URLs from configuration
        String[] urlsToTry = Config.getAllUrls();
        loadUrlWithFallbacks(urlsToTry, 0);
    }
    
    private void loadUrlWithFallbacks(String[] urls, int currentIndex) {
        if (currentIndex >= urls.length) {
            Log.e("FKTI_WebView", "All URLs failed - showing error page");
            showErrorPage();
            return;
        }
        
        String url = urls[currentIndex];
        Log.d("FKTI_WebView", "Trying URL " + (currentIndex + 1) + ": " + url);
        
        // Set timeout for each URL attempt
        Handler timeoutHandler = new Handler();
        Runnable timeoutRunnable = new Runnable() {
            @Override
            public void run() {
                Log.e("FKTI_WebView", "Timeout for URL: " + url);
                loadUrlWithFallbacks(urls, currentIndex + 1);
            }
        };
        
        timeoutHandler.postDelayed(timeoutRunnable, 15000); // 15 second timeout per URL
        
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String finishedUrl) {
                super.onPageFinished(view, finishedUrl);
                timeoutHandler.removeCallbacks(timeoutRunnable);
                progressBar.setVisibility(View.GONE);
                Log.d("FKTI_WebView", "Successfully loaded: " + finishedUrl);
                
                // Restore full WebViewClient after successful load
                setupWebViewClient();
            }
            
            @Override
            public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
                super.onReceivedError(view, errorCode, description, failingUrl);
                timeoutHandler.removeCallbacks(timeoutRunnable);
                Log.e("FKTI_WebView", "Error loading " + failingUrl + ": " + description);
                loadUrlWithFallbacks(urls, currentIndex + 1);
            }
        });
        
        try {
            webView.loadUrl(url);
        } catch (Exception e) {
            Log.e("FKTI_WebView", "Exception loading " + url + ": " + e.getMessage());
            timeoutHandler.removeCallbacks(timeoutRunnable);
            loadUrlWithFallbacks(urls, currentIndex + 1);
        }
    }
    
    private void loadHubPageAlternative() {
        Log.d("FKTI_WebView", "Trying alternative loading method...");
        
        try {
            // Read HTML content and load as data URL
            InputStream inputStream = getAssets().open("web/index.html");
            byte[] buffer = new byte[inputStream.available()];
            inputStream.read(buffer);
            inputStream.close();
            
            String htmlContent = new String(buffer);
            Log.d("FKTI_WebView", "HTML content length: " + htmlContent.length());
            
            // Load as data URL with proper base URL
            String baseUrl = "file:///android_asset/web/";
            webView.loadDataWithBaseURL(baseUrl, htmlContent, "text/html", "UTF-8", null);
            
        } catch (Exception e) {
            Log.e("FKTI_WebView", "Alternative loading failed: " + e.getMessage());
            showErrorPage();
        }
    }
    
    private void showErrorPage() {
        String errorHtml = 
            "<!DOCTYPE html>" +
            "<html><head><meta charset='UTF-8'><title>FKTI Learning Hub</title>" +
            "<style>body{font-family:Arial,sans-serif;text-align:center;padding:40px;background:#f5f5f5;}" +
            "h1{color:#2196F3;}button{background:#2196F3;color:white;border:none;padding:12px 24px;border-radius:6px;font-size:16px;cursor:pointer;margin:10px;}</style></head>" +
            "<body><h1>🎓 FKTI Learning Hub</h1>" +
            "<p>Welcome to your offline learning platform!</p>" +
            "<button onclick='loadPython()'>🐍 Python Course</button><br>" +
            "<button onclick='loadAirflow()'>🔄 Airflow Course</button>" +
            "<script>function loadPython(){Android.openCourse('python');}" +
            "function loadAirflow(){Android.openCourse('airflow');}</script></body></html>";
            
        webView.loadDataWithBaseURL("file:///android_asset/web/", errorHtml, "text/html", "UTF-8", null);
    }
    
    private void injectMobileCss() {
        String mobileCSS = 
            "javascript:(function() {" +
            "var meta = document.createElement('meta');" +
            "meta.name = 'viewport';" +
            "meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';" +
            "document.getElementsByTagName('head')[0].appendChild(meta);" +
            "var style = document.createElement('style');" +
            "style.innerHTML = '" +
            "body { font-size: 16px !important; }" +
            ".nav-btn { min-height: 44px !important; font-size: 14px !important; }" +
            ".course-card { margin: 10px 5px !important; }" +
            ".hero-container { padding: 20px 10px !important; }" +
            ".screenshot-placeholder { min-height: 150px !important; }" +
            "';" +
            "document.head.appendChild(style);" +
            "})()";
        
        webView.loadUrl(mobileCSS);
    }
    
    private void openCourse(String courseType) {
        Intent intent = new Intent(this, CourseActivity.class);
        intent.putExtra("course_type", courseType);
        startActivity(intent);
    }
    
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.main_menu, menu);
        return true;
    }
    
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();
        
        if (id == R.id.action_refresh) {
            webView.reload();
            return true;
        } else if (id == R.id.action_progress) {
            Intent intent = new Intent(this, ProgressActivity.class);
            startActivity(intent);
            return true;
        } else if (id == R.id.action_about) {
            showAboutDialog();
            return true;
        }
        
        return super.onOptionsItemSelected(item);
    }
    
    private void showAboutDialog() {
        Toast.makeText(this, "FKTI Learning Hub v1.0\nFakhruddin Khambaty Training Institute", 
                      Toast.LENGTH_LONG).show();
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
     * JavaScript Interface for communication between WebView and Android
     */
    public class WebAppInterface {
        
        @JavascriptInterface
        public void openCourse(String courseType) {
            runOnUiThread(() -> MainActivity.this.openCourse(courseType));
        }
        
        @JavascriptInterface
        public void openQuiz(String courseType, String quizId) {
            runOnUiThread(() -> {
                Intent intent = new Intent(MainActivity.this, QuizActivity.class);
                intent.putExtra("course_type", courseType);
                intent.putExtra("quiz_id", quizId);
                startActivity(intent);
            });
        }
        
        @JavascriptInterface
        public void showToast(String message) {
            runOnUiThread(() -> 
                Toast.makeText(MainActivity.this, message, Toast.LENGTH_SHORT).show()
            );
        }
        
        @JavascriptInterface
        public void shareProgress(String progressData) {
            runOnUiThread(() -> {
                Intent shareIntent = new Intent(Intent.ACTION_SEND);
                shareIntent.setType("text/plain");
                shareIntent.putExtra(Intent.EXTRA_SUBJECT, "My FKTI Learning Progress");
                shareIntent.putExtra(Intent.EXTRA_TEXT, progressData);
                startActivity(Intent.createChooser(shareIntent, "Share Progress"));
            });
        }
        
        @JavascriptInterface
        public String getDeviceInfo() {
            return "Android " + android.os.Build.VERSION.RELEASE + 
                   ", Model: " + android.os.Build.MODEL;
        }
    }
}
