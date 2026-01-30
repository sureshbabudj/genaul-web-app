import React, { useMemo } from "react";

import DOMPurify from "dompurify";
import type { Config } from "dompurify";

type Props = React.HTMLAttributes<HTMLDivElement> & { html: string };

const ALLOWED_IFRAME_HOSTS = ["www.youtube.com", "player.vimeo.com"];

function isSafeIframeSrc(url: string) {
  try {
    const u = new URL(url);
    return ALLOWED_IFRAME_HOSTS.includes(u.hostname);
  } catch {
    return false;
  }
}

export default function SafeHTML({ html, className, ...rest }: Props) {
  const clean = useMemo(() => {
    // Configure DOMPurify
    const cfg: Config = {
      // Only allow the tags you need; extend as your editor outputs evolve
      ALLOWED_TAGS: [
        "div",
        "p",
        "strong",
        "em",
        "u",
        "s",
        "a",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "blockquote",
        "code",
        "pre",
        "ul",
        "ol",
        "li",
        "span",
        "br",
        "iframe", // allow only if src is safe (see below)
      ],
      ALLOWED_ATTR: [
        "class",
        "style",
        "data-embed",
        "href",
        "target",
        "rel",
        "src",
        "title",
        "allow",
        "allowfullscreen",
        "frameborder",
      ],
      // Optional: enforce HTML profile only
      USE_PROFILES: { html: true },
      // Forbid dangerous protocols (DOMPurify does this by default)
      FORBID_ATTR: ["onerror", "onclick", "onload"], // belt & suspenders
    };

    // Hook to validate iframe src & normalize <a target="_blank">
    DOMPurify.addHook("uponSanitizeElement", (node, data) => {
      if (data.tagName === "iframe") {
        const src = (node as Element).getAttribute("src") || "";
        if (!isSafeIframeSrc(src)) {
          // Replace unsafe iframe with a plain link to the URL
          const a = node.ownerDocument!.createElement("a");
          a.setAttribute("href", src || "#");
          a.setAttribute("rel", "noopener noreferrer");
          a.setAttribute("target", "_blank");
          a.textContent = src || "link";
          node.parentNode?.replaceChild(a, node);
        } else {
          // Hard-set the attributes you expect
          (node as Element).setAttribute("allowfullscreen", "true");
          (node as Element).setAttribute("frameborder", "0");
          (node as Element).setAttribute(
            "allow",
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          );
        }
      }
    });

    DOMPurify.addHook("afterSanitizeAttributes", (node) => {
      // Auto-fix external links
      if (node.tagName === "A") {
        const href = (node as Element).getAttribute("href") || "";
        if (/^https?:\/\//i.test(href)) {
          // Many browsers already imply noopener for _blank, but keep for legacy
          (node as Element).setAttribute("rel", "noopener noreferrer");
          (node as Element).setAttribute("target", "_blank");
        }
      }
    });

    return DOMPurify.sanitize(html, cfg);
  }, [html]);

  // It’s safe now: we sanitized above
  return (
    <div
      dangerouslySetInnerHTML={{ __html: clean }}
      className={`prose ${className}`}
      {...rest}
    />
  );
}
