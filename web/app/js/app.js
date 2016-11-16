require('../scss/app.scss');

require("./router/router");

var leftMenuVm = avalon.define({
    $id: 'left-menu-controller',
    menuList: [
    	{
    		label: "中国人民银行",
    		active: true,
    		toggle: true
    	},
    	{
    		label: "备付金存管银行",
    		active: false,
    		toggle: false,
    		subMenuList: [
				{
					label: "兴业银行",
					active: false
				}
			]
    	},
    	{
    		label: "备付金合作银行",
    		active: false,
    		toggle: false,
    		subMenuList: [
				{
					label: "中国工商银行",
					active: false
				},
				{
					label: "中国建设银行",
					active: false
				},
				{
					label: "中国农业银行",
					active: false
				},
				{
					label: "中国银行",
					active: false
				},
				{
					label: "招商银行",
					active: false
				},
				{
					label: "浦发银行",
					active: false
				},
				{
					label: "平安银行",
					active: false
				}
			]
    	}
    ],
    init: function(){
        if (window.location.hash.match(/^#!\/\d+\/\d+$/)!=null) {
            var tmpArray = window.location.hash.split("/");
            var index = tmpArray[1];
            var subIndex = tmpArray[2];

            for (var i = this.menuList.length - 1; i >= 0; i--) {
                if (i!=index) {
                    this.menuList[i].toggle = false;
                } else {
                    this.menuList[i].toggle = true;
                }
                
                this.menuList[i].active = false;

                if (this.menuList[i].subMenuList!=undefined) {
                    for (var j = this.menuList[i].subMenuList.length - 1; j >= 0; j--) {
                        if (i==index && j==subIndex) {
                            this.menuList[i].subMenuList[j].active=true;
                        } else {
                            this.menuList[i].subMenuList[j].active=false;
                        }
                    }
                }
            }
        }
    },
    toggle: function(index){
    	for (var i = this.menuList.length - 1; i >= 0; i--) {
    		if (i!=index) {
    			this.menuList[i].active = false;
    			this.menuList[i].toggle = false;
    		} else {
    			this.menuList[i].active = true;
    			this.menuList[i].toggle = true;
    		}

    		if (this.menuList[i].subMenuList!=undefined) {
    			for (var j = this.menuList[i].subMenuList.length - 1; j >= 0; j--) {
    				this.menuList[i].subMenuList[j].active=false;
    			}
    		}
    	}
    },
    active: function(index, subIndex){
    	for (var i = this.menuList.length - 1; i >= 0; i--) {
    		this.menuList[i].active = false;

    		if (this.menuList[i].subMenuList!=undefined) {
    			for (var j = this.menuList[i].subMenuList.length - 1; j >= 0; j--) {
    				if (i==index && j==subIndex) {
    					this.menuList[i].subMenuList[j].active=true;
    				} else {
    					this.menuList[i].subMenuList[j].active=false;
    				}
    			}
    		}
    	}
    }
});

leftMenuVm.init();

avalon.history.start({
    root: "/mmRouter"
});

var hash = location.hash.replace(/#!?/, '');
avalon.router.navigate(hash || '/', 2);

avalon.scan(document.body);