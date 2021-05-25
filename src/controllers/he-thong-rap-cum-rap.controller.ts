import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  HeThongRap,
  CumRap,
} from '../models';
import {HeThongRapRepository} from '../repositories';

export class HeThongRapCumRapController {
  constructor(
    @repository(HeThongRapRepository) protected heThongRapRepository: HeThongRapRepository,
  ) { }

  @get('/he-thong-raps/{id}/cum-raps', {
    responses: {
      '200': {
        description: 'Array of HeThongRap has many CumRap',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(CumRap)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<CumRap>,
  ): Promise<CumRap[]> {
    return this.heThongRapRepository.cacCumRapHeThongRap(id).find(filter);
  }

  @post('/he-thong-raps/{id}/cum-raps', {
    responses: {
      '200': {
        description: 'HeThongRap model instance',
        content: {'application/json': {schema: getModelSchemaRef(CumRap)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof HeThongRap.prototype.maHeThongRap,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CumRap, {
            title: 'NewCumRapInHeThongRap',
            exclude: ['maCumRap'],
            optional: ['maHeThongRap']
          }),
        },
      },
    }) cumRap: Omit<CumRap, 'maCumRap'>,
  ): Promise<CumRap> {
    return this.heThongRapRepository.cacCumRapHeThongRap(id).create(cumRap);
  }

  @patch('/he-thong-raps/{id}/cum-raps', {
    responses: {
      '200': {
        description: 'HeThongRap.CumRap PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(CumRap, {partial: true}),
        },
      },
    })
    cumRap: Partial<CumRap>,
    @param.query.object('where', getWhereSchemaFor(CumRap)) where?: Where<CumRap>,
  ): Promise<Count> {
    return this.heThongRapRepository.cacCumRapHeThongRap(id).patch(cumRap, where);
  }

  @del('/he-thong-raps/{id}/cum-raps', {
    responses: {
      '200': {
        description: 'HeThongRap.CumRap DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(CumRap)) where?: Where<CumRap>,
  ): Promise<Count> {
    return this.heThongRapRepository.cacCumRapHeThongRap(id).delete(where);
  }
}
