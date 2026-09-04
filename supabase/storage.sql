-- Entrepot des photos : un dossier par site. Lecture publique, ecriture par l'editeur du site.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('sites', 'sites', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif','application/pdf'])
on conflict (id) do update
  set public = true,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/jpeg','image/png','image/webp','image/avif','application/pdf'];

-- le premier dossier du chemin est l'identifiant du site : bourguignols/domaines/xxx.jpg
drop policy if exists sites_fichiers_lecture on storage.objects;
create policy sites_fichiers_lecture on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'sites');

drop policy if exists sites_fichiers_ajout on storage.objects;
create policy sites_fichiers_ajout on storage.objects
  for insert to authenticated
  with check (bucket_id = 'sites' and public.peut_editer((storage.foldername(name))[1]));

drop policy if exists sites_fichiers_maj on storage.objects;
create policy sites_fichiers_maj on storage.objects
  for update to authenticated
  using (bucket_id = 'sites' and public.peut_editer((storage.foldername(name))[1]));

drop policy if exists sites_fichiers_suppr on storage.objects;
create policy sites_fichiers_suppr on storage.objects
  for delete to authenticated
  using (bucket_id = 'sites' and public.peut_editer((storage.foldername(name))[1]));
