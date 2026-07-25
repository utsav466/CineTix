import { SeatRepository } from "../repositories/seat.repository";

export class SeatService {
  constructor(private repo = new SeatRepository()) {}

  getSeats(showtimeId: string) {
    return this.repo.findByShowtime(showtimeId);
  }

  reserveSeat(id: string) {
    return this.repo.update(id, {
      status: "reserved",
    });
  }

  bookSeat(id: string) {
    return this.repo.update(id, {
      status: "booked",
    });
  }

  releaseSeat(id: string) {
    return this.repo.update(id, {
      status: "available",
    });
  }
}