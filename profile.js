(async function(){
  const nameEl=document.getElementById('name'), bioEl=document.getElementById('bio'), linksEl=document.getElementById('links'), socialsEl=document.getElementById('socials'), avatarEl=document.getElementById('avatar');
  function showError(message){ nameEl.textContent='Gagal memuat'; bioEl.textContent=message; linksEl.innerHTML=''; socialsEl.innerHTML=''; }
  if(!window.SUPABASE_URL||!window.SUPABASE_ANON_KEY){showError('Konfigurasi Supabase belum tersedia. Cek Environment Variables di Vercel: SUPABASE_URL dan SUPABASE_ANON_KEY.');return;}
  try{
    const supabase=window.supabase.createClient(window.SUPABASE_URL,window.SUPABASE_ANON_KEY);
    const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
    const safe=s=>/^(https?:\/\/|mailto:|tel:)/i.test(String(s||''))?esc(s):'#';
    function slug(){return location.pathname.split('/').filter(Boolean)[0]||null}
    let q=supabase.from('profiles').select('id,username,name,bio,avatar_url,button_color,bg_color').eq('is_public',true);
    const u=slug(); if(u) q=q.eq('username',u); else q=q.limit(1);
    const {data:p,error}=await q.maybeSingle();
    if(error) throw error;
    if(!p){showError('Profil tidak ditemukan.');return;}
    document.title=(p.name||p.username)+' — Links'; document.body.style.background=p.bg_color||'#111';
    avatarEl.textContent=p.avatar_url?'':(p.name||'C')[0].toUpperCase(); avatarEl.style.backgroundImage=p.avatar_url?`url("${safe(p.avatar_url)}")`:'none';
    nameEl.textContent=p.name||p.username; bioEl.textContent=p.bio||'';
    const lr=await supabase.from('links').select('id,title,url,icon,position').eq('profile_id',p.id).eq('is_active',true).order('position');
    if(lr.error) throw lr.error;
    linksEl.innerHTML=(lr.data||[]).map(x=>`<a class="link" href="${safe(x.url)}" target="_blank" rel="noopener"><span class="icon">${esc(x.icon||'🔗')}</span><span>${esc(x.title)}</span><span class="dots">⋮</span></a>`).join('');
    const sr=await supabase.from('socials').select('instagram,tiktok,youtube,telegram').eq('profile_id',p.id).maybeSingle();
    if(sr.error) throw sr.error;
    if(sr.data) socialsEl.innerHTML=[['Instagram',sr.data.instagram,'📸'],['TikTok',sr.data.tiktok,'♪'],['YouTube',sr.data.youtube,'▶'],['Telegram',sr.data.telegram,'✈']].filter(x=>x[1]).map(x=>`<a href="${safe(x[1])}" target="_blank" rel="noopener">${x[2]} ${x[0]}</a>`).join('');
  }catch(e){ console.error(e); showError('Tidak dapat terhubung ke Supabase: '+(e?.message||'kesalahan tidak diketahui')); }
})();
