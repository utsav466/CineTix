export type MovieStatus = "now-showing" | "coming-soon" | "recent";

export type Movie = {
  id: string;
  title: string;
  originalTitle?: string;
  language: string;
  genre: string;
  duration: string;
  certification: string;
  releaseDate: string;
  poster: string;
  backdrop?: string;
  description: string;
  director?: string;
  cast?: string[];
  status: MovieStatus;
  featured?: boolean;
};

export type Cinema = {
  id: string;
  name: string;
  location: string;
  city: string;
  address: string;
  rating: number;
  image: string;
};

export type Showtime = {
  id: string;
  movieId: string;
  cinemaId: string;
  date: string;
  day: string;
  startTime: string;
  endTime: string;
  price: number;
  auditorium: string;
};

export type SeatStatus = "available" | "reserved" | "selected";

export type Seat = {
  id: string;
  row: string;
  number: number;
  price: number;
  status: SeatStatus;
};

export type FoodAddOn = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: "food" | "drink" | "dessert";
};

export type Offer = {
  id: string;
  title: string;
  description: string;
  code?: string;
  discount?: number;
  validUntil?: string;
  active: boolean;
};

export type Booking = {
  id: string;
  movieId: string;
  cinemaId: string;
  showtimeId: string;
  seats: string[];
  foodAddOns: {
    id: string;
    quantity: number;
  }[];
  totalAmount: number;
  bookingDate: string;
  paymentMethod: string;
  status: "pending" | "confirmed" | "cancelled";
};

export const movies: Movie[] = [
  {
    id: "attack-on-titan-the-last-attack",
    title: "Attack on Titan: The Last Attack",
    originalTitle: "Attack on Titan The Movie: The Last Attack",
    language: "Japanese",
    genre: "Animation, Action, Dark Fantasy",
    duration: "2h 25m",
    certification: "PG",
    releaseDate: "2026-07-24",
    poster: "/movies/attack_on_titan.jpg",
    backdrop: "/movies/attack_on_titan.jpg",
    description:
      "The final conflict reaches its climax as the remaining heroes attempt to stop the Rumbling and confront Eren in a battle that will decide humanity's future.",
    director: "Yuichiro Hayashi",
    cast: [
      "Yuki Kaji",
      "Yui Ishikawa",
      "Marina Inoue",
      "Hiroshi Kamiya",
    ],
    status: "now-showing",
  },
  {
    id: "dhamaal-4",
    title: "Dhamaal 4",
    language: "Hindi",
    genre: "Comedy, Drama",
    duration: "2h 23m",
    certification: "PG",
    releaseDate: "2026-07-10",
    poster: "/movies/dhaamal4.png",
    backdrop: "/movies/dhaamal4.png",
    description:
      "The Dhamaal gang returns for another chaotic adventure filled with misunderstandings, unexpected obstacles and a hilarious search for treasure.",
    director: "Indra Kumar",
    cast: [
      "Ajay Devgn",
      "Arshad Warsi",
      "Riteish Deshmukh",
      "Jaaved Jaaferi",
    ],
    status: "now-showing",
    featured: true,
  },
  {
    id: "evil-dead-burn",
    title: "Evil Dead Burn",
    language: "English",
    genre: "Horror, Dark Fantasy, Supernatural",
    duration: "1h 50m",
    certification: "PG",
    releaseDate: "2026-07-10",
    poster: "/movies/evil_dead_burn__500x715.jpg",
    backdrop: "/movies/evil_dead_burn__500x715.jpg",
    description:
      "A grieving woman seeks comfort with her family, only to face a terrifying supernatural force that begins taking control of those around her.",
    cast: [
      "Luciane Buchanan",
      "Hunter Doohan",
      "Souheila Yacoub",
      "Tandi Wright",
    ],
    status: "now-showing",
  },
  {
    id: "moana",
    title: "Moana",
    language: "English",
    genre: "Adventure, Musical, Family",
    duration: "1h 51m",
    certification: "PG",
    releaseDate: "2026-07-10",
    poster: "/movies/moana__500x715.jpg",
    backdrop: "/movies/moana__500x715.jpg",
    description:
      "Moana sets out across the ocean on a new journey, facing dangerous waters and unexpected challenges while protecting her people.",
    cast: ["Catherine Laga'aia", "Dwayne Johnson"],
    status: "now-showing",
  },
  {
    id: "minions-and-monsters",
    title: "Minions & Monsters",
    originalTitle: "3D: Minions & Monsters",
    language: "English",
    genre: "Animation, Adventure, Family, Sci-Fi",
    duration: "1h 30m",
    certification: "PG",
    releaseDate: "2026-07-01",
    poster: "/movies/minions_poster.jpg",
    backdrop: "/movies/minions_poster.jpg",
    description:
      "The Minions accidentally unleash a collection of monsters and must work together to stop the chaos they created.",
    status: "recent",
  },
  {
    id: "spider-man-brand-new-day",
    title: "Spider-Man: Brand New Day",
    language: "English",
    genre: "Superhero, Action, Adventure, Sci-Fi",
    duration: "2h 24m",
    certification: "PG",
    releaseDate: "2026-07-30",
    poster: "/movies/spider_man_brand_new_day__500x715_pixels.jpg",
    backdrop: "/movies/spider_man_brand_new_day__500x715_pixels.jpg",
    description:
      "Peter Parker attempts to focus on college and leave Spider-Man behind, but a new threat forces him to return and protect the people closest to him.",
    director: "Destin Daniel Cretton",
    cast: [
      "Tom Holland",
      "Zendaya",
      "Jon Bernthal",
      "Mark Ruffalo",
      "Sadie Sink",
    ],
    status: "coming-soon",
  },
];

