Ext.define('sqlstore.view.Main', {
    extend: 'Ext.tab.Panel',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
        'Ext.Video',
        'sqlstore.view.user.UserNavigationView'
    ],
    config: {
        tabBarPosition: 'bottom',

        items: [
            {
                title: 'Case 1',
                iconCls: 'home',
                xtype:'xUserNavigationView'
            },
            {
                title: 'Case 2',
                iconCls: 'action',

                items: [
                    {
                        docked: 'top',
                        xtype: 'titlebar',
                        title: 'Getting Started'
                    },
                    {
                        html:'test1'
                    }
                ]
            },
             {
                title: 'Case 3',
                iconCls: 'action',

                items: [
                    {
                        docked: 'top',
                        xtype: 'titlebar',
                        title: 'Getting Started'
                    },
                    {
                        html:'test2'
                    }
                ]
            }
        ]
    }
});
