var videos = ["media/cat1.webm", "media/cat2.webm", "media/cat3.webm", "media/cat4.webm"]; //vector ce contine sursele videoclipurilor de baza

//functie de genereaza videoclipul principal
function mainvideo(src){
	var video = document.createElement("video"); 
	video.controls=true; 
	video.autoplay=true; 
	video.id="mainvideo"; 
	var source = document.createElement("source"); 
	source.type = "video/webm"; 
	source.src = src; 
	video.appendChild(source);

	//daca elementul video exista deja	
	if(document.getElementById("mainvideo")){
		document.getElementById('mainvideo').removeEventListener('ended',autonext);	
	}
	document.getElementById("video").innerHTML='';
	document.getElementById("video").appendChild(video);
	document.getElementById('mainvideo').addEventListener('ended',autonext);
}

//functie de adaugare a unui videoclip in playlist
function addtoplaylist(src, currentvideo){
	var div = document.createElement("div"); 
	div.setAttribute("class", "playlistvid"); 
	var video = document.createElement("video");

	//daca exista un videoclip selectat spre rulare
	if(currentvideo!=0){
		video.setAttribute("class", "selected") 
	}
	video.setAttribute("onClick", "changevideo(this)") 
	var source = document.createElement("source"); 
	source.type = "video/webm"; 
	source.src = src; 
	video.appendChild(source);
	div.appendChild(video);
	
	var x=document.createElement("span"); //se creaza butonul de x (pentru stergere)
	x.innerHTML="x";
	x.setAttribute("onClick", "deletevideo(this.previousSibling)"); 
	x.setAttribute("title", "Sterge Video");
	x.setAttribute("id", "delvideo");
	div.appendChild(x);
	
	var input=document.createElement("input"); //se creeaza input-ul ce va contine numarul de ordine in playlist
	input.type="number";
	input.min=1;
	input.value=videos.indexOf(src)+1;
	input.setAttribute("onChange", "changeorder(this)");
	div.appendChild(input);
	document.getElementById("playlist").appendChild(div);
}
//functie de initializare a playlist-ului
function initplaylist(videos, currentvideo){
	document.getElementById("playlist").innerHTML='';
	for(var i=0;i<videos.length;i++){
		
		if(videos[i]==currentvideo){
			addtoplaylist(videos[i], currentvideo) //se genereaza videoclipul in playlist
		}
		
		else{
			addtoplaylist(videos[i], 0);//se genereaza videoclipul in playlist	
		}	
	}
}
mainvideo(videos[0]); //se initializeaza videoclipul principal (la incarcarea paginii)
initplaylist(videos, videos[0]); //se initializeaza playlist-ul (la incarcarea paginii)

//functie de deselectare a tuturor videoclipurilor din playlist
function deselectallvids(){
	var playlistv=document.getElementById("playlist").children;
	
	for(var i=0;i<playlistv.length;i++){
		playlistv[i].children[0].classList.remove("selected");
	}
}

//functia pentru next video
function nv(src){
	var index = videos.indexOf(src); 
	if(videos[index+1]){
		var nv=videos[index+1] 
	}

	else{
		var nv=videos[0];
	}
	deselectallvids();
	document.querySelector('source[src="'+nv+'"]').parentNode.setAttribute("class", "selected");
	mainvideo(nv);
}

//functie de prev video (nu este folosita, dar exista totusi)
function pv(src){
	var index = videos.indexOf(src);
	if(videos[index-1]){
		var pv=videos[index-1] 
	}
	
	else{
		var pv=videos[videos.length-1];
	}
	deselectallvids();
	document.querySelectorAll('source[src="'+pv+'"]').parentElement.setAttribute("class", "selected");
	mainvideo(pv);
}
//functie de stergere a unui videoclip din playlist
function deletevideo(elem){
	var src=elem.children[0].getAttribute("src"); 
	var index = videos.indexOf(src);

	if(elem.classList.contains("selected")){

		if (videos.length>1) {
			nv(src);
		}
	}
	//daca nu este ultimul videoclip
	if (videos.length>1) {
		videos.splice(index, 1);
		elem.parentNode.remove();
		var selectedvideo=document.querySelector("video[class='selected']").children[0].getAttribute("src");
		initplaylist(videos, selectedvideo);
		
		if(videos.length==1){
			document.getElementById("delvideo").style.visibility="hidden";
		}
	}
}

