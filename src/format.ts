'use strict'
import { EOL } from 'os'

const reBegin = new RegExp(/^(begin|declare)/, "i")
const reConditions = new RegExp(/^(if|#if|evaluate|when)/, "i")
const reElse = new RegExp(/^(else|#else)/, "i")
const reEnd = new RegExp(/^(end|#end|break)/, "i")
const reComments = new RegExp(/^!/)
const reBeginSelect = new RegExp(/^(begin-select)/, "i")
const reSQLKeyWords = new RegExp(/^(from|where|and|or|order|group|having)/, "i")
const reEndSelect = new RegExp(/^(end-select)/, "i")

let beginSelectBlock: boolean = false
let beginSelectClause: boolean = false
let clausePart: string = ''
let indendLevel: number = 0
let formattedDoc: Array<string> = []

const pushToFormattedDoc = line => formattedDoc.push(line)
const incrementIndend = () => indendLevel++
const decrementIndend = () => {
    indendLevel--
    if (indendLevel < 0) {
        indendLevel = 0
    }
}

const formattedLine = (ln: string, level: number) => {
    //console.log(level, ln)
    return (' '.repeat(level * 4) + ln)
}

const formatWhereClause = (whereClause: string) => {
    let whereClauseWords = whereClause.split(' ')
    whereClauseWords.forEach(word => {
        if (word.trim().length > 0) {
            pushToFormattedDoc(word)
        }
    })
}

const formatLine = (line: string) => {

    if (beginSelectBlock) {
        if (line.substring(0, 1) === ' ') {
            beginSelectBlock = false
        } else {
            pushToFormattedDoc(line.trim())
            return
        }
    }

    line = line.trim()
    switch (true) {
        case reComments.test(line):
            // DO NOT INDEND 
            //console.log('comment')
            break
        case reBeginSelect.test(line):
            line = EOL + line
            beginSelectBlock = true
            //console.log('BeginSelect')
            break
        case reSQLKeyWords.test(line):
            beginSelectClause = true
            console.log('where -> ', line)
            clausePart = clausePart + ' ' + line
            break
        case reEndSelect.test(line):
            line = line + EOL
            beginSelectBlock = false
            beginSelectClause = false
            formatWhereClause(clausePart)
            //console.log('EndnSelect')
            break
        case reBegin.test(line):
            line = EOL + formattedLine(line, indendLevel)
            incrementIndend()
            //console.log('begin')
            break
        case reEnd.test(line):
            decrementIndend()
            line = formattedLine(line, indendLevel) + EOL
            //console.log('end')
            break
        case reConditions.test(line):
            line = EOL + formattedLine(line, indendLevel)
            incrementIndend()
            break
        case reElse.test(line):
            decrementIndend()
            line = formattedLine(line, indendLevel)
            incrementIndend()
            break
        default:
            line = formattedLine(line, indendLevel)
        //console.log('default')
    }

    if (!beginSelectClause) {
        pushToFormattedDoc(line)
    }
    return
}

const formatDoc = (docLines: Array<string>) => {
    docLines.forEach(formatLine)
    return formattedDoc
}

const format = (doc: string) => {
    console.log('Begin Format . . . ')
    let docLines: Array<string> = doc.split(EOL)
    docLines = docLines.filter((l) => (l.trim().length > 0))
    formattedDoc = []
    return formatDoc(docLines).join(EOL)
}

export default format