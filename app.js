const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

//when goto localhost:3000, server will send the signup.html to display
app.get("/", function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

//get the data that user typed in the form's fields
app.post("/", function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const emailAddress = req.body.email;

    const data = {
        members:[
            {
                email_address: emailAddress,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                } 
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    // console.log(firstName,lastName,emailAddress);
    
    //https://<dc>.api.mailchimp.com/3.0/lists/{list_id}/members/{subscriber_hash}/notes/{id}
    const url = "https://us10.api.mailchimp.com/3.0/lists/dba30d80d1/"

    const options ={
        method: "POST", //for create/update on API server.
        auth: "phhuy:259a6e275ba26827170ada1852d7a3ca-us10"
    };
    //make a request to Mailchimp API for adding new subcriber
    //handle response from Mailchimp
    const request = https.request(url, options, function(response){
        // console.log(response);
        //handle success/fail cases
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }
        

        response.on("data", function(datas){
            console.log(JSON.parse(datas));
        });
    });

    //send data to MailChimp. if we dont do this, the Mailchimp server will response
    //with code 400 which mean invalidated data
    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req,res){
    res.redirect("/");
    // res.sendFile(__dirname + "/signup.html");
});

app.listen(process.env.PORT || 3000, function(){
    console.log("server is running on port 3000");
});


//api key  259a6e275ba26827170ada1852d7a3ca-us10 for MailChimp
//unique id for audience Huy    dba30d80d1