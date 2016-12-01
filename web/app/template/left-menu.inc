<div class="left-menu" ms-controller="left-menu-controller">
	<ul>
		<li ms-for="(index, menu) in @menuList" ms-attr="{'class': menu.active ? 'active' : ''}">
			<a ms-attr="{'href': menu.href}" ms-click="@active(index)">{{menu.label}}</a>
		</li>
	</ul>
</div>