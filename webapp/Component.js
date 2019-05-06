sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"OpportunityManagement/model/models"
], function(UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("OpportunityManagement.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			var oRouter = this.getRouter();
			this.routeHandler = new sap.m.routing.RouteMatchedHandler(oRouter);
			oRouter.register("appRouter"); // Assign a name to Router, so that we can access it in all controllers by using this name  
			oRouter.initialize(); // Initialise the Router  

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		}
	});

});