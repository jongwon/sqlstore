Ext.define('sqlstore.store.SQLProxy', {
    alias: 'proxy.sqlp',
    extend: 'Ext.data.proxy.SQL',

    throwDbError: function (tx, err) {
        var me = this;
        console.log(this.type + "----" + err.message);
    },

    getDbFields: function () {
        var me = this,
                m = me.getModel(),
                fields = m.getFields().items,
                retFields = [];

        Ext.each(fields, function (f) {

            if ((f.config.persist || !Ext.isDefined(f.config.persist)) &&
                    (f.getName() != m.getIdProperty())) {
                var name = f.getName(),
                        type = f.config.type,
                        option = (f.config.fieldOption) ? f.config.fieldOption : '';

                type = type.replace(/int/i, 'INTEGER')
                                .replace(/float/i, 'FLOAT')
                                .replace(/string/i, 'TEXT')
                                .replace(/array/i, 'TEXT')
                                .replace(/object/i, 'TEXT')
                                .replace(/date/i, 'DATETIME');

                retFields.push({
                    name: name,
                    type: type,
                    option: option,
                    field: f
                });
            }
        });

        return retFields;
    },
    getFieldDefinition: function (f) {
        var field = f.name + ' ' + f.type;
        if (!Ext.isEmpty(f.option)) field += ' ' + f.option;
        return field;
    },

    localExecute:function(sql, callback){
        var db = me.getDatabaseObject();
        db.transaction(function (tx) {
            tx.executeSql(wql,
                function (tx, result) {
                    if(callback) callback(result);
                }, onError);
        });
    },

    setTable:function(tableName){
        console.log(arguments);

        this.setTableExists(true);
        this.callParent(arguments);
        

        var me = this,
            db = me.getDatabaseObject();
        var onError = function(tx, err){
            me.throwDbError(tx, err);
        };
        var createTable = function(tx){
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + me.getSchemaString() + ')');
            console.log('CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + me.getSchemaString() + ')');
        };
        var checkDataExists = function (tx) {
            tx.executeSql('SELECT * FROM ' + tableName + ' LIMIT 1',
                [], function (tx, result) {
                if (result.rows.length == 0) {
                     tx.executeSql('DROP TABLE IF EXISTS ' + tableName, [],
                        createTable, onError);
                } else {
                    checkExistingSchema(tx, result.rows.item(0));
                }
            }, onError);
        };
        var checkExistingSchema = function (tx, data) {
            var existingFieldNames = Ext.Object.getKeys(data),
                neededFieldObjs = me.getDbFields(),
                neededFieldNames = [];
            Ext.each(neededFieldObjs, function (field) {
                neededFieldNames.push(field.name);
            }, this);

            console.log('check exsiting schema...');

            Ext.each(Ext.Array.difference(neededFieldNames, existingFieldNames),
                function (addField) {
                    var field = null;
                    Ext.each(neededFieldObjs, function (fieldObj) {
                        if (fieldObj.name == addField) {
                            field = fieldObj;
                            return false;
                        }
                    }, this);
                    var alterString = 'ALTER TABLE ' + tableName + ' ADD COLUMN ' + me.getFieldDefinition(field);
                    tx.executeSql(alterString, [],
                        function (tx) {
                            if (Ext.isEmpty(field.field.getDefaultValue())) return;
                             tx.executeSql('UPDATE ' + tableName +
                                ' SET ' + field.name + ' = ?', [ field.field.getDefaultValue() ],
                                Ext.emptyFn, Ext.emptyFn);
                             
                             console.log('UPDATE '+tableName+' SET '+field.name+'='+field.field.getDefaultValue());

                        }, Ext.emptyFn);
                    console.log('alter table executed...');
                    console.log(alterString);
            }, this);
            
        };
        db.transaction(function (tx) {
            tx.executeSql('SELECT seq FROM sqlite_sequence WHERE name=?',
                [ tableName ],
                function (tx, result) {
                    console.log(result);
                    if (result.rows.length > 0) checkDataExists(tx);
                    else createTable(tx);
                }, onError);
        });
        
    },


    updateModel: function(model) {
        console.log('========= update Model 2 ============');


        if (model && !this.getTable()) {
            var modelName = model.modelName,
                defaultDateFormat = this.getDefaultDateFormat(),
                table = modelName.slice(modelName.lastIndexOf('.') + 1);

            model.getFields().each(function (field) {
                if (field.getType().type === 'date' && !field.getDateFormat()) {
                    field.setDateFormat(defaultDateFormat);
                }
            });

            this.setUniqueIdStrategy(model.getIdentifier().isUnique);
            this.setTable(table);
            this.setColumns(this.getPersistedModelColumns(model));
        }

        // this.callParent(arguments);
    }    

});
