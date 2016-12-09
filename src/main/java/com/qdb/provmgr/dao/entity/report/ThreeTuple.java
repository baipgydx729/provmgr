package com.qdb.provmgr.dao.entity.report;

public class ThreeTuple<F,S,T> {
	
	/**
	 * 第一元素
	 */
	public F first;
	/**
	 * 第二元素
	 */
	public  S second;
	
	/**
	 * 第三元素
	 */
	public T three;
	
	
	public F getFirst() {
		return first;
	}

	public void setFirst(F first) {
		this.first = first;
	}

	public S getSecond() {
		return second;
	}

	public void setSecond(S second) {
		this.second = second;
	}

	public T getThree() {
		return three;
	}

	public void setThree(T three) {
		this.three = three;
	}

	public ThreeTuple() {
		super();
	}

	/**
	 * 
	 * @param first
	 * @param second
	 * @param three
	 */
	public ThreeTuple(F first, S second,T three) {
		super();
		this.first = first;
		this.second = second;
		this.three = three;
	}
	
	
}
