/**
 *@NApiVersion 2.x
 *@NScriptType UserEventScript
 */
define(['N/record', 'N/email', 'N/render'], function(record, email, render) {
    
    function afterSubmit(context) {
        if (context.type === context.UserEventType.CREATE){
            var invRec = context.newRecord;

            var email_recipients = invRec.getValue('email');

            if(email_recipients){
                var transactionId = invRec.id; 

                var transactionFile = render.transaction({
                    entityId: parseInt(transactionId),
                    printMode: render.PrintMode.PDF,
                    inCustLocale: true
                });

                var mergeResult = render.mergeEmail({
                    templateId: 9,
                    entity: null,
                    recipient: null,
                    supportCaseId: null, 
                    transactionId: parseInt(transactionId),
                    customRecord: null
                });

                var emailSubject = mergeResult.subject; 
                var emailBody = mergeResult.body; 

                email.send({
                    author : 112215, 
                    recipients : email_recipients.split(','), 
                    cc : [112215],
                    subject : emailSubject, 
                    body : emailBody, 
                    attachments: [transactionFile],
                    relatedRecords : {
                        transactionId : parseInt(transactionId)
                    }
                });
            }
        }
        
    }

    return {
        afterSubmit: afterSubmit
    };
});