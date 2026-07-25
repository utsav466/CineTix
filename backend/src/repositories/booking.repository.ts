import { BookingModel, IBooking } from "../models/booking.model";


export class BookingRepository {


async create(
data:Partial<IBooking>
){

return BookingModel.create(data);

}



async findById(
id:string
){

return BookingModel.findById(id);

}



async findUserBookings(
userId:string
){

return BookingModel.find({
userId
});

}



async updateById(
id:string,
data:Partial<IBooking>
){

return BookingModel.findByIdAndUpdate(
id,
data,
{
new:true
}
);

}



}