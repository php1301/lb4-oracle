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
Ve,
DatVe,
Ghe,
} from '../models';
import {VeRepository} from '../repositories';

export class VeGheController {
  constructor(
    @repository(VeRepository) protected veRepository: VeRepository,
  ) { }

  @get('/ves/{id}/ghes', {
    responses: {
      '200': {
        description: 'Array of Ve has many Ghe through DatVe',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Ghe)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<Ghe>,
  ): Promise<Ghe[]> {
    return this.veRepository.veDatVeGhe(id).find(filter);
  }

  @post('/ves/{id}/ghes', {
    responses: {
      '200': {
        description: 'create a Ghe model instance',
        content: {'application/json': {schema: getModelSchemaRef(Ghe)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Ve.prototype.maVe,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ghe, {
            title: 'NewGheInVe',
            exclude: ['maGhe'],
          }),
        },
      },
    }) ghe: Omit<Ghe, 'maGhe'>,
  ): Promise<Ghe> {
    return this.veRepository.veDatVeGhe(id).create(ghe);
  }

  @patch('/ves/{id}/ghes', {
    responses: {
      '200': {
        description: 'Ve.Ghe PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ghe, {partial: true}),
        },
      },
    })
    ghe: Partial<Ghe>,
    @param.query.object('where', getWhereSchemaFor(Ghe)) where?: Where<Ghe>,
  ): Promise<Count> {
    return this.veRepository.veDatVeGhe(id).patch(ghe, where);
  }

  @del('/ves/{id}/ghes', {
    responses: {
      '200': {
        description: 'Ve.Ghe DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Ghe)) where?: Where<Ghe>,
  ): Promise<Count> {
    return this.veRepository.veDatVeGhe(id).delete(where);
  }
}
