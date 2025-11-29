#!/bin/bash

echo "🚀 FKTI Learning Hub - APK Builder"
echo "=================================="
echo ""

# Set project directory
PROJECT_DIR="/Users/fakhruddinkhambaty/Downloads/FKTI_Android_App"
cd "$PROJECT_DIR"

echo "📁 Working in: $PROJECT_DIR"
echo ""

# Check if Android Studio exists
if [ -d "/Applications/Android Studio.app" ]; then
    echo "✅ Android Studio found!"
    
    # Try to find gradle in Android Studio
    AS_GRADLE="/Applications/Android Studio.app/Contents/gradle/gradle-*/bin/gradle"
    if ls $AS_GRADLE 1> /dev/null 2>&1; then
        echo "✅ Using Android Studio's Gradle"
        GRADLE_CMD=$(ls $AS_GRADLE | head -1)
    fi
else
    echo "❌ Android Studio not found"
fi

# Check for system gradle
if command -v gradle &> /dev/null; then
    echo "✅ System Gradle found"
    GRADLE_CMD="gradle"
fi

# Try to build
if [ ! -z "$GRADLE_CMD" ]; then
    echo ""
    echo "🔨 Building APK..."
    echo "This may take 2-5 minutes..."
    echo ""
    
    # Clean and build
    $GRADLE_CMD clean
    $GRADLE_CMD assembleDebug
    
    # Check if APK was created
    APK_PATH="app/build/outputs/apk/debug/app-debug.apk"
    if [ -f "$APK_PATH" ]; then
        echo ""
        echo "🎉 SUCCESS! APK built successfully!"
        echo "📱 APK Location: $PROJECT_DIR/$APK_PATH"
        echo ""
        echo "📊 APK Details:"
        ls -lh "$APK_PATH"
        echo ""
        echo "📋 Next Steps:"
        echo "1. Copy APK to your Android device"
        echo "2. Enable 'Unknown Sources' in device settings"
        echo "3. Tap the APK to install"
        echo ""
    else
        echo ""
        echo "❌ Build failed or APK not found"
        echo "💡 Try using Android Studio instead:"
        echo "   1. Open Android Studio"
        echo "   2. Open this project folder"
        echo "   3. Build → Build Bundle(s) / APK(s) → Build APK(s)"
        echo ""
    fi
else
    echo ""
    echo "⚠️  No Gradle found. Please use Android Studio:"
    echo ""
    echo "🎯 ANDROID STUDIO METHOD:"
    echo "1. Open Android Studio"
    echo "2. Click 'Open' and select this folder:"
    echo "   $PROJECT_DIR"
    echo "3. Wait for Gradle sync to complete"
    echo "4. Go to: Build → Build Bundle(s) / APK(s) → Build APK(s)"
    echo "5. Wait for build (1-3 minutes)"
    echo "6. Click 'locate' in the success notification"
    echo ""
fi

echo "📖 For detailed instructions, see: BUILD_APK_GUIDE.md"
