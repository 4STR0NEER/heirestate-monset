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
    // The sixth floor as the brochure draws it (page 19): the amenity plan, 1200 by 1294, with a
    // marker on each amenity at x, y (0 to 1) and the render of it from spaces, where there is one.
    // Areas are the plan's key; notes without a space are ours, read from the plan.
    deck: {
      plan: `${P}/wave-amenity-plan.webp`,
      size: [1200, 1294],
      spots: [
        { name: "Lap and lounge pool", x: 0.535, y: 0.274, space: "Swimming Pool", area: "385 sqm" },
        { name: "Kid's pool", x: 0.2, y: 0.097, space: "Swimming Pool", area: "26 sqm" },
        { name: "Indoor sauna", x: 0.465, y: 0.19, space: "Spa Pavilion" },
        { name: "Spa pavilion", x: 0.665, y: 0.153, space: "Spa Pavilion" },
        { name: "Kid's play", x: 0.095, y: 0.515, area: "45 sqm", note: "An outdoor playground at the edge of the pool deck." },
        { name: "Kids room", x: 0.1, y: 0.612, space: "Kids Room" },
        { name: "Theater room", x: 0.45, y: 0.482, space: "Theater Room" },
        { name: "Resident's lounge", x: 0.6, y: 0.482, note: "A lounge for residents, opening onto the pool deck." },
        { name: "Lounge hall", x: 0.655, y: 0.617, space: "Lounge Hall" },
        { name: "Function hall", x: 0.82, y: 0.617, space: "Function Hall" },
        { name: "Japanese garden", x: 0.75, y: 0.77, space: "Japanese Garden" },
        { name: "Prayer pavilion", x: 0.87, y: 0.77, space: "Japanese Garden" },
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
    // In every unit, from the brochure's unit features (page 42).
    unitFeatures: [
      "Tiled living areas, luxury vinyl tile in the bedrooms",
      "Toilet and bath fully fitted, with a glass shower enclosure",
      "Kitchen sink with top and base cabinets and a built-in shoe cabinet",
      "Wardrobe in every unit of one bedroom and above",
      "Rangehood, intercom and smart lockset",
      "Split-type air conditioning, fire detection and suppression",
      "Provisions for washer-dryer, water heater, CATV and data",
    ],
    // Each unit type: its dress-up photographs (size is their native pixel size), the brochure's
    // render of it (pages 44, 50, 60, 73), every layout the brochure draws with its total area
    // and what sets it apart (pages 46 to 86; plans are 1165 by 805), and its finishes (pages 45,
    // 51, 61, 74). about is ours, read from the plans.
    residences: [
      {
        id: "studio",
        name: "Studio",
        size: [760, 704],
        render: `${P}/wave-unit-studio.webp`,
        about: "One room for living, sleeping and dining, with its own kitchen and bath. Two of the four layouts open onto a balcony.",
        photos: [
          { src: `${P}/unit-studio-1.jpg`, caption: "Bed and dining" },
          { src: `${P}/unit-studio-2.jpg`, caption: "Kitchen" },
          { src: `${P}/unit-studio-3.jpg`, caption: "Bathroom" },
        ],
        plans: [
          ["Type A", `${P}/wave-plan-studio-a.webp`, 27.37, ["Balcony"]],
          ["Type B", `${P}/wave-plan-studio-b.webp`, 30.47, ["Balcony"]],
          ["Type C", `${P}/wave-plan-studio-c.webp`, 24.08, []],
          ["Type D", `${P}/wave-plan-studio-d.webp`, 24.31, []],
        ],
        finishes: [
          ["Entrance", "Solid door with an electronic smart lockset"],
          ["Living and dining", "Porcelain tile floor, painted walls and ceiling, split-type air conditioning"],
          ["Bathroom", "Non-skid porcelain tiles, stone vanity top, glass enclosure, Toto fixtures or equivalent"],
          ["Kitchen", "Stone counter and backsplash, top and base cabinets with a shoe cabinet, rangehood, stainless steel sink"],
          ["Balcony", "Swing glass door and non-skid tiles, where the layout has one"],
        ],
      },
      {
        id: "1br",
        name: "One bedroom",
        size: [760, 704],
        render: `${P}/wave-unit-1br.webp`,
        about: "A bedroom of its own off the living room. Most layouts add a powder room for guests, and every one has a balcony.",
        photos: [
          { src: `${P}/unit-1br-1.jpg`, caption: "Living and dining" },
          { src: `${P}/unit-1br-3.jpg`, caption: "Bedroom" },
          { src: `${P}/unit-1br-2.jpg`, caption: "Kitchen" },
          { src: `${P}/unit-1br-4.jpg`, caption: "Bathroom" },
          { src: `${P}/unit-1br-5.jpg`, caption: "Powder room" },
        ],
        plans: [
          ["Junior", `${P}/wave-plan-1brj.webp`, 38.15, ["Balcony"]],
          ["Type A", `${P}/wave-plan-1br-a.webp`, 58.54, ["Powder room", "Balcony"]],
          ["Type B", `${P}/wave-plan-1br-b.webp`, 55.16, ["Powder room", "Balcony"]],
          ["Type C", `${P}/wave-plan-1br-c.webp`, 50.79, ["Powder room", "Balcony"]],
          ["Type D", `${P}/wave-plan-1br-d.webp`, 48.94, ["Balcony"]],
          ["Type E", `${P}/wave-plan-1br-e.webp`, 55.12, ["Powder room", "Balcony"]],
          ["Type F", `${P}/wave-plan-1br-f.webp`, 54.08, ["Powder room", "Balcony"]],
          ["Type G", `${P}/wave-plan-1br-g.webp`, 57.91, ["Powder room", "Balcony"]],
        ],
        finishes: [
          ["Entrance", "Solid door with an electronic smart lockset"],
          ["Living and dining", "Porcelain tile floor, painted walls and ceiling, split-type air conditioning"],
          ["Bedroom", "Luxury vinyl tile floor, wardrobe closet, split-type air conditioning"],
          ["Bathroom and powder room", "Non-skid porcelain tiles, stone vanity top, glass enclosure, Toto fixtures or equivalent, a hand basin in the powder room"],
          ["Kitchen", "Stone counter and backsplash, top and base cabinets with a shoe cabinet, rangehood, stainless steel sink"],
          ["Balcony", "Swing glass door and non-skid tiles"],
        ],
      },
      {
        id: "2br",
        name: "Two bedroom",
        size: [760, 802],
        render: `${P}/wave-unit-2br.webp`,
        about: "The juniors keep two bedrooms close around one bath. The larger layouts add an en-suite master, a den or flexi room and a utility room; two have a private terrace.",
        photos: [1, 2, 3, 4, 5, 6, 7].map((n) => ({ src: `${P}/unit-${n}2BR.jpg` })),
        plans: [
          ["Junior A", `${P}/wave-plan-2brj-a.webp`, 71.5, ["Balcony"]],
          ["Junior B", `${P}/wave-plan-2brj-b.webp`, 67.0, ["Balcony"]],
          ["Junior C", `${P}/wave-plan-2brj-c.webp`, 67.73, ["Master bath", "Balcony"]],
          ["Junior D", `${P}/wave-plan-2brj-d.webp`, 68.78, ["Powder room", "Balcony"]],
          ["Type A", `${P}/wave-plan-2br-a.webp`, 76.78, ["Den", "Utility room", "Balcony"]],
          ["Type B", `${P}/wave-plan-2br-b.webp`, 82.0, ["Den", "Utility room", "Balcony"]],
          ["Type C", `${P}/wave-plan-2br-c.webp`, 96.74, ["Den", "Utility room", "Balcony"]],
          ["Type D", `${P}/wave-plan-2br-d.webp`, 95.93, ["Den", "Utility room", "Private terrace"]],
          ["Type E", `${P}/wave-plan-2br-e.webp`, 82.74, ["Den", "Utility room", "Balcony"]],
          ["Type F", `${P}/wave-plan-2br-f.webp`, 97.22, ["Flexi room", "Utility room", "Balcony"]],
          ["Type G", `${P}/wave-plan-2br-g.webp`, 94.76, ["Den", "Utility room", "Private terrace"]],
        ],
        finishes: [
          ["Entrance", "Solid door with an electronic smart lockset"],
          ["Living and dining", "Porcelain tile floor, painted walls and ceiling, split-type air conditioning, intercom"],
          ["Bedrooms", "Luxury vinyl tile floor, wardrobe closets, split-type air conditioning, a sliding Japanese door to the bedroom or den"],
          ["Bathrooms", "Non-skid porcelain tiles, stone vanity tops, glass enclosures, Toto fixtures or equivalent"],
          ["Kitchen", "Stone counter and backsplash, top and base cabinets with a shoe cabinet, rangehood, double stainless steel sink"],
          ["Balcony", "Swing glass door and non-skid tiles"],
        ],
      },
      {
        id: "3br",
        name: "Three bedroom",
        size: [760, 802],
        render: `${P}/wave-unit-3br.webp`,
        about: "Family-sized, from 103 to 182 sqm. Nearly every layout has an en-suite master, and each has a utility room with its own toilet; the largest add a family hall, a home office and a private terrace.",
        photos: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({ src: `${P}/unit-${n}3BR.jpg` })),
        plans: [
          ["Type A", `${P}/wave-plan-3br-a.webp`, 119.61, ["Den", "Utility room", "Balcony"]],
          ["Type A.1", `${P}/wave-plan-3br-a1.webp`, 119.85, ["Den", "Utility room", "Balcony"]],
          ["Type B", `${P}/wave-plan-3br-b.webp`, 103.59, ["Den", "Powder room", "Utility room"]],
          ["Type C", `${P}/wave-plan-3br-c.webp`, 106.28, ["Den", "Utility room", "Balcony"]],
          ["Type D", `${P}/wave-plan-3br-d.webp`, 110.05, ["Den", "Utility room", "Private terrace"]],
          ["Type E", `${P}/wave-plan-3br-e.webp`, 123.84, ["Den", "Utility room", "Private terrace"]],
          ["Type F", `${P}/wave-plan-3br-f.webp`, 182.08, ["Family hall", "Home office", "Private terrace"]],
          ["Type G", `${P}/wave-plan-3br-g.webp`, 155.06, ["Family hall", "Home office", "Powder room"]],
          ["Type H", `${P}/wave-plan-3br-h.webp`, 163.97, ["Powder room", "Storage", "Private terrace"]],
          ["Type I", `${P}/wave-plan-3br-i.webp`, 137.31, ["Powder room", "Utility room", "Balcony"]],
          ["Type J", `${P}/wave-plan-3br-j.webp`, 125.88, ["Den", "Utility room", "Private terrace"]],
          ["Type K", `${P}/wave-plan-3br-k.webp`, 103.72, ["Den", "Utility room", "Balcony"]],
        ],
        finishes: [
          ["Entrance", "Solid door with an electronic smart lockset"],
          ["Living and dining", "Porcelain tile floor, painted walls and ceiling, split-type air conditioning, intercom"],
          ["Bedrooms", "Luxury vinyl tile floor, wardrobe closets, split-type air conditioning, a sliding Japanese door to the bedroom or den"],
          ["Bathrooms", "Non-skid porcelain tiles, stone vanity tops, glass enclosure and partition, Toto fixtures or equivalent, a bathtub with a separate shower"],
          ["Kitchen", "Island counter, stone counter and backsplash, top and base cabinets with a shoe cabinet, rangehood, double stainless steel sink"],
          ["Balcony", "Swing glass door and non-skid tiles"],
        ],
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
    // under the enquiry desk: who builds it, and where the pictures and figures come from
    disclaimer:
      "The Wave Towers is developed by CLNUD Ventures, a joint venture of Cebu Landmasters and NTT UD Asia. Renders are architect's perspectives; layouts and areas are from the developer's brochure and may change.",
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
    // the brochure's location page (page 10): its line, and its distances in km, each with the kind of place it is
    locationLine: "Within Cebu I.T. Park, one of Cebu's most dynamic business and lifestyle hubs, with seamless connectivity to top-tier offices, retail and urban conveniences.",
    nearby: [
      ["Ayala Central Bloc", 0.22, "Shopping"],
      ["Cebu Country Club", 1.1, "Everyday"],
      ["Banilad Town Centre", 1.3, "Shopping"],
      ["University of Cebu Banilad", 2.1, "Everyday"],
      ["Ayala Center Cebu", 2.7, "Shopping"],
      ["SM City Cebu", 3.1, "Shopping"],
      ["Chong Hua Hospital", 3.1, "Healthcare"],
      ["Redemptorist Church", 3.2, "Everyday"],
      ["Perpetual Succor Hospital", 3.5, "Healthcare"],
      ["Cebu Doctors' Hospital", 3.6, "Healthcare"],
      ["Seaport", 5.9, "Travel"],
      ["Mactan-Cebu International Airport", 11.7, "Travel"],
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
