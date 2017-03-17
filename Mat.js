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
	class Matrix extends Constructor{
		constructor(l,c,fill){
			super(l*c);
			this.row=l;
			this.column=c;
			if(arguments.length>=3){
				if(Matrix._instanceofTypedArray&&(fill===0))return;
				this.fill(fill);
			}
		}
		fill(n=0){
			try{
				super.fill(n);
			}catch(e){
				for(let i=this.length;i--;)this[i]=n;
			}
			return this;
		}
		set(arr,offset){
			offset||(offset=0);
			for(let i=(arr.length+offset)<=this.length?arr.length:(this.length-offset);i--;)
				this[offset+i]=arr[i];
			return this;
		}
		put(m,row=0,column=0){
			Matrix.put(this,m,row,column);
			return this;
		}
		rotate2d(t){
			return this.set(Matrix.rotate2d(this,t,Matrix.Matrixs.T3));
		}
		translate2d(x,y){
			return this.set(Matrix.translate2d(this,x,y,Matrix.Matrixs.T3));
		}
		scale2d(x,y){
			return this.set(Matrix.scale2d(this,x,y,Matrix.Matrixs.T3));
		}
		rotate3d(tx,ty,tz){
			return this.set(Matrix.rotate3d(this,tx,ty,tz,Matrix.Matrixs.T4));
		}
		scale3d(x,y,z){
			return this.set(Matrix.scale3d(this,x,y,z,Matrix.Matrixs.T4));
		}
		translate3d(x,y,z){
			return this.set(Matrix.translate3d(this,x,y,z,Matrix.Matrixs.T4));
		}
		rotateX(t){
			return this.set(Matrix.rotateX(this,t,Matrix.Matrixs.T4));
		}
		rotateY(t){
			return this.set(Matrix.rotateY(this,t,Matrix.Matrixs.T4));
		}
		rotateZ(t){
			return this.set(Matrix.rotateZ(this,t,Matrix.Matrixs.T4));
		}
		clone(){
			return new Matrix(this.row,this.column).set(this);
		}
		toString(){
			if(this.length === 0)return '';
			for(var i=0,lines=[],tmp=[];i<this.length;i++){
				if(i && (i%this.column === 0)){
					lines.push(tmp.join('\t'));
					tmp.length=0;
				}
				tmp.push(this[i]);
			}
			lines.push(tmp.join('	'));
			return lines.join('\n');
		}

		//static methods
		static Identity(n){//return a new Identity Matrix
			let m=new Matrix(n,n,0);
			for(let i=n;i--;)m[i*n+i]=1;
			return m;
		}
		static multiply(a,b,result){
			if(a.column!==b.row)throw('wrong matrix');
			let row=a.row,column=Math.min(a.column,b.column),r=result||new Matrix(row,column),c,i,ind;
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
		static multiplyString(a,b,array,ignoreZero){//work out the equation for every elements,only for debug
			if(a.column!==b.row)throw('wrong matrix');
			var r=array||new Array(a.row*b.column),l,c,i,ind;
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
			let r=result||new Matrix(a.row,a.column);
			for(let i=a.length;i--;)r[i]=a[i]+b[i];
			return r;
		}
		static minus(a,b,result){
			if(a.column!==b.column || a.row!==b.row)throw('wrong matrix');
			let r=result||new Matrix(a.row,a.column);
			for(let i=a.length;i--;)r[i]=a[i]-b[i];
			return r;
		}
		static rotate2d(m,t,result){
			const Mr=Matrix.Matrixs.rotate2d;
			Mr[0]=Mr[4]=Math.cos(t);
			Mr[1]=-(Mr[3]=Math.sin(t));
			return Matrix.multiply(Mr,m,result||new Matrix(3,3));
		}
		static scale2d(m,x,y,result){
			const Mr=Matrix.Matrixs.scale2d;
			Mr[0]=x;
			Mr[4]=y;
			return Matrix.multiply(Mr,m,result||new Matrix(3,3));
		}
		static translate2d(m,x,y,result){
			const Mr=Matrix.Matrixs.translate2d;
			Mr[2]=x;
			Mr[5]=y;
			return Matrix.multiply(Mr,m,result||new Matrix(3,3));
		}
		static rotate3d(m,tx,ty,tz,result){
			const Xc=Math.cos(tx),Xs=Math.sin(tx),
				Yc=Math.cos(ty),Ys=Math.sin(ty),
				Zc=Math.cos(tz),Zs=Math.sin(tz),
				Mr=Matrix.Matrixs.rotate3d;
			Mr[0]=Zc*Yc;
			Mr[1]=Zc*Ys*Xs-Zs*Xc;
			Mr[2]=Zc*Ys*Xc+Zs*Xs;
			Mr[4]=Zs*Yc;
			Mr[5]=Zs*Ys*Xs+Zc*Xc;
			Mr[6]=Zs*Ys*Xc-Zc*Xs;
			Mr[8]=-Ys;
			Mr[9]=Yc*Xs;
			Mr[10]=Yc*Xc;
			return Matrix.multiply(Mr,m,result||new Matrix(4,4));
		}
		static rotateX(m,t,result){
			const Mr=Matrix.Matrixs.rotateX;
			Mr[10]=Mr[5]=Math.cos(t);
			Mr[6]=-(Mr[9]=Math.sin(t));
			return Matrix.multiply(Mr,m,result||new Matrix(4,4));
		}
		static rotateY(m,t,result){
			const Mr=Matrix.Matrixs.rotateY;
			Mr[10]=Mr[0]=Math.cos(t);
			Mr[8]=-(Mr[2]=Math.sin(t));
			return Matrix.multiply(Mr,m,result||new Matrix(4,4));
		}
		static rotateZ(m,t,result){
			const Mr=Matrix.Matrixs.rotateZ;
			Mr[5]=Mr[0]=Math.cos(t);
			Mr[1]=-(Mr[4]=Math.sin(t));
			return Matrix.multiply(Mr,m,result||new Matrix(4,4));
		}
		static scale3d(m,x,y,z,result){
			const Mr=Matrix.Matrixs.scale3d;
			Mr[0]=x;
			Mr[5]=y;
			Mr[10]=z;
			return Matrix.multiply(Mr,m,result||new Matrix(4,4));
		}
		static translate3d(m,x,y,z,result){
			const Mr=Matrix.Matrixs.translate3d;
			Mr[12]=x;
			Mr[13]=y;
			Mr[14]=z;
			return Matrix.multiply(Mr,m,result||new Matrix(4,4));
		}
		static put(m,sub,row=0,column=0){
			let c,ind,i;
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
	Matrix.Matrixs={//do not modify these matrixes manually and dont use them
		I3:Matrix.Identity(3),
		I4:Matrix.Identity(4),
		T3:new Matrix(3,3,0),
		T4:new Matrix(4,4,0),
		rotate2d:Matrix.Identity(3),
		translate2d:Matrix.Identity(3),
		scale2d:Matrix.Identity(3),
		translate3d:Matrix.Identity(4),
		rotate3d:Matrix.Identity(4),
		rotateX:Matrix.Identity(4),
		rotateY:Matrix.Identity(4),
		rotateZ:Matrix.Identity(4),
		scale3d:Matrix.Identity(4),
	}
	const testMatrix=new Matrix(1,1);
	Matrix._instanceofTypedArray=!!(TypedArray&&TypedArray.isPrototypeOf(testMatrix));
	return Matrix;
}
return createClass(global.Float32Array?Float32Array:Array);
});
