const styles = new CSSStyleSheet();
styles.replaceSync(/* css */`
    header {
        background-color: var(--primary-color, blue);
        color: var(--primary-contrast-color, white);
        padding: 16px;
        text-align: center;
        display: flex;
        align-items: center;
    }

    h2 {
        margin: 0;
        font-size: 24px;
        
        a {
            color: var(--primary-contrast-color, white);
            text-decoration: none;
        }
    }

    p {
        margin: 4px 0 0 20px;
        font-size: 14px;
    }
`);

const template = document.createElement("template");
template.innerHTML = /* html */`
    <header>
        <h2><a href="/">Fabrica</a></h2>
        <p>Reusable html components</p>
    </header>
`;
export class SiteHeader extends HTMLElement {
    static define(tagName = "site-header") {
        customElements.define(tagName, this)
    }
    shadowRoot = this.attachShadow({ mode: "open" });

    connectedCallback() {
        this.shadowRoot.adoptedStyleSheets = [styles]
        this.shadowRoot.replaceChildren(template.content.cloneNode(true))
    }
}

SiteHeader.define()