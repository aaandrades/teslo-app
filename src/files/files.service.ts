import { join } from 'path';
import { BadRequestException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';

@Injectable()
export class FilesService {
  create() {
    return 'This action adds a new file';
  }

  getStaticProductImage(imageName: string) {
    const path = join(__dirname, '../../static/products', imageName);
    if (!existsSync(path)) {
      throw new BadRequestException('The product image does not exist');
    }
    return path;
  }
}
