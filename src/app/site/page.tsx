import type { Metadata } from "next";
import HomePageContent from "./HomePageContent";

export const metadata: Metadata = {
  title: "Furniture Installation & Home Services in Bengaluru",
  description:
    "Book furniture installation, dismantling, repair, modular kitchen setup, and relocation services in Bengaluru with InstaFitCore.",
  alternates: { canonical: "/site/" },
};

export default function HomePage() {
  return <HomePageContent />;
}
