import fs from "node:fs";
import path from "node:path";

import mongoose from "mongoose";

import { env } from "../config";

import {
  BookingModel,
} from "../models/booking.model";

import {
  CinemaModel,
} from "../models/cinema.model";

import {
  CouponModel,
} from "../models/coupon.model";

import {
  FoodModel,
} from "../models/food.model";

import {
  MovieModel,
  type MovieStatus,
} from "../models/movie.model";

import {
  ScreenModel,
  type ScreenSeatType,
} from "../models/screen.model";

import {
  SeatModel,
} from "../models/seat.model";

import {
  SettingsModel,
} from "../models/settings.model";

import {
  ShowtimeModel,
} from "../models/showtime.model";

import {
  UserModel,
} from "../models/user.model";

const REQUIRED_CONFIRMATION =
  "DELETE_ALL_EXCEPT_USERS";

const ONE_DAY_MS =
  24 * 60 * 60 * 1000;

const ONE_MINUTE_MS =
  60 * 1000;

const SHOWTIME_DAYS =
  7;

const SEAT_INSERT_BATCH_SIZE =
  5000;

const backendBaseUrl =
  env.backendUrl.replace(
    /\/$/,
    "",
  );

const seedUploadRoot =
  path.resolve(
    process.cwd(),
    env.uploadDirectory,
    "seed",
  );

type MovieSeed = {
  title: string;
  slug: string;
  description: string;

  genre: string[];
  language: string;
  duration: number;

  releaseDate: string;
  rating: string;

  director: string;
  cast: string[];

  featured: boolean;

  colors: [
    string,
    string,
  ];
};

type ScreenProfile =
  | "large"
  | "standard"
  | "premium"
  | "compact";

type ScreenPlan = {
  name: string;
  profile: ScreenProfile;
};

type CinemaSeed = {
  name: string;
  slug: string;
  city: string;
  address: string;
  phone: string;
  description: string;
  facilities: string[];

  basePrice: number;

  screens: ScreenPlan[];

  colors: [
    string,
    string,
  ];
};

type FoodSeed = {
  name: string;
  slug: string;
  description: string;

  category:
    | "popcorn"
    | "beverage"
    | "snack"
    | "combo"
    | "other";

  price: number;

  isVegetarian: boolean;
  isAvailable: boolean;
  isFeatured: boolean;

  colors: [
    string,
    string,
  ];
};

type SeatLayoutItem = {
  seatCode: string;
  row: string;
  number: number;

  type:
    ScreenSeatType;

  priceMultiplier: number;
  isDisabled: boolean;
};

type ShowtimeSeedRecord = {
  movieId:
    mongoose.Types.ObjectId;

  cinemaId:
    mongoose.Types.ObjectId;

  screenId:
    mongoose.Types.ObjectId;

  startsAt: Date;
  endsAt: Date;

  regularPrice: number;
  premiumPrice: number;
  reclinerPrice: number;

  cleanupMinutes: number;

  status:
    "scheduled";

  isActive: boolean;
};

type ShowtimeSeatRecord = {
  showtimeId:
    mongoose.Types.ObjectId;

  screenId:
    mongoose.Types.ObjectId;

  seatCode: string;
  row: string;
  number: number;

  type:
    ScreenSeatType;

  price: number;

  status:
    "available";
};

/*
 * QFX-inspired current and upcoming
 * catalogue for local coursework data.
 */
const movieSeeds:
  MovieSeed[] = [
    {
      title:
        "The Odyssey",

      slug:
        "the-odyssey",

      description:
        "After the Trojan War, Odysseus begins a dangerous journey home through hostile seas, mythic creatures and the will of the gods.",

      genre: [
        "Action",
        "Adventure",
        "Fantasy",
      ],

      language:
        "English, Hindi Dubbed",

      duration:
        180,

      releaseDate:
        "2026-07-17",

      rating:
        "PG-13",

      director:
        "Christopher Nolan",

      cast: [
        "Matt Damon",
        "Tom Holland",
        "Anne Hathaway",
        "Robert Pattinson",
        "Lupita Nyong'o",
        "Zendaya",
        "Charlize Theron",
      ],

      featured:
        true,

      colors: [
        "#052e4f",
        "#b88935",
      ],
    },

    {
      title:
        "Spider-Man: Brand New Day",

      slug:
        "spider-man-brand-new-day",

      description:
        "Peter Parker attempts to begin a new chapter, but a dangerous threat forces him to return as Spider-Man and protect the people closest to him.",

      genre: [
        "Action",
        "Adventure",
        "Sci-Fi",
      ],

      language:
        "English, Hindi Dubbed",

      duration:
        145,

      releaseDate:
        "2026-07-30",

      rating:
        "PG-13",

      director:
        "Destin Daniel Cretton",

      cast: [
        "Tom Holland",
        "Zendaya",
        "Mark Ruffalo",
        "Jon Bernthal",
        "Sadie Sink",
        "Jacob Batalon",
      ],

      featured:
        true,

      colors: [
        "#950d1b",
        "#153b72",
      ],
    },

    {
      title:
        "Gauthali",

      slug:
        "gauthali",

      description:
        "A heartfelt Nepali family drama exploring relationships, difficult choices and the meaning of home across changing generations.",

      genre: [
        "Social Drama",
        "Family",
      ],

      language:
        "Nepali",

      duration:
        135,

      releaseDate:
        "2026-07-24",

      rating:
        "PG",

      director:
        "To be announced",

      cast: [
        "Nepali Ensemble Cast",
      ],

      featured:
        true,

      colors: [
        "#6f351e",
        "#d7a55c",
      ],
    },

    {
      title:
        "Obsession",

      slug:
        "obsession-2026",

      description:
        "A disturbing attraction slowly turns into a terrifying mystery as love, suspicion and danger become impossible to separate.",

      genre: [
        "Thriller",
        "Horror",
        "Romance",
      ],

      language:
        "English",

      duration:
        115,

      releaseDate:
        "2026-07-24",

      rating:
        "A",

      director:
        "To be announced",

      cast: [
        "International Ensemble Cast",
      ],

      featured:
        true,

      colors: [
        "#270514",
        "#991c4e",
      ],
    },

    {
      title:
        "Dhurandhar: The Revenge",

      slug:
        "dhurandhar-the-revenge",

      description:
        "An undercover operation grows increasingly dangerous as hidden loyalties, criminal networks and personal revenge collide.",

      genre: [
        "Action",
        "Crime",
        "Thriller",
      ],

      language:
        "Hindi",

      duration:
        155,

      releaseDate:
        "2026-07-24",

      rating:
        "A",

      director:
        "To be announced",

      cast: [
        "Hindi Ensemble Cast",
      ],

      featured:
        false,

      colors: [
        "#1e1e20",
        "#8a4a27",
      ],
    },

    {
      title:
        "Paran",

      slug:
        "paran",

      description:
        "Set in Dhankuta, Paran follows a family confronting love, legacy, separation and the emotional meaning of belonging.",

      genre: [
        "Drama",
        "Family",
      ],

      language:
        "Nepali",

      duration:
        142,

      releaseDate:
        "2026-07-25",

      rating:
        "PG",

      director:
        "To be announced",

      cast: [
        "Nepali Ensemble Cast",
      ],

      featured:
        false,

      colors: [
        "#174a31",
        "#cab071",
      ],
    },

    {
      title:
        "Demon Slayer: Infinity Castle",

      slug:
        "demon-slayer-infinity-castle",

      description:
        "Tanjiro, Nezuko and the Hashira are drawn into the Infinity Castle for a decisive confrontation against the most powerful demons.",

      genre: [
        "Animation",
        "Action",
        "Fantasy",
      ],

      language:
        "Japanese, English Dubbed",

      duration:
        155,

      releaseDate:
        "2026-07-18",

      rating:
        "PG-13",

      director:
        "Haruo Sotozaki",

      cast: [
        "Natsuki Hanae",
        "Akari Kito",
        "Hiro Shimono",
        "Yoshitsugu Matsuoka",
      ],

      featured:
        false,

      colors: [
        "#130b24",
        "#dc3d3d",
      ],
    },

    {
      title:
        "Attack on Titan: The Last Attack",

      slug:
        "attack-on-titan-the-last-attack",

      description:
        "The final conflict reaches its devastating conclusion as former allies fight to determine the future of humanity.",

      genre: [
        "Animation",
        "Action",
        "Drama",
      ],

      language:
        "Japanese, English Dubbed",

      duration:
        145,

      releaseDate:
        "2026-07-31",

      rating:
        "PG-13",

      director:
        "Yuichiro Hayashi",

      cast: [
        "Yuki Kaji",
        "Yui Ishikawa",
        "Marina Inoue",
      ],

      featured:
        false,

      colors: [
        "#211d18",
        "#8c2f21",
      ],
    },

    {
      title:
        "Halee",

      slug:
        "halee",

      description:
        "A contemporary Nepali social drama following ordinary people whose lives are transformed by one unexpected event.",

      genre: [
        "Social Drama",
        "Family",
      ],

      language:
        "Nepali",

      duration:
        130,

      releaseDate:
        "2026-08-07",

      rating:
        "PG",

      director:
        "To be announced",

      cast: [
        "Nepali Ensemble Cast",
      ],

      featured:
        false,

      colors: [
        "#245968",
        "#d79b58",
      ],
    },

    {
      title:
        "Dhamaal 4",

      slug:
        "dhamaal-4",

      description:
        "A new misunderstanding sends an eccentric group of friends into another chaotic adventure filled with greed, confusion and comedy.",

      genre: [
        "Comedy",
        "Drama",
      ],

      language:
        "Hindi",

      duration:
        145,

      releaseDate:
        "2026-08-14",

      rating:
        "PG-13",

      director:
        "Indra Kumar",

      cast: [
        "Hindi Comedy Ensemble",
      ],

      featured:
        false,

      colors: [
        "#5f1d72",
        "#ffba42",
      ],
    },

    {
      title:
        "Evil",

      slug:
        "evil-2026",

      description:
        "A family discovers that the dark history surrounding their new home may not be history at all.",

      genre: [
        "Horror",
        "Mystery",
        "Thriller",
      ],

      language:
        "English",

      duration:
        110,

      releaseDate:
        "2026-08-14",

      rating:
        "A",

      director:
        "To be announced",

      cast: [
        "International Ensemble Cast",
      ],

      featured:
        false,

      colors: [
        "#090b0e",
        "#4f141d",
      ],
    },

    {
      title:
        "The End of Oak Street",

      slug:
        "the-end-of-oak-street",

      description:
        "A quiet neighbourhood becomes the centre of a frightening mystery when the residents of Oak Street begin disappearing.",

      genre: [
        "Mystery",
        "Horror",
        "Thriller",
      ],

      language:
        "English",

      duration:
        105,

      releaseDate:
        "2026-08-14",

      rating:
        "A",

      director:
        "To be announced",

      cast: [
        "International Ensemble Cast",
      ],

      featured:
        false,

      colors: [
        "#14201d",
        "#876b42",
      ],
    },
  ];

