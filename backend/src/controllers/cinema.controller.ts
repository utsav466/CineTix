import { Request, Response } from "express";
import { CinemaService } from "../services/cinema.service";

const service = new CinemaService();

/* Public */

export async function listCinemas(
  req: Request,
  res: Response
) {
  try {
    const cinemas = await service.getAllCinemas();

    return res.json({
      success: true,
      cinemas,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function getCinema(
  req: Request,
  res: Response
) {
  try {
    const cinema = await service.getCinemaById(req.params.id);

    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: "Cinema not found",
      });
    }

    return res.json({
      success: true,
      cinema,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

/* Admin */

export async function adminCreateCinema(
  req: Request,
  res: Response
) {
  try {
    const cinema = await service.createCinema(req.body);

    return res.status(201).json({
      success: true,
      cinema,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function adminUpdateCinema(
  req: Request,
  res: Response
) {
  try {
    const cinema = await service.updateCinema(
      req.params.id,
      req.body
    );

    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: "Cinema not found",
      });
    }

    return res.json({
      success: true,
      cinema,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

export async function adminDeleteCinema(
  req: Request,
  res: Response
) {
  try {
    const cinema = await service.deleteCinema(req.params.id);

    if (!cinema) {
      return res.status(404).json({
        success: false,
        message: "Cinema not found",
      });
    }

    return res.json({
      success: true,
      message: "Cinema deleted",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}