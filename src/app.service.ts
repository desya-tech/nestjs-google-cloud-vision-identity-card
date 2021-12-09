import { Injectable } from '@nestjs/common';
const vision = require('@google-cloud/vision');

@Injectable()
export class AppService {
  
  getHello() {
    let data;
    let array=[];
    // Imports the Google Cloud client library

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: 'C:/Users/desya/Downloads/virtus-platform-2be1302457ca.json'
  });

  // Performs label detection on the image file
  client.labelDetection('C:/Users/desya/Desktop/Sembarang/ktp2.jpeg').then((results)=>{
    const labels = results[0].labelAnnotations;
    // console.log('Labels:');
    // console.log(labels)
    // console.log(labels.filter(label => label.score > 0.8 && label.description=='Identity document'))
  });

  client.textDetection('C:/Users/desya/Desktop/Sembarang/ktp2.jpeg').then((results)=>{
    const labels = results[0].textAnnotations;
    // console.log(labels[0].description.replace("\n","a"));
    console.log(labels[0].description
    //   .replace("Tempat/Tgl Lahir : ","")
    //   .replace("NIK","")
    //   .replace(": ","")
    // .replace("Nama","")
    // .replace("Jenis kelamin","")
    // .replace("Alamat","")
    // .replace("PROVINSI ","")
    // .replace("KABUPATEN ","")
    // .replace("RT/RW","")
    // .replace("Kel/Desa","")
    // .replace("Kecamatan ","")
    // .replace("Agama","")
    // .replace("Status Perkawinan BELUM KAWIN","BELUM KAWIN")
    // .replace("Pekerjaan","")
    // .replace("Kewarganeg araan WNI","WNI")
    // .replace("Kewarganegaraan ","")
    // .replace("Berlaku Hingga","")
    // .replace("Gol. Darah :","")
    // .replace(":KRISTEN","KRISTEN")
    // .replace("Gol Darah","")
    // .replace("Jenis Kelamin","")
    // .replace("Status Perkawinan: ","")
    // .replace(":","")
    );
  });

 return client.textDetection('C:/Users/desya/Desktop/Sembarang/ktp2.jpeg').then(results=>{
    const labels = results[0].textAnnotations;
    labels[0].description
    .replace("Tempat/Tgl Lahir : ","")
    .replace("NIK","")
    .replace(": ","")
    .replace("Tempat/Tgl Lahir ","")
    .replace("Nama","")
    .replace("Jenis kelamin","")
    .replace("Alamat","")
    .replace("PROVINSI ","")
    .replace("KABUPATEN ","")
    // .replace("RT/RW","")
    // .replace("Kel/Desa","")
    .replace("Kecamatan :","")
    .replace("Agama","")
    .replace("Status Perkawinan BELUM KAWIN","BELUM KAWIN")
    .replace("Pekerjaan","")
    .replace("Kewarganegaraan ","")
    .replace("Berlaku Hingga","")
    .replace("Gol. Darah :","")
    .replace("Gol Darah","")
    .replace("Jenis Kelamin","")
    .replace("Status Perkawinan: ","")
    .replace("Ke varganegaraan: ","")
    .replace("Kewarganegaraan: ","")
    .replace(":","")
    // .replace(", ","")
    .split('\n').forEach((element, index) => {
      if(
        index == 0 || index == 1 || index == 3 || index == 5 
        || index == 6 || index == 7 || index == 8 
        || index == 9 || index == 10 || index == 11 || index == 16 
        // || index == 18 || index == 20
        // || index == 21 || index == 24
        ){
          if((index==8 || index == 7) && element == ''){
            console.log(element[0])
          }
        array.push(element);
      }
    });
    // data = labels[0].description.split('\n')[0];
    // array.push(data);
    return array;
  });
  
  }
}
