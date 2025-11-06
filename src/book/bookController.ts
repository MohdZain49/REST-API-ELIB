import type { NextFunction, Request, Response } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import cloudinary from "../config/cloudinary.ts";
import bookModel from "./bookModel.ts";
import createHttpError from "http-errors";
import type { AuthRequest } from "../middlewares/authenticate.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createBook = async (req: Request, res: Response, next: NextFunction) => {
  const { title, genre, description } = req.body;

  try {
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    // upload book cover page on cloudinary

    const coverImage = files.coverImage[0];
    const fileName = coverImage.filename;
    const coverImageMimeType = coverImage.mimetype.split("/").at(-1);

    const coverImagePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      fileName
    );

    const uploadResult = await cloudinary.uploader.upload(coverImagePath, {
      filename_override: fileName,
      folder: "book-covers",
      format: coverImageMimeType,
    });

    // upload book file on cloudinary

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      bookFileName
    );

    const bookFileUploadResult = await cloudinary.uploader.upload(
      bookFilePath,
      {
        resource_type: "raw",
        filename_override: bookFileName,
        folder: "book-pdfs",
        format: "pdf",
      }
    );

    const _req = req as AuthRequest;

    const newBook = await bookModel.create({
      title,
      description,
      genre,
      author: _req.userId,
      coverImage: uploadResult.secure_url,
      file: bookFileUploadResult.secure_url,
    });

    await fs.promises.unlink(coverImagePath);
    await fs.promises.unlink(bookFilePath);

    res.status(201).json({ id: newBook._id });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Error while uploading the files."));
  }
};

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { bookId } = req.params;

    const { title, genre, description } = req.body;

    const book = await bookModel.findOne({
      _id: bookId,
    });

    if (!book) {
      const error = createHttpError(404, "Book not found");
      return next(error);
    }

    const _req = req as AuthRequest;

    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(403, "unauthorized request"));
    }

    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    // upload book cover page on cloudinary

    let completeCoverImage = "";

    if (files.coverImage) {
      const coverImage = files.coverImage[0];
      const fileName = coverImage.filename;
      const coverImageMimeType = coverImage.mimetype.split("/").at(-1);

      const coverImagePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        fileName
      );

      completeCoverImage = fileName;
      const uploadResult = await cloudinary.uploader.upload(coverImagePath, {
        filename_override: completeCoverImage,
        folder: "book-covers",
        format: coverImageMimeType,
      });

      completeCoverImage = uploadResult.secure_url;

      await fs.promises.unlink(coverImagePath);
    }

    // upload book file on cloudinary

    let completeFileName = "";

    if (files.file) {
      const bookFileName = files.file[0].filename;
      const bookFilePath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        bookFileName
      );

      completeFileName = bookFileName;

      const bookFileUploadResult = await cloudinary.uploader.upload(
        bookFilePath,
        {
          resource_type: "raw",
          filename_override: bookFileName,
          folder: "book-pdfs",
          format: "pdf",
        }
      );

      completeFileName = bookFileUploadResult.secure_url;
      await fs.promises.unlink(bookFilePath);
    }

    const updatedBook = await bookModel.findOneAndUpdate(
      {
        _id: bookId,
      },
      {
        title: title,
        description: description,
        genre: genre,
        coverImage: completeCoverImage ? completeCoverImage : book.coverImage,
        file: completeFileName ? completeFileName : book.file,
      },
      { new: true }
    );

    res.status(201).json(updatedBook);
  } catch (error) {
    const err = createHttpError(500, "Something went wrong");
    return next(err);
  }
};

const listBooks = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const books = await bookModel.find();

    if(!books) {
      const err = createHttpError(500, "books are not found");
      return next(err);
    }

    return res.json(books)

  } catch (error) {
    const err = createHttpError(500, "Something went wrong")
    return next(err)
  }
}

export { createBook, updateBook, listBooks };
