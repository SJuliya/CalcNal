const formatCurrency = (number) =>
	new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
		maximumFractionDigits: 2,
	}).format(number);

{
	// navigation
	const navigationLinks = document.querySelectorAll('.navigation__link');
	const calcElems = document.querySelectorAll('.calc');

	navigationLinks.forEach((elem) => {
		elem.addEventListener('click', e => {
			e.preventDefault();

			navigationLinks.forEach(elem => {
				elem.classList.remove('navigation__link_active');
			})

			calcElems.forEach((calcElem) => {
				if (elem.dataset.tax === calcElem.dataset.tax) {
					calcElem.classList.add('calc_active');
					elem.classList.add('navigation__link_active');
				} else {
					calcElem.classList.remove('calc_active');
				}
			});
		})
	})
}

{
	// calc self-employed
	const self = document.querySelector('.self-employment');
	const formSelf = self.querySelector('.calc__form');
	const resultSelf = self.querySelector('.result__tax');
	const calcCompensation = self.querySelector('.calc__label_compensation');
	const resultBlockCompensation = self.querySelectorAll('.result__block_compensation');
	const resultTaxCompensation = self.querySelector('.result__tax_compensation');
	const resultTaxRestCompensation = self.querySelector('.result__tax_rest-compensation');
	const resultTaxResult = self.querySelector('.result__tax_result');

	const checkedCompensation = () => {
		const setDisplay = formSelf.addCompensation.checked ? '' : 'none';
		calcCompensation.style.display = setDisplay;

		resultBlockCompensation.forEach((elem) => {
			elem.style.display = setDisplay;
		})
	};

	checkedCompensation();

	formSelf.addEventListener('input', () => {
		const resIndividual = formSelf.individual.value * 0.04;
		const resEntity = formSelf.entity.value * 0.06;

		checkedCompensation();

		const tax = resIndividual + resEntity;
		formSelf.compensation.value =
			formSelf.compensation.value > 10_000
				? 10_000
				: formSelf.compensation.value;
		const benefit = formSelf.compensation.value;
		const resBenefit = formSelf.individual.value * 0.01 +
			formSelf.entity.value * 0.02;
		const finalBenefit = benefit - resBenefit > 0 ? benefit - resBenefit : 0;
		const finalTax = tax - (benefit - finalBenefit);

		resultSelf.textContent = formatCurrency(tax);
		resultTaxCompensation.textContent = formatCurrency(benefit - finalBenefit);
		resultTaxRestCompensation.textContent = formatCurrency(finalBenefit);
		resultTaxResult.textContent = formatCurrency(finalTax);
	});
}

{
	//tax-return
	const LIMIT = 260_000;
	const taxReturn = document.querySelector('.tax-return');
	const formReturn = taxReturn.querySelector('.calc__form');

	const resultTaxPaid = taxReturn.querySelector('.result__tax_paid');
	const resultTaxWish = taxReturn.querySelector('.result__tax_wish');
	const resultTaxTotal = taxReturn.querySelector('.result__tax_total');

	formReturn.addEventListener('input', () => {
		const expenses = formReturn.expenses.value;
		const income = formReturn.income.value;
		const ndflPaid = income * 0.13;
		const ndflExpenses = expenses * 0.13;
		const ndflReturn = (ndflExpenses <= ndflPaid ? ndflExpenses : ndflPaid);

		resultTaxPaid.textContent = formatCurrency(ndflPaid);
		resultTaxWish.textContent = formatCurrency(ndflExpenses);
		resultTaxTotal.textContent = formatCurrency(ndflReturn);
	})

}

