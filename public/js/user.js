
function createUser(){
	window.location.href='/user/input';
}

function modifyUser(id){
	window.location.href='/user/input?user_id='+id;
}

function removeUser(id){
	window.location.href='/user/remove?user_id='+id;
}

function gotoList(){
	window.location.href='/user/list';
}