import { Injectable } from '@nestjs/common';
const vision = require('@google-cloud/vision');

@Injectable()
export class AppService {
  
  getHello() {
    let arrayKtp = {}
    let array=[]
    let dataktpList=[]
    let ktpLabel=[
      "Provinsi",
      "Kabupaten",
      "NIK",
      "Nama",
      "Tempat/Tgl Lahir",
      "Jenis Kelamin",
      "Alamat",
      "RT/RW",
      "Kel/Desa",
      "Kecamatan"
    ]
  //for local image
  let imagepath= 'C:/Users/desya/Desktop/Sembarang/ktp.jpeg'
  //example for local nestjs image
  // let imagepath= './src/images/ktp2.jpeg'
  // Imports the Google Cloud client library

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: 'C:/Users/desya/Downloads/virtus-platform-2be1302457ca.json'
  });

  // Performs label detection on the image file
  client.labelDetection(imagepath).then((results)=>{
    const labels = results[0].labelAnnotations;
    console.log(labels.filter(label => label.score > 0.8 && label.description=='Identity document'))
  });

  // client.textDetection(imagepath).then((results)=>{
  //   const labels = results[0].textAnnotations;
  //   console.log(labels[0].description
  //   );
  // });
  
 return client.textDetection(imagepath).then(results=>{
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
    .replace("Kecamatan ","")
    .replace("Kecamatan :","")
    .replace("Jenis Kelamin","")
    .replace("LAKI LAKI","LAKI-LAKI")
    // .replace("RT/RW","")
    // .replace("Kel/Desa","")
    // .replace("Agama","")
    // .replace("Status Perkawinan BELUM KAWIN","BELUM KAWIN")
    // .replace("Pekerjaan","")
    // .replace("Kewarganegaraan ","")
    // .replace("Berlaku Hingga","")
    // .replace("Gol. Darah :","")
    // .replace("Gol Darah","")
    // .replace("Status Perkawinan: ","")
    // .replace("Ke varganegaraan: ","")
    // .replace("Kewarganegaraan: ","") 
    .replace(":","")
    .replace(":","")
    .replace(":","")
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
        array.push(element);
      }
    });
    // cek jika tempat tangal lahir terpisah
    array.forEach((element, index)=>{
      if(index == 5){
        if(element.length >=10){
          console.log(element)
          let temp = array[4].concat(", ").concat(array[5].replace(" ","-"))
          // console.log("gabungan",temp)
          array.splice(4, 0, temp);
          array.splice(6,1)
          array.splice(5,1)
        } else{
          array.splice(5,1)
        }
      }
    })

    for(let i = 0; i < ktpLabel.length; i++){
      arrayKtp[ktpLabel[i]]=array[i]
      // console.log(arrayKtp)
    }

    dataktpList.push(arrayKtp);
    return dataktpList;
  });
  }
}
