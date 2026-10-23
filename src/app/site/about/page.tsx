import type { Metadata } from "next";
import AboutPageContent from "./AboutPageContent";

export const metadata: Metadata = {
  title: "About | Furniture Services in Bengaluru",
  description:
    "Meet InstaFitCore Solutions, Bengaluru's furniture installation, modular kitchen, dismantling, repair, and B2B execution partner.",
  alternates: { canonical: "/site/about/" },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
