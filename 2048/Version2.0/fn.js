// 取得随机数
function getRandomNum() {
	var a = Math.floor(16*Math.random());
	var b = Math.floor(16*Math.random());
	if(a === b) {
		getRandomNum();
		return [0,15];
	} else {
		return [a,b,];
	};
	};
//讲数组导入到棋盘
function mapToBoard(){
	for (var i=0;i<16;i++){
		gezi[i].firstChild.nodeValue = map[i];
			gezi[i].classList.remove("hide");
		if(gezi[i].firstChild.nodeValue==0){
			gezi[i].classList.add("hide");
		};
		};
	};
//初始化数组
function resetMap(){
		for (var i=0;i<16;i++){
			map[i]= 0;
		};
	};
function newGames(){
	  resetMap();
	  var num = getRandomNum();
	  map[num[0]] = 2;
	  map[num[1]] = 2;
	  mapToBoard();
	  colorChange();
};
//排序算子
 //down算子
function operator(a,b) {
	if(a==0){
		return -1;
	} else if(a>0&&b==0){
		return 1;
	};
}
   //up
function operatorUp(a,b) {
	if(a==0){
		return 1;
	} else if(a>0&&b==0){
		return -1;
	};
}
//生成新单元格
function born(){
	var collection =new Array();;
	var clen =0;
	for(var i=0;i<16;i++){
		if(map[i]==0) {
			collection.push(i);
			clen++;
		};
	};
	map[collection[Math.floor(clen*Math.random())]]=2;
	mapToBoard();
	};
//核心代码开始
function move(zu,a,b,c){
	if(map[zu[0]+a] === map[zu[1]+a]){
		map[zu[0]+a] = 2*map[zu[0]+a];
		map[zu[1]+a] =0;
	};
	if(map[zu[1]+a] === map[zu[2]+a]){
		map[zu[1]+a] = 2*map[zu[1]+a];
		map[zu[2]+a] = 0;
	};
	if(map[zu[2]+a] === map[zu[3]+a]) {
		map[zu[2]+a] = 2*map[zu[2]+a];
		map[zu[3]+a] = 0;
	};
	var sortArray = new Array(4);
	for (var i=0;i<4;i++) {
		sortArray[i] = map[b*i+a];
	};
		sortArray.sort(c);
	for (var i=0;i<4;i++) {
		map[b*i+a] = sortArray[i];
	};
};

//down
function Cdown(){
	move([12,8,4,0],0,4,operator);
	move([12,8,4,0],1,4,operator);
	move([12,8,4,0],2,4,operator);
	move([12,8,4,0],3,4,operator);
};

//up
function Cup(){
	move([0,4,8,12],0,4,operatorUp);
	move([0,4,8,12],1,4,operatorUp);
	move([0,4,8,12],2,4,operatorUp);
	move([0,4,8,12],3,4,operatorUp);
};
//left
function Cleft(){
	move([0,1,2,3],0,1,operatorUp);
	move([0,1,2,3],4,1,operatorUp);
	move([0,1,2,3],8,1,operatorUp);
	move([0,1,2,3],12,1,operatorUp);
};
//right
function Cright(){
	move([3,2,1,0],0,1,operator);
	move([3,2,1,0],4,1,operator);
	move([3,2,1,0],8,1,operator);
	move([3,2,1,0],12,1,operator);
};
//核心代码结束
//键盘操作
function keyControl(){
	var key = arguments[0].keyCode;
	if(key == 38) {
		Cup();
		mapToBoard();
		born();
		colorChange();
	} else if(key == 40) {
		Cdown();
		mapToBoard();
		born();
		colorChange();
	} else if(key ==37) {
		Cleft();
		mapToBoard();
		born();
		colorChange();
	} else if(key == 39){
		Cright();
		mapToBoard();
		born();
		colorChange();
	} else if(key == 8){
		arguments[0].preventDefault();
		newGames();
		};
	
};
document.addEventListener("keydown",keyControl,false);
//颜色变化
function colorChange(){
	
	for (var i=0;i<16;i++) {
		if (map[i]==8){
			gezi[i].style.backgroundColor = "rgb(242,177,141)";
			gezi[i].style.color = "rgb(249,246,242)";
		} else if(map[i] == 16) {
			gezi[i].style.backgroundColor = "rgb(245,147,99)";
			gezi[i].style.color = "rgb(249,246,242)";
		} else if(map[i] == 32) {
			gezi[i].style.backgroundColor = "rgb(245,127,95)";
			gezi[i].style.color = "rgb(249,246,242)";
		} else if(map[i] == 64) {
			gezi[i].style.backgroundColor = "rgb(245,94,59)";
			gezi[i].style.color = "rgb(249,246,242)";
		} else if(map[i] == 128 ){
			gezi[i].style.backgroundColor = "rgb(205,74,40)";
			gezi[i].style.color = "rgb(205,193,180)";
		} else if(map[i] == 256 ){
			gezi[i].style.backgroundColor = "rgb(205,55,30)";
			gezi[i].style.color = "rgb(205,193,180)";
		} else if(map[i] == 512 ){
			gezi[i].style.backgroundColor = "rgb(205,34,20)";
			gezi[i].style.color = "rgb(205,193,180)";
		} else if(map[i] == 1024 ){
			gezi[i].style.backgroundColor = "rgb(205,24,10)";
			gezi[i].style.color = "rgb(205,193,180)";
		} else if(map[i] >= 2048 ){
			gezi[i].style.backgroundColor = "rgb(205,4,10)";
			gezi[i].style.color = "rgb(205,193,180)";
		} else if(map[i] ==2||map[i] ==4) {
			gezi[i].style.backgroundColor = "rgb(205,193,180)";
			gezi[i].style.color = "rgb(119,110,101)";		
		} else if(map[i]==0) {
			gezi[i].style.backgroundColor = "rgb(205,193,180)";
			gezi[i].style.color = "rgb(205,193,180)";		
		}; 
	};
};
//自动保存
function saveGame(){
	sessionStorage.setItem("map",map);
	};
