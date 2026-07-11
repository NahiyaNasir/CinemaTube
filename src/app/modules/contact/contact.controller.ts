import status from "http-status";
import { Request, Response } from "express";
import { catchAsync } from "../shared/catchAsync";
import { sendResponse } from "../shared/sendResponse";
import { ContactService } from "./contact.service";

const createContactMessage = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ContactService.createContactMessage(req.body);

    return sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Your message has been sent successfully",
      data: result,
    });
  },
);

const getAllContactMessages = catchAsync(
  async (req: Request, res: Response) => {
    const query = req.query;
    const result = await ContactService.getAllContactMessages(query);

    return sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Contact messages fetched successfully",
      data: result,
    });
  },
);

const markContactMessageAsRead = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ContactService.markContactMessageAsRead(
      id as string,
    );

    return sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Contact message marked as read",
      data: result,
    });
  },
);

const deleteContactMessage = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await ContactService.deleteContactMessage(id as string);

    return sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Contact message deleted successfully",
      data: result,
    });
  },
);

export const ContactController = {
  createContactMessage,
  getAllContactMessages,
  markContactMessageAsRead,
  deleteContactMessage,
};