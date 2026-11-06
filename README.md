# Guided Reading Research

Build a web-based research study application that replicates Experiment 3 from Liu et al. (COLM 2026), testing the impact of AI assistance on reading comprehension performance and persistence. The app should be built with React, Tailwind CSS, and Lucide icons, and connect directly to a Supabase database and the Google Gemini API.

### 1. Data Architecture & Supabase Integration

Create a Supabase integration configuration module. Include a setup instructions banner or modal in the UI if environment variables are missing.

The app must interact with two tables:

- `participants`: Columns include `id` (uuid, primary key), `name` (text, user-entered display name), `group_type` ('control' or 'ai_assisted'), and `created_at` (timestamp).

- `test_results`: Columns include `id` (uuid, primary key), `participant_id` (uuid, foreign key referencing participants), `test_type` ('pretest', 'learning', or 'test'), `problem_index` (integer), `score` (numeric: 1 for correct, 0 for incorrect/skipped), `time_taken_seconds` (integer), `is_skipped` (boolean), and `created_at` (timestamp).

### 2. User Flow & Screens

- **Welcome / Registration Screen**: 

  - Welcomes users to the reading comprehension study.

  - Asks the user to enter their **Name** (required, but no account creation, passwords, or complex registration required).

  - A "Start Study" button that inserts a new row into the `participants` table (randomly assigning them 50/50 to either 'control' or 'ai_assisted' group using permuted block assignment) and transitions to the experiment.

- **Phase Flow**:

  1. **Pretest Phase**: Exactly 1 baseline reading comprehension question (with two contrasting texts and a multiple-choice question about author responses). No AI or sidebar help available.

  2. **Learning Phase**: 5 reading comprehension problems. 

     - If assigned to 'ai_assisted': Display an interactive AI chat sidebar on the right powered by the **Google Gemini API** (using `gemini-1.5-flash` or similar free-tier model). It must open with the automated greeting: "Hi! I'm here to help you with this reading comprehension question. I can see the text and the question. Feel free to ask anything!" and feed the current problem's text, question, and options into the Gemini context so participants can ask free-text queries.

     - If assigned to 'control': Display a static sidebar titled "Reading Comprehension Tips" containing tips (Read the Question First, Context is Key, Eliminate Wrong Answers).

  3. **Test Phase (Unassisted)**: 3 final reading comprehension problems. The sidebars (AI chat or tips panel) are completely removed without warning.

- **Completion Screen**: Displays a thank-you message indicating all responses have been successfully saved to Supabase.

### 3. Core Mechanics & Instrumentation

- **Timer & Behavioral Tracking**: Track exact time spent per question. Implement the study's rule: if a user submits an answer in under 5 seconds, flag it automatically as a skip (`is_skipped = true`) because reading the texts in that timeframe is impossible.

- **Interactive Controls**: Each question screen must present the two short texts, a four-option multiple-choice question (A, B, C, D), a submit button, and an explicit **"Skip"** button. 

- **Auto-Grading & Logging**: Upon clicking Submit or Skip, compute the score (1 if correct, 0 if incorrect or skipped), record `time_taken_seconds`, and immediately upsert/insert the row into the `test_results` table in Supabase.

- **Progress Bar**: Show clean step indicators across phases (e.g., Pretest -> Learning [1/5] -> Test [2/3]).

### 4. UI/UX Design Guidelines

- Clean, academic, distraction-free minimalist layout (similar to a clean survey platform or cognitive test interface like Gorilla.sc or Qualtrics).

- Split-screen layout for reading tasks: Text/passages on the left/top half, question and options on the bottom, and the Gemini-powered AI Assistant or Tips sidebar cleanly docked on the right side during the learning phase.

- Fully responsive, smooth transitions between phases, and clear error handling if Supabase or Gemini API connections fail.

---

## Setup

Requires Node.js 20+ (or Bun).

### 1. Supabase (database)

1. Create a project at [supabase.com](https://supabase.com).
2. Open **SQL Editor**, paste the contents of `supabase/migrations/20260101000000_init_study_schema.sql`, and run it. This creates `participants`, `test_results`, `randomization_slots`, the `register_participant()` function (permuted-block assignment) and the row-level-security policies.
   - Or with the Supabase CLI: `supabase link --project-ref <ref>` then `supabase db push`.
3. In **Project Settings -> API**, copy the Project URL and the publishable (anon) key.

### 2. Gemini (AI assistant)

Create a free key in [Google AI Studio](https://aistudio.google.com/apikey).

### 3. Environment variables

```sh
cp .env.example .env
```

Fill in `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` and `GEMINI_API_KEY`. `GEMINI_API_KEY` is server-only; set it in your hosting provider's environment settings too when you deploy. Optionally set `GEMINI_MODEL` (default `gemini-3.8-flash`).

### 4. Run

```sh
npm i        # or: bun install
npm run dev
```

Reading the results: in the Supabase dashboard's Table Editor (or via the `service_role` key), since the browser can write but not read study data.