{
	//calc usn
	const LIMIT = 300_000;
	const usn = document.querySelector('.usn');
	const formUsn = usn.querySelector('.calc__form');

	const calcLabelExpenses = usn.querySelector('.calc__label_expenses');
	const calcLabelProperty = usn.querySelector('.calc__label_property');
	const resultBlockProperty = usn.querySelector('.result__block_property');

	const resultTaxTotal = usn.querySelector('.result__tax_total');
	const resultTaxProperty = usn.querySelector('.result__tax_property');

	const typeTax = {
		'income': () => {
			calcLabelExpenses.style.display = 'none';
			calcLabelProperty.style.display = 'none';
			resultBlockProperty.style.display = 'none';

			formUsn.expenses.value = '';
			formUsn.property.value = '';
		},
		'ip-expenses': () => {
			calcLabelExpenses.style.display = '';
			calcLabelProperty.style.display = 'none';
			resultBlockProperty.style.display = 'none';

			formUsn.property.value = '';
		},
		'ooo-expenses': () => {
			calcLabelExpenses.style.display = '';
			calcLabelProperty.style.display = '';
			resultBlockProperty.style.display = '';
		}
	}

	const percent = {
		'income': 0.06,
		'ip-expenses': 0.15,
		'ooo-expenses': 0.15,
	}

	typeTax[formUsn.typeTax.value]();

	formUsn.addEventListener('input', () => {
		typeTax[formUsn.typeTax.value]();

		const income = formUsn.income.value;
		const expenses = formUsn.expenses.value;
		const contributions = formUsn.contributions.value;
		const property = formUsn.property.value;

		let profit = income - contributions;

		if (formUsn.typeTax.valueOf() !== 'income') {
			profit -= expenses;
		}

		const taxBigIncome = income > LIMIT ? (profit - LIMIT) * 0.01 : 0;
		const summ = profit - (taxBigIncome < 0 ? 0 : taxBigIncome);
		let tax = summ * percent[formUsn.typeTax.value];
		const taxProperty = property * 0.02;

		if (tax < 0 ) {
			tax = 0;
		}

		resultTaxTotal.textContent = formatCurrency(tax);
		resultTaxProperty.textContent = formatCurrency(taxProperty);
	})
}

{
	//calc osno
	const osno = document.querySelector('.osno');
	const formOsno = osno.querySelector('.calc__form');

	const ndflExpenses = osno.querySelector('.result__block_ndfl-expenses');
	const ndflIncome = osno.querySelector('.result__block_ndfl-income');
	const profit = osno.querySelector('.result__block_profit');

	const resultTaxNds = osno.querySelector('.result__tax_nds');
	const resultTaxProperty = osno.querySelector('.result__tax_property');
	const resultTaxNdflExpenses = osno.querySelector('.result__tax_ndfl-expenses');
	const resultTaxNdflIncome = osno.querySelector('.result__tax_ndfl-income');
	const resultTaxProfit = osno.querySelector('.result__tax_profit');

	const checkFormBusiness = () => {
		if (formOsno.formBusiness.value === 'IP') {
			ndflExpenses.style.display = '';
			ndflIncome.style.display = '';
			profit.style.display = 'none';
		}

		if (formOsno.formBusiness.value === 'OOO') {
			ndflExpenses.style.display = 'none';
			ndflIncome.style.display = 'none';
			profit.style.display = '';
		}
	}

	checkFormBusiness()

	formOsno.addEventListener('input', () => {
		checkFormBusiness();

		const income = formOsno.income.value;
		const expenses = formOsno.expenses.value;
		const property = formOsno.property.value;

		const nds = income * 0.2;
		const taxProperty = property * 0.02;
		const profit = income - expenses;
		const ndflExpensesRTotal = profit * 0.13;
		const ndflIncomeTotal = (income - nds) * 0.13;
		const taxProfit = profit * 0.2;

		resultTaxNds.textContent = nds;
		resultTaxProperty.textContent = taxProperty;
		resultTaxNdflExpenses.textContent = ndflExpensesRTotal;
		resultTaxNdflIncome.textContent = ndflIncomeTotal;
		resultTaxProfit.textContent = taxProfit;
	});
}

{
	// calc ausn
	const ausn = document.querySelector('.ausn');
	const formAusn = ausn.querySelector('.calc__form');
	const resultTaxTotal = ausn.querySelector('.result__tax_total');
	const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');

	calcLabelExpenses.style.display = 'none';

	formAusn.addEventListener('input', () => {
		if (formAusn.type.value === 'income') {
			calcLabelExpenses.style.display = 'none';
			resultTaxTotal.textContent = formatCurrency(formAusn.income.value * 0.08);
			formAusn.expenses.value = '';
		}

		if (formAusn.type.value === 'expenses') {
			calcLabelExpenses.style.display = '';
			resultTaxTotal.textContent =
				formatCurrency((formAusn.income.value - formAusn.expenses.value) * 0.2);
		}
	});
}