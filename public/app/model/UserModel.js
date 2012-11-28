
Ext.define('sqlstore.model.UserModel', {
	extend:'Ext.data.Model',
	config:{
		fields:[
			{name:'id', 	type:'string'},
			{name:'_id', 	type:'string'},
			{name:'name',	type:'string'},
			{name:'age', 	type:'int'},
			{name:'description', type:'string'},
			{name:'desc2', type:'string'},
			{name:'desc3', type:'string'},
			{name:'desc4', type:'string'},
			{name:'updated', type:'auto'},
			{
				name: '_origin', 
				type: 'string', 
				defaultValue: 'server' // server / client
			},
			{
				name: '_set', 
				type: 'string', 
				defaultValue: '' // create / update / delete 
			}
		]
	}
});