//functie de schimbare a videoclipului principal
function changevideo(elem){
	var src=elem.children[0].getAttribute("src"); 
	deselectallvids();
	elem.setAttribute("class", "selected");
	mainvideo(src);
}

//selectarea butonului de incarcare
document.querySelector("input[type=file]")
.onchange = function(event) {
	
	if(videos.length==1){
		document.getElementById("delvideo").style.visibility="visible";
	}
	
  	var file = event.target.files[0];
  	var src = URL.createObjectURL(file);
	videos.push(src); 
  	addtoplaylist(src, 0);
	var playlist=document.getElementById("playlist");
	playlist.scrollTop = playlist.scrollHeight;
	var newvid=playlist.children[playlist.children.length-1].children[0];
	newvid.setAttribute("class", "added"); 

	setTimeout(function(){
		newvid.classList.remove("added");
	}, 1000);
}
//functie de schimbare a ordinii in playlist
function changeorder(input){
	var src=input.parentNode.children[0].children[0].getAttribute("src");
	var newpos=input.value;
	if(newpos>videos.length){
		newpos=videos.length;
	}
	
	if(newpos<1){
		newpos=1
	}
	var currpos = videos.indexOf(src);
	var v=videos[currpos]; 
	videos[currpos]=videos[newpos-1] 
	videos[newpos-1]=v;
	var selectedvideo=document.querySelector("video[class='selected']").children[0].getAttribute("src");
	initplaylist(videos, selectedvideo);
}
//functia de trecere automata la urmatorul videoclip
function autonext() {
    nv(this.children[0].getAttribute("src"));
}

//functie de desenare pe canvas
function Canvas(){

	var video=document.getElementById("mainvideo");
	var canvas=document.getElementById("canvas");
	var context=canvas.getContext("2d");
	var w=canvas.width=video.clientWidth;
	var h=canvas.height=video.clientHeight;
	context.drawImage (video,0,0,w,h);

	//pozitie mouse pentru Play
	var desen={x:21, y:372};
    var posmouse={x:30, y:381};
    var posinPatrat={x:21, y:372};
	
	//evenimentul de click pe controalele din canvas
	canvas.onclick=function(e){
		pos=canvas.getBoundingClientRect();
		posmouse.x=e.clientX-pos.x;
		posmouse.y=e.clientY-pos.y;

		if(e.button==0 && posmouse.x>desen.x && posmouse.x<desen.x+32
		&& posmouse.y>desen.y && posmouse.y<desen.y+32){

			
			posinPatrat.x=posmouse.x-desen.x;
			posinPatrat.y=posmouse.y-desen.y;
			video.play();

		}

		pos2=canvas.getBoundingClientRect();
		posmouse2.x=e.clientX-pos2.x;
		posmouse2.y=e.clientY-pos2.y;

		if(e.button==0 && posmouse2.x>desen2.x && posmouse2.x<desen2.x+32
		&& posmouse2.y>desen2.y && posmouse2.y<desen2.y+32){

			
			posinPatrat2.x=posmouse2.x-desen2.x;
			posinPatrat2.y=posmouse2.y-desen2.y;
			video.pause();

		}

        /*pozitie3=canvas.getBoundingClientRect();
		pozitiemouse3.x=e.clientX-pozitie3.x;
		pozitiemouse3.y=e.clientY-pozitie3.y;

		if(e.button==0 && pozitiemouse3.x>desen3.x && pozitiemouse3.x<desen3.x+32
		&& pozitiemouse3.y>desen3.y && pozitiemouse3.y<desen3.y+32){

			anim3=true;
			pozitieinPatrat3.x=pozitiemouse3.x-desen3.x;
			pozitieinPatrat3.y=pozitiemouse3.y-desen.y;
			pv(video.src);

		}
		*/
	}

	//desen PLAY BTN
	context.fillStyle="rgba(255, 255, 255, 0.5)";
	context.beginPath();
	context.moveTo(25, 375);  
	context.lineTo(25, 400); 
	context.lineTo(50, 387.5);
	context.fill();

	//contur PLAY BTN
	context.strokeStyle="rgba(255, 255, 255, 0.5)";
	context.strokeRect(21, 372, 32, 32);
	
	//desen PAUSE BTN
    context.beginPath();
    context.rect(67, 374, 5, 26);
	context.fill();

	context.beginPath();
    context.rect(75, 374, 5, 26);
	context.fill();

	//contur PAUSE BTN
	context.strokeRect(58, 372, 32, 32);

	//pozitie mouse pt pause
	var desen2={x:58, y:372};
    var posmouse2={x:67, y:375};
    var posinPatrat2={x:58, y:372};


	//desen PREV BTN
	/*
	context.beginPath();
    context.moveTo(98, 388);
    context.lineTo(120, 402);
    context.lineTo(120, 377);
	context.fill();
	
	//contur PREV BTN
	context.strokeRect(95, 372, 32, 32);

	//pozitie mouse pt prev
	var desen3={x:98, y:372};
    var pozitiemouse3={x:105, y:375};
    var pozitieinPatrat3={x:98, y:372};
	var anim3=false;*/
}
window.setInterval(Canvas, 40);

