export function LocalBusinessSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: "BraidsInBorås",
    image: "https://braidsboras.se/images/salon.jpg",
    url: "https://braidsboras.se",
    telephone: "+46XXXXXXXXX",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Din Gatuadress",
      addressLocality: "Borås",
      postalCode: "50X XX",
      addressCountry: "SE",
    },
    geo: { "@type": "GeoCoordinates", latitude: 57.7210, longitude: 12.9401 },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday"], opens: "09:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday","Sunday"], opens: "10:00", closes: "16:00" },
    ],
    priceRange: "$$",
    hasMap: "https://maps.google.com/?q=BraidsInBorås",
    sameAs: [
      "https://www.instagram.com/braidsinboras",
      "https://www.facebook.com/braidsinboras",
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
}