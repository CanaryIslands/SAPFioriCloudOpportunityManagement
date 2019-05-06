sap.ui.jsview("OpportunityManagement.view.App", {

	/** Specifies the Controller belonging to this View. 
	 * In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	 * @memberOf OpportunityManagement.view.App
	 */
	getControllerName: function() {
		return "OpportunityManagement.controller.App";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	 * Since the Controller is given to this method, its event handlers can be attached right away. 
	 * @memberOf OpportunityManagement.view.App
	 */
	createContent: function(oController) {
		this.app = new sap.m.SplitApp("App",{});
		return this.app ;
	}

});