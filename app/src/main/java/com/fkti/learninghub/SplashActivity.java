package com.fkti.learninghub;

import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.appcompat.app.AppCompatActivity;

/**
 * Splash Screen Activity
 * Shows FKTI branding and transitions to main app
 */
public class SplashActivity extends AppCompatActivity {
    
    private static final int SPLASH_DURATION = 3000; // 3 seconds
    
    private ImageView logoImageView;
    private TextView titleTextView;
    private TextView subtitleTextView;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_splash);
        
        initializeViews();
        startAnimations();
        scheduleMainActivity();
    }
    
    private void initializeViews() {
        logoImageView = findViewById(R.id.logoImageView);
        titleTextView = findViewById(R.id.titleTextView);
        subtitleTextView = findViewById(R.id.subtitleTextView);
    }
    
    private void startAnimations() {
        // Logo fade in and scale animation
        Animation logoAnimation = AnimationUtils.loadAnimation(this, R.anim.logo_animation);
        logoImageView.startAnimation(logoAnimation);
        
        // Title slide in from top
        Animation titleAnimation = AnimationUtils.loadAnimation(this, R.anim.slide_in_top);
        titleTextView.startAnimation(titleAnimation);
        
        // Subtitle fade in with delay
        Animation subtitleAnimation = AnimationUtils.loadAnimation(this, R.anim.fade_in_delayed);
        subtitleTextView.startAnimation(subtitleAnimation);
    }
    
    private void scheduleMainActivity() {
        new Handler(Looper.getMainLooper()).postDelayed(() -> {
            Intent intent = new Intent(SplashActivity.this, MainActivity.class);
            startActivity(intent);
            
            // Add transition animation
            overridePendingTransition(R.anim.fade_in, R.anim.fade_out);
            
            // Close splash activity
            finish();
        }, SPLASH_DURATION);
    }
    
    @Override
    public void onBackPressed() {
        // Disable back button on splash screen
        // Do nothing
    }
}
