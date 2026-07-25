import { ShowtimeRepository } from "../repositories/showtime.repository";

export class ShowtimeService {
  constructor(private repo = new ShowtimeRepository()) {}

  async createShowtime(data: any) {
    return this.repo.create(data);
  }

  async getShowtime(id: string) {
    return this.repo.findById(id);
  }

  async updateShowtime(id: string, data: any) {
    return this.repo.updateById(id, data);
  }

  async deleteShowtime(id: string) {
    return this.repo.deleteById(id);
  }

  async listShowtimes(params: {
    movieId?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(params.page || 1));
    const limit = Math.min(50, Number(params.limit || 10));
    const skip = (page - 1) * limit;

    const query: any = {};

    if (params.movieId) {
      query.movieId = params.movieId;
    }

    return this.repo.list(query, skip, limit, {
      date: 1,
      time: 1,
    });
  }
}