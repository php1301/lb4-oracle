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
  LoaiGhe,
} from '../models';
import {GheRepository} from '../repositories';

export class GheLoaiGheController {
  constructor(
    @repository(GheRepository)
    public gheRepository: GheRepository,
  ) { }

  @get('/ghes/{id}/loai-ghe', {
    responses: {
      '200': {
        description: 'LoaiGhe belonging to Ghe',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(LoaiGhe)},
          },
        },
      },
    },
  })
  async getLoaiGhe(
    @param.path.number('id') id: typeof Ghe.prototype.maGhe,
  ): Promise<LoaiGhe> {
    return this.gheRepository.gheLoaiGhe(id);
  }
}
