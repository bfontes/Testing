const { readFile } = require('fs/promises')
const { error } = require('./constants')
const DEFAULT_OPTION = {
  maxLines: 3,
  fields: ['id', 'name', 'profession', 'age']
}

class File {
  static async csvToJSON(filePath) {
    //lendo o arquivo
    const content = await readFile(filePath, "utf8")
    const validation = this.isValid(content)
    // se o arquivo n for valido, lança o erro
    if(!validation.valid) throw new Error(validation.error)
    //convertendo o resultado para json
    const result = this.parseCSVToJSON(content)
    return result
  }

  static isValid(csvString, options = DEFAULT_OPTION) {
    // ler o arquivo
    // fs.readFileSync('./mocks/threeItems-valid.csv', 'utf8')

    // [0] = headers
    // [1] = linha 1
    // [2] = linha 2
    // ...variavel = restante do arquivo
    const [header, ...fileWithoutHeader] = csvString.split(/\r?\n/)
    const isHeaderValid = header.trim() === options.fields.join(',')
    if(!isHeaderValid) {
      return {
        error: error.FILE_FIELDS_ERROR_MESSAGE,
        valid: false
      }
    }

    if(
      !fileWithoutHeader.length || 
      fileWithoutHeader.length > options.maxLines
      ) {
      return {
        error: error.FILE_LENGTH_ERROR_MESSAGE,
        valid: false
      }
    }
    //se n tiver erro, passa pra prox função
    return { valid: true }
  }

  static parseCSVToJSON(csvString) {
    const lines = csvString.split(/\r?\n/)
    // remover a primeira linha (header) e retorna ele
    const firstLine = lines.shift()
    //transformando em um array
    const header = firstLine.split(',')

    const users = lines.map(line => {
      const columns = line.split(',')
      const user = {}
      for(const index in columns) {
        user[header[index]] = columns[index].trim()
      }
      return user
    })

    return users
  }
}

module.exports = File