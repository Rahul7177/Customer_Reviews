document.getElementById('searchForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const productName = document.getElementById('productName').value;

  try {
    // Send request to local Node.js server to start the UiPath workflow
    const response = await fetch('/start-workflow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productName }),
    });

    if (response.ok) {
      console.log("Workflow started successfully. Please wait...");

      // Wait a moment for the workflow to finish before fetching results
      await new Promise(resolve => setTimeout(resolve, 5000)); // Adjust timing if needed

      // Fetch and display data from the generated Excel file
      const productData = await fetchProductData();
      displayResults(productData);
    } else {
      console.error("Failed to start workflow. Please try again.");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
});

async function fetchProductData() {
  try {
    // Fetch data from the local server endpoint that reads the Excel file
    const response = await fetch('/get-product-data', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      const productData = await response.json(); // Assume the server sends JSON-formatted data
      return productData;
    } else {
      console.error("Failed to fetch product data.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching product data:", error);
    return [];
  }
}

// Function to display results on the webpage
function displayResults(productData) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = ''; // Clear previous results

  productData.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

    productDiv.innerHTML = `
      <h3>${product.title}</h3>
      <p><strong>Price:</strong> ${product.price}</p>
      <p><strong>Rating:</strong> ${product.rating}</p>
      <p><strong>Reviews:</strong> ${product.reviews}</p>
    `;

    resultsContainer.appendChild(productDiv);
  });
}
