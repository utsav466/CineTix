import { Request, Response } from "express";
import crypto from "crypto";
import mongoose from "mongoose";
import { AuthRequest } from "../middlewares/auth.middlewares";
import { BookingModel } from "../models/booking.model";


const FRONTEND_BASE =
  process.env.FRONTEND_URL || "http://localhost:3000";

const BACKEND_BASE =
  process.env.BACKEND_URL || "http://localhost:5050";


const ESEWA_URL =
  "https://rc-epay.esewa.com.np/api/epay/main/v2/form";


const PRODUCT_CODE =
  process.env.ESEWA_PRODUCT_CODE || "EPAYTEST";


const SECRET_KEY =
  process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q";



function sign(
  secret:string,
  message:string
){

return crypto
.createHmac("sha256",secret)
.update(message)
.digest("base64");

}



function num(v:any){

const n=Number(v);

return Number.isFinite(n) ? n : 0;

}



/*
=====================================================
INIT PAYMENT
POST /api/payments/esewa/init
=====================================================
*/

export async function esewaInitDemo(
req:AuthRequest,
res:Response
){

try{


const userId=req.userId;


if(!userId){

return res.status(401).json({

success:false,

message:"Login required"

});

}



const { bookingId } = req.body;



if(!mongoose.isValidObjectId(bookingId)){

return res.status(400).json({

success:false,

message:"Invalid bookingId"

});

}




const booking =
await BookingModel.findOne({

_id:bookingId,

userId

});




if(!booking){

return res.status(404).json({

success:false,

message:"Booking not found"

});

}




if(booking.paymentMethod !== "ESEWA"){

return res.status(400).json({

success:false,

message:"Booking is not using ESEWA"

});

}




booking.paymentStatus="Pending";

await booking.save();




const total =
num(booking.totalAmount);



const transaction_uuid =
String(booking._id);




const success_url =
`${BACKEND_BASE}/api/payments/esewa/success?oid=${transaction_uuid}`;



const failure_url =
`${BACKEND_BASE}/api/payments/esewa/failure?oid=${transaction_uuid}`;



const signed_field_names =
"total_amount,transaction_uuid,product_code";



const message =
`total_amount=${total},transaction_uuid=${transaction_uuid},product_code=${PRODUCT_CODE}`;



const signature =
sign(
SECRET_KEY,
message
);



const payload={

amount:total,

tax_amount:0,

total_amount:total,

transaction_uuid,

product_code:PRODUCT_CODE,

product_service_charge:0,

product_delivery_charge:0,

success_url,

failure_url,

signed_field_names,

signature

};



return res.json({

success:true,

paymentUrl:ESEWA_URL,

payload

});



}catch(err:any){


return res.status(500).json({

success:false,

message:
err.message || "Server error"

});


}


}




/*
=====================================================
SUCCESS CALLBACK
GET /api/payments/esewa/success
=====================================================
*/


export async function esewaSuccessDemo(
req:Request,
res:Response
){

try{


console.log(
"ESEWA SUCCESS QUERY:",
req.query
);



let oidRaw =
String(req.query.oid || "").trim();



if(oidRaw.includes("?")){

oidRaw =
oidRaw.split("?")[0];

}



const bookingId=oidRaw;



if(!mongoose.isValidObjectId(bookingId)){

return res.redirect(
`${FRONTEND_BASE}/payment/failed?reason=invalid_booking`
);

}




const booking =
await BookingModel.findById(bookingId);



if(!booking){

return res.redirect(
`${FRONTEND_BASE}/payment/failed?reason=not_found`
);

}



let dataParam =
typeof req.query.data === "string"
?
req.query.data
:
"";



let decoded:any=null;



if(dataParam){

try{

const decodedStr =
Buffer.from(
dataParam,
"base64"
)
.toString("utf-8");


decoded =
JSON.parse(decodedStr);


}catch{

decoded=null;

}

}




const paidAmount =

Number(decoded?.total_amount)

||

Number(decoded?.amount)

||

Number(booking.totalAmount);




const bookingAmount =
Number(booking.totalAmount);



if(
Math.round(bookingAmount)
!==
Math.round(paidAmount)
){


booking.paymentStatus="Failed";

await booking.save();



return res.redirect(
`${FRONTEND_BASE}/payment/failed?reason=amount_mismatch`
);


}




booking.paymentStatus="Paid";


booking.paymentRef =
String(
decoded?.transaction_code ||
"ESEWA_DEMO"
);



if(booking.status==="Pending"){

booking.status="Confirmed";

}



await booking.save();



return res.redirect(
`${FRONTEND_BASE}/payment/success?bookingId=${booking._id}`
);



}catch(err){

console.log(
"ESEWA SUCCESS ERROR:",
err
);



return res.redirect(
`${FRONTEND_BASE}/payment/failed?reason=server_error`
);


}


}




/*
=====================================================
FAILURE CALLBACK
GET /api/payments/esewa/failure
=====================================================
*/


export async function esewaFailureDemo(
req:Request,
res:Response
){

try{


const oidRaw =
String(req.query.oid || "");



const bookingId =
oidRaw.includes("?")
?
oidRaw.split("?")[0]
:
oidRaw;




if(mongoose.isValidObjectId(bookingId)){


const booking =
await BookingModel.findById(bookingId);



if(booking){

booking.paymentStatus="Failed";

await booking.save();

}


}




return res.redirect(
`${FRONTEND_BASE}/payment/failed?reason=cancelled`
);



}catch(err){


console.log(
"ESEWA FAILURE ERROR:",
err
);



return res.redirect(
`${FRONTEND_BASE}/payment/failed?reason=server_error`
);


}


}