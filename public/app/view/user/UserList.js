

Ext.define('sqlstore.view.user.UserList', {
	extend:'Ext.dataview.List',
	requires:[
		'sqlstore.store.UserStore',
		'Ext.plugin.PullRefresh',
		'Ext.plugin.ListPaging'
	],
	xtype:'xUserList',
	config:{

		cls  			: 'x-show-contact',
		disableSelection: true,
		store			: 'UserStore',

		plugins			: [
			{
				xclass:'Ext.plugin.PullRefresh'
			},
			{
				xclass:'Ext.plugin.ListPaging',
				autoPaging:false,
				allowDeselect:true,
				emptyText:'데이터가 없습니다.',
				loadMoreText:'더보기',
				noMoreRecordsText:'더 이상 없습니다.'
			}
		],
		
		itemTpl			: [
			'<div class="top">',
			    '<div class="name">{name}</div>',
			    '<div class="age">{age}</div>',
            '</div>',
            '<div class="x-list-disclosure"></div>'
		]
	}

})