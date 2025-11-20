/**
 * JsonLd Component
 * Safely injects JSON-LD structured data into page head
 * Usage: <JsonLd schema={getArticleSchema(...)} />
 */

interface JsonLdProps {
  schema: Record<string, any>;
}

export function JsonLd({ schema }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
      suppressHydrationWarning
    />
  );
}

export default JsonLd;
