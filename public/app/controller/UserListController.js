Ext.define('sqlstore.controller.UserListController', {
    extend: 'Ext.app.Controller',
    
    config:{
    	refs: {
    		userList:'xUserList',
            userInput:'xUserInput',
            userNavigationView:'xUserNavigationView',

            userAddButton:'xUserNavigationView button[action=addUser]',
            userRefreshButton:'button[action=userRefresh]',
            userRemoveButton:'button[action=removeUser]',
            saveUserButton:'button[action=saveUser]'
    	},

    	control:{

            userNavigationView:{
                push:'onUserNavigationPush',
                pop:'onUserNavigationPop'
            },

            userList:{
                itemtap:'onUserListTap'
            },

            userAddButton:{
                tap:'addUser'
            },

            userRemoveButton:{
                tap:'removeUser'
            },

            saveUserButton:{
                tap:'saveUser'
            },

            'button[action=refreshUserList]':{
                tap:'refreshUserList'
            }
    	}
    },

    init: function () {
		console.log('init usermodel database');
        var ustore = Ext.getStore('UserStore');
        ustore.remoteSync(false, {
            callback:function(){
                ustore.load();
            }
        });
    },

    launch: function() {
		var ustore = Ext.getStore('UserStore');
		ustore.load();
    },

    onUserNavigationPush:function(){
        this.getUserAddButton().hide();
        this.getUserRefreshButton().hide();
    },
    onUserNavigationPop:function(){
        this.getUserAddButton().show();
        this.getUserRefreshButton().show();
    },
    onUserListTap:function(list, index, item, record, event){
        if(!this.userInput){
            this.userInput = Ext.create('sqlstore.view.user.UserInput');
        }
        console.log(record);
        this.userInput.setUser(record);
        this.getUserNavigationView().push(this.userInput);
    },
    addUser:function(){
        console.log('add user clicked...');
        if(!this.userInput){
            this.userInput = Ext.create('sqlstore.view.user.UserInput');
        }
        this.getUserNavigationView().push(this.userInput);
    },
    removeUser:function(){
        console.log('remove user');
        console.log(this.getUserInput().getUserData());

        // 서버에 먼저 지우고, 로컬에 지운다.
        var store = Ext.getStore('UserStore');
        store.removeRecords(this.getUserInput().getUserData());
        store.localSync(true);
        // store.remoteSync(true);
        
        this.getUserNavigationView().pop();
    },
    saveUser:function(){
        var user = this.userInput.getUserData();
        var ustore = Ext.getStore('UserStore');
        var me = this;

        // 먼저 서버에 저장하고 로컬에 저장한다.
        // ustore.addRecords(user);
        // ustore.remoteSync();
        if(!user._id) ustore.add(user);

        ustore.localSync(true);
        console.log('save user.....');
        console.log(user);
        me.getUserNavigationView().pop();

        ustore.remoteSync(true);
    },

    refreshUserList:function(){
        var me = this;
        var ustore = Ext.getStore('UserStore');
        ustore.load({
            callback:function(){
                console.log(ustore.data.length);
                me.getUserList().refresh();
            }
        });
    }

    
});