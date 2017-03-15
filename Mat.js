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

function createClass(Constructor){
	class Matrix extends Constructor{
		constructor(l,c){
			super(l*c);
			this.row=l;
			this.column=c;
		}
		fill(n){
			if(super.fill){
				super.fill(n);
			}else{
				if(typeof n !== 'number')n=0;
				for(var i=this.length;i--;){
					this[i]=n;
				}
			}
			return this;
		}
		set(arr,offset){
			if(super.set){
				super.set(arr,offset);
			}else{
				var len=this.length<arr.length?this.length:arr.length;
				for(var i=offset||0;i<len;i++)this[i]=arr[i];
			}
			return this;
		}
		rotate2d(t){
			Matrix.rotate2d(this,t,Matrix.Matrixs.T3);
			return this.set(Matrix.Matrixs.T3);
		}
		rotateX(t){
			Matrix.rotateX(this,t,Matrix.Matrixs.T3);
			return this.set(Matrix.Matrixs.T3);
		}
		rotateY(t){
			Matrix.rotateY(this,t,Matrix.Matrixs.T3);
			return this.set(Matrix.Matrixs.T3);
		}
		rotateZ(t){
			Matrix.rotateZ(this,t,Matrix.Matrixs.T3);
			return this.set(Matrix.Matrixs.T3);
		}
		clone(){
			return new Matrix(this.row,this.column).set(this);
		}
		toString(){
			if(this.length === 0)return '';
			var lines=[],tmp=[];
			for(var i=0;i<this.length;i++){
				if(i && (i%this.column === 0)){
					lines.push(tmp.join('	'));
					tmp.length=0;
				}
				tmp.push(this[i]);
			}
			lines.push(tmp.join('	'));
			return lines.join('\n');
		}

		//static methods
		static multiply(a,b,result){
			if(a.column!==b.row)throw('wrong matrix');
			var r=result||new Matrix(a.row,b.column),l,c,i,ind;
			for(l=r.row;l--;){
				for(c=r.column;c--;){
					r[ind=(l*r.column+c)]=0;
					for(i=a.column;i--;){
						r[ind]+=(a[l*a.column+i]*b[c+i*b.column]);
					}
				}
			}
			if(!result)return r;
		}
		static add(a,b,result){
			if(a.column!==b.column || a.row!==b.row)throw('wrong matrix');
			var r=result||new Matrix(a.row,a.column);
			for(var i=a.length;i--;){
				r[i]=a[i]+b[i];
			}
			if(!result)return r;
		}
		static minus(a,b,result){
			if(a.column!==b.column || a.row!==b.row)throw('wrong matrix');
			var r=result||new Matrix(a.row,a.column);
			for(var i=a.length;i--;){
				r[i]=a[i]-b[i];
			}
			if(!result)return r;
		}
		static rotate2d(m,t,result){
			var r=result||new Matrix(m.row,m.row),
				c=Math.cos(t),s=Math.sin(t),Mr=Matrix.Matrixs.rotate2d;
			Mr[0]=Mr[4]=c;
			Mr[1]=-(Mr[3]=s);
			Matrix.multiply(Mr,m,r);
			if(!result)return r;
		}
		static rotateX(m,t,result){
			var r=result||new Matrix(a.row,a.column),
				c=Math.cos(t),s=Math.sin(t),Mr=Matrix.Matrixs.rotateX;
			Mr[8]=Mr[4]=c;
			Mr[5]=-(Mr[7]=s);
			Matrix.multiply(Mr,m,r);
			if(!result)return r;
		}
		static rotateY(m,t,result){
			var r=result||new Matrix(a.row,a.column),
				c=Math.cos(t),s=Math.sin(t),Mr=Matrix.Matrixs.rotateX;
			Mr[8]=Mr[0]=c;
			Mr[6]=-(Mr[2]=s);
			Matrix.multiply(Mr,m,r);
			if(!result)return r;
		}
		static rotateZ(m,t,result){
			return Matrix.rotate2d(m,t,result);//the same matrix as rotate2d
		}
		static createClass(Constructor){
			return createClass(Constructor);
		}
	}
	Matrix.Matrixs={
		T3:new Matrix(3,3).fill(0),
		rotate2d:new Matrix(3,3).set([0,0,0,0,0,0,0,0,1]),
		rotateX:new Matrix(3,3).set([1,0,0,0,0,0,0,0,0]),
		rotateY:new Matrix(3,3).set([0,0,0,0,1,0,0,0,0]),
		rotateZ:new Matrix(3,3).set([0,0,0,0,0,0,0,0,1]),
	}
	return Matrix;
}



return createClass((typeof Float32Array === 'function'?Float32Array:Array));
});