import { Injectable, Logger } from '@nestjs/common'
import transporter from '../config/mail.config.js'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)

  // nunca rechaza: un mail fallido se loguea y no rompe el flujo que lo llamó
  async send(to: string, subject: string, html: string) {
    try {
      await transporter.sendMail({ from: `Garsonic <${process.env.EMAIL_USER}>`, to, subject, html })
    } catch (error) {
      this.logger.error(`No se pudo enviar el mail a ${to}`, error)
    }
  }
}
