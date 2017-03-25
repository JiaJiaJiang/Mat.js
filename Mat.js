/*
Copyright luojia@luojia.me
LGPL license
*/
'use strict';

(function(f){
	if (typeof define === "function" && define.amd) {
	    define(f);
	}else if (typeof exports === "object") {
	    module.exports = f();
	}else {
	    (0,eval)('this').Mat = f();
	}
})(function(){
const global= (0,eval)('this');
const TypedArray=global.Float32Array&&global.Float32Array.prototype;

function createClass(Constructor){
	class Matrix{
		get length(){return this._len;}
		static leftMultiply(m){
			return this.set(Mat.multiply(m,this,Mat(m.row,this.column)));
		}
		static rightMultiply(m){
			return this.set(Mat.multiply(this,m,Mat(this.row,m,column)));
		}
		static fill(n){
			arguments.length||(n=0);
			for(let i=this.length;i--;)this[i]=n;
			return this;
		}
		static set(arr,offset){
			offset||(offset=0);
			for(let i=(arr.length+offset)<=this.length?arr.length:(this.length-offset);i--;)
				this[offset+i]=arr[i];
			return this;
		}
		static put(m,row,column){
			Mat.put(this,m,row||0,column||0);
			return this;
		}
		static rotate2d(t){
			return this.set(Mat.rotate2d(this,t,Mat.Matrixes.T3));
		}
		static translate2d(x,y){
			return this.set(Mat.translate2d(this,x,y,Mat.Matrixes.T3));
		}
		static scale2d(x,y){
			return this.set(Mat.scale2d(this,x,y,Mat.Matrixes.T3));
		}
		static rotate3d(tx,ty,tz){
			return this.set(Mat.rotate3d(this,tx,ty,tz,Mat.Matrixes.T4));
		}
		static scale3d(x,y,z){
			return this.set(Mat.scale3d(this,x,y,z,Mat.Matrixes.T4));
		}
		static translate3d(x,y,z){
			return this.set(Mat.translate3d(this,x,y,z,Mat.Matrixes.T4));
		}
		static rotateX(t){
			return this.set(Mat.rotateX(this,t,Mat.Matrixes.T4));
		}
		static rotateY(t){
			return this.set(Mat.rotateY(this,t,Mat.Matrixes.T4));
		}
		static rotateZ(t){
			return this.set(Mat.rotateZ(this,t,Mat.Matrixes.T4));
		}
		static clone(){
			return Mat(this.row,this.column,this);
		}
		static toString(){
			if(this.length === 0)return '';
			for(var i=0,lines=[],tmp=[];i<this.length;i++){
				if(i && (i%this.column === 0)){
					lines.push(tmp.join('\t'));
					tmp.length=0;
				}
				tmp.push(this[i]||0);
			}
			lines.push(tmp.join('	'));
			return lines.join('\n');
		}
	}
	class staticMethods{
		//static methods
		static Identity(n){//return a new Identity Matrix
			let m=Mat(n,n,0);
			for(let i=n;i--;)m[i*n+i]=1;
			return m;
		}
		static Perspective(fovy,aspect,znear,zfar,result){
			var y1=znear*Math.tan(fovy*Math.PI/360.0),
				x1=y1*aspect,
				m=result||Mat(4,4,0);
			m[0]=2*znear/(x1+x1);
			m[5]=2*znear/(y1+y1);
			m[10]=-(zfar+znear)/(zfar-znear);
			m[14]=-2*zfar*znear/(zfar-znear);
			m[11]=-1;
		    if(result)m[1]=m[2]=m[3]=m[4]=m[6]=m[7]=m[8]=m[9]=m[12]=m[13]=m[15]=0;
		    return m;
		}
		static multiply(a,b,result){
			if(a.column!==b.row)throw('wrong matrix');
			let row=a.row,column=Math.min(a.column,b.column),r=result||Mat(row,column),c,i,ind;
			for(let l=row;l--;){
				for(c=column;c--;){
					r[ind=(l*r.column+c)]=0;
					for(i=a.column;i--;){
						r[ind]+=(a[l*a.column+i]*b[c+i*b.column]);
					}
				}
			}
			return r;
		}
		static multiplyString(a,b,array,ignoreZero=true){//work out the equation for every elements,only for debug and only works with Array matrixes
			if(a.column!==b.row)throw('wrong matrix');
			var r=array||Mat(a.row,b.column),l,c,i,ind;
			for(l=a.row;l--;){
				for(c=b.column;c--;){
					r[ind=(l*b.column+c)]='';
					for(i=0;i<a.column;i++){
						if(ignoreZero && (a[l*a.column+i]==0 ||b[c+i*b.column]==0))continue;
						r[ind]+=(((i&&r[ind])?'+':'')+'('+a[l*a.column+i]+')*('+b[c+i*b.column])+')';
					}
				}
			}
			return r;
		}
		static add(a,b,result){
			if(a.column!==b.column || a.row!==b.row)throw('wrong matrix');
			let r=result||Mat(a.row,b.column);
			for(let i=a.length;i--;)r[i]=a[i]+b[i];
			return r;
		}
		static minus(a,b,result){
			if(a.column!==b.column || a.row!==b.row)throw('wrong matrix');
			let r=result||Mat(a.row,b.column);
			for(let i=a.length;i--;)r[i]=a[i]-b[i];
			return r;
		}
		static rotate2d(m,t,result){
			const Mr=Mat.Matrixes.rotate2d;
			Mr[0]=Mr[4]=Math.cos(t);
			Mr[1]=-(Mr[3]=Math.sin(t));
			return Mat.multiply(Mr,m,result||Mat(3,3));
		}
		static scale2d(m,x,y,result){
			const Mr=Mat.Matrixes.scale2d;
			Mr[0]=x;
			Mr[4]=y;
			return Mat.multiply(Mr,m,result||Mat(3,3));
		}
		static translate2d(m,x,y,result){
			const Mr=Mat.Matrixes.translate2d;
			Mr[2]=x;
			Mr[5]=y;
			return Mat.multiply(Mr,m,result||Mat(3,3));
		}
		static rotate3d(m,tx,ty,tz,result){
			const Xc=Math.cos(tx),Xs=Math.sin(tx),
				Yc=Math.cos(ty),Ys=Math.sin(ty),
				Zc=Math.cos(tz),Zs=Math.sin(tz),
				Mr=Mat.Matrixes.rotate3d;
			Mr[0]=Zc*Yc;
			Mr[1]=Zc*Ys*Xs-Zs*Xc;
			Mr[2]=Zc*Ys*Xc+Zs*Xs;
			Mr[4]=Zs*Yc;
			Mr[5]=Zs*Ys*Xs+Zc*Xc;
			Mr[6]=Zs*Ys*Xc-Zc*Xs;
			Mr[8]=-Ys;
			Mr[9]=Yc*Xs;
			Mr[10]=Yc*Xc;
			return Mat.multiply(Mr,m,result||Mat(4,4));
		}
		static rotateX(m,t,result){
			const Mr=Mat.Matrixes.rotateX;
			Mr[10]=Mr[5]=Math.cos(t);
			Mr[6]=-(Mr[9]=Math.sin(t));
			return Mat.multiply(Mr,m,result||Mat(4,4));
		}
		static rotateY(m,t,result){
			const Mr=Mat.Matrixes.rotateY;
			Mr[10]=Mr[0]=Math.cos(t);
			Mr[8]=-(Mr[2]=Math.sin(t));
			return Mat.multiply(Mr,m,result||Mat(4,4));
		}
		static rotateZ(m,t,result){
			const Mr=Mat.Matrixes.rotateZ;
			Mr[5]=Mr[0]=Math.cos(t);
			Mr[1]=-(Mr[4]=Math.sin(t));
			return Mat.multiply(Mr,m,result||Mat(4,4));
		}
		static scale3d(m,x,y,z,result){
			const Mr=Mat.Matrixes.scale3d;
			Mr[0]=x;
			Mr[5]=y;
			Mr[10]=z;
			return Mat.multiply(Mr,m,result||Mat(4,4));
		}
		static translate3d(m,x,y,z,result){
			const Mr=Mat.Matrixes.translate3d;
			Mr[12]=x;
			Mr[13]=y;
			Mr[14]=z;
			return Mat.multiply(Mr,m,result||Mat(4,4));
		}
		static put(m,sub,row,column){
			let c,ind,i;
			row||(row=0);
			column||(column=0);
			for(let l=sub.row;l--;){
				if(l+row>=m.row)continue;
				for(c=sub.column;c--;){
					if(c+column>=m.column)continue;
					m[(l+row)*m.column+c+column]=sub[l*sub.column+c];
				}
			}
		}
		static createClass(Constructor){
			return createClass(Constructor);
		}
	}
	var testArray=new Constructor(1);
	Object.defineProperty(Matrix,'_instanceofTypedArray',{value:!!(TypedArray&&TypedArray.isPrototypeOf(testArray))});
	testArray=null;

	Object.setPrototypeOf(Matrix,Constructor.prototype);
	function Mat(l,c,fill){
		const M=new Constructor(l*c);
		Object.setPrototypeOf(M,Matrix);
		Object.defineProperty(M,'length',{value:l*c});
		Object.defineProperty(M,'row',{value:l});
		Object.defineProperty(M,'column',{value:c});
		if(arguments.length>=3){
			if(Matrix._instanceofTypedArray&&(fill===0)){}
			else if(typeof fill === 'number'){
				M.fill(fill);
			}else if(fill.length){
				M.set(fill);
			}
		}
		return M;
	}
	Object.setPrototypeOf(Mat,staticMethods);
	Mat.Matrixes={//do not modify these matrixes manually and dont use them
		I2:Mat.Identity(2),
		I3:Mat.Identity(3),
		I4:Mat.Identity(4),
		T3:Mat(3,3,0),
		T4:Mat(4,4,0),
		rotate2d:Mat.Identity(3),
		translate2d:Mat.Identity(3),
		scale2d:Mat.Identity(3),
		translate3d:Mat.Identity(4),
		rotate3d:Mat.Identity(4),
		rotateX:Mat.Identity(4),
		rotateY:Mat.Identity(4),
		rotateZ:Mat.Identity(4),
		scale3d:Mat.Identity(4),
	}
	return Mat;
}
return createClass(global.Float32Array?Float32Array:Array);
});
