import { SeatModel, ISeat } from "../models/seat.model";

export class SeatRepository {
  async create(data: Partial<ISeat>) {
    return SeatModel.create(data);
  }

  async findById(id: string) {
    return SeatModel.findById(id);
  }

  async findByShowtime(showtimeId: string) {
    return SeatModel.find({ showtimeId }).sort({
      row: 1,
      number: 1,
    });
  }

  async update(id: string, data: Partial<ISeat>) {
    return SeatModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async delete(id: string) {
    return SeatModel.findByIdAndDelete(id);
  }
}