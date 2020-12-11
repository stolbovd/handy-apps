interface Copiny {
	initCopinyWidget: (a: any) => void;
	CopinyNewWidget: {
		show: () => void;
		mobileClick: (elem: any) => void;
	};
}
declare var copiny: Copiny;
declare module "copiny" {
	export = copiny;
}
