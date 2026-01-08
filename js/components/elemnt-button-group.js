const styles = new CSSStyleSheet();
styles.replaceSync(/* css */`
    :host {
        display: inline-flex;
    }

    [part="buttons"] {
        display: inline-flex;
        gap: 0; /* Remove gaps between buttons */
    }

    ::slotted(elemnt-button[in-group]) {
        position: relative;
        z-index: 1;
    }
    ::slotted(elemnt-button[in-group]:hover) {
        z-index: 2; /* Bring hovered button to front */
    }

`);

const template = document.createElement("template");
template.innerHTML = /* html */`
    <div part="buttons">
        <slot></slot>
    </div>
`;

export class ElemntButtonGroup extends HTMLElement {
    static define(tagName = "elemnt-button-group") {
        customElements.define(tagName, this);
    }

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.adoptedStyleSheets = [styles];
        this.shadowRoot.appendChild(template.content.cloneNode(true));

        this.querySelectorAll('elemnt-button').forEach((button, index, buttons) => {
            if (index === 0) {
                button.setAttribute('first-in-group', '');
            }
            if (index === buttons.length - 1) {
                button.setAttribute('last-in-group', '');
            }
            button.setAttribute('in-group', '');

            if( this.type ) {
                button.setAttribute('type', this.type)
            }

            if( this.size ) {
                button.setAttribute('size', this.size)
            }
        });

      
    }

    get type() {
        return this.getAttribute("type");
    }

    get size() {
        return this.getAttribute("size");
    }
}

ElemntButtonGroup.define();