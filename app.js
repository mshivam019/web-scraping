const fs = require('fs');
const axios = require('axios');
const path = require('path');

// Read the JSON data
const jsonData = fs.readFileSync('products.json', 'utf-8');
const products = JSON.parse(jsonData);

// Create the "images" folder if it doesn't exist
const folderPath = path.join(__dirname, 'images');
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

// Function to download an image from the given URL
const downloadImage = async (imageUrl, filename) => {
  try {
    const response = await axios.get(`http://${imageUrl}`, { responseType: 'stream' });
    const imagePath = path.join(folderPath, `${filename}.jpg`);
    response.data.pipe(fs.createWriteStream(imagePath));
    console.log(`Image downloaded: ${filename}`);
  } catch (error) {
    console.error(`Failed to download image: ${filename}`);
    console.error(error);
  }
};

// Array to store updated products
const updatedProducts = [];

// Loop through the products and download the images
const downloadPromises = products.map(async (product) => {
  const name = product.name.split(' ')[0];
  const imageUrl = product.image;

  await downloadImage(imageUrl, name);

  // Update the image URL in the product
  product.image = `/images/${name}.jpg`;

  // Add the updated product to the array
  updatedProducts.push(product);
});

// Wait for all downloads to finish
Promise.all(downloadPromises)
  .then(() => {
    // Convert the updated products array back to JSON
    const updatedJsonData = JSON.stringify(updatedProducts, null, 2);

    // Write the updated JSON data to file
    fs.writeFileSync('updated-products.json', updatedJsonData);

    console.log('All downloads finished. Updated JSON file created.');
  })
  .catch((error) => {
    console.error('Error occurred during downloads:', error);
  });
