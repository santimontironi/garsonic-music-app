import { Injectable, ServiceUnavailableException } from '@nestjs/common'
import type { ContactInput } from 'shared/schemas/contact.schema'
import { MailService } from '../mail/mail.service.js'
import { contactTemplate } from '../mail/templates/contact.template.js'

@Injectable()
export class ContactService {
  constructor(private readonly mail: MailService) {}

  async send(data: ContactInput) {
    const { subject, html } = contactTemplate(data)
    const sent = await this.mail.send(process.env.EMAIL_USER!, subject, html, data.email)
    if (!sent) throw new ServiceUnavailableException('No pudimos enviar tu mensaje, probá de nuevo más tarde')
  }
}
