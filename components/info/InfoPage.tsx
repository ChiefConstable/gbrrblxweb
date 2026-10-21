import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

/** Page shell for content pages: split hero (title left, photo right), then the page body. */
export default function InfoPage({
  title,
  intro,
  image,
  children,
}: {
  title: string;
  intro?: string;
  image?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="pt-16">
        <section className={`grid bg-brand-dark ${image ? "lg:grid-cols-2" : ""}`}>
          <div className="flex items-center px-6 py-16 sm:px-12 lg:min-h-[400px] lg:py-20">
            <div className={`mx-auto w-full ${image ? "max-w-xl lg:ml-auto lg:mr-12" : "max-w-6xl"}`}>
              <h1 className="text-4xl leading-tight text-white sm:text-5xl">{title}</h1>
              {intro && <p className="mt-5 max-w-xl text-base leading-8 text-white/80">{intro}</p>}
            </div>
          </div>
          {image && (
            <div className="relative hidden min-h-[400px] bg-brand-heading lg:block">
              <Image src={image} alt="" fill priority sizes="50vw" className="object-cover" />
            </div>
          )}
        </section>
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}

/** A heading with the short green underline used across the site. */
export function SectionTitle({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <div className={center ? "text-center" : ""}>
      <h2 className="text-2xl sm:text-3xl">{children}</h2>
      <div className={`mt-3 h-0.5 w-12 bg-brand-green ${center ? "mx-auto" : ""}`} />
    </div>
  );
}

/** Image on one side, text on the other. */
export function TextImage({
  title,
  image,
  imageAlt,
  reverse = false,
  children,
}: {
  title: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 md:grid-cols-2">
      <div className={`relative aspect-[16/10] overflow-hidden rounded-sm bg-gray-200 ${reverse ? "md:order-2" : ""}`}>
        <Image src={image} alt={imageAlt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
      </div>
      <div>
        <SectionTitle>{title}</SectionTitle>
        <div className="mt-6 space-y-4 text-sm leading-7">{children}</div>
      </div>
    </section>
  );
}

/** Grey band with centred heading and text. */
export function Band({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-gray-100 py-16">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <SectionTitle center>{title}</SectionTitle>
        <div className="mt-6 space-y-4 text-sm leading-7">{children}</div>
      </div>
    </section>
  );
}

/** Long-form text for policy pages. */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14 text-sm leading-7 [&_a]:font-semibold [&_a]:text-brand-green [&_a]:underline [&_h2]:mt-10 [&_h2]:text-xl [&_h3]:mt-6 [&_h3]:text-base [&_li]:mt-1 [&_p]:mt-4 [&_table]:mt-4 [&_table]:w-full [&_td]:border [&_td]:border-gray-200 [&_td]:p-2 [&_td]:align-top [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-50 [&_th]:p-2 [&_th]:text-left [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
      {children}
    </div>
  );
}