const cinemaSeeds:
  CinemaSeed[] = [
    {
      name:
        "CineTix Civil Mall",

      slug:
        "cinetix-civil-mall",

      city:
        "Kathmandu",

      address:
        "Civil Mall, Sundhara, Kathmandu",

      phone:
        "+977-01-5350001",

      description:
        "A flagship city-centre multiplex with large-format projection, premium audio and multiple food counters.",

      facilities: [
        "4K Laser Projection",
        "Dolby Atmos",
        "3D Screens",
        "Recliner Seating",
        "Food & Beverage Counter",
        "Wheelchair Access",
        "Online Booking",
      ],

      basePrice:
        500,

      screens: [
        {
          name:
            "Atmos Hall 1",

          profile:
            "large",
        },
        {
          name:
            "Audi 2",

          profile:
            "standard",
        },
        {
          name:
            "Audi 3",

          profile:
            "standard",
        },
        {
          name:
            "Recliner Lounge",

          profile:
            "premium",
        },
      ],

      colors: [
        "#821622",
        "#161b28",
      ],
    },

    {
      name:
        "CineTix Chhaya Center",

      slug:
        "cinetix-chhaya-center",

      city:
        "Kathmandu",

      address:
        "Chhaya Center, Thamel, Kathmandu",

      phone:
        "+977-01-5250002",

      description:
        "A premium tourist-district multiplex offering modern screens, comfortable seating and late-evening shows.",

      facilities: [
        "Dolby Atmos",
        "4K Projection",
        "Premium Seating",
        "Parking",
        "Food Court",
        "Online Booking",
      ],

      basePrice:
        550,

      screens: [
        {
          name:
            "Grand Audi 1",

          profile:
            "large",
        },
        {
          name:
            "Premium Audi 2",

          profile:
            "premium",
        },
        {
          name:
            "Audi 3",

          profile:
            "standard",
        },
      ],

      colors: [
        "#3e164f",
        "#c48a31",
      ],
    },

    {
      name:
        "CineTix Labim Mall",

      slug:
        "cinetix-labim-mall",

      city:
        "Lalitpur",

      address:
        "Labim Mall, Pulchowk, Lalitpur",

      phone:
        "+977-01-5550003",

      description:
        "A modern Lalitpur multiplex featuring sharp digital projection, spacious halls and premium comfort.",

      facilities: [
        "4K Laser Projection",
        "Dolby Atmos",
        "Premium Seating",
        "Parking",
        "Food Court",
        "Wheelchair Access",
      ],

      basePrice:
        500,

      screens: [
        {
          name:
            "Laser Hall 1",

          profile:
            "large",
        },
        {
          name:
            "Audi 2",

          profile:
            "standard",
        },
        {
          name:
            "Premium Audi 3",

          profile:
            "premium",
        },
      ],

      colors: [
        "#153b72",
        "#1c6f72",
      ],
    },

    {
      name:
        "CineTix Bhaktapur",

      slug:
        "cinetix-bhaktapur",

      city:
        "Bhaktapur",

      address:
        "Radhe Radhe, Bhaktapur",

      phone:
        "+977-01-6630004",

      description:
        "A convenient eastern-valley cinema with two comfortable digital auditoriums.",

      facilities: [
        "Digital Projection",
        "Dolby Audio",
        "Food Counter",
        "Parking",
        "Online Booking",
      ],

      basePrice:
        425,

      screens: [
        {
          name:
            "Audi 1",

          profile:
            "standard",
        },
        {
          name:
            "Audi 2",

          profile:
            "compact",
        },
      ],

      colors: [
        "#884118",
        "#d2a063",
      ],
    },

    {
      name:
        "CineTix Lakeside Pokhara",

      slug:
        "cinetix-lakeside-pokhara",

      city:
        "Pokhara",

      address:
        "Lakeside, Pokhara",

      phone:
        "+977-61-470005",

      description:
        "A destination multiplex serving Pokhara with large-format entertainment and relaxed premium seating.",

      facilities: [
        "4K Projection",
        "Dolby Atmos",
        "3D",
        "Premium Seating",
        "Food Court",
        "Parking",
      ],

      basePrice:
        450,

      screens: [
        {
          name:
            "Lakeview Atmos 1",

          profile:
            "large",
        },
        {
          name:
            "Audi 2",

          profile:
            "standard",
        },
        {
          name:
            "Recliner Audi 3",

          profile:
            "premium",
        },
      ],

      colors: [
        "#075668",
        "#5e9db2",
      ],
    },

    {
      name:
        "CineTix Butwal",

      slug:
        "cinetix-butwal",

      city:
        "Butwal",

      address:
        "Kalikanagar, Butwal",

      phone:
        "+977-71-550006",

      description:
        "A modern regional multiplex offering family-friendly programming and convenient online ticketing.",

      facilities: [
        "Digital Projection",
        "Dolby Audio",
        "Premium Seating",
        "Food Counter",
        "Parking",
      ],

      basePrice:
        400,

      screens: [
        {
          name:
            "Audi 1",

          profile:
            "standard",
        },
        {
          name:
            "Premium Audi 2",

          profile:
            "premium",
        },
      ],

      colors: [
        "#8c291b",
        "#dd8a36",
      ],
    },

    {
      name:
        "CineTix Bageshwori",

      slug:
        "cinetix-bageshwori",

      city:
        "Nepalgunj",

      address:
        "Dhamboji, Nepalgunj",

      phone:
        "+977-81-520007",

      description:
        "A western Nepal multiplex presenting Nepali, Hindi and international releases.",

      facilities: [
        "Digital Projection",
        "Dolby Audio",
        "Food Counter",
        "Online Booking",
        "Wheelchair Access",
      ],

      basePrice:
        350,

      screens: [
        {
          name:
            "Audi 1",

          profile:
            "standard",
        },
        {
          name:
            "Audi 2",

          profile:
            "compact",
        },
      ],

      colors: [
        "#493170",
        "#b55d72",
      ],
    },

    {
      name:
        "CineTix Jalma",

      slug:
        "cinetix-jalma",

      city:
        "Narayangarh",

      address:
        "Bharatpur Heights, Narayangarh",

      phone:
        "+977-56-520008",

      description:
        "A central Chitwan multiplex with comfortable halls, accessible facilities and convenient parking.",

      facilities: [
        "Digital Projection",
        "Dolby Audio",
        "Premium Seating",
        "Parking",
        "Food Counter",
      ],

      basePrice:
        400,

      screens: [
        {
          name:
            "Audi 1",

          profile:
            "standard",
        },
        {
          name:
            "Premium Audi 2",

          profile:
            "premium",
        },
      ],

      colors: [
        "#16503f",
        "#8faa56",
      ],
    },

    {
      name:
        "CineTix Birtamode",

      slug:
        "cinetix-birtamode",

      city:
        "Birtamode",

      address:
        "Mukti Chowk, Birtamode",

      phone:
        "+977-23-540009",

      description:
        "An eastern Nepal multiplex showing Nepali, Hindi and English releases throughout the week.",

      facilities: [
        "Digital Projection",
        "Dolby Audio",
        "Food Counter",
        "Parking",
        "Online Booking",
      ],

      basePrice:
        350,

      screens: [
        {
          name:
            "Audi 1",

          profile:
            "standard",
        },
        {
          name:
            "Audi 2",

          profile:
            "compact",
        },
      ],

      colors: [
        "#23465a",
        "#b86643",
      ],
    },

    {
      name:
        "CineTix Itahari",

      slug:
        "cinetix-itahari",

      city:
        "Itahari",

      address:
        "Main Road, Itahari",

      phone:
        "+977-25-580010",

      description:
        "A city-centre entertainment venue with comfortable seating and digital presentation.",

      facilities: [
        "Digital Projection",
        "Dolby Audio",
        "Premium Seating",
        "Food Counter",
        "Online Booking",
      ],

      basePrice:
        350,

      screens: [
        {
          name:
            "Audi 1",

          profile:
            "standard",
        },
        {
          name:
            "Premium Audi 2",

          profile:
            "premium",
        },
      ],

      colors: [
        "#17386d",
        "#319792",
      ],
    },

    {
      name:
        "CineTix Birgunj",

      slug:
        "cinetix-birgunj",

      city:
        "Birgunj",

      address:
        "Adarsh Nagar, Birgunj",

      phone:
        "+977-51-520011",

      description:
        "A vibrant Madhesh multiplex offering frequent Hindi, Nepali and international screenings.",

      facilities: [
        "Digital Projection",
        "Dolby Audio",
        "Food Counter",
        "Parking",
        "Online Booking",
      ],

      basePrice:
        350,

      screens: [
        {
          name:
            "Audi 1",

          profile:
            "standard",
        },
        {
          name:
            "Audi 2",

          profile:
            "compact",
        },
      ],

      colors: [
        "#8b362d",
        "#e0a244",
      ],
    },
  ];

