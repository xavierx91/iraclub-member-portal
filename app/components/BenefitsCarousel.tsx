"use client";

import { useRef } from "react";

const benefits = [
  {
    name: "Investor's Row",
    offer: "$70 Off Your Asset Fee",
    description:
      "Discounted access to Investor's Row for browsing alternative asset opportunities for inspiration.",
    logo: "/member-assets/investors-row.png",
    href: "/dashboard/investors-row",
  },
  {
    name: "IRA Club SBS",
    offer: "50% Off Any Small Business Plan",
    description:
      "50% off for members who are also small business owners who need a flexible, scalable retirement plan.",
    logo: "/member-assets/sbs.png",
    href: "/dashboard/sbs",
  },
  {
    name: "iFlip",
    offer: "Additional SmartFolios Access For Free",
    description:
      "Exclusive access to additional SmartFolio options not available to most.",
    logo: "/member-assets/iflip.png",
    href: "#",
  },
  {
    name: "CapitalQuest",
    offer: "Free Due Diligence with CapitalQuest",
    description:
      "Investor's Pro members get access to CapitalQuest's AI-assisted due diligence tools to support their independent evaluation of alternative investment opportunities.",
    logo: "/member-assets/capitalquest.jpg",
    href: "/dashboard/capitalquest",
  },
];

export default function BenefitsCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    const card =
      carousel.querySelector<HTMLElement>(".pro-benefit-card");

    const scrollAmount = card
      ? card.offsetWidth + 24
      : carousel.clientWidth * 0.8;

    carousel.scrollBy({
      left:
        direction === "left"
          ? -scrollAmount
          : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className="pro-benefit-carousel-wrap">
      {/* LEFT ARROW */}
      <button
        type="button"
        className="pro-carousel-arrow pro-carousel-arrow-left"
        onClick={() => scroll("left")}
        aria-label="Previous member benefits"
      >
        &lsaquo;
      </button>

      {/* BENEFIT CARDS */}
      <div
        ref={carouselRef}
        className="pro-benefit-carousel"
      >
        {benefits.map((benefit) => (
          <article
            className="pro-benefit-card"
            key={benefit.name}
          >
            <div className="pro-benefit-logo">
              <img
                src={benefit.logo}
                alt={benefit.name}
              />
            </div>

            <h3>{benefit.offer}</h3>

            <p>{benefit.description}</p>

            <a
              className="pro-access-link"
              href={benefit.href}
            >
              Access &rarr;
            </a>
          </article>
        ))}
      </div>

      {/* RIGHT ARROW */}
      <button
        type="button"
        className="pro-carousel-arrow pro-carousel-arrow-right"
        onClick={() => scroll("right")}
        aria-label="Next member benefits"
      >
        &rsaquo;
      </button>
    </div>
  );
}
