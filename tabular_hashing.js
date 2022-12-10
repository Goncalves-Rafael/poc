document.tables = [];

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
    return indexes.map((el, index) => document.tables[index][parseInt(el)]);
}

const get_lucky_number = (cpf) => {
    return combine_entries(get_entries(cpf));
}

const displayList = (cpfs, items) => {
    const list = document.getElementById('resultList');
    list.innerHTML = '';
  
    items.forEach((item, index) => {
      const li = document.createElement("li");
      const value = document.createTextNode(`${cpfs[index]} -> ${item}`);
      li.appendChild(value);
  
      list.appendChild(li);
    });
  
    list.classList.remove('display-none');
  }

fetch('https://servicebus2.caixa.gov.br/portaldeloterias/api/megasena/')
    .then(response =>response.json())
    .then(async response => {
        document.getElementById('loteria_label').textContent = `Resultado última mega-sena: ${response.listaDezenas.join(', ')}`;
        await Promise.all(response.listaDezenas.slice(0, 3).map(async (el, index) => {
            const table = await fetch(`../public/data/table_${1 + (parseInt(el) % 20)}.json`).then(response => response.json());
            document.tables[index] = table;
        }));
    });

document.getElementById("draw_button").addEventListener("click", () => {
    if (document.getElementById('seedOrigin').value == 'megasena') {
        const cpfs = document.getElementById("items").value.split("\n");
        const lucky_numbers = cpfs.map(get_lucky_number);
        displayList(cpfs, lucky_numbers);
    } else {
        shuffle();
    }
})