const foodSeeds:
  FoodSeed[] = [
    {
      name:
        "Classic Salted Popcorn",

      slug:
        "classic-salted-popcorn",

      description:
        "Freshly popped cinema popcorn with classic salted butter seasoning.",

      category:
        "popcorn",

      price:
        250,

      isVegetarian:
        true,

      isAvailable:
        true,

      isFeatured:
        true,

      colors: [
        "#e1a62c",
        "#8e3e16",
      ],
    },

    {
      name:
        "Caramel Popcorn",

      slug:
        "caramel-popcorn",

      description:
        "Crunchy popcorn coated with a sweet caramel glaze.",

      category:
        "popcorn",

      price:
        320,

      isVegetarian:
        true,

      isAvailable:
        true,

      isFeatured:
        true,

      colors: [
        "#c77720",
        "#5d2511",
      ],
    },

    {
      name:
        "Cheese Popcorn",

      slug:
        "cheese-popcorn",

      description:
        "Cinema popcorn finished with a rich savoury cheese seasoning.",

      category:
        "popcorn",

      price:
        350,

      isVegetarian:
        true,

      isAvailable:
        true,

      isFeatured:
        false,

      colors: [
        "#d7a91f",
        "#8a4c16",
      ],
    },

    {
      name:
        "Coca-Cola 500ml",

      slug:
        "coca-cola-500ml",

      description:
        "Chilled 500ml Coca-Cola soft drink.",

      category:
        "beverage",

      price:
        180,

      isVegetarian:
        true,

      isAvailable:
        true,

      isFeatured:
        true,

      colors: [
        "#a51018",
        "#370408",
      ],
    },

    {
      name:
        "Sprite 500ml",

      slug:
        "sprite-500ml",

      description:
        "Chilled lemon-lime soft drink.",

      category:
        "beverage",

      price:
        180,

      isVegetarian:
        true,

      isAvailable:
        true,

      isFeatured:
        false,

      colors: [
        "#0b8a50",
        "#8fd344",
      ],
    },

    {
      name:
        "Mineral Water",

      slug:
        "mineral-water",

      description:
        "Sealed bottled drinking water.",

      category:
        "beverage",

      price:
        80,

      isVegetarian:
        true,

      isAvailable:
        true,

      isFeatured:
        false,

      colors: [
        "#0b6490",
        "#70c6e5",
      ],
    },

    {
      name:
        "Nachos with Cheese",

      slug:
        "nachos-with-cheese",

      description:
        "Crispy tortilla chips served with warm cheese dip.",

      category:
        "snack",

      price:
        350,

      isVegetarian:
        true,

      isAvailable:
        true,

      isFeatured:
        true,

      colors: [
        "#e4a223",
        "#bb491b",
      ],
    },

    {
      name:
        "Veg Momo",

      slug:
        "veg-momo",

      description:
        "Steamed vegetable dumplings served with cinema-style tomato achar.",

      category:
        "snack",

      price:
        300,

      isVegetarian:
        true,

      isAvailable:
        true,

      isFeatured:
        false,

      colors: [
        "#4f8c3f",
        "#a3c35b",
      ],
    },

    {
      name:
        "Chicken Momo",

      slug:
        "chicken-momo",

      description:
        "Steamed chicken dumplings served with spicy tomato achar.",

      category:
        "snack",

      price:
        350,

      isVegetarian:
        false,

      isAvailable:
        true,

      isFeatured:
        true,

      colors: [
        "#993828",
        "#dc8c42",
      ],
    },

    {
      name:
        "Classic Hot Dog",

      slug:
        "classic-hot-dog",

      description:
        "Warm chicken sausage in a soft bun with mustard and ketchup.",

      category:
        "snack",

      price:
        320,

      isVegetarian:
        false,

      isAvailable:
        true,

      isFeatured:
        false,

      colors: [
        "#9d2c24",
        "#d39b42",
      ],
    },

    {
      name:
        "Couple Combo",

      slug:
        "couple-combo",

      description:
        "One large popcorn and two regular soft drinks.",

      category:
        "combo",

      price:
        799,

      isVegetarian:
        true,

      isAvailable:
        true,

      isFeatured:
        true,

      colors: [
        "#9c1f38",
        "#351263",
      ],
    },

    {
      name:
        "Family Combo",

      slug:
        "family-combo",

      description:
        "Two large popcorns, four drinks and one nachos with cheese.",

      category:
        "combo",

      price:
        1299,

      isVegetarian:
        true,

      isAvailable:
        true,

      isFeatured:
        true,

      colors: [
        "#184988",
        "#8b2363",
      ],
    },
  ];

