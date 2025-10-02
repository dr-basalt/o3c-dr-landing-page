const forms = [
  document.getElementById('waitlist-form'),
  document.getElementById('waitlist-form-2')
].filter(Boolean);

const FORM_ENDPOINT = 'https://formspree.io/f/mayvvkgl'; // TODO: replace with your own endpoint

forms.forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[name="email"]');
    const feedback = form.querySelector('.form-feedback');
    feedback.textContent = '';

    const email = (emailInput?.value || '').trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      feedback.style.color = 'var(--danger)';
      feedback.textContent = 'Veuillez saisir une adresse e‑mail valide.';
      return;
    }

    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (res.ok) {
        feedback.style.color = 'var(--accent)';
        feedback.textContent = 'Merci ! Vous êtes bien inscrit·e.';
        emailInput.value = '';
      } else {
        throw new Error('Request failed');
      }
    } catch (err) {
      feedback.style.color = 'var(--danger)';
      feedback.textContent = "Une erreur s'est produite. Réessayez plus tard.";
    }
  });
});

document.getElementById('year').textContent = new Date().getFullYear();
