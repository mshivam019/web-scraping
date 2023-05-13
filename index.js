const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
  // Launch Puppeteer
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  // Navigate to the website
  await page.goto(
    "https://www.teez.in/collections/programmers-designers-t-shirts-for-men"
  );

  // Wait for the product listings to load
  await page.waitForSelector(".product-grid-item", { timeout: 60000 });

  // Extract product information
  const products = await page.evaluate(() => {
    const results = [];

    // Customize the selectors based on the website structure
    const productElements = document.querySelectorAll(".product-grid-item");

    productElements.forEach((productElement) => {
      const name = productElement.querySelector("p").textContent.trim();

      // Extract the price and remove line breaks
      // const priceElement = productElement.querySelector('.h1.medium--left');
      // const price = productElement.querySelector('.h1.medium--left').textContent.trim();
      const price = 39;

      const category = "T-Shirt";
      const countInStock = 10;
      // Remove the double slashes before the image URL
      const imageElement = productElement.querySelector("img");
      let image = imageElement.getAttribute("src");
      if (image.startsWith("//")) {
        image = image.substr(2);
        image = image.replace(/\?v=\d+$/, "");
      }
      //let image = "/images/" + name.split(" ")[0] + ".jpg";

      results.push({ name, price, category, image, countInStock });
    });

    return results;
  });

  // Save the scraped data as JSON
  fs.writeFileSync("products.json", JSON.stringify(products, null, 2));

  // Close the browser
  await browser.close();

  console.log("Scraping completed!");
})();
