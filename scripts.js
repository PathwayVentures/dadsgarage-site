const form = document.getElementById('service-form');
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const values = Object.fromEntries(data.entries());
  alert("Request submitted! You'll get a text confirmation shortly.");
  form.reset();
});