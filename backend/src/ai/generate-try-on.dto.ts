import { IsString, IsEnum, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ClothingCategory } from 'shared';

class UploadedImageDto {
  @IsString()
  @IsNotEmpty()
  url!: string;

  @IsString()
  @IsNotEmpty()
  publicId!: string;

  @IsNotEmpty()
  width!: number;

  @IsNotEmpty()
  height!: number;
}

export class GenerateTryOnDto {
  @ValidateNested()
  @Type(() => UploadedImageDto)
  personImage!: UploadedImageDto;

  @ValidateNested()
  @Type(() => UploadedImageDto)
  clothingImage!: UploadedImageDto;

  @IsEnum(ClothingCategory)
  clothingCategory!: ClothingCategory;
}