export const cinemas: Cinema[] = [
  {
    id: "qfx-civil-mall",
    name: "QFX Civil Mall",
    location: "Sundhara",
    city: "Kathmandu",
    address: "Civil Mall, Sundhara, Kathmandu",
    rating: 4.5,
    image: "/movies/attack_on_titan.jpg",
  },
  {
    id: "big-movies-city-center",
    name: "Big Movies City Center",
    location: "Kamalpokhari",
    city: "Kathmandu",
    address: "City Center, Kamalpokhari, Kathmandu",
    rating: 4.4,
    image: "/movies/dhaamal4.png",
  },
  {
    id: "fcube-cinemas",
    name: "FCube Cinemas",
    location: "Chabahil",
    city: "Kathmandu",
    address: "KL Tower, Chabahil, Kathmandu",
    rating: 4.3,
    image: "/movies/evil_dead_burn__500x715.jpg",
  },
  {
    id: "qfx-chhaya-center",
    name: "QFX Chhaya Center",
    location: "Thamel",
    city: "Kathmandu",
    address: "Chhaya Center, Thamel, Kathmandu",
    rating: 4.6,
    image: "/movies/moana__500x715.jpg",
  },
];

export const showtimes: Showtime[] = [
  {
    id: "aot-qfx-civil-0930",
    movieId: "attack-on-titan-the-last-attack",
    cinemaId: "qfx-civil-mall",
    date: "2026-07-26",
    day: "Sunday",
    startTime: "09:30 AM",
    endTime: "11:55 AM",
    price: 400,
    auditorium: "Audi 1",
  },
  {
    id: "aot-big-movies-1430",
    movieId: "attack-on-titan-the-last-attack",
    cinemaId: "big-movies-city-center",
    date: "2026-07-26",
    day: "Sunday",
    startTime: "02:30 PM",
    endTime: "04:55 PM",
    price: 450,
    auditorium: "Audi 2",
  },
  {
    id: "dhamaal-qfx-civil-1200",
    movieId: "dhamaal-4",
    cinemaId: "qfx-civil-mall",
    date: "2026-07-26",
    day: "Sunday",
    startTime: "12:00 PM",
    endTime: "02:23 PM",
    price: 400,
    auditorium: "Audi 3",
  },
  {
    id: "dhamaal-big-movies-1730",
    movieId: "dhamaal-4",
    cinemaId: "big-movies-city-center",
    date: "2026-07-26",
    day: "Sunday",
    startTime: "05:30 PM",
    endTime: "07:53 PM",
    price: 450,
    auditorium: "Audi 1",
  },
  {
    id: "evil-dead-fcube-1930",
    movieId: "evil-dead-burn",
    cinemaId: "fcube-cinemas",
    date: "2026-07-26",
    day: "Sunday",
    startTime: "07:30 PM",
    endTime: "09:20 PM",
    price: 420,
    auditorium: "Audi 2",
  },
  {
    id: "evil-dead-qfx-chhaya-2130",
    movieId: "evil-dead-burn",
    cinemaId: "qfx-chhaya-center",
    date: "2026-07-26",
    day: "Sunday",
    startTime: "09:30 PM",
    endTime: "11:20 PM",
    price: 500,
    auditorium: "Audi 4",
  },
  {
    id: "moana-qfx-civil-1000",
    movieId: "moana",
    cinemaId: "qfx-civil-mall",
    date: "2026-07-26",
    day: "Sunday",
    startTime: "10:00 AM",
    endTime: "11:51 AM",
    price: 350,
    auditorium: "Audi 2",
  },
  {
    id: "moana-qfx-chhaya-1500",
    movieId: "moana",
    cinemaId: "qfx-chhaya-center",
    date: "2026-07-26",
    day: "Sunday",
    startTime: "03:00 PM",
    endTime: "04:51 PM",
    price: 450,
    auditorium: "Audi 3",
  },
  {
    id: "aot-qfx-civil-0930-20260727",
    movieId: "attack-on-titan-the-last-attack",
    cinemaId: "qfx-civil-mall",
    date: "2026-07-27",
    day: "Monday",
    startTime: "09:30 AM",
    endTime: "11:55 AM",
    price: 400,
    auditorium: "Audi 1",
  },
  {
    id: "aot-big-movies-1430-20260727",
    movieId: "attack-on-titan-the-last-attack",
    cinemaId: "big-movies-city-center",
    date: "2026-07-27",
    day: "Monday",
    startTime: "02:30 PM",
    endTime: "04:55 PM",
    price: 450,
    auditorium: "Audi 2",
  },
  {
    id: "dhamaal-qfx-civil-1200-20260727",
    movieId: "dhamaal-4",
    cinemaId: "qfx-civil-mall",
    date: "2026-07-27",
    day: "Monday",
    startTime: "12:00 PM",
    endTime: "02:23 PM",
    price: 400,
    auditorium: "Audi 3",
  },
  {
    id: "evil-dead-fcube-1930-20260727",
    movieId: "evil-dead-burn",
    cinemaId: "fcube-cinemas",
    date: "2026-07-27",
    day: "Monday",
    startTime: "07:30 PM",
    endTime: "09:20 PM",
    price: 420,
    auditorium: "Audi 2",
  },
  {
    id: "moana-qfx-civil-1000-20260727",
    movieId: "moana",
    cinemaId: "qfx-civil-mall",
    date: "2026-07-27",
    day: "Monday",
    startTime: "10:00 AM",
    endTime: "11:51 AM",
    price: 350,
    auditorium: "Audi 2",
  },
];