const screenProfiles: Record<
  ScreenProfile,
  {
    rows: number;
    seatsPerRow: number;
  }
> = {
  large: {
    rows: 12,
    seatsPerRow: 18,
  },

  standard: {
    rows: 10,
    seatsPerRow: 16,
  },

  premium: {
    rows: 8,
    seatsPerRow: 14,
  },

  compact: {
    rows: 7,
    seatsPerRow: 12,
  },
};

const weekdaySlots = [
  {
    hour: 9,
    minute: 30,
  },
  {
    hour: 14,
    minute: 0,
  },
  {
    hour: 18,
    minute: 30,
  },
];

const saturdaySlots = [
  {
    hour: 8,
    minute: 30,
  },
  {
    hour: 12,
    minute: 45,
  },
  {
    hour: 17,
    minute: 0,
  },
  {
    hour: 21,
    minute: 15,
  },
];

function ensureResetIsAllowed():
  void {
  if (
    process.env
      .CONFIRM_RESET !==
    REQUIRED_CONFIRMATION
  ) {
    throw new Error(
      [
        "Database reset was blocked.",
        "",
        "Run the command with:",
        `CONFIRM_RESET=${REQUIRED_CONFIRMATION} npm run seed:cinema`,
      ].join("\n"),
    );
  }

  if (
    env.isProduction &&
    process.env
      .ALLOW_PRODUCTION_SEED !==
      "YES"
  ) {
    throw new Error(
      [
        "Production database reset is disabled.",
        "",
        "To override intentionally, add:",
        "ALLOW_PRODUCTION_SEED=YES",
      ].join("\n"),
    );
  }
}

function escapeXml(
  value: string,
): string {
  return value
    .replace(
      /&/g,
      "&amp;",
    )
    .replace(
      /</g,
      "&lt;",
    )
    .replace(
      />/g,
      "&gt;",
    )
    .replace(
      /"/g,
      "&quot;",
    )
    .replace(
      /'/g,
      "&apos;",
    );
}

function wrapWords(
  value: string,
  maximumCharacters: number,
): string[] {
  const words =
    value
      .trim()
      .split(/\s+/)
      .filter(Boolean);

  const lines:
    string[] = [];

  let currentLine =
    "";

  for (
    const word of words
  ) {
    const candidate =
      currentLine
        ? `${currentLine} ${word}`
        : word;

    if (
      candidate.length <=
      maximumCharacters
    ) {
      currentLine =
        candidate;

      continue;
    }

    if (currentLine) {
      lines.push(
        currentLine,
      );
    }

    currentLine =
      word;
  }

  if (currentLine) {
    lines.push(
      currentLine,
    );
  }

  return lines;
}

function svgTextLines(
  lines: string[],
  options: {
    x: number;
    y: number;
    fontSize: number;
    lineHeight: number;
    anchor?:
      | "start"
      | "middle"
      | "end";
    weight?: number;
  },
): string {
  const anchor =
    options.anchor ??
    "start";

  const weight =
    options.weight ??
    700;

  return lines
    .map(
      (
        line,
        index,
      ) => `
        <text
          x="${options.x}"
          y="${
            options.y +
            index *
              options.lineHeight
          }"
          fill="#ffffff"
          font-family="Arial, Helvetica, sans-serif"
          font-size="${options.fontSize}"
          font-weight="${weight}"
          text-anchor="${anchor}"
        >${escapeXml(line)}</text>
      `,
    )
    .join("");
}

function writeSeedFile(
  relativePath: string,
  contents: string,
): void {
  const absolutePath =
    path.resolve(
      seedUploadRoot,
      relativePath,
    );

  fs.mkdirSync(
    path.dirname(
      absolutePath,
    ),
    {
      recursive: true,
    },
  );

  fs.writeFileSync(
    absolutePath,
    contents,
    "utf8",
  );
}

function publicSeedUrl(
  relativePath: string,
): string {
  return `${backendBaseUrl}/uploads/seed/${relativePath
    .split(path.sep)
    .join("/")}`;
}

