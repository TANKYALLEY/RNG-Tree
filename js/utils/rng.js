function getSeed() {
	if (window.player !== undefined) return player.seed;
	else if (localStorage.getItem("rng_madness") !== null ? JSON.parse(atob(localStorage.getItem("rng_madness"))) !== null : false) return JSON.parse(atob(localStorage.getItem("rng_madness"))).seed;
	else return Math.round(Math.random()*1e15);
}

function RNGReset() {
	let s = +prompt("Enter a seed (number from 1 to 999999999999999).");
	if (isNaN(s)) return;
	if (s<0 || s>=1e15 || s!=Math.round(s)) return;
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
		2: new Decimal(5e5),
		3: new Decimal(1e10),
		4: new Decimal(1e24),
		5: new Decimal(1e50),
		6: new Decimal(1e80),
		7: new Decimal(1e120),
		8: new Decimal(1e180),
		9: new Decimal(1e240),
		10: new Decimal(1e300),
	},
	rowBaseExps: {
		1: new Decimal(0.99),
		2: new Decimal(0.9),
		3: new Decimal(0.8),
		4: new Decimal(0.7),
		5: new Decimal(0.7),
		6: new Decimal(0.7),
		7: new Decimal(0.7),
		8: new Decimal(0.7),
		9: new Decimal(0.7),
		10: new Decimal(0.7),
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
		1: new Decimal(0.75),
		2: new Decimal(0.8),
		3: new Decimal(0.85),
		4: new Decimal(0.9),
		5: new Decimal(0.95),
		6: new Decimal(1),
		7: new Decimal(1.05),
		8: new Decimal(1.1),
		9: new Decimal(1.2),
		10: new Decimal(1.3),
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





