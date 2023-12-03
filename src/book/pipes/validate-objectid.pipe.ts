import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata): string {
    const isValidId = mongoose.isValidObjectId(value);
    if (!isValidId) {
      throw new BadRequestException('Invalid ObjectId');
    }
    return value;
  }
}
