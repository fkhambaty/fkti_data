#!/bin/bash

echo "🔍 CHECKING FOR APK FILE..."
echo "=========================="

APK_PATH="/Users/fakhruddinkhambaty/Downloads/FKTI_Android_App/app/build/outputs/apk/debug/app-debug.apk"

if [ -f "$APK_PATH" ]; then
    echo ""
    echo "🎉 SUCCESS! APK FOUND!"
    echo "📱 Location: $APK_PATH"
    echo ""
    echo "📊 APK Details:"
    ls -lh "$APK_PATH"
    
    # Get file size in MB
    SIZE=$(du -h "$APK_PATH" | cut -f1)
    echo "📦 Size: $SIZE"
    echo ""
    echo "✅ Your FKTI Learning Hub app is ready!"
    echo ""
    echo "📲 Next Steps:"
    echo "1. Copy this APK to your Android phone"
    echo "2. On your phone: Settings → Security → Enable 'Unknown Sources'"
    echo "3. Tap the APK file to install"
    echo "4. Look for 'FKTI Learning Hub' in your apps"
    echo ""
else
    echo ""
    echo "❌ APK NOT FOUND"
    echo ""
    echo "🔨 Please build it first using Android Studio:"
    echo "1. Open Android Studio"
    echo "2. Open project: /Users/fakhruddinkhambaty/Downloads/FKTI_Android_App"
    echo "3. Build → Build Bundle(s) / APK(s) → Build APK(s)"
    echo "4. Wait for completion"
    echo "5. Run this script again"
    echo ""
fi