export const foodAddOns: FoodAddOn[] = [
  {
    id: "cheese-burger",
    name: "Mr. Cheezy",
    price: 5.49,
    image: "/food/burger.png",
    category: "food",
  },
  {
    id: "fries-medium",
    name: "Fries M",
    price: 3.29,
    image: "/food/fries.png",
    category: "food",
  },
  {
    id: "vanilla-ice-cream",
    name: "Vanilla Ice",
    price: 6.99,
    image: "/food/ice-cream.png",
    category: "dessert",
  },
  {
    id: "americano-large",
    name: "Americano L",
    price: 1.99,
    image: "/food/coffee.png",
    category: "drink",
  },
  {
    id: "salted-popcorn",
    name: "Salted Popcorn",
    price: 4.49,
    image: "/food/popcorn.png",
    category: "food",
  },
  {
    id: "soft-drink",
    name: "Soft Drink",
    price: 2.99,
    image: "/food/soft-drink.png",
    category: "drink",
  },
];

export const addons = foodAddOns;

export const offers: Offer[] = [
  {
    id: "student-discount",
    title: "Student Discount",
    description:
      "Students receive a discount on selected weekday movie tickets.",
    code: "STUDENT10",
    discount: 10,
    validUntil: "2026-12-31",
    active: false,
  },
  {
    id: "weekend-combo",
    title: "Weekend Combo",
    description:
      "Get a movie ticket, popcorn and soft drink together at a special price.",
    code: "WEEKEND",
    discount: 15,
    validUntil: "2026-12-31",
    active: false,
  },
];

export const bookings: Booking[] = [];

export const nowShowingMovies = movies.filter(
  (movie) => movie.status === "now-showing",
);

export const comingSoonMovies = movies.filter(
  (movie) => movie.status === "coming-soon",
);

