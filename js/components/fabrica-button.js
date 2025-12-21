const styles = new CSSStyleSheet()
styles.replaceSync(/* css */`
    [part="button"] {
        display: inline-block;
        padding: var(--button-padding);
        border: none;
        border-radius: var(--button-border-radius);
        background-color: var(--button-color);
        color: var(--button-contrast-color);
        font-size: var(--button-font-size);
        cursor: pointer;
        transition: all 0.3s;
        text-decoration: none;

        &:hover,
        &:active {
            background-color: var(--button-color-hover);
        }

        &[disabled] {
            opacity: 0.6;
            cursor: not-allowed;

            &:hover,
            &:active {
                text-decoration: none;
                background-color: var(--primary-color, blue);
                color: var(--primary-contrast-color, white);
            }
        }

        &[size="small"] {
            padding: var(--button-padding-small);
            font-size: var(--button-font-size-small);
        }

        &[size="large"] {
            padding: var(--button-padding-large);
            font-size: var(--button-font-size-large);
        }
    }

    [part="button"][type="outlined"] {
        background-color: transparent;
        border: 2px solid var(--primary-color, blue);
        color: var(--primary-color, blue);

        &[disabled]:hover,
        &[disabled]:active {
            border-color: var(--primary-color, blue);
            color: var(--primary-color, blue);
            background-color: transparent;
        }
    }

    [part="button"][type="outlined"]:hover {
        border-color: var(--accent-color, navy);
        color: var(--accent-color, navy);
    }

    [part="button"][type="outlined"]:active {
        border-color: var(--accent-color, navy);
        color: var(--primary-contrast-color, white);
    }

    [part="button"][type="text"] {
        background-color: transparent;
        color: var(--primary-color, blue);
        padding: 0;

        &[disabled]:hover,
        &[disabled]:active {
            color: var(--primary-color, blue);
            background-color: transparent;
            text-decoration: none;

            [part="label"] {
                color: var(--primary-color, blue);
                background-color: transparent;
                text-decoration: none;
            }
        }   
    }

    [part="button"][type="text"]:hover {
        [part="label"] {
            text-decoration: underline;
            color: var(--accent-color, navy);
        }
    }

    [part="button"][type="text"]:active {
        background-color: var(--primary-color-dark, navy);
        color: var(--primary-contrast-color, white);
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

export class FabricaButton extends HTMLElement {
    static define(tagName = "fabrica-button") {
        customElements.define(tagName, this)
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
                console.log(`FabricaButton: dispatching custom click event '${clickEventName}'`)
                this.dispatchEvent(new CustomEvent(clickEventName, {
                    bubbles: true,
                    composed: true,
                }))
            }
        })
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

FabricaButton.define()
