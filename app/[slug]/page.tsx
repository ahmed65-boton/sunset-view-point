import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, FileText, Images, Quote, Sparkles } from "lucide-react";

import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/firebase/admin";
import { cn } from "@/lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type CmsPageBlockType = "richText" | "h1" | "imageText" | "cards" | "gallery" | "quote" | "cta" | "divider";
type CmsImagePosition = "left" | "right";

type CmsPageSection = {
  type?: CmsPageBlockType;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  body?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: CmsImagePosition;
  ctaLabel?: string;
  ctaHref?: string;
};

const reservedSlugs = new Set(["api", "booking", "cms", "contact", "login", "members", "sign-up"]);
const validBlockTypes: CmsPageBlockType[] = ["h1", "richText", "imageText", "cards", "gallery", "quote", "cta", "divider"];

async function getCmsPageBySlug(slug: string) {
  if (reservedSlugs.has(slug)) return null;
  const snap = await db
    .collection("cmsPages")
    .where("slug", "==", slug)
    .where("isPublished", "==", true)
    .limit(1)
    .get();
  return snap.empty ? null : snap.docs[0];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const doc = await getCmsPageBySlug(slug);
  if (!doc) return {};

  const data = doc.data();
  const title = String(data.title ?? "Sunset View Point");
  const description = String(data.description ?? "Visit Sunset View Point in Quetta.");
  const heroImage = String(data.heroImage ?? "");

  return {
    title: `${title} | Sunset View Point`,
    description,
    openGraph: {
      title: `${title} | Sunset View Point`,
      description,
      images: heroImage ? [{ url: heroImage }] : undefined,
    },
  };
}

