# GitHub Pages Setup – Downloadables & APK

**Repo:** [https://github.com/fkhambaty/fkti_data](https://github.com/fkhambaty/fkti_data)  
**Live site (after enabling Pages):** [https://fkhambaty.github.io/fkti_data/](https://fkhambaty.github.io/fkti_data/)

This guide ensures your **downloadables** (CSV datasets, APK) work when the site is hosted on GitHub Pages. In **fkti_data**, the site is at the **repo root** (no `Website/` folder on GitHub).

---

## 1. How downloadables work on GitHub Pages

All download links on this site use **relative URLs** (e.g. `datasets/loan_approval_dataset.csv`, `apk/FK-Learning-Hub.apk`). That is correct for GitHub Pages:

- The browser resolves them relative to the **current page URL**.
- Example: on `https://fkhambaty.github.io/fkti_data/python_course/s13-dataviz.html`,  
  `datasets/loan_approval_dataset.csv` →  
  `https://fkhambaty.github.io/fkti_data/python_course/datasets/loan_approval_dataset.csv`.

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

### Option A: APK in the repo (if &lt; 100 MB) — **current setup**

- Put the built APK in: **`apk/FK-Learning-Hub.apk`** (repo root = site root in fkti_data).
- Commit and push. The existing link will work:
  - `href="apk/FK-Learning-Hub.apk"` from `index.html` →  
    **https://fkhambaty.github.io/fkti_data/apk/FK-Learning-Hub.apk**

### Option B: GitHub Releases (if APK &gt; 100 MB)

1. In [fkti_data](https://github.com/fkhambaty/fkti_data): **Releases** → **Create a new release** (e.g. tag `v1.0`).
2. Upload **`FK-Learning-Hub.apk`** as an asset.
3. Direct download URL:  
   **https://github.com/fkhambaty/fkti_data/releases/download/v1.0/FK-Learning-Hub.apk**  
   (or use `latest` instead of `v1.0` for the latest release.)
4. Update **`index.html`** so the APK link uses that URL:

   ```html
   <a href="https://github.com/fkhambaty/fkti_data/releases/latest/download/FK-Learning-Hub.apk"
      class="app-download-link" id="apkDownloadLink" download>
   ```

### Option C: External host

- Upload the APK to Google Drive, Dropbox, or another host.
- Replace the `href` of the APK link in `index.html` with that download URL.

---

## 3. Checklist before going live

- [ ] All CSV files under `data_science_course/datasets/` and `python_course/datasets/` are in the repo and pushed.
- [ ] APK: either in `apk/FK-Learning-Hub.apk` (if &lt; 100 MB) or linked from [Releases](https://github.com/fkhambaty/fkti_data/releases) in `index.html`.
- [ ] GitHub Pages is enabled (see **What to do next** below).

---

## 4. Verifying downloadables

After publishing:

1. Open a course page (e.g. Data Science → any lesson with “Download dataset”).
2. Click the dataset link → the CSV should download or open.
3. Click “Get Free Android App” → the APK should download (or open the Releases page if you use Option B).

If something 404s, check that the file exists in the repo at the path implied by the URL (e.g. `python_course/datasets/loan_approval_dataset.csv`).

---

## 5. Android offline app (APK) and this repo

- The **APK** is built from the **Android_App** project (separate from fkti_data). All website pages and downloadables (CSV datasets) are bundled into the app by the **sync script** so the app works 100% offline.
- To refresh what’s inside the APK after changing the website: from the **local FKTI folder** (parent of `Website/` and `Android_App/`), run `python3 sync_android_offline.py`, then build the APK in Android Studio. The script copies every `*_course` folder (including `datasets/`) and adapts HTML for offline use.

---

## What to do next (enable GitHub Pages)

1. **Open the repo:** [https://github.com/fkhambaty/fkti_data](https://github.com/fkhambaty/fkti_data)
2. **Settings** → **Pages** (left sidebar).
3. Under **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `main` (or `master`) — **Folder:** `/ (root)`
4. Click **Save**. Wait 1–2 minutes.
5. **Your site will be live at:** [https://fkhambaty.github.io/fkti_data/](https://fkhambaty.github.io/fkti_data/)
6. **Check:** Open the site, click a course, then a “Download dataset” link and “Get Free Android App” to confirm CSVs and APK download.
