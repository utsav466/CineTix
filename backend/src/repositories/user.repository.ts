import {
  IUser,
  UserDocument,
  UserModel,
} from "../models/user.model";

export type CreateUserRecord = {
  fullName: string;
  email: string;
  username: string;
  phone?: string;
  password: string;

  role?:
    | "customer"
    | "admin";

  preferredCurrency?:
    | "NPR"
    | "USD"
    | "INR";

  avatarUrl?: string;
  isActive?: boolean;
};

export class UserRepository {
  async createUser(
    data: CreateUserRecord,
  ): Promise<UserDocument> {
    return UserModel.create(
      data,
    );
  }

  async getUserById(
    id: string,
  ): Promise<UserDocument | null> {
    return UserModel.findById(
      id,
    ).exec();
  }

  async getUserByIdWithPassword(
    id: string,
  ): Promise<UserDocument | null> {
    return UserModel.findById(
      id,
    )
      .select("+password")
      .exec();
  }

  async getUserByEmail(
    email: string,
  ): Promise<UserDocument | null> {
    return UserModel.findOne({
      email:
        email
          .trim()
          .toLowerCase(),
    }).exec();
  }

  async getUserByEmailWithPassword(
    email: string,
  ): Promise<UserDocument | null> {
    return UserModel.findOne({
      email:
        email
          .trim()
          .toLowerCase(),
    })
      .select("+password")
      .exec();
  }

  async getUserByUsername(
    username: string,
  ): Promise<UserDocument | null> {
    return UserModel.findOne({
      username:
        username
          .trim()
          .toLowerCase(),
    }).exec();
  }

  async getUserByResetToken(
    hashedToken: string,
  ): Promise<UserDocument | null> {
    return UserModel.findOne({
      resetPasswordToken:
        hashedToken,

      resetPasswordExpires: {
        $gt: new Date(),
      },
    })
      .select(
        [
          "+password",
          "+resetPasswordToken",
          "+resetPasswordExpires",
        ].join(" "),
      )
      .exec();
  }

  async updateUser(
    id: string,
    data: Partial<IUser>,
  ): Promise<UserDocument | null> {
    return UserModel.findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  }

  async deleteUser(
    id: string,
  ): Promise<UserDocument | null> {
    return UserModel.findByIdAndDelete(
      id,
    ).exec();
  }

  async getAllUsers(
    page = 1,
    limit = 10,
    search = "",
  ): Promise<{
    users: UserDocument[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const safePage =
      Math.max(
        1,
        Math.floor(page),
      );

    const safeLimit =
      Math.min(
        100,
        Math.max(
          1,
          Math.floor(limit),
        ),
      );

    const skip =
      (safePage - 1) *
      safeLimit;

    const normalizedSearch =
      search.trim();

    const query =
      normalizedSearch
        ? {
            $or: [
              {
                fullName: {
                  $regex:
                    normalizedSearch,

                  $options: "i",
                },
              },

              {
                email: {
                  $regex:
                    normalizedSearch,

                  $options: "i",
                },
              },

              {
                username: {
                  $regex:
                    normalizedSearch,

                  $options: "i",
                },
              },

              {
                phone: {
                  $regex:
                    normalizedSearch,

                  $options: "i",
                },
              },
            ],
          }
        : {};

    const [
      users,
      total,
    ] =
      await Promise.all([
        UserModel.find(query)
          .sort({
            createdAt: -1,
          })
          .skip(skip)
          .limit(safeLimit)
          .exec(),

        UserModel.countDocuments(
          query,
        ).exec(),
      ]);

    return {
      users,
      total,
      page: safePage,
      limit: safeLimit,

      totalPages:
        Math.ceil(
          total /
            safeLimit,
        ),
    };
  }
}