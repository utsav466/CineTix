import { Request, Response } from "express";
import { BookingModel } from "../models/booking.model";


// NPR conversion (keep if your frontend expects NPR)
const USD_TO_NPR = 133;


// yyyy-mm-dd helper
function toDayString(d: Date) {

  const yyyy = d.getFullYear();

  const mm = String(d.getMonth() + 1).padStart(2, "0");

  const dd = String(d.getDate()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;

}



function rangeToDays(range: string) {

  const r = (range || "").toLowerCase();

  if (r === "7d") return 7;

  if (r === "90d") return 90;

  return 30;

}



// GET /api/admin/reports/sales
export async function adminSalesReport(
  req: Request,
  res: Response
) {

  try {


    const days =
      rangeToDays(String(req.query.range ?? "30d"));



    const end = new Date();

    const start = new Date();



    start.setDate(end.getDate() - (days - 1));

    start.setHours(0,0,0,0);



    const matchBase:any = {

      status:{
        $ne:"Cancelled"
      },

      createdAt:{
        $gte:start,
        $lte:end
      }

    };



    const [
      summaryAgg,
      dailyAgg,
      topMoviesAgg

    ] = await Promise.all([



      // SUMMARY
      BookingModel.aggregate([

        {
          $match:matchBase
        },


        {
          $group:{

            _id:null,

            revenue:{
              $sum:"$totalAmount"
            },


            bookings:{
              $sum:1
            },


            confirmed:{
              $sum:{
                $cond:[
                  {
                    $eq:[
                      "$status",
                      "Confirmed"
                    ]
                  },
                  1,
                  0
                ]
              }
            }

          }

        }

      ]),





      // DAILY BOOKINGS
      BookingModel.aggregate([


        {
          $match:matchBase
        },


        {

          $group:{

            _id:{

              y:{
                $year:"$createdAt"
              },

              m:{
                $month:"$createdAt"
              },

              d:{
                $dayOfMonth:"$createdAt"
              }

            },


            revenue:{
              $sum:"$totalAmount"
            },


            bookings:{
              $sum:1
            }


          }

        },


        {

          $project:{

            _id:0,


            date:{

              $dateToString:{

                date:{

                  $dateFromParts:{

                    year:"$_id.y",

                    month:"$_id.m",

                    day:"$_id.d"

                  }

                },

                format:"%Y-%m-%d"

              }

            },


            revenue:1,

            bookings:1


          }

        },


        {
          $sort:{
            date:1
          }
        }


      ]),





      // TOP MOVIES
      BookingModel.aggregate([


        {
          $match:matchBase
        },


        {

          $lookup:{

            from:"movies",

            localField:"movieId",

            foreignField:"_id",

            as:"movie"

          }

        },


        {
          $unwind:"$movie"
        },


        {

          $group:{

            _id:"$movie.title",

            bookings:{
              $sum:1
            },


            revenue:{
              $sum:"$totalAmount"
            }

          }

        },


        {
          $sort:{
            bookings:-1
          }
        },


        {
          $limit:5
        },


        {

          $project:{

            _id:0,

            title:"$_id",

            bookings:1,

            revenue:1

          }

        }


      ])

    ]);





    const summary = summaryAgg?.[0] ?? {

      revenue:0,

      bookings:0,

      confirmed:0

    };





    const dailyMap =
      new Map<string, any>();


    for(const d of dailyAgg){

      dailyMap.set(
        d.date,
        {

          date:d.date,

          revenue:
            d.revenue * USD_TO_NPR,

          bookings:d.bookings

        }
      );

    }




    const daily:any[]=[];



    for(let i=0;i<days;i++){


      const dt=new Date(start);


      dt.setDate(
        start.getDate()+i
      );


      const key =
        toDayString(dt);



      daily.push(

        dailyMap.get(key) ||

        {

          date:key,

          revenue:0,

          bookings:0

        }

      );

    }





    const topMovies =
      (topMoviesAgg || []).map((m:any)=>({

        ...m,

        revenue:
          m.revenue * USD_TO_NPR

      }));





    return res.status(200).json({

      success:true,

      currency:"Rs",

      data:{


        range:`${days}d`,


        revenue:
          summary.revenue * USD_TO_NPR,


        bookings:
          summary.bookings ?? 0,


        confirmed:
          summary.confirmed ?? 0,


        cancelled:0,


        daily,


        topMovies


      }

    });



  }catch(err:any){


    return res.status(500).json({

      success:false,

      message:
        err.message ||
        "Failed to load sales report"

    });


  }

}