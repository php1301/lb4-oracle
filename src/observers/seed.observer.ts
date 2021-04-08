import {
  Application,
  CoreBindings,
  inject,
  lifeCycleObserver,
  LifeCycleObserver,
} from '@loopback/core';
// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-access-control-migration
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {genSalt, hash} from 'bcryptjs';
import {LoaiNguoiDungRepository, UsersRepository} from '../repositories';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('')
export class SampleObserver implements LifeCycleObserver {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
    @inject('repositories.LoaiNguoiDungRepository')
    private loaiNguoiDungRepo: LoaiNguoiDungRepository,
    @inject('repositories.UsersRepository') private userRepo: UsersRepository,
  ) {}

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    // Add your logic for start
    if (process.env.SEED_DATA === 'run') {
      console.log('run');
      await this.createLoaiNguoiDung();
      await this.createUsers();
    }
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    // Add your logic for stop
  }

  async createUsers(): Promise<void> {
    const existed = await this.userRepo.find({
      where: {
        taiKhoan: 1,
      },
    });
    if (existed.length === 0) {
      const hashedPassword = await this.hashPassword('test123', 10);
      const users = [
        {
          username: 'php1301',
          email: 'test1234@gmail.com',
          password: hashedPassword,
          maLoaiNguoiDung: 1,
        },
        {
          username: 'phuc',
          email: 'test123@gmail.com',
          password: hashedPassword,
          maLoaiNguoiDung: 2,
        },
        {
          username: 'Bob',
          email: 'bob@projects.com',
          password: hashedPassword,
          maLoaiNguoiDung: 3,
        },
      ];

      for (const u of users) {
        const currentUser = await this.userRepo.create(u);
        await this.userRepo
          .userCredentials(currentUser.taiKhoan)
          .create({password: u.password, taiKhoan: currentUser.taiKhoan});
      }
      console.log('Users Seeded');
    }
  }

  async createLoaiNguoiDung(): Promise<void> {
    const loaiNguoiDung = [
      {
        maLoaiNguoiDung: 1,
        tenLoai: 'Client',
      },
      {
        maLoaiNguoiDung: 2,
        tenLoai: 'Admin',
      },
      {
        maLoaiNguoiDung: 3,
        tenLoai: 'VIP',
      },
    ];
    const existed = await this.loaiNguoiDungRepo.find({
      where: {maLoaiNguoiDung: 1},
    });
    if (existed.length === 0) {
      for (const p of loaiNguoiDung) {
        await this.loaiNguoiDungRepo.create(p);
      }
      console.log('LoaiNguoiDung Seeded');
    }
  }

  async hashPassword(password: string, rounds: number): Promise<string> {
    const salt = await genSalt(rounds);
    return hash(password, salt);
  }
}
