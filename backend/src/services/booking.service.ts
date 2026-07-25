import { BookingModel } from "../models/booking.model";


export class BookingService {



async createBooking(
userId:string,
data:any
){

if(!data.movieId)
throw new Error("Movie is required");


if(!data.showtimeId)
throw new Error("Showtime is required");


if(!data.seats || data.seats.length===0)
throw new Error("Seats are required");



return BookingModel.create({

userId,

movieId:data.movieId,

showtimeId:data.showtimeId,

seats:data.seats,

foods:data.foods || [],

totalAmount:data.totalAmount,

paymentMethod:
data.paymentMethod || "ESEWA",

paymentStatus:"Pending",

status:"Pending"

});


}





async myBookings(
userId:string
){

return BookingModel.find({
userId
})
.populate("movieId")
.populate("showtimeId")
.sort({
createdAt:-1
});


}





async getBooking(
id:string
){

return BookingModel.findById(id)
.populate("movieId")
.populate("showtimeId")
.populate("userId");

}




async cancelBooking(
id:string
){

return BookingModel.findByIdAndUpdate(

id,

{
status:"Cancelled"
},

{
new:true
}

);

}



}