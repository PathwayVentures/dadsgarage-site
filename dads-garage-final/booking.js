
// Handles submission of booking form to Airtable and SMS webhook
const form = document.getElementById('service-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const values = Object.fromEntries(data.entries());

  // Format for Airtable
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

    // Optional: Send SMS confirmation
    await fetch('https://your-sms-webhook.com/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: values.phone,
        message: `Thanks ${values.name}, your ${values.service} request was received by Dad's Garage. We'll be in touch shortly!`
      })
    });

    alert('Your request was submitted! You will receive a text confirmation shortly.');
    form.reset();
  } catch (error) {
    console.error(error);
    alert('Something went wrong. Please try again or text 918-998-7106.');
  }
});
