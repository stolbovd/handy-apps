interface Theme {
	SmoothlyMenu: () => void;
}
declare var theme: Theme;
declare module "theme" {
	export = theme;
}
