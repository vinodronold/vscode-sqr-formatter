'use strict'
import {
    ExtensionContext,
    DocumentFormattingEditProvider,
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

class SQRDocumentFormatter implements DocumentFormattingEditProvider {

    provideDocumentFormattingEdits = (document: TextDocument): TextEdit[] | Thenable<TextEdit[]> => {
        let originText: string = document.getText()
        let formattedText: string = format(originText)
        let textEdits: TextEdit[] = []
        const range = getRange(document)
        let reformated = TextEdit.replace(range, formattedText)
        textEdits.push(reformated)

        return textEdits
    }
}

export const activate = (context: ExtensionContext) => {
    let disposableFormatDoc = languages.registerDocumentFormattingEditProvider(['sqr'], new SQRDocumentFormatter())
    context.subscriptions.push(disposableFormatDoc)
}

export const deactivate = () => {
    console.log('SQR Formatting Extension Deactivated. :(')
}