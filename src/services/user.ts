import * as UserModel from "../models/user";
import { IUser } from "../interface/user";
import bcrypt from "bcrypt";
import { NotFoundError } from "../error/NotFoundError";
import loggerWithNameSpace from "../utils/logger";
import { BadRequestError } from "../error/BadRequestError";
import { deleteAllTaskByUserId } from "./task";

const logger = loggerWithNameSpace("User Service");

//service function to return user by id
export function getUserById(id: string) {
  logger.info("Attempting to get user by id");

  const data = UserModel.getUserById(id);

  if (!data) {
    logger.error("user not found");

    throw new NotFoundError("user not found");
  }

  return data;
}

//service function to return user by email
export function getUserByEmail(email: string) {
  logger.info("Attempting to get user by email");

  const data = UserModel.getUserByEmail(email);

  if (!data) {
    logger.error("user not found");

    throw new NotFoundError("user not found");
  }

  return data;
}

//service function to create new user
export async function createUser(user: IUser) { //async for using hash of bcrypt
  logger.info("Attempting to add user");

  logger.info(`comparing incomming email with existing emails`);

  //to prevent multiple user with same email
  if (UserModel.getUserByEmail(user.email)) {
    logger.error(`Email is already used:${user.email}`);

    throw new BadRequestError("Email is already used");
  }
  
  const hashSaltValue=10;

  const password = await bcrypt.hash(user.password,hashSaltValue ); //hashing password

  const newUser = {
    ...user,
    password,
  };

  //creating new user
  return UserModel.createUser(newUser);
}

//service to handle update user
export async function updateUser(id: string, updateUser: IUser) {//async for using hash of bcrypt
  logger.info("Attempting to update user");

  logger.info("Attempting to get user by id");

  const data = UserModel.getUserById(id);

  if (!data) {
    logger.error("user not found");

    throw new NotFoundError("user not found");
  }

  logger.info(`comparing with existing emails`);

  //to prevent multiple user with same email
  if (
    UserModel.getUserById(id)!.email !== updateUser.email &&
    UserModel.getUserByEmail(updateUser.email)
  ) {
    //checking only if email is changed
    logger.error(`Email is already used:${updateUser.email}`);

    throw new BadRequestError("Email is already used");
  }

  //hashing password
  if (
    !(await bcrypt.compare(
      UserModel.getUserById(id)!.password,
      updateUser.password
    ))
  ) {
    const password = await bcrypt.hash(updateUser.password, 10);
    updateUser = { ...updateUser, password: password };
  }

  return UserModel.updateUser(id, updateUser);
}

//service to handle delete user
export function deleteUser(UserId: string) {
  logger.info("Attempting to get user by id");

  const data = UserModel.getUserById(UserId);

  if (!data) {
    logger.error("user not found");

    throw new NotFoundError("user not found");
  }
  
  //deleting tasks of the user
  deleteAllTaskByUserId(UserId);

  return UserModel.deleteUser(UserId);
}