export const recentMovies = movies.filter(
  (movie) => movie.status === "recent",
);

export const featuredMovie =
  movies.find(
    (movie) =>
      movie.featured === true && movie.status === "now-showing",
  ) ?? nowShowingMovies[0];

export function getMovieById(movieId: string): Movie | undefined {
  return movies.find((movie) => movie.id === movieId);
}

export function getCinemaById(cinemaId: string): Cinema | undefined {
  return cinemas.find((cinema) => cinema.id === cinemaId);
}

export function getShowtimeById(
  showtimeId: string,
): Showtime | undefined {
  return showtimes.find((showtime) => showtime.id === showtimeId);
}

export function getShowtimesByMovieId(
  movieId: string,
): Showtime[] {
  return showtimes.filter(
    (showtime) => showtime.movieId === movieId,
  );
}

export function getShowtimesByCinemaId(
  cinemaId: string,
): Showtime[] {
  return showtimes.filter(
    (showtime) => showtime.cinemaId === cinemaId,
  );
}

export function getMovieCinemas(movieId: string): Cinema[] {
  const cinemaIds = new Set(
    showtimes
      .filter((showtime) => showtime.movieId === movieId)
      .map((showtime) => showtime.cinemaId),
  );

  return cinemas.filter((cinema) => cinemaIds.has(cinema.id));
}

export function getMovieShowtimesAtCinema(
  movieId: string,
  cinemaId: string,
  date?: string,
): Showtime[] {
  return showtimes.filter(
    (showtime) =>
      showtime.movieId === movieId &&
      showtime.cinemaId === cinemaId &&
      (!date || showtime.date === date),
  );
}

export function getAvailableDatesForMovie(
  movieId: string,
): string[] {
  return Array.from(
    new Set(
      showtimes
        .filter((showtime) => showtime.movieId === movieId)
        .map((showtime) => showtime.date),
    ),
  ).sort();
}

export function getAvailableCinemasForMovie(
  movieId: string,
  date?: string,
): Cinema[] {
  const cinemaIds = new Set(
    showtimes
      .filter(
        (showtime) =>
          showtime.movieId === movieId &&
          (!date || showtime.date === date),
      )
      .map((showtime) => showtime.cinemaId),
  );

  return cinemas.filter((cinema) => cinemaIds.has(cinema.id));
}

export function getFoodAddOnById(
  addOnId: string,
): FoodAddOn | undefined {
  return foodAddOns.find((addOn) => addOn.id === addOnId);
}

export function getActiveOffers(): Offer[] {
  return offers.filter((offer) => offer.active);
}

export function createSeats(
  rows: string[] = ["A", "B", "C", "D", "E", "F"],
  seatsPerRow = 16,
  price = 400,
): Seat[] {
  return rows.flatMap((row) =>
    Array.from({ length: seatsPerRow }, (_, index) => {
      const seatNumber = index + 1;
      const id = `${row}${seatNumber}`;

      const reservedSeats = new Set([
        "A3",
        "A8",
        "A14",
        "B2",
        "B7",
        "B12",
        "C5",
        "C10",
        "D4",
        "D9",
        "E6",
        "E13",
        "F7",
        "F15",
      ]);

      return {
        id,
        row,
        number: seatNumber,
        price,
        status: reservedSeats.has(id)
          ? "reserved"
          : "available",
      };
    }),
  );
}

export const seats = createSeats();

export function calculateSeatTotal(
  selectedSeatIds: string[],
  availableSeats: Seat[] = seats,
): number {
  return selectedSeatIds.reduce((total, seatId) => {
    const seat = availableSeats.find((item) => item.id === seatId);

    return total + (seat?.price ?? 0);
  }, 0);
}

export function calculateFoodTotal(
  selectedFood: {
    id: string;
    quantity: number;
  }[],
): number {
  return selectedFood.reduce((total, selectedItem) => {
    const addOn = getFoodAddOnById(selectedItem.id);

    if (!addOn) {
      return total;
    }

    return total + addOn.price * selectedItem.quantity;
  }, 0);
}

export function calculateBookingTotal(
  selectedSeatIds: string[],
  selectedFood: {
    id: string;
    quantity: number;
  }[],
): number {
  return (
    calculateSeatTotal(selectedSeatIds) +
    calculateFoodTotal(selectedFood)
  );
}

export function formatNpr(amount: number): string {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(amount);
}