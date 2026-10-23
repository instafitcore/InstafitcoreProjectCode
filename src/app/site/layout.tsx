import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import { ToastProvider } from "@/components/Toast";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ToastProvider>
      <div className="bg-gray-50 min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HomeAndConstructionBusiness",
              name: "InstaFitCore Solutions Private Limited",
              url: "https://instafitcore.com/site/",
              email: "Customersupport@instafitcore.com",
              telephone: "+91 7411443233",
              areaServed: { "@type": "City", name: "Bengaluru" },
              address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
              sameAs: [
                "https://www.facebook.com/profile.php?id=61585466767139",
                "https://www.linkedin.com/company/110891163/",
              ],
            }),
          }}
        />
        <Navbar />
        <main className="px-6 py-10">{children}</main>
        <FloatingWhatsApp />
        <Footer />
      </div>
    </ToastProvider>
  );
}
