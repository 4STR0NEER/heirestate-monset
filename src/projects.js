// The five projects side by side in the hero, left to right. "soon" marks the two
// not yet announced; replace one with a project id when it launches.
export const showcase = ["alto", "wave", "pristina", "soon", "soon"];

const P = "/media/p";

// Project pages. Every fact comes from the client's material: render labels (Alto),
// the brochure (The Wave) and the walkthrough films. Lines marked "ours" are descriptive
// copy written from the footage, pending the client's own text.
export const projects = {
  alto: {
    name: "Alto Ranudo",
    accent: "var(--color-teal)",
    hero: `${P}/alto-hero`,
    panel: `${P}/alto-panel`,
    film: `${P}/alto-film`,
    tagline: "Twin towers above the city",
    // ours: described from the walkthrough
    statement:
      "Two residential towers rise above a podium of shops and cafés, wrapped in a timber lattice that softens the light. Above the street, a sky deck of pools, gardens and rooms for gathering.",
    facts: [
      ["Architect", "Casas Architects"],
      ["Adult pool", "170 sqm"],
      ["Function room", "73.07 sqm"],
      ["Kid's playroom", "29.64 sqm"],
      ["Kiddie pool", "25 sqm"],
    ],
    spaces: [
      { src: `${P}/alto-2.jpg`, name: "Adult Pool", area: "170 sqm" },
      { src: `${P}/alto-3.jpg`, name: "Kiddie Pool", area: "25 sqm" },
      { src: `${P}/alto-4.jpg`, name: "Amenity Lounge Area" },
      { src: `${P}/alto-1.jpg`, name: "Kid's Playroom", area: "29.64 sqm" },
      { src: `${P}/alto-5.jpg`, name: "Function Room", area: "73.07 sqm" },
      { src: `${P}/alto-6.jpg`, name: "Function Room, set for an event", area: "73.07 sqm" },
    ],
  },

  wave: {
    name: "The Wave",
    accent: "var(--color-navy)",
    hero: `${P}/wave-hero`,
    panel: `${P}/wave-panel`,
    film: `${P}/wave-film`,
    tagline: "A New Wave of Living",
    kicker: "Rooted in Japan, rising from Cebu",
    statement:
      "Set against the vibrant backdrop of Cebu, it stands as a testament to the harmonious blend of Japanese minimalism and Filipino warmth, an invitation to experience a lifestyle where serenity is strength.",
    facts: [
      ["Location", "Cebu I.T. Park, Cebu City"],
      ["Tower", "40 storeys, 35 residential floors"],
      ["Residences", "709 units"],
      ["Elevators", "5"],
      ["Back-up power", "100%"],
      ["Hallways", "1.50 m to 1.80 m wide"],
      ["Developer", "CLNUD Ventures: Cebu Landmasters with NTT UD Asia"],
    ],
    spaces: [
      { src: `${P}/wave-dropoff.jpg`, name: "Drop Off Area" },
      { src: `${P}/wave-lobby.jpg`, name: "Main Lobby" },
      { src: `${P}/wave-pool.jpg`, name: "Swimming Pool", area: "6th floor" },
      { src: `${P}/wave-garden.jpg`, name: "Japanese Garden", area: "6th floor" },
      { src: `${P}/wave-function.jpg`, name: "Function Hall", area: "6th floor" },
      { src: `${P}/wave-theater.jpg`, name: "Theater Room", area: "6th floor" },
      { src: `${P}/wave-lounge.jpg`, name: "Lounge Hall", area: "6th floor" },
      { src: `${P}/wave-gym.jpg`, name: "Fitness Gym", area: "37th floor" },
      { src: `${P}/wave-library.jpg`, name: "Library Lounge", area: "37th floor" },
    ],
    residences: {
      "Two bedroom": [1, 2, 3, 4, 5, 6, 7].map((n) => `${P}/unit-${n}2BR.jpg`),
      "Three bedroom": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => `${P}/unit-${n}3BR.jpg`),
    },
    nearby: [
      ["Ayala Central Bloc", 0.22],
      ["Cebu Country Club", 1.1],
      ["Banilad Town Centre", 1.3],
      ["University of Cebu Banilad", 2.1],
      ["Ayala Center Cebu", 2.7],
      ["SM City Cebu", 3.1],
      ["Chong Hua Hospital", 3.1],
      ["Redemptorist Church", 3.2],
      ["Perpetual Succor Hospital", 3.5],
      ["Cebu Doctors' Hospital", 3.6],
      ["Seaport", 5.9],
      ["Mactan-Cebu International Airport", 11.7],
    ],
  },

  pristina: {
    name: "Pristina Town",
    accent: "var(--color-burgundy)",
    hero: `${P}/pristina-hero`,
    panel: `${P}/pristina-panel`,
    film: `${P}/pristina-film`,
    tagline: "Welcome to Pristina Town",
    // ours: described from the walkthrough
    statement:
      "A town planned around a garden roundabout: mid-rise residences with planted rooftops, palm-lined avenues, shaded walks and a retail promenade, all set against green hills.",
    facts: [],
    spaces: [
      { src: `${P}/pristina-8.jpg`, name: "The roundabout park" },
      { src: `${P}/pristina-30.jpg`, name: "Residences over the plaza" },
      { src: `${P}/pristina-12.jpg`, name: "Palm-lined avenue" },
      { src: `${P}/pristina-18.jpg`, name: "Garden walk" },
      { src: `${P}/pristina-38.jpg`, name: "Retail promenade" },
      { src: `${P}/pristina-44.jpg`, name: "Park path" },
      { src: `${P}/pristina-47.jpg`, name: "From above" },
      { src: `${P}/pristina-54.jpg`, name: "The town in the hills" },
    ],
  },
};

export const order = ["alto", "wave", "pristina"];
