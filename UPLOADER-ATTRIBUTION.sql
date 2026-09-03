-- OUR LITTLE ARCHIVE: uploader attribution
-- Run this once in Supabase SQL Editor.

ALTER TABLE public.memories
ADD COLUMN IF NOT EXISTS uploaded_by text;

-- Backfill memories that already exist.
UPDATE public.memories AS m
SET uploaded_by = CASE
    WHEN lower(u.email) = 'vallejosvanessa59@gmail.com' THEN 'Kayla'
    WHEN lower(u.email) = 'villaryezchia@gmail.com' THEN 'Yezchia'
    ELSE m.uploaded_by
END
FROM auth.users AS u
WHERE m.user_id = u.id
  AND lower(u.email) IN (
      'vallejosvanessa59@gmail.com',
      'villaryezchia@gmail.com'
  );

-- Optional check after running the migration:
-- SELECT id, user_id, uploaded_by, title, type, memory_date
-- FROM public.memories
-- ORDER BY created_at DESC;
