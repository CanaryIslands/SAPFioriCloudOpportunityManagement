function initModel() {
	var sUrl = "/sap-cloud-opportunity-management-0.0.1-SNAPSHOT/OppMngmt/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}