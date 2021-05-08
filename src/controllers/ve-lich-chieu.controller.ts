import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Ve,
  LichChieu,
} from '../models';
import {VeRepository} from '../repositories';

export class VeLichChieuController {
  constructor(
    @repository(VeRepository)
    public veRepository: VeRepository,
  ) { }

  @get('/ves/{id}/lich-chieu', {
    responses: {
      '200': {
        description: 'LichChieu belonging to Ve',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(LichChieu)},
          },
        },
      },
    },
  })
  async getLichChieu(
    @param.path.number('id') id: typeof Ve.prototype.maVe,
  ): Promise<LichChieu> {
    return this.veRepository.veLichChieu(id);
  }
}
