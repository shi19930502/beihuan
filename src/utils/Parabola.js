import morenImg from '../assets/imgs/img_moren@2x.png'
export default class Parabola{
	constructor(id_1, id_2, id_3, id_4,imgUrl){
		this.id_1=id_1
		this.id_2=id_2
		this.id_3=id_3
		this.id_4=id_4
		this.imgUrl=imgUrl
	}
	animationCar(){
		var e_1 = document.getElementById(this.id_1)
		var e_2 = document.getElementById(this.id_2)
		var e_3 = document.getElementById(this.id_3)
		var e_4 = document.getElementById(this.id_4)
		var x1 = e_1.getBoundingClientRect().left //购物车x点
		var x2 = e_2.getBoundingClientRect().left //商品x点
		var x3 = e_3.getBoundingClientRect().left //定点x点
		var y1 = -e_1.getBoundingClientRect().top
		var y2 = -e_2.getBoundingClientRect().top
		var y3 = -e_3.getBoundingClientRect().top
		var eImg = document.createElement('img');
		eImg.setAttribute('class', 'animationImg')
		var abcArr = this.getABC(x1, x2, x3, y1, y2, y3);
		console.log(abcArr)
		if(this.imgUrl) {
			eImg.setAttribute('src', CONFIG.imgURL + this.imgUrl)
		} else {
			eImg.setAttribute('src', morenImg)
		}
//		e_2.appendChild(eImg)
		e_4.appendChild(eImg)
		
		this.stopInterval(x1,x2,y2,eImg,abcArr,e_4)
		
	}
	stopInterval(x1,x2,y2,eImg,abcArr,e_4){
		var x = x2,
			y = y2;
//		var x = 0,
//			y = 0;
		var imgAnimation = setInterval(() => {
			x2 = x2 - 10
			if(x2 < x1) {
				window.clearInterval(imgAnimation);
				e_4.removeChild(eImg)
//				eImg.remove();
			} else {
//				eImg.setAttribute('style', 'transform:translate(' + (x) + 'px,' + y * (-1) + 'px)')
				eImg.setAttribute('style', 'width:0.5rem;height:0.5rem;position:absolute;top:'+x+'px;right: '+y+'px;z-index: 9999999;')
				eImg.style.top=x+'px'
				eImg.style.right=y+'px'
				//eImg.setAttribute('style','top:'+(x)+'px;left:'+y*(-1)+'px)')
				y = abcArr[0] * x2 * x2 + abcArr[1] * x2 + abcArr[2] - y2
				y = y.toFixed(2)
			}
			x = x - 10
		}, 20)
	}
	getABC(x1, x2, x3, y1, y2, y3) {
		var a = ((y1 - y2) / (x1 - x2) - (y3 - y2) / (x3 - x2)) / ((x1 * x1 - x2 * x2) / (x1 - x2) - (x3 * x3 - x2 * x2) / (x3 - x2))
		var b = ((y1 - y2) - ((x1 * x1 - x2 * x2) * a)) / (x1 - x2)
		var c = y1 - a * x1 * x1 - b * x1
		return [a,b,c]
	}
	
}
