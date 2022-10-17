window.tables = [];

const combine_entries = (entries = [], max_length = 10) => {
    const full_combination = entries.reduce((agg, curr) => {
        curr.split("").forEach((element, index) => {
            if (agg[index] == undefined) {
                agg[index] = 0;
            }
            agg[index] += parseInt(element);
        });
        return agg;
    }, []);
    return full_combination.slice(0, max_length).map(el => el % 10).join("");
};

const get_entries = (cpf = "") => {
    if (cpf.length < 9) {
        return []
    }
    const indexes = cpf.substring(0, 9).match(/.{1,3}/g) || [];
    return indexes.map((el, index) => window.tables[index][el]);
}

fetch('https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/')
    .then(response =>response.json())
    .then(async response => {
        await Promise.all(response.listaDezenas.slice(0, 3).map(async (el, index) => {
            const table = await fetch(`../public/data/table_${1 + (el % 20)}.json`).then(response => response.json());
            window.tables[index] = table;
        }));
        console.log(combine_entries(get_entries("11885419600")));
    });