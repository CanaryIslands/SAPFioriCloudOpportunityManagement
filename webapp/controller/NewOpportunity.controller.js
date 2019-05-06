sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
	"use strict";
	return Controller.extend("OpportunityManagement.controller.NewOpportunity", {
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf OpportunityManagement.view.NewOpportunity
		 */
		onInit: function (oEvent) {
			var oRouter = sap.ui.core.routing.Router.getRouter("appRouter");
			oRouter.attachRouteMatched(this._onRouteMatched, this);
			var pullToRefresh = this.oView.byId("refresh0");
			pullToRefresh.attachRefresh(this._onPullToRefresh, this);
		},
		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf OpportunityManagement.view.NewOpportunity
		 */
		// onBeforeRendering: function () {
		// },
		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf OpportunityManagement.view.NewOpportunity
		 */
		//	onAfterRendering: function() {
		//
		//	},
		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf OpportunityManagement.view.NewOpportunity
		 */
		//	onExit: function() {
		//
		//	}
		_onRouteMatched: function (oEvent) {
			var contextpath = oEvent.getParameter("arguments").contextpath;
			var oView = this.oView;
			var oThis = this;
			oView.bindElement({
				path: "/Customers(" + contextpath + ")",
				events: {
					dataRequested: function () {
						oView.setBusy(true);
					},
					dataReceived: function () {
						oView.setBusy(false);
						oThis._onPullToRefresh();
					}
				}
			});
			// Unbind old data in Opportunity List, the customer code is changed
			// and the list must be empty
			this.oView.byId("OppList").unbindItems();
		},

		_getTableItemsTamplate: function () {
			var oItemTemplate = new sap.m.ColumnListItem({
				cells: [
					new sap.m.Text({
						text: "{id}"
					}),
					new sap.m.Text({
						text: "{custID}"
					}),
					new sap.m.Text({
						text: "{oppText}"
					}),
					new sap.m.Text({
						text: "{date}"
					}),
					new sap.m.Text({
						text: "{status}"
					}),
					new sap.m.Text({
						text: "{estimatedValue}"
					}),
					new sap.m.Text({
						text: "{oppID}"
					})
				]
			});
			return oItemTemplate;
		},
		_onPullToRefresh: function (oEvent) {
			// the elment <cells></cells> in table "OppList" must be empty
			// content is filled up by the following  code 
			var oppList = this.oView.byId("OppList");
			var oItemTemplate = this._getTableItemsTamplate();
			// var bindingContext = this.getView().getBindingContext();
			// var path = bindingContext.getPath();
			// var object = bindingContext.getModel().getProperty(path);
			var oFilters = [new sap.ui.model.Filter("custID", sap.ui.model.FilterOperator.EQ, this.oView.getBindingContext().getProperty(
				"custID"))];
			oppList.bindAggregation("items", {
				path: "/CustomerOpportunities",
				template: oItemTemplate,
				filters: oFilters
			});
			this.oView.byId("refresh0").hide();
		},
		createNewOpportunity: function () {
			var oView = this.oView;
			var oData = {
				"id": 0,
				"custID": oView.byId("labelCustID").getText(),
				"oppID": oView.byId("box0").getSelectedKey(),
				"oppText": " ",
				"date": this.getDate(),
				"status": "OPEN",
				"estimatedValue": oView.byId("input0").getValue()
			};
			$.ajax({
				url: "/sap-cloud-opportunity-management-0.0.1-SNAPSHOT/OppMngmt/CustomerOpportunities",
				type: "POST",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				cache: false,
				data: JSON.stringify(oData),
				success: function (data, textStatus, jqXHR) {
					// jQuery.sap.require("sap.m.MessageBox");
					// sap.m.MessageBox.show(
					// 	"La nuova opportunità è stata salvata correttamente", {
					// 		icon: sap.m.MessageBox.Icon.INFORMATION,
					// 		title: "Salva Opportunità",
					// 		actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO]
					// 	}
					// );
					sap.m.MessageToast.show("L'opportunit\xE0 nr. " + data.id + " \xE8 stata salvata correttamente");
				}
			});
		},
		onSelectionChange: function (event) {
			this.oView.byId("OppList").setVisible(false);
			this.oView.byId("refresh0").setVisible(false);
			this.oView.byId("filterBar").setVisible(false);
			this.oView.byId("container1").setVisible(true);
			this.oView.byId("input1").setValue(event.getSource().getSelectedItem().getBindingContext().getObject().estimatedValue);
			this.oView.byId("selectedItemDate").setText(event.getSource().getSelectedItem().getBindingContext().getObject().date);
			this.oView.byId("selectedItemOppType").setText(event.getSource().getSelectedItem().getBindingContext().getObject().oppID);
			this.oView.byId("selectedItemOppID").setText(event.getSource().getSelectedItem().getBindingContext().getObject().id);
			var status = event.getSource().getSelectedItem().getBindingContext().getObject().status;
			if (status === "OPEN") {
				this.oView.byId("oppStatus").setSelectedKey(1);
			} else if (status === "WIN") {
				this.oView.byId("oppStatus").setSelectedKey(2);
			} else if (status === "LOST") {
				this.oView.byId("oppStatus").setSelectedKey(3);
			}
		},
		rejectModify: function () {
			this.oView.byId("container1").setVisible(false);
			this.oView.byId("OppList").setVisible(true);
			this.oView.byId("refresh0").setVisible(true);
			this.oView.byId("filterBar").setVisible(true);
		},
		getDate: function () {
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1;
			//January is 0!
			var yyyy = today.getFullYear();
			if (dd < 10) {
				dd = "0" + dd;
			}
			if (mm < 10) {
				mm = "0" + mm;
			}
			today = dd + "/" + mm + "/" + yyyy;
			return today;
		},

		acceptModify: function (event) {
			var oView = this.oView;
			var oData = {
				"id": parseInt(oView.byId("selectedItemOppID").getText(), 10),
				"custID": oView.byId("labelCustID").getText(),
				"oppID": oView.byId("selectedItemOppType").getText(),
				"oppText": " ",
				"date": oView.byId("selectedItemDate").getText(),
				"status": oView.byId("oppStatus").getSelectedItem().getText(),
				"estimatedValue": oView.byId("input1").getValue()

			};
			$.ajax({
				url: "/sap-cloud-opportunity-management-0.0.1-SNAPSHOT/OppMngmt/CustomerOpportunities(" + oData.id + ")",
				type: "PUT",
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				cache: false,
				data: JSON.stringify(oData),
				success: function (data, textStatus, jqXHR) {
					sap.m.MessageToast.show("L'opportunit\xE0 nr. " + oData.id + " \xE8 stata aggiornata correttamente");
				}
			});
			oView.byId("container1").setVisible(false);
			oView.byId("OppList").setVisible(true);
			oView.byId("refresh0").setVisible(true);
			this.oView.byId("filterBar").setVisible(true);
		},

		onSlStatusSelectChange: function (event) {
			var oItemTemplate = this._getTableItemsTamplate();
			var oFilters = [new sap.ui.model.Filter("custID", sap.ui.model.FilterOperator.EQ, this.oView.getBindingContext().getProperty(
				"custID"))];
			var oppList = this.oView.byId("OppList");
			var statusSelected = this.oView.byId("slStatus").getSelectedItems();
			for (var itemStatus in statusSelected) {
				oFilters.push(new sap.ui.model.Filter("status", sap.ui.model.FilterOperator.EQ, this.oView.byId("slStatus").getSelectedItems()[
					itemStatus].getText()));
			}
			this.oView.byId("OppList").unbindItems();
			oppList.bindAggregation("items", {
				path: "/CustomerOpportunities",
				template: oItemTemplate,
				filters: oFilters
			});
		}

	});
});