import { GraphQLClient, gql } from "graphql-request";

/* ======================================================
   GraphQL Client
====================================================== */

const API_URL =
  process.env.WORDPRESS_API_URL ||
  "http://localhost:8080/graphql";

const client = new GraphQLClient(API_URL);


/* ======================================================
   TYPES
====================================================== */

export interface BraidStyleNode {
  title: string;
  slug: string;
}

interface ServicesResponse {
  braidStyles: {
    nodes: BraidStyleNode[];
  };
}

export interface SingleStyleNode {
  title: string;
  content: string;
}

interface SingleStyleResponse {
  braidStyle: SingleStyleNode;
}

export interface SlotNode {
  id: string;
  slot_date: string;
  slot_time: string;
}

interface SlotsResponse {
  slots: {
    nodes: SlotNode[];
  };
}

export interface BookingNode {
  booking_date: string;
  booking_time: string;
}

interface BookingsResponse {
  bookings: {
    nodes: BookingNode[];
  };
}


/* ======================================================
   QUERIES
====================================================== */

const GET_STYLES = gql`
  query GetBraidStyles {
    braidStyles {
      nodes {
        title
        slug
      }
    }
  }
`;

const GET_STYLE = gql`
  query GetBraidStyle($slug: ID!) {
    braidStyle(id: $slug, idType: SLUG) {
      title
      content
    }
  }
`;


const GET_BOOKINGS = gql`
  query GetBookings {
    bookings {
      nodes {
        booking_date
        booking_time
      }
    }
  }
`;


/* ======================================================
   API FUNCTIONS
====================================================== */

/**
 * Fetch all braid styles
 */
export async function getServices(): Promise<BraidStyleNode[]> {
  try {
    const data =
      await client.request<ServicesResponse>(GET_STYLES);

    return data.braidStyles.nodes ?? [];
  } catch (error) {
    console.error("getServices error:", error);
    return [];
  }
}


/**
 * Fetch single braid style
 */
export async function getBraidStyle(
  slug: string
): Promise<SingleStyleNode | null> {

  try {
    const data =
      await client.request<SingleStyleResponse>(
        GET_STYLE,
        { slug }
      );

    return data.braidStyle ?? null;

  } catch (error) {
    console.error("getBraidStyle error:", error);
    return null;
  }
}


/**
 * Fetch availability slots
 */


/**
 * Fetch existing bookings
 */
export async function getBookings(): Promise<BookingNode[]> {
  try {
    const data =
      await client.request<BookingsResponse>(
        GET_BOOKINGS
      );

    return data.bookings.nodes ?? [];
  } catch (error) {
    console.error("getBookings error:", error);
    return [];
  }
}