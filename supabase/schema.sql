-- =====================================================================
--  VAELOR SITES : base commune des sites clients autogeres
--  Projet Supabase : vaelor-sites (mumqsvwiiqynhhxluade)
--  Une ligne par site. Les donnees du site vivent dans une colonne jsonb.
--  Lecture publique (le site affiche les donnees), ecriture reservee aux
--  personnes inscrites comme editeurs de CE site.
-- =====================================================================

-- ---------- 1. Les sites -------------------------------------------------
create table if not exists public.sites (
  id       text primary key,                 -- ex. 'bourguignols'
  nom      text not null,
  donnees  jsonb not null default '{}'::jsonb,
  maj_le   timestamptz not null default now(),
  maj_par  text
);

-- ---------- 2. Qui a le droit de modifier quel site ----------------------
create table if not exists public.site_editeurs (
  site_id  text not null references public.sites(id) on delete cascade,
  user_id  uuid not null references auth.users(id) on delete cascade,
  ajoute_le timestamptz not null default now(),
  primary key (site_id, user_id)
);

-- ---------- 3. Historique (filet de securite) ----------------------------
create table if not exists public.site_versions (
  id       bigserial primary key,
  site_id  text not null references public.sites(id) on delete cascade,
  donnees  jsonb not null,
  cree_le  timestamptz not null default now(),
  cree_par text
);
create index if not exists site_versions_site_date on public.site_versions (site_id, cree_le desc);

-- ---------- 4. Le droit d'ecrire, en une fonction ------------------------
-- security definer : la fonction lit site_editeurs sans buter sur la RLS.
create or replace function public.peut_editer(p_site text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.site_editeurs e
    where e.site_id = p_site and e.user_id = auth.uid()
  );
$$;

revoke all on function public.peut_editer(text) from public;
grant execute on function public.peut_editer(text) to anon, authenticated;

-- ---------- 5. Garder une copie a chaque enregistrement ------------------
create or replace function public.sites_archiver()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.site_versions (site_id, donnees, cree_par)
  values (old.id, old.donnees, old.maj_par);
  -- on ne garde que les 30 dernieres versions par site
  delete from public.site_versions v
  where v.site_id = old.id
    and v.id not in (
      select id from public.site_versions
      where site_id = old.id
      order by cree_le desc
      limit 30
    );
  new.maj_le := now();
  return new;
end;
$$;

drop trigger if exists sites_archiver_trg on public.sites;
create trigger sites_archiver_trg
  before update on public.sites
  for each row
  when (old.donnees is distinct from new.donnees)
  execute function public.sites_archiver();

-- ---------- 6. Verrouillage (RLS) ---------------------------------------
alter table public.sites          enable row level security;
alter table public.site_editeurs  enable row level security;
alter table public.site_versions  enable row level security;

-- sites : tout le monde lit (c'est le contenu public du site web)
drop policy if exists sites_lecture_publique on public.sites;
create policy sites_lecture_publique on public.sites
  for select to anon, authenticated using (true);

-- sites : seul un editeur du site peut ecrire
drop policy if exists sites_ecriture_editeur on public.sites;
create policy sites_ecriture_editeur on public.sites
  for update to authenticated
  using (public.peut_editer(id))
  with check (public.peut_editer(id));

-- pas d'insert ni de delete : les sites sont crees par nous, cle secrete

-- site_editeurs : chacun voit seulement ses propres acces
drop policy if exists editeurs_les_siens on public.site_editeurs;
create policy editeurs_les_siens on public.site_editeurs
  for select to authenticated using (user_id = auth.uid());

-- site_versions : un editeur peut relire l'historique de son site
drop policy if exists versions_editeur on public.site_versions;
create policy versions_editeur on public.site_versions
  for select to authenticated using (public.peut_editer(site_id));

-- ---------- 7. Droits de table ------------------------------------------
grant select on public.sites to anon, authenticated;
grant update on public.sites to authenticated;
grant select on public.site_editeurs to authenticated;
grant select on public.site_versions to authenticated;
