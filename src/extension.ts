'use strict'
import {
    ExtensionContext,
    DocumentFormattingEditProvider,
    DocumentRangeFormattingEditProvider,
    Range,
    Position,
    TextDocument,
    TextEdit,
    languages
} from 'vscode'

import format from './format'

const getRange = (document: TextDocument): Range => {
    let start: Position = new Position(0, 0)
    let endLine = document.lineCount - 1
    let end: Position = new Position(endLine, document.lineAt(endLine).text.length)
    return new Range(start, end)
}

const formattingEdits = (document: TextDocument, range: Range): TextEdit[] | Thenable<TextEdit[]> => {
    console.log('Begin Format . . . ')
    let originText: string = document.getText(range)
    let formattedText: string = format(originText)
    let textEdits: TextEdit[] = []
    //const range = getRange(document)
    let reformated = TextEdit.replace(range, formattedText)
    textEdits.push(reformated)
    return textEdits
}

class SQRDocumentFormatter implements DocumentFormattingEditProvider {
    provideDocumentFormattingEdits = (document: TextDocument): TextEdit[] | Thenable<TextEdit[]> => {
        return formattingEdits (document, getRange(document))
    }
}

class SQRDocumentRangeFormatter implements DocumentRangeFormattingEditProvider {
    provideDocumentRangeFormattingEdits = formattingEdits
}

export const activate = (context: ExtensionContext) => {
    let disposableFormatDoc = languages.registerDocumentFormattingEditProvider(['sqr'], new SQRDocumentFormatter())
    context.subscriptions.push(disposableFormatDoc)
    let disposableRangeFormatDoc = languages.registerDocumentRangeFormattingEditProvider(['sqr'], new SQRDocumentRangeFormatter())
    context.subscriptions.push(disposableRangeFormatDoc)
}

export const deactivate = () => {
    console.log('SQR Formatting Extension Deactivated. :(')
}