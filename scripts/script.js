const formatCurrency = (number) =>
	new Intl.NumberFormat('ru-RU', {
		style: 'currency',
		currency: 'RUB',
		maximumFractionDigits: 2,
	}).format(number);

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
	const setDisplay = formSelf.addCompensation.checked ? 'block' : 'none';
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
	resultTaxCompensation.textContent  = formatCurrency(benefit - finalBenefit);
	resultTaxRestCompensation.textContent  = formatCurrency(finalBenefit);
	resultTaxResult.textContent  = formatCurrency(finalTax);
});

//calc osno
const osno = document.querySelector('.osno');
const formOsno = osno.querySelector('.calc__form');
const resultOsno = osno.querySelector('.result__tax');




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
		calcLabelExpenses.style.display = 'block';
		resultTaxTotal.textContent =
			formatCurrency((formAusn.income.value - formAusn.expenses.value) * 0.2);
	}
});