import { Request, Response } from "express";
import { SeatService } from "../services/seat.service";

const service = new SeatService();

export async function getSeats(req: Request, res: Response) {
  const seats = await service.getSeats(req.params.showtimeId);

  res.json({
    success: true,
    seats,
  });
}

export async function reserveSeat(req: Request, res: Response) {
  const seat = await service.reserveSeat(req.params.id);

  if (!seat) {
    return res.status(404).json({
      success: false,
      message: "Seat not found",
    });
  }

  res.json({
    success: true,
    seat,
  });
}

export async function bookSeat(req: Request, res: Response) {
  const seat = await service.bookSeat(req.params.id);

  if (!seat) {
    return res.status(404).json({
      success: false,
      message: "Seat not found",
    });
  }

  res.json({
    success: true,
    seat,
  });
}

export async function releaseSeat(req: Request, res: Response) {
  const seat = await service.releaseSeat(req.params.id);

  if (!seat) {
    return res.status(404).json({
      success: false,
      message: "Seat not found",
    });
  }

  res.json({
    success: true,
    seat,
  });
}