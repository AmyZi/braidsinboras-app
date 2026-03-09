// next-sitemap.config.js
module.exports = {
  siteUrl: "https://braidsinboras.se",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: "weekly",
  priority: 0.7,
  exclude: ["/api/*", "/boka/bekraftelse"],
  additionalPaths: async (config) => {
    const services = await fetchAllServices(); // from WP
    return services.map((s) => ({
      loc: `/services/${s.slug}`,
      lastmod: s.modified,
      priority: 0.9,
      changefreq: "monthly",
    }));
  },
  robotsTxtOptions: {
    additionalSitemaps: ["https://braidsinboras.se/sitemap.xml"],
    policies: [{ userAgent: "*", allow: "/" }],
  },
};