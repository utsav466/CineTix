import { Request, Response } from "express";
import mongoose from "mongoose";
import { BookingModel, BookingStatus } from "../models/booking.model";
import { BookingService } from "../services/booking.service";

const bookingService = new BookingService();


// =========================
// USER - CREATE BOOKING
// =========================
export async function createBooking(
  req: Request,
  res: Response
) {
  try {

    const userId = (req as any).user.id;

    const booking = await bookingService.createBooking(
      userId,
      req.body
    );

    return res.status(201).json({
      success: true,
      booking,
    });

  } catch (error: any) {

    return res.status(400).json({
      success: false,
      message: error.message,
    });

  }
}


// =========================
// USER - MY BOOKINGS
// =========================
export async function myBookings(
  req: Request,
  res: Response
) {

  try {

    const userId = (req as any).user.id;

    const bookings =
      await bookingService.myBookings(userId);


    return res.json({
      success: true,
      bookings,
    });


  } catch (error:any) {

    return res.status(500).json({
      success:false,
      message:error.message,
    });

  }

}


// =========================
// USER - BOOKING DETAIL
// =========================
export async function bookingDetail(
  req: Request,
  res: Response
) {

  try {

    const { id } = req.params;


    if(!mongoose.isValidObjectId(id)){
      return res.status(400).json({
        success:false,
        message:"Invalid booking id"
      });
    }


    const booking =
      await bookingService.getBooking(id);


    if(!booking){

      return res.status(404).json({
        success:false,
        message:"Booking not found"
      });

    }


    return res.json({
      success:true,
      booking
    });


  } catch(error:any){

    return res.status(500).json({
      success:false,
      message:error.message
    });

  }

}



// =========================
// USER - CANCEL BOOKING
// =========================
export async function cancelBooking(
  req: Request,
  res: Response
){

  try{

    const { id } = req.params;


    const booking =
      await bookingService.cancelBooking(id);



    if(!booking){

      return res.status(404).json({
        success:false,
        message:"Booking not found"
      });

    }



    return res.json({
      success:true,
      booking
    });



  }catch(error:any){

    return res.status(500).json({
      success:false,
      message:error.message
    });

  }

}



// =========================
// ADMIN - LIST BOOKINGS
// =========================
export async function adminListBookings(
  req: Request,
  res: Response
) {

  try {

    const page =
      Math.max(1, Number(req.query.page || 1));

    const limit =
      Math.max(1, Number(req.query.limit || 10));


    const skip =
      (page - 1) * limit;


    const [bookings,total] =
      await Promise.all([

        BookingModel.find()
        .populate("movieId")
        .populate("showtimeId")
        .populate("userId")
        .sort({
          createdAt:-1
        })
        .skip(skip)
        .limit(limit),


        BookingModel.countDocuments()

      ]);



    return res.json({

      success:true,
      bookings,
      page,
      total,
      totalPages:
      Math.ceil(total / limit)

    });


  }catch(error:any){

    return res.status(500).json({
      success:false,
      message:error.message
    });

  }

}



// =========================
// ADMIN - GET BOOKING
// =========================
export async function adminGetBooking(
  req:Request,
  res:Response
){

try{

const {id}=req.params;


if(!mongoose.isValidObjectId(id)){

return res.status(400).json({
success:false,
message:"Invalid booking id"
});

}


const booking =
await BookingModel.findById(id)
.populate("movieId")
.populate("showtimeId")
.populate("userId");



if(!booking){

return res.status(404).json({
success:false,
message:"Booking not found"
});

}


return res.json({
success:true,
booking
});


}catch(error:any){

return res.status(500).json({
success:false,
message:error.message
});

}

}



// =========================
// ADMIN - UPDATE STATUS
// =========================
export async function adminUpdateBookingStatus(
req:Request,
res:Response
){

try{

const {id}=req.params;

const status =
req.body.status as BookingStatus;


const allowed:BookingStatus[]=[
"Pending",
"Confirmed",
"Cancelled"
];


if(!allowed.includes(status)){

return res.status(400).json({
success:false,
message:"Invalid booking status"
});

}



const booking =
await BookingModel.findByIdAndUpdate(
id,
{
status
},
{
new:true
}
);



return res.json({
success:true,
booking
});


}catch(error:any){

return res.status(500).json({
success:false,
message:error.message
});

}


}