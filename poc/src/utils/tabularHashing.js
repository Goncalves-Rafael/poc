
const combineEntries = (entries = [], max_length = 10) => {
    const full_combination = entries.reduce((agg, curr) => {
        curr.split("").forEach((element, index) => {
            if (agg[index] === undefined) {
                agg[index] = 0;
            }
            agg[index] += parseInt(element);
        });
        return agg;
    }, []);
    return full_combination.slice(0, max_length).map(el => el % 10).join("");
};

const getEntries = (cpf = "", tables) => {
    if (cpf.length < 9) {
        return []
    }
    const indexes = cpf.substring(0, 9).match(/.{1,3}/g) || [];
    console.log(`Indexes: [${indexes}]`);
    return indexes.map((el, index) => tables[index][parseInt(el)]);
}

export const getLuckyNumber = (cpf, tables) => {
    return combineEntries(getEntries(cpf, tables));
}

export const getMegasenaNumbers = () => {
    return fetch('https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/')
        .then(response =>response.json())
        .then(async response => {
            return response.listaDezenas;
        });
}

export const getRandomNumbersTableByIndex = (index) => {
    return fetch(`data/table_${parseInt(index)}.json`).then(response => response.json());
}
