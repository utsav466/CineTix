import { MovieModel, IMovie } from "../models/movie.model";

export class MovieRepository {
  async create(data: Partial<IMovie>) {
    return MovieModel.create(data);
  }

  async findById(id: string) {
    return MovieModel.findById(id);
  }

  async updateById(id: string, data: Partial<IMovie>) {
    return MovieModel.findByIdAndUpdate(id, data, {
      new: true,
    });
  }

  async deleteById(id: string) {
    return MovieModel.findByIdAndDelete(id);
  }

  async list(query: any, skip: number, limit: number, sort: any) {
    const [items, total] = await Promise.all([
      MovieModel.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit),

      MovieModel.countDocuments(query),
    ]);

    return { items, total };
  }
}