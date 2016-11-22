class RugBuilder {

	constructor( context ) {

		// Context
		this.context = context;

		// Site
		this.imageContainer = document.querySelector('#img-container');

		// Data
		this.structureCodes = [
			'H1150',
			'H1200',
			'H1450',
			'H2050',
			'H2060',
			'H2070',
			'H2100',
			'H2150',
			'H2250',
//			'H2350', *
			'H2360',
			'H2400',
			'H2510',
			'H2600',
			'H3150',
			'H3200',
			'H3350',
			'H3360',
//			'H3370', *
			'H3380',
			'H3500',
			'H3650',
			'H3660',
			'H3700',
//			'H3750', *
			'H3760',
			'H3770',
			'H4050',
			'H4060',
//			'H4100', *
//			'H4110', *
			'H4200',
			'H4210',
			'H4220',
			'H4300',
			'H4350',
//			'H4370', *
//			'H4380', *
			'H4390',
//			'H4400', *
//			'H5050'  *
		];
		this.colorCodes = ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'E70000', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'J40000', 'J70000', 'H70002', 'H70003', 'J70001', 'J70002', 'J70003'];
		this.structureColorCodes = {
			'H1150' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H1200' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H1450' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H2050' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H2060' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H2070' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'E70000', 'E70001', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H2100' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H2150' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H2250' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
//			'H2350' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'E70000', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H2360' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H2400' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H2510' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H2600' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H3150' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H3200' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H3350' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H3360' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
//			'H3370' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'E70000', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H3380' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H3500' : ['A10000', 'A40000', 'B10000', 'B10001', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H3650' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H3660' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H3700' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
//			'H3750' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'E70000', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H3760' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H3770' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H4050' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H4060' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
//			'H4100' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'E70000', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
//			'H4110' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'E70000', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H4200' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H4210' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H4220' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H4300' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H4350' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
//			'H4370' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'E70000', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
//			'H4380' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'E70000', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
			'H4390' : ['A10000', 'A40000', 'B10000', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'E40000', 'E40001', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
//			'H4400' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'E70000', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
//			'H4400' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'E70000', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003'],
//			'H5050' : ['A10000', 'A40000', 'B10000', 'B10001', 'B40000', 'B70000', 'B70001', 'C40000', 'C40001', 'D10000', 'D40000', 'D70000', 'D70001', 'D70002', 'E40000', 'E40001', 'E70000', 'E70001', 'F40000', 'F70000', 'F70001', 'G40000', 'G70000', 'G70001', 'H10000', 'H40000', 'H70000', 'H70001', 'H70002', 'H70003', 'J40000', 'J70000', 'J70001', 'J70002', 'J70003']
		};
		this.numStructureColors = {
			'H1150' : 1,
			'H1200' : 1,
			'H1450' : 1,
			'H2050' : 1,
			'H2060' : 1,
			'H2070' : 1,
			'H2100' : 1,
			'H2150' : 1,
			'H2250' : 1,
			'H2360' : 1,
			'H2510' : 1,
			'H2600' : 1,
			'H3750' : 1,

			'H2350' : 2,
			'H3150' : 2,
			'H3200' : 2,
			'H3350' : 2,
			'H3360' : 2,
			'H3370' : 2,
			'H3380' : 2,
			'H3500' : 2,
			'H3650' : 2,
			'H3660' : 2,
			'H3700' : 2,
			'H3760' : 2,
			'H3770' : 2,
			'H4100' : 2,
			'H5050' : 2,

			'H4050' : 3,
			'H4060' : 3,
			'H4110' : 3,
			'H4200' : 3,
			'H4300' : 3,
			'H4400' : 3,
			
			'H4210' : 4,
			'H4220' : 4,

			'H4350' : 6,
			'H4380' : 6,

			'H4370' : 8,

			'H4390' : 7,
		};
		this.structureImages = {};

		// App Progress
		this.colorStage = 0;
		this.stageVisited = [ true, false, false, false, false, false, false, false, false, false ];
	};

	startAgain() {

		// Reset everything so user can start again

		this.colorStage = 0;
		this.stageVisited = [ true, false, false, false, false, false, false, false, false, false ];

		PubSub.publish('stageChange', 0);
		return;
	};
}