import {theLoaiRequest} from '../dto/phim-theloai.dto';
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
  RequestBodyObject,
} from '@loopback/rest';
import {Phim, PhimTheLoai, TheLoai} from '../models';
import {PhimRepository} from '../repositories';

export class PhimTheLoaiController {
  constructor(
    @repository(PhimRepository) protected phimRepository: PhimRepository,
  ) {}

  @get('/phims/{id}/the-loais', {
    responses: {
      '200': {
        description: 'Array of Phim has many TheLoai through PhimTheLoai',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(TheLoai)},
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<TheLoai>,
  ): Promise<TheLoai[]> {
    return this.phimRepository.phimtheloai(id).find(filter);
  }

  @post('/phims/{id}/the-loais', {
    responses: {
      '200': {
        description: 'create a TheLoai model instance',
        content: {'application/json': {schema: getModelSchemaRef(TheLoai)}},
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Phim.prototype.maPhim,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TheLoai, {
            title: 'NewTheLoaiInPhim',
            exclude: ['maTheLoai'],
          }),
        },
      },
    })
    theLoai: Omit<TheLoai, 'maTheLoai'>,
  ): Promise<TheLoai> {
    return this.phimRepository.phimtheloai(id).create(theLoai);
  }

  // https://loopback.io/doc/en/lb4/apidocs.openapi-v3.requestbody.array.html
  @post('/phims/{id}/them-the-loai-cho-phim', {
    responses: {
      '200': {
        description: 'Link cac TheLoai to Phim',
        content: {'application/json': {schema: getModelSchemaRef(TheLoai)}},
      },
    },
  })
  async link(
    @param.path.number('id') id: typeof Phim.prototype.maPhim,
    // @requestBody.array(
    //   {schema: getModelSchemaRef(TheLoai)},
    //   {description: 'an array of The Loai'},
    // )
    @requestBody(theLoaiRequest)
    request: RequestBodyObject,
  ): Promise<void> {
    const {theLoai} = request;
    console.log(theLoai);
    await Promise.all(
      theLoai.map(async (i: TheLoai) => {
        await this.phimRepository.phimtheloai(id).link(i.maTheLoai);
      }),
    );
  }

  @patch('/phims/{id}/the-loais', {
    responses: {
      '200': {
        description: 'Phim.TheLoai PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TheLoai, {partial: true}),
        },
      },
    })
    theLoai: Partial<TheLoai>,
    @param.query.object('where', getWhereSchemaFor(TheLoai))
    where?: Where<TheLoai>,
  ): Promise<Count> {
    return this.phimRepository.phimtheloai(id).patch(theLoai, where);
  }

  @del('/phims/{id}/the-loais', {
    responses: {
      '200': {
        description: 'Phim.TheLoai DELETE success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(TheLoai))
    where?: Where<TheLoai>,
  ): Promise<Count> {
    return this.phimRepository.phimtheloai(id).delete(where);
  }
}
