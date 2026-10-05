-- Run this in Supabase SQL Editor.
create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price text,
  description text,
  image_path text,
  image_url text,
  menu_date date not null default current_date,
  created_at timestamptz not null default now()
);

alter table public.menu_items enable row level security;

drop policy if exists "Public can read menu" on public.menu_items;
create policy "Public can read menu"
on public.menu_items for select
to anon, authenticated
using (true);

-- Owner writes require authentication.
drop policy if exists "Authenticated can insert menu" on public.menu_items;
create policy "Authenticated can insert menu"
on public.menu_items for insert
to authenticated
with check (true);

drop policy if exists "Authenticated can update menu" on public.menu_items;
create policy "Authenticated can update menu"
on public.menu_items for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated can delete menu" on public.menu_items;
create policy "Authenticated can delete menu"
on public.menu_items for delete
to authenticated
using (true);

-- Storage bucket for daily photos.
insert into storage.buckets (id, name, public)
values ('menu-photos', 'menu-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can view menu photos" on storage.objects;
create policy "Public can view menu photos"
on storage.objects for select
to public
using (bucket_id = 'menu-photos');

drop policy if exists "Authenticated can upload menu photos" on storage.objects;
create policy "Authenticated can upload menu photos"
on storage.objects for insert
to authenticated
with check (bucket_id = 'menu-photos');

drop policy if exists "Authenticated can update menu photos" on storage.objects;
create policy "Authenticated can update menu photos"
on storage.objects for update
to authenticated
using (bucket_id = 'menu-photos')
with check (bucket_id = 'menu-photos');

drop policy if exists "Authenticated can delete menu photos" on storage.objects;
create policy "Authenticated can delete menu photos"
on storage.objects for delete
to authenticated
using (bucket_id = 'menu-photos');
