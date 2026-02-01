# GitHub Pages Setup – Downloadables & APK

This guide ensures your **downloadables** (CSV datasets, APK) work when the site is hosted on **GitHub Pages** (e.g. `https://<user>.github.io/<repo>/`).

---

## 1. How downloadables work on GitHub Pages

All download links on this site use **relative URLs** (e.g. `datasets/loan_approval_dataset.csv`, `apk/FK-Learning-Hub.apk`). That is correct for GitHub Pages:

- The browser resolves them relative to the **current page URL**.
- Example: on `https://user.github.io/Website/python_course/s13-dataviz.html`,  
  `datasets/loan_approval_dataset.csv` →  
  `https://user.github.io/Website/python_course/datasets/loan_approval_dataset.csv`.

**What you must do:**

- Commit and push **all** website files, including:
  - `data_science_course/datasets/*.csv`
  - `python_course/datasets/*.csv`
  - Any other files linked from the HTML (CSS, JS, images, etc.).
- Do **not** add these to `.gitignore` if you want them to be downloadable from the live site.

No code changes are required for CSV/download links to work on GitHub Pages.

---

## 2. APK file – options (GitHub 100 MB limit)

GitHub **rejects files over 100 MB**. APKs can be larger. Use one of these approaches.

### Option A: APK in the repo (if &lt; 100 MB)

- Put the built APK in: **`Website/apk/FK-Learning-Hub.apk`**
- Commit and push. The existing link will work:
  - `href="apk/FK-Learning-Hub.apk"` from `index.html` →  
    `https://<user>.github.io/<repo>/apk/FK-Learning-Hub.apk`

### Option B: GitHub Releases (recommended if APK &gt; 100 MB)

1. In your repo: **Releases** → **Create a new release** (e.g. tag `v1.0`).
2. Upload **`FK-Learning-Hub.apk`** as an asset.
3. Use the **asset URL** in the website, for example:
   - `https://github.com/<USER>/<REPO>/releases/download/v1.0/FK-Learning-Hub.apk`
4. Update **`index.html`** so the APK link points to that URL:

   ```html
   <a href="https://github.com/YOUR_USERNAME/YOUR_REPO/releases/latest/download/FK-Learning-Hub.apk"
      class="app-download-link" id="apkDownloadLink" download>
   ```

   (Use `releases/latest` or a specific tag like `releases/download/v1.0`.)

### Option C: External host

- Upload the APK to Google Drive, Dropbox, or another host.
- Replace the `href` of the APK link in `index.html` with that download URL.

---

## 3. Checklist before going live

- [ ] All CSV files under `data_science_course/datasets/` and `python_course/datasets/` are in the repo and pushed.
- [ ] APK: either in `Website/apk/` (if &lt; 100 MB) or linked from Releases/external host in `index.html`.
- [ ] GitHub Pages is enabled for the repo (Settings → Pages → source: main branch or gh-pages).
- [ ] Base URL: if the site is **not** at the repo root (e.g. `github.io/Website/`), internal links are already relative, so they will work as long as the repo structure matches the `Website/` folder.

---

## 4. Verifying downloadables

After publishing:

1. Open a course page (e.g. Data Science → any lesson with “Download dataset”).
2. Click the dataset link → the CSV should download or open.
3. Click “Get Free Android App” → the APK should download (or open the Releases page if you use Option B).

If something 404s, check that the file exists in the repo at the path implied by the URL (e.g. `python_course/datasets/loan_approval_dataset.csv`).

---

## 5. Android offline app (APK) and this repo

- The **APK** is built from the **Android_App** project. All website pages and downloadables (CSV datasets) are bundled into the app by the **sync script** so the app works 100% offline.
- To refresh what’s inside the APK after changing the website: from the **repo root** (parent of `Website/` and `Android_App/`), run:
  ```bash
  python3 sync_android_offline.py
  ```
  Then build the APK in Android Studio. The script copies every `*_course` folder (including `datasets/`) and adapts HTML for offline use (no CDN, in-app APK link replaced with “You’re using the offline app”).
