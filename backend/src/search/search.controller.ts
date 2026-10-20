import { Controller, Get, Query, UseGuards } from '@nestjs/common'
import { searchQuerySchema, type SearchQueryInput } from 'shared/schemas/search.schema'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { ZodValidationPipe } from '../common/pipes/zod.validation.pipe.js'
import { SearchService } from './search.service.js'

@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(@Query(new ZodValidationPipe(searchQuerySchema)) query: SearchQueryInput) {
    return this.searchService.search(query)
  }
}
