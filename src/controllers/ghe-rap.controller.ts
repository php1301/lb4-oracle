import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Ghe,
  Rap,
} from '../models';
import {GheRepository} from '../repositories';

export class GheRapController {
  constructor(
    @repository(GheRepository)
    public gheRepository: GheRepository,
  ) { }

  @get('/ghes/{id}/rap', {
    responses: {
      '200': {
        description: 'Rap belonging to Ghe',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Rap)},
          },
        },
      },
    },
  })
  async getRap(
    @param.path.number('id') id: typeof Ghe.prototype.maGhe,
  ): Promise<Rap> {
    return this.gheRepository.gheRap(id);
  }
}
