//определяем за кого играет пользователь
var choice = src = srcPC = elem = eg = null;
document.getElementById('choice').onclick = function() {
	var tics = document.getElementById('tics');
	var toes = document.getElementById('toes');
	
	if(tics.checked) {
		choice = 'tics';
		src = 'images/x.png';	
		srcPC = 'images/zero.png';
	} else {
		choice = 'toes';
		src = 'images/zero.png';
		srcPC = 'images/x.png';
	}
	
	document.body.querySelector('.choice').style.display = 'none';
	document.body.querySelector('.level').style.display = 'block';
	return false;
}

//определяем уровень игры
var level = null;
document.getElementById('level').onclick = function() {
	var easy = document.getElementById('easy');
	var normal = document.getElementById('normal');
	var difficult = document.getElementById('difficult');
	
	if(easy.checked) {
		level = 'easy';
	} else if(normal.checked) {
		level = 'normal';
	} else {
		level = 'difficult';
	}
	
	document.body.querySelector('.level').style.display = '';
	document.body.querySelector('.sayHello').style.display = 'none';
	
	//если пользователь играет ноликами, то компьютер ходит первым
	if(choice == 'toes') {
		time = true;
		setTimeout(doMove, 500);
	}
	
	return false;
}

//Событие при клике на сетку
var grid = document.getElementById('grid');
var time = false;
grid.onclick = function(e) {
	var target = e ? e.target : window.ivent.srcElement;
	if(target.className != 'cell' || target.children.length || time) return;
	
	addSrc(target, true); //target.innerHTML = '<img src="'+src+'" />';
	target.style.cursor = 'default';
	
	//ставит блокировку следующего хода
	time = true;
	setTimeout(doMove, 500);
};



//шаг компьютера
function doMove() {
	//снимает блокировку следующего хода
	setTimeout(function() {
		time = false;
	}, 10);
	
	/*
		- На простом уровне игра бездумно выбирает клетку
		- На среднем уровне игра будет стараться не проиграть
		- На сложном уровне игра будет стараться победить
	*/
	
	checkEndGame();
	if(eg) return;
		
	switch(level) {
		case'easy' : return easyMove(), checkEndGame();
		default: return ( checkEmpty() || easyMove() ), checkEndGame();
	}
	
	//проверка рискованных мест и установка в них img
	function checkEmpty() {
		var tmp = null;
		var value = horisontal() || vertical() || diagonal();
		
		if(value) return true;
			
		if(tmp) {
			addSrc(tmp, false);//tmp.innerHTML = '<img src="'+srcPC+'" />';
			return true;
		}
		
		//проверяем по горизонтали
		var i, j, elem, empty, toesCnt=0, emptyCnt = 0;
		function horisontal() {
			for(i=0; i<3; i++) {
				toesCnt = emptyCnt = 0;
				for(j=0; j<3; j++) {
					elem = grid.children[i].children[j];
					if(elem.children.length) {
						if(elem.firstChild.src.slice(-8) == srcPC.slice(-8)) toesCnt++;
					} else {
						emptyCnt++;
						empty = elem;
					}
				}
				if(emptyCnt != 1 || toesCnt == 1) continue;
				
				if(toesCnt && level=='difficult') {
					addSrc(empty, false);//empty.innerHTML = '<img src="'+srcPC+'" />';
					return true;	
				} else if(!toesCnt) tmp = empty;
			}
			
		}
		
		//проверяем по вертикали
		function vertical() {
			for(i=0; i<3; i++) {
				toesCnt = emptyCnt = 0;
				for(j=0; j<3; j++) {
					elem = grid.children[j].children[i];
					if(elem.children.length) {
						if(elem.firstChild.src.slice(-8) == srcPC.slice(-8)) toesCnt++;
					} else {
						emptyCnt++;
						empty = elem;
					}
				}
				if(emptyCnt != 1 || toesCnt == 1) continue;
				if(toesCnt && level=='difficult') {
					addSrc(empty, false);//empty.innerHTML = '<img src="'+srcPC+'" />';
					return true;	
				} else if(!toesCnt) tmp = empty;
			}
			
		}
		
		//проверяем по диагонали
		function diagonal() {
			return leftDiagonal() || rightDiagonal();
			
			//слева направо
			function leftDiagonal() {
				toesCnt = emptyCnt = 0;
				for(i=0; i<3; i++) {
					elem = grid.children[i].children[i];
					if(elem.children.length) {
						if(elem.firstChild.src.slice(-8) == srcPC.slice(-8)) toesCnt++;
					} else {
						emptyCnt++;
						empty = elem;
					}
				}
				if(emptyCnt != 1 || toesCnt == 1) return;
				if(toesCnt && level=='difficult') {
					addSrc(empty, false);//empty.innerHTML = '<img src="'+srcPC+'" />';
					return true;	
				} else if(!toesCnt) tmp = empty;
			}
			
			//справа налево
			function rightDiagonal() {
				toesCnt = emptyCnt = 0;
				for(i=0, j=2; i<3; i++, j--) {
					elem = grid.children[i].children[j];
					if(elem.children.length) {
						if(elem.firstChild.src.slice(-8) == srcPC.slice(-8)) toesCnt++;
					} else {
						emptyCnt++;
						empty = elem;
					}
				}
				if(emptyCnt != 1 || toesCnt == 1) return;
				if(toesCnt && level=='difficult') {
					addSrc(empty, false);//empty.innerHTML = '<img src="'+srcPC+'" />';
					return true;	
				} else if(!toesCnt) tmp = empty;
			}
		}
	}
	
	//случайный ход
	function easyMove() {
		//получаем свободные клетки
		var freeСells = [];
		for(i=0; i<3; i++) {
			for(j=0; j<3; j++) {
				elem = grid.children[i].children[j];
				if(!elem.children.length) freeСells.push(elem);
			}
		}
		
		//берем случайный индекс для freeСells и добавляем img в элемент
		if(!freeСells.length) return;
		
		var index = Math.floor(Math.random() * freeСells.length);
		addSrc(freeСells[index], false); //freeСells[index].innerHTML = '<img src="'+srcPC+'" />';
		//alert('Вставка случайного числа');
		freeСells = null;
	}
}