function loadGame(){
	var save = sessionStorage.map;
	for (var i=0;i<save.length;i+=2) {
		map[i/2] = save[i];
	};
	};
//操作游戏代码
var gezi= document.getElementsByClassName("gezi"),
game = document.getElementById("game"),
map = new Array(16);//数组
resetMap();
//初始化游戏
var newGame = document.getElementById("newGame");
newGame.addEventListener("click",newGames
,false);
newGame.addEventListener("click",colorChange,false);
//手机端
var start = [];
var end = [];
function touch(){
	switch(arguments[0].type){
		case "touchmove":
		var X=[game.offsetLeft,game.offsetLeft+game.offsetWidth],
		Y=[game.offsetTop,game.offsetTop+game.offsetHeight];
		if((arguments[0].touches[0].clientX>=X[0])&&(arguments[0].touches[0].clientX<=X[1])&&(arguments[0].touches[0].clientY>=Y[0])&&(arguments[0].touches[0].clientY<Y[1])){
			arguments[0].preventDefault();
		}
			break;
		case "touchstart":
			start = [arguments[0].touches[0].clientX,arguments[0].touches[0].clientY]
			break;
		case "touchend":
			end = [arguments[0].changedTouches[0].clientX,arguments[0].changedTouches[0].clientY]
			var point = {
				X:end[0]-start[0],
				Y:end[1]-start[1]
				};
			if((point.X>0)&&(point.Y>=0)&&((point.Y/point.X)<=1))
			{
				Cright();
				mapToBoard();
				born();
				colorChange();
			} 
			else 
			if(point.X>0&&point.Y>0&&((point.Y/point.X)>1))
			{
				Cdown();
				mapToBoard();
				born();
				colorChange();
			}
			else 
			if(point.X<=0&&point.Y>0&&((point.Y/point.X)<=-1))
			{
				Cdown();
				mapToBoard();
				born();
				colorChange();
			}
			else
			if(point.X<0&&point.Y>0&&((point.Y/point.X)>-1))
			{
				Cleft();
				mapToBoard();
				born();
				colorChange();
			}
			else
			if(point.X<0&&point.Y<=0&&((point.Y/point.X)<=1))
			{
				Cleft();
				mapToBoard();
				born();
				colorChange();
			}
			else
			if(point.X<=0&&point.Y<0&&((point.Y/point.X)>1))
			{
				Cup();
				mapToBoard();
				born();
				colorChange();
			}
			else
			if(point.X>0&&point.Y<0&&((point.Y/point.X)<-1))
			{
				Cup();
				mapToBoard();
				born();
				colorChange();
			}
			else
			if(point.X>0&&point.Y<0&&((point.Y/point.X)>=-1))
			{
				Cright();
				mapToBoard();
				born();
				colorChange();
			}
			break;
	};
};
//摇晃重置游戏
function shake(){
	var X =Math.abs(event.acceleration.x);
	var Y =Math.abs(event.acceleration.y);
	var Z=Math.abs(event.acceleration.z);
	if(X>20||Y>20||Z>20) {
		newGames();
	};	}	
document.addEventListener("touchstart",touch,false);
document.addEventListener("touchend",touch,false);
document.addEventListener("touchmove",touch,false);
window.addEventListener("devicemotion",shake,false);
	
	