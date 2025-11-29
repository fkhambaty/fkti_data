#!/bin/bash

echo "🎯 FKTI APK BUILD READINESS CHECK"
echo "================================"
echo ""

PROJECT_DIR="/Users/fakhruddinkhambaty/Downloads/FKTI_Android_App"
cd "$PROJECT_DIR"

echo "📁 Project: FKTI Learning Hub Android App"
echo "📍 Location: $PROJECT_DIR"
echo ""

# Check 1: Gradle Configuration
echo "🔧 GRADLE CONFIGURATION:"
if ! grep -q "allprojects" build.gradle; then
    echo "✅ No repository conflicts in build.gradle"
else
    echo "⚠️  Repository conflicts still exist"
fi

# Check 2: Resource Conflicts
echo ""
echo "📱 RESOURCE CONFLICTS:"
PNG_ICONS=$(find app/src/main/res -name "ic_launcher*.png" | wc -l)
XML_ICONS=$(find app/src/main/res -name "ic_launcher*.xml" | wc -l)

if [ $PNG_ICONS -eq 0 ]; then
    echo "✅ No conflicting PNG launcher icons"
else
    echo "⚠️  Found $PNG_ICONS PNG icons that may conflict"
fi

if [ $XML_ICONS -gt 0 ]; then
    echo "✅ XML adaptive icons present ($XML_ICONS files)"
else
    echo "⚠️  No XML launcher icons found"
fi

# Check 3: Required Files
echo ""
echo "📄 REQUIRED FILES:"

REQUIRED_FILES=(
    "app/build.gradle"
    "app/src/main/AndroidManifest.xml"
    "app/src/main/java/com/fkti/learninghub/MainActivity.java"
    "app/src/main/res/values/strings.xml"
    "app/src/main/res/values/colors.xml"
    "app/src/main/res/layout/activity_main.xml"
)

for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (MISSING)"
    fi
done

# Check 4: Web Content
echo ""
echo "🌐 WEB CONTENT:"
if [ -d "app/src/main/assets/web" ]; then
    WEB_SIZE=$(du -sh app/src/main/assets/web | cut -f1)
    echo "✅ Web content embedded ($WEB_SIZE)"
    
    if [ -f "app/src/main/assets/web/index.html" ]; then
        echo "✅ Hub homepage present"
    fi
    
    if [ -d "app/src/main/assets/web/python_course" ]; then
        echo "✅ Python course present"
    fi
    
    if [ -d "app/src/main/assets/web/airflow_course" ]; then
        echo "✅ Airflow course present"
    fi
else
    echo "❌ Web content missing"
fi

echo ""
echo "🎯 BUILD READINESS SUMMARY:"
echo "=========================="

# Overall status
if [ $PNG_ICONS -eq 0 ] && [ $XML_ICONS -gt 0 ] && [ -f "app/build.gradle" ]; then
    echo "🎉 READY TO BUILD!"
    echo ""
    echo "🚀 Next steps:"
    echo "1. Open Android Studio"
    echo "2. Open this project folder"
    echo "3. Build → Build Bundle(s) / APK(s) → Build APK(s)"
    echo "4. Wait for successful build"
    echo "5. Install APK on Android device"
    echo ""
    echo "📱 Expected APK: app/build/outputs/apk/debug/app-debug.apk"
else
    echo "⚠️  Issues found - check the details above"
fi