//punere filtru alb negru pe video
/*
function filtru(){
	var video=document.getElementById("mainvideo");
	var canvas=document.getElementById("canvas");
	var context=canvas.getContext("2d");
	    var H=canvas.height=video.clientHeight;
		var W=canvas.width=video.clientWidth;
		context.drawImage (video,0,0,W,H);
		
		var imageData=context.getImageData(0,0,W,H);
		for (j=0; j<imageData.height; i++){
      for (i=0; i<imageData.width; j++){
		 var index=(i*4)*imageData.width+(j*4);
		 
         var red=imageData.data[index];
         var green=imageData.data[index+1];
         var blue=imageData.data[index+2];
		 var alpha=imageData.data[index+3];
		 
		 var average=(red+green+blue)/3;
		 
   	     imageData.data[index]=average;
         imageData.data[index+1]=average;
         imageData.data[index+2]=average;
         imageData.data[index+3]=alpha;
       }
	}
	
	context.putImageData(imageData,0,0);
} */var videos = ["media/cat1.webm", "media/cat2.webm", "media/cat3.webm", "media/cat4.webm"]; //vector ce contine sursele videoclipurilor de baza

//functie de genereaza videoclipul principal
function mainvideo(src){
	var video = document.createElement("video"); 
	video.controls=true; 
	video.autoplay=true; 
	video.id="mainvideo"; 
	var source = document.createElement("source"); 
	source.type = "video/webm"; 
	source.src = src; 
	video.appendChild(source);

	//daca elementul video exista deja	
	if(document.getElementById("mainvideo")){
		document.getElementById('mainvideo').removeEventListener('ended',autonext);	
	}
	document.getElementById("video").innerHTML='';
	document.getElementById("video").appendChild(video);
	document.getElementById('mainvideo').addEventListener('ended',autonext);
}

//functie de adaugare a unui videoclip in playlist
function addtoplaylist(src, currentvideo){
	var div = document.createElement("div"); 
	div.setAttribute("class", "playlistvid"); 
	var video = document.createElement("video");

	//daca exista un videoclip selectat spre rulare
	if(currentvideo!=0){
		video.setAttribute("class", "selected") 
	}
	video.setAttribute("onClick", "changevideo(this)") 
	var source = document.createElement("source"); 
	source.type = "video/webm"; 
	source.src = src; 
	video.appendChild(source);
	div.appendChild(video);
	
	var x=document.createElement("span"); //se creaza butonul de x (pentru stergere)
	x.innerHTML="x";
	x.setAttribute("onClick", "deletevideo(this.previousSibling)"); 
	x.setAttribute("title", "Sterge Video");
	x.setAttribute("id", "delvideo");
	div.appendChild(x);
	
	var input=document.createElement("input"); //se creeaza input-ul ce va contine numarul de ordine in playlist
	input.type="number";
	input.min=1;
	input.value=videos.indexOf(src)+1;
	input.setAttribute("onChange", "changeorder(this)");
	div.appendChild(input);
	document.getElementById("playlist").appendChild(div);
}
//functie de initializare a playlist-ului
function initplaylist(videos, currentvideo){
	document.getElementById("playlist").innerHTML='';
	for(var i=0;i<videos.length;i++){
		
		if(videos[i]==currentvideo){
			addtoplaylist(videos[i], currentvideo) //se genereaza videoclipul in playlist
		}
		
		else{
			addtoplaylist(videos[i], 0);//se genereaza videoclipul in playlist	
		}	
	}
}
mainvideo(videos[0]); //se initializeaza videoclipul principal (la incarcarea paginii)
initplaylist(videos, videos[0]); //se initializeaza playlist-ul (la incarcarea paginii)

