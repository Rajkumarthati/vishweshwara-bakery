# Supabase connection plan

The included `admin.html` is a working prototype using browser storage. For the real bakery owner workflow across phones/devices, connect it to Supabase.

Recommended free-tier structure:
- `menu_items`: id, name, price, description, image_url, menu_date, created_at
- Storage bucket: `menu-photos`
- Authentication: owner email/password
- Row Level Security: customers can read published menu items; only the owner can insert/update/delete.

Once the bakery owner creates a Supabase project and provides the project URL and anon/publishable key (never a service-role key), replace the localStorage functions with Supabase calls. The public site can remain on GitHub Pages.

Security note: never put a Supabase service-role/secret key in GitHub Pages code.
