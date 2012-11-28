
Sencha SQL proxy added in new Sencha 2.1 Library.
This mean that you can use the web storage on the web browser like Chrome or Safari ...  (based on webkit)

But SQL proxy is not completed class to use. There are too many weak point in that proxy.
For an example, if you add some record and make it sync, there is an time gap between database and memory objects during the sync process.
If you call another load() function before the completion of the sync process, then the object on memory totally different from database data.

So I recommand to use an abstract super class AbstractSQLStore in that case....


Here is an example
===

	var store = Ext.getStore('some-store-object-extends-AbstractSQLStore');
	store.addRecord(record);
	store.localSync();



In this case, I call localSync() method, because there is an another sync method, remoteSync().
The SQL data must be - in many case - a copy of some remote data from server.
So there should be two sync methods, I think.
So, if you want to sync the local data with the remote server, then call store.remoteSync() again.







