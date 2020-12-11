require.config({
	baseUrl: "../kontext/",
	paths: {
		bootstrap: "plugins/bootstrap/bootstrap.bundle.min",
		chosen: "plugins/chosen/chosen.jquery.min",
		copiny: "plugins/copiny/newwidget",
		themejs: "theme/js/theme",
		jquery: "plugins/jQuery/jquery.min",
		jasmine: "plugins/jasmine/jasmine",
		jasmineHtml: "plugins/jasmine/jasmine-html",
		jasmineBoot: "plugins/jasmine/boot",
		jasmineMatchers: "plugins/jasmine/jasmine-matchers",
		knockout: "plugins/knockout/knockout",
		metismenu: "plugins/metisMenu/metisMenu.min",
		slimscroll: "plugins/slimscroll/jquery.slimscroll.min",
		sweetalert: "theme/plugins/sweetalert/sweetalert.min",
		toastr: "plugins/toastr/toastr.min",
		icheck: "plugins/icheck/icheck.min",
		datePickerCore: "plugins/datepicker/bootstrap-datepicker.min",
		datePicker: "plugins/datepicker/bootstrap-datepicker.ru.min",
		colorPicker: "plugins/colorpicker/bootstrap-colorpicker.min",
		nouislider: "theme/plugins/nouslider/jquery.nouislider.min",
		pako: "plugins/pako/pako.min",
		peity: "theme/plugins/peity/jquery.peity.min",
		flot: "plugins/flot/jquery.flot",
		flotPie: "plugins/flot/jquery.flot.pie",
		kontext: "built"
	},
	shim: {
		bootstrap: {
			deps: ["jquery"]
		},
		chosen: {
			deps: ["bootstrap", "jquery",
				"css!plugins/chosen/bootstrap-chosen",
				"css!plugins/chosen/layout-chosen"]
		},
		theme: {
			deps: ["bootstrap", "metismenu", "slimscroll"]
		},
		jasmineHtml: {
			deps: ["jasmine",
				"css!plugins/jasmine/jasmine",
				"image!plugins/jasmine/jasmine_favicon.png"]
		},
		jasmineBoot: {
			deps: ["jasmineHtml"]
		},
		jasmineMatchers: {
			deps: ["jasmineBoot"]
		},
		knockout: {
			deps: ["jquery"]
		},
		metismenu: {
			deps: ["jquery"]
		},
		slimscroll: {
			deps: ["jquery"]
		},
		toastr: {
			deps: ["css!plugins/toastr/toastr.min"]
		},
		icheck: {
			deps: ["jquery",
				"css!plugins/icheck/blue"]
		},
		datePicker: {
			deps: ["datePickerCore"]
		},
		datePickerCore: {
			deps: ["bootstrap",
				"css!plugins/datepicker/bootstrap-datepicker.min"]
		},
		colorPicker: {
			deps: ["bootstrap",
				"css!plugins/colorpicker/bootstrap-colorpicker.min"]
		},
		nouislider: {
			deps: ["jquery", "css!theme/plugins/nouslider/jquery.nouislider"]
		},
		sweetalert: {
			deps: ["css!theme/plugins/sweetalert/sweetalert"]
		},
		pie: {
			deps: ["jquery"]
		},
		flot: {
			deps: ["jquery"]
		},
		flotPie: {
			deps: ["flot"]
		},
		peity: {
			deps: ["jquery"]
		}
	},
	map: {
		"*": {
			css: "plugins/require-css/css.min",
			image: "plugins/requirejs-plugins/image"
		}
	}
});