function createMovieAssets(
  movie: MovieSeed,
): {
  posterUrl: string;
  bannerUrl: string;
} {
  const [
    startColor,
    endColor,
  ] =
    movie.colors;

  const posterPath =
    `movies/${movie.slug}-poster.svg`;

  const bannerPath =
    `movies/${movie.slug}-banner.svg`;

  const posterTitleLines =
    wrapWords(
      movie.title,
      17,
    ).slice(
      0,
      4,
    );

  const bannerTitleLines =
    wrapWords(
      movie.title,
      28,
    ).slice(
      0,
      2,
    );

  const posterSvg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="900"
      height="1350"
      viewBox="0 0 900 1350"
    >
      <defs>
        <linearGradient
          id="background"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0%"
            stop-color="${startColor}"
          />
          <stop
            offset="100%"
            stop-color="${endColor}"
          />
        </linearGradient>

        <radialGradient
          id="light"
          cx="70%"
          cy="20%"
          r="70%"
        >
          <stop
            offset="0%"
            stop-color="#ffffff"
            stop-opacity="0.32"
          />
          <stop
            offset="100%"
            stop-color="#ffffff"
            stop-opacity="0"
          />
        </radialGradient>

        <filter id="blur">
          <feGaussianBlur stdDeviation="70" />
        </filter>
      </defs>

      <rect
        width="900"
        height="1350"
        fill="url(#background)"
      />

      <circle
        cx="720"
        cy="220"
        r="300"
        fill="url(#light)"
      />

      <circle
        cx="160"
        cy="680"
        r="230"
        fill="#ffffff"
        opacity="0.07"
        filter="url(#blur)"
      />

      <path
        d="M0 890 L900 610 L900 1350 L0 1350 Z"
        fill="#05060a"
        opacity="0.76"
      />

      <path
        d="M0 990 L900 760"
        stroke="#ffffff"
        stroke-opacity="0.15"
        stroke-width="4"
      />

      <rect
        x="55"
        y="55"
        width="170"
        height="54"
        rx="27"
        fill="#000000"
        fill-opacity="0.48"
      />

      <text
        x="140"
        y="91"
        fill="#ffffff"
        font-family="Arial, Helvetica, sans-serif"
        font-size="21"
        font-weight="700"
        text-anchor="middle"
        letter-spacing="4"
      >CINETIX</text>

      <text
        x="70"
        y="950"
        fill="#ffffff"
        fill-opacity="0.66"
        font-family="Arial, Helvetica, sans-serif"
        font-size="23"
        font-weight="700"
        letter-spacing="5"
      >${escapeXml(
        movie.genre
          .slice(
            0,
            2,
          )
          .join(" • ")
          .toUpperCase(),
      )}</text>

      ${svgTextLines(
        posterTitleLines,
        {
          x: 70,
          y: 1030,
          fontSize: 66,
          lineHeight: 72,
          weight: 900,
        },
      )}

      <text
        x="70"
        y="1290"
        fill="#ffffff"
        fill-opacity="0.7"
        font-family="Arial, Helvetica, sans-serif"
        font-size="25"
      >${escapeXml(
        movie.language,
      )} • ${movie.duration} MIN • ${escapeXml(
        movie.rating,
      )}</text>
    </svg>
  `;

  const bannerSvg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1600"
      height="600"
      viewBox="0 0 1600 600"
    >
      <defs>
        <linearGradient
          id="background"
          x1="0"
          y1="0"
          x2="1"
          y2="0"
        >
          <stop
            offset="0%"
            stop-color="${startColor}"
          />

          <stop
            offset="70%"
            stop-color="${endColor}"
          />

          <stop
            offset="100%"
            stop-color="#05060a"
          />
        </linearGradient>

        <radialGradient
          id="glow"
          cx="78%"
          cy="35%"
          r="52%"
        >
          <stop
            offset="0%"
            stop-color="#ffffff"
            stop-opacity="0.25"
          />

          <stop
            offset="100%"
            stop-color="#ffffff"
            stop-opacity="0"
          />
        </radialGradient>
      </defs>

      <rect
        width="1600"
        height="600"
        fill="url(#background)"
      />

      <circle
        cx="1270"
        cy="220"
        r="360"
        fill="url(#glow)"
      />

      <path
        d="M950 0 L1600 0 L1600 600 L700 600 Z"
        fill="#020308"
        opacity="0.38"
      />

      <rect
        x="75"
        y="70"
        width="190"
        height="58"
        rx="29"
        fill="#000000"
        fill-opacity="0.45"
      />

      <text
        x="170"
        y="108"
        fill="#ffffff"
        font-family="Arial, Helvetica, sans-serif"
        font-size="22"
        font-weight="800"
        text-anchor="middle"
        letter-spacing="5"
      >CINETIX</text>

      <text
        x="80"
        y="250"
        fill="#ffffff"
        fill-opacity="0.7"
        font-family="Arial, Helvetica, sans-serif"
        font-size="25"
        font-weight="700"
        letter-spacing="5"
      >${escapeXml(
        movie.genre
          .join(" • ")
          .toUpperCase(),
      )}</text>

      ${svgTextLines(
        bannerTitleLines,
        {
          x: 80,
          y: 345,
          fontSize: 76,
          lineHeight: 82,
          weight: 900,
        },
      )}

      <text
        x="82"
        y="535"
        fill="#ffffff"
        fill-opacity="0.72"
        font-family="Arial, Helvetica, sans-serif"
        font-size="26"
      >${escapeXml(
        movie.language,
      )} • ${movie.duration} MIN • ${escapeXml(
        movie.rating,
      )}</text>
    </svg>
  `;

  writeSeedFile(
    posterPath,
    posterSvg,
  );

  writeSeedFile(
    bannerPath,
    bannerSvg,
  );

  return {
    posterUrl:
      publicSeedUrl(
        posterPath,
      ),

    bannerUrl:
      publicSeedUrl(
        bannerPath,
      ),
  };
}

function createCinemaAsset(
  cinema: CinemaSeed,
): string {
  const relativePath =
    `cinemas/${cinema.slug}.svg`;

  const [
    startColor,
    endColor,
  ] =
    cinema.colors;

  const titleLines =
    wrapWords(
      cinema.name,
      27,
    ).slice(
      0,
      2,
    );

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1600"
      height="700"
      viewBox="0 0 1600 700"
    >
      <defs>
        <linearGradient
          id="background"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0%"
            stop-color="${startColor}"
          />

          <stop
            offset="100%"
            stop-color="${endColor}"
          />
        </linearGradient>
      </defs>

      <rect
        width="1600"
        height="700"
        fill="url(#background)"
      />

      <rect
        x="0"
        y="450"
        width="1600"
        height="250"
        fill="#05060a"
        opacity="0.62"
      />

      <g
        fill="#ffffff"
        fill-opacity="0.11"
      >
        <rect
          x="820"
          y="130"
          width="620"
          height="360"
          rx="30"
        />

        <rect
          x="880"
          y="195"
          width="500"
          height="230"
          rx="18"
          fill-opacity="0.15"
        />

        <circle
          cx="1010"
          cy="310"
          r="54"
        />

        <circle
          cx="1250"
          cy="310"
          r="54"
        />
      </g>

      <rect
        x="70"
        y="70"
        width="190"
        height="58"
        rx="29"
        fill="#000000"
        fill-opacity="0.45"
      />

      <text
        x="165"
        y="108"
        fill="#ffffff"
        font-family="Arial, Helvetica, sans-serif"
        font-size="22"
        font-weight="800"
        text-anchor="middle"
        letter-spacing="5"
      >CINETIX</text>

      ${svgTextLines(
        titleLines,
        {
          x: 75,
          y: 300,
          fontSize: 72,
          lineHeight: 80,
          weight: 900,
        },
      )}

      <text
        x="78"
        y="540"
        fill="#ffffff"
        font-family="Arial, Helvetica, sans-serif"
        font-size="35"
        font-weight="700"
      >${escapeXml(
        cinema.city,
      )}</text>

      <text
        x="78"
        y="595"
        fill="#ffffff"
        fill-opacity="0.7"
        font-family="Arial, Helvetica, sans-serif"
        font-size="27"
      >${escapeXml(
        cinema.address,
      )}</text>
    </svg>
  `;

  writeSeedFile(
    relativePath,
    svg,
  );

  return publicSeedUrl(
    relativePath,
  );
}

function createFoodAsset(
  food: FoodSeed,
): string {
  const relativePath =
    `foods/${food.slug}.svg`;

  const [
    startColor,
    endColor,
  ] =
    food.colors;

  const titleLines =
    wrapWords(
      food.name,
      17,
    ).slice(
      0,
      3,
    );

  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="900"
      height="900"
      viewBox="0 0 900 900"
    >
      <defs>
        <linearGradient
          id="background"
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0%"
            stop-color="${startColor}"
          />

          <stop
            offset="100%"
            stop-color="${endColor}"
          />
        </linearGradient>
      </defs>

      <rect
        width="900"
        height="900"
        fill="url(#background)"
      />

      <circle
        cx="450"
        cy="350"
        r="220"
        fill="#ffffff"
        fill-opacity="0.1"
      />

      <circle
        cx="450"
        cy="350"
        r="150"
        fill="#ffffff"
        fill-opacity="0.14"
      />

      <path
        d="M290 300 L610 300 L565 585 L335 585 Z"
        fill="#ffffff"
        fill-opacity="0.22"
      />

      <rect
        x="55"
        y="55"
        width="180"
        height="54"
        rx="27"
        fill="#000000"
        fill-opacity="0.42"
      />

      <text
        x="145"
        y="91"
        fill="#ffffff"
        font-family="Arial, Helvetica, sans-serif"
        font-size="20"
        font-weight="800"
        text-anchor="middle"
        letter-spacing="4"
      >CINETIX</text>

      ${svgTextLines(
        titleLines,
        {
          x: 450,
          y: 695,
          fontSize: 55,
          lineHeight: 62,
          anchor: "middle",
          weight: 900,
        },
      )}

      <text
        x="450"
        y="850"
        fill="#ffffff"
        fill-opacity="0.72"
        font-family="Arial, Helvetica, sans-serif"
        font-size="30"
        text-anchor="middle"
      >NPR ${food.price}</text>
    </svg>
  `;

  writeSeedFile(
    relativePath,
    svg,
  );

  return publicSeedUrl(
    relativePath,
  );
}

