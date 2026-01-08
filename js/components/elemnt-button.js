const styles = new CSSStyleSheet()
styles.replaceSync(/* css */`
    [part="button"] {
        display: inline-block;
        padding: var(--elemnt-button-padding);
        border: none;
        border-radius: var(--elemnt-button-border-radius);
        background-color: var(--elemnt-button-color);
        color: var(--elemnt-button-contrast-color);
        font-size: var(--elemnt-button-font-size);
        cursor: pointer;
        transition: all 0.3s;
        text-decoration: none;
        border: var(--elemnt-button-border-width) solid var(--elemnt-button-color, blue);

        &:hover,
        &:active {
            background-color: var(--elemnt-button-color-hover);
            border-color: var(--elemnt-button-color-hover);
        }

        &[disabled] {
            opacity: 0.6;
            cursor: not-allowed;

            &:hover,
            &:active {
                text-decoration: none;
                background-color: var(--elemnt-button-color);
                color: var(--elemnt-button-contrast-color);
            }
        }

        &[size="small"] {
            padding: var(--elemnt-button-padding-small);
            font-size: var(--elemnt-button-font-size-small);
        }

        &[size="large"] {
            padding: var(--elemnt-button-padding-large);
            font-size: var(--elemnt-button-font-size-large);
        }
    }

    [part="button"][type="outlined"] {
        background-color: transparent;
        border: var(--elemnt-button-border-width) solid var(--elemnt-button-color, blue);
        color: var(--elemnt-button-color, blue);

        &[disabled]:hover,
        &[disabled]:active {
            border-color: var(--elemnt-button-color, blue);
            color: var(--elemnt-button-color, blue);
            background-color: transparent;
        }
    }

    [part="button"][type="outlined"]:hover,
    [part="button"][type="outlined"]:active,
    [part="button"][type="outlined"]:focus {
        border-color: var(--elemnt-button-color-hover);
        color: var(--elemnt-button-color-hover);
    }


    [part="button"][type="text"] {
        background-color: transparent;
        color: var(--elemnt-button-color);
        padding: 0;
        border: transparent;

        &[disabled]:hover,
        &[disabled]:active {
            color: var(--elemnt-button-color);
            background-color: transparent;
            text-decoration: none;

            [part="label"] {
                color: var(--elemnt-button-color);
                background-color: transparent;
                text-decoration: none;
            }
        }   
    }

    [part="button"][type="text"]:hover,
    [part="button"][type="text"]:focus {
        [part="label"] {
            text-decoration: underline;
            color: var(--elemnt-button-color-hover);
        }
    }

    :host-context(elemnt-button-group) [part="button"] {
        border-radius: 0;
    }

    :host([in-group]) [part="button"] {
        border-radius: 0;
    }
    :host([in-group]):not(:host([first-in-group])) [part="button"] {
        margin-left: calc(-1 * var(--elemnt-button-border-width));
    }
    :host([first-in-group]) [part="button"] {
        border-top-left-radius: var(--elemnt-button-border-radius);
        border-bottom-left-radius: var(--elemnt-button-border-radius);
    }
    :host([last-in-group]) [part="button"] {
        border-top-right-radius: var(--elemnt-button-border-radius);
        border-bottom-right-radius: var(--elemnt-button-border-radius);
    }

    slot[name="start"]::slotted(*),
    slot[name="end"]::slotted(*) {
        display: inline-block;
        height: var(--elemnt-button-font-size);
        width: var(--elemnt-button-font-size);
    }

`)

const template = document.createElement("template")
template.innerHTML = /* html */`
    <button part="button">
        <slot name="start"></slot>
        <span part="label"><slot></slot></span>
        <slot name="end"></slot>
    </button>
`

export class elemntButton extends HTMLElement {
    static define(tagName = "elemnt-button") {
        customElements.define(tagName, this)
    }

    static get observedAttributes() {
        return ["type", "size"]; // Watch for changes to "type" and "size"
    }
    
    shadowRoot = this.attachShadow({ mode: "open" });

    connectedCallback() {
        this.shadowRoot.adoptedStyleSheets = [styles]
        this.shadowRoot.replaceChildren(template.content.cloneNode(true))
        // find the default inner element (template renders a <button> by default)
        let inner = this.shadowRoot.querySelector('[part="button"]')


        this.checkAs(inner);

        
        // forward a custom click event name from the host if provided
        inner.addEventListener('click', (ev) => {
            if (this.hasAttribute('disabled')) {
                // prevent action when disabled (anchors need manual prevention)
                ev.preventDefault()
                ev.stopImmediatePropagation()
                return
            }

            const clickEventName = this.clickEvent
            if (clickEventName) {
                console.log(`elemntButton: dispatching custom click event '${clickEventName}'`)
                this.dispatchEvent(new CustomEvent(clickEventName, {
                    bubbles: true,
                    composed: true,
                }))
            }
        })
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            const inner = this.shadowRoot.querySelector('[part="button"]');
            if (!inner) return;
            if (name === "type") {
                inner.setAttribute("type", newValue || "");
            } else if (name === "size") {
                if (newValue) {
                    inner.setAttribute("size", newValue);
                } else {
                    inner.removeAttribute("size");
                }
            }
        }
    }

    checkAs(inner) {
        const isLink = (this.as || '').toLowerCase() === 'link'

        if (isLink) {
            // create an anchor to replace the default button
            const a = document.createElement('a')
            a.setAttribute('part', 'button')
            // copy label/slots
            a.innerHTML = inner.innerHTML
            // copy link attributes
            a.setAttribute('href', this.href || '#')
            if (this.hasAttribute('target')) a.setAttribute('target', this.getAttribute('target'))
            if (this.hasAttribute('rel')) a.setAttribute('rel', this.getAttribute('rel'))
            // reflect the visual "type" for styling (e.g. [type="text"]) 
            a.setAttribute('type', this.type || 'link')
            
            // if disabled, reflect via aria-disabled
            if (this.hasAttribute('disabled')) a.setAttribute('aria-disabled', 'true')

            inner.replaceWith(a)
            inner = a
        } else {
            // keep the button and apply button-specific props
            inner.setAttribute('type', this.type || '')
            inner.disabled = this.hasAttribute('disabled')
        }

        if (this.hasAttribute('size')) {
            inner.setAttribute('size', this.size)
        }

    }

    get clickEvent() {
        return this.getAttribute("click-event");
    }

    get href() {
        return this.getAttribute("href");
    }

    get as() {
        return this.getAttribute("as");
    }

    get type() {
        return this.getAttribute("type");
    }

    get size() {
        return this.getAttribute("size");
    }
}

elemntButton.define()
