import { Injectable } from '@nestjs/common'
import cloudinary from '../config/cloudinary.config.js'

type ResourceType = 'image' | 'video'

@Injectable()
export class CloudinaryService {
  // Solo imágenes: las canciones las sube el front directo a Cloudinary (ver sign)
  upload(buffer: Buffer, folder: string): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
        if (error || !result) return reject(error)
        resolve({ url: result.secure_url, publicId: result.public_id })
      })
      stream.end(buffer)
    })
  }

  // Firma que autoriza al front a subir directo a esa carpeta; Cloudinary la rechaza si cambia la carpeta o pasó más de una hora
  sign(folder: string, timestamp: number) {
    return cloudinary.utils.api_sign_request({ folder, timestamp }, cloudinary.config().api_secret!)
  }

  // Lee un archivo ya subido; media_metadata hace que devuelva la duración de los audios
  async find(publicId: string, resourceType: ResourceType = 'image'): Promise<{ url: string; bytes: number; isAudio: boolean; duration?: number }> {
    const resource = await cloudinary.api.resource(publicId, { resource_type: resourceType, media_metadata: true })
    return { url: resource.secure_url, bytes: resource.bytes, isAudio: resource.is_audio === true, duration: resource.duration }
  }

  // destroy() busca en 'image' por defecto: para borrar un audio hay que pasar 'video'
  remove(publicId: string, resourceType: ResourceType = 'image') {
    return cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
  }
}
