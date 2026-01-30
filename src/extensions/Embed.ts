import { Node, nodePasteRule } from "@tiptap/core";

type Provider = "youtube" | "vimeo" | "generic";

const YT_REGEX =
  /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/i;
const VIMEO_REGEX = /^(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/i;

// Accept bare domains like google.com and normalize to https://
const DOMAIN_REGEX =
  /^(?:https?:\/\/)?(?:[\w-]+\.)+[a-z]{2,}(?::\d{2,5})?(?:[/?#][^\s]*)?$/i;

const toYouTube = (url: string) => {
  const m = url?.match(YT_REGEX);
  return m ? `https://www.youtube.com/embed/${m[1]}` : null;
};
const toVimeo = (url: string) => {
  const m = url?.match(VIMEO_REGEX);
  return m ? `https://player.vimeo.com/video/${m[1]}` : null;
};

function normalizeUrl(input: string): string | null {
  if (!input) return null;
  let s = input.trim();
  if (s.startsWith("<") && s.endsWith(">")) s = s.slice(1, -1);
  if (/^https?:\/\//i.test(s)) return s;
  if (DOMAIN_REGEX.test(s)) return `https://${s}`;
  return null;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    embed: {
      insertEmbedFromUrl: (url: string) => ReturnType;
    };
  }
}

export const Embed = Node.create({
  name: "embed",
  group: "block",
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      src: { default: "" },
      provider: { default: "generic" as Provider },
      title: { default: "embed" },
    };
  },

  // Parse your existing markup with <div data-embed>…</div>
  parseHTML() {
    return [
      {
        tag: "div[data-embed]",
        getAttrs: (el) => {
          const element = el as HTMLElement;
          const href = element.querySelector("a")?.getAttribute("href") || "";
          const iframeSrc =
            element.querySelector("iframe")?.getAttribute("src") || "";
          const url = normalizeUrl(href || iframeSrc || "") || "";
          let provider: Provider = "generic";
          if (/youtu\.?be|youtube\.com/.test(url)) provider = "youtube";
          else if (/vimeo\.com/.test(url)) provider = "vimeo";
          return { src: url, provider, title: provider };
        },
      },
    ];
  },

  // 🔴 Always render a <div data-embed> wrapper (symmetrical with parseHTML)
  // and never return falsy children.
  renderHTML({ HTMLAttributes }) {
    const { provider, src } = HTMLAttributes as {
      provider: Provider;
      src: string;
    };

    if (provider === "youtube" || provider === "vimeo") {
      return [
        "div",
        {
          "data-embed": "",
          class: "my-3 rounded border border-zinc-200 overflow-hidden",
        },
        [
          "iframe",
          {
            src: src || "",
            title: provider,
            class: "w-full h-[360px] bg-black",
            frameborder: "0",
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
            allowfullscreen: "true",
          },
        ],
      ];
    }

    // Generic "link card" – still inside the same <div data-embed> wrapper
    return [
      "div",
      {
        "data-embed": "",
        class: "my-3 rounded border border-zinc-200 bg-white p-3 shadow-sm",
      },
      [
        "a",
        {
          href: src || "#",
          class: "block truncate text-blue-600 hover:underline",
          target: "_blank",
          rel: "noopener noreferrer nofollow",
        },
        src || "link",
      ],
    ];
  },

  addCommands() {
    return {
      insertEmbedFromUrl:
        (raw: string) =>
        ({ chain }) => {
          const normalized = normalizeUrl(raw);
          if (!normalized) return false;

          let provider: Provider = "generic";
          let src: string | null = toYouTube(normalized);
          if (src) provider = "youtube";
          else {
            src = toVimeo(normalized);
            if (src) provider = "vimeo";
          }
          if (!src) src = normalized;

          return chain()
            .focus()
            .insertContent({
              type: this.name,
              attrs: { src, provider, title: provider },
            })
            .run();
        },
    };
  },

  addPasteRules() {
    // Entire line is a URL or domain ⇒ convert to embed block
    return [
      nodePasteRule({
        find: /^(?:https?:\/\/)?(?:[\w-]+\.)+[a-z]{2,}(?::\d{2,5})?(?:[/?#][^\s]*)?$/i,
        type: this.type,
        getAttributes: (match) => {
          const normalized = normalizeUrl(match[0]) || "";
          let provider: Provider = "generic";
          let src = toYouTube(normalized);
          if (src) provider = "youtube";
          else {
            src = toVimeo(normalized);
            if (src) provider = "vimeo";
          }
          if (!src) src = normalized;
          return { src, provider, title: provider };
        },
      }),
    ];
  },
});
