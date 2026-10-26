import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  NotFoundException,
  Param,
  Res,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBasicAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CombinedAuthGuard } from '../common/guards/combine-auth.guard.js';
import type { Request, Response } from 'express';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { memoryStorage } from 'multer';
import { extname, join } from 'path';

const toKebabCase = (text: string): string =>
  text
    .replace(/[^a-zA-Z0-9 _-]/g, '')
    .trim()
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
    .replace(/[ _-]+/g, '-')
    .replace(/^-+|-+$/g, '');

const sanitizeKebabPath = (pathStr: string): string =>
  pathStr
    .split(/[\\/]/)
    .map((segment) => toKebabCase(segment))
    .filter(Boolean)
    .join('/');

@ApiTags('upload')
@Controller('upload')
export class UploadFileController {
  @Post('')
  @UseGuards(CombinedAuthGuard)
  @ApiBasicAuth('basic-auth')
  @ApiOperation({
    summary: 'Upload file',
    description:
      'Upload file dengan parameter filePath wajib dan fileName opsional (mengizinkan karakter alfanumerik, spasi, "-", "_", dan "/" untuk subfolder, setiap segmen akan diformat menjadi kebab-case).',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description:
            'Path folder penyimpanan (wajib, mengizinkan alfanumerik, spasi, "-", "_", dan "/" untuk subfolder)',
          example: 'survei-lapangan/dokumentasi-kerusakan-pondasi',
        },
        fileName: {
          type: 'string',
          description:
            'Nama custom file (opsional, hanya alfanumerik, spasi, "-", dan "_")',
          example: 'bukti-kerusakan-rumah',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file', 'filePath'],
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // Limit 5 MB
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(
            new BadRequestException('Format file tidak didukung'),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body('filePath') bodyFilePath?: string,
    @Body('fileName') bodyFileName?: string,
  ) {
    if (!file) {
      throw new BadRequestException('File wajib diunggah');
    }

    const rawFilePath = bodyFilePath || (req.query?.filePath as string);
    if (!rawFilePath || !rawFilePath.trim()) {
      throw new BadRequestException('filePath wajib diisi');
    }

    const kebabPath = sanitizeKebabPath(rawFilePath);
    if (!kebabPath) {
      throw new BadRequestException('filePath tidak valid');
    }

    const rawName = bodyFileName || (req.query?.fileName as string);
    const ext = extname(file.originalname);
    const rawNameWithoutExt = rawName
      ? rawName.replace(/\.[^/.]+$/, '')
      : undefined;
    const originalNameWithoutExt = file.originalname.slice(
      0,
      -ext.length || undefined,
    );
    const sourceName = rawNameWithoutExt || originalNameWithoutExt;
    const baseName = toKebabCase(sourceName) || 'file';
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const finalFileName = `${baseName}-${uniqueSuffix}${ext}`;

    const targetDir = join('./uploads', kebabPath);
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }

    writeFileSync(join(targetDir, finalFileName), file.buffer);
    const fullPath = `/uploads/${kebabPath}/${finalFileName}`;

    return {
      message: 'Upload berhasil',
      fileName: finalFileName,
      filePath: kebabPath,
      path: fullPath,
    };
  }

  @Get('file/*')
  @ApiOperation({
    summary: 'Mendapatkan file',
    description: 'Menampilkan atau mengunduh file berdasarkan path relatifnya',
  })
  serveUploadedFile(@Param('0') subPath: string, @Res() res: Response) {
    const sanitized = sanitizeKebabPath(subPath);
    const fullFilePath = join(process.cwd(), 'uploads', sanitized);

    if (!existsSync(fullFilePath)) {
      throw new NotFoundException('File tidak ditemukan');
    }
    return res.sendFile(fullFilePath);
  }
}
