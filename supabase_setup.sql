-- Korbo Beta 0.4 Datenbank
-- In Supabase öffnen:
-- SQL Editor -> New query -> diesen kompletten Code einfügen -> Run

create table if not exists public.recipe_votes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  recipe_name text not null,
  recipe_goal text not null,
  vote text not null check (vote in ('like', 'dislike')),
  reason text,
  budget numeric,
  people integer,
  days integer,
  diet text,
  max_time integer,
  markets text[],
  user_agent text
);

alter table public.recipe_votes enable row level security;

drop policy if exists "Allow public insert recipe votes" on public.recipe_votes;
create policy "Allow public insert recipe votes"
on public.recipe_votes
for insert
to anon
with check (true);

drop policy if exists "Allow public read recipe votes" on public.recipe_votes;
create policy "Allow public read recipe votes"
on public.recipe_votes
for select
to anon
using (true);

-- Auswertung:
-- select recipe_name, vote, count(*) from recipe_votes group by recipe_name, vote order by recipe_name;


-- Korbo 0.7 Hinweis:
-- Die Einkaufsliste V1 wird aktuell lokal im Browser gespeichert.
-- Eine Supabase-Synchronisierung kann später für Familienkonten ergänzt werden.


-- Korbo 0.8.1 Bewertungserweiterung
alter table public.recipe_votes add column if not exists stars integer check (stars between 1 and 5);
alter table public.recipe_votes add column if not exists comment text;
alter table public.recipe_votes add column if not exists photo_filename text;
alter table public.recipe_votes add column if not exists photo_pending boolean default false;

-- Auswertung Sterne:
-- select recipe_name, round(avg(stars)::numeric, 2) as avg_stars, count(*) as votes
-- from recipe_votes
-- where stars is not null
-- group by recipe_name
-- order by avg_stars desc, votes desc;

-- Hinweis Foto-Upload:
-- 0.8.1 bereitet die Oberfläche vor und speichert zunächst nur den Dateinamen/photo_pending.
-- Echte Bilddateien werden im nächsten Schritt über Supabase Storage gespeichert.
