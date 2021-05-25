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
import {Ghe, Rap} from '../models';
import {RapRepository} from '../repositories';

export class RapGheController {
  constructor(
    @repository(RapRepository) protected rapRepository: RapRepository,
  ) {}

  @get('/lay-ghe-cua-rap/{id}', {
    responses: {
      '200': {
        description: 'Array of Rap has many Ghe',
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
    return this.rapRepository.rapCuaGhe(id).find(filter);
  }

  @post('/raps/{id}/ghes', {
    responses: {
      '200': {
        description: 'Rap model instance',
        content: {'application/json': {schema: getModelSchemaRef(Ghe)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Rap.prototype.maRap,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Ghe, {
            title: 'NewGheInRap',
            exclude: ['maGhe'],
            optional: ['maRap'],
          }),
        },
      },
    })
    ghe: Omit<Ghe, 'maGhe'>,
  ): Promise<Ghe> {
    return this.rapRepository.rapCuaGhe(id).create(ghe);
  }

  @patch('/raps/{id}/ghes', {
    responses: {
      '200': {
        description: 'Rap.Ghe PATCH success count',
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
    return this.rapRepository.rapCuaGhe(id).patch(ghe, where);
  }

  @del('/raps/{id}/ghes', {
    responses: {
      '200': {
        description: 'Rap.Ghe DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(Ghe)) where?: Where<Ghe>,
  ): Promise<Count> {
    return this.rapRepository.rapCuaGhe(id).delete(where);
  }
}
