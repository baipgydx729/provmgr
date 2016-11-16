<div class="left-menu" ms-controller="left-menu-controller">
	<ul>
		<li ms-for="(index, menu) in @menuList" ms-attr="{'class': menu.active ? 'active' : ''}">
			<a ms-if="index==0" href="#!/" ms-click="@toggle(index)">{{menu.label}}</a>
			<a ms-if="index!=0" ms-click="@toggle(index)">{{menu.label}}</a>
			<ul class="sub-menu" ms-visible="menu.toggle && menu.subMenuList!=undefined && menu.subMenuList.length>0">
				<li ms-for='(subIndex, subMenu) in menu.subMenuList' ms-attr="{'class': subMenu.active ? 'active' : ''}">
					<a ms-click="@active(index, subIndex)" ms-attr="{'href': '#!/'+index+'/'+subIndex}">{{subMenu.label}}</a>
				</li>
			</ul>
		</li>
	</ul>
</div>