function paragraphs(value: string) {
  return value
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function lines(value: string) {
  return value
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function normalizeBlock(section: CmsPageSection): Required<CmsPageSection> {
  const type = validBlockTypes.includes(section.type as CmsPageBlockType) ? (section.type as CmsPageBlockType) : "richText";
  return {
    type,
    eyebrow: String(section.eyebrow ?? ""),
    heading: String(section.heading ?? ""),
    subheading: String(section.subheading ?? ""),
    body: String(section.body ?? ""),
    image: String(section.image ?? ""),
    imageAlt: String(section.imageAlt ?? ""),
    imagePosition: section.imagePosition === "left" ? "left" : "right",
    ctaLabel: String(section.ctaLabel ?? ""),
    ctaHref: String(section.ctaHref ?? ""),
  };
}

function hasVisibleContent(block: Required<CmsPageSection>) {
  if (block.type === "divider") return true;
  return Boolean(block.eyebrow || block.heading || block.subheading || block.body || block.image || block.ctaLabel);
}

function renderButton(block: Required<CmsPageSection>, className = "mt-6") {
  if (!block.ctaLabel || !block.ctaHref) return null;
  return (
    <Button asChild className={className}>
      <Link href={block.ctaHref}>
        {block.ctaLabel} <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}

function renderTextBody(body: string) {
  return paragraphs(body).map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>);
}

function renderPageBlock(block: Required<CmsPageSection>, index: number) {
  if (block.type === "divider") {
    return <div key={index} className="mx-auto h-px max-w-5xl bg-gradient-to-r from-transparent via-border to-transparent" />;
  }

  if (block.type === "h1") {
    return (
      <section key={index} className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card p-6 shadow-xl shadow-primary/10 sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,183,77,0.22),transparent_24rem)]" />
        <div className="relative max-w-4xl">
          {block.eyebrow && <span className="section-kicker"><Sparkles className="mr-2 h-3.5 w-3.5" /> {block.eyebrow}</span>}
          {block.heading && <h2 className="mt-4 text-balance text-4xl font-black tracking-tight text-foreground md:text-6xl">{block.heading}</h2>}
          {block.subheading && <p className="mt-5 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground">{block.subheading}</p>}
          {block.body && <div className="mt-5 space-y-4 text-base leading-8 text-muted-foreground">{renderTextBody(block.body)}</div>}
          {renderButton(block)}
        </div>
      </section>
    );
  }

  if (block.type === "imageText") {
    const imageNode = block.image ? (
      <div className="relative min-h-72 overflow-hidden rounded-[1.5rem] border border-border/70 bg-muted">
        <Image src={block.image} alt={block.imageAlt || block.heading || "Sunset View Point"} fill className="object-cover" />
      </div>
    ) : null;

    const textNode = (
      <div className="p-6 sm:p-8 lg:p-10">
        {block.eyebrow && <span className="section-kicker mb-4">{block.eyebrow}</span>}
        {block.heading && <h2 className="text-balance text-3xl font-black tracking-tight text-foreground md:text-4xl">{block.heading}</h2>}
        {block.subheading && <p className="mt-3 text-base leading-7 text-muted-foreground">{block.subheading}</p>}
        {block.body && <div className="mt-5 space-y-4 text-base leading-8 text-muted-foreground">{renderTextBody(block.body)}</div>}
        {renderButton(block)}
      </div>
    );

    return (
      <Card key={index} className="surface-card overflow-hidden">
        <CardContent className="grid gap-0 p-0 lg:grid-cols-2">
          {block.imagePosition === "left" ? <>{imageNode}{textNode}</> : <>{textNode}{imageNode}</>}
        </CardContent>
      </Card>
    );
  }

  if (block.type === "cards") {
    const cards = lines(block.body).map((line) => {
      const [title = "", text = "", label = "", href = "", image = ""] = line.split("|").map((part) => part.trim());
      return { title, text, label, href, image };
    }).filter((item) => item.title || item.text || item.image);

    return (
      <section key={index} className="space-y-6">
        <div className="text-center">
          {block.eyebrow && <span className="section-kicker mx-auto mb-4">{block.eyebrow}</span>}
          {block.heading && <h2 className="text-balance text-3xl font-black tracking-tight text-foreground md:text-5xl">{block.heading}</h2>}
          {block.subheading && <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">{block.subheading}</p>}
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {(cards.length ? cards : [{ title: block.heading, text: block.subheading || block.body, label: block.ctaLabel, href: block.ctaHref, image: block.image }]).map((card, cardIndex) => (
            <Card key={cardIndex} className="surface-card h-full overflow-hidden">
              {card.image && (
                <div className="relative h-44 border-b border-border/70 bg-muted">
                  <Image src={card.image} alt={card.title || "Sunset View Point card image"} fill className="object-cover" />
                </div>
              )}
              <CardContent className="flex h-full flex-col p-6">
                {card.title && <h3 className="text-xl font-black text-foreground">{card.title}</h3>}
                {card.text && <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">{card.text}</p>}
                {card.label && card.href && (
                  <Button asChild variant="outline" className="mt-5 w-fit">
                    <Link href={card.href}>{card.label}</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (block.type === "gallery") {
    const images = [block.image, ...lines(block.body)].filter(Boolean);
    return (
      <section key={index} className="space-y-6">
        <div>
          {block.eyebrow && <span className="section-kicker mb-4"><Images className="mr-2 h-3.5 w-3.5" /> {block.eyebrow}</span>}
          {block.heading && <h2 className="text-balance text-3xl font-black tracking-tight text-foreground md:text-5xl">{block.heading}</h2>}
          {block.subheading && <p className="mt-3 max-w-2xl text-muted-foreground">{block.subheading}</p>}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {images.map((src, imageIndex) => (
            <div key={`${src}-${imageIndex}`} className="relative min-h-64 overflow-hidden rounded-[1.5rem] border border-border/70 bg-muted shadow-sm">
              <Image src={src} alt={block.imageAlt || block.heading || "Gallery image"} fill className="object-cover transition duration-500 hover:scale-105" />
            </div>
          ))}
        </div>
        {renderButton(block, "mt-0")}
      </section>
    );
  }

  if (block.type === "quote") {
    return (
      <Card key={index} className="surface-card overflow-hidden bg-primary text-primary-foreground">
        <CardContent className="p-8 sm:p-10">
          <Quote className="mb-5 h-8 w-8 opacity-80" />
          {block.eyebrow && <p className="text-xs font-black uppercase tracking-[0.28em] opacity-80">{block.eyebrow}</p>}
          {block.heading && <h2 className="mt-3 text-balance text-3xl font-black tracking-tight md:text-5xl">{block.heading}</h2>}
          {block.body && <div className="mt-5 space-y-4 text-base leading-8 opacity-90">{renderTextBody(block.body)}</div>}
          {renderButton(block)}
        </CardContent>
      </Card>
    );
  }

  if (block.type === "cta") {
    return (
      <section key={index} className="rounded-[2rem] border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-card p-6 text-center shadow-xl shadow-primary/10 sm:p-10">
        {block.eyebrow && <span className="section-kicker mx-auto mb-4">{block.eyebrow}</span>}
        {block.heading && <h2 className="mx-auto max-w-3xl text-balance text-3xl font-black tracking-tight text-foreground md:text-5xl">{block.heading}</h2>}
        {block.subheading && <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">{block.subheading}</p>}
        {block.body && <div className="mx-auto mt-5 max-w-2xl space-y-4 text-muted-foreground">{renderTextBody(block.body)}</div>}
        {renderButton(block)}
      </section>
    );
  }

  return (
    <Card key={index} className="surface-card overflow-hidden">
      <CardContent className="p-6 sm:p-8 lg:p-10">
        {block.eyebrow && <span className="section-kicker mb-4">{block.eyebrow}</span>}
        {block.heading && <h2 className="text-balance text-3xl font-black tracking-tight text-foreground md:text-4xl">{block.heading}</h2>}
        {block.subheading && <p className="mt-3 text-base leading-7 text-muted-foreground">{block.subheading}</p>}
        {block.body && <div className="mt-5 space-y-4 text-base leading-8 text-muted-foreground">{renderTextBody(block.body)}</div>}
        {renderButton(block)}
      </CardContent>
    </Card>
  );
}

export default async function DynamicCmsPage({ params }: PageProps) {
  const { slug } = await params;
  const doc = await getCmsPageBySlug(slug);

  if (!doc) notFound();

  const data = doc.data();
  const title = String(data.title ?? "Sunset View Point");
  const kicker = String(data.kicker ?? "Sunset View Point");
  const description = String(data.description ?? "");
  const heroImage = String(data.heroImage ?? "/sunset.jpg");
  const sections = Array.isArray(data.sections) ? (data.sections as CmsPageSection[]).map(normalizeBlock).filter(hasVisibleContent) : [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main>
        <section className="relative isolate overflow-hidden py-24 text-white md:py-36">
          <Image src={heroImage || "/sunset.jpg"} alt="" fill className="-z-20 object-cover" priority />
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black/80 via-black/55 to-primary/35" />
          <div className="svp-container">
            <span className="inline-flex items-center rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-primary-foreground backdrop-blur">
              <FileText className="mr-2 h-3.5 w-3.5" /> {kicker}
            </span>
            <h1 className="mt-6 max-w-5xl text-balance text-5xl font-black tracking-tight md:text-7xl">{title}</h1>
            {description && <p className="mt-5 max-w-2xl text-pretty text-base leading-8 text-white/85 md:text-lg">{description}</p>}
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="svp-container space-y-10">
            {sections.length ? (
              sections.map((section, index) => renderPageBlock(section, index))
            ) : (
              <Card className="surface-card">
                <CardContent className="p-8 text-center text-muted-foreground">This page is published but has no builder blocks yet. Add blocks from CMS → Pages.</CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
