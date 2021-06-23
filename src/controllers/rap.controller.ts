import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  IsolationLevel,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {assignProjectInstanceId} from '../components/casbin-authorization';
import {Rap} from '../models';
import {GheRepository, RapRepository} from '../repositories';
const RESOURCE_NAME = 'rap';
const ACL_PROJECT = {
  'view-all': {
    resource: `${RESOURCE_NAME}*`, // resource se truyen vo getResourceName
    scopes: ['view-all'],
    allowedRoles: ['admin'],
  },
  'show-balance': {
    resource: RESOURCE_NAME,
    scopes: ['show-balance'],
    allowedRoles: ['owner', 'team'],
    voters: [assignProjectInstanceId],
  },
  donate: {
    resource: RESOURCE_NAME,
    scopes: ['donate'],
    allowedRoles: ['admin', 'owner', 'team'],
    voters: [assignProjectInstanceId],
  },
  withdraw: {
    resource: RESOURCE_NAME,
    scopes: ['withdraw'],
    allowedRoles: ['owner'],
    voters: [assignProjectInstanceId],
  },
};
export class RapController {
  constructor(
    @repository(RapRepository)
    public rapRepository: RapRepository,
    @repository(GheRepository)
    private gheRepo: GheRepository,
  ) {}

  @post('/raps')
  @response(200, {
    description: 'Rap model instance',
    content: {'application/json': {schema: getModelSchemaRef(Rap)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rap, {
            title: 'NewRap',
            partial: true,
          }),
        },
      },
    })
    rap: Rap,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any> {
    let res = {};
    const transaction = await this.rapRepository.dataSource.beginTransaction(
      IsolationLevel.READ_COMMITTED,
    );
    try {
      const newRap = await this.rapRepository.create(rap, {transaction});
      let stt = 0;
      const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
      const maLoaiGheArr = [1, 2];
      await Promise.all(
        alphabet.map(async alpha => {
          // Có thể random seat số lượng ghế mỗi hàng từ 10 ~ 12
          // const arrSeats = [...Array(Math.floor(Math.random() * 15) + 1)]; // random từ 1 đến 15
          const arrSeats = [...Array(12)];
          await Promise.all(
            arrSeats.map(async (seat, seatIndex) => {
              stt += 1;
              await this.gheRepo.create(
                {
                  // seed 7 rạp 0->6 => +1
                  maRap: newRap.maRap,
                  // Tên ghế là chữ + số ghế hàng đó
                  tenGhe: `${alpha}${seatIndex + 1}`,
                  stt: stt,
                  // Random maLoaiGhe
                  maLoaiGhe:
                    maLoaiGheArr[
                      Math.floor(Math.random() * maLoaiGheArr.length)
                    ],
                  // kichHoat: false,
                },
                {transaction},
              );
            }),
          );
        }),
      );
      await transaction.commit();
      res = {message: 'Tạo rạp và ghế thành công'};
      return res;
    } catch (e) {
      await transaction.rollback();
      res = {message: e.message};
      return res;
    }
  }

  @get('/raps/count')
  @response(200, {
    description: 'Rap model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Rap) where?: Where<Rap>): Promise<Count> {
    return this.rapRepository.count(where);
  }
  @get('/raps')
  @response(200, {
    description: 'Array of Rap model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Rap, {includeRelations: true}),
        },
      },
    },
  })
  // @authenticate('jwt')
  // @authorize(ACL_PROJECT['view-all'])
  async find(@param.filter(Rap) filter?: Filter<Rap>): Promise<Rap[]> {
    return this.rapRepository.find(filter);
  }

  @patch('/raps')
  @response(200, {
    description: 'Rap PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rap, {partial: true}),
        },
      },
    })
    rap: Rap,
    @param.where(Rap) where?: Where<Rap>,
  ): Promise<Count> {
    return this.rapRepository.updateAll(rap, where);
  }

  @get('/raps/{id}')
  @response(200, {
    description: 'Rap model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Rap, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Rap, {exclude: 'where'}) filter?: FilterExcludingWhere<Rap>,
  ): Promise<Rap> {
    return this.rapRepository.findById(id, filter);
  }

  @patch('/raps/{id}')
  @response(204, {
    description: 'Rap PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Rap, {partial: true}),
        },
      },
    })
    rap: Rap,
  ): Promise<void> {
    await this.rapRepository.updateById(id, rap);
  }

  @put('/raps/{id}')
  @response(204, {
    description: 'Rap PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() rap: Rap,
  ): Promise<void> {
    await this.rapRepository.replaceById(id, rap);
  }

  @del('/raps/{id}')
  @response(204, {
    description: 'Rap DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.rapRepository.deleteById(id);
  }
}
