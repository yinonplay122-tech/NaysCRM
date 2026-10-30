-- Run after 001_initial.sql. Email invitations require an existing verified Supabase account.
create table public.agency_invitations (
 id uuid primary key default gen_random_uuid(), agency_id uuid not null references public.agencies(id) on delete cascade,
 email text not null check (length(email) between 5 and 254), role public.member_role not null check(role <> 'owner'),
 invited_by uuid not null references auth.users(id), created_at timestamptz not null default now(),
 expires_at timestamptz not null default (now()+interval '7 days'), accepted_at timestamptz,
 unique(agency_id,email)
);
create index on public.agency_invitations(lower(email));
alter table public.agency_invitations enable row level security;
create policy invite_admin_read on public.agency_invitations for select to authenticated using(public.has_agency_role(agency_id,array['owner','admin']::public.member_role[]));
-- Use RPC rather than client writes to keep invitation authorization server-side.
create function public.invite_agency_member(p_agency uuid,p_email text,p_role public.member_role)
returns uuid language plpgsql security definer set search_path='' as $$
declare v_id uuid; v_email text := lower(trim(p_email));
begin
 if not public.has_agency_role(p_agency,array['owner','admin']::public.member_role[]) then raise exception 'not authorized'; end if;
 if p_role='owner' or v_email !~ '^[^@ ]+@[^@ ]+\.[^@ ]+$' then raise exception 'invalid invitation'; end if;
 insert into public.agency_invitations(agency_id,email,role,invited_by)
 values(p_agency,v_email,p_role,auth.uid())
 on conflict(agency_id,email) do update set role=excluded.role,invited_by=excluded.invited_by,created_at=now(),expires_at=now()+interval '7 days',accepted_at=null
 returning id into v_id;
 return v_id;
end $$;
revoke all on function public.invite_agency_member(uuid,text,public.member_role) from public;
grant execute on function public.invite_agency_member(uuid,text,public.member_role) to authenticated;
create function public.accept_agency_invitations()
returns integer language plpgsql security definer set search_path='' as $$
declare v_email text; v_count integer;
begin
 if auth.uid() is null then raise exception 'unauthenticated'; end if;
 select lower(email) into v_email from auth.users where id=auth.uid() and email_confirmed_at is not null;
 if v_email is null then raise exception 'verified email required'; end if;
 insert into public.agency_members(agency_id,user_id,role)
 select i.agency_id,auth.uid(),i.role from public.agency_invitations i
 where lower(i.email)=v_email and i.accepted_at is null and i.expires_at>now()
 on conflict(agency_id,user_id) do nothing;
 get diagnostics v_count = row_count;
 update public.agency_invitations set accepted_at=now() where lower(email)=v_email and accepted_at is null and expires_at>now();
 return v_count;
end $$;
revoke all on function public.accept_agency_invitations() from public;
grant execute on function public.accept_agency_invitations() to authenticated;
