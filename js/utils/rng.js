function getSeed() {
	if (window.player !== undefined) return player.seed;
	else if (localStorage.getItem("rng_madness") !== null ? JSON.parse(atob(localStorage.getItem("rng_madness"))) !== null : false) return JSON.parse(atob(localStorage.getItem("rng_madness"))).seed;
	else return Math.round(Math.random()*1e9);
}

function RNGReset() {
	let s = +prompt("Enter a seed (number from 1 to 999999999).");
	if (isNaN(s)) return;
	if (s<0 || s>=1e9 || s!=Math.round(s)) return;
	hardReset(false, s);
}

const RNG_DATA = {
	rows: 10,
	minLayers: 1,
	maxLayers: 10,
	layers(row) { 
		let l = Math.max(Math.min(Math.floor(random(getSeed()*row)*RNG_DATA.maxLayers+1), RNG_DATA.maxLayers), RNG_DATA.minLayers);
		return Math.min(l, row);		
	},
	chars: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()'.split(''),
	types: ["normal", "static"],
	rowReqs: {
		1: new Decimal(10),
		2: new Decimal(1e6),
		3: new Decimal(1e12),
		4: new Decimal(1e25),
		5: new Decimal(1e50),
		6: new Decimal(1e80),
		7: new Decimal(1e120),
		8: new Decimal(1e180),
		9: new Decimal(1e240),
		10: new Decimal(1e300),
	},
	rowBaseExps: {
		1: new Decimal(0.75),
		2: new Decimal(0.5),
		3: new Decimal(0.25),
		4: new Decimal(0.15),
		5: new Decimal(0.1),
		6: new Decimal(0.05),
		7: new Decimal(0.025),
		8: new Decimal(0.01),
		9: new Decimal(0.0025),
		10: new Decimal(0.001),
	},
	staticRowBaseExps: {
		1: new Decimal(1),
		2: new Decimal(1.25),
		3: new Decimal(1.5),
		4: new Decimal(1.75),
		5: new Decimal(2),
		6: new Decimal(2.25),
		7: new Decimal(2.5),
		8: new Decimal(2.75),
		9: new Decimal(3),
		10: new Decimal(3.5),
	},
	rowLayerTotalMultExps: {
		1: new Decimal(0.5),
		2: new Decimal(0.6),
		3: new Decimal(0.75),
		4: new Decimal(0.8),
		5: new Decimal(0.875),
		6: new Decimal(0.925),
		7: new Decimal(0.95),
		8: new Decimal(0.98),
		9: new Decimal(0.99),
		10: new Decimal(1),
	},
}

function random(seed) {
    var x = Math.sin(seed*10+1) * 10000;
    return x - Math.floor(x);
}

function globalEffect(target) {
	let eff = new Decimal(1);
	for (let l in layers) {
		if (!tmp[l].hasEffect) continue;
		if (tmp[l].effectTarget == target) {
			if (target!="NONE"?tmp[target].type=="static":false) eff = eff.div(tmp[l].effect);
			else eff = eff.times(tmp[l].effect);
		}
	}
	return eff;
}

function globalUpgEffect(target) {
	let eff = new Decimal(1);
	for (let l in layers) {
		if (!tmp[l].upgrades) continue;
		for (let r=1;r<=tmp[l].upgrades.rows;r++) {
			for (let c=1;c<=tmp[l].upgrades.cols;c++) {
				let id = r*10+c;
				if (!hasUpgrade(l, id)) continue;
				if (tmp[l].upgrades[id].et == target) {
					if (target!="NONE"?tmp[target].type=="static":false) eff = eff.div(tmp[l].upgrades[id].effect);
					else eff = eff.times(tmp[l].upgrades[id].effect);
				}
			}
		}
	}
	return eff;
}

function globalBuyableEffect(target) {
	let eff = new Decimal(1);
	for (let l in layers) {
		if (!tmp[l].buyables) continue;
		for (let r=1;r<=tmp[l].buyables.rows;r++) {
			for (let c=1;c<=tmp[l].buyables.cols;c++) {
				let id = r*10+c;
				if (tmp[l].buyables[id].et == target) {
					if (target!="NONE"?tmp[target].type=="static":false) eff = eff.div(tmp[l].buyables[id].effect);
					else eff = eff.times(tmp[l].buyables[id].effect);
				}
			}
		}
	}
	return eff;

}

