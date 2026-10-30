'use server';
import { db } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
export async function signIn(form:FormData){const s=await db();const {error}=await s.auth.signInWithPassword({email:String(form.get('email')||''),password:String(form.get('password')||'')});if(error)redirect('/login?error=invalid');redirect('/dashboard')}
export async function signUp(form:FormData){
  const s=await db();
  // Only use the deployed origin that is configured in Supabase redirect allowlist.
  const configured=process.env.NEXT_PUBLIC_SITE_URL;
  const origin=configured || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const {error}=await s.auth.signUp({
    email:String(form.get('email')||''),password:String(form.get('password')||''),
    options:{emailRedirectTo:`${origin.replace(/\/$/,'')}/auth/callback`}
  });
  if(error)redirect('/login?error=signup');
  redirect('/login?notice=verify');
}
export async function signOut(){const s=await db();await s.auth.signOut();redirect('/login')}
export async function createAgency(form:FormData){const s=await db();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login');const name=String(form.get('name')||'').trim();if(name.length<2||name.length>100)throw new Error('Invalid name');const {error}=await s.rpc('create_agency',{agency_name:name});if(error)throw new Error(error.message);revalidatePath('/dashboard')}
export async function addCreator(form:FormData){const s=await db();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login');const agencyId=String(form.get('agency_id')||'');const name=String(form.get('name')||'').trim();if(name.length<2||name.length>100)throw new Error('Invalid name');const {error}=await s.from('creators').insert({agency_id:agencyId,display_name:name,platform:'manual'});if(error)throw new Error(error.message);revalidatePath('/dashboard')}
export async function addFan(form:FormData){const s=await db();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login');const agencyId=String(form.get('agency_id')||'');const creatorId=String(form.get('creator_id')||'');const handle=String(form.get('handle')||'').trim();if(!handle||handle.length>100)throw new Error('Invalid handle');const {error}=await s.from('fans').insert({agency_id:agencyId,creator_id:creatorId,handle});if(error)throw new Error(error.message);revalidatePath('/dashboard')}
export async function inviteMember(form:FormData){const s=await db();const agency=String(form.get('agency_id')||'');const email=String(form.get('email')||'').trim();const role=String(form.get('role')||'viewer');if(!['admin','manager','chatter','analyst','viewer'].includes(role))throw new Error('Invalid role');const {error}=await s.rpc('invite_agency_member',{p_agency:agency,p_email:email,p_role:role});if(error)throw new Error(error.message);revalidatePath('/dashboard')}
export async function acceptInvitations(){const s=await db();const {error}=await s.rpc('accept_agency_invitations');if(error)throw new Error(error.message);revalidatePath('/dashboard')}

export async function addTask(form:FormData){const s=await db();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login');const agency_id=String(form.get('agency_id')||'');const title=String(form.get('title')||'').trim();if(title.length<2||title.length>200)throw new Error('Invalid title');const {error}=await s.from('tasks').insert({agency_id,title,status:'todo'});if(error)throw new Error(error.message);revalidatePath('/dashboard')}
export async function completeTask(form:FormData){const s=await db();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login');const agency_id=String(form.get('agency_id')||'');const id=String(form.get('id')||'');const {error}=await s.from('tasks').update({status:'done'}).eq('agency_id',agency_id).eq('id',id);if(error)throw new Error(error.message);revalidatePath('/dashboard')}
export async function addCampaign(form:FormData){const s=await db();const {data:{user}}=await s.auth.getUser();if(!user)redirect('/login');const agency_id=String(form.get('agency_id')||'');const name=String(form.get('name')||'').trim();if(name.length<2||name.length>160)throw new Error('Invalid name');const {error}=await s.from('campaigns').insert({agency_id,name,channel:'manual',status:'draft'});if(error)throw new Error(error.message);revalidatePath('/dashboard')}
