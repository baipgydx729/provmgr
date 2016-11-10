package com.qdb.dao;

public class UParameter {

	private int InOrOut=1;
	
	private Object value;

	public UParameter(int InOrOut,Object value){
		this.InOrOut = InOrOut;
		this.value = value;
	}
	public int getInOrOut() {
		return InOrOut;
	}

	public void setInOrOut(int inOrOut) {
		InOrOut = inOrOut;
	}

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}
	
}
