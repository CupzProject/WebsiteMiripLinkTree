'use strict';
let supabaseClient = null;
let profile = null;
let links = [];
let booting = false;

const $ = id => document.getElementById(id);
const status = text => { const e=$('status'); if(e)e.textContent=text; };
const loginMsg = (text, error=false) => { const e=$('loginMsg'); if(!e)return; e.textContent=text; e.style.display='block'; e.style.color=error?'#dc2626':''; };
const val = id => ($(id)?.value || '');
const attr = s => String(s ?? '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');

function showLogin(){ $('loginView').style.display='flex'; $('adminView').style.display='none'; }
function showAdmin(){ $('loginView').style.display='none'; $('adminView').style.display='block'; }
function configError(){ return !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY ? 'Konfigurasi Supabase tidak tersedia. Cek Environment Variables Vercel lalu redeploy.' : null; }

async function timeout(promise, ms, label){
  let timer;
  const t = new Promise((_,rej)=>timer=setTimeout(()=>rej(new Error(label+' terlalu lama.')),ms));
  try{return await Promise.race([promise,t]);}finally{clearTimeout(timer);}
}

function createClient(){
  if(!window.supabase || typeof window.supabase.createClient!=='function') throw new Error('Library Supabase tidak termuat. Periksa koneksi internet/CDN.');
  const ce=configError(); if(ce) throw new Error(ce);
  return window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
}

async function login(event){
  event.preventDefault();
  const btn=$('loginButton');
  const email=val('loginEmail').trim(); const password=val('loginPassword');
  if(!email || !password){loginMsg('Email dan password wajib diisi.',true);return;}
  btn.disabled=true; btn.textContent='Memproses...'; loginMsg('Memproses...');
  try{
    if(!supabaseClient) supabaseClient=createClient();
    const r=await timeout(supabaseClient.auth.signInWithPassword({email,password}),15000,'Login Supabase');
    if(r.error) throw r.error;
    loginMsg('Login berhasil. Membuka panel...');
    await loadAdmin();
  }catch(e){ console.error(e); loginMsg('Login gagal: '+(e?.message||e),true); btn.disabled=false; btn.textContent='Masuk'; }
}

async function loadAdmin(){
  if(booting)return; booting=true;
  showAdmin(); status('Memuat data admin...');
  try{
    if(!supabaseClient) supabaseClient=createClient();
    const s=await timeout(supabaseClient.auth.getSession(),10000,'Pemeriksaan sesi Supabase');
    if(s.error)throw s.error;
    const session=s.data?.session;
    if(!session){showLogin(); return;}

    const pr=await timeout(supabaseClient.from('profiles').select('*').eq('owner_id',session.user.id).maybeSingle(),10000,'Pemuatan profil');
    if(pr.error)throw new Error('Gagal membaca profiles: '+pr.error.message);
    profile=pr.data;
    if(!profile){
      const base={owner_id:session.user.id,username:'my-links-'+session.user.id.slice(0,6),name:'My Links',bio:'Semua link saya ada di sini.',button_color:'#222222',bg_color:'#111111',is_public:true};
      const cr=await timeout(supabaseClient.from('profiles').insert(base).select().single(),10000,'Pembuatan profil');
      if(cr.error)throw new Error('Gagal membuat profile: '+cr.error.message);
      profile=cr.data;
    }
    $('username').value=profile.username||''; $('aName').value=profile.name||''; $('aBio').value=profile.bio||''; $('aAvatar').value=profile.avatar_url||''; $('aButton').value=profile.button_color||'#222222'; $('aBg').value=profile.bg_color||'#111111';

    const lr=await timeout(supabaseClient.from('links').select('*').eq('profile_id',profile.id).order('position'),10000,'Pemuatan link');
    if(lr.error)throw new Error('Gagal membaca links: '+lr.error.message); links=lr.data||[]; renderLinks();
    const sr=await timeout(supabaseClient.from('socials').select('*').eq('profile_id',profile.id).maybeSingle(),10000,'Pemuatan sosial');
    if(sr.error)throw new Error('Gagal membaca socials: '+sr.error.message);
    const so=sr.data||{}; $('instagram').value=so.instagram||''; $('tiktok').value=so.tiktok||''; $('youtube').value=so.youtube||''; $('telegram').value=so.telegram||'';
    status('✅ Admin siap — '+(session.user.email||'pengguna'));
  }catch(e){
    console.error(e); status('❌ '+(e?.message||e));
    if(!profile) showLogin();
  }finally{booting=false;}
}

