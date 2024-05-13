class CustomTextEditor extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .editor {
                    border: 1px solid #ccc;
                    padding: 5px;
                    min-height: 1000px;
                    font-family: Arial, sans-serif;
                    color: #CCCCCC;
                    line-height: 1.5;
                    white-space: pre-wrap;
                    outline: none;
                    background-color: navy;
                }
                .keyword {
                    color: purple;
                }
                .function {
                    color: blue;
                }
                .string {
                    color: green;
                }
            </style>
            <div id="editor" contenteditable="true" class="editor"></div>
            <button id="highlightButton">Highlight Keywords</button>
        `;
        this.editor = this.shadowRoot.getElementById('editor');
        this.highlightButton = this.shadowRoot.getElementById('highlightButton');
        this.highlightButton.addEventListener('click', () => this.highlightKeywords());
        this.editor.addEventListener('keydown', (event) => this.handleKeyPress(event));
    }
    moveCursorLeft() {
        const selection = window.getSelection();
        selection.modify("move", "backward", "character");
    }
    
    
    handleKeyPress(event) {
        if (event.key === '(') {
            document.execCommand('insertText', false, '()');
            event.preventDefault();
            this.moveCursorLeft();
        } else if (event.key === '{') {
            document.execCommand('insertText', false, '{}');
            event.preventDefault();
            this.moveCursorLeft();
        } else if (event.key === '[') {
            document.execCommand('insertText', false, '[]');
            event.preventDefault();
            this.moveCursorLeft();
        } else if (event.key === '"') {
            document.execCommand('insertText', false, '""');
            event.preventDefault();
            this.moveCursorLeft();
        } else if (event.key === "'") {
            document.execCommand('insertText', false, "''");
            event.preventDefault();
            this.moveCursorLeft();
        } else if (event.key === '`') {
            document.execCommand('insertText', false, '``');
            event.preventDefault();
            this.moveCursorLeft();
        } else if (event.key === 'Tab') {
            document.execCommand('insertText', false, '    ');
            event.preventDefault();
        } else if (event.key === 'Enter') {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);
            const node = range.startContainer;
            const text = node.textContent;
            const offset = range.startOffset;
            const textBeforeCursor = text.substring(0, offset);
            const textAfterCursor = text.substring(offset);
            const parenthesesBefore = textBeforeCursor.lastIndexOf('(');
            const parenthesesAfter = textAfterCursor.indexOf(')');
            console.log(parenthesesBefore)
            console.log(offset)
            console.log(parenthesesAfter)
        }
    }
    
    
    
    
    

    

    highlightKeywords() {
        const keywords = [
            "abstract", "arguments", "await", "boolean", "break", "byte", "case", "catch", "char", "class",
            "const", "continue", "debugger", "default", "delete", "do", "double", "else", "enum", "eval",
            "export", "extends", "false", "final", "finally", "float", "for", "function", "goto", "if",
            "implements", "import", "in", "instanceof", "int", "interface", "let", "long", "native", "new",
            "null", "package", "private", "protected", "public", "return", "short", "static", "super", "switch",
            "synchronized", "this", "throw", "throws", "transient", "true", "try", "typeof", "var", "void",
            "volatile", "while", "with", "yield"
        ];
    
        let content = this.editor.innerText;
    
        let highlightedContent = '';
        const words = content.split(/\b/);
        words.forEach(word => {
            if (keywords.includes(word)) {
                highlightedContent += `<span class="keyword">${word}</span>`;
            } else {
                highlightedContent += word;
            }
        });
    
        const beforeParenthesesRegex = /\b\w+(?=\()/g;
        highlightedContent = highlightedContent.replace(beforeParenthesesRegex, '<span class="function">$&</span>');
    
        const stringRegex = /(["'])(?:(?=(\\?))\2.)*?\1(?![^<]*>|[^<>]*<\/)/g;
        highlightedContent = highlightedContent.replace(stringRegex, '<span class="string">$&</span>');
    
        const tempElement = document.createElement('div');
        tempElement.innerHTML = highlightedContent;
    
        this.editor.innerHTML = '';
    
        while (tempElement.firstChild) {
            this.editor.appendChild(tempElement.firstChild);
        }
    
        this.editor.focus();
    }
}

customElements.define('custom-text-editor', CustomTextEditor);