function createBrandAssets(): {
  logoUrl: string;
  faviconUrl: string;
  heroImageUrl: string;
} {
  const logoPath =
    "branding/cinetix-logo.svg";

  const faviconPath =
    "branding/cinetix-favicon.svg";

  const heroPath =
    "branding/cinetix-hero.svg";

  writeSeedFile(
    logoPath,
    `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="720"
        height="240"
        viewBox="0 0 720 240"
      >
        <rect
          width="720"
          height="240"
          rx="34"
          fill="#090b10"
        />

        <rect
          x="42"
          y="42"
          width="156"
          height="156"
          rx="38"
          fill="#dc2626"
        />

        <path
          d="M88 91 H152 V149 H88 Z"
          fill="none"
          stroke="#ffffff"
          stroke-width="13"
        />

        <circle
          cx="88"
          cy="91"
          r="13"
          fill="#dc2626"
        />

        <circle
          cx="152"
          cy="149"
          r="13"
          fill="#dc2626"
        />

        <text
          x="235"
          y="142"
          fill="#ffffff"
          font-family="Arial, Helvetica, sans-serif"
          font-size="78"
          font-weight="900"
        >CineTix</text>

        <text
          x="239"
          y="184"
          fill="#ffffff"
          fill-opacity="0.48"
          font-family="Arial, Helvetica, sans-serif"
          font-size="20"
          letter-spacing="7"
        >NEPAL CINEMA</text>
      </svg>
    `,
  );

  writeSeedFile(
    faviconPath,
    `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="256"
        height="256"
        viewBox="0 0 256 256"
      >
        <rect
          width="256"
          height="256"
          rx="60"
          fill="#dc2626"
        />

        <path
          d="M72 77 H184 V179 H72 Z"
          fill="none"
          stroke="#ffffff"
          stroke-width="22"
        />

        <circle
          cx="72"
          cy="77"
          r="22"
          fill="#dc2626"
        />

        <circle
          cx="184"
          cy="179"
          r="22"
          fill="#dc2626"
        />
      </svg>
    `,
  );

  writeSeedFile(
    heroPath,
    `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1920"
        height="800"
        viewBox="0 0 1920 800"
      >
        <defs>
          <linearGradient
            id="background"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stop-color="#38080d"
            />

            <stop
              offset="55%"
              stop-color="#11141c"
            />

            <stop
              offset="100%"
              stop-color="#030406"
            />
          </linearGradient>

          <radialGradient
            id="glow"
            cx="72%"
            cy="25%"
            r="60%"
          >
            <stop
              offset="0%"
              stop-color="#dc2626"
              stop-opacity="0.42"
            />

            <stop
              offset="100%"
              stop-color="#dc2626"
              stop-opacity="0"
            />
          </radialGradient>
        </defs>

        <rect
          width="1920"
          height="800"
          fill="url(#background)"
        />

        <circle
          cx="1420"
          cy="210"
          r="500"
          fill="url(#glow)"
        />

        <path
          d="M0 620 L1920 350 L1920 800 L0 800 Z"
          fill="#000000"
          opacity="0.48"
        />

        <g
          fill="#ffffff"
          fill-opacity="0.08"
        >
          <rect
            x="1230"
            y="150"
            width="460"
            height="390"
            rx="24"
            transform="rotate(8 1460 345)"
          />

          <rect
            x="1040"
            y="225"
            width="390"
            height="330"
            rx="24"
            transform="rotate(-9 1235 390)"
          />
        </g>

        <text
          x="120"
          y="300"
          fill="#ffffff"
          font-family="Arial, Helvetica, sans-serif"
          font-size="34"
          font-weight="800"
          letter-spacing="9"
        >DISCOVER • BOOK • ENJOY</text>

        <text
          x="115"
          y="425"
          fill="#ffffff"
          font-family="Arial, Helvetica, sans-serif"
          font-size="105"
          font-weight="900"
        >Your next movie</text>

        <text
          x="115"
          y="535"
          fill="#ffffff"
          font-family="Arial, Helvetica, sans-serif"
          font-size="105"
          font-weight="900"
        >starts here.</text>

        <text
          x="122"
          y="620"
          fill="#ffffff"
          fill-opacity="0.56"
          font-family="Arial, Helvetica, sans-serif"
          font-size="30"
        >Movies, seats, snacks and digital tickets in one place.</text>
      </svg>
    `,
  );

  return {
    logoUrl:
      publicSeedUrl(
        logoPath,
      ),

    faviconUrl:
      publicSeedUrl(
        faviconPath,
      ),

    heroImageUrl:
      publicSeedUrl(
        heroPath,
      ),
  };
}

function youtubeTrailerSearchUrl(
  title: string,
): string {
  const searchQuery =
    encodeURIComponent(
      `${title} official trailer`,
    );

  /*
   * A search URL is used instead of
   * inventing fake YouTube video IDs.
   */
  return `https://www.youtube.com/results?search_query=${searchQuery}`;
}

function kathmanduTodayStart():
  Date {
  const parts =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone:
          "Asia/Kathmandu",

        year:
          "numeric",

        month:
          "2-digit",

        day:
          "2-digit",
      },
    ).formatToParts(
      new Date(),
    );

  const year =
    parts.find(
      (part) =>
        part.type ===
        "year",
    )?.value;

  const month =
    parts.find(
      (part) =>
        part.type ===
        "month",
    )?.value;

  const day =
    parts.find(
      (part) =>
        part.type ===
        "day",
    )?.value;

  if (
    !year ||
    !month ||
    !day
  ) {
    throw new Error(
      "Unable to determine Kathmandu date.",
    );
  }

  return new Date(
    `${year}-${month}-${day}T00:00:00+05:45`,
  );
}

function kathmanduDate(
  baseDate: Date,
  dayOffset: number,
  hour: number,
  minute: number,
): Date {
  return new Date(
    baseDate.getTime() +
      dayOffset *
        ONE_DAY_MS +
      (
        hour * 60 +
        minute
      ) *
        ONE_MINUTE_MS,
  );
}

function movieReleaseDate(
  value: string,
): Date {
  return new Date(
    `${value}T00:00:00+05:45`,
  );
}

function createSeatLayout(
  rows: number,
  seatsPerRow: number,
): SeatLayoutItem[] {
  const layout:
    SeatLayoutItem[] = [];

  const firstPremiumRow =
    Math.max(
      0,
      rows - 3,
    );

  const reclinerRow =
    rows - 1;

  const aisleLeft =
    Math.floor(
      seatsPerRow / 2,
    );

  const aisleRight =
    aisleLeft + 1;

  for (
    let rowIndex = 0;
    rowIndex < rows;
    rowIndex += 1
  ) {
    const row =
      String.fromCharCode(
        65 + rowIndex,
      );

    let type:
      ScreenSeatType =
      "regular";

    if (
      rowIndex ===
      reclinerRow
    ) {
      type =
        "recliner";
    } else if (
      rowIndex >=
      firstPremiumRow
    ) {
      type =
        "premium";
    }

    const priceMultiplier =
      type === "recliner"
        ? 1.6
        : type === "premium"
          ? 1.3
          : 1;

    for (
      let seatNumber = 1;
      seatNumber <=
      seatsPerRow;
      seatNumber += 1
    ) {
      /*
       * Two disabled positions create
       * a visual centre aisle.
       */
      const isDisabled =
        seatsPerRow >= 12 &&
        (
          seatNumber ===
            aisleLeft ||
          seatNumber ===
            aisleRight
        );

      layout.push({
        seatCode:
          `${row}${seatNumber}`,

        row,

        number:
          seatNumber,

        type,

        priceMultiplier,

        isDisabled,
      });
    }
  }

  return layout;
}

