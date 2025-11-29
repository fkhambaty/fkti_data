#!/bin/bash

echo "🔍 FKTI APK Finder"
echo "=================="
echo ""

APK_DIR="/Users/fakhruddinkhambaty/Downloads/FKTI_Android_App/app/build/outputs/apk/debug"
APK_FILE="$APK_DIR/app-debug.apk"

if [ -f "$APK_FILE" ]; then
    echo "🎉 APK FOUND!"
    echo "📱 Opening APK location in Finder..."
    open "$APK_DIR"
    echo ""
    echo "✅ Your FKTI Learning Hub APK is ready!"
    echo "📦 File: app-debug.apk"
    echo "📊 Size: $(du -h "$APK_FILE" | cut -f1)"
    echo ""
    echo "📲 Next: Transfer this APK to your Android phone"
    echo "📖 See: INSTALL_APK_GUIDE.md for installation steps"
else
    echo "❌ APK not found yet."
    echo ""
    echo "📁 I'll open the project folder for you..."
    open "/Users/fakhruddinkhambaty/Downloads/FKTI_Android_App"
    echo ""
    echo "🔨 To build your APK:"
    echo "1. Open Android Studio (if not open already)"
    echo "2. Open the FKTI_Android_App folder"
    echo "3. Build → Build Bundle(s) / APK(s) → Build APK(s)"
    echo "4. Run this script again to find your APK"
fi

echo ""
echo "📚 Available guides:"
echo "• BUILD_APK_GUIDE.md - How to build"
echo "• INSTALL_APK_GUIDE.md - How to install on phone"
