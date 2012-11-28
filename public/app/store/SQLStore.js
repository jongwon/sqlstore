

Ext.define('sqlstore.store.SQLStore', {
	extend:'Ext.data.Store',
	requires:['Ext.data.proxy.SQL'],

	config:{
		running:false, //0 : 가능, 1: 동작중
		wait:[],
		remote:{},
        onSyncComplete:Ext.emptyFn
	},

	constructor:function(config){
		config = config || {};
		this.data = this._data = this.createDataCollection();
		this.data.setSortRoot('data');
		this.data.setFilterRoot('data');
		this.removed=[];
		if(config.id && !config.storeId){
			config.storeId = config.id;
			delete config.id;
		}
		this.initConfig(config);
	},

	remoteSync:function(upload, option){
        var me = this;
        if(upload){
            me.load({
                callback:function(records, operation, success) {
                    me._uploadSync(option)
                },
                scope:this
            });
        }else{
            me.load({
                callback:function(records, operation, success) {
                    me._downloadSync(option, me);
                },
                scope: this
            });
        }
	},

    listUpdate:function(records, option){
        console.log('listUpdate function not yet impleted..');
    },

    _downloadSync:function(option, store){
        var me = this;
        var remote = this.getRemote();
        
        Ext.util.JSONP.request({
            url:remote.listAll,
            params:remote.params,

            callback:function(success, response, error, callback){
                // console.log(arguments);
                // console.log(me.data);
                // console.log(store.data.length);
                
                if(response.data && response.data.length){
                    var records = me.listUpdate(store, response.data);
                    if(option && option.callback){
                        me.setOnSyncComplete(option.callback);
                    }
                    me.addRecords(records);
                    me.localSync();
                }
                
            }
        });
        
    },

    _uploadSync:function(option){
        var records = this.data.filterBy(function(item){
            return item.data._set !== '';
        }).items;
        if(!this.getRemote() || records.length === 0) return;

        var me = this;
        var count = records.length, _tmp = 0;
        var remote = this.getRemote();
        me.load({
            callback:function(){
                Ext.Array.each(records, function(record, index){
                    var data = record.data;
                    console.log(data);
                    Ext.util.JSONP.request({
                        url:remote.update,
                        params:{
                            user:{_id:data._id, 
                                name:data.name,
                                age:data.age
                            }
                        },
                        callback:function(success, response, error, callback){
                            _tmp++;
                            if(!error){
                                data._set='';
                                record.setDirty();
                            }
                            if(_tmp == count) me.localSync();
                        }
                    })
                });
            }
        });
    },

	/**
     * 레코드 삽입을 요청함.
     * @param {} records
     */
    addRecords:function(records, withoutRoad){
        if(Ext.isArray(records)){
            this.getWait().push(records);
        }else{
            this.getWait().push([records]);
        }
    },
    
    removeRecords:function(records){
        // 배열로 오는 경우를 처리해야 함.

        // 로컬에서만 지우도록 처리해 보자...
        records.set('_set', 'remove');
        console.log(records.get_origin());
        
        this.remove(records);
        this.sync();
    },
     
    localSync:function(loaded){
        if(this.getRunning()){
            console.log('already running....');
            return;
        }
        console.log('insert start');

        this.setRunning(true);
        // wait 에 있는 record를 모두 넣음.
        var me = this;
         
        if(!loaded){
            me.load({
                callback:me._loadCallBack(me)
            });
        }else{
            me._loadCallBack(me)();
        }
    },
    
    _loadCallBack:function(me){
        console.log('load callback');

        return function(_data, _operation, _success){
            var records = me.getWait().pop();
            if(records){
                for(var i=0;i<records.length;i++)
                    me.add(records[i]);
            }
            if(me.getWait().length === 0){
                console.log('sync start...');
            	me.onBatchComplete=function(batch){
                    console.log('sync batch completed...');
                     var me2 = this,
                        operations = batch.operations,
                        length = operations.length,
                        i;

                    for (i = 0; i < length; i++) {
                        me2.onProxyWrite(operations[i]);
                    }

            		if(me.getWait().length === 0){
                        me.setRunning(false);
                    }else{
                        me.localSync(true);
                    }
                    if(me.getOnSyncComplete())
                        me.getOnSyncComplete()();

                    console.log('sync complete...');
            	};
                me.sync();
            }else{
                me.localSync(true);
            }
        }
    },

    sync: function() {
        console.log('=============> store sync method started....');
        console.log(this.data);

        var me = this,
            operations = {},
            toCreate = me.getNewRecords(),
            toUpdate = me.getUpdatedRecords(),
            toDestroy = me.getRemovedRecords(),
            needsSync = false;

        if (toCreate.length > 0) {
            operations.create = toCreate;
            needsSync = true;
        }

        if (toUpdate.length > 0) {
            operations.update = toUpdate;
            needsSync = true;
        }

        if (toDestroy.length > 0) {
            operations.destroy = toDestroy;
            needsSync = true;
        }
        console.log(needsSync);
        
        if (needsSync && me.fireEvent('beforesync', this, operations) !== false) {
            me.getProxy().batch({
                operations: operations,
                listeners: me.getBatchListeners()
            });
            console.log('store batch started....')
        }else{
            me.onBatchComplete({operations:[]});
        }

        return {
            added: toCreate,
            updated: toUpdate,
            removed: toDestroy
        };
    }

});