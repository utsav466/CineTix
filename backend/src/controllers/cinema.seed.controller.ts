import { Request, Response } from "express";
import { CinemaModel } from "../models/cinema.model";

export async function seedCinemas(
  req: Request,
  res: Response
) {
  try {
    await CinemaModel.deleteMany({});

    const cinemas = [
      {
        name: "QFX Civil Mall",
        city: "Kathmandu",
        address: "Civil Mall, Sundhara",
        halls: 6,
        facilities: [
          "Dolby Atmos",
          "3D",
          "Food Court",
          "Wheelchair Access",
          "Online Booking"
        ],
        imageUrl: ""
      },

      {
        name: "QFX Chhaya Center",
        city: "Kathmandu",
        address: "Chhaya Center, Thamel",
        halls: 5,
        facilities: [
          "Dolby Atmos",
          "3D",
          "Luxury Seats",
          "Food Court",
          "Parking"
        ],
        imageUrl: ""
      },

      {
        name: "QFX Labim Mall",
        city: "Lalitpur",
        address: "Labim Mall, Pulchowk",
        halls: 4,
        facilities: [
          "Dolby Atmos",
          "Premium Seats",
          "Parking",
          "Food Court"
        ],
        imageUrl: ""
      },

      {
        name: "INI Cinemas",
        city: "Kathmandu",
        address: "New Baneshwor",
        halls: 4,
        facilities: [
          "Laser Projection",
          "Dolby Audio",
          "Food Court"
        ],
        imageUrl: ""
      },

      {
        name: "Big Movies",
        city: "Kathmandu",
        address: "Kamalpokhari",
        halls: 3,
        facilities: [
          "Dolby Audio",
          "3D",
          "Parking"
        ],
        imageUrl: ""
      },

      {
        name: "Fcube Cinemas",
        city: "Kathmandu",
        address: "KL Tower, Chabahil",
        halls: 4,
        facilities: [
          "Dolby Atmos",
          "Luxury Recliners",
          "Food Court"
        ],
        imageUrl: ""
      },

      {
        name: "One Cinemas Eyeplex",
        city: "Kathmandu",
        address: "Eyeplex Mall, New Baneshwor",
        halls: 3,
        facilities: [
          "Premium Seats",
          "Dolby Audio",
          "Parking"
        ],
        imageUrl: ""
      }
    ];

    const inserted = await CinemaModel.insertMany(cinemas);

    return res.status(201).json({
      success: true,
      message: `${inserted.length} cinemas seeded successfully.`,
      count: inserted.length,
      cinemas: inserted
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
}