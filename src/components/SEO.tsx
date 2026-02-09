import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogType?: string;
  ogImage?: string;
  twitterHandle?: string;
  noindex?: boolean;
}

export const SEO = ({
  title = "Genaul | Capture. Learn. Master.",
  description = "Genaul is a modern study space for effortless learning using the FSRS algorithm. Capture knowledge instantly, organize intelligently, and remember effortlessly.",
  keywords = "Genaul, SRS, FSRS, spaced repetition, learning, study, flashcards, knowledge management, LaTeX, code snippets, memory palace, cognitive growth, study app",
  canonical = "https://genaul.com", // Replace with actual domain if known
  ogType = "website",
  ogImage = "https://genaul.com/og-image.png", // Replace with actual OG image
  twitterHandle = "@genaul",
  noindex = false,
}: SEOProps) => {
  const siteName = "Genaul";
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content={twitterHandle} />
      <meta name="twitter:creator" content={twitterHandle} />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "Genaul",
          url: "https://genaul.com",
          description: description,
          applicationCategory: "EducationalApplication",
          operatingSystem: "Web",
          abstract:
            "A modern SRS platform using FSRS algorithm for better retention.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        })}
      </script>
    </Helmet>
  );
};
