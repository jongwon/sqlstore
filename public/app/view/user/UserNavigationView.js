Ext.define("sqlstore.view.user.UserNavigationView", {
	extend: 'Ext.navigation.View',
	xtype:'xUserNavigationView',
	requires: [
        'sqlstore.view.user.UserList',
        'sqlstore.view.user.UserInput',
    ],
	config:{
        
		navigationBar: {
            docked : 'top',
            cls    : 'event_toolbar',
            items  : [
                {
                    xtype         : 'button',
                    text          : '추가',
                    id            : 'userAddButton',
                    action        : 'addUser',
                    align         : 'right',
                    iconMask      : true,
                    hideAnimation : Ext.os.is.Android ? false : {type: 'fadeOut', duration: 100},
                    showAnimation : Ext.os.is.Android ? false : {type: 'fadeIn', duration: 100}
                },
                {
                    xtype:'button',
                    text:'refresh',
                    action:'userRefresh',
                    align:'left',
                    iconMask:true
                }
            ]
		},

        autoDestroy : false,

        items: [
            {
                title:'haheha',
            	xtype:'xUserList'
            }
		]
        
	}
});