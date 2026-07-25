import { Request, Response } from "express";
import { MovieService } from "../services/movie.service";

const service = new MovieService();

/* Public */

export async function listPublicMovies(req: Request, res: Response) {
  const data = await service.listMovies({
    search: String(req.query.search || ""),
    genre: req.query.genre ? String(req.query.genre) : undefined,
    status: "now_showing",
    page: Number(req.query.page || 1),
    limit: Number(req.query.limit || 10),
  });

  return res.json({
    success: true,
    ...data,
  });
}

export async function getPublicMovie(req: Request, res: Response) {
  const movie = await service.getMovieById(req.params.id);

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: "Movie not found",
    });
  }

  return res.json({
    success: true,
    movie,
  });
}

/* Admin */

export async function adminListMovies(req: Request, res: Response) {
  const data = await service.listMovies({
    search: String(req.query.search || ""),
    genre: req.query.genre ? String(req.query.genre) : undefined,
    status: req.query.status as any,
    page: Number(req.query.page || 1),
    limit: Number(req.query.limit || 10),
  });

  return res.json({
    success: true,
    ...data,
  });
}

export async function adminCreateMovie(req: Request, res: Response) {
  const movie = await service.createMovie(req.body);

  return res.status(201).json({
    success: true,
    movie,
  });
}

export async function adminGetMovie(req: Request, res: Response) {
  const movie = await service.getMovieById(req.params.id);

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: "Movie not found",
    });
  }

  return res.json({
    success: true,
    movie,
  });
}

export async function adminUpdateMovie(req: Request, res: Response) {
  const movie = await service.updateMovie(req.params.id, req.body);

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: "Movie not found",
    });
  }

  return res.json({
    success: true,
    movie,
  });
}

export async function adminDeleteMovie(req: Request, res: Response) {
  const movie = await service.deleteMovie(req.params.id);

  if (!movie) {
    return res.status(404).json({
      success: false,
      message: "Movie not found",
    });
  }

  return res.json({
    success: true,
    message: "Movie deleted",
  });
}