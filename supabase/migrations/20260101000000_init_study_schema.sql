-- Guided Reading Research: full schema for a fresh Supabase project.
-- Run once in Supabase Dashboard -> SQL Editor, or with `supabase db push`.
-- (Consolidates the former drizzle migrations 0000-0002.)

-- Participants (no direct browser access; created through register_participant()).
CREATE TABLE public.participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  group_type text NOT NULL CHECK (group_type IN ('control','ai_assisted')),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.participants TO service_role;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

-- Test results (browser may insert, never read).
CREATE TABLE public.test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id uuid NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  test_type text NOT NULL CHECK (test_type IN ('pretest','learning','test')),
  problem_index integer NOT NULL CHECK (problem_index >= 0),
  problem_id text CHECK (problem_id IS NULL OR char_length(problem_id) BETWEEN 1 AND 40),
  score numeric NOT NULL CHECK (score IN (0,1)),
  time_taken_seconds integer NOT NULL CHECK (time_taken_seconds >= 0),
  is_skipped boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (participant_id, test_type, problem_index)
);
COMMENT ON COLUMN public.test_results.problem_index IS 'Position in which the problem was shown within its phase (0-based).';
COMMENT ON COLUMN public.test_results.problem_id IS 'Which problem was shown (e.g. main-3); main-phase order is randomized per participant.';
CREATE INDEX test_results_participant_idx ON public.test_results(participant_id);
GRANT INSERT ON public.test_results TO anon, authenticated;
GRANT ALL ON public.test_results TO service_role;
ALTER TABLE public.test_results ENABLE ROW LEVEL SECURITY;

-- anon cannot select participants, so the insert policy checks through a security-definer function.
CREATE OR REPLACE FUNCTION public.participant_exists(_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.participants WHERE id = _id);
$$;
REVOKE ALL ON FUNCTION public.participant_exists(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.participant_exists(uuid) TO anon, authenticated;

CREATE POLICY "Anyone can log results for an existing participant"
  ON public.test_results FOR INSERT TO anon, authenticated
  WITH CHECK (public.participant_exists(participant_id));

-- Permuted block randomization schedule (block size 4: 2 control + 2 ai_assisted).
CREATE TABLE public.randomization_slots (
  slot integer PRIMARY KEY,
  group_type text NOT NULL CHECK (group_type IN ('control','ai_assisted')),
  participant_id uuid REFERENCES public.participants(id) ON DELETE SET NULL
);
GRANT ALL ON public.randomization_slots TO service_role;
ALTER TABLE public.randomization_slots ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.register_participant(_name text)
RETURNS TABLE (participant_id uuid, group_type text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_name text := btrim(coalesce(_name, ''));
  v_slot integer;
  v_group text;
  v_id uuid;
  v_next integer;
BEGIN
  IF char_length(v_name) < 1 OR char_length(v_name) > 100 THEN
    RAISE EXCEPTION 'Name must be between 1 and 100 characters';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext('register_participant'));

  SELECT s.slot, s.group_type INTO v_slot, v_group
  FROM public.randomization_slots s
  WHERE s.participant_id IS NULL
  ORDER BY s.slot
  LIMIT 1;

  IF v_slot IS NULL THEN
    SELECT coalesce(max(s.slot), 0) INTO v_next FROM public.randomization_slots s;
    INSERT INTO public.randomization_slots (slot, group_type)
    SELECT v_next + row_number() OVER (ORDER BY random()), g
    FROM unnest(ARRAY['control','control','ai_assisted','ai_assisted']) AS g;

    SELECT s.slot, s.group_type INTO v_slot, v_group
    FROM public.randomization_slots s
    WHERE s.participant_id IS NULL
    ORDER BY s.slot
    LIMIT 1;
  END IF;

  INSERT INTO public.participants (name, group_type)
  VALUES (v_name, v_group)
  RETURNING id INTO v_id;

  UPDATE public.randomization_slots SET participant_id = v_id WHERE slot = v_slot;

  RETURN QUERY SELECT v_id, v_group;
END;
$$;

REVOKE ALL ON FUNCTION public.register_participant(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.register_participant(text) TO anon, authenticated;
