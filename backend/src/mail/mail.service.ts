import { Injectable, Logger } from '@nestjs/common'
import transporter from '../config/mail.config.js'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)

  // nunca rechaza: un mail fallido se loguea y devuelve false para que el que lo llamó decida qué hacer
  async send(to: string, subject: string, html: string, replyTo?: string) {
    try {
      await transporter.sendMail({ from: `Garsonic <${process.env.EMAIL_USER}>`, to, subject, html, replyTo })
      return true
    } catch (error) {
      this.logger.error(`No se pudo enviar el mail a ${to}`, error)
      return false
    }
  }
}
