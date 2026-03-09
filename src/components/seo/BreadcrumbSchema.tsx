interface Service {
  name: string;
  description: string;
  price: string | number;
}

export function ServiceSchema({ service }: { service: Service }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    description: service.description,
    provider: { "@type": "HairSalon", name: "BraidsInBorås" },
    areaServed: { "@type": "City", name: "Borås" },
    offers: {
      "@type": "Offer",
      price: service.price,
      priceCurrency: "SEK",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}