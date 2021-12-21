import { Injectable } from '@nestjs/common';
import { isEmpty } from 'rxjs';
var moment = require('moment');
const vision = require('@google-cloud/vision');
const language = require('@google-cloud/language');
const {Translate} = require('@google-cloud/translate').v2;
const {DocumentProcessorServiceClient} =require('@google-cloud/documentai').v1;

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
      "Kecamatan",
      "Agama",
      "Status Perkawinan",
      "Kewarganegaraan"
    ]
    let today = new Date();
    let yyyy = today.getFullYear();
  //for local image
  let imagepath= 'C:/Users/desya/Desktop/Sembarang/imgx9.jpg'
  //example for local nestjs image
  // let imagepath= './src/images/ktp2.jpeg'
  // Imports the Google Cloud client library

  // Creates a client
  const client = new vision.ImageAnnotatorClient({
    keyFilename: 'C:/Users/desya/Downloads/virtus-platform-2be1302457ca.json'
  });

  // Imports the Google Cloud client library
  const translate = new Translate({
    keyFilename: 'C:/Users/desya/Downloads/virtus-platform-2be1302457ca.json'
  });

  // // Performs label detection on the image file
  // client.labelDetection(imagepath).then((results)=>{
  //   const labels = results[0].labelAnnotations;
  //   console.log(labels.filter(label => label.score > 0.8 && label.description=='Identity document'))
  // });

 return client.textDetection(imagepath).then(results=>{
    const labels = results[0].textAnnotations;
    // console.log(labels[0])
    labels[0].description
    .replace("Tempat/Tgl Lahir : ","")
    .replace("NIK\n","")
    .replace(": ","")
    .replace("Tempat/Tgl Lahir ","")
    .replace("Nama\n","")
    .replace("Jenis kelamin","")
    .replace("Alamat\n","")
    .replace("PROVINSI ","")
    // .replace("KABUPATEN ","")
    .replace("Kecamatan ","")
    .replace("Kecamatan :","")
    .replace("LAKI LAKI","LAKI-LAKI")
    .replace("RT/RW\n","")
    .replace("Kel/Desa\n","")
    .replace("Jenis Kelamin","")
    // .replace("Status Perkawinan BELUM KAWIN","BELUM KAWIN")
    // .replace("Pekerjaan","")
    .replace("Kewarganegaraan ","")
    // .replace("Berlaku Hingga","")
    // .replace("Gol. Darah :","")
    .replace("Gol Darah\n","")
    .replace("KelDesa\n","")
    .replace("RTRW\n","")
    .replace("Kewarganegaraan: ","") 
    .replace(":","")
    .replace(":","")
    .replace(":","")
    .replace(":","")
    // .replace(", ","")
    .split('\n').forEach((element, index) => {
      if(Number(element.replace(/[^0-9.]/g, '').substr(element.length - 4)))
      {
        let nikCleaning = element.replace(/[^\w\s]/gi,"").replace(" ","")
        let nik = nikCleaning.substr(nikCleaning.length - 16)
        if(Number(nik) && nik.length == 16)
        arrayKtp[ktpLabel[2]]=nik
      }

      if(Number(element.substr(element.length - 4))){
        // console.log(element, "filter 11111")
        let tglCleaning= element.replace(" ","-").replace(" ","").replace(".","")
        let tgl= tglCleaning.substr(tglCleaning.length - 10)
        if(moment(tgl, "DD-MM-YYYY", true).isValid()){
          console.log(tgl, "filter 22222")
          if(yyyy-tgl.substr(tgl.length - 4) >=16){
            arrayKtp[ktpLabel[4]]=tgl
          }
        }
      }

      if(Number(element.replace(/[^0-9.]/g, ''))){
        if(element.replace(/[^0-9.]/g, '').length==6){
          let rtrwCleaning = element.replace(" ","").replace(" ","").replace(":","")
          arrayKtp[ktpLabel[7]] = rtrwCleaning
        }
      }

      if(element.includes("LAKI")){
        arrayKtp[ktpLabel[5]]= "LAKI-LAKI"
      }
      if(element.includes("PEREMPUAN")){
        arrayKtp[ktpLabel[5]]= "PEREMPUAN"
      }
      
      if(element.includes("ISLAM")){
        arrayKtp[ktpLabel[10]]="ISLAM"
      }
      if(element.includes("KRISTEN")){
        arrayKtp[ktpLabel[10]]="KRISTEN"
      }
      if(element.includes("KATOLIK")){
        arrayKtp[ktpLabel[10]]="KATOLIK"
      }
      if(element.includes("HINDU")){
        arrayKtp[ktpLabel[10]]="HINDU"
      }
      if(element.includes("BUDHA")){
        arrayKtp[ktpLabel[10]]="BUDHA"
      }
      if(element.includes("KONGHUCU")){
        arrayKtp[ktpLabel[10]]="KONGHUCU"
      }

      if(element.includes("KAWIN")){
        if(element.includes("BELUM KAWIN")){
          arrayKtp[ktpLabel[11]]="BELUM KAWIN"
        }else{
          arrayKtp[ktpLabel[11]]="KAWIN"
        }
      }

      if(element.includes("CERAI")){
        if(element.includes("HIDUP")){
          arrayKtp[ktpLabel[11]]="CERAI HIDUP"
        }else{
          arrayKtp[ktpLabel[11]]="CERAI MATI"
        }
      }

      if(element.includes("WNI")){
        arrayKtp[ktpLabel[12]]="WNI"
      }
      if(element.includes("WNA")){
        arrayKtp[ktpLabel[12]]="WNA"
      }
      
      if(
        index == 0 || index == 1 || index == 2 || index == 3 
        || index == 4 || index == 5 || index == 6 
        // || index == 7 || index == 8 || index == 9 || index == 10
        // || index == 11 || index == 12 
        // || index == 18 || index == 20
        // || index == 21 || index == 24
        ){
        array.push(element);
      }
    });
    // cek jika tempat tangal lahir terpisah
    array.forEach((element, index)=>{
      // console.log(this.cekEntity(element),"dataaaaaaaaa")
      if(index == 5){
        if(element.length >=10){
          let temp = array[4].concat(", ").concat(array[5].replace(" ","-"))
          array.splice(4, 0, temp);
          array.splice(6,1)
          array.splice(5,1)
        } else{
          array.splice(5,1)
        }
      }
    })

    for(let i = 0; i <= 1; i++){
      arrayKtp[ktpLabel[i]]=array[i]
      // console.log(arrayKtp)
    }

    dataktpList.push(arrayKtp);
    return dataktpList;
  });
  }

  googleVisionFaceDetect(){
    let imagepath= 'C:/Users/desya/Desktop/Sembarang/imgx1.jpg'
    //example for local nestjs image
    // let imagepath= './src/images/ktp2.jpeg'
    // Imports the Google Cloud client library

    // Creates a client2
    const client = new vision.ImageAnnotatorClient({
      keyFilename: 'C:/Users/desya/Downloads/virtus-platform-2be1302457ca.json'
    });

    // Performs label detection on the image file
    return client.faceDetection(imagepath).then((results)=>{
      const faces = results[0].faceAnnotations
      console.log(faces);
      if(faces.length==0){
        return "bukan foto selfie"
      }else{
        return faces;
      }
      
    });
  }

  async googleDocumentAI(){
    let filePath= 'C:/Users/desya/Desktop/Sembarang/ktp.pdf'
    const client = new DocumentProcessorServiceClient({
      keyFilename: 'C:/Users/desya/Downloads/virtus-platform-2be1302457ca.json'
    });
let name= "example"
    // Read the file into memory.
  const fs = require('fs').promises;
  const imageFile = await fs.readFile(filePath);

   // Convert the image data to a Buffer and base64 encode it.
   const encodedImage = Buffer.from(imageFile).toString('base64');

   const request = {
     name,
     rawDocument: {
       content: encodedImage,
       mimeType: 'application/pdf',
     },
     
   };
 
   // Recognizes text entities in the PDF document
   const [result] = await client.processDocument(request);
   const {document} = result;
 
   // Get all of the document text as one big string
   const {text} = document;
   // Extract shards from the text field
  const getText = textAnchor => {
    if (!textAnchor.textSegments || textAnchor.textSegments.length === 0) {
      return '';
    }

    // First shard in document doesn't have startIndex property
    const startIndex = textAnchor.textSegments[0].startIndex || 0;
    const endIndex = textAnchor.textSegments[0].endIndex;

    return text.substring(startIndex, endIndex);
  };

  // Read the text recognition output from the processor
  console.log('The document contains the following paragraphs:');
  const [page1] = document.pages;
  const {paragraphs} = page1;
  
  for (const paragraph of paragraphs) {
    const paragraphText = getText(paragraph.layout.textAnchor);
    console.log(`Paragraph text:\n${paragraphText}`);
  }
  }

  googleNLPCekEnitity(){
    let clientNLP = new language.LanguageServiceClient({
      keyFilename: 'C:/Users/desya/Downloads/virtus-platform-2be1302457ca.json'
    });

    let text = this.googleTranslate("Love");
    console.log(text,"textttttttttttt")
    let document = {
      content: text,
      type: 'PLAIN_TEXT',
    };
    return clientNLP.analyzeEntities({document: document}).then(result22=>{
      const Type = result22[0].entities[0].type;
      if(Type == "PERSON"){
        // console.log(result22[0].entities[0].name,"masukkkkkkkkk")
        let data =result22[0].entities[0].name;
        return data
      }else{
        let data =result22[0];
        return data
      }
    })
  }

  googleTranslate(text) {
    // let dataTranslate=[]
    // Imports the Google Cloud client library
    const translate = new Translate({
      keyFilename: 'C:/Users/desya/Downloads/virtus-platform-2be1302457ca.json'
    });
    // const text = 'Hello, world!';
    // The target language
    const target = 'id';

    // Translates some text into Indonesia
    return translate.translate(text, "id").then(results3=>{
      let bahasa = results3[0]
      console.log(bahasa)
      // dataTranslate.push(bahasa)
      return bahasa
    })
    // return dataTranslate;
  }
}


