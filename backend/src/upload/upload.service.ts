import { Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class UploadService {
  constructor(private cloudinaryService: CloudinaryService) {}

  async uploadPersonImage(file: Express.Multer.File) {
    return this.cloudinaryService.uploadImage(file, 'person');
  }

  async uploadClothingImage(file: Express.Multer.File) {
    return this.cloudinaryService.uploadImage(file, 'clothing');
  }
}
