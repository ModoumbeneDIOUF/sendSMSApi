const express = require("express");
const req = require("express/lib/request");
const app = express();

const request = require("request-promise");

require("dotenv").config();

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

//You must post an ISOCode like SEN for Senegal, GIN for Guinea , GMB for Gambia, SLE for Sierra Leone, LBR Liberia


app.post("/sendSMS", (req, res) => {

  
  
  // if ISOCode and recipient_phone_number  existe
  if (req.body.isoCode && req.body.recipient_phone_number) {
    var recipient_phone_number = "";
    var dev_phone_number = "";
    var message = "";

    // if ISOCode code is for Senegal
    if (req.body.isoCode.toUpperCase() == "SEN") {
      recipient_phone_number = req.body.recipient_phone_number;
      //dev_phone_number = "224628595328";
      message = "Hello from nafa SENEGAL";
      
    }
    // if ISOCode code is for Gambia
    else if (req.body.isoCode.toUpperCase() == "GMB") {
      recipient_phone_number = req.body.recipient_phone_number;
      dev_phone_number = "224628595328";
      message = "Hello from nafa Gambia";
    }

    // if ISOCode code is for Guinee
    else if (req.body.isoCode.toUpperCase() == "GIN") {
      recipient_phone_number = "tel:+224" + req.body.recipient_phone_number;
      dev_phone_number = "224628595328";
      message = "Hello from nafa GUINEE";
    }

    // if ISOCode code is for Sierra Leone
    else if (req.body.isoCode.toUpperCase() == "MLI") {
      recipient_phone_number = "tel:+223" + req.body.recipient_phone_number;
      dev_phone_number = "224628595328";
      message = "Hello from nafa MALI";
    }
    // if ISOCode code is for Liberia
    else if (req.body.isoCode.toUpperCase() == "BFA") {
      recipient_phone_number = "tel:+226" + req.body.recipient_phone_number;
      dev_phone_number = "224628595328";
      message = "Hello from nafa Burkina Faso";
    }

    // if ISOCode code is empty
    else if (req.body.isoCode == "" || req.body.isoCode.length != 3) {
       return res.status(200).json("Invalide ISOCode");
    }
    console.log(recipient_phone_number);


    // here we call apiu
    
     //check if country is  senegal and call expresso api
     if(req.body.isoCode.toUpperCase() == "SEN"){
      request.post('http://41.219.0.108/api-sms-smpp/sms/send', {
        form: {
          sms_from: 'Nafa',
          sms_to: recipient_phone_number,
          sms_text:message,
          signature:process.env.SIGNATURE
        }
      }).then(function (response){

        const obj = JSON.parse(response);

        const status = obj.Results.status_code

        if(status == 201){
          
          //return res.status(201).send(obj.Results.sms_status);
          return res.status(201).send("SMS not sent!");
        }
        else{

          //return res.status(200).send(obj.Results.sms_status);
          
          return res.status(200).send("SMS sent successfully !");
        }
        
        
    })
    .catch(function (err) {
        console.log(err.status_code);
    })
    }
    
    
    else if(req.body.isoCode.toUpperCase() == "GMB"){
      request.post('https://esme.africell.gm:5991/api/sendsms', {
        form: {
          sender: 'Nafa',
          msisdn: recipient_phone_number,
          sms_text:message,
          
          }
      }).then(function (response){
          console.log(response);
          //err.statusCode == 403
       return res.status(200).send(response);
    })
    .catch(function (err) {
        console.log(err);
    })
    }

      //check if country is not senegal or Gambie and call orange api
    else if (req.body.isoCode.toUpperCase() == "GIN"){
    
      console.log(req.body.recipient_phone_number.length);

      if(req.body.recipient_phone_number.length == 9 ){

        const body = JSON.stringify({
          outboundSMSMessageRequest: {
            address: recipient_phone_number,
            senderAddress: "tel:+" + dev_phone_number,
            outboundSMSTextMessage: { message: message },
            senderName: "Nafa",
          },
        });
        request.post('https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B' + dev_phone_number +'/requests', {
  
          headers: {
             'Authorization': 'Bearer '+process.env.TOKEN,
             'Content-Type':'application/json',
           },
  
           body:body
  
          }).then(function (response){
            
             //const obj = JSON.parse(response);
              console.log(obj);
  
              return res.status(200).send(JSON.parse(response));
        })
        .catch(function (err) {
           console.log(req.body.recipient_phone_number);
            console.log(err);
  
            if(err.statusCode == 403){
             return res.status(403).send("No contract found for the given country");
            }
            else{
             return res.status(200).send(err.message);
            }
  
        })
      }
      else{

        return res.status(201).send("SMS not sent!");
      }
     
    }

    
  }

  // if ISOCode not existe
  else {
    //return res.status(200).json('No ISOCode');
    return res.status(404).json("ISOCode or recipient_phone_number not found");
  }

  console.log(req.body.isoCode);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
