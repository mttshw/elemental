const styles = new CSSStyleSheet()
styles.replaceSync(/* css */`
    nav {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 16px;
        border: 1px solid var(--elemnt-menu-border-color, #ddd);
        border-radius: var(--elemnt-border-radius, 4px);
        background-color: var(--elemnt-menu-background-color, #fafafa);
    }

    :host([orientation="horizontal"]) {
        nav {
            flex-direction: row;
        }
    }

    :host([alignment="right"]) {
        nav {
            justify-content: flex-end;
        }
    }
    :host([alignment="right"][orientation="vertical"]) {
        nav {
            align-items: flex-end;
        }
    }
    :host([alignment="center"]) {
        nav {
            justify-content: center;
        }
    }
    :host([alignment="center"][orientation="vertical"]) {
        nav {
            align-items: center;
        }
    }

    :host([width="content"]) {
        max-width: fit-content;
        display: inline-block;
    }

    ::slotted(a),
    ::slotted(button) {
        text-decoration: none;
        color: var(--primary-color, blue);
        font-weight: 500;
        padding: 8px;
        border-radius: 4px;
        transition: background-color 0.3s;
        display: inline-block;
        border: 0;
        background: none;
        font: inherit;
        cursor: pointer;
        text-align: left;
    }
    ::slotted(a:hover),
    ::slotted(button:hover),
    ::slotted(a:focus),
    ::slotted(button:focus) {
        background-color: rgba(0, 0, 255, 0.1);
        text-decoration: underline;
    }

    ::slotted(a[disabled]),
    ::slotted(button[disabled]) {
        opacity: 0.6;
        cursor: not-allowed;
    }
    ::slotted(a[disabled]:hover),
    ::slotted(button[disabled]:hover),
    ::slotted(a[disabled]:focus),
    ::slotted(button[disabled]:focus) {
        background-color: transparent;
        text-decoration: none;
    }


`)  

const template = document.createElement("template")
template.innerHTML = /* html */`
    <nav>
        <slot></slot>
    </nav>
`

export class ElemntMenu extends HTMLElement {
    static define(tagName = "elemnt-menu") {
        customElements.define(tagName, this)
    }
    shadowRoot = this.attachShadow({ mode: "open" });

    connectedCallback() {
        this.shadowRoot.adoptedStyleSheets = [styles]
        this.shadowRoot.replaceChildren(template.content.cloneNode(true))
    }

    get orientation() {
        return this.getAttribute("orientation");
    }

    get width() {
        return this.getAttribute("width");
    }

    get align() {
        return this.getAttribute("align");
    }
}

ElemntMenu.define()
