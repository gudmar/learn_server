const fs = require('node:fs')

class FileOperator {

    constructor() {
        this.content = null
        this.fileName = null
        this.lock = false
        this.operationIndex = 0
        this.file = null
    }

    checkIfLocked(desiredOperationIndex){
        // if (this.lock || this.operationIndex !== desiredOperationIndex) {
        //     console.error('Prevented file operation colision. File operation unsuccessfull')
        //     return true
        // }
        return false
    }

    getEntry(find) {
        if (this.checkIfLocked(1)) return this
        this.result = find(this.content)
        return this.result
    }

    getFromFile (fileName) {
        return new Promise((res, rej) => {
            const content = fs.readFileSync(fileName, 'utf8');
            if (content.trim() === '') {
                return res([])
            }
            const contentAsJson = JSON.parse(content)
            return res(contentAsJson)
        })
    }

    async createFileIfNotExist (fileName) {
        return new Promise((res) => {
            const doesFileExist = fs.existsSync(fileName)
            if (doesFileExist) {
                res('File already exists')
                return
            }
            fs.appendFileSync(fileName, JSON.stringify([]))
            res('Created')
        })
    }

    async loadContentFromFile (fileName) {
        await this.createFileIfNotExist(fileName)
        this.content = await this.getFromFile(fileName)
        this.fileName = fileName
        return this
    }

    async writeFile () {
        return new Promise(((res) => {
            fs.writeFileSync(this.fileName, JSON.stringify(this.content))
            res('content saved')
        }).bind(this))
    }

    addToContent(newContent){
        if (this.checkIfLocked(1)) return this
        this.operationIndex++
        this.content = [...this.content, newContent]
        return this
    }

    updateEntry(findIndex, objectToMerge) {
        if (this.checkIfLocked(1)) return this
        this.operationIndex++
        const indexOfObjectToModify = findIndex(this.content)
        this.content[indexOfObjectToModify] = { ...this.content[indexOfObjectToModify], ...objectToMerge }
        return this
    }

    removeKeysFromEntry(findIndex, keysToRemove) {
        if (this.checkIfLocked(1)) return this
        this.operationIndex++
        const indexOfObjectToModify = findIndex(this.content)
        keysToRemove.forEach((key) => {
            delete this.content[indexOfObjectToModify][key]
        })
        return this
    }

    deleteContent(findIndex) {
        if (this.checkIfLocked(1)) return this
        this.operationIndex++
        const index = findIndex(this.content)
        this.content.splice(index, 1)
        return this
    }

    async saveContent(){
        if (this.checkIfLocked(2)) return this
        this.operationIndex++
        await this.writeFile()
        return this
    }

    clean() {
        this.operationIndex = 0
        this.lock = false
        this.fileName = null
        this.content = null
        return this
    }
}

const fileOperator = new FileOperator()

const get = async (fileName, findCallback) => {
    const result = await fileOperator
        .loadContentFromFile(fileName)
        .then((operatorInstance) =>
            operatorInstance.getEntry(findCallback)
            // fileOperator.getEntry(findCallback)
        )
        
    await fileOperator.clean()
    return result
}

const add = async (fileName, content) => {
    try {
        await fileOperator
        .loadContentFromFile(fileName)
        .then(() => fileOperator.addToContent(content))
        .then(fileOperator.saveContent.bind(fileOperator))
        .then(fileOperator.clean.bind(fileOperator))
    } catch (e) {
        console.error(e)
    }
}

const update = async (fileName, findIndexCallback, newContent) => {
    try {
        await fileOperator
        .loadContentFromFile(fileName)
        .updateEntry(findIndexCallback, newContent)
        .saveContent()
        .clean()
    } catch (e) {
        console.error(e)
    }
}

const removeKeys = async (fileName, findIndexCallback, keys) => {
    try {
        await fileOperator
        .loadContentFromFile(fileName)
        .removeKeysFromEntry(findIndexCallback, keys)
        .saveContent()
        .clean()
    } catch (e) {
        console.error(e)
    }
}

const remove = async (fileName, findIndexCallback) => {
    try {
        await fileOperator
            .loadContentFromFile(fileName)
            .deleteContent(findIndexCallback)
            .saveContent()
            .clean()
    } catch (e) {
        console.error(e)
    }
}

module.exports = { add, remove, removeKeys, update, get }