function screenExtraPrice(
  screenName: string,
): number {
  const normalizedName =
    screenName.toLowerCase();

  if (
    normalizedName.includes(
      "atmos",
    ) ||
    normalizedName.includes(
      "grand",
    ) ||
    normalizedName.includes(
      "laser",
    )
  ) {
    return 100;
  }

  if (
    normalizedName.includes(
      "premium",
    ) ||
    normalizedName.includes(
      "recliner",
    )
  ) {
    return 75;
  }

  return 0;
}

function seatPriceForType(
  showtime: {
    regularPrice: number;
    premiumPrice: number;
    reclinerPrice: number;
  },
  type: ScreenSeatType,
): number {
  if (
    type ===
    "premium"
  ) {
    return showtime
      .premiumPrice;
  }

  if (
    type ===
    "recliner"
  ) {
    return showtime
      .reclinerPrice;
  }

  return showtime
    .regularPrice;
}

async function clearTicketingData():
  Promise<void> {
  console.log(
    "Clearing ticketing data...",
  );

  /*
   * Order matters because these
   * collections reference each other.
   *
   * Users are intentionally excluded.
   */
  await BookingModel.deleteMany(
    {},
  );

  await SeatModel.deleteMany(
    {},
  );

  await ShowtimeModel.deleteMany(
    {},
  );

  await ScreenModel.deleteMany(
    {},
  );

  await CinemaModel.deleteMany(
    {},
  );

  await MovieModel.deleteMany(
    {},
  );

  await FoodModel.deleteMany(
    {},
  );

  await CouponModel.deleteMany(
    {},
  );

  await SettingsModel.deleteMany(
    {},
  );
}

async function seedMovies() {
  console.log(
    "Creating movie artwork...",
  );

  const today =
    kathmanduTodayStart();

  const records =
    movieSeeds.map(
      (movie) => {
        const releaseDate =
          movieReleaseDate(
            movie.releaseDate,
          );

        const status:
          MovieStatus =
          releaseDate <=
          today
            ? "now_showing"
            : "coming_soon";

        const media =
          createMovieAssets(
            movie,
          );

        return {
          title:
            movie.title,

          slug:
            movie.slug,

          description:
            movie.description,

          genre:
            movie.genre,

          language:
            movie.language,

          duration:
            movie.duration,

          releaseDate,

          rating:
            movie.rating,

          director:
            movie.director,

          cast:
            movie.cast,

          posterUrl:
            media.posterUrl,

          bannerUrl:
            media.bannerUrl,

          trailerUrl:
            youtubeTrailerSearchUrl(
              movie.title,
            ),

          status,

          featured:
            movie.featured,
        };
      },
    );

  const movies =
    await MovieModel.insertMany(
      records,
    );

  console.log(
    `Created ${movies.length} movies.`,
  );

  return movies;
}

async function seedCinemasAndScreens() {
  console.log(
    "Creating cinemas and halls...",
  );

  const cinemaRecords =
    cinemaSeeds.map(
      (cinema) => ({
        name:
          cinema.name,

        slug:
          cinema.slug,

        city:
          cinema.city,

        address:
          cinema.address,

        phone:
          cinema.phone,

        description:
          cinema.description,

        facilities:
          cinema.facilities,

        imageUrl:
          createCinemaAsset(
            cinema,
          ),

        isActive:
          true,
      }),
    );

  const cinemas =
    await CinemaModel.insertMany(
      cinemaRecords,
    );

  const cinemaBySlug =
    new Map(
      cinemas.map(
        (cinema) => [
          cinema.slug,
          cinema,
        ],
      ),
    );

  const screenRecords = [];

  for (
    const cinemaSeed of
    cinemaSeeds
  ) {
    const cinema =
      cinemaBySlug.get(
        cinemaSeed.slug,
      );

    if (!cinema) {
      throw new Error(
        `Cinema was not inserted: ${cinemaSeed.slug}`,
      );
    }

    for (
      const screenPlan of
      cinemaSeed.screens
    ) {
      const dimensions =
        screenProfiles[
          screenPlan.profile
        ];

      const seatLayout =
        createSeatLayout(
          dimensions.rows,
          dimensions.seatsPerRow,
        );

      const capacity =
        seatLayout.filter(
          (seat) =>
            !seat.isDisabled,
        ).length;

      screenRecords.push({
        cinemaId:
          cinema._id,

        name:
          screenPlan.name,

        rows:
          dimensions.rows,

        seatsPerRow:
          dimensions.seatsPerRow,

        capacity,

        seatLayout,

        isActive:
          true,
      });
    }
  }

  const screens =
    await ScreenModel.insertMany(
      screenRecords,
    );

  console.log(
    `Created ${cinemas.length} cinemas and ${screens.length} halls.`,
  );

  return {
    cinemas,
    screens,
  };
}

async function seedShowtimesAndSeats(
  movies:
    Awaited<
      ReturnType<
        typeof seedMovies
      >
    >,

  cinemas:
    Awaited<
      ReturnType<
        typeof seedCinemasAndScreens
      >
    >["cinemas"],

  screens:
    Awaited<
      ReturnType<
        typeof seedCinemasAndScreens
      >
    >["screens"],
) {
  console.log(
    "Creating showtimes...",
  );

  const cinemaById =
    new Map(
      cinemas.map(
        (cinema) => [
          cinema._id.toString(),
          cinema,
        ],
      ),
    );

  const cinemaSeedBySlug =
    new Map(
      cinemaSeeds.map(
        (cinema) => [
          cinema.slug,
          cinema,
        ],
      ),
    );

  const scheduleStart =
    new Date(
      kathmanduTodayStart()
        .getTime() +
        ONE_DAY_MS,
    );

  const showtimeRecords:
    ShowtimeSeedRecord[] = [];

  for (
    let screenIndex = 0;
    screenIndex <
    screens.length;
    screenIndex += 1
  ) {
    const screen =
      screens[
        screenIndex
      ];

    const cinema =
      cinemaById.get(
        screen.cinemaId.toString(),
      );

    if (!cinema) {
      throw new Error(
        `Cinema not found for hall ${screen.name}`,
      );
    }

    const cinemaSeed =
      cinemaSeedBySlug.get(
        cinema.slug,
      );

    if (!cinemaSeed) {
      throw new Error(
        `Cinema seed not found for ${cinema.slug}`,
      );
    }

    for (
      let dayOffset = 0;
      dayOffset <
      SHOWTIME_DAYS;
      dayOffset += 1
    ) {
      const sampleDate =
        kathmanduDate(
          scheduleStart,
          dayOffset,
          12,
          0,
        );

      const kathmanduWeekday =
        new Intl.DateTimeFormat(
          "en-US",
          {
            timeZone:
              "Asia/Kathmandu",

            weekday:
              "long",
          },
        ).format(
          sampleDate,
        );

      const isSaturday =
        kathmanduWeekday ===
        "Saturday";

      const slots =
        isSaturday
          ? saturdaySlots
          : weekdaySlots;

      for (
        let slotIndex = 0;
        slotIndex <
        slots.length;
        slotIndex += 1
      ) {
        const slot =
          slots[
            slotIndex
          ];

        const startsAt =
          kathmanduDate(
            scheduleStart,
            dayOffset,
            slot.hour,
            slot.minute,
          );

        const eligibleMovies =
  movies.filter(
    (movie) =>
      movie.releaseDate <=
      startsAt,
  );

        if (
          eligibleMovies.length ===
          0
        ) {
          continue;
        }

        const movieIndex =
          (
            screenIndex * 5 +
            dayOffset * 3 +
            slotIndex
          ) %
          eligibleMovies.length;

        const movie =
          eligibleMovies[
            movieIndex
          ];

        const cleanupMinutes =
          20;

        const endsAt =
          new Date(
            startsAt.getTime() +
              (
                movie.duration +
                cleanupMinutes
              ) *
                ONE_MINUTE_MS,
          );

        const eveningSurcharge =
          slot.hour >= 17
            ? 50
            : 0;

        const weekendSurcharge =
          isSaturday
            ? 50
            : 0;

        const hallSurcharge =
          screenExtraPrice(
            screen.name,
          );

        const regularPrice =
          cinemaSeed.basePrice +
          eveningSurcharge +
          weekendSurcharge +
          hallSurcharge;

        showtimeRecords.push({
          movieId:
            movie._id,

          cinemaId:
            cinema._id,

          screenId:
            screen._id,

          startsAt,
          endsAt,

          regularPrice,

          premiumPrice:
            regularPrice +
            150,

          reclinerPrice:
            regularPrice +
            300,

          cleanupMinutes,

          status:
            "scheduled",

          isActive:
            true,
        });
      }
    }
  }

  const showtimes =
    await ShowtimeModel.insertMany(
      showtimeRecords,
    );

  console.log(
    `Created ${showtimes.length} showtimes.`,
  );

  console.log(
    "Creating selectable seats...",
  );

  const screenById =
    new Map(
      screens.map(
        (screen) => [
          screen._id.toString(),
          screen,
        ],
      ),
    );

  const seatRecords:
    ShowtimeSeatRecord[] = [];

  for (
    const showtime of
    showtimes
  ) {
    const screen =
      screenById.get(
        showtime.screenId.toString(),
      );

    if (!screen) {
      throw new Error(
        `Screen not found for showtime ${showtime._id.toString()}`,
      );
    }

    for (
      const seat of
      screen.seatLayout
    ) {
      if (
        seat.isDisabled
      ) {
        continue;
      }

      seatRecords.push({
        showtimeId:
          showtime._id,

        screenId:
          screen._id,

        seatCode:
          seat.seatCode,

        row:
          seat.row,

        number:
          seat.number,

        type:
          seat.type,

        price:
          seatPriceForType(
            showtime,
            seat.type,
          ),

        status:
          "available",
      });
    }
  }

  let insertedSeatCount =
    0;

  for (
    let index = 0;
    index <
    seatRecords.length;
    index +=
      SEAT_INSERT_BATCH_SIZE
  ) {
    const batch =
      seatRecords.slice(
        index,
        index +
          SEAT_INSERT_BATCH_SIZE,
      );

    const inserted =
      await SeatModel.insertMany(
        batch,
      );

    insertedSeatCount +=
      inserted.length;

    console.log(
      `Seats inserted: ${insertedSeatCount}/${seatRecords.length}`,
    );
  }

  return {
    showtimes,
    seatCount:
      insertedSeatCount,
  };
}

