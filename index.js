var mysql=require('mysql');
var express=require('express');
var bodyParser = require('body-parser')
var multer  = require('multer')
const db=require('monk')('localhost:27017/supriya')

//console.log(db);

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '/tmp/my-uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname)
  }
})

var upload = multer({ storage: storage })


var app=express();
app.use(bodyParser.urlencoded({ extended: false }))

var conn=mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'',
	database:'userdetails'
})

//app.set('view engine','ejs')
app.set('view engine','pug')

app.get("/",function(req,res){
	//res.end("INDEX ROUTE")
	res.render('index')

})

app.get("/insert",function(req,res){
	conn.query("insert into userinfo (name,password,age) values ('Archana',67891,25)",function(error,results,filds){
		if(!error)
		{
			res.end("Inserted")
		}
		else
		{
			console.log(error);
		}
	})
})

app.get("/delete",function(req,res){
	conn.query("delete from userinfo where id=2",function(error,results,filds){
		if(!error)
		{
			res.end("deleted")
		}
		else
		{
			console.log(error);
		}
	})
})

app.get("/select",function(req,res){
	conn.query("select * from userinfo",function(error,results,filds){
		if(!error)
		{
			res.end("selected")
		}
		else
		{
			console.log(error);
		}
	})
})



app.get("/update",function(req,res){
	conn.query("update userinfo set password=123456 where id=1",function(error,results,filds){
		if(!error)
		{
			res.end("update")
		}
		else
		{
			console.log(error);
		}
	})
})


app.get("/form",function(req,res){
	res.render ('formdata')
})

app.post("/actionPage",function(req,res){
	//console.log("TEST");
	//console.log(req.body);

	data1=req.body.x1;
	data2=req.body.x2;
	data3=req.body.x3;

		conn.query("insert into userinfo (name,password,age) values ('"+data1+"','"+data2+"','"+data3+"')",function(error,results,filds){
		if(!error)
		{
			res.end("Record Added")
		}
		else
		{
			console.log(error);
		}
	})



})

app.get("/show",function(req,res){

	conn.query("select * from userinfo",function(error,results,filds){
		if(!error)
		{
			res.render('showdata',{dbRecord:results})
		}
		else
		{
			console.log(error);
		}
	})
})

app.get("/deleteData/:id",function(req,res){
	xyz=req.params.id;
	conn.query("delete from userinfo where id="+xyz,function(error,results,filds){
		if(!error)
		{
			res.redirect("/show")
		}
		else
		{
			console.log(error);
		}
	})
})

app.get("/editData/:id",function(req,res){
	conn.query("select * from userinfo where id="+req.params.id,function(error,results,filds){
		if(!error)
		{
			res.render('editpage',{dbRecord:results[0]})
		}
		else
		{
			console.log(error);
		}
	})

})

app.post("/updateactionPage",function(req,res){
	console.log(req.body);
	data1=req.body.x1;
	data2=req.body.x2;
	data3=req.body.x3;
	id=req.body.x4;
	conn.query("update userinfo set name='"+data1+"',password='"+data2+"',age='"+data3+"' where id="+id+"",function(error,results,filds){
		if(!error)
		{
			res.redirect("/show")
		}
		else
		{
			console.log(error);
		}
	})

})

app.get("/form1",function(req,res){
	res.render('formdata1')
})

app.post("/actionPage1",upload.single('x3'),function(req,res){
	console.log(req.body);
	console.log(req.file);
})
app.get("/selectm",function(req,res){
	db.get("userinfo").find({}).then(function(results){
		if(results)
		{
			
			res.render("showm",{allrecord:results})
			
		}
		
	})
	//res.render("showm")
})

app.post("/actionPage2",function(req,res){
	//console.log(req.body);
	db.get("userinfo").insert(req.body).then(function(results){
		if(results)
		{
			
			res.redirect("/selectm")
			
		}
		
	})
})

app.get("/deleteDatam/:id",function(req,res){
	xyz=req.params.id;
	//console.log(xyz);
	db.get("userinfo").remove({"_id":xyz}).then(function(results){
		if(results)
		{
			
			res.redirect("/selectm")
			
		}
		
	})
})

app.get("/editDatam/:id",function(req,res){
	db.get("userinfo").find({"_id":req.params.id}).then(function(results){
		if(results)
		{
			//console.log(results);
			res.render("editpagem",{allrecord:results[0]})
			
		}
		
	})

})

app.post("/updateactionPagem",function(req,res){
	//console.log(req.body);
	
	id=req.body.x4;
	delete req.body.x4;
	//console.log(req.body);
	//console.log(id);
	db.get("userinfo").update({"_id":id},{$set:req.body}).then(function(results){
		if(results)
		{
			//console.log(results);
			res.redirect("/selectm")
			
		}
		
	 })

})
app.listen(3000);