import { GraphQLClient } from "graphql-request";

const WP_URL = process.env.WORDPRESS_API_URL || "http://wordpress/?graphql";

const client = new GraphQLClient(WP_URL, {
  fetch: (url, init) => fetch(url, { ...init, cache: "no-store" }),
});

export type Service = {
  id: string;
  slug: string;
  title: string;
  price: number;
  sizeVariants: string;
  hoursNote: string;
  available: boolean;
  featuredImage?: {
    node: { sourceUrl: string; altText: string };
  };
};

const GET_SERVICES = `
  query GetServices {
    services(first: 50, where: { status: PUBLISH }) {
      nodes {
        id
        slug
        title
        price
        sizeVariants
        hoursNote
        available
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

const GET_SERVICE_BY_SLUG = `
  query GetServiceBySlug($slug: ID!) {
    service(id: $slug, idType: SLUG) {
      id
      slug
      title
      excerpt
      content
      price
      category
      isPopular
      descriptionSv
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

export async function getAllServices(): Promise<Service[]> {
  try {
    const data: any = await client.request(GET_SERVICES);
    return data.services.nodes;
  } catch (err) {
    console.error("[WP] getAllServices error:", err);
    return [];
  }
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const data: any = await client.request(GET_SERVICE_BY_SLUG, { slug });
    return data.service;
  } catch (err) {
    console.error("[WP] getServiceBySlug error:", err);
    return null;
  }
}