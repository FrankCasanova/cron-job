document.getElementById('start-button').addEventListener('click', startFetching);

function startFetching() {
  const serviceUrls = [
    'https://lol-statistics-eeyy.onrender.com/',
    'https://pykedex.onrender.com/oauth_callback',
    'https://scrape-events-h6f9.onrender.com/',
    'https://scrape-my-food.onrender.com/',
    'https://yt-downloader-ga7r.onrender.com/',
    // Add more URLs as needed
  ];

  let servicesStatus = new Array(serviceUrls.length).fill(false);

  let logContainer = document.getElementById('log-container');

  // Get current time
  let now = new Date();
  let start = 0; // Default start time is 0 milliseconds (immediate)

  // Check if current time is between 8 AM and 12 AM
  if (now.getHours() >= 8 && now.getHours() < 12) {
    // If it is, calculate the time until 12 PM
    let stop = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0) - now;
    if (stop < 0) {
      stop += 86400000; // if it's already past 12 PM, stop tomorrow
    }
    // Create a log element for start time
    let startTimeLog = document.createElement('p');
    startTimeLog.textContent = "Fetching will start immediately and stop in " + stop / 1000 + " seconds at 12 PM";
    logContainer.appendChild(startTimeLog);
  } else {
    // Calculate the time until 8 AM
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0, 0, 0) - now;
    if (start < 0) {
      start += 86400000; // if it's already past 8 AM, start tomorrow
    }
    // Create a log element for start time
    let startTimeLog = document.createElement('p');
    startTimeLog.textContent = "Fetching will start in " + start / 1000 + " seconds at 8 AM";
    logContainer.appendChild(startTimeLog);
  }

  // Set a timeout to start fetching at the calculated start time
  setTimeout(function() {
    // Create a log element for fetching started
    let fetchingStartLog = document.createElement('p');
    fetchingStartLog.textContent = "Fetching started.";
    logContainer.appendChild(fetchingStartLog);

    let intervalID = setInterval(function() {
      serviceUrls.forEach((url, index) => fetchData(url, index));
    }, 780000); // 780000 milliseconds = 13 minutes

    // Function to fetch data and retry on error
    function fetchData(url, index) {
        // Log that URL is being fetched
        let fetchingLog = document.createElement('p');
        fetchingLog.textContent = "Fetching data from " + url + "...";
        logContainer.appendChild(fetchingLog);
  
        fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
            'Accept': 'application/json',
          }
        })
          .then(response => {
            // Log status code
            let statusLog = document.createElement('p');
            statusLog.textContent = 'Status code for ' + url + ': ' + response.status;
            logContainer.appendChild(statusLog);
  
            if (response.ok) {
              servicesStatus[index] = true; // Service is up
              updateStatus(); // Update the status
              return response.json();
            } else {
              throw new Error('Service not available');
            }
          })
          .then(data => {
            // Create a log element for successful data fetch
            let successLog = document.createElement('p');
            successLog.textContent = 'Data fetched successfully from ' + url + ': ' + JSON.stringify(data);
            logContainer.appendChild(successLog);
            // Process and update your page with the new data here
          })
          .catch(error => {
            // Create a log element for error
            let errorLog = document.createElement('p');
            errorLog.textContent = 'Error fetching data from ' + url + ': ' + error;
            logContainer.appendChild(errorLog);
            servicesStatus[index] = false; // Service is down
            updateStatus(); // Update the status
            setTimeout(() => fetchData(url, index), 15000); // Retry after 15 seconds
          });
      }
  
      // Function to update the status text
      function updateStatus() {
        const allServicesUp = servicesStatus.every(status => status === true);
        const statusText = allServicesUp ? 'All services up' : 'Some services are not ready';
        document.getElementById('services-status').textContent = statusText;
      }
  
      // Calculate the time until 12 PM to stop fetching
      let stop = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0) - now;
      if (stop < 0) {
        stop += 86400000; // if it's already past 12 PM, stop tomorrow
      }
  
      // Create a log element for stop time
      let stopTimeLog = document.createElement('p');
      stopTimeLog.textContent = "Fetching will stop in " + stop / 1000 + " seconds at 12 PM";
      logContainer.appendChild(stopTimeLog);
  
      // Set a timeout to stop fetching at 12 PM
      setTimeout(function() {
        clearInterval(intervalID);
        // Create a log element for fetching stopped
        let fetchingStopLog = document.createElement('p');
        fetchingStopLog.textContent = "Fetching stopped.";
        logContainer.appendChild(fetchingStopLog);
      }, stop);
  
    }, start);
  }
  