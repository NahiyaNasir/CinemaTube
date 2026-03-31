declare global {
  namespace Express {
    interface Request {
      user?: IRequestUser;
    }
  }
}

export interface IRequestUser {
  userId: string;
  role: Roles;
  name: string;
  email: string;
  status: UserStatus;
  isDeleted: boolean;
}