// return client.textDetection(imagepath).then(results=>{
//   const labels = results[0].textAnnotations;
//   labels[0].description
//   .replace("Tempat/Tgl Lahir : ","")
//   .replace("NIK","")
//   .replace(": ","")
//   .replace("Tempat/Tgl Lahir ","")
//   .replace("Nama","")
//   .replace("Jenis kelamin","")
//   .replace("Alamat","")
//   .replace("PROVINSI ","")
//   .replace("KABUPATEN ","")
//   .replace("Kecamatan ","")
//   .replace("Kecamatan :","")
//   .replace("Jenis Kelamin","")
//   .replace("LAKI LAKI","LAKI-LAKI")
//   // .replace("RT/RW","")
//   // .replace("Kel/Desa","")
//   // .replace("Agama","")
//   // .replace("Status Perkawinan BELUM KAWIN","BELUM KAWIN")
//   // .replace("Pekerjaan","")
//   // .replace("Kewarganegaraan ","")
//   // .replace("Berlaku Hingga","")
//   // .replace("Gol. Darah :","")
//   // .replace("Gol Darah","")
//   // .replace("Status Perkawinan: ","")
//   // .replace("Ke varganegaraan: ","")
//   // .replace("Kewarganegaraan: ","") 
//   .replace(":","")
//   .replace(":","")
//   .replace(":","")
//   .replace(":","")
//   // .replace(", ","")
//   .split('\n').forEach((element, index) => {
//     if(
//       index == 0 || index == 1 || index == 3 || index == 5 
//       || index == 6 || index == 7 || index == 8 
//       || index == 9 || index == 10 || index == 11 || index == 16 
//       // || index == 18 || index == 20
//       // || index == 21 || index == 24
//       ){
//       array.push(element);
//     }
//   });
//   // cek jika tempat tangal lahir terpisah
//   array.forEach((element, index)=>{
//     if(index == 5){
//       if(element.length >=10){
//         console.log(element)
//         let temp = array[4].concat(", ").concat(array[5].replace(" ","-"))
//         // console.log("gabungan",temp)
//         array.splice(4, 0, temp);
//         array.splice(6,1)
//         array.splice(5,1)
//       } else{
//         array.splice(5,1)
//       }
//     }
//   })

