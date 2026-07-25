import { MovieRepository } from "../repositories/movie.repository";
import { CreateMovieDTO, UpdateMovieDTO } from "../dtos/movie.dto";

export class MovieService {
  constructor(private repo = new MovieRepository()) {}

  async createMovie(dto: CreateMovieDTO) {
    return this.repo.create(dto as any);
  }

  async getMovieById(id: string) {
    return this.repo.findById(id);
  }

  async updateMovie(id: string, dto: UpdateMovieDTO) {
    return this.repo.updateById(id, dto as any);
  }

  async deleteMovie(id: string) {
    return this.repo.deleteById(id);
  }

  async listMovies(params: {
    search?: string;
    genre?: string;
    status?: "now_showing" | "coming_soon";
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(params.page || 1));
    const limit = Math.min(50, Math.max(1, Number(params.limit || 10)));
    const skip = (page - 1) * limit;

    const query: any = {};

    if (params.status) query.status = params.status;

    if (params.genre) {
      query.genre = params.genre;
    }

    if (params.search?.trim()) {
      const search = params.search.trim();

      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { director: { $regex: search, $options: "i" } },
        { genre: { $regex: search, $options: "i" } },
      ];
    }

    const sort = {
      createdAt: -1,
    };

    const { items, total } = await this.repo.list(
      query,
      skip,
      limit,
      sort
    );

    return {
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}