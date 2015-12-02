'use strict';

app.customersView = kendo.observable({
    onShow: function() {},
    afterShow: function() {}
});

// START_CUSTOM_CODE_customersView
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_customersView
(function(parent) {
    var dataProvider = app.data.klpsMobile,
        flattenLocationProperties = function(dataItem) {
            var propName, propValue,
                isLocation = function(value) {
                    return propValue && typeof propValue === 'object' &&
                        propValue.longitude && propValue.latitude;
                };

            for (propName in dataItem) {
                if (dataItem.hasOwnProperty(propName)) {
                    propValue = dataItem[propName];
                    if (isLocation(propValue)) {
                        dataItem[propName] =
                            kendo.format('Latitude: {0}, Longitude: {1}',
                                propValue.latitude, propValue.longitude);
                    }
                }
            }
        },
        dataSourceOptions = {
            type: 'everlive',
            transport: {
                typeName: 'Customer',
                dataProvider: dataProvider
            },

            change: function(e) {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];

                    flattenLocationProperties(dataItem);
                }
            },
            schema: {
                model: {
                    fields: {
                        'Name': {
                            field: 'Name',
                            defaultValue: ''
                        },
                        'Address': {
                            field: 'Address',
                            defaultValue: ''
                        },
                    }
                }
            },
            serverFiltering: true,
            serverSorting: true,
            serverPaging: true,
            pageSize: 50
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        customersViewModel = kendo.observable({
            dataSource: dataSource,
            itemClick: function(e) {
                app.mobileApp.navigate('#components/customersView/details.html?uid=' + e.dataItem.uid);
            },
            
            addClick: function(e) {
             
                //create a new item.....initialize it as you please
                var item = { 'Name': 'Enter Name Here' };
                //retrieve the data source
                 dataSource = customersViewModel.get('dataSource');
                dataSource.add(item);
                dataSource.sync();
                item = dataSource.at(dataSource.total() -1);
                customersViewModel.set('currentItem', item);
                app.mobileApp.navigate('#components/customersView/details.html?uid=' + item.uid);
            },
            
            detailsShow: function(e) {
                var item = e.view.params.uid,
                    dataSource = customersViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);
                if (!itemModel.Name) {
                    itemModel.Name = String.fromCharCode(160);
                }
                customersViewModel.set('currentItem', itemModel);
            },
            currentItem: null
        });

    parent.set('customersViewModel', customersViewModel);
})(app.customersView);

// START_CUSTOM_CODE_customersViewModel
// Add custom code here. For more information about custom code, see http://docs.telerik.com/platform/screenbuilder/troubleshooting/how-to-keep-custom-code-changes

// END_CUSTOM_CODE_customersViewModel