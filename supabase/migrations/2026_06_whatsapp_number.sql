-- The clinic's WhatsApp number can differ from its call-in phone number
-- (confirmed in practice: phone 01271222047, WhatsApp 01034060403). Adds a
-- dedicated raw-input column, mirroring phone_display, so the admin can set
-- it independently instead of whatsapp_number always being derived from the
-- phone number. Existing RLS policies on site_settings already cover it.

alter table public.site_settings
  add column if not exists whatsapp_display text;
