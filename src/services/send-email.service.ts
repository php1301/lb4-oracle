/* eslint-disable @typescript-eslint/no-explicit-any */
import * as mailjet from 'node-mailjet';

export interface EmailManager<T = void> {
  sendMail(mailObj: any): Promise<T>;
}

export class EmailService {
  constructor() {}

  async sendMail(data: {
    authorEmail: any;
    authorName: any;
    customerName: any;
    tongTien: any;
    viTriGhe: any;
    linkHoaDon: any;
    tenPhim: any;
    ngayChieuGioChieu: any;
    tenRap: any;
  }): Promise<void> {
    console.log(data);
    const pubApiKey = process.env.MJ_APIKEY_PUBLIC ?? '';
    const privApiKey = process.env.MJ_APIKEY_PRIVATE ?? '';
    const request = mailjet
      .connect(pubApiKey, privApiKey)
      .post('send', {version: 'v3.1'})
      .request({
        Messages: [
          {
            From: {
              Email: 'duyminhpham1201@gmail.com',
              Name: 'Shark Cinema',
            },
            To: [
              {
                // Email: data.authorEmail,
                Email: '19520854@gm.uit.edu.vn',
                Name: data.authorName,
              },
            ],
            TemplateID: 2992882,
            TemplateLanguage: true,
            Subject: `Receipt about Đặt vé ${data.tenPhim} của ${data.customerName} `,
            Variables: {
              authorEmail: data.authorEmail,
              authorName: data.authorName,
              customerName: data.customerName,
              tongTien: data.tongTien,
              viTriGhe: data.viTriGhe,
              linkHoaDon: data.linkHoaDon,
              tenPhim: data.tenPhim,
              ngayChieuGioChieu: data.ngayChieuGioChieu,
              tenRap: data.tenRap,
            },
          },
        ],
      });
    request
      .then(result => {
        console.log(result.body);
      })
      .catch(err => {
        console.log(err.message);
        return err.message
      });
  }
}
