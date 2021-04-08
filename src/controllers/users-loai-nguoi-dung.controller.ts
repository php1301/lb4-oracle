import {repository} from '@loopback/repository';
import {get, getModelSchemaRef, param} from '@loopback/rest';
import {LoaiNguoiDung, Users} from '../models';
import {UsersRepository} from '../repositories';

export class UsersLoaiNguoiDungController {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
  ) {}

  @get('/users/{id}/loai-nguoi-dung', {
    responses: {
      '200': {
        description: 'LoaiNguoiDung belonging to Users',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(LoaiNguoiDung)},
          },
        },
      },
    },
  })
  async getLoaiNguoiDung(
    @param.path.number('id') id: typeof Users.prototype.taiKhoan,
  ): Promise<LoaiNguoiDung> {
    return this.usersRepository.loaiNguoiDung(id);
  }
}
