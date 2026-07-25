import { Request, Response } from "express";
import { ShowtimeService } from "../services/showtime.service";

const service = new ShowtimeService();

/* ===========================
   PUBLIC
=========================== */

export async function listShowtimes(req: Request, res: Response) {
  try {
    const data = await service.listShowtimes({
      movieId: req.query.movieId
        ? String(req.query.movieId)
        : undefined,
      page: Number(req.query.page || 1),
      limit: Number(req.query.limit || 10),
    });

    return res.json({
      success: true,
      ...data,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getShowtime(req: Request, res: Response) {
  try {
    const showtime = await service.getShowtime(req.params.id);

    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: "Showtime not found",
      });
    }

    return res.json({
      success: true,
      showtime,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/* ===========================
   ADMIN
=========================== */

export async function adminCreateShowtime(
  req: Request,
  res: Response
) {
  try {
    const showtime = await service.createShowtime(req.body);

    return res.status(201).json({
      success: true,
      showtime,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function adminUpdateShowtime(
  req: Request,
  res: Response
) {
  try {
    const showtime = await service.updateShowtime(
      req.params.id,
      req.body
    );

    if (!showtime) {
      return res.status(404).json({
        success: false,
        message: "Showtime not found",
      });
    }

    return res.json({
      success: true,
      showtime,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function adminDeleteShowtime(
  req: Request,
  res: Response
) {
  try {
    const deleted = await service.deleteShowtime(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Showtime not found",
      });
    }

    return res.json({
      success: true,
      message: "Showtime deleted",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}