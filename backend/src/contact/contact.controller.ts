import { Body, Controller, Post } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { contactSchema, type ContactInput } from 'shared/schemas/contact.schema'
import { ZodValidationPipe } from '../common/pipes/zod.validation.pipe.js'
import { ContactService } from './contact.service.js'

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // público y sin login: el límite bajo frena el spam
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post()
  send(@Body(new ZodValidationPipe(contactSchema)) body: ContactInput) {
    return this.contactService.send(body)
  }
}
