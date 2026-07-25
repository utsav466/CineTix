import { ShowtimeModel, IShowtime } from "../models/showtime.model";

export class ShowtimeRepository {
  async create(data: Partial<IShowtime>) {
    return ShowtimeModel.create(data);
  }

  async findById(id: string) {
    return ShowtimeModel.findById(id).populate("movieId");
  }

  async updateById(id: string, data: Partial<IShowtime>) {
    return ShowtimeModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async deleteById(id: string) {
    return ShowtimeModel.findByIdAndDelete(id);
  }

  async list(query: any, skip: number, limit: number, sort: any) {
    const [items, total] = await Promise.all([
      ShowtimeModel.find(query)
        .populate("movieId")
        .sort(sort)
        .skip(skip)
        .limit(limit),

      ShowtimeModel.countDocuments(query),
    ]);

    return {
      items,
      total,
    };
  }
}