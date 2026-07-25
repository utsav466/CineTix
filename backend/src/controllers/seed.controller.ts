import { Response } from "express";
import mongoose from "mongoose";
import { BookingModel, BookingStatus } from "../models/booking.model";
import { AuthRequest } from "../middlewares/auth.middlewares";


const STATUSES: BookingStatus[] = [
  "Pending",
  "Confirmed",
  "Cancelled",
];


const movieNames = [
  "Spider-Man: Brand New Day",
  "Avatar 3",
  "Avengers: Secret Wars",
  "The Batman",
  "Interstellar",
  "Inception",
  "Joker",
  "Dune",
];


const seatRows = [
  "A",
  "B",
  "C",
  "D",
  "E",
];


function pick<T>(arr:T[]) {
  return arr[Math.floor(Math.random()*arr.length)];
}


function rand(min:number,max:number){
  return Math.floor(
    Math.random()*(max-min+1)
  )+min;
}


function randomDateWithin(daysBack:number){

  const d=new Date();

  d.setDate(
    d.getDate()-rand(0,daysBack)
  );

  d.setHours(
    rand(10,22),
    rand(0,59),
    0,
    0
  );

  return d;

}



// POST /api/admin/seed/bookings?count=15
export async function seedBookings(
  req:AuthRequest,
  res:Response
){

try{


const count=Math.min(
50,
Math.max(
1,
Number(req.query.count ?? 10)
)
);



const userId=req.userId;


if(
!userId ||
!mongoose.isValidObjectId(userId)
){

return res.status(401).json({

success:false,

message:"Authentication required"

});

}




const docs=Array.from({
length:count

}).map(()=>{


const seats=Array.from({
length:rand(1,5)

}).map(()=>{

return `${pick(seatRows)}${rand(1,10)}`;

});



const foods=Math.random()<0.5
?
[
{
name:"Popcorn",
quantity:1,
price:250
},
{
name:"Coke",
quantity:1,
price:150
}
]
:
[];




const totalAmount =
seats.length * 400 +
foods.reduce(
(sum,item)=>sum+(item.price*item.quantity),
0
);



const status:BookingStatus =
Math.random()<0.7
?
"Confirmed"
:
pick(STATUSES);



const createdAt =
randomDateWithin(30);



return {


userId:new mongoose.Types.ObjectId(userId),


// temporary random ObjectIds
// replace after movies/showtimes are seeded

movieId:new mongoose.Types.ObjectId(),

showtimeId:new mongoose.Types.ObjectId(),



seats,


foods,


totalAmount,


paymentMethod:"ESEWA",


paymentStatus:
status==="Confirmed"
?
"Paid"
:
"Pending",


paymentRef:
status==="Confirmed"
?
"TXN-"+rand(10000,99999)
:
"",


qrCode:"",


status,


createdAt,


updatedAt:createdAt


};


});




const inserted =
await BookingModel.insertMany(docs);



return res.status(201).json({

success:true,

message:
`Seeded ${inserted.length} bookings`,

count:
inserted.length,

data:inserted


});



}catch(err:any){


return res.status(500).json({

success:false,

message:
err.message ||
"Internal Server Error"

});


}


}