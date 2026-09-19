import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ToastViewport from "@/components/ui/Toast";
import Shell from "@/components/travel-tools/Shell";
import FlightForm from "@/components/travel-tools/FlightForm";
import HotelForm from "@/components/travel-tools/HotelForm";
import MateTab from "@/components/travel-tools/MateTab";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const TITLE = "통합 여행 준비 - Free Traveler";
const DESCRIPTION = "항공·숙소 조건을 확인하고 외부 서비스로 이동하거나, 동행을 구하는 글을 남겨보세요.";

export function generateMetadata(): Metadata {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: `${SITE_URL}/travel-tools` },
    openGraph: {
      title: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}/travel-tools`,
      type: "website",
    },
  };
}

export default function TravelToolsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-[1280px] px-4 py-10 md:px-8 md:py-16">
        <Shell flightPanel={<FlightForm />} hotelPanel={<HotelForm />} matePanel={<MateTab />} />
      </main>
      <Footer />
      <ToastViewport />
    </>
  );
}
