import {
  PaymentMethod
} from "../models/booking.model";



export type CreateBookingDTO = {


  movieId:string;


  showtimeId:string;


  seats:string[];


  foods?:{

    name:string;

    quantity:number;

    price:number;

  }[];



  totalAmount:number;



  paymentMethod?:PaymentMethod;


};





export type UpdateBookingStatusDTO = {


  status:
    | "Pending"
    | "Confirmed"
    | "Cancelled";



  paymentStatus?:
    | "Pending"
    | "Paid"
    | "Failed";



  paymentRef?:string;


};