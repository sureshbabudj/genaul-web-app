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
  children?: React.ReactNode;
}

export const SEO = ({
  title = "Genaul | Your Private Workspace",
  description = "Organize your mind with Genaul. A lightning fast local first markdown workspace and note taking app that gives you data sovereignty. Get started free. ✓",
  keywords = "local first notes, markdown editor, knowledge base, obsidian alternative, private workspace, note taking app, local first software, personal knowledge management, second brain, privacy focused notes",
  canonical = "https://genaul.com",
  ogType = "website",
  ogImage = "https://genaul.com/og-image-v2.png", // Replace with actual OG image
  twitterHandle = "@sureshbabudj",
  noindex = false,
  children,
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
          "@type": ["WebApplication", "SoftwareApplication"],
          name: "Genaul",
          url: "https://genaul.com",
          description: description,
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          abstract: "A local first markdown editor and private knowledge base.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        })}
      </script>
      {children}
    </Helmet>
  );
};
