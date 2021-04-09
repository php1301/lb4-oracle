import {
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
} from '@loopback/rest';
import {
  Rap,
  CumRap,
} from '../models';
import {RapRepository} from '../repositories';

export class RapCumRapController {
  constructor(
    @repository(RapRepository)
    public rapRepository: RapRepository,
  ) { }

  @get('/raps/{id}/cum-rap', {
    responses: {
      '200': {
        description: 'CumRap belonging to Rap',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(CumRap)},
          },
        },
      },
    },
  })
  async getCumRap(
    @param.path.number('id') id: typeof Rap.prototype.maRap,
  ): Promise<CumRap> {
    return this.rapRepository.rapCumRap(id);
  }
}
