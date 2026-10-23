import type { MetadataRoute } from "next";

const siteUrl = "https://instafitcore.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/site/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/site/about/`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/site/services/`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/site/contact/`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/site/career/`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${siteUrl}/site/privacy/`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/site/terms/`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
