# Progress Tracking (Supabase)

## Table

Run in Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  last_lesson_id TEXT,
  last_lesson_label TEXT,
  last_visited_at TIMESTAMPTZ DEFAULT now(),
  completed_lesson_ids TEXT[] DEFAULT '{}',
  progress_pct INT DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, course_id)
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress"
  ON public.user_progress FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.user_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.user_progress FOR UPDATE USING (auth.uid() = user_id);
```

## Usage

- **Record page**: On any course/lesson page, add to `<body>` the attributes `data-course-id`, `data-lesson-id`, and optionally `data-lesson-label`, then include `progress.js` and this script so progress is recorded when the user is logged in:
  ```html
  <body data-course-id="python" data-lesson-id="s6-functions1" data-lesson-label="Session 6: Functions">
  ...
  <script src="../js/progress.js"></script>
  <script>(function(){var b=document.body;var c=b.getAttribute('data-course-id');var l=b.getAttribute('data-lesson-id');var t=b.getAttribute('data-lesson-label');if(c&&window.FKTI_Progress)FKTI_Progress.recordPage(c,l,t);})();</script>
  ```
- **Profile**: The profile page already calls `FKTI_Progress.getProgress()` to show "Continue learning" with links and progress %.
- **Mark complete**: Call `FKTI_Progress.markComplete(courseId, lessonId, totalLessons)` when a lesson is completed (e.g. on a "Mark complete" button).
