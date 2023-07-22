export const calcUnsignedAngle = (adj, opp) => {
	const len = Math.sqrt(adj**2 + opp**2);
	if (len === 0) {
		return 0;
	}
	const acos = Math.acos(adj/len);
	if (opp >= 0) {
		return acos;
	}
	return Math.PI*2 - acos;
};

export const calcSignedAngle = (adj, opp) => {
	const len = Math.sqrt(adj**2 + opp**2);
	if (len === 0) {
		return 0;
	}
	const acos = Math.acos(adj/len);
	if (opp >= 0) {
		return acos;
	}
	return - acos;
};
