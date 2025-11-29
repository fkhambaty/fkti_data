#!/bin/bash

echo "🚀 DEPLOYING FKTI LEARNING HUB TO GITHUB PAGES"
echo "=============================================="
echo ""

# Navigate to the online hub directory
cd "/Users/fakhruddinkhambaty/Downloads/FKTI_Online_Hub"

echo "📁 Current directory: $(pwd)"
echo "📋 Files to deploy:"
ls -la

echo ""
echo "🔧 Initializing Git repository..."
git init

echo "📄 Adding all files..."
git add .

echo "💬 Creating initial commit..."
git commit -m "🎓 Initial deployment of FKTI Learning Hub

Features:
- Complete Python for Data Science course
- Apache Airflow mastery course  
- Interactive hub with course selection
- Mobile-responsive design
- Offline-capable learning platform
- Progress tracking system
- Quiz and assessment tools

Ready for GitHub Pages deployment!"

echo "🌐 Setting up remote repository..."
echo "⚠️  IMPORTANT: Make sure you've created the repository 'FKTI-Learning-Hub' on GitHub first!"
echo ""

# Set the main branch
git branch -M main

# Add your GitHub repository as remote
git remote add origin https://github.com/fkhambaty/FKTI-Learning-Hub.git

echo "📤 Pushing to GitHub..."
echo "📝 If prompted, enter your GitHub credentials"
git push -u origin main

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "🌐 Your FKTI Learning Hub will be available at:"
echo "   https://fkhambaty.github.io/FKTI-Learning-Hub/"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://github.com/fkhambaty/FKTI-Learning-Hub"
echo "2. Click Settings tab"
echo "3. Scroll to Pages section"
echo "4. Set Source to 'Deploy from a branch'"
echo "5. Choose 'main' branch and '/ (root)' folder"
echo "6. Click Save"
echo "7. Wait 5-10 minutes for deployment"
echo ""
echo "🎯 Then update your Android app URLs in Config.java!"
