require('../scss/app.scss');

require("./router/router");

var leftMenuVm = avalon.define({
    $id: 'left-menu-controller',
    menuList: [
    	{
    		label: "中国人民银行",
			href: "#!/",
    		active: true
    	},
    	{
    		label: "备付金存管银行",
			href: "#!/depository-bank",
    		active: false
    	},
    	{
    		label: "备付金合作银行",
			href: "#!/cooperative-bank",
    		active: false
    	}
    ],
    init: function(){
        for (var i = leftMenuVm.menuList.length - 1; i >= 0; i--) {
            if (leftMenuVm.menuList[i].href == window.location.hash) {
                leftMenuVm.menuList[i].active=true;
            } else {
                leftMenuVm.menuList[i].active=false;
            }
        }
    },
    active: function(index){
    	for (var i = leftMenuVm.menuList.length - 1; i >= 0; i--) {
    		if (i!=index) {
    			leftMenuVm.menuList[i].active = false;
    		} else {
    			leftMenuVm.menuList[i].active = true;
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