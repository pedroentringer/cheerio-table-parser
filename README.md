# Cheerio Table Parser
Usado para converter tabelas em HTML para JSON

## Como usar
Para iniciar você precisará instalar a lib cheerio
```
yarn add cheerio @pedroentringer/cheerio-table-parser
```

Feito isso basta iniciar as duas libs e fazer o scrapping
```javascript
import cheerio from 'cheerio'
import parseTable from '@pedroentringer/cheerio-table-parser'

const html = '<table id="tabela"><thead><tr><th>id</th><th>nome</th><th>Data de Nascimento</th><th>idade</th></tr></thead><tbody><tr><td>1</td><td>Pedro Entringer</td><td>05/10/1997</td><td>22</td></tr></tbody></table>'

const $ = cheerio.load(html)
parseTable($)

const table = $('#tabela').parseTable()
```

O resultado sera:
```json
[
  {
    "id": 1,
    "nome": "Pedro Entringer",
    "dataDeNascimento": "05/10/1997",
    "idade": 22
  }
]
```

#### Conversão automatica de tipos
O Script convert para String, Number e Boolean