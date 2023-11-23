import { HttpService } from '@nestjs/axios';
import { Controller, Get, UseGuards, Request, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'nest-keycloak-connect';

@Controller()
export class AppController {
  constructor(private readonly httpService: HttpService) {}

  @Get()
  @UseGuards(AuthGuard)
  getHello(): string {
    return "Hello";
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    this.addDatastream("test","test", file.buffer, null, null);
  }


  addDatastream(pid, dsId, data, onSuccess, onError) {

    var http = require("http");
    var mime = require("mime");
    // if(!checkConfiguration()){
    //   onError("Fedora is not configured");
    // }
    const headersRequest = {
      'Content-Type': 'application/octet-stream', // afaik this one is not needed
      'Authorization': `Basic ZmVkb3JhQWRtaW46ZmVkb3JhQWRtaW4=`,
    };
    let options:any = {};
    options.method = 'POST';
    options.path = '/fcrepo/rest/';
    options.headers = headersRequest;
    let url = "http://172.17.0.1:8085";
    var req = http.request(url, options, function(res) {
  
      res.setEncoding('utf8');
      var resultData = "";
      res.on('data', function(xml) {
        resultData += xml;
      });
      res.on('end', function() {
        console.log(resultData);
        // onSuccess(resultData);
      });
    }).on('error', function(e) {
      console.log("error", e)
      // onError(e);
    })
    req.write(data + "\n")
    req.end();


  //   const options = {
  //     hostname: 'fcrepo',
  //     port: '8085',
  //     path: '/fcrepo/rest/1ed0f9a9-8a34-4edc-b98b-071063fa8b18',
  //     headers: {
  //         Authorization: 'Basic ZmVkb3JhQWRtaW46ZmVkb3JhQWRtaW4='
  //     }
  // }
  
  //   http.get(options, (response) => {
    
  //       var result = ''
  //       response.on('data', function (chunk) {
  //           result += chunk;
  //       });
    
  //       response.on('end', function () {
  //           console.log(result);
  //       });
    
  //   });
//   const headersRequest = {
//     // 'Content-Type': 'application/json', // afaik this one is not needed
//     'Authorization': `Basic ZmVkb3JhQWRtaW46ZmVkb3JhQWRtaW4=`,
// };
//     this.httpService.get('http://172.17.0.1:8085/fcrepo/rest', { headers : headersRequest}).subscribe((res) => {
//       console.log(res);
//     })

  }
}
