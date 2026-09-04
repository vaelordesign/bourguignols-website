-- Supabase accorde par defaut tous les droits aux roles anon et authenticated
-- sur les nouvelles tables du schema public. On reprend tout, puis on ne rend
-- que le strict necessaire. Une tentative interdite est alors refusee a la
-- porte (401/403) au lieu de traverser jusqu a la RLS et de repondre 204.
revoke all on public.sites         from anon, authenticated;
revoke all on public.site_editeurs from anon, authenticated;
revoke all on public.site_versions from anon, authenticated;
revoke all on sequence public.site_versions_id_seq from anon, authenticated;

grant select          on public.sites         to anon, authenticated;
grant update (donnees, maj_par) on public.sites to authenticated;
grant select          on public.site_editeurs to authenticated;
grant select          on public.site_versions to authenticated;

-- et pour les tables creees plus tard : plus de droits automatiques
alter default privileges in schema public revoke all on tables from anon, authenticated;
