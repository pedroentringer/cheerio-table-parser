import {CheerioAPI} from './cheerio'

interface IAttrs {
  [attr: string]: string | number | boolean | { [attr: string]: string } 
}

interface IContents {
  [key: string]: string | number | boolean | IAttrs ;
}

interface IContentsAttrs {
  attrs: IContents;
  values: IContents;
}

interface IParseOptions {
  headerIsFirstLine?: boolean
}

const DEFAULT_PARSE_OPTIONS: IParseOptions = {
  headerIsFirstLine: false
}

const toCamelcase = (text:string ) : string  => {
  const str = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
    if (+match === 0) return ''
    return index === 0 ? match.toLowerCase() : match.toUpperCase()
  })
}

const convert = (text:string) : string | number | boolean => {
  if (+text) return +text
  if (text === 'true' || text === 'false') return Boolean(text)
  return text
}

module.exports = ($:CheerioAPI) => {
  $.prototype.parseTable = function (options: IParseOptions) : IContents[]{
    const tags:string[] = []
    const rows:IContents[] = []

    const currentOptions = {
      ...DEFAULT_PARSE_OPTIONS, 
      ...options
    }

    if(!currentOptions.headerIsFirstLine){
      $('thead > tr', this).each(function (_rowId, row) {
        $('td, th', row).each(function (_colId, col) {
          const text = $(col).text().trim()
          tags.push(toCamelcase(text))
        })
      })
    }

    $('tbody > tr', this).each(function (rowId, row) {

      if(currentOptions.headerIsFirstLine && rowId === 0){
        
        $('td, th', row).each(function (_colId, col) {
          const text = $(col).text().trim()
          tags.push(toCamelcase(text))
        })

      }else{

        const data:IContents = {}
        $('td, th', row).each(function (colId, col) {
          const text = $(col).text().trim()
          const index = tags[colId]
          data[index] = convert(text)
        })
        rows.push(data)

      }
    })

    return rows
  }

  $.prototype.parseTableAttrs = function (options: IParseOptions) : IContentsAttrs[] {
    const tags:string[] = []
    const rows:IContentsAttrs[] = []

    const currentOptions = {
      ...DEFAULT_PARSE_OPTIONS, 
      ...options
    }

    if(!currentOptions.headerIsFirstLine){
      $('thead > tr', this).each(function (_rowId, row) {
        $('td, th', row).each(function (_colId, col) {
          const text = $(col).text().trim()
          tags.push(toCamelcase(text))
        })
      })
    }

    $('tbody > tr', this).each(function (rowId, row) {

      if(currentOptions.headerIsFirstLine && rowId === 0){
        $('td, th', row).each(function (_colId, col) {
          const text = $(col).text().trim()
          tags.push(toCamelcase(text))
        })
      }else{
        const data:IContentsAttrs = {
          attrs: { ...$(row).attr() },
          values: {}
        }
  
        $('td, th', row).each(function (colId, col) {
          const text = $(col).text().trim()
          const index = tags[colId]
          data.values[index] = {
            attrs: $(col).attr(),
            value: convert(text)
          }
        })
        rows.push(data)
      }
      
    })

    return rows
  }
}
