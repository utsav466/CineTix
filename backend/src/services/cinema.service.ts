import { CinemaModel, ICinema } from "../models/cinema.model";

export class CinemaService {
  async getAllCinemas() {
    return await CinemaModel.find().sort({ name: 1 });
  }

  async getCinemaById(id: string) {
    return await CinemaModel.findById(id);
  }

  async createCinema(data: Partial<ICinema>) {
    return await CinemaModel.create(data);
  }

  async updateCinema(
    id: string,
    data: Partial<ICinema>
  ) {
    return await CinemaModel.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async deleteCinema(id: string) {
    return await CinemaModel.findByIdAndDelete(id);
  }

  async deleteAll() {
    await CinemaModel.deleteMany({});
  }

  async seedCinemas(cinemas: Partial<ICinema>[]) {
    await this.deleteAll();

    const inserted = await CinemaModel.insertMany(cinemas);

    return inserted;
  }
}