"use client";

import { useState } from "react";

type EventCategory =
  | "Free"
  | "Member Rate"
  | "Livestream"
  | "In Person";

type MemberEvent = {
  id: number;
  month: string;
  day: string;
  title: string;
  type: string;
  location: string;
  description: string;
  price: string;
  rate: string;
  categories: EventCategory[];
  href: string;
};

const events: MemberEvent[] = [
  {
    id: 1,
    month: "SEP",
    day: "11",
    title: "REI Kickstart Summit with Aaron Adams",
    type: "Livestream",
    location: "12PM CT",
    description:
      "This livestream event covers everything from property selection and acquisition to effective property management and tenant screening.",
    price: "FREE",
    rate: "Free for members",
    categories: ["Free", "Livestream"],
    href: "#",
  },
  {
    id: 2,
    month: "OCT",
    day: "09",
    title: "Idaho REICON",
    type: "In Person",
    location: "Boise, ID",
    description:
      "Join Idaho's real estate community for a full day of networking, education and deal-making.",
    price: "$99",
    rate: "Member rate",
    categories: ["Member Rate", "In Person"],
    href: "#",
  },
];

const filters = [
  "All Events",
  "Free",
  "Member Rate",
  "Livestream",
  "In Person",
] as const;

export default function EventsClient() {
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]>("All Events");

  const filteredEvents =
    activeFilter === "All Events"
      ? events
      : events.filter((event) =>
          event.categories.includes(
            activeFilter as EventCategory
          )
        );

  return (
    <>
      <div className="pro-event-filters">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            className={
              activeFilter === filter
                ? "pro-filter-active"
                : ""
            }
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="pro-events">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <article
              className="pro-event"
              key={event.id}
            >
              <div className="pro-event-date">
                <span>{event.month}</span>
                <strong>{event.day}</strong>
              </div>

              <div className="pro-event-info">
                <h3>{event.title}</h3>

                <strong>
                  {event.type} | {event.location}
                </strong>

                <p>{event.description}</p>
              </div>

              <div className="pro-event-price">
                <strong>{event.price}</strong>
                <span>{event.rate}</span>

                <a href={event.href}>
                  Register
                </a>
              </div>
            </article>
          ))
        ) : (
          <div className="pro-no-events">
            <h3>No events found</h3>

            <p>
              There are currently no events matching
              this filter.
            </p>
          </div>
        )}
      </div>
    </>
  );
}