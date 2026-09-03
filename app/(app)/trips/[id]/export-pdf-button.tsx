"use client";

import { useState } from "react";
import type { HotelOption, RecommendationSet, Trip, TransportOption } from "@/lib/types";

interface ExportPdfButtonProps {
  trip: Trip;
  recommendations: RecommendationSet;
  topHotel?: HotelOption;
  topTransport?: TransportOption;
}

export function ExportPdfButton({
  trip,
  recommendations,
  topHotel,
  topTransport,
}: ExportPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleExport() {
    setIsGenerating(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "letter" });
      const marginX = 48;
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 56;

      const ensureSpace = (lineHeight: number) => {
        if (y + lineHeight > pageHeight - 48) {
          doc.addPage();
          y = 56;
        }
      };

      const heading = (text: string) => {
        ensureSpace(28);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(text, marginX, y);
        y += 20;
      };

      const paragraph = (text: string, size = 10.5) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(size);
        const lines = doc.splitTextToSize(text, pageWidth - marginX * 2);
        for (const line of lines) {
          ensureSpace(16);
          doc.text(line, marginX, y);
          y += 16;
        }
      };

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text(`TripPlanner Itinerary: ${trip.destination ?? "Your trip"}`, marginX, y);
      y += 28;

      paragraph(
        `Dates: ${trip.start_date} to ${trip.end_date}  |  Budget: ${trip.budget_range}` +
          (trip.purpose ? `  |  Purpose: ${trip.purpose}` : ""),
      );
      y += 8;

      if (topHotel) {
        heading("Top hotel pick");
        paragraph(
          `${topHotel.name} (${topHotel.city}) — ${"*".repeat(topHotel.star_rating)} — $${topHotel.price_per_night}/night`,
        );
        paragraph(`Amenities: ${topHotel.amenities.join(", ")}`);
        y += 6;
      }

      if (topTransport) {
        heading("Top flight pick");
        paragraph(
          `${topTransport.airline} — ${topTransport.cabin_class} — ${
            topTransport.direct ? "Direct" : "Connecting"
          } — $${topTransport.price}`,
        );
        y += 6;
      }

      heading("Day-by-day itinerary");
      let totalItineraryCost = 0;
      for (const itinerary of recommendations.itinerary_options.slice(0, 1)) {
        totalItineraryCost += itinerary.estimated_cost;
        paragraph(`${itinerary.title} (est. $${itinerary.estimated_cost})`, 12);
        for (const day of itinerary.days) {
          paragraph(`Day ${day.day}: ${day.activities.join(", ")}`);
        }
      }
      y += 6;

      const total =
        (topHotel?.price_per_night ?? 0) +
        (topTransport?.price ?? 0) +
        totalItineraryCost;
      heading("Estimated total cost");
      paragraph(
        `Hotel (1 night shown): $${topHotel?.price_per_night ?? 0}  +  Flight: $${
          topTransport?.price ?? 0
        }  +  Itinerary: $${totalItineraryCost}  =  $${total}`,
      );

      doc.save(`trip-${trip.id}.pdf`);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isGenerating}
      className="btn-pill btn-primary text-sm disabled:opacity-60"
    >
      {isGenerating ? "Generating PDF..." : "Export PDF"}
    </button>
  );
}
