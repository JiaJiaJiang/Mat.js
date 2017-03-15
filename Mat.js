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

var Mat={
	Array:(typeof Float32Array === 'function'?Float32Array:Array),
	create:function(row,column){
		return new Matrix(row,column);
	},
	multiply:function(a,b,result){
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
	},
	add:function(a,b,result){
		if(a.column!==b.column || a.row!==b.row)throw('wrong matrix');
		var r=result||new Matrix(a.row,a.column);
		for(var i=a.length;i--;){
			r[i]=a[i]+b[i];
		}
		if(!result)return r;
	},
	minus:function(a,b,result){
		if(a.column!==b.column || a.row!==b.row)throw('wrong matrix');
		var r=result||new Matrix(a.row,a.column);
		for(var i=a.length;i--;){
			r[i]=a[i]-b[i];
		}
		if(!result)return r;
	},

};


class Matrix extends Mat.Array{
	constructor(l,c){
		super(l*c);
		this.row=l;
		this.column=c;
	}
	fill(n){
		if(super.fill){
			super.fill(n);
		}else{
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
}

Mat.Matrix=Matrix;

return Mat;
});