async function seedFoods() {
  const records =
    foodSeeds.map(
      (food) => ({
        name:
          food.name,

        slug:
          food.slug,

        description:
          food.description,

        category:
          food.category,

        price:
          food.price,

        imageUrl:
          createFoodAsset(
            food,
          ),

        isVegetarian:
          food.isVegetarian,

        isAvailable:
          food.isAvailable,

        isFeatured:
          food.isFeatured,
      }),
    );

  const foods =
    await FoodModel.insertMany(
      records,
    );

  console.log(
    `Created ${foods.length} food and beverage products.`,
  );

  return foods;
}

async function seedCoupons() {
  const startsAt =
    kathmanduTodayStart();

  const expiresAt =
    new Date(
      startsAt.getTime() +
        90 *
          ONE_DAY_MS,
    );

  const coupons =
    await CouponModel.insertMany([
      {
        code:
          "WELCOME15",

        name:
          "Welcome Discount",

        description:
          "Save 15% on your first CineTix booking.",

        discountType:
          "percentage",

        discountValue:
          15,

        minimumOrderAmount:
          800,

        maximumDiscountAmount:
          300,

        usageLimit:
          5000,

        usageCount:
          0,

        perUserLimit:
          1,

        startsAt,
        expiresAt,

        isActive:
          true,
      },

      {
        code:
          "MOVIENIGHT",

        name:
          "Movie Night Offer",

        description:
          "Get NPR 200 off eligible evening bookings.",

        discountType:
          "fixed",

        discountValue:
          200,

        minimumOrderAmount:
          1200,

        usageLimit:
          3000,

        usageCount:
          0,

        perUserLimit:
          3,

        startsAt,
        expiresAt,

        isActive:
          true,
      },

      {
        code:
          "FAMILY20",

        name:
          "Family Booking Offer",

        description:
          "Save 20% on larger family movie bookings.",

        discountType:
          "percentage",

        discountValue:
          20,

        minimumOrderAmount:
          2000,

        maximumDiscountAmount:
          500,

        usageLimit:
          1500,

        usageCount:
          0,

        perUserLimit:
          2,

        startsAt,
        expiresAt,

        isActive:
          true,
      },
    ]);

  console.log(
    `Created ${coupons.length} coupons.`,
  );

  return coupons;
}

async function seedSettings() {
  const branding =
    createBrandAssets();

  const settings =
    await SettingsModel.create({
      storeName:
        "CineTix Nepal",

      supportEmail:
        "support@cinetix.com",

      currency:
        "NPR",

      logoUrl:
        branding.logoUrl,

      faviconUrl:
        branding.faviconUrl,

      heroImageUrl:
        branding.heroImageUrl,
    });

  console.log(
    "Created CineTix platform settings.",
  );

  return settings;
}

async function main():
  Promise<void> {
  ensureResetIsAllowed();

  console.log(
    "Connecting to MongoDB...",
  );

  await mongoose.connect(
    env.mongodbUri,
  );

  console.log(
    "MongoDB connected.",
  );

  const usersBefore =
    await UserModel.countDocuments(
      {},
    );

  console.log(
    `Users before reset: ${usersBefore}`,
  );

  /*
   * Remove only seed-generated files.
   * User avatars and normal uploads
   * are not touched.
   */
  fs.rmSync(
    seedUploadRoot,
    {
      recursive:
        true,

      force:
        true,
    },
  );

  fs.mkdirSync(
    seedUploadRoot,
    {
      recursive:
        true,
    },
  );

  await clearTicketingData();

  const movies =
    await seedMovies();

  const {
    cinemas,
    screens,
  } =
    await seedCinemasAndScreens();

  const {
    showtimes,
    seatCount,
  } =
    await seedShowtimesAndSeats(
      movies,
      cinemas,
      screens,
    );

  const foods =
    await seedFoods();

  const coupons =
    await seedCoupons();

  await seedSettings();

  const usersAfter =
    await UserModel.countDocuments(
      {},
    );

  if (
    usersBefore !==
    usersAfter
  ) {
    throw new Error(
      `User count changed unexpectedly: ${usersBefore} -> ${usersAfter}`,
    );
  }

  console.log("");
  console.log(
    "========================================",
  );

  console.log(
    "CineTix reset and seed completed",
  );

  console.log(
    "========================================",
  );

  console.log(
    `Users preserved: ${usersAfter}`,
  );

  console.log(
    `Movies: ${movies.length}`,
  );

  console.log(
    `Cinemas: ${cinemas.length}`,
  );

  console.log(
    `Halls/screens: ${screens.length}`,
  );

  console.log(
    `Showtimes: ${showtimes.length}`,
  );

  console.log(
    `Showtime seats: ${seatCount}`,
  );

  console.log(
    `Food products: ${foods.length}`,
  );

  console.log(
    `Coupons: ${coupons.length}`,
  );

  console.log(
    `Schedule length: ${SHOWTIME_DAYS} days`,
  );

  console.log(
    `Local media folder: ${seedUploadRoot}`,
  );

  console.log(
    "Bookings: 0",
  );

  console.log(
    "========================================",
  );
}

main()
  .catch(
    (error: unknown) => {
      console.error(
        "",
      );

      console.error(
        "CineTix seed failed:",
        error,
      );

      process.exitCode =
        1;
    },
  )
  .finally(
    async () => {
      await mongoose.disconnect();

      console.log(
        "MongoDB disconnected.",
      );
    },
  );