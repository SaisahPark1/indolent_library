async function fetchAndStoreData() {
  try {
    localStorage.setItem('apiData', JSON.stringify(data));
    console.log('Data stored');
  } catch (err) {
    console.error('Error fetching data:', err);
  }
}