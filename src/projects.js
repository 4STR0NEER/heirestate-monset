// The five places in the collection: the projects open now, and "soon" for the two not yet
// announced (counted in the collection and the portfolio); replace one with a project id when it launches.
export const showcase = ["alto", "wave", "pristina", "soon", "soon"];

const P = "/media/p";

// The licensed agents for The Wave and Alto Ranudo, from their card in resources/
const LARANJO = {
  names: "Marilyn & Percival Laranjo",
  role: "Licensed real estate salespersons",
  firm: "Leuterio Realty & Brokerage",
  licences: [
    ["PRC licence", "0026225"],
    ["DHSUD registration", "R7-A-04/21-630"],
  ],
  phones: ["+63 935 662 5281", "+63 956 870 7294"],
  email: "heirestates.fh@gmail.com",
  network: "LR Direct",
  address: "Teves, Vito, Minglanilla, Cebu 6000",
  photo: `${P}/laranjo.webp`, // their portrait, cut out of its white backdrop
};

// Project pages. Every fact comes from the client's material: the presentation deck (Alto),
// the brochure (The Wave) and the walkthrough films. Lines marked "ours" are descriptive
// copy written from the footage, pending the client's own text.
export const projects = {
  alto: {
    name: "Alto Ranudo",
    // the deck's own forest green, on a site of its own (theme repaints the house palette)
    accent: "var(--color-alto-mid)",
    site: true,
    // Alto's site repaints the house tokens in its deck's colours: forest green for the navy,
    // bronze for the gold, a cool grey paper (sites.js writes these into the page head)
    theme: {
      "--color-navy-deep": "var(--color-alto)",
      "--color-navy": "var(--color-alto-raised)",
      "--color-champagne": "var(--color-bronze-light)",
      "--color-gold": "var(--color-bronze)",
      "--color-gold-ink": "var(--color-bronze-ink)",
      "--color-paper": "var(--color-alto-paper)",
      "--color-stone": "var(--color-alto-stone)",
      "--color-plan": "var(--color-alto-stone)",
      "--color-ink": "var(--color-alto)",
    },
    // the geometric hand: fins where The Wave has ink (FilmHero, Spaces)
    motif: "fins",
    hero: `${P}/alto-hero`,
    panel: `${P}/alto-panel`,
    film: `${P}/alto-film`,
    // the extended walkthrough film's first 12.6 s: the monogram, then the aerial approach
    intro: `${P}/alto-intro`,
    introAt: 4,
    // Everything below is from the presentation deck (resources/Alto Ranudo); page numbers in
    // brackets. Lines marked "ours" are descriptive, written from the renders.
    tagline: "Built for Timeless Living",
    kicker: "A landmark woven from Cebuano heritage",
    // [8]
    statement:
      "A home is not simply a place to stay, but a reflection of who a person is and the legacy they carry.",
    facts: [
      ["Location", "V. Ranudo Street, Cebu City"],
      ["Tower", "20 storeys plus a roof deck, 14 residential floors"],
      ["Residences", "389 units, studio and one-bedroom"],
      ["Lot area", "2,134.80 sqm"],
      ["Gross floor area", "14,890.22 sqm"],
      ["Architect", "Casas Architects"],
      // the walkthrough film's end card
      ["Developer", "Cebu Landmasters, in partnership with MAC, a joint venture under CLIMAC Developers, Inc."],
    ],
    // what a search result shows: the name people search for, where it is and what it is
    seo: {
      title: "Alto Ranudo Condominiums, V. Ranudo Street, Cebu City | Heir Estates",
      description:
        "Alto Ranudo: 389 studio and one-bedroom residences in a 20-storey tower on V. Ranudo Street, Cebu City, by Cebu Landmasters. Floor plans and viewings.",
    },
    // [9, 10, 15, 16]
    profile: {
      word: "Landmark",
      title: "A residence that honors Cebu's artistry",
      body: [
        "It is a space that allows one to live openly yet remain grounded, to be rooted in the richness of culture while enjoying the refinement of contemporary living.",
        "It connects the past with the present, and elevates heritage as a lifestyle to live.",
      ],
      image: `${P}/alto-ext-2.webp`,
      imageAlt: "Alto Ranudo at dusk, its terracotta lattice podium under the tower",
      figures: [
        ["389", "Residential units"],
        ["20", "Storeys, plus a roof deck"],
        ["14", "Residential floors"],
        ["14,890.22", "Gross floor area, sqm"],
        ["2,134.80", "Lot area, sqm"],
        ["22", "Studios a floor, 22.4 sqm"],
        ["5", "One-bedrooms a floor, 39 sqm"],
      ],
      features: [
        "Premium residential lobby",
        "4 levels of podium parking",
        "3 passenger and 1 service elevator",
        "Pedestrian access to Calle 104 retail",
        "Commercial spaces on the ground floor",
        "CLI property management",
        "100% back-up power",
        "24/7 security system",
      ],
    },
    // [18 to 29]; arrival spaces are told full screen, the rest laid out as a grid (Spaces.jsx)
    spacesIntro: "From the drop-off to the pool deck, rooms for every part of the day.",
    // [17] every amenity the deck lists
    amenities: [
      "Adult and kids pool",
      "Pool pavilion",
      "Yoga area",
      "Zen garden",
      "Fitness gym",
      "Study area",
      "Indoor kid's playroom",
      "Outdoor kid's play area",
      "Pet play",
      "Multi-purpose function rooms",
      "Pre-function area",
      "Lounge areas",
      "Elegant main lobby with lounge",
      "Indoor drop-off",
    ],
    spaces: [
      { src: `${P}/alto-dropoff.webp`, name: "Drop Off and Retail", arrival: true, note: "Shops and a restaurant at street level, and an indoor drop-off for residents." },
      { src: `${P}/alto-lobby.webp`, name: "Elegant Main Lobby", area: "168.04 sqm", arrival: true, note: "A premium residential lobby with a lounge, in stone and warm timber." },
      { src: `${P}/alto-lobby-2.webp`, name: "The Lobby Lounge", arrival: true, note: "Low seating under a sculpted ceiling, a place to wait or to meet." },
      { src: `${P}/alto-lift.webp`, name: "Lift Hallway", arrival: true, note: "Three passenger elevators and one for service." },
      { src: `${P}/alto-pool.webp`, name: "Adult Pool", area: "170 sqm", floor: "6th floor" },
      { src: `${P}/alto-kiddie.webp`, name: "Kiddie Pool", area: "25 sqm", floor: "6th floor" },
      { src: `${P}/alto-lounge.webp`, name: "Amenity Lounge Area" },
      { src: `${P}/alto-study.webp`, name: "Study Area", area: "28.40 sqm" },
      { src: `${P}/alto-gym.webp`, name: "Fitness Gym", area: "56.98 sqm" },
      { src: `${P}/alto-kids.webp`, name: "Kid's Playroom", area: "29.64 sqm" },
      { src: `${P}/alto-function.webp`, name: "Function Room", area: "73.07 sqm", floor: "6th floor" },
      { src: `${P}/alto-function-2.webp`, name: "Function Room, set for an event", area: "73.07 sqm", floor: "6th floor" },
    ],
    // [30 to 39] the tower floor by floor, its plates as the deck draws them; size is each
    // plate's pixel size. Notes are ours, read from the plates' labels and the site plan [13].
    tower: {
      note: "Designed for low-density living: fewer units a floor for greater privacy and comfort, each layout drawing in light and air.",
      levels: [
        { id: "g", label: "Ground floor", short: "G", plate: `${P}/alto-floor-g.webp`, size: [1600, 726], note: "Retail along Ranudo Street, the residential drop-off and the main lobby, with a passage to Calle 104." },
        { id: "m", label: "Mezzanine", short: "M", plate: `${P}/alto-floor-m.webp`, size: [1600, 908], note: "Retail space and the admin office, open to the lobby below." },
        { id: "2", label: "2nd floor", short: "2", plate: `${P}/alto-floor-2.webp`, size: [1600, 1150], note: "Podium parking, with retail." },
        { id: "3", label: "3rd floor", short: "3", plate: `${P}/alto-floor-3.webp`, size: [1600, 1182], note: "Podium parking." },
        { id: "4", label: "4th floor", short: "4", plate: `${P}/alto-floor-4.webp`, size: [1566, 1428], note: "Podium parking." },
        { id: "5", label: "5th floor", short: "5", plate: `${P}/alto-floor-5.webp`, size: [1600, 1130], note: "Podium parking." },
        { id: "6", label: "6th floor", short: "6", plate: `${P}/alto-floor-6.webp`, size: [1600, 1130], units: "10 studios and 1 one-bedroom", note: "The amenity floor: the adult and kiddie pools, the pool deck, a yoga area and the function room." },
        { id: "7", label: "7th floor", short: "7", plate: `${P}/alto-floor-7.webp`, size: [1600, 1130], units: "22 studios and 5 one-bedrooms" },
        { id: "8", label: "8th to 21st floor", short: "8–21", floors: 14, plate: `${P}/alto-floor-8.webp`, size: [1600, 928], units: "22 studios and 5 one-bedrooms a floor", note: "The typical floor, repeated fourteen times up the tower." },
      ],
    },
    // [40] in every unit
    unitFeatures: [
      "Painted walls, partitions and ceilings",
      "Homogeneous tiled flooring throughout",
      "Premium toilet fixtures",
      "Kitchen counter with top and base cabinets",
      "Split-type air conditioning",
      "Cooktop with rangehood, intercom and smart lockset",
      "Fire detection and suppression",
      "Provision for washer-dryer and a single-point water heater",
      "Data connectivity and telco",
    ],
    // [41 to 46] each type with its plan and room areas; photos are frames of the walkthrough
    // film and the deck's bare-unit renders. about is ours.
    residences: [
      {
        id: "studio",
        name: "Studio",
        size: [1000, 700],
        render: `${P}/alto-unit-studio.webp`,
        about: "Sleeping, living and a galley kitchen in one long room, with its own toilet and bath at the door.",
        planSize: [965, 1500],
        plans: [
          ["Typical", `${P}/alto-plan-studio.webp`, 22.72, [], [["Living area", 12.08], ["Kitchen", 6.07], ["Toilet", 4.28], ["Chase", 0.29]]],
        ],
        photos: [
          { src: `${P}/alto-studio-1.webp`, caption: "Bedroom" },
          { src: `${P}/alto-studio-3.webp`, caption: "Living" },
          { src: `${P}/alto-studio-2.webp`, caption: "Bathroom" },
          { src: `${P}/alto-studio-4.webp`, caption: "Bare unit" },
          { src: `${P}/alto-studio-5.webp`, caption: "Bare unit, to the door" },
        ],
      },
      {
        id: "1br",
        name: "One bedroom",
        size: [1000, 700],
        render: `${P}/alto-unit-1br.webp`,
        about: "A separate bedroom beside the living room, a kitchen along one wall, and a balcony.",
        planSize: [1600, 1310],
        plans: [
          ["Typical", `${P}/alto-plan-1br.webp`, 39.57, ["Balcony"], [["Living area", 10.99], ["Kitchen", 6.35], ["Toilet", 5.49], ["Chase", 0.37], ["Bedroom", 12.17], ["Balcony", 3.0], ["AC balcony", 1.2]]],
        ],
        photos: [
          { src: `${P}/alto-1br-1.webp`, caption: "Living and dining" },
          { src: `${P}/alto-1br-2.webp`, caption: "Bare unit, kitchen" },
          { src: `${P}/alto-1br-3.webp`, caption: "Bare unit" },
        ],
      },
    ],
    // [11, 12] the deck's line and its distances in km, with its own minutes
    locationLine: "Located at an iconic address that has long carried the dignity of Cebuano heritage.",
    nearby: [
      ["Velez Medical Arts Building", 0.015, "Healthcare", 1],
      ["Velez General Hospital", 0.17, "Healthcare", 1],
      ["Chong Hua Hospital", 1.1, "Healthcare", 4],
      ["Vicente Sotto Medical Center", 1.2, "Healthcare", 4],
      ["Cebu Doctors' Hospital", 1.8, "Healthcare", 8],
      ["Casino Español de Cebu", 0.08, "Heritage and faith", 1],
      ["Archbishop's Palace", 0.4, "Heritage and faith", 2],
      ["Archdiocese of the Most Sacred Heart", 0.45, "Heritage and faith", 2],
      ["Fuente Osmeña Circle", 0.7, "Heritage and faith", 3],
      ["Robinsons Place Cebu Fuente", 0.55, "Shopping and stays", 3],
      ["Citadines Cebu City", 1.5, "Shopping and stays", 5],
      ["Cebu Normal University", 0.8, "Schools", 3],
      ["St. Theresa's College", 1.0, "Schools", 4],
    ],
    // the same licensed agents as The Wave, with the user's approval
    agent: LARANJO,
    disclaimer: "Renders are architect's perspectives; details are from the developer's presentation and may change.",
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
    // the name the developer markets it under, and what a search result shows
    fullName: "The Wave Towers",
    seo: {
      title: "The Wave Towers: Condominiums in Cebu I.T. Park | Heir Estates",
      description:
        "The Wave Towers: 709 residences, studio to three-bedroom, in a 40-storey tower in Cebu I.T. Park, by Cebu Landmasters and NTT UD Asia. Plans and viewings.",
    },
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
    spacesIntro: "Japanese-inspired amenities from the lobby to the thirty-seventh floor.",
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
    agent: LARANJO,
    // the brochure's location page (page 10): its line, and its distances in km, each with the kind of place it is
    locationLine: "Within Cebu I.T. Park, one of Cebu's most dynamic business and lifestyle hubs, with seamless connectivity to top-tier offices, retail and urban conveniences.",
    nearby: [
      ["Ayala Central Bloc", 0.22, "Shopping"],
      ["Cebu Country Club", 1.1, "School, club and church"],
      ["Banilad Town Centre", 1.3, "Shopping"],
      ["University of Cebu Banilad", 2.1, "School, club and church"],
      ["Ayala Center Cebu", 2.7, "Shopping"],
      ["SM City Cebu", 3.1, "Shopping"],
      ["Chong Hua Hospital", 3.1, "Healthcare"],
      ["Redemptorist Church", 3.2, "School, club and church"],
      ["Perpetual Succor Hospital", 3.5, "Healthcare"],
      ["Cebu Doctors' Hospital", 3.6, "Healthcare"],
      ["Seaport", 5.9, "Getting away"],
      ["Mactan-Cebu International Airport", 11.7, "Getting away"],
    ],
  },

  pristina: {
    // The residences of Pristina Town, named as its own plans name them. The id stays
    // "pristina": it is in every address (pristina.<domain>).
    name: "North Grove",
    accent: "var(--color-grove-mid)",
    site: true,
    // the plans' own palette: warm paper, olive, a deep olive for the few dark bands
    theme: {
      "--color-navy-deep": "var(--color-grove)",
      "--color-navy": "var(--color-grove-raised)",
      "--color-champagne": "var(--color-olive-light)",
      "--color-gold": "var(--color-olive)",
      "--color-gold-ink": "var(--color-olive-ink)",
      "--color-paper": "var(--color-grove-paper)",
      "--color-stone": "var(--color-grove-stone)",
      "--color-plan": "var(--color-grove-paper)",
      "--color-ink": "var(--color-grove)",
    },
    // the land's hand: contours, ridgelines and the plumeria (Contours, Edge, Plumeria)
    motif: "contours",
    place: "Pristina Town",
    hero: `${P}/pristina-hero`,
    panel: `${P}/pristina-panel`,
    film: `${P}/pristina-film`,
    // the town film's first 6.3 s: "Welcome to Pristina Town" over the hills
    intro: `${P}/grove-intro`,
    introAt: 5.4,
    // From resources/pristina town: the floor-plan sheets, the two unit sheets, a sample term
    // sheet and the town film. Lines marked "ours" are descriptive, written from the film.
    tagline: "At Pristina Town",
    kicker: "Welcome to Pristina Town",
    // the name on its plans, and what a search result shows
    fullName: "North Grove at Pristina Town",
    seo: {
      title: "North Grove at Pristina Town: Studio & 1BR Condos | Heir Estates",
      description:
        "North Grove at Pristina Town by Cebu Landmasters: studio (22.75 sqm) and one-bedroom (34.41 sqm) homes, ten percent down over five years. Plans and viewings.",
    },
    // ours
    statement:
      "A town planned around a garden roundabout: residences with planted rooftops, palm-lined avenues, shaded walks and a retail promenade, all set against green hills.",
    facts: [
      ["Towers", "Lumina (Tower 1) and Terra (Tower 2)"],
      ["Residences", "Studio and one-bedroom"],
      ["Typical studio", "22.75 sqm, Terra"],
      ["Typical one-bedroom", "34.41 sqm, Lumina"],
      ["Developer", "Cebu Landmasters, a joint venture under Cebu Homegrown Developers, Inc."],
    ],
    // the town, from its film; notes are ours
    spacesIntro: "A walk through the town around it.",
    spaces: [
      { src: `${P}/pristina-54.jpg`, name: "The town in the hills", note: "Mid-rise towers with planted terraces, set into green hills." },
      { src: `${P}/pristina-8.jpg`, name: "The roundabout park", note: "A garden at the centre of the town, ringed by its avenues." },
      { src: `${P}/pristina-12.jpg`, name: "Palm-lined avenue", note: "Wide streets shaded by palms, with shops along the ground floors." },
      { src: `${P}/pristina-30.jpg`, name: "Residences over the plaza", note: "Homes above an open plaza, close to everything at street level." },
      { src: `${P}/pristina-38.jpg`, name: "Retail promenade", note: "A shaded walk past shopfronts and cafés." },
      { src: `${P}/pristina-18.jpg`, name: "Garden walk", note: "Paths through planting, between the buildings and the street." },
      { src: `${P}/pristina-47.jpg`, name: "From above", note: "The town seen whole, its green spaces threaded through it." },
    ],
    // the floor-plan sheets, tower by tower; size is the sheets' pixel size
    tower: {
      note: "Two towers on one site: Lumina and Terra, each a long block of studios and one-bedrooms looking out to the mountains, the city or the amenities.",
      legend: [
        ["Studio", "var(--color-unit-sand)"],
        ["Studio with balcony", "var(--color-unit-sage)"],
        ["One-bedroom", "var(--color-unit-rose)"],
        ["One-bedroom with balcony", "var(--color-unit-sea)"],
      ],
      towers: [
        {
          id: "lumina",
          name: "Lumina",
          levels: [
            { id: "2", label: "2nd floor", short: "2", plate: `${P}/grove-lumina-2.webp`, size: [1280, 720] },
            { id: "3", label: "3rd floor", short: "3", plate: `${P}/grove-lumina-3.webp`, size: [1280, 720] },
            { id: "4", label: "4th floor", short: "4", plate: `${P}/grove-lumina-4.webp`, size: [1280, 720] },
            { id: "5", label: "5th floor", short: "5", plate: `${P}/grove-lumina-5.webp`, size: [1280, 720] },
            { id: "6", label: "6th to 9th floor", short: "6–9", floors: 4, plate: `${P}/grove-lumina-6.webp`, size: [1280, 720] },
            { id: "10", label: "10th floor", short: "10", plate: `${P}/grove-lumina-10.webp`, size: [1280, 720] },
            { id: "11", label: "11th floor", short: "11", plate: `${P}/grove-lumina-11.webp`, size: [1280, 720] },
          ],
        },
        {
          id: "terra",
          name: "Terra",
          levels: [
            { id: "2", label: "2nd floor", short: "2", plate: `${P}/grove-terra-2.webp`, size: [1280, 720] },
            { id: "3", label: "3rd to 5th floor", short: "3–5", floors: 3, plate: `${P}/grove-terra-3.webp`, size: [1280, 720] },
            { id: "6", label: "6th to 12th floor", short: "6–12", floors: 7, plate: `${P}/grove-terra-6.webp`, size: [1280, 720] },
            { id: "14", label: "14th floor", short: "14", plate: `${P}/grove-terra-14.webp`, size: [1280, 720] },
            { id: "15", label: "15th to 16th floor", short: "15–16", floors: 2, plate: `${P}/grove-terra-15.webp`, size: [1280, 720] },
          ],
        },
      ],
    },
    // the two unit sheets: the developer's own photograph and area tabulation of each type
    residences: [
      {
        id: "studio",
        name: "Studio",
        size: [630, 542],
        about: "Living, dining and sleeping in one room, with a kitchen along the way in and its own toilet and bath. In Terra, Tower 2.",
        planTab: "Unit sheet",
        planSize: [1080, 542],
        plans: [["Typical", `${P}/grove-sheet-studio.webp`, 22.75, [], [["Living, dining and bedroom", 12.6], ["Kitchen", 6.41], ["Toilet and bath", 4.22]]]],
        photos: [{ src: `${P}/grove-studio-1.webp`, caption: "Deliverable unit" }],
      },
      {
        id: "1br",
        name: "One bedroom",
        size: [630, 542],
        about: "A bedroom of its own beside the living and dining room, a kitchen, and a balcony. In Lumina, Tower 1.",
        planTab: "Unit sheet",
        planSize: [1080, 542],
        plans: [["Typical", `${P}/grove-sheet-1br.webp`, 34.41, ["Balcony"], [["Living and dining", 11.76], ["Kitchen", 4.48], ["Toilet and bath", 6.07], ["Bedroom", 8.6], ["Balcony", 3.5]]]],
        photos: [{ src: `${P}/grove-1br-1.webp`, caption: "Furnished showroom unit" }],
      },
    ],
    // the shape of the payment scheme on the developer's sample term sheet, without figures
    terms: {
      caption: "Payment terms",
      title: "Ten percent down, over five years",
      steps: [
        ["Reserve", "A reservation fee holds the unit. It is non-refundable and non-transferable."],
        ["Downpayment", "Ten percent of the total contract price, net of the reservation fee, spread over 60 months at 0% interest."],
        ["Balance", "The remaining ninety percent, settled on the date in your term sheet."],
      ],
      notes: [
        "From the developer's sample term sheet. Prices are VAT-inclusive where applicable and subject to change without notice.",
        "Move-in charges, utility connections and related charges are not included.",
      ],
    },
    agent: LARANJO,
    disclaimer:
      "North Grove at Pristina Town is developed and managed by Cebu Landmasters, a joint venture under Cebu Homegrown Developers, Inc. Pictures are the developer's renders and showroom units; areas and terms are from its sheets and may change.",
  },
};

export const order = ["alto", "wave", "pristina"];
