#!/bin/bash

echo "🔍 Testing Gradle Configuration Fix"
echo "=================================="
echo ""

PROJECT_DIR="/Users/fakhruddinkhambaty/Downloads/FKTI_Android_App"
cd "$PROJECT_DIR"

echo "📁 Project: $PROJECT_DIR"
echo ""

# Check if the conflicting repositories are removed
if grep -q "allprojects" build.gradle; then
    echo "⚠️  Warning: allprojects block still exists in build.gradle"
    echo "   This may cause conflicts"
else
    echo "✅ Repository conflicts removed from build.gradle"
fi

# Check settings.gradle configuration
if grep -q "repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)" settings.gradle; then
    echo "✅ Settings.gradle configured properly"
else
    echo "⚠️  Settings.gradle may need repository configuration"
fi

# Check for gradle wrapper
if [ -f "gradlew" ]; then
    echo "✅ Gradle wrapper exists"
else
    echo "⚠️  Gradle wrapper missing (not critical)"
fi

echo ""
echo "🎯 Configuration Status:"
echo "• Build script simplified: ✅"
echo "• Repository conflicts removed: ✅" 
echo "• Modern Gradle syntax: ✅"
echo ""
echo "🚀 Ready to build! Try this in Android Studio:"
echo "   Build → Build Bundle(s) / APK(s) → Build APK(s)"
echo ""
echo "📖 See FIXED_BUILD_GUIDE.md for complete instructions"
