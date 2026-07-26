import { UserModel, IUser } from "../models/user.model";
import { CreateUserDTO } from "../dtos/user.dto";

export class UserRepository {
  async createUser(
    data: CreateUserDTO
  ): Promise<IUser> {
    return UserModel.create(data);
  }

  async getUserById(
    id: string
  ): Promise<IUser | null> {
    return UserModel.findById(id);
  }

  async getUserByEmail(
    email: string
  ): Promise<IUser | null> {
    return UserModel.findOne({
      email: email.toLowerCase(),
    });
  }

  async getUserByUsername(
    username: string
  ): Promise<IUser | null> {
    return UserModel.findOne({
      username,
    });
  }

  async updateUser(
    id: string,
    data: Partial<IUser>
  ): Promise<IUser | null> {
    return UserModel.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      }
    );
  }

  async deleteUser(
    id: string
  ): Promise<IUser | null> {
    return UserModel.findByIdAndDelete(id);
  }

  async getAllUsers(
    page: number = 1,
    limit: number = 10,
    search: string = ""
  ): Promise<{
    users: IUser[];
    total: number;
  }> {
    const skip = (page - 1) * limit;

    const query: any = {};

    if (search.trim()) {
      query.$or = [
        {
          fullName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
        {
          username: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const [users, total] = await Promise.all([
      UserModel.find(query)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      UserModel.countDocuments(query),
    ]);

    return {
      users,
      total,
    };
  }
}