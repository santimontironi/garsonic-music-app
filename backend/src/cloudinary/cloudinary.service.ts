import { Injectable } from '@nestjs/common'
import cloudinary from '../config/cloudinary.config.js'

type ResourceType = 'image' | 'video'

@Injectable()
export class CloudinaryService {
  // Cloudinary sube el audio como 'video'; en ese caso devuelve la duración en segundos
  upload(buffer: Buffer, folder: string, resourceType: ResourceType = 'image'): Promise<{ url: string; publicId: string; duration?: number }> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder, resource_type: resourceType }, (error, result) => {
        if (error || !result) return reject(error)
        resolve({ url: result.secure_url, publicId: result.public_id, duration: result.duration })
      })
      stream.end(buffer)
    })
  }

  // destroy() busca en 'image' por defecto: para borrar un audio hay que pasar 'video'
  remove(publicId: string, resourceType: ResourceType = 'image') {
    return cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
  }
}
