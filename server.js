const express = require('express');
const xlsx = require('xlsx');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('public'));

// Function to get buying suggestion
function getSuggestion(avgRating) {
  if (avgRating >= 4.5) return "Highly recommended!";
  if (avgRating >= 4.0) return "Good choice!";
  if (avgRating >= 3.0) return "Consider with caution.";
  return "Not recommended.";
}

// Endpoint to serve the product data
app.get('/get-product-data', (req, res) => {
  // Load the Excel file
  const workbook = xlsx.readFile("C:\\Users\\rahul\\Desktop\\project_rpa\\dataset.xlsx");
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Parse Amazon and Flipkart data
  const amazonData = xlsx.utils.sheet_to_json(sheet, { range: "A1:E9" });
  const flipkartData = xlsx.utils.sheet_to_json(sheet, { range: "A14:E22" });

  // Combine data and calculate average rating and suggestion
  const productSuggestions = amazonData.map((amazonProduct, index) => {
    const flipkartProduct = flipkartData[index];

    const amazonRating = parseFloat(amazonProduct['Rating (Amazon)'].split(' ')[0]) || 0;
    const flipkartRating = parseFloat(flipkartProduct['Rating (Flipkart)']) || 0;
    const avgRating = ((amazonRating + flipkartRating) / 2).toFixed(1);
    
    return {
      title: amazonProduct['Product Name (Amazon)'],
      avgRating,
      suggestion: getSuggestion(avgRating),
      bestPlatform: amazonRating > flipkartRating ? "Amazon" : "Flipkart"
    };
  });

  // Send the data with suggestions
  res.json({ amazonData, flipkartData, productSuggestions });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
