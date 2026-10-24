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
    // the tower's own blue, from its brochure; the rest of the page keeps the house palette
    accent: "var(--color-wave)",
    // has its own site at wave.<domain>: every link to it leaves for there instead of the overlay
    site: true,
    hero: `${P}/wave-hero`,
    // the brand film's first 11.6 s (resources/The Wave Towers AVP.mp4): .mp4, its first frame
    // as .jpg, its last as -end.jpg. Projects with an intro open on it (src/sections/FilmHero.jsx).
    intro: `${P}/wave-intro`,
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
    // From the brochure, pages 4 to 13: the joint venture behind the tower, its master plan and
    // the two partners' own figures (src/sections/Partnership.jsx).
    venture: {
      name: "CLNUD Ventures",
      line: "A partnership between the leading developer in VISMIN and a renowned Japanese global developer.",
      image: `${P}/wave-enso.webp`,
      imageAlt: "The Wave's residential tower at dusk, from the brochure's master plan",
      plan: [
        ["Tower 1, Nagomi", "Residential: 709 units, 40 storeys, 35 residential floors"],
        ["The Podium", "Commercial, with its own parking and elevator"],
        ["Tower 2", "For future development"],
      ],
      partners: [
        {
          name: "Cebu Landmasters",
          about:
            "A leading developer in Visayas and Mindanao, specializing in residential, office, hotel, resort, co-living, mixed-use and township projects. Established in 2003 by a Cebuano entrepreneur, it is driven by family values, real estate passion and a strong commitment to customers and community.",
          figuresNote: "A diversified portfolio of real estate projects",
          figures: [
            ["96", "Residential"],
            ["6", "Offices"],
            ["10", "Hotels"],
            ["10", "Mixed-use"],
            ["3", "Estates"],
          ],
        },
        {
          name: "NTT UD Asia",
          about:
            "The venture's Japanese partner, a renowned global developer. Its projects outside Japan include 36 Wellington Street in Australia, One King William Street in London, Two Oliver Street in Boston and 1015 18th Street in Washington, DC.",
          figuresNote: "A diversified portfolio, in Japan and around the world",
          figures: [
            ["15k", "Homes delivered, approx."],
            ["560", "Business and office customers, approx."],
            ["830", "Hotel rooms, approx."],
            ["30", "Ongoing global projects"],
          ],
        },
      ],
    },
    // The brochure's full renders (pages 16 to 31), told as a story: each space fills the
    // screen behind its text (src/sections/Spaces.jsx). Lists are the brochure's own; notes
    // are ours, described from the renders, except the first. pos keeps the subject in a
    // phone's narrow crop.
    spaces: [
      {
        src: `${P}/wave-dropoff.webp`,
        name: "Drop Off Area",
        pos: "30% 50%",
        note: "Rising within Cebu I.T. Park, The Wave Towers stands at the center of one of Cebu's most dynamic business and lifestyle hubs.",
      },
      {
        src: `${P}/wave-lobby.webp`,
        name: "Main Lobby",
        pos: "55% 50%",
        note: "Low seating among timber screens and stone: Japanese restraint from the front door.",
        list: ["5 elevators", "Hallways 1.50 m to 1.80 m wide", "100% back-up power", "Podium and basement parking"],
      },
      {
        src: `${P}/wave-pool.webp`,
        name: "Swimming Pool",
        area: "6th floor",
        pos: "45% 50%",
        note: "Three pools set into a planted deck between the towers.",
        list: ["Lap pool", "Lounge pool", "Kid's pool", "Pool deck and outdoor shower"],
      },
      {
        src: `${P}/wave-spa.webp`,
        name: "Spa Pavilion",
        area: "6th floor",
        note: "A timber pavilion at the water's edge, loungers drawn up on the deck.",
        list: ["Spa pavilion", "Indoor sauna"],
      },
      {
        src: `${P}/wave-garden.webp`,
        name: "Japanese Garden",
        area: "6th floor",
        pos: "60% 50%",
        note: "Stepping stones under cherry trees, between clipped pines and lanterns.",
        list: ["Chapel seating", "Prayer pavilion"],
      },
      {
        src: `${P}/wave-function.webp`,
        name: "Function Hall",
        area: "6th floor",
        note: "Round tables set beneath a coffered timber ceiling, for dinners and celebrations.",
      },
      {
        src: `${P}/wave-theater.webp`,
        name: "Theater Room",
        area: "6th floor",
        note: "A screen in a wall of timber slats, deep sofas drawn up to face it.",
      },
      {
        src: `${P}/wave-lounge.webp`,
        name: "Lounge Hall",
        area: "6th floor",
        note: "Paper lanterns hung low over sofas, screened by timber and planting.",
      },
      {
        src: `${P}/wave-kids.webp`,
        name: "Kids Room",
        area: "6th floor",
        note: "A playroom of painted trees, a climbing ladder and a giraffe to measure by.",
      },
      {
        src: `${P}/wave-gym.webp`,
        name: "Fitness Gym",
        area: "37th floor",
        note: "Treadmills lined up along the window wall, thirty-seven floors above the city.",
      },
      {
        src: `${P}/wave-library.webp`,
        name: "Library Lounge",
        area: "37th floor",
        pos: "62% 50%",
        note: "Shelves around a long reading table, and armchairs set by the light.",
      },
    ],
    // every layout photographed in its dress-up unit; size is each set's native pixel size
    residences: [
      {
        id: "studio",
        name: "Studio",
        size: [760, 704],
        photos: [
          { src: `${P}/unit-studio-1.jpg`, caption: "Bed and dining" },
          { src: `${P}/unit-studio-2.jpg`, caption: "Kitchen" },
          { src: `${P}/unit-studio-3.jpg`, caption: "Bathroom" },
        ],
      },
      {
        id: "1br",
        name: "One bedroom",
        size: [760, 704],
        photos: [
          { src: `${P}/unit-1br-1.jpg`, caption: "Living and dining" },
          { src: `${P}/unit-1br-3.jpg`, caption: "Bedroom" },
          { src: `${P}/unit-1br-2.jpg`, caption: "Kitchen" },
          { src: `${P}/unit-1br-4.jpg`, caption: "Bathroom" },
          { src: `${P}/unit-1br-5.jpg`, caption: "Powder room" },
        ],
      },
      {
        id: "2br",
        name: "Two bedroom",
        size: [760, 802],
        photos: [1, 2, 3, 4, 5, 6, 7].map((n) => ({ src: `${P}/unit-${n}2BR.jpg` })),
      },
      {
        id: "3br",
        name: "Three bedroom",
        size: [760, 802],
        photos: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({ src: `${P}/unit-${n}3BR.jpg` })),
      },
    ],
    // Video tours of the dress-up units (src/sections/TourPlayer.jsx; the README has the cuts),
    // opened from the residences. The film plays from room to room and holds at each stop, where
    // a line points out what is there. t: seconds into the film; x, y: the point in the frame,
    // 0 to 1. Notes are ours, from the films, checked against the brochure.
    tours: [
      {
        id: "1br",
        name: "One bedroom",
        video: `${P}/wave-tour-1br`,
        stops: [
          { t: 3, x: 0.31, y: 0.6, room: "Dining", title: "Dining for four", note: "A round table under the pendant, just inside the door." },
          { t: 7.5, x: 0.5, y: 0.66, room: "Living", title: "The living room", note: "An L-shaped sofa in the corner, curtains running floor to ceiling." },
          { t: 13.5, x: 0.15, y: 0.42, room: "Bedroom", title: "The bedroom", note: "A full-height wardrobe, a desk beneath the TV, and the window wall." },
          { t: 21, x: 0.5, y: 0.72, room: "En-suite", title: "En-suite bathroom", note: "A floating vanity under a wide mirror, beside a glass-screened shower." },
          { t: 26.5, x: 0.74, y: 0.76, room: "Powder room", title: "Powder room", note: "A second WC with its own basin, for guests." },
          { t: 37, x: 0.34, y: 0.66, room: "Kitchen", title: "Galley kitchen", note: "A cooktop and under-mount sink in a grey counter, wood-grain cabinets above." },
        ],
      },
      {
        id: "2br",
        name: "Two bedroom",
        video: `${P}/wave-tour-2br`,
        stops: [
          { t: 3, x: 0.2, y: 0.62, room: "Kitchen", title: "The kitchen", note: "A double sink in a stone counter, cabinets above and below." },
          { t: 7, x: 0.7, y: 0.62, room: "Dining", title: "Dining", note: "A long table under a paper lantern, the living room just beyond." },
          { t: 14, x: 0.3, y: 0.7, room: "Den", title: "The den", note: "A lit desk running the length of the wall, behind louvred doors." },
          { t: 32, x: 0.55, y: 0.58, room: "Living", title: "The living room", note: "An L-shaped sofa by the window; sliding Japanese doors open onto the second bedroom." },
          { t: 39, x: 0.4, y: 0.6, room: "Bedroom", title: "Second bedroom", note: "A bed and a lit shelf behind the sliding screens." },
          { t: 45, x: 0.45, y: 0.55, room: "Bathroom", title: "Bathroom", note: "A stone vanity beside a glass-enclosed shower." },
          { t: 51, x: 0.4, y: 0.62, room: "Master", title: "Master bedroom", note: "A wardrobe at the door, the bed set against a timber headboard." },
          { t: 61, x: 0.8, y: 0.5, room: "En-suite", title: "Master bath", note: "A wide mirror over the vanity, the shower behind glass." },
        ],
      },
      {
        id: "3br",
        name: "Three bedroom",
        video: `${P}/wave-tour-3br`,
        stops: [
          { t: 5, x: 0.45, y: 0.7, room: "Dining", title: "The island", note: "The dining table runs on from a stone island counter." },
          { t: 9, x: 0.55, y: 0.55, room: "Living", title: "The living room", note: "A leather sofa behind a glass-paned Japanese screen." },
          { t: 20, x: 0.85, y: 0.45, room: "Kitchen", title: "The kitchen", note: "A cooktop under the rangehood, facing the island." },
          { t: 26, x: 0.6, y: 0.5, room: "Bunk room", title: "Third bedroom", note: "Bunk beds behind louvred doors." },
          { t: 44, x: 0.75, y: 0.62, room: "Bedroom", title: "Second bedroom", note: "A bed beside a long desk, curtains floor to ceiling." },
          { t: 53, x: 0.5, y: 0.45, room: "Bathroom", title: "Bathroom", note: "A glass-enclosed shower and a stone vanity." },
          { t: 58, x: 0.3, y: 0.35, room: "Master", title: "Master bedroom", note: "A desk set into the window, the city beyond." },
          { t: 65, x: 0.5, y: 0.72, room: "En-suite", title: "Master bath", note: "A bathtub with a separate shower, behind glass." },
        ],
      },
    ],
    // from the agent's card in resources/
    agent: {
      names: "Marilyn & Percival Laranjo",
      role: "Licensed real estate salespersons",
      firm: "Leuterio Realty & Brokerage",
      licences: [
        ["PRC licence", "0026225"],
        ["DHSUD registration", "R7-A-04/21-630"],
      ],
      phones: ["+63 935 662 5281", "+63 956 870 7294"],
      email: "lenlaranjo@gmail.com",
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
