import { shopifyFetch } from "../lib/shopify.js";

const getProductQuery = `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      availableForSale
      requiresSellingPlan
      totalInventory
      tags
      vendor
      productType
      publishedAt
      featuredImage {
        url
        altText
      }
      options {
        id
        name
        values
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            sku
            availableForSale
            requiresSellingPlan
            quantityAvailable
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            barcode
            weight
            weightUnit
          }
        }
      }
      images(first: 20) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      collections(first: 5) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  }
`;

async function testProductInfo() {
  console.log("Testing Product Information Fetch...\n");

  try {
    const response = await shopifyFetch(getProductQuery, {
      handle: "black-distressed-rhinestone-sweatshirt",
    });

    console.log("Full Product Information:");
    console.log(JSON.stringify(response, null, 2));

    if (response.product) {
      const product = response.product;

      console.log("\n=== Basic Info ===");
      console.log("Title:", product.title);
      console.log("Available:", product.availableForSale);
      console.log("Type:", product.productType);
      console.log("Vendor:", product.vendor);
      console.log("Tags:", product.tags.join(", "));

      console.log("\n=== Options ===");
      product.options.forEach((option) => {
        console.log(`${option.name}:`, option.values.join(", "));
      });

      console.log("\n=== Variants ===");
      product.variants.edges.forEach(({ node }) => {
        console.log("\nVariant:", node.title);
        console.log("SKU:", node.sku);
        console.log("Available:", node.availableForSale);
        console.log("Quantity:", node.quantityAvailable);
        console.log(
          "Price:",
          `${node.price.currencyCode} ${node.price.amount}`
        );
        if (node.compareAtPrice) {
          console.log(
            "Compare at:",
            `${node.compareAtPrice.currencyCode} ${node.compareAtPrice.amount}`
          );
        }
        console.log(
          "Options:",
          node.selectedOptions
            .map((opt) => `${opt.name}: ${opt.value}`)
            .join(", ")
        );
      });

      console.log("\n=== Collections ===");
      product.collections.edges.forEach(({ node }) => {
        console.log("-", node.title);
      });
    }
  } catch (error) {
    console.error("\nTest failed! ❌");
    console.error("Error details:", error.message);
  }
}

testProductInfo();