function renderLinks(){
  const editor=$('linkEditor'); editor.innerHTML='';
  links.forEach((x,i)=>{
    const row=document.createElement('div'); row.className='editor'; row.innerHTML=`<input class="link-title" placeholder="Judul" value="${attr(x.title)}"><input class="link-url" placeholder="https://..." value="${attr(x.url)}"><input class="link-icon" placeholder="Ikon" value="${attr(x.icon||'🔗')}"><button type="button" class="save-link">Simpan</button><button type="button" class="delete-link">Hapus</button>`;
    row.querySelector('.save-link').onclick=async()=>{
      const payload={profile_id:profile.id,title:row.querySelector('.link-title').value.trim()||'Link Baru',url:row.querySelector('.link-url').value.trim(),icon:row.querySelector('.link-icon').value.trim()||'🔗',position:i,is_active:true};
      if(!/^https?:\/\//i.test(payload.url)){status('URL harus diawali http:// atau https://');return;}
      const r=x.id?await supabaseClient.from('links').update(payload).eq('id',x.id):await supabaseClient.from('links').insert(payload).select().single();
      if(r.error){status('❌ Gagal menyimpan: '+r.error.message);return;} await refreshLinks(); status('✅ Link tersimpan');
    };
    row.querySelector('.delete-link').onclick=async()=>{if(!confirm('Hapus link ini?'))return;if(x.id){const r=await supabaseClient.from('links').delete().eq('id',x.id);if(r.error){status('❌ '+r.error.message);return;}} links.splice(i,1);await normalize();renderLinks();status('✅ Link dihapus');};
    editor.appendChild(row);
  });
}
async function refreshLinks(){const r=await supabaseClient.from('links').select('*').eq('profile_id',profile.id).order('position');if(!r.error){links=r.data||[];renderLinks();}else status('❌ '+r.error.message);}
async function normalize(){for(let i=0;i<links.length;i++)if(links[i].id)await supabaseClient.from('links').update({position:i}).eq('id',links[i].id);}

async function saveProfile(){
  const username=val('username').trim().toLowerCase(); if(!/^[a-z0-9_-]{3,30}$/.test(username)){status('Username hanya boleh 3–30 karakter: a-z, 0-9, _ atau -');return;}
  const r=await supabaseClient.from('profiles').update({username,name:val('aName').trim()||'My Links',bio:val('aBio'),avatar_url:val('aAvatar').trim(),button_color:val('aButton'),bg_color:val('aBg')}).eq('id',profile.id); status(r.error?'❌ '+r.error.message:'✅ Profil tersimpan');
}
async function saveSocial(){const r=await supabaseClient.from('socials').upsert({profile_id:profile.id,instagram:val('instagram').trim(),tiktok:val('tiktok').trim(),youtube:val('youtube').trim(),telegram:val('telegram').trim()},{onConflict:'profile_id'});status(r.error?'❌ '+r.error.message:'✅ Sosial tersimpan');}
function addLink(){links.push({profile_id:profile.id,title:'Link Baru',url:'',icon:'🔗',position:links.length,is_active:true});renderLinks();status('Link baru ditambahkan. Isi URL lalu tekan Simpan.');const rows=document.querySelectorAll('#linkEditor .editor');rows[rows.length-1]?.querySelector('.link-title')?.focus();}
async function logout(){await supabaseClient.auth.signOut();profile=null;links=[];$('loginPassword').value='';showLogin();loginMsg('Berhasil keluar.');}
async function resetLinks(){if(!confirm('Hapus semua link?'))return;const r=await supabaseClient.from('links').delete().eq('profile_id',profile.id);if(r.error){status('❌ '+r.error.message);return;}links=[];renderLinks();status('Semua link dihapus.');}

document.addEventListener('DOMContentLoaded',()=>{
  $('loginForm').addEventListener('submit',login);
  $('saveProfile').addEventListener('click',saveProfile);
  $('saveSocial').addEventListener('click',saveSocial);
  $('addLink').addEventListener('click',addLink);
  $('logout').addEventListener('click',logout);
  $('reset').addEventListener('click',resetLinks);
  try{loadAdmin();}catch(e){showLogin();loginMsg(e.message,true);}
});
