// Query to get all collections
export const getCollectionsQuery = `
  query getCollections {
    collections(first: 250) {
      edges {
        node {
          id
          handle
          title
          description
        }
      }
    }
  }
`;

// Query for collection products
export const getCollectionProductsQuery = `
  query getCollectionProducts($handle: String!) {
    collection(handle: $handle) {
      id
      title
      description
      products(first: 250) {
        edges {
          node {
            id
            title
            handle
            description
            availableForSale
            requiresSellingPlan
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 100) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                  image {
                    url
                    altText
                  }
                }
              }
            }
            options {
              id
              name
              values
            }
          }
        }
      }
    }
  }
`;

// Mutation to create a cart
export const createCartMutation = `
  mutation cartCreate($lineItems: [CartLineInput!]!) {
    cartCreate(input: {
      lines: $lineItems
    }) {
      cart {
        id
        checkoutUrl
        lines(first: 250) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Query to get recommended products
export const getRecommendedProductsQuery = `
  query getRecommendedProducts($first: Int!) {
    products(first: $first, sortKey: BEST_SELLING) {
      edges {
        node {
          id
          title
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    }
  }
`; 