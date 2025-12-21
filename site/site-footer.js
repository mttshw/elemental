const styles = new CSSStyleSheet();
styles.replaceSync(/* css */`
    footer {
        background-color: var(--primary-color, blue);
        color: var(--primary-contrast-color, white);
        padding: 16px;
        text-align: center;
    }

    p {
        margin: 4px 0 0 0;
        font-size: 10px;
    }
`);

const template = document.createElement("template");
template.innerHTML = /* html */`
    <footer>
        <p>&copy; Fabrica 2026</p>
    </footer>
`;
export class SiteFooter extends HTMLElement {
    static define(tagName = "site-footer") {
        customElements.define(tagName, this)
    }
    shadowRoot = this.attachShadow({ mode: "open" });

    connectedCallback() {
        this.shadowRoot.adoptedStyleSheets = [styles]
        this.shadowRoot.replaceChildren(template.content.cloneNode(true))
    }
}

SiteFooter.define()