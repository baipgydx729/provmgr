package com.qdb.provmgr.dao.entity.report;

/**
 * 位置信息
 *
 */
public class Location {
	
	/**
	 * 行数
	 */
	private int row;
	
	/**
	 * 列
	 */
	private int column;
	
	public int getRow() {
		return row;
	}

	public void setRow(int row) {
		this.row = row;
	}

	public int getColumn() {
		return column;
	}

	public void setColumn(int column) {
		this.column = column;
	}
	
	public Location() {
		super();
	}

	public Location(int row,int column){
		this.column = column;
		this.row = row;
	}
	
}
