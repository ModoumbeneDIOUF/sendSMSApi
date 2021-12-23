EndPoint: /sendSMS

Parameters for sending the request are: 
        => ISOCode
        => recipient_phone_number whitout prefix + or 00   



NB: 
    Your ISOCode must be like this:
        SEN for Senegal, 
        GIN for Guinea , 
        GMB for Gambia, 
        MLI for Mali
        BFA for Burkina Faso



Orange API post method:
    To send an SMS to {{recipient_phone_number}}, you must simply use your {{access_token}}, 
    indicate your {{dev_phone_number}} as senderAddress in the body of the request and at the url level with your country code but without prefix + or 00.


    curl -X POST -H "Authorization: Bearer {{access_token}}" \
    -H "Content-Type: application/json" \
    -d '{"outboundSMSMessageRequest":{ \
            "address": "tel:+{{recipient_phone_number}}", \
            "senderAddress":"tel:+{{dev_phone_number}}", \
            "outboundSMSTextMessage":{ \
                "message": "Hello!" \
            } \
        } \
    }' \


