//var http = require("http");
var express = require("express");

const bodyParser = require('body-parser');
//const db = require('./postgres');
var cors = require('cors');
const fs = require('fs');
var http = require('http');
const csv = require('csv-parser');
const PORT=3000;

var app = express();
app.use(bodyParser.urlencoded({ extended: false}));

app.use(cors());

//app.use(upload);
var GV_RES = null;
var GV_DATA=[];

fs.createReadStream('out.csv')
  .pipe(csv())
  .on('data', (row) => {
	  GV_DATA.push(row)
    console.log(row);
  })
  .on('end', () => {
    console.log("data loaded");;
});

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

app.get("/",  (req, res) =>
{
	res.send(GV_DATA);
});

app.get("/uploadForm",  (req, res) =>{
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="fileupload" method="post" target="sub" enctype="multipart/form-data">');
    res.write('<input type="text" name="id" value="0"><br>');    
    res.write('<input type="file" name="filetoupload"><br>');
    res.write('<input type="submit">');
    res.write('</form><iframe id="sub" name="sub"/>');
    res.end();
});
app.get("/addForm",  (req, res) =>{
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<form action="postData" method="post" target="sub">');
    res.write('<input type="text" name="name" placeholder="name"/><br>');
	res.write('<input type="text" name="surname"  placeholder="surname"/><br>');   
	res.write('<input type="text" name="age" placeholder="age"/><br>');  
  	res.write('<input type="text" name="gender" placeholder="gender"/><br>');   
    res.write('<input type="submit">');
    res.write('</form><iframe id="sub" name="sub"/>');
    res.end();
});
//[{"Name":"John","Surname":"Snow","Age":"26","Gender":"M"}
// addData/Test/Bob/33/M
app.get("/addData/:oX/:oY",async (req, res) =>{
	const oX = req.params.oX;
	const oY = req.params.oY;
	const row = {"originX":oX,"originY":oY}
	GV_DATA.push (row);

	console.log(GV_DATA);
	 const csvWriter = await createCsvWriter({
		path: 'out.csv',
		  header: [
			{id: 'originX', title: 'originX'},
			{id: 'originY', title: 'originY'},
		]
	});
	//fs.unlinkSync("out.csv");
	csvWriter
		.writeRecords(GV_DATA)
	.then(()=> {
		
		console.log('The CSV file was written successfully')
	});
	
	res.send(GV_DATA);
});
app.post("/postData",async (req, res) =>{
	const fn = req.body.name;
	const sn = req.body.surname;
	const age = req.body.age;
	const gender = req.body.gender;
	const row = {"name":fn,"surname":sn,"age":age,"gender":gender}
	console.log(row);
	
	GV_DATA.push (row);

	console.log(GV_DATA);
	 const csvWriter = await createCsvWriter({
		path: 'out.csv',
		  header: [
			{id: 'originX', title: 'originX'},
			{id: 'originY', title: 'orginY'},
			{id: 'destinationX', title: 'destinationX'},
			{id: 'destinationY', title: 'destinationY'},
		]
	});
	//fs.unlinkSync("out.csv");
	csvWriter
		.writeRecords(GV_DATA)
	.then(()=> {
		
		console.log('The CSV file was written successfully')
	});
	
	res.send(GV_DATA);
});
app.post("/fileupload",  async (req, res) => {
    //www.youtube.com/watch?v=SAUvlkTDMM4

    const id = parseInt(req.body.id);
    console.log("upload: "+id);  
console.log (req);	
    const {name, data} = req.files.filetoupload;
    if (id==0)
    {
        const {name, data} = req.files.filetoupload;
        const file = req.files.filetoupload;
        console.log ("name: "+name);
        file.mv('./uploads/' + file.name);
       // await knex.insert({name: name, content: data}).into("uploads");
        console.log("inserted");
        res.end("inserted");
       // res.write("added");
    }else{
        await knex("uploads").update({name: name, content: data}).where({id: id});
      //  res.write("updated");
      console.log("updated");
      res.end("updated");
    }
    
});

app.get("/file", function (req, res)
{
    var fn = req.query.fn;
    var stream = fs.createReadStream(fn);
    stream.pipe(res);

/*
    const content = getFileContents(fn);
    console.log(content);
    res.writeHead(200,{'Content-type':'image/jpg'});
    res.end(content);
    //res.end();
    */
});
app.listen(PORT, ()=>{
	console.log ("ok on port "+PORT);
});

function getFileContents(fileName)
{
    console.log("get file: "+fileName);
    var fs = require('fs');
    return fs.readFileSync(fileName, 'utf8');
}
