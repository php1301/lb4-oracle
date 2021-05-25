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
  CumRap,
  Rap,
} from '../models';
import {CumRapRepository} from '../repositories';

export class CumRapRapController {
  constructor(
    @repository(CumRapRepository) protected cumRapRepository: CumRapRepository,
  ) { }

  @get('/cum-raps/{id}/raps', {
    responses: {
      '200': {
        description: 'Array of CumRap has many Rap',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Rap)},
          },
        },
      },
    },
  })
  async find(
    @param.path.string('id') id: string,
    @param.query.object('filter') filter?: Filter<Rap>,
  ): Promise<Rap[]> {
    return this.cumRapRepository.rapCuaCumRap(id).find(filter);
  }

  @post('/cum-raps/{id}/raps', {
    responses: {
      '200': {
        description: 'CumRap model instance',
        content: {'application/json': {schema: getModelSchemaRef(Rap)}},
      },
    },
  })
  async create(
    @param.path.string('id') id: typeof CumRap.prototype.maCumRap,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rap, {
            title: 'NewRapInCumRap',
            exclude: ['maRap'],
            optional: ['maCumRap']
          }),
        },
      },
    }) rap: Omit<Rap, 'maRap'>,
  ): Promise<Rap> {
    return this.cumRapRepository.rapCuaCumRap(id).create(rap);
  }

  @patch('/cum-raps/{id}/raps', {
    responses: {
      '200': {
        description: 'CumRap.Rap PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rap, {partial: true}),
        },
      },
    })
    rap: Partial<Rap>,
    @param.query.object('where', getWhereSchemaFor(Rap)) where?: Where<Rap>,
  ): Promise<Count> {
    return this.cumRapRepository.rapCuaCumRap(id).patch(rap, where);
  }

  @del('/cum-raps/{id}/raps', {
    responses: {
      '200': {
        description: 'CumRap.Rap DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.string('id') id: string,
    @param.query.object('where', getWhereSchemaFor(Rap)) where?: Where<Rap>,
  ): Promise<Count> {
    return this.cumRapRepository.rapCuaCumRap(id).delete(where);
  }
}
