
Ext.define('sqlstore.store.UserStore', {
	extend:'sqlstore.store.SQLStore',
	requires:[
		'Ext.data.proxy.JsonP',
		'sqlstore.store.SQLProxy'
	],
	config:{
		model:'sqlstore.model.UserModel',
		autoload:true,
		storeId:'UserStore',
		pageSize:10000,
		sorters: [
			{
				property: 'updated',
				direction: 'DESC'
			}
	    ],
		filters:[],

		remote:{
			update:'http://localhost:3008/user/update.json',
			remove:'',
			listAll:'http://localhost:3008/user/listAll.json',
			params:{}
		},

		proxy:{
			type:'sqlp',
			database:'sqlstore',
			idProperty:'_id'
			
		}
	},

	listUpdate:function(store, data){
		var me = this;
		var records = [];
		Ext.Array.each(data, function(record, index){
            var model = store.findRecord('_id', record._id);
            console.log(record._id+':'+model+':'+store.data.length);
            if(model){
                model.set('name', record.name);
                model.set('age', record.age);
                model.set('updated', record.updated);
                console.log(model._id + ':'+record._id+' modified...');
            }else{
                model = Ext.create(me.getModel(), record);
                model.phantom=true;
                records.push(model);
                console.log(model.get('_id')+ ':'+record._id+' added....');
            }
        });
        return records;
    }

})