const form = document.getElementById('waitlist-form');
const feedbackEl = document.getElementById('form-feedback');
const YEAR_EL = document.getElementById('year');

const TWENTY_API = 'https://crm.ori3com.cloud/api/twentycrm';
const TWENTY_API_KEY = undefined; // Do NOT hardcode secrets in frontend. Use Dokploy env if needed.

function sanitize(s){return (s||'').toString().trim()}
function isEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)}

async function submitTwenty(payload){
  const res = await fetch(TWENTY_API, {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      ...(TWENTY_API_KEY ? { 'Authorization': `Bearer ${TWENTY_API_KEY}` } : {})
    },
    body: JSON.stringify(payload)
  });
  return res;
}

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  feedbackEl.textContent = '';

  const firstName = sanitize(document.getElementById('firstName')?.value);
  const lastName  = sanitize(document.getElementById('lastName')?.value);
  const email     = sanitize(document.getElementById('email')?.value);
  const optin     = !!document.getElementById('optin')?.checked;
  const q1        = sanitize(document.getElementById('q1')?.value);
  const q2        = sanitize(document.getElementById('q2')?.value);
  const beta      = (document.querySelector('input[name="betaPriority"]:checked')?.value) || 'oui';

  if(!firstName || !lastName){
    feedbackEl.style.color = 'var(--danger)';
    feedbackEl.textContent = 'Merci de renseigner prénom et nom.';
    return;
  }
  if(!isEmail(email)){
    feedbackEl.style.color = 'var(--danger)';
    feedbackEl.textContent = 'Veuillez saisir une adresse e‑mail valide.';
    return;
  }

  const payload = {
    firstName,
    lastName,
    email,
    optin,
    feedback: {
      challenge: q1,
      tools: q2,
      betaPriority: beta
    }
  };

  try{
    const res = await submitTwenty(payload);
    if(res.ok){
      feedbackEl.style.color = 'var(--accent)';
      feedbackEl.textContent = 'Merci ! Vous êtes bien inscrit·e.';
      (document.getElementById('firstName').value = '');
      (document.getElementById('lastName').value = '');
      (document.getElementById('email').value = '');
      (document.getElementById('optin').checked = true);
      (document.getElementById('q1').value = '');
      (document.getElementById('q2').value = '');
      (document.querySelector('input[name="betaPriority"][value="oui"]').checked = true);
    } else {
      throw new Error('Request failed');
    }
  } catch(err){
    feedbackEl.style.color = 'var(--danger)';
    feedbackEl.textContent = "Une erreur s'est produite. Réessayez plus tard.";
  }
});

YEAR_EL.textContent = new Date().getFullYear();
