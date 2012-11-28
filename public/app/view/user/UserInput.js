
Ext.define('sqlstore.view.user.UserInput', {
	extend:'Ext.form.Panel',
	requires : [
		'Ext.form.FieldSet', 
		'Ext.field.Text', 
		'Ext.field.Toggle', 
		'Ext.field.Select'
	],
	xtype:'xUserInput',

	config:{
		user:undefined,
		title:'User Input', 
		items:[
			{
				xtype:'textfield',
				itemId:'userIdInput',
				name:'_id',
				label:'id',
				placeHolder:'id',
				required:true
			},
			{
				xtype:'textfield',
				itemId:'userNameInput',
				name:'name',
				label:'이름',
				placeHolder:'이름',
				required:true
			},
			{
				xtype:'textfield',
				itemId:'userAgeInput',
				name:'age',
				label:'나이',
				placeHolder:'나이',
				required:true
			},
			{
				layout:'hbox',
				cls:'button-box',
				items:[
					{
						xtype:'button',
						stretch: false,
						align: 'center',
						action:'saveUser',
						text:'저장'
					},
					{
						xtype:'button',
						stretch: false,
						align: 'center',
						action:'removeUser',
						text:'삭제'
					}
				]
			}
		]
	},

	updateUser:function(newRecord, oldRecord){
		console.log(arguments);
		var newObj = newRecord.getData();
		if(newObj && newObj._id){
			this.getItems().get('userIdInput').setValue(newObj._id);
			this.getItems().get('userNameInput').setValue(newObj.name);
			this.getItems().get('userAgeInput').setValue(newObj.age);
		}else{
			this.getItems().get('userNameInput').setValue("");
			this.getItems().get('userAgeInput').setValue(0);
		}
		return newObj;
	},

	getUserData:function(){
		var user = undefined;
		if(this.getUser() && this.getUser().getData()._id){
			user = this.getUser();
			console.log('user data ==> '+user.getData()._id);
		}else{
			user = Ext.create('sqlstore.model.UserModel');
			console.log('no user data...');
		}

		user.set('name', this.getItems().get('userNameInput').getValue());
		user.set('age', this.getItems().get('userAgeInput').getValue());
		user.set('updated', new Date().getTime());
		if(user._id){
			user.set('_set', 'update');
		}else{
			user.set('_set', 'create');
			user.set('_origin', 'client');
		}
		return user;
	}
});