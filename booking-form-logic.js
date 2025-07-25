
// Handles submission of booking form to Airtable and SMS webhook
const form = document.getElementById('service-form');
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  submitButton.disabled = true;
  submitButton.textContent = 'Submitting...';

  const data = new FormData(form);
  const values = Object.fromEntries(data.entries());

  const airtablePayload = {
    records: [
      {
        fields: {
          Name: values.name,
          Vehicle: values.vehicle,
          Service: values.service,
          "Oil Type": values.oil_type || 'N/A',
          "Part Quality": values.part_quality || 'Standard',
          "Preferred Time": values.datetime,
          Phone: values.phone,
          Notes: values.notes || '',
          VisitCount: 1
        }
      }
    ]
  };

  try {
    await fetch('https://api.airtable.com/v0/app08lmsUKgVOWXaO/Service%20Requests', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer pat5AlVtmzCrtQqbj.c12f4cc00e37b22c44cbb67df06d430ac9db65974b9e1cacb44b0c36e57c7ce9',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(airtablePayload)
    });

    await fetch('https://hooks.zapier.com/hooks/catch/22382414/uu8zjy3/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: values.phone,
        message: `Thanks ${values.name}, your ${values.service} request was received by Dad's Garage. We'll be in touch shortly!`
      })
    });

    window.location.href = 'thank-you.html';

  } catch (error) {
    console.error(error);
    alert('Something went wrong. Please try again or text 918-998-7106.');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Submit';
  }
});
