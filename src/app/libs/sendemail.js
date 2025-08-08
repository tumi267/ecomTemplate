const isdev=process.env.NEXT_DEV
const baseurl=isdev == 'dev' ? `${process.env.NEXT_NGROK}/api/sendemail`:`${process.env.PUBLIC_URL}/api.sendemail`
const sendEmail = async (to,sub,Content) => {
   await fetch(baseurl, {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           to: to,
           subject: sub,
           htmlContent: Content,
         }),
       });
     
   };

export{sendEmail}