function checkEndGame() {
	var cnt = drawCnt = 0;
	//проверяем по горизонтали
	for(i=0; i<3; i++) {
		toesCnt = cnt = 0;
		for(j=0; j<3; j++) {
			elem = grid.children[i].children[j];
			if(elem.children.length) {
				cnt++;
				if(elem.firstChild.src.slice(-8) == srcPC.slice(-8)) {
					toesCnt++;
				}
			}
		}
		if(cnt != 3) continue;
		if(toesCnt == 3) endGame('PC');
		else if(!toesCnt) endGame('player');
		else drawCnt++;
	}
	if(drawCnt == 3) endGame('draw');
	
	//проверяем по вертикали
	for(i=0; i<3; i++) {
		toesCnt = cnt = 0;
		for(j=0; j<3; j++) {
			elem = grid.children[j].children[i];
			if(elem.children.length) {
				cnt++;
				if(elem.firstChild.src.slice(-8) == srcPC.slice(-8)) {
					toesCnt++;
				}
			}
		}
		if(cnt != 3) continue;
		if(toesCnt == 3) endGame('PC');
		else if(!toesCnt) endGame('player'); 
	}
	
	//проверяем по диагонали
	toesCnt = cnt = 0;
	for(i=0; i<3; i++) {
		elem = grid.children[i].children[i];
			if(elem.children.length) {
				cnt++;
				if(elem.firstChild.src.slice(-8) == srcPC.slice(-8)) {
					toesCnt++;
				}
			}
	}
	if(cnt == 3) {
		if(toesCnt == 3) endGame('PC');
		else if(!toesCnt) endGame('player');
	}
	
	toesCnt = cnt = 0;
	for(i=0, j=2; i<3; i++, j--) {
		elem = grid.children[i].children[j];
			if(elem.children.length) {
				cnt++;
				if(elem.firstChild.src.slice(-8) == srcPC.slice(-8)) {
					toesCnt++;
				}
			}
	}
	if(cnt == 3) {
		if(toesCnt == 3) endGame('PC');
		else if(!toesCnt) endGame('player');
	}
}

function endGame(winner) {
	eg = true;
	var h1, msg;
	
	if(winner == 'player') {
		h1 = 'Поздравляем';
		msg = 'Вы победили!';
	} else if (winner == 'PC'){
		h1 = 'Сочувствуем';
		msg = 'Вы проиграли!';
	} else if(winner == 'draw') {
		h1 = 'Ничья';
		msg = 'Победила дружба!';
	}
	
	document.body.querySelector('.sayHello').style.display = '';
	var end = document.body.querySelector('.end');
	end.innerHTML = '<h1>'+ h1 +'</h1><span>'+ msg +'</span><button id="level">ОК</button>';
	end.style.display = 'block';
}

function addSrc(elem, mySrc) {
	mySrc = mySrc ? src : srcPC; 
	elem.innerHTML = '<img src="'+mySrc+ '" />';
	elem.style.cursor = 'default';
	
	var opacity = 0;
	var timerId = setInterval(function() {
		opacity += 0.1;
		elem.firstChild.style.opacity = opacity;
		if(opacity >= 1) clearInterval(timerId);
	}, 50);
}
/*
	организовать проверку + окно после завершения
	функция добавления картинок в таблицу src opaciti
	проверить курсоры в работе

*/