//functie de deselectare a tuturor videoclipurilor din playlist
function deselectallvids(){
	var playlistv=document.getElementById("playlist").children;
	
	for(var i=0;i<playlistv.length;i++){
		playlistv[i].children[0].classList.remove("selected");
	}
}

//functia pentru next video
function nv(src){
	var index = videos.indexOf(src); 
	if(videos[index+1]){
		var nv=videos[index+1] 
	}

	else{
		var nv=videos[0];
	}
	deselectallvids();
	document.querySelector('source[src="'+nv+'"]').parentNode.setAttribute("class", "selected");
	mainvideo(nv);
}

//functie de prev video (nu este folosita, dar exista totusi)
function pv(src){
	var index = videos.indexOf(src);
	if(videos[index-1]){
		var pv=videos[index-1] 
	}
	
	else{
		var pv=videos[videos.length-1];
	}
	deselectallvids();
	document.querySelectorAll('source[src="'+pv+'"]').parentElement.setAttribute("class", "selected");
	mainvideo(pv);
}
//functie de stergere a unui videoclip din playlist
function deletevideo(elem){
	var src=elem.children[0].getAttribute("src"); 
	var index = videos.indexOf(src);

	if(elem.classList.contains("selected")){

		if (videos.length>1) {
			nv(src);
		}
	}
	//daca nu este ultimul videoclip
	if (videos.length>1) {
		videos.splice(index, 1);
		elem.parentNode.remove();
		var selectedvideo=document.querySelector("video[class='selected']").children[0].getAttribute("src");
		initplaylist(videos, selectedvideo);
		
		if(videos.length==1){
			document.getElementById("delvideo").style.visibility="hidden";
		}
	}
}

//functie de schimbare a videoclipului principal
function changevideo(elem){
	var src=elem.children[0].getAttribute("src"); 
	deselectallvids();
	elem.setAttribute("class", "selected");
	mainvideo(src);
}

//selectarea butonului de incarcare
document.querySelector("input[type=file]")
.onchange = function(event) {
	
	if(videos.length==1){
		document.getElementById("delvideo").style.visibility="visible";
	}
	
  	var file = event.target.files[0];
  	var src = URL.createObjectURL(file);
	videos.push(src); 
  	addtoplaylist(src, 0);
	var playlist=document.getElementById("playlist");
	playlist.scrollTop = playlist.scrollHeight;
	var newvid=playlist.children[playlist.children.length-1].children[0];
	newvid.setAttribute("class", "added"); 

	setTimeout(function(){
		newvid.classList.remove("added");
	}, 1000);
}
//functie de schimbare a ordinii in playlist
function changeorder(input){
	var src=input.parentNode.children[0].children[0].getAttribute("src");
	var newpos=input.value;
	if(newpos>videos.length){
		newpos=videos.length;
	}
	
	if(newpos<1){
		newpos=1
	}
	var currpos = videos.indexOf(src);
	var v=videos[currpos]; 
	videos[currpos]=videos[newpos-1] 
	videos[newpos-1]=v;
	var selectedvideo=document.querySelector("video[class='selected']").children[0].getAttribute("src");
	initplaylist(videos, selectedvideo);
}
//functia de trecere automata la urmatorul videoclip
function autonext() {
    nv(this.children[0].getAttribute("src"));
}

//functie de desenare pe canvas
function Canvas(){

	var video=document.getElementById("mainvideo");
	var canvas=document.getElementById("canvas");
	var context=canvas.getContext("2d");
	var w=canvas.width=video.clientWidth;
	var h=canvas.height=video.clientHeight;
	context.drawImage (video,0,0,w,h);

	//pozitie mouse pentru Play
	var desen={x:21, y:372};
    var posmouse={x:30, y:381};
    var posinPatrat={x:21, y:372};
	
	//evenimentul de click pe controalele din canvas
	canvas.onclick=function(e){
		pos=canvas.getBoundingClientRect();
		posmouse.x=e.clientX-pos.x;
		posmouse.y=e.clientY-pos.y;

		if(e.button==0 && posmouse.x>desen.x && posmouse.x<desen.x+32
		&& posmouse.y>desen.y && posmouse.y<desen.y+32){

			
			posinPatrat.x=posmouse.x-desen.x;
			posinPatrat.y=posmouse.y-desen.y;
			video.play();

		}

		pos2=canvas.getBoundingClientRect();
		posmouse2.x=e.clientX-pos2.x;
		posmouse2.y=e.clientY-pos2.y;

		if(e.button==0 && posmouse2.x>desen2.x && posmouse2.x<desen2.x+32
		&& posmouse2.y>desen2.y && posmouse2.y<desen2.y+32){

			
			posinPatrat2.x=posmouse2.x-desen2.x;
			posinPatrat2.y=posmouse2.y-desen2.y;
			video.pause();

		}

        /*pozitie3=canvas.getBoundingClientRect();
		pozitiemouse3.x=e.clientX-pozitie3.x;
		pozitiemouse3.y=e.clientY-pozitie3.y;

		if(e.button==0 && pozitiemouse3.x>desen3.x && pozitiemouse3.x<desen3.x+32
		&& pozitiemouse3.y>desen3.y && pozitiemouse3.y<desen3.y+32){

			anim3=true;
			pozitieinPatrat3.x=pozitiemouse3.x-desen3.x;
			pozitieinPatrat3.y=pozitiemouse3.y-desen.y;
			pv(video.src);

		}
		*/
	}

	//desen PLAY BTN
	context.fillStyle="rgba(255, 255, 255, 0.5)";
	context.beginPath();
	context.moveTo(25, 375);  
	context.lineTo(25, 400); 
	context.lineTo(50, 387.5);
	context.fill();

	//contur PLAY BTN
	context.strokeStyle="rgba(255, 255, 255, 0.5)";
	context.strokeRect(21, 372, 32, 32);
	
	//desen PAUSE BTN
    context.beginPath();
    context.rect(67, 374, 5, 26);
	context.fill();

	context.beginPath();
    context.rect(75, 374, 5, 26);
	context.fill();

	//contur PAUSE BTN
	context.strokeRect(58, 372, 32, 32);

	//pozitie mouse pt pause
	var desen2={x:58, y:372};
    var posmouse2={x:67, y:375};
    var posinPatrat2={x:58, y:372};


	//desen PREV BTN
	/*
	context.beginPath();
    context.moveTo(98, 388);
    context.lineTo(120, 402);
    context.lineTo(120, 377);
	context.fill();
	
	//contur PREV BTN
	context.strokeRect(95, 372, 32, 32);

	//pozitie mouse pt prev
	var desen3={x:98, y:372};
    var pozitiemouse3={x:105, y:375};
    var pozitieinPatrat3={x:98, y:372};
	var anim3=false;*/
}
window.setInterval(Canvas, 40);

//punere filtru alb negru pe video
/*
function filtru(){
	var video=document.getElementById("mainvideo");
	var canvas=document.getElementById("canvas");
	var context=canvas.getContext("2d");
	    var H=canvas.height=video.clientHeight;
		var W=canvas.width=video.clientWidth;
		context.drawImage (video,0,0,W,H);
		
		var imageData=context.getImageData(0,0,W,H);
		for (j=0; j<imageData.height; i++){
      for (i=0; i<imageData.width; j++){
		 var index=(i*4)*imageData.width+(j*4);
		 
         var red=imageData.data[index];
         var green=imageData.data[index+1];
         var blue=imageData.data[index+2];
		 var alpha=imageData.data[index+3];
		 
		 var average=(red+green+blue)/3;
		 
   	     imageData.data[index]=average;
         imageData.data[index+1]=average;
         imageData.data[index+2]=average;
         imageData.data[index+3]=alpha;
       }
	}
	
	context.putImageData(imageData,0,0);
} */