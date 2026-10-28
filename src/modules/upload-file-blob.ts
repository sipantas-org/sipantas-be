import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { del, put } from '@vercel/blob';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import type { Request, Response } from 'express';
import { memoryStorage } from 'multer';
import { extname } from 'path';

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

@ApiTags('upload-blob')
@Controller('upload-blob')
export class UploadFileBlobController {
  @Post('token')
  @ApiOperation({
    summary: 'Generate client token untuk Vercel Blob',
    description:
      'Menghasilkan token upload sementara untuk direct upload dari frontend ke Vercel Blob',
  })
  async generateBlobToken(@Req() req: Request, @Res() res: Response) {
    try {
      const body = req.body as HandleUploadBody;
      const jsonResponse = await handleUpload({
        body,
        request: req,
        token: process.env.BLOB_READ_WRITE_TOKEN,
        onBeforeGenerateToken: async (pathname, clientPayload) => {
          return {
            allowedContentTypes: [
              'image/jpg',
              'image/jpeg',
              'image/png',
              'image/webp',
              'application/pdf',
            ],
            maximumSizeInBytes: 15 * 1024 * 1024, // Maksimal 15 MB
            tokenPayload: clientPayload,
          };
        },
        onUploadCompleted: async ({ blob, tokenPayload }) => {
          console.log('Vercel Blob upload selesai:', blob.url, tokenPayload);
        },
      });

      return res.status(200).json(jsonResponse);
    } catch (error) {
      return res.status(400).json({ error: (error as Error).message });
    }
  }

  @Post('')
  @ApiOperation({
    summary: 'Upload file ke Vercel Blob via server',
    description:
      'Menerima file multipart/form-data di backend lalu mengunggahnya ke Vercel Blob menggunakan SDK server',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        filePath: {
          type: 'string',
          description:
            'Path folder penyimpanan di blob (opsional, mengizinkan alfanumerik, spasi, "-", "_", dan "/" untuk subfolder)',
          example: 'survei-lapangan/dokumentasi-kerusakan-pondasi',
        },
        folder: {
          type: 'string',
          description:
            'Folder penyimpanan di blob (opsional, default: uploads)',
          example: 'survei-lapangan',
        },
        fileName: {
          type: 'string',
          description: 'Nama kustom file tanpa ekstensi (opsional)',
          example: 'bukti-kerusakan',
        },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 }, // Maksimal 10 MB
    }),
  )
  async uploadFileServer(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
    @Body('filePath') filePath?: string,
    @Body('folder') folder?: string,
    @Body('fileName') fileName?: string,
  ) {
    if (!file) {
      throw new BadRequestException('File wajib diunggah');
    }

    const rawPath =
      filePath ||
      folder ||
      (req.query?.filePath as string) ||
      (req.query?.folder as string);
    const cleanFolder = rawPath ? sanitizeKebabPath(rawPath) : 'uploads';
    const ext = extname(file.originalname);
    const rawNameWithoutExt = fileName
      ? fileName.replace(/\.[^/.]+$/, '')
      : file.originalname.slice(0, -ext.length || undefined);
    const baseName = toKebabCase(rawNameWithoutExt) || 'file';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const finalPathname = `${cleanFolder}/${baseName}-${uniqueSuffix}${ext}`;

    const blob = await put(finalPathname, file.buffer, {
      access: 'public',
      contentType: file.mimetype,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return {
      message: 'Upload ke Vercel Blob berhasil',
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      contentType: blob.contentType,
      filePath: cleanFolder,
      fileName: `${baseName}-${uniqueSuffix}${ext}`,
    };
  }

  @Delete('')
  @ApiOperation({
    summary: 'Hapus file dari Vercel Blob',
    description: 'Menghapus berkas dari Vercel Blob berdasarkan URL berkas',
  })
  @ApiQuery({
    name: 'url',
    type: 'string',
    description: 'URL file di Vercel Blob yang akan dihapus',
    example: 'https://xxx.public.blob.vercel-storage.com/uploads/photo.jpg',
  })
  async deleteBlobFile(@Query('url') url: string) {
    if (!url || !url.trim()) {
      throw new BadRequestException('Parameter url wajib disertakan');
    }

    await del(url, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    return {
      message: 'File berhasil dihapus dari Vercel Blob',
      deletedUrl: url,
    };
  }
}
