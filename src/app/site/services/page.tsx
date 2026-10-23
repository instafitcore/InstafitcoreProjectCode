import type { Metadata } from "next";
import ServicesPageContent from "./ServicesPageContent";

export const metadata: Metadata = {
  title: "Furniture Installation, Repair & Home Services",
  description:
    "Explore InstaFitCore furniture installation, dismantling, repair, modular furniture, kitchen, relocation, and B2B services in Bengaluru.",
  alternates: { canonical: "/site/services/" },
};

export default function ServicesPage() {
  return <ServicesPageContent />;
}
