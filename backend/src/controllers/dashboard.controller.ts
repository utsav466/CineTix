import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { MovieModel } from "../models/movie.model";
import { BookingModel } from "../models/booking.model";


export async function adminDashboardStats(
  _: Request,
  res: Response
): Promise<Response> {

  try {

    const [
      totalUsers,
      totalMovies,
      totalBookings,
      revenueAgg,
      recentBookings,

    ] = await Promise.all([


      UserModel.countDocuments(),


      MovieModel.countDocuments(),


      BookingModel.countDocuments(),



      BookingModel.aggregate([

        {
          $match:{
            paymentStatus:"Paid"
          }
        },

        {
          $group:{
            _id:null,

            revenue:{
              $sum:"$totalAmount"
            }

          }
        }

      ]),




      BookingModel.find()

      .populate("movieId")

      .populate("userId")

      .sort({
        createdAt:-1
      })

      .limit(5)



    ]);




    return res.status(200).json({

      success:true,

      data:{


        totalUsers,


        totalMovies,


        totalBookings,


        totalRevenue:
          revenueAgg[0]?.revenue ?? 0,



        recentBookings



      }

    });



  } catch(error:any){


    return res.status(500).json({

      success:false,

      message:
        error.message ||
        "Failed to load dashboard"


